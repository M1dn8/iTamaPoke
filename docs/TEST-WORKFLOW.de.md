# Gestufte Testschleife nach dem UI-Review

## Verbindliche Reihenfolge

1. Verhaltensaenderung und betroffene Tests/Helfer gemeinsam erfassen.
2. Vorpruefung: Diff, statische Vertraege, echter Menu-Renderer-Test,
   Syntax aller Browser-Testdateien und vollstaendige Test-Erfassung.
3. Kurze Navigation in Chromium und WebKit, vier UI-Sprachen.
4. Betroffene Testgruppen gemeinsam pruefen, Fehlerbudget fuenf.
5. Vollstaendige Browserregression auf einem unveraenderten Stand.
6. Zentralen nativen Check ueber tools/quality/run-all.sh ausfuehren.

## Befehle

- node tools/quality/review-check.cjs preflight
- node tools/quality/review-check.cjs smoke
- node tools/quality/review-check.cjs affected
- node tools/quality/review-check.cjs full
- node tools/quality/review-check.cjs native

Ohne Argument wird affected verwendet, nicht full. Die Gruppen affected
und full enthalten die vorgeschaltete Navigation. Native Referenzdaten
nicht mit geratenen Dateien ersetzen: der vorhandene zentrale Runner
erzeugt diese fuer die betreffenden Tests.

## Gemeinsame Navigation

helpers.js bietet openSpeciesSearch, openStories, openJournal,
openEggPlanning, openEvolution, backToHub und closeHubModal.
Die Helfer verwenden sichtbare Steuerelemente und lokalisierte Namen.
Explizite Sprachtests pruefen weiterhin feste Solltexte unabhaengig davon.
Keine automatische Navigation zu abgeschlossenen Geschichten und keine
Fallback-Zugaenge zu alten Menueintraegen.

## Ergebnisse und Grenzen

Automatische Ganztest-Retries bleiben auch in CI aus. Der kurze
Navigationstest stoppt beim ersten Fehler; betroffene Gruppen und die
Gesamtregression sammeln bis zu fuenf Fehler. Assertions duerfen weiterhin
auf den erwarteten Zustand warten. Timeout-Erhoehungen ersetzen keine
Fehleranalyse.

Jeder Runner-Aufruf speichert eigene Logs, Browserberichte und Artefakte
im ausgegebenen temporaeren Verzeichnis. manifest.json enthaelt Profil,
Befehle, Exitcodes, Zeitpunkte, Node-Version, Quellfingerabdruck und den
Hash des vorhandenen WASM-Kerns. Der Hash dokumentiert den benutzten Kern,
beweist aber keine frische Uebersetzung: nach nativen Aenderungen weiterhin
browser_ver/build.sh ausfuehren. Quellen waehrend eines Laufs nicht aendern.

Eine bestandene Teilgruppe ist keine Gesamtfreigabe. Native Tests und
echte Browserpruefungen muessen auf dem Zielrechner ausgefuehrt werden.
Die neue Testauswahl ersetzt den abschliessenden vollstaendigen Lauf nicht.

## Auditgrenzen

Der initiale Audit umfasste 330 bereitgestellte Quelldateien und
41 vorhandene Browser-Spec-Dateien. Ein neuer Navigation-Smoke-Test kommt
hinzu. Die statischen Suchregeln sind Fruehwarnungen, keine vollstaendige
semantische Erkennung beliebiger kuenftiger UI-Aenderungen.

## Verbindlicher Paketablauf und Worker-Erprobung

1. Paket gemeinsam erarbeiten und Abnahmepunkte festlegen.
2. Kleine Aenderung umsetzen; betroffene Tests und Helfer gleichzeitig
   anpassen.
3. Nutzer sieht den aktuellen Stand direkt im Revisionsbrowser und
   gibt Korrekturen vor. Bei nativen Aenderungen aktuellen WASM-Kern bauen.
4. Waehrend dieser Iterationen nur passende kurze Pruefungen, nicht
   nach jeder Text-/Darstellungsaenderung die gesamte Suite.
5. Nach manueller Paketabnahme Stand einfrieren und Abschlusspruefungen
   ausfuehren: Browsergesamtregression, nativer Gesamtcheck, Diff/Plan.
6. Sichtbare/funktionale Fehlerkorrekturen erneut manuell abnehmen lassen.
7. Erst nach erfolgreicher Pruefung und Nutzerfreigabe Commit/Push ueber
   den bestehenden Terminalablauf. Anschliessend GitHub-Build kontrollieren.

Der Revisionsbrowser bleibt die manuelle Sichtpruefung; automatische
Browserkontexte und Testdaten bleiben davon getrennt.

### Schnelllauf

Beispiel:
node tools/quality/review-check.cjs quick specs/zapdos-encounter.spec.js --project=chromium-mobil

quick verlangt eine ausdrueckliche Auswahl. Vorpruefung bleibt erhalten;
die generelle Navigation und die komplette affected-Gruppe werden nicht
zusaetzlich gestartet. Browser-/Sprach-/Breitenauswahl nach Aenderungsrisiko,
nicht pauschal alle Varianten bei jedem Zwischenschritt.

### Worker

TP_TEST_WORKERS=1 ist weiterhin Standard und Rueckfallwert.
TP_TEST_WORKERS=2 aktiviert den kontrollierten Parallelversuch.
Andere Werte werden vor dem Lauf abgelehnt.

fullyParallel bleibt false. Retries bleiben null, Fehlerbudget bleibt
unveraendert. Die Workerzahl wird im Laufmanifest dokumentiert.
Native Pruefungen werden dadurch nicht parallelisiert.

Vergleichsbasis: vollstaendige Browserregression mit einem Worker,
315 bestanden, eine Chromium-spezifische Offlinepruefung unter WebKit
uebersprungen, 20,0 Minuten fuer die vollstaendige Browserphase.

Zuerst affected mit zwei Workern pruefen. Danach bei stabilem Ergebnis
die identische vollstaendige Suite mit zwei Workern vergleichen.
Zwei Worker erst nach erfolgreichem Vergleich als Standard uebernehmen.
Keine Timeout-Erhoehungen oder Retries zum Verdecken neuer Instabilitaet.

## Vier-Worker-Vergleich

Aktuell erlaubte Werte fuer TP_TEST_WORKERS: 1, 2 und 4.
Die vorherige Beschraenkung auf 1 und 2 ist damit erweitert.

Vollstaendige Browserphase mit zwei Workern erfolgreich:
315 bestanden, ein vorgesehener Test uebersprungen, 11,4 Minuten.
Vergleich mit einem Worker: gleicher Testumfang, 20,0 Minuten.
Laufzeitreduktion im beobachteten Vergleich: 43 Prozent.

Vier Worker werden zunaechst mit affected erprobt. Bei Erfolg folgt
ein vollstaendiger Vergleich. Noch keine Freigabe als Standard.
Timeouts, Retries und fullyParallel bleiben unveraendert.

Diese lokalen Ergebnisse bestimmen nicht automatisch die passende
Workerzahl fuer GitHub Actions; dort separat beurteilen.

## Abschliessende Workerentscheidung — 28.10.2026

Diese Entscheidung ersetzt die vorherigen experimentellen Workerangaben.

- Lokaler review-check-Runner: standardmaessig zwei Worker.
- Bei gesetztem CI ohne ausdrueckliche Vorgabe: weiterhin ein Worker.
- TP_TEST_WORKERS=1 bleibt die Rueckfalloption.
- Erlaubte ausdrueckliche Werte: 1 und 2.
- Vollstaendige Browserphase: ein Worker 20,0 Minuten,
  zwei Worker 11,4 Minuten; jeweils 315 bestanden, ein Test uebersprungen.
- Betroffene Testgruppe: zwei Worker 3,6 Minuten, vier Worker 3,7 Minuten;
  jeweils 107 bestanden, ein Test uebersprungen.
- Kein Geschwindigkeitsvorteil fuer vier Worker in diesem Vergleich
  beobachtet; experimentelle Freigabe zurueckgenommen.
- fullyParallel, Timeouts, Retry- und Fehlerbudgetregeln unveraendert.
- Direkte Playwright-/npm-Aufrufe verwenden weiterhin ihre eigene
  Konfiguration; der lokale Zwei-Worker-Standard gilt fuer den Runner.

## Verbindlicher interaktiver Revisionsbrowser

Nutzerbestätigung vom 28.10.2026:
„genau so soll es aussehen! sehr gut“

Diese Entscheidung ersetzt frühere vereinfachte Vorschläge mit
separatem Webserver, normalem Chrome und manuellem Testspielstandimport.

### Werkzeug und Start

Runner:
tools/review/manual-review.cjs

Ein Startbefehl in einem separaten interaktiven Terminal startet
lokalen HTTP-Server und sichtbaren Reviewbrowser gemeinsam.

Allgemeiner Aufruf aus dem Repository:

node tools/review/manual-review.cjs --saves PFAD_ZUM_REVIEWORDNER

Auf dem aktuell eingerichteten Mac lautet der vollständige Aufruf:

"$HOME/.nvm/versions/node/v24.22.1/bin/node" \
  "$HOME/Projects/iTamaPoke-1025/tools/review/manual-review.cjs" \
  --saves "$HOME/Downloads/iTamaPoke-Arktos-Review-qR4me2"

Der konkrete Spielstandordner ist paketabhängig. Vorhandene Ordner
prüfen und den tatsächlichen Pfad nennen, keinen Pfad erfinden.
Eine Änderung der lokal installierten Node-Version gesondert prüfen;
nicht ungefragt neu installieren oder die Shell-Konfiguration ändern.

### Browser und Isolation

- Bereits vorhandenen Playwright-Chromium verwenden.
- Keine automatische Auswahl des normalen Google Chrome.
- Fester Profilordner:
  ~/Library/Application Support/iTamaPoke-Revisionsbrowser-Playwright
- Lokaler Reviewserver: 127.0.0.1, Port 8766.
- Normales Browserprofil und echte Spielstände bleiben unberührt.
- Nur die ausgewählten synthetischen Testspielstände laden.
- Vorhandene relevante Grafiken aus Resources/mons lokal übernehmen.
- Keine Mediendownloads, Veröffentlichung oder Aufnahme privater Medien
  in das Repository.
- Service Worker sind im Reviewkontext blockiert. Dies ist daher kein
  Nachweis einer bestandenen Offlineprüfung.

### Bedienung im Reviewterminal

- 1 bis 8: ausgewählten vorbereiteten Testspielstand neu laden.
- 4: aktueller Arktos-Höhleneinstieg.
- 5: nähere Höhlenansicht mit Eiszapfen-Minispielzugang.
- 6: Arktos-Begegnung.
- 7: wartende Arktos-Aufnahme.
- 8: direkte Finale-Sichtprüfung; kein Nachweis eines echten Sieges.
- s: Screenshot sofort aufnehmen, anschließend Textnotiz eingeben.
- r: Seite neu laden, aktuellen Testfortschritt behalten.
- w: Ansichtsbreite zwischen 320, 390 und 430 Pixeln wechseln.
- h: Hilfe anzeigen.
- q oder Ctrl+C: Runner und seinen Browser/Server beenden.

Ziffern und Funktionstasten benötigen kein Enter.
Nur die Screenshot-Notiz wird mit Enter abgeschlossen.
Befehlsblöcke für Quellcodeänderungen in einem normalen Terminal ausführen,
nicht in das interaktive Reviewterminal einfügen.

### Aufnahmen und Rückmeldungen

Pro Lauf entsteht ein eigener Ordner:
~/Downloads/iTamaPoke-Review-Aufnahmen-*

- PNG: Screenshot.
- TXT mit gleichem Basisnamen: zugehörige Notiz.
- JSON mit gleichem Basisnamen: Testfall, Ansichtsgröße und Diagnosekontext.
- session.json: Laufkontext einschließlich WASM-Prüfsumme.
- events.jsonl: begrenzte Fehlermeldungen des Reviewlaufs.

Wenn Uploads nicht möglich sind, Notizdateien per Terminal ausgeben und
die Ausgabe in den Chat kopieren. Fehlgeschlagene Startordner ohne
Screenshot-/Notiz-Paare überspringen.
Aus Textnotizen keine angeblich gesehenen Bildinhalte ableiten.

### Verbindliche Iterationsschleife

1. Paketinhalt und Abnahmepunkte gemeinsam festlegen.
2. Kleine Änderung umsetzen und betroffene Tests/Helfer mitpflegen.
3. Passende kurze Prüfungen ausführen.
4. Aktuellen Stand direkt im interaktiven Revisionsbrowser ansehen.
5. Rückmeldungen mit Screenshot/Notiz erfassen und gezielt korrigieren.
6. Wiederholen, bis die manuelle Paketabnahme ausdrücklich vorliegt.
7. Stand einfrieren und vollständige Abschlussprüfungen durchführen.
8. Erst nach erfolgreichen Prüfungen und Nutzerfreigabe committen/pushen.
9. GitHub-Ergebnis und passende iPhone-Abnahme separat dokumentieren.

Nicht bei jeder Darstellungsänderung die vollständige Suite starten.
Lokaler review-check-Runner verwendet gemäß bestehender Entscheidung
standardmäßig zwei Worker; für GitHub/CI gelten die gesonderten Regeln.

Ein Screenshot, ein synthetischer Abschluss-Spielstand oder eine
bestandene Teilprüfung ist keine vollständige Funktionsabnahme.

## Browserbindung des interaktiven Reviewrunners

- Den vorhandenen Playwright-Chromium verwenden.
- Keine automatische Auswahl des installierten Google Chrome.
- Festes Profil:
  ~/Library/Application Support/iTamaPoke-Revisionsbrowser-Playwright
- Normales Chrome und andere Profile nicht beenden oder verändern.
- Vorhandenen Browserpfad vor dem Start auf Ausführbarkeit prüfen.
- Keine automatischen Browserinstallationen.
- Bedienung mit Testbadge, Screenshot/Notiz und Spielstandtasten bleibt.
- Den bisherigen Review-Profilordner nicht löschen oder überschreiben.
