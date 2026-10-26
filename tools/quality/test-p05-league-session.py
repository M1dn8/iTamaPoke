#!/usr/bin/env python3
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[2]

def main():
    configured=os.environ.get("CXX")
    compiler=shlex.split(configured) if configured else []
    if not compiler:
        found=shutil.which("clang++") or shutil.which("g++")
        if not found:
            raise SystemExit("No C++ compiler found")
        compiler=[found]
    with tempfile.TemporaryDirectory(prefix="p05-league-session-") as directory:
        executable=Path(directory)/"league-session"
        subprocess.run(compiler+[
            "-O2","-std=c++17",
            "-I","browser_ver/core",
            "-I","browser_ver/core/shim",
            "-I","upstream-expanded",
            "upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "tests/package-p05-league-session.cpp",
            "-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([str(executable)],cwd=ROOT,check=True)

if __name__=="__main__":
    main()
