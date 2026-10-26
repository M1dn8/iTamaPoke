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
    with tempfile.TemporaryDirectory(prefix="p05-league-start-") as directory:
        executable=Path(directory)/"league-start"
        subprocess.run(compiler+[
            "-O2","-std=c++17",
            "-DTP_LG_TEST","-DTP_LGT_TEST","-DTP_BATTLE_ENERGY_TEST",
            "-DTP_HALL_TEST",
            "-I","tests/c2_wasm_stub",
            "-I","browser_ver/core",
            "-I","browser_ver/core/shim",
            "-I","upstream-expanded",
            "upstream-expanded/pet.cpp",
            "upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "browser_ver/core/browser_collection_store.cpp",
            "browser_ver/core/browser_hall.cpp",
            "tests/package-p05-league-start.cpp",
            "-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([str(executable)],cwd=ROOT,check=True)

if __name__=="__main__":
    main()
