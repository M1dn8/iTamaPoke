#!/usr/bin/env python3
from pathlib import Path
import os
import shlex
import shutil
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[2]

def main():
    compiler=shlex.split(
        os.environ.get("CXX") or shutil.which("clang++")
        or shutil.which("g++") or ""
    )
    if not compiler:
        raise SystemExit("No C++ compiler found")
    with tempfile.TemporaryDirectory(prefix="p06-admission-store-") as folder:
        folder=Path(folder)
        pending=folder/"pending.json"
        empty=folder/"empty.json"
        env=os.environ.copy()
        env["P06_ADMISSION_PENDING_FIXTURE"]=str(pending)
        env["P06_ADMISSION_EMPTY_FIXTURE"]=str(empty)
        subprocess.run([
            "node","tests/package-p06-admission-store.test.js"
        ],cwd=ROOT,env=env,check=True)
        executable=folder/"admission-store"
        subprocess.run(compiler+[
            "-O2","-std=c++17",
            "-I","tests/c2_wasm_stub","-I","browser_ver/core/shim",
            "-I","upstream-expanded",
            "upstream-expanded/pet.cpp","upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "browser_ver/core/browser_collection_store.cpp",
            "tests/package-p06-admission-store.cpp",
            "-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([
            str(executable),str(pending),str(empty)
        ],cwd=ROOT,check=True)

if __name__=="__main__":
    main()
