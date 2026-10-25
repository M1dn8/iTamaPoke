#!/usr/bin/env python3
"""Local PNG -> TPTR v1. Stdlib only; no download and no rights grant."""
import argparse,hashlib,json,os,struct,subprocess,tempfile,zlib
from pathlib import Path
IDS=['rocko','misty','major-bob','erika','koga','sabrina','pyro','giovanni'];MAX=1048576

EXTRA=['johto-arena-falk', 'johto-arena-kai', 'johto-arena-bianka', 'johto-arena-jens', 'johto-arena-hartwig', 'johto-arena-jasmin', 'johto-arena-norbert', 'johto-arena-sandra', 'kanto-elite-lorelei', 'kanto-elite-bruno', 'kanto-elite-agathe', 'kanto-elite-siegfried', 'kanto-champ-blau', 'johto-elite-willi', 'johto-elite-koga', 'johto-elite-bruno', 'johto-elite-melanie', 'johto-champ-siegfried']
ALL_IDS=IDS+EXTRA

def png_check(b):
 if len(b)<45 or len(b)>MAX or b[:8]!=b'\x89PNG\r\n\x1a\n':raise ValueError('Keine PNG bis 1 MB')
 at=8;first=True;idat=0;ended=False
 while at<len(b):
  if at+12>len(b):raise ValueError('PNG-Chunk abgeschnitten')
  n=struct.unpack('>I',b[at:at+4])[0];stop=at+8+n
  if n>MAX or stop+4>len(b):raise ValueError('PNG-Chunklaenge ungueltig')
  kind=b[at+4:at+8]
  if not all(65<=x<=90 or 97<=x<=122 for x in kind) or zlib.crc32(b[at+4:stop])&0xffffffff!=struct.unpack('>I',b[stop:stop+4])[0]:raise ValueError('PNG-CRC/Chunk ungueltig')
  if first and kind!=b'IHDR':raise ValueError('PNG-IHDR fehlt')
  if kind==b'IHDR':
   if not first or n!=13:raise ValueError('PNG-IHDR ungueltig')
   width,height=struct.unpack('>II',b[at+8:at+16])
   if not 1<=width<=1024 or not 1<=height<=1024:raise ValueError('PNG maximal 1024 x 1024')
  if kind in [b'acTL',b'fcTL',b'fdAT']:raise ValueError('Nur statische PNG erlaubt')
  if kind==b'IDAT':idat+=1
  if kind==b'IEND':
   if n or stop+4!=len(b):raise ValueError('PNG-Ende ungueltig')
   ended=True
  at=stop+4;first=False
 if not idat or not ended:raise ValueError('PNG unvollstaendig')

def build(leader,png,meta):
 png_check(png)
 if set(meta)!=set(['author','changes','license','source']):raise ValueError('Metadatenformat ungueltig')
 for k,v in meta.items():
  if not isinstance(v,str) or len(v.encode('utf-8'))>2048 or '\x00' in v:raise ValueError('Metadaten ungueltig: '+k)
 m=json.dumps(meta,ensure_ascii=False,separators=(',',':')).encode('utf-8')
 if len(m)>8192:raise ValueError('Metadaten zu gross')
 body=b'TPTR'+struct.pack('<HHII',1 if leader in IDS else 2,ALL_IDS.index(leader),len(m),len(png))+m+png
 return body+hashlib.sha256(body).digest()

def main():
 p=argparse.ArgumentParser(description='Leiter-PNG lokal verpacken; keine Nutzungsrechte werden erteilt.')
 p.add_argument('--leader',required=True,choices=ALL_IDS);p.add_argument('--input',required=True);p.add_argument('--output-dir',required=True);p.add_argument('--force',action='store_true')
 for key in ['author','source','license','changes']:p.add_argument('--'+key,default='')
 a=p.parse_args();out=Path(a.output_dir).expanduser().resolve();probe=out
 while not probe.exists():probe=probe.parent
 try:
  r=subprocess.run(['git','-C',str(probe),'rev-parse','--show-toplevel'],capture_output=True,text=True)
  if r.returncode==0:raise ValueError('Medienausgabe muss ausserhalb eines Git-Repositories liegen')
 except FileNotFoundError:pass
 source=Path(a.input).expanduser()
 if source.stat().st_size>MAX:raise ValueError('PNG groesser als 1 MB')
 data=build(a.leader,source.read_bytes(),{k:getattr(a,k) for k in ['author','source','license','changes']});out.mkdir(parents=True,exist_ok=True);target=out/(('trainer-kanto-'+a.leader if a.leader in IDS else 'trainer-'+a.leader)+'.bin')
 if a.force:
  fd,tmp=tempfile.mkstemp(prefix='.trainer-',dir=str(out))
  try:
   with os.fdopen(fd,'wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
   os.replace(tmp,str(target))
  finally:
   if os.path.exists(tmp):os.unlink(tmp)
 else:
  with target.open('xb') as f:f.write(data)
 print('Erstellt:',target);print('Angaben nicht verifiziert; Browser prueft Dekodierbarkeit beim Import.')
if __name__=='__main__':
 try:main()
 except (OSError,ValueError) as e:raise SystemExit('STOP: '+str(e))
