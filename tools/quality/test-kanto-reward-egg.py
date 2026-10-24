#!/usr/bin/env python3
import json,os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
 with tempfile.TemporaryDirectory(prefix='reward-egg-') as directory:
  exe=Path(directory)/'reward'
  subprocess.run([os.environ.get('CXX','g++'),'-O2','-std=c++17','-DTP_REWARD_EGG_TEST','-DTP_F4_LIFE_TEST','-I','tests/c2_wasm_stub','-I','browser_ver/core/shim','-I','upstream-expanded','upstream-expanded/pet.cpp','upstream-expanded/battle.cpp','upstream-expanded/i18n.cpp','tests/package-kanto-reward-egg.cpp','-o',str(exe)],cwd=str(ROOT),check=True)
  subprocess.run([str(exe)],cwd=str(ROOT),check=True)
  catalog=json.loads(subprocess.check_output([str(exe),'--catalog'],cwd=str(ROOT),text=True))
  expected=json.loads((ROOT/'tools/browser-tests/fixtures/kanto-reward-catalog.json').read_text())
  if catalog['candidates']!=expected:raise RuntimeError('Gift catalog differs from actual native egg rules')
 subprocess.run(['node','tests/package-kanto-reward-egg.test.js'],cwd=str(ROOT),check=True)
if __name__=='__main__':main()
