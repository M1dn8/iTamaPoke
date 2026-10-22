#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
CXX=${CXX:-g++}
for tool in node python3 "$CXX"; do command -v "$tool" >/dev/null || { echo "Fehlendes Testwerkzeug: $tool" >&2; exit 1; }; done
for test in tests/package-ci-perf.test.js tests/package-e3.test.js tests/package-e2-name.test.js tests/package-e2-size.test.js tests/package-e2.test.js tests/package-e.test.js tests/package-d3b.test.js tests/package-d3.test.js tests/package-d2.test.js tests/package-d1.test.js tests/package-a.test.js tests/package-b.test.js tests/package-c1-ui.test.js tests/package-c2-ui.test.js tests/package-c4-ui.test.js tests/package-c5-ui.test.js tests/package-c5-theme.test.js; do
  echo "Pruefe $test"; node "$test"
done
for file in browser_ver/web/*.js; do node --check "$file"; done
compile_run(){ local name=$1; shift; "$CXX" -O2 -std=c++17 -I browser_ver/core/shim -I upstream-expanded "$@" -o "$TMP/$name"; "$TMP/$name"; }
compile_run a upstream-expanded/pet.cpp tests/package_a.cpp
compile_run c1 upstream-expanded/pet.cpp tests/package-c1.cpp
"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/pet.cpp browser_ver/core/browser_expeditions.cpp tests/package-c2.cpp -o "$TMP/c2"
"$TMP/c2"
"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/battle.cpp upstream-expanded/i18n.cpp browser_ver/core/browser_minigames.cpp tests/package-c3.cpp -o "$TMP/c3"
"$TMP/c3"
"$TMP/c3" --chart > "$TMP/chart.json"
C3_TYPE_CHART="$TMP/chart.json" node tests/package-c3.test.js
compile_run c4 upstream-expanded/pet.cpp tests/package-c4.cpp
compile_run c5 upstream-expanded/pet.cpp tests/package-c5.cpp
"$TMP/c5" --json > "$TMP/journal.json"
python3 -c 'import json,sys; json.load(open(sys.argv[1]))' "$TMP/journal.json"


"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/pet.cpp upstream-expanded/battle.cpp browser_ver/core/browser_mega.cpp tests/package-e.cpp -o "$TMP/e"
"$TMP/e"
"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/pet.cpp upstream-expanded/battle.cpp upstream-expanded/i18n.cpp tests/package-e-battle.cpp -o "$TMP/e-battle"
"$TMP/e-battle"



"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/pet.cpp upstream-expanded/battle.cpp browser_ver/core/browser_mega.cpp tests/package-e2.cpp -o "$TMP/e2"
"$TMP/e2" --json > "$TMP/e2-native.json"
E2_NATIVE_JSON="$TMP/e2-native.json" node tests/package-e2.test.js
"$TMP/e2"
"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/pet.cpp upstream-expanded/battle.cpp upstream-expanded/i18n.cpp tests/package-e2-battle.cpp -o "$TMP/e2-battle"
"$TMP/e2-battle"
"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/pet.cpp upstream-expanded/battle.cpp browser_ver/core/browser_mega.cpp tests/package-e3.cpp -o "$TMP/e3"
"$TMP/e3"
"$TMP/e3" --json > "$TMP/e3-native.json"
E3_NATIVE_JSON="$TMP/e3-native.json" node tests/package-e3.test.js
"$CXX" -O2 -std=c++17 -I tests/c2_wasm_stub -I browser_ver/core/shim -I upstream-expanded upstream-expanded/pet.cpp upstream-expanded/battle.cpp upstream-expanded/i18n.cpp tests/package-e3-battle.cpp -o "$TMP/e3-battle"
"$TMP/e3-battle"
echo "Alle zentralen Logik-/Oberflaechen-Vorpruefungen erfolgreich."
