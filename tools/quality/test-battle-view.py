#!/usr/bin/env python3
import json,os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
 with tempfile.TemporaryDirectory(prefix='battle-view-') as d:
  exe=Path(d)/'view'
  subprocess.run([os.environ.get('CXX','g++'),'-O2','-std=c++17','-DTP_LG_TEST','-I','tests/c2_wasm_stub','-I','browser_ver/core/shim','-I','upstream-expanded','upstream-expanded/pet.cpp','upstream-expanded/battle.cpp','upstream-expanded/i18n.cpp','tests/package-battle-view.cpp','-o',str(exe)],cwd=str(ROOT),check=True)
  subprocess.run([str(exe)],cwd=str(ROOT),check=True)
  v=json.loads(subprocess.check_output([str(exe),'--json'],cwd=str(ROOT),text=True))
  if v['playerLevel']!=50 or v['form']!=2 or v['shiny']!=1 or v['nick']!='Stahl & <Zwei>':raise RuntimeError('Native battle snapshot JSON mismatch')
 subprocess.run(['node','tests/package-battle-view.test.js'],cwd=str(ROOT),check=True)
if __name__=='__main__':main()
