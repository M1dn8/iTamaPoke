#!/usr/bin/env python3
"""Synthetic cross-language fixtures; no downloaded media."""
import importlib.util
import os
import struct
import subprocess
import sys
import tempfile
import zlib
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]

def chunk(kind, data):
    return (
        struct.pack(">I", len(data)) + kind + data
        + struct.pack(">I", zlib.crc32(kind + data) & 0xffffffff)
    )

def main():
    spec = importlib.util.spec_from_file_location(
        "trainer_packer", ROOT / "tools/pack-trainer-bin.py"
    )
    packer = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(packer)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes([0, 70, 120, 90, 255])))
        + chunk(b"IEND", b"")
    )
    with tempfile.TemporaryDirectory(prefix="f4-trainer-") as directory:
        dest = Path(directory)
        (dest / "owned.png").write_bytes(png)
        for leader in packer.ALL_IDS:
            prefix = "trainer-kanto-" if leader in packer.IDS else "trainer-"
            metadata = {
                "author": "Synthetic test author",
                "source": "https://example.invalid/owned",
                "license": "Fixture only",
                "changes": "",
            }
            (dest / (prefix + leader + ".bin")).write_bytes(
                packer.build(leader, png, metadata)
            )

        for bad in [png[:-1], b"not png", png[:30] + b"X" + png[31:]]:
            try:
                packer.png_check(bad)
            except ValueError:
                pass
            else:
                raise AssertionError("invalid PNG accepted")

        command = [
            sys.executable, str(ROOT / "tools/pack-trainer-bin.py"),
            "--leader", "rocko",
            "--input", str(dest / "owned.png"),
            "--output-dir", str(dest / "out"),
        ]
        subprocess.run(command, cwd=ROOT, check=True)
        target = dest / "out/trainer-kanto-rocko.bin"
        previous = target.read_bytes()
        again = subprocess.run(command, cwd=ROOT, capture_output=True)
        assert again.returncode != 0 and target.read_bytes() == previous

        env = dict(os.environ, TP_TRAINER_FIXTURES=str(dest))
        for test in [
            "tests/package-f4-trainer-bin.test.js",
            "tests/package-f4-trainer-v2.test.js",
            "tests/package-f4-rights-badges.test.js",
        ]:
            subprocess.run(["node", test], cwd=ROOT, env=env, check=True)

if __name__ == "__main__":
    main()
