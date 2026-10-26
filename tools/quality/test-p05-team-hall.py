#!/usr/bin/env python3
from pathlib import Path
import json
import os
import shlex
import shutil
import struct
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[2]

def crc(data):
    value=2166136261
    for byte in data:
        value=((value^byte)*16777619)&0xffffffff
    return struct.pack("<I",value)

def terminal_wire(s):
    assert s["phase"]==1 and s["index"]==26
    members=s["members"]
    assert 1<=len(members)<=6
    assert len({m["id"] for m in members})==len(members)
    assert sum(m["wins"] for m in members)==26
    assert members[s["active"]]["hp"]>0
    b=bytearray(b"LT"+(b"K" if s["region"]==0 else b"J")+b"\x01")
    b+=bytes([s["phase"],s["variant"],s["index"],s["active"],len(members)])
    c=s["care"]
    b+=struct.pack("<IIIHBBBB",c["id"],c["life"],c["age"],c["dex"],
                   c["geneAtk"],c["geneDef"],c["geneSpe"],c["shiny"])
    for m in members:
        nick=m["nick"].encode("utf-8")
        assert len(nick)<=23 and 0<=m["rests"]<=5
        b+=struct.pack("<IHBHHHBBBBHHBBBB",
            m["id"],m["dex"],m["level"],m["atk"],m["def"],m["spe"],
            m["type1"],m["type2"],m["form"],m["shiny"],
            m["maxHp"],m["hp"],m["rests"],m["wins"],
            m["levelGains"],len(nick))
        b+=nick
    return bytes(b+crc(b))

def hall_wire(h,region):
    b=bytearray(b"LH"+(b"K" if region==0 else b"J")+b"\x02")
    b+=struct.pack("<IBIBIB",h["wins"],h["variants"],h["seen"],
                   h["legacy"],h["legacyDate"],len(h["records"]))
    for r in h["records"]:
        team=r.get("team")
        b+=bytes([int(team is not None)])
        nick=r["nick"].encode("utf-8")
        b+=struct.pack("<IHBBBIIBB",
            r["sequence"],r["dex"],r["level"],r["shiny"],r["form"],
            r["life"],r["date"],r["variant"],len(nick))
        b+=nick
        if team is not None:
            payload=terminal_wire(team)
            assert r["winnerId"]==team["members"][team["active"]]["id"]
            b+=struct.pack("<H",len(payload))+payload
    return bytes(b+crc(b))

def main():
    compiler=shlex.split(
        os.environ.get("CXX") or shutil.which("clang++")
        or shutil.which("g++") or ""
    )
    if not compiler:
        raise SystemExit("No C++ compiler found")
    with tempfile.TemporaryDirectory(prefix="p05-team-hall-") as directory:
        executable=Path(directory)/"team-hall"
        subprocess.run(compiler+[
            "-O2","-std=c++17","-DTP_HALL_TEST",
            "-I","tests/c2_wasm_stub","-I","browser_ver/core",
            "-I","browser_ver/core/shim","-I","upstream-expanded",
            "upstream-expanded/pet.cpp","upstream-expanded/battle.cpp",
            "upstream-expanded/i18n.cpp",
            "browser_ver/core/browser_collection_store.cpp",
            "browser_ver/core/browser_hall.cpp",
            "tests/package-p05-team-hall.cpp","-o",str(executable)
        ],cwd=ROOT,check=True)
        subprocess.run([str(executable)],cwd=ROOT,check=True)
        fixture=json.loads(subprocess.check_output(
            [str(executable),"--fixture"],cwd=ROOT,text=True
        ))
        for region,key in enumerate(["kanto","johto"]):
            assert hall_wire(fixture[key],region).hex()==fixture[key+"Hex"]
        assert "team" not in fixture["kanto"]["records"][0]
        assert fixture["kanto"]["records"][1]["winnerId"]==102
        assert fixture["johto"]["records"][0]["team"]["care"]["id"]==100
        print("P05c independent Python Hall V2 wire check passed: mixed "
              "single/team records, nested terminal bytes, UTF-8, "
              "separate regional markers and both checksums.")

if __name__=="__main__":
    main()
