#!/usr/bin/env python3
"""Test the regional key contract without a WASM build."""
from pathlib import Path
import os,shlex,shutil,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[2]
def main():
 compiler=shlex.split(os.environ.get("CXX") or shutil.which("clang++") or shutil.which("g++") or "")
 if not compiler or not shutil.which(compiler[0]):raise SystemExit("Vorhandener C++-Compiler fehlt.")
 with tempfile.TemporaryDirectory(prefix="itamapoke-region-keys-") as folder:
  exe=Path(folder)/"region-keys"
  command=compiler+["-O2","-std=c++17","-I","browser_ver/core","-I","browser_ver/core/shim","tests/package-region-keys.cpp","-o",str(exe)]
  subprocess.run(command,cwd=ROOT,check=True);subprocess.run([str(exe)],cwd=ROOT,check=True)
 return 0
if __name__=="__main__":raise SystemExit(main())
