#!/usr/bin/env python3
import os
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def main():
    with tempfile.TemporaryDirectory(prefix="p05-level-") as folder:
        executable = Path(folder) / "level"
        subprocess.run([
            os.environ.get("CXX", "g++"),
            "-O2", "-std=c++17",
            "-I", "tests/c2_wasm_stub",
            "-I", "browser_ver/core/shim",
            "-I", "upstream-expanded",
            "upstream-expanded/pet.cpp",
            "upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "tests/package-p05-level.cpp",
            "-o", str(executable),
        ], cwd=ROOT, check=True)
        subprocess.run([str(executable)], cwd=ROOT, check=True)
    subprocess.run(
        ["node", "tests/package-p05-level.test.js"],
        cwd=ROOT, check=True
    )

if __name__ == "__main__":
    main()
