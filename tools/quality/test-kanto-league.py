#!/usr/bin/env python3
import os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
 with tempfile.TemporaryDirectory(prefix='kanto-league-') as temp:
  exe=Path(temp)/'league'
  subprocess.run([os.environ.get('CXX','g++'),'-O2','-std=c++17','-DTP_LG_TEST','-I','tests/c2_wasm_stub','-I','browser_ver/core/shim','-I','upstream-expanded','upstream-expanded/pet.cpp','upstream-expanded/battle.cpp','upstream-expanded/i18n.cpp','tests/package-kanto-league.cpp','-o',str(exe)],cwd=str(ROOT),check=True)
  subprocess.run([str(exe)],cwd=str(ROOT),check=True)
 subprocess.run(['node','tests/package-kanto-league.test.js'],cwd=str(ROOT),check=True)
if __name__=='__main__':main()
