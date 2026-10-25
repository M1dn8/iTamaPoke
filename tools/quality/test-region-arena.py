#!/usr/bin/env python3
"""Native region-owned arena sessions and actual energy/store transactions."""
from pathlib import Path
import os,shlex,shutil,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[2]
def main():
 compiler=shlex.split(os.environ.get("CXX") or shutil.which("clang++") or shutil.which("g++") or "")
 if not compiler or not shutil.which(compiler[0]):raise SystemExit("Vorhandener C++-Compiler fehlt.")
 with tempfile.TemporaryDirectory(prefix="itamapoke-region-arena-") as folder:
  exe=Path(folder)/"regional-arena"
  command=compiler+["-O2","-std=c++17","-DTP_LG_TEST","-DTP_BATTLE_ENERGY_TEST","-I","tests/c2_wasm_stub","-I","browser_ver/core/shim","-I","upstream-expanded","upstream-expanded/pet.cpp","upstream-expanded/battle.cpp","upstream-expanded/i18n.cpp","browser_ver/core/browser_collection_store.cpp","tests/package-region-arena.cpp","-o",str(exe)]
  subprocess.run(command,cwd=ROOT,check=True);subprocess.run([str(exe)],cwd=ROOT,check=True)
 return 0
if __name__=="__main__":raise SystemExit(main())
