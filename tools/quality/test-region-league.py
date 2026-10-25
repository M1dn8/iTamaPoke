#!/usr/bin/env python3
"""Real regional league/Hall transactions; independent legacy Hall wire-format check."""
from pathlib import Path
import json,os,shlex,shutil,struct,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[2]
def encode_hall(v,marker):
 data=bytearray(b"LH"+marker.encode()+b"\x01")
 data+=struct.pack("<IBIBIB",v["wins"],v["variants"],v["seen"],v["legacy"],v["legacyDate"],len(v["records"]))
 for r in v["records"]:
  nick=r["nick"].encode("utf-8")
  data+=struct.pack("<IHBBBIIBB",r["sequence"],r["dex"],r["level"],r["shiny"],r["form"],r["life"],r["date"],r["variant"],len(nick));data+=nick
 h=2166136261
 for value in data:h=((h^value)*16777619)&0xffffffff
 return bytes(data+struct.pack("<I",h))
def main():
 compiler=shlex.split(os.environ.get("CXX") or shutil.which("clang++") or shutil.which("g++") or "")
 if not compiler or not shutil.which(compiler[0]):raise SystemExit("Vorhandener C++-Compiler fehlt.")
 with tempfile.TemporaryDirectory(prefix="itamapoke-region-league-") as folder:
  exe=Path(folder)/"regional-league"
  command=compiler+["-O2","-std=c++17","-DTP_LG_TEST","-DTP_BATTLE_ENERGY_TEST","-DTP_HALL_TEST","-I","tests/c2_wasm_stub","-I","browser_ver/core/shim","-I","upstream-expanded","upstream-expanded/pet.cpp","upstream-expanded/battle.cpp","upstream-expanded/i18n.cpp","browser_ver/core/browser_collection_store.cpp","browser_ver/core/browser_hall.cpp","tests/package-region-league.cpp","-o",str(exe)]
  subprocess.run(command,cwd=ROOT,check=True);subprocess.run([str(exe)],cwd=ROOT,check=True)
  v=json.loads(subprocess.check_output([str(exe),"--json"],cwd=ROOT,text=True))
  assert v["kanto"]["records"][0]["nick"]=="Kanto-Sieger"
  assert v["johto"]["records"][0]["nick"]=="Johto & <eins>"
  assert v["johto"]["records"][0]["dex"]==376 and v["johto"]["records"][0]["shiny"]==1 and v["johto"]["records"][0]["level"]==100
  assert encode_hall(v["kanto"],"K").hex()==v["kantoHex"]
  assert encode_hall(v["johto"],"J").hex()==v["johtoHex"]
  print("Regional Hall JSON/wire check passed: exact actual winners, frozen Kanto bytes and distinct Johto identity.")
 return 0
if __name__=="__main__":raise SystemExit(main())
