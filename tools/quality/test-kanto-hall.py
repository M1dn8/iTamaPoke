#!/usr/bin/env python3
import json,os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
 with tempfile.TemporaryDirectory(prefix='kanto-hall-') as directory:
  exe=Path(directory)/'hall'
  subprocess.run([os.environ.get('CXX','g++'),'-O2','-std=c++17','-DTP_LG_TEST','-DTP_HALL_TEST','-I','tests/c2_wasm_stub','-I','browser_ver/core/shim','-I','upstream-expanded','upstream-expanded/pet.cpp','upstream-expanded/battle.cpp','upstream-expanded/i18n.cpp','tests/package-kanto-hall.cpp','-o',str(exe)],cwd=str(ROOT),check=True)
  subprocess.run([str(exe)],cwd=str(ROOT),check=True)
  generated=json.loads(subprocess.check_output([str(exe),'--fixture'],cwd=str(ROOT),text=True))
  expected=json.loads((ROOT/'tools/browser-tests/fixtures/kanto-hall.json').read_text(encoding='utf-8'))
  if generated!=expected:raise RuntimeError('Browserfixture stimmt nicht mit echter nativer Hall-Serialisierung ueberein')
 subprocess.run(['node','tests/package-kanto-hall.test.js'],cwd=str(ROOT),check=True)
if __name__=='__main__':main()
