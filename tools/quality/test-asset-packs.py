#!/usr/bin/env python3
import base64,hashlib,importlib.util,json,re,struct,subprocess,sys,tempfile
sys.dont_write_bytecode=True
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
 # Private asset packages must never enter the publishable web tree.
 for asset in (ROOT/'browser_ver/web').rglob('*.bin'):
  with asset.open('rb') as f:signature=f.read(4)
  if signature==b'TPAK' or re.fullmatch(r'grafikpaket-\d+\.bin',asset.name,re.I):raise RuntimeError('Privates Grafikpaket im Webordner: '+str(asset))
 spec=importlib.util.spec_from_file_location('packs',ROOT/'tools/assets/create-asset-packs.py');p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
 with tempfile.TemporaryDirectory(prefix='asset-pack-test-') as td:
  root=Path(td);source=root/'mons';source.mkdir();raw=bytes([84,80,75,50,1,1,0,0,0,0,1,1,1,40,0,0]);(source/'p1.bin').write_bytes(raw);(source/'ps001.bin').write_bytes(raw);(source/'notes.bin').write_bytes(b'not graphic')
  out,report=p.build(source,root/'out');assert report['files']==2 and report['ignored_bin_names']==1
  data=(out/report['packages'][0]['name']).read_bytes();magic,ver,flags,ml,pl,count,digest,reserved=struct.unpack('<4sHHIII32s12s',data[:64]);assert (magic,ver,flags,count,reserved)==(b'TPAK',1,0,2,b'\0'*12);manifest=data[64:64+ml];assert hashlib.sha256(manifest).digest()==digest;items=json.loads(manifest)['entries'];assert items[0]['name']=='p001.bin';assert len(data)==64+ml+pl
  for e in items:assert hashlib.sha256(data[64+ml+e['offset']:64+ml+e['offset']+e['size']]).hexdigest()==e['sha256']
  assert (source/'p1.bin').read_bytes()==raw
  try:p.build(source,out)
  except RuntimeError:pass
  else:raise AssertionError('existing output overwritten')
  (source/'p001.bin').write_bytes(b'different')
  try:p.build(source,root/'bad')
  except RuntimeError:pass
  else:raise AssertionError('different canonical duplicate accepted')
  (source/'p001.bin').unlink();(source/'large.bin').write_bytes(b'ignored');assert p.canonical('trainer-kanto-rocko.bin')=='trainer-kanto-rocko.bin';assert p.canonical('p006-mega-x.bin')=='p006-mega-x.bin';assert p.canonical('ps376-mega.bin')=='ps376-mega.bin';assert p.canonical('p1026.bin') is None;assert p.canonical('p376-mega-x.bin') is None
  gitdir=root/'git-output';gitdir.mkdir();subprocess.run(['git','init',str(gitdir)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True)
  try:p.build(source,gitdir/'forbidden')
  except RuntimeError as e:assert 'Repository' in str(e)
  else:raise AssertionError('asset bundles written into Git')
  large=root/'large';large.mkdir()
  for name in ['p001.bin','ps001.bin']:
   with (large/name).open('wb') as f:
    for _ in range(9):f.write(bytes(1048576))
  limited,limited_report=p.build(large,root/'limited',16)
  assert len(limited_report['packages'])==2
  assert all(e['bytes']<17*1048576 for e in limited_report['packages'])
  # Cross-language parity through the actual JS bundle reader, not only a second encoder.
  script="const fs=require('fs');global.crypto=require('crypto').webcrypto;global.TPStoreTools=require('./browser_ver/web/storage-tools.js');global.TPTrainerArt=require('./browser_ver/web/trainer-art.js');const P=require('./browser_ver/web/asset-packs.js');const b=fs.readFileSync(process.argv[1]);P.prepare([{name:'grafikpaket-001.bin',size:b.length,slice:(a,z)=>new Blob([b.subarray(a,z)])}]).then(async x=>{for(const f of x.files)TPStoreTools.inspectSprite(await f.arrayBuffer());console.log('Python->actual JS reader parity passed');}).catch(e=>{console.error(e);process.exit(1);});"
  subprocess.run(['node','-e',script,str(out/report['packages'][0]['name'])],cwd=ROOT,check=True)
 subprocess.run(['node','tests/asset-packs.test.js'],cwd=ROOT,check=True)
 print('Pack producer passed: source preservation, canonical rules, SHA/header parity, existing-output/duplicate refusal; no source artwork in tests.')
if __name__=='__main__':main()
