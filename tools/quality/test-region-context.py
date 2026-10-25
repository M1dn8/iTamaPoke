#!/usr/bin/env python3
"""Actual arena/league readers with explicit region contexts; no WASM required."""
from pathlib import Path
import json,os,shlex,shutil,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[2]
def main():
 compiler=shlex.split(os.environ.get("CXX") or shutil.which("clang++") or shutil.which("g++") or "")
 if not compiler or not shutil.which(compiler[0]):raise SystemExit("Vorhandener C++-Compiler fehlt.")
 with tempfile.TemporaryDirectory(prefix="itamapoke-region-context-") as folder:
  exe=Path(folder)/"region-context"
  command=compiler+["-O2","-std=c++17","-DTP_LG_TEST","-I","tests/c2_wasm_stub","-I","browser_ver/core/shim","-I","upstream-expanded","upstream-expanded/pet.cpp","upstream-expanded/battle.cpp","upstream-expanded/i18n.cpp","tests/package-region-context.cpp","-o",str(exe)]
  subprocess.run(command,cwd=ROOT,check=True);subprocess.run([str(exe)],cwd=ROOT,check=True)
  rows=[json.loads(x) for x in subprocess.check_output([str(exe),"--json"],cwd=ROOT,text=True).splitlines()]
  assert len(rows)==2
  assert rows[0]["region"]==0 and rows[0]["index"]==1 and rows[0]["format"]==1 and rows[0]["playable"]==1
  assert rows[1]["region"]==1 and rows[1]["index"]==7 and rows[1]["format"]==2 and rows[1]["playable"]==1
  assert all(r["supported"]==1 and r["hasRun"]==1 for r in rows)
  print("Regional progress JSON passed: independent saved indices, frozen Kanto format and available Johto UI flag.")
 return 0
if __name__=="__main__":raise SystemExit(main())
