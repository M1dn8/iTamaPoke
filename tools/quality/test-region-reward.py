#!/usr/bin/env python3
"""Regional egg queue, actual Pet birth/hatch and unchanged legacy candidate fixture."""
from pathlib import Path
import json,os,shlex,shutil,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[2]
def main():
 compiler=shlex.split(os.environ.get("CXX") or shutil.which("clang++") or shutil.which("g++") or "")
 if not compiler or not shutil.which(compiler[0]):raise SystemExit("Vorhandener C++-Compiler fehlt.")
 with tempfile.TemporaryDirectory(prefix="itamapoke-region-reward-") as folder:
  exe=Path(folder)/"regional-reward"
  command=compiler+["-O2","-std=c++17","-DTP_REWARD_EGG_TEST","-DTP_F4_LIFE_TEST","-I","tests/c2_wasm_stub","-I","browser_ver/core/shim","-I","upstream-expanded","upstream-expanded/pet.cpp","upstream-expanded/battle.cpp","upstream-expanded/i18n.cpp","browser_ver/core/browser_collection_store.cpp","tests/package-region-reward.cpp","-o",str(exe)]
  subprocess.run(command,cwd=ROOT,check=True);subprocess.run([str(exe)],cwd=ROOT,check=True)
  data=json.loads(subprocess.check_output([str(exe),"--json"],cwd=ROOT,text=True))
  kanto=json.loads((ROOT/"tools/browser-tests/fixtures/kanto-reward-catalog.json").read_text(encoding="utf-8"))
  johto=json.loads((ROOT/"tools/browser-tests/fixtures/johto-reward-candidates.json").read_text(encoding="utf-8"))
  assert data["kanto"]["candidates"]==kanto
  assert data["johto"]["candidates"]==johto and len(johto)==47
  assert all(d in johto for d in [152,155,158,172])
  assert not set([201,243,244,245,249,250,251])&set(johto)
  assert data["kanto"]["canChoose"]==data["johto"]["canChoose"]==1
  assert data["kanto"]["armedRegion"]==data["johto"]["armedRegion"]==-1
  print("Regional egg JSON/candidates passed: frozen Kanto list, 47 Johto base choices including starters, no Unown/legendary/mythical choices and independent deferred claims.")
 return 0
if __name__=="__main__":raise SystemExit(main())
