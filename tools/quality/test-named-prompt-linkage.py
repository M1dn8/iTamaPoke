#!/usr/bin/env python3
"""Actual named-prompt bodies with simulated Pet/translation dependencies."""
from pathlib import Path
import os
import re
import shlex
import shutil
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[2]

def main():
    source=(ROOT/"browser_ver/core/browser_glue.cpp").read_text(
        encoding="utf-8"
    )
    build=(ROOT/"browser_ver/build.sh").read_text(encoding="utf-8")
    signature='extern "C++" std::string TPNamedPrompt(StrId id) {'
    if source.count(signature)!=1:
        raise RuntimeError("Internal prompt helper lacks explicit C++ linkage")
    if "-Werror=return-type-c-linkage" not in build:
        raise RuntimeError("WASM build does not enforce the linkage diagnostic")
    if "-Wno-return-type-c-linkage" in build:
        raise RuntimeError("Linkage diagnostic must not be suppressed")

    start=source.index('namespace {\n'+signature)
    end=source.index("} // namespace",start)+len("} // namespace")
    helper=source[start:end]
    wrappers=[]
    for name in ["tp_farewell_button_text","tp_runaway_button_text"]:
        pattern=(
            r"EMSCRIPTEN_KEEPALIVE\s+const char \*"
            +re.escape(name)+r"\(\)\s*\{[^}]*\}"
        )
        found=re.findall(pattern,source)
        if len(found)!=1:
            raise RuntimeError("Export body not uniquely found: "+name)
        wrappers.append(found[0])

    prefix=r"""
#include <cassert>
#include <cstdio>
#include <cstring>
#include <string>
#define EMSCRIPTEN_KEEPALIVE
struct PetStub {char nick[24]{};int speciesId=151;};
PetStub gPet;
enum StrId {S_FAREWELL_BTN,S_RUNAWAY_BTN};
std::string farewellFormat="Farewell, %s";
const char *T(StrId id){
 return id==S_FAREWELL_BTN?farewellFormat.c_str():"Stay, %s";
}
const char *dexName(int id){return id==151?"Mew":"Bulbasaur";}
"""
    behavior=r"""
void exerciseNamedPrompt(){
 gPet.speciesId=1;
 assert(std::string(tp_farewell_button_text())=="Farewell, Bulbasaur");
 std::strcpy(gPet.nick,"Atlas");
 const char *farewell=tp_farewell_button_text();
 assert(std::string(farewell)=="Farewell, Atlas");
 assert(std::string(tp_runaway_button_text())=="Stay, Atlas");
 assert(std::string(farewell)=="Farewell, Atlas");

 std::strcpy(gPet.nick,"Äöü");
 assert(std::string(tp_farewell_button_text())=="Farewell, Äöü");
 assert(std::string(tp_runaway_button_text())=="Stay, Äöü");

 std::memset(gPet.nick,'A',23);gPet.nick[23]=0;
 assert(std::string(tp_farewell_button_text())==
  std::string("Farewell, ")+std::string(23,'A'));

 farewellFormat=std::string(80,'X')+" %s";
 assert(std::string(tp_farewell_button_text())==std::string(63,'X'));
 assert(std::string(tp_runaway_button_text())==
  std::string("Stay, ")+std::string(23,'A'));
}
"""
    unit=(
        prefix+'\nextern "C" {\n'+helper+'\n'
        +'\n'.join(wrappers)+'\n}\n'+behavior
    )
    driver=r"""
#include <cassert>
#include <string>
extern "C" const char *tp_farewell_button_text();
extern "C" const char *tp_runaway_button_text();
void exerciseNamedPrompt();
int main(){
 assert(std::string(tp_farewell_button_text())=="Farewell, Mew");
 assert(std::string(tp_runaway_button_text())=="Stay, Mew");
 exerciseNamedPrompt();
}
"""
    compiler=shlex.split(
        os.environ.get("CXX") or shutil.which("clang++")
        or shutil.which("g++") or ""
    )
    if not compiler:
        raise SystemExit("Vorhandener C++-Compiler fehlt.")
    version=subprocess.run(
        compiler+["--version"],capture_output=True,text=True,check=True
    )
    clang="clang" in (version.stdout+version.stderr).lower()
    flags=["-O2","-std=c++17"]
    if clang:
        flags.append("-Werror=return-type-c-linkage")

    with tempfile.TemporaryDirectory(prefix="named-prompt-linkage-") as folder:
        folder=Path(folder)
        actual=folder/"actual.cpp"
        calls=folder/"caller.cpp"
        executable=folder/"named-prompt"
        actual.write_text(unit,encoding="utf-8")
        calls.write_text(driver,encoding="utf-8")

        subprocess.run(
            compiler+flags+[str(actual),str(calls),"-o",str(executable)],
            check=True
        )
        subprocess.run([str(executable)],check=True)

        if clang:
            negative=folder/"old-linkage.cpp"
            negative.write_text(
                unit.replace(
                    signature,"std::string TPNamedPrompt(StrId id) {"
                ),encoding="utf-8"
            )
            rejected=subprocess.run(
                compiler+flags+["-fsyntax-only",str(negative)],
                capture_output=True,text=True
            )
            if rejected.returncode==0 or \
                    "return-type-c-linkage" not in rejected.stderr:
                raise RuntimeError("Old C-linkage declaration was not rejected")

    print(
        "Named prompt linkage passed: actual helper/export bodies, "
        "separate C-linkage caller, species fallback, nickname/UTF-8, "
        "independent static output buffers and unchanged truncation."
    )
    print(
        "Clang negative diagnostic control: "+
        ("passed" if clang else
         "not run with this native compiler; strict WASM build follows")
    )

if __name__=="__main__":
    main()
