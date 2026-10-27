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
