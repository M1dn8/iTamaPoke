#!/usr/bin/env python3
from pathlib import Path
import os
import json
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
        raise SystemExit("Vorhandener C++-Compiler fehlt.")
    with tempfile.TemporaryDirectory(prefix="p06-mew-access-") as folder:
        executable=Path(folder)/"mew-access"
        subprocess.run(compiler+[
            "-O2","-std=c++17","-DTP_HALL_TEST",
            "-I","tests/c2_wasm_stub","-I","browser_ver/core/shim",
            "-I","browser_ver/core","-I","upstream-expanded",
            "upstream-expanded/pet.cpp","upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "browser_ver/core/browser_collection_store.cpp",
            "browser_ver/core/browser_hall.cpp",
            "tests/package-p06-mew-access.cpp",
            "-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([str(executable)],cwd=ROOT,check=True)
        exported=json.loads(subprocess.check_output(
            [str(executable),"--review-fixtures"],cwd=ROOT,text=True
        ))
        if [row["mask"] for row in exported]!=[3,1,7]:
            raise RuntimeError("Unerwartete Review-Variantenmasken")
        if [row["access"] for row in exported]!=[0,0,1]:
            raise RuntimeError("Unerwartete native Review-Freischaltungen")
        for row in exported:
            raw=bytes.fromhex(row["hex"])
            if raw[:3]!=b"LHK" or raw[3]!=row["version"]:
                raise RuntimeError("Ungueltige native Hall-Reviewdaten")
        expected=ROOT/"tools/browser-tests/fixtures/p06-mew-hall.json"
        if expected.is_file():
            saved=json.loads(expected.read_text(encoding="utf-8"))
            if saved!=exported:
                raise RuntimeError("Versionierte Hall-Testfixture ist veraltet")
        target=os.environ.get("P06_MEW_REVIEW_HALL_FIXTURES")
        if target:
            with Path(target).open("x",encoding="utf-8") as handle:
                json.dump(exported,handle,indent=2)
        print("Native Mew review data passed: two variants locked, "
              "three same-variant wins locked, all three variants unlocked.")

if __name__=="__main__":
    main()
