#!/usr/bin/env python3
import json,os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
 with tempfile.TemporaryDirectory(prefix='battle-energy-') as tmp:
  exe=Path(tmp)/'energy'
  subprocess.run([os.environ.get('CXX','g++'),'-O2','-std=c++17','-DTP_BATTLE_ENERGY_TEST','-DTP_LG_TEST','-I','tests/c2_wasm_stub','-I','browser_ver/core/shim','-I','upstream-expanded','upstream-expanded/pet.cpp','upstream-expanded/battle.cpp','upstream-expanded/i18n.cpp','browser_ver/core/browser_collection_store.cpp','tests/package-battle-energy.cpp','-o',str(exe)],cwd=str(ROOT),check=True)
  subprocess.run([str(exe)],cwd=str(ROOT),check=True)
  generated=json.loads(subprocess.check_output([str(exe),'--champ'],cwd=str(ROOT),text=True))
  expected=json.loads((ROOT/'tools/browser-tests/fixtures/energy-champion.json').read_text())
  if generated!=expected:raise RuntimeError('Champion fixture differs from actual league checkpoint codec')
 subprocess.run(['node','tests/package-battle-energy.test.js'],cwd=str(ROOT),check=True)
if __name__=='__main__':main()
