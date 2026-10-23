#!/usr/bin/env python3
"""Compile real Pet/store bridge and exact unchanged native save codec excerpt."""
import json,os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
    source=(ROOT/'browser_ver/core/browser_glue.cpp').read_text(encoding='utf-8')
    start='namespace {\nstd::vector<uint8_t> gExportBuf;'
    end='// --- Stat card (profile page) + rename'
    if source.count(start)!=1 or source.count(end)!=1:raise RuntimeError('Savecodec-Ausschnitt nicht eindeutig')
    a=source.index(start);b=source.index(end,a)
    with tempfile.TemporaryDirectory(prefix='f4-store-test-') as folder:
        temp=Path(folder);(temp/'f4-save.inc').write_text(source[a:b],encoding='utf-8');exe=temp/'f4-store'
        command=[os.environ.get('CXX','g++'),'-O2','-std=c++17','-DTP_F4_SAVE_EXCERPT','-I',str(temp),'-I','tests/c2_wasm_stub','-I','browser_ver/core/shim','-I','upstream-expanded','upstream-expanded/pet.cpp','browser_ver/core/browser_collection_store.cpp','tests/package-f4-store.cpp','-o',str(exe)]
        subprocess.run(command,cwd=str(ROOT),check=True)
        subprocess.run([str(exe)],cwd=str(ROOT),check=True)
        snapshot=json.loads(subprocess.check_output([str(exe),'--snapshot'],cwd=str(ROOT),text=True))
        assert snapshot['dex']==376 and snapshot['level']==45 and snapshot['nickname']=='Atlas' and snapshot['shiny'] is True
        assert snapshot['data']['genes']=={'atk':100,'def':105,'spe':95}
        assert snapshot['data']['training']=={'atk':55,'def':23,'spe':14}
        assert 'origin' not in snapshot and 'timestamp' not in snapshot
        env=dict(os.environ,TP_F4_STORE_NATIVE=str(exe))
        subprocess.run(['node','tests/package-f4-store-wire.test.js'],cwd=str(ROOT),env=env,check=True)
    return 0
if __name__=='__main__':raise SystemExit(main())
