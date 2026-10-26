#!/usr/bin/env python3
"""P05b native result transaction and JS model/controller integration."""
from pathlib import Path
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]

def main():
    subprocess.run([
        sys.executable,"-I","tools/quality/test-p05-arena-team.py"
    ],cwd=ROOT,check=True)
    subprocess.run([
        "node","tests/package-p05-arena-result.test.js"
    ],cwd=ROOT,check=True)

if __name__=="__main__":
    main()
