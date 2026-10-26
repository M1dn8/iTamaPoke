#!/usr/bin/env python3
"""P05c individual team checkpoint reconstruction through the actual codec."""
from pathlib import Path
import os
import shlex
import shutil
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[2]

def main():
    compiler=shlex.split(
        os.environ.get("CXX")
        or shutil.which("clang++")
        or shutil.which("g++")
        or ""
    )
    if not compiler or not shutil.which(compiler[0]):
        raise SystemExit("Vorhandener C++-Compiler fehlt.")
    with tempfile.TemporaryDirectory(prefix="p05-league-runtime-") as folder:
        executable=Path(folder)/"league-runtime"
        subprocess.run(compiler+[
            "-O2","-std=c++17",
            "-I","browser_ver/core/shim",
            "-I","upstream-expanded",
            "upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "tests/package-p05-league-runtime.cpp",
            "-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([str(executable)],cwd=ROOT,check=True)

if __name__=="__main__":
    main()
