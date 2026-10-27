#!/usr/bin/env python3
from pathlib import Path
import os
import shlex
import shutil
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[2]

def main():
    subprocess.run(["node","tests/package-journal-unread.test.js"],
                   cwd=ROOT,check=True)
    compiler=shlex.split(
        os.environ.get("CXX") or shutil.which("clang++")
        or shutil.which("g++") or ""
    )
    if not compiler:
        raise SystemExit("No C++ compiler found")
    with tempfile.TemporaryDirectory(prefix="journal-unread-") as folder:
        executable=Path(folder)/"journal-unread"
        subprocess.run(compiler+[
            "-O2","-std=c++17","-DTP_JOURNAL_UNREAD_TEST",
            "-I","tests/c2_wasm_stub","-I","browser_ver/core/shim",
            "-I","upstream-expanded",
            "upstream-expanded/pet.cpp","upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "browser_ver/core/browser_journal.cpp",
            "browser_ver/core/browser_collection_store.cpp",
            "tests/package-journal-unread.cpp",
            "-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([str(executable)],cwd=ROOT,check=True)

if __name__=="__main__":
    main()
