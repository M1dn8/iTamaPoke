#!/usr/bin/env python3
from pathlib import Path
import json,os,shlex,shutil,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[2]
def main():
 compiler=shlex.split(os.environ.get("CXX") or shutil.which("clang++") or shutil.which("g++") or "")
 if not compiler or not shutil.which(compiler[0]):raise SystemExit("Vorhandener C++-Compiler fehlt.")
 node=shutil.which("node")
 if not node:raise SystemExit("Node.js fehlt.")
 with tempfile.TemporaryDirectory(prefix="itamapoke-johto-catalog-") as folder:
  exe=Path(folder)/"johto-catalog";snapshot=Path(folder)/"native.json"
  subprocess.run(compiler+["-O2","-std=c++17","-I","browser_ver/core","tests/package-johto-catalog.cpp","-o",str(exe)],cwd=ROOT,check=True)
  subprocess.run([str(exe)],cwd=ROOT,check=True)
  raw=subprocess.check_output([str(exe),"--json"],cwd=ROOT,text=True);data=json.loads(raw)
  expected=json.loads((ROOT/"tests/fixtures/johto-gs-catalog.json").read_text(encoding="utf-8"))
  assert data=={k:expected[k] for k in ("arena","league")}
  snapshot.write_text(raw,encoding="utf-8")
  subprocess.run([node,"tests/package-johto-catalog.test.js"],cwd=ROOT,env=dict(os.environ,TP_JOHTO_NATIVE=str(snapshot)),check=True)
 return 0
if __name__=="__main__":raise SystemExit(main())
