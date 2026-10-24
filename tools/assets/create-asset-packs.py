#!/usr/bin/env python3
"""Create local size-bounded graphics .bin packages from your own asset folder.
No downloads, artwork distribution, source changes or game-save access.
"""
import argparse,hashlib,json,os,re,shutil,struct,subprocess,sys,uuid
from pathlib import Path
from datetime import datetime,timezone
HEADER=64;MAX_ENTRY=16*1048576;MAX_COUNT=4096;MAX_MANIFEST=1048576
LEADERS=('rocko','misty','major-bob','erika','koga','sabrina','pyro','giovanni')
def canonical(name):
 name=name.lower()
 if name=='thumbs.bin':return name
 m=re.fullmatch(r'trainer-kanto-('+ '|'.join(LEADERS)+r')\.bin',name)
 if m:return name
 m=re.fullmatch(r'(p|ps)(\d{1,4})(-mega(?:-x)?)?\.bin',name)
 if not m:return None
 prefix,number,form=m.groups();dex=int(number)
 if dex<1 or dex>1025:return None
 if form and not ((dex==6 and form=='-mega-x')or(dex in (303,376)and form=='-mega')):return None
 return prefix+str(dex).zfill(3)+(form or '')+'.bin'
def checksum(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for block in iter(lambda:f.read(131072),b''):h.update(block)
 return h.hexdigest()
def collect(folder):
 if not folder.is_dir():raise RuntimeError('Grafikordner fehlt')
 entries={};ignored=0
 for p in sorted(folder.rglob('*')):
  if p.is_symlink():continue
  if not p.is_file() or p.suffix.lower()!='.bin':continue
  key=canonical(p.name)
  if not key:ignored+=1;continue
  size=p.stat().st_size
  if size<1 or size>MAX_ENTRY:raise RuntimeError('Datei leer oder groesser als16MiB: '+str(p))
  sha=checksum(p)
  if key in entries:
   if entries[key]['size']!=size or entries[key]['sha256']!=sha:raise RuntimeError('Unterschiedliche doppelte Grafik: '+key)
   continue
  entries[key]={'name':key,'path':p,'size':size,'sha256':sha}
 if not entries:raise RuntimeError('Keine unterstuetzten Grafik-BINs gefunden')
 if len(entries)>MAX_COUNT:raise RuntimeError('Mehr als4096 Grafiken; Quellordner bitte eingrenzen')
 return list(entries.values()),ignored
def build(folder,output=None,max_mib=32):
 folder=Path(folder).expanduser().resolve()
 if max_mib<16 or max_mib>64:raise RuntimeError('Paketgroesse zwischen16 und64MiB waehlen')
 entries,ignored=collect(folder);limit=max_mib*1048576;groups=[];group=[];used=0
 for e in entries:
  if group and used+e['size']>limit:groups.append(group);group=[];used=0
  group.append(e);used+=e['size']
 if group:groups.append(group)
 if output is None:output=Path.home()/'Downloads'/('iTamaPoke-Grafikpakete-'+datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')+'-'+uuid.uuid4().hex[:6])
 output=Path(output).expanduser().resolve()
 try:output.relative_to(folder)
 except ValueError:pass
 else:raise RuntimeError('Ausgabe muss ausserhalb des Grafikordners liegen')
 probe=output.parent
 while not probe.exists() and probe!=probe.parent:probe=probe.parent
 check=subprocess.run(["git","-C",str(probe),"rev-parse","--show-toplevel"],capture_output=True,text=True)
 if check.returncode==0:raise RuntimeError("Grafikpakete muessen ausserhalb eines Git-Repositorys liegen")
 if output.exists():raise RuntimeError('Ausgabeordner existiert bereits; nichts ueberschrieben')
 output.mkdir(parents=True);report=[]
 try:
  for index,group in enumerate(groups,1):
   offset=0;items=[]
   for e in group:items.append({'name':e['name'],'offset':offset,'size':e['size'],'sha256':e['sha256']});offset+=e['size']
   manifest=json.dumps({'format':'TPAK1','entries':items},ensure_ascii=True,separators=(',',':')).encode()
   if len(manifest)>MAX_MANIFEST:raise RuntimeError('Dateiliste zu gross')
   header=struct.pack('<4sHHIII32s12s',b'TPAK',1,0,len(manifest),offset,len(group),hashlib.sha256(manifest).digest(),b'\0'*12)
   name='grafikpaket-'+str(index).zfill(3)+'.bin';dest=output/name;temporary=output/(name+'.part')
   with temporary.open('xb') as f:
    f.write(header);f.write(manifest)
    for e in group:
     h=hashlib.sha256();written=0
     with e['path'].open('rb') as incoming:
      for block in iter(lambda:incoming.read(131072),b''):f.write(block);h.update(block);written+=len(block)
     if written!=e['size'] or h.hexdigest()!=e['sha256']:raise RuntimeError('Quelldatei beim Packen veraendert: '+e['name'])
    f.flush();os.fsync(f.fileno())
   os.replace(str(temporary),str(dest))
   report.append({'name':name,'files':len(group),'bytes':dest.stat().st_size,'sha256':checksum(dest)})
  info={'format':'TPAK1','files':len(entries),'ignored_bin_names':ignored,'max_payload_mib':max_mib,'packages':report,'note':'Originale Grafikbytes unveraendert. Paket/Datei-SHA geprueft; Sprite/PNG-Inhalt und Dekodierbarkeit prueft die App. Nur eigene Geraete, nicht ins Repository oder auf Pages laden.'}
  (output/'Paketbericht.json').write_text(json.dumps(info,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');return output,info
 except BaseException:
  shutil.rmtree(str(output));raise

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('folder',nargs='?');p.add_argument('--output');p.add_argument('--max-mib',type=int,default=32);a=p.parse_args();folder=a.folder
 try:
  if folder is None:
   if sys.platform!='darwin':raise RuntimeError('Grafikordner als Argument angeben')
   folder=subprocess.check_output(['osascript','-e','POSIX path of (choose folder with prompt "Ordner mit deinen vorhandenen Pokemon- und Trainer-BINs auswaehlen")'],text=True).strip()
  output,info=build(folder,a.output,a.max_mib);print('Erstellt:',output);print(str(info['files'])+' Grafiken in '+str(len(info['packages']))+' Paket(en).');print('Nur die grafikpaket-*.bin auf dein iPhone uebertragen und im aktualisierten Grafikimport waehlen. Originaldateien bleiben unveraendert.')
  return 0
 except (OSError,ValueError,RuntimeError,subprocess.CalledProcessError) as e:print('STOP Grafikpakete: '+str(e),file=sys.stderr);return 2
if __name__=='__main__':sys.exit(main())
