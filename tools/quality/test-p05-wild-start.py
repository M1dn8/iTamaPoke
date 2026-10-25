#!/usr/bin/env python3
import os
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def main():
    with tempfile.TemporaryDirectory(prefix="p05-wild-start-") as folder:
        executable = Path(folder) / "wild-start"
        subprocess.run([
            os.environ.get("CXX", "g++"),
            "-O2", "-std=c++17", "-DTP_F4_CAPTURE_TEST",
            "-I", "tests/c2_wasm_stub",
            "-I", "browser_ver/core/shim",
            "-I", "upstream-expanded",
            "upstream-expanded/pet.cpp",
            "upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "browser_ver/core/browser_collection_store.cpp",
            "tests/package-p05-wild-start.cpp",
            "-o", str(executable),
        ], cwd=ROOT, check=True)
        subprocess.run([str(executable)], cwd=ROOT, check=True)

if __name__ == "__main__":
    main()
