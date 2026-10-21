# D1 - gemeinsame Tests und Veroeffentlichungstor

## Ziel

Abgenommener Stand von main als Basis. Keine Spielregel-/Oberflaechenaenderung.
Einzige kleine Laufzeit-Ergaenzung: schreibgeschuetztes TPAppMenu.ready fuer
zuverlaessiges Warten auf den vollstaendig gestarteten Kern in Browsertests.
Kein neues Menue und keine Spielstandmigration.

## Gemeinsame Tests

bash tools/quality/run-all.sh fuehrt alle bisherigen JS-/nativen A/B/C1-C5-
Pruefungen aus. Temporaere Binaer-/JSON-Dateien in eigenem Temp-Verzeichnis,
sofortiger Abbruch bei Fehler. Native C3-Typentabelle kommt weiterhin aus dem
realen Kampfcode. Bestehende Einzel-Workflows bleiben als Historie erhalten.

Neuer Aufruf Qualitaet pruefen: Push auf Entwicklungsbranches, Pull Request
nach main oder manueller Start. main ruft denselben wiederverwendbaren
Workflow ueber Build (browser) auf. Neue Gate-Datei quality-gate.yml.

## Echte Browser

Chromium und WebKit, mobile Bildschirmgroesse, deutscher Kontext. Echtes
HTML/DOM, IndexedDB und frisch gebautes WASM, keine Attrappen dieser Teile.
Pointer-/Dateiauswahl-/Download-Automation ersetzt keine echte iPhone-Hardware.

Erster Umfang:
- sechs Kacheln, voller Seitenrahmen, Rueckwege und gemeinsame Hintergrundfarbe;
- Dateiauswahl oeffnen und ohne Datei abbrechen;
- lange Tagebuchliste scrollen und nach Reload erhalten;
- Version-1-Export mit >4 KB binaerem Tagebuch, echter lokaler Reset und
  Wiederherstellung ueber die bestehenden Schaltflaechen;
- deutsches Typenspiel, Mehrfachtipp-Sperre und korrektes Spielende;
- warmer Offlinecache in Chromium (WebKit-Offline wird ausdruecklich ausgelassen).

Tests starten ausschliesslich auf 127.0.0.1:8765 in frischen Browserkontexten.
Dateiauswahl bekommt synthetische Buffers, kein Zugriff auf private Dateien.
Keine echte GitHub-Pages-URL, kein echter Spielstand, keine Figuren-Assets.
Testdaten werden ueber die echte Sicherungs-Oberflaeche eingelesen. Interne
Getter dienen zur Beobachtung, nicht zum Vorspielen erfolgreicher Klicks.

Playwright exakt 1.64.1, Kernpakete ebenfalls exakt vorgegeben. Installation
in CI erzeugt einen Lockfile und installiert daraus; Lockfile/Werkzeugversionen
werden im Bericht aufbewahrt. Optionalpakete werden nicht installiert. Die
vollstaendige Laufzeitumgebung (Ubuntu/Emscripten) folgt vorerst dem bisherigen
Projektstandard und ist nicht als bitweise reproduzierbar zugesichert.

## Veroeffentlichungsschutz

Build (browser): quality -> web -> android -> publish. Bei fehlgeschlagener
Logik-, Browser- oder Build-Pruefung kein web und keine Veroeffentlichung.
Der web-Job uebernimmt das EXAKTE erfolgreich gepruefte Web-Artefakt; kein
zweiter abweichender WASM-Build. Android/Pages-Schritte bleiben sonst erhalten.
Schutz gegen versehentlich mitgelieferte Figuren-Dateien bleibt doppelt aktiv.

D1 richtet KEINE GitHub-Branchschutzregel ein. Eine zusaetzliche Sperre gegen
Merge roter Pull Requests ist separat in den Repository-Einstellungen moeglich.
Auch ohne diese Regel ist die Veroeffentlichung an den quality-Job gebunden.

## Berichte und Grenzen

Artefakte: iTamaPoke-D1-Test nur nach Erfolg; D1-Browserbericht auch bei Fehlern,
mit Screenshots/Traces, Werkzeugversionen und erzeugtem Lockfile. Nur kuenstliche
Testdaten, standardmaessig 7 Tage Aufbewahrung. Keine Telemetrie in der App.
Nicht alle denkbaren Fehlerfaelle sind schon echte Browser-Tests; Migration,
Grenzwerte usw. werden weiterhin durch die vorhandenen nativen/JS-Tests geprueft.

Hier lokal moeglich: Shell-/JS-/YAML-Struktur und Installer-/Gate-Verkabelung.
Emscripten und Browser sind in dieser Arbeitsumgebung nicht installiert;
Browser-/Gesamtregression laeuft erstmals auf GitHub. Kein vorgetaeuschtes
lokales Gesamt-Gruen. Neue Abhaengigkeiten/Browserdownloads benoetigen Netzwerk
im GitHub-Runner. Erst nach gruenem D1-Lauf und kurzer Abnahme main aktualisieren.
