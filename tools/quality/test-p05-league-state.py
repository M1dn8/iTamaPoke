#!/usr/bin/env python3
"""P05c isolated team-run codec and independent little-endian wire check."""
from pathlib import Path
import os
import shlex
import shutil
import struct
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[2]

def reference():
    data=bytearray(b"LTK\x01"+bytes([2,0,0,0,2]))
    data+=struct.pack("<IIIHBBBB",100,1,540,150,100,100,100,0)
    for ident,dex,name in [
        (100,150,'Care'),(101,25,'Blitz "Zwei"')
    ]:
        nick=name.encode("utf-8")
        data+=struct.pack(
            "<IHBHHHBBBBHHBBBB",
            ident,dex,30,100,400,100,1,0,0,0,
            580,580,5,0,0,len(nick)
        )
        data+=nick
    checksum=2166136261
    for value in data:
        checksum=((checksum^value)*16777619)&0xffffffff
    data+=struct.pack("<I",checksum)
    return bytes(data)

def main():
    compiler=shlex.split(
        os.environ.get("CXX")
        or shutil.which("clang++")
        or shutil.which("g++")
        or ""
    )
    if not compiler or not shutil.which(compiler[0]):
        raise SystemExit("Vorhandener C++-Compiler fehlt.")
    with tempfile.TemporaryDirectory(prefix="p05-league-state-") as folder:
        executable=Path(folder)/"league-state"
        subprocess.run(compiler+[
            "-O2","-std=c++17",
            "-I","browser_ver/core/shim",
            "-I","upstream-expanded",
            "upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "tests/package-p05-league-state.cpp",
            "-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([str(executable)],cwd=ROOT,check=True)
        actual=bytes.fromhex(subprocess.check_output(
            [str(executable),"--hex"],cwd=ROOT,text=True
        ).strip())
        if actual!=reference():
            raise SystemExit("Liga-Team-Wireformat weicht von Python-Referenz ab.")
        print("P05c league-state independent Python wire check passed.")
        environment=os.environ.copy()
        environment["P05_LEAGUE_STATE_NATIVE_HEX"]=actual.hex()
        subprocess.run([
            "node","tests/package-p05-league-state.test.js"
        ],cwd=ROOT,env=environment,check=True)

if __name__=="__main__":
    main()
