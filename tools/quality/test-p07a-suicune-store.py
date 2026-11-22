#!/usr/bin/env python3
from pathlib import Path
import os,re,shlex,shutil,subprocess,tempfile

ROOT=Path(__file__).resolve().parents[2]

def main():
 node=os.environ.get("TP_REVIEW_NODE") or shutil.which("node")
 if not node:
  raise SystemExit("Node fehlt.")
 compiler=shlex.split(
  os.environ.get("CXX") or shutil.which("clang++")
  or shutil.which("g++") or ""
 )
 if not compiler:
  raise SystemExit("C++-Compiler fehlt.")
 with tempfile.TemporaryDirectory(prefix="p07a-suicune-store-") as folder:
  executable=Path(folder)/"suicune-store"
  subprocess.run(compiler+[
   "-O2","-std=c++17",
   "-I","tests/c2_wasm_stub","-I","browser_ver/core/shim",
   "-I","upstream-expanded",
   "upstream-expanded/pet.cpp","upstream-expanded/battle.cpp",
   "upstream-expanded/i18n.cpp",
   "browser_ver/core/browser_collection_store.cpp",
   "tests/package-p07a-suicune-store.cpp",
   "-o",str(executable)
  ],cwd=ROOT,check=True)
  subprocess.run([str(executable)],cwd=ROOT,check=True)
  result=subprocess.run(
   [str(executable),"--matrix"],cwd=ROOT,
   text=True,capture_output=True,check=True
  )
  matches=re.findall(r"^P07A_MATRIX=([01]{64})$",result.stdout,re.M)
  if len(matches)!=1:
   raise SystemExit("Native Wasserwegmatrix fehlt oder ist nicht eindeutig.")
  check=r"""
const assert=require('node:assert/strict');
const M=require('./browser_ver/web/suicune-source-preview.js');
const bits=process.argv[1];
let index=0,solutions=0;
for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++){
 const solved=M.createRound([a,b,c]).view().solved;
 assert.equal(bits[index++],solved?'1':'0','Wasserstellung '+[a,b,c]);
 if(solved)solutions++;
}
assert.equal(index,64);
assert.equal(solutions,2);
console.log('Alle 64 nativen Abschlussprüfungen stimmen mit dem bestehenden JS-Wasserwegmodell überein; zwei gültige Verbindungen.');
"""
  subprocess.run(
   [node,"-e",check,matches[0]],cwd=ROOT,check=True
  )

if __name__=="__main__":
 main()
