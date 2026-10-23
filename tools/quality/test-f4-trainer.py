#!/usr/bin/env python3
"""Cross-language fixtures only; no third-party modules or downloaded media."""
import importlib.util,os,struct,subprocess,tempfile,zlib,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[2]
def chunk(kind,b):return struct.pack('>I',len(b))+kind+b+struct.pack('>I',zlib.crc32(kind+b)&0xffffffff)
def main():
 spec=importlib.util.spec_from_file_location('trainer_packer',ROOT/'tools/pack-trainer-bin.py');p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
 png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',1,1,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(bytes([0,70,120,90,255])))+chunk(b'IEND',b'')
 with tempfile.TemporaryDirectory(prefix='f4-trainer-') as directory:
  d=Path(directory);(d/'owned.png').write_bytes(png)
  for id in p.IDS:(d/('trainer-kanto-'+id+'.bin')).write_bytes(p.build(id,png,{'author':'Synthetic test author','source':'https://example.invalid/owned','license':'Fixture only','changes':''}))
  for bad in [png[:-1],b'not png',png[:30]+b'X'+png[31:]]:
   try:p.png_check(bad)
   except ValueError:pass
   else:raise AssertionError('invalid PNG accepted')
  command=['python3',str(ROOT/'tools/pack-trainer-bin.py'),'--leader','rocko','--input',str(d/'owned.png'),'--output-dir',str(d/'out')]
  subprocess.run(command,cwd=str(ROOT),check=True);target=d/'out/trainer-kanto-rocko.bin';old=target.read_bytes();again=subprocess.run(command,capture_output=True,cwd=str(ROOT));assert again.returncode!=0 and target.read_bytes()==old
  env=dict(os.environ,TP_TRAINER_FIXTURES=str(d))
  for test in ['tests/package-f4-trainer-bin.test.js','tests/package-f4-rights-badges.test.js']:subprocess.run(['node',test],cwd=str(ROOT),env=env,check=True)
if __name__=='__main__':main()
