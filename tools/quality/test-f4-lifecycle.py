#!/usr/bin/env python3
import os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
    source=(ROOT/'browser_ver/core/browser_glue.cpp').read_text(encoding='utf-8');start='namespace {\nstd::vector<uint8_t> gExportBuf;';end='// --- Stat card (profile page) + rename'
    if source.count(start)!=1 or source.count(end)!=1:raise RuntimeError('Savecodec nicht eindeutig')
    a=source.index(start);b=source.index(end,a)
    with tempfile.TemporaryDirectory(prefix='f4-life-test-') as folder:
        p=Path(folder);(p/'f4-save.inc').write_text(source[a:b],encoding='utf-8');exe=p/'life'
        subprocess.run([os.environ.get('CXX','g++'),'-O2','-std=c++17','-DTP_F4_LIFE_TEST','-DTP_F4_SAVE_EXCERPT','-I',str(p),'-I','tests/c2_wasm_stub','-I','browser_ver/core/shim','-I','upstream-expanded','upstream-expanded/pet.cpp','browser_ver/core/browser_collection_store.cpp','tests/package-f4-lifecycle.cpp','-o',str(exe)],cwd=str(ROOT),check=True)
        subprocess.run([str(exe)],cwd=str(ROOT),check=True)
        subprocess.run(['node','tests/package-f4-lifecycle-wire.test.js'],cwd=str(ROOT),env=dict(os.environ,TP_F4_LIFE_NATIVE=str(exe)),check=True)
    return 0
if __name__=='__main__':raise SystemExit(main())
