# GitHub: aktive Workflows

## Normaler Browser-/PWA-Arbeitsablauf

| Datei | Name in Actions | Aufgabe |
| --- | --- | --- |
| `.github/workflows/test-quality.yml` | `Qualitaet pruefen` | Gemeinsame Tests auf Entwicklungsbranches, PRs nach main und manuell |
| `.github/workflows/quality-gate.yml` | `Gemeinsames Qualitaetstor` | Wiederverwendbarer Logik-, WASM- und Browser-Pruefjob |
| `.github/workflows/build-browser.yml` | `Build (browser)` | main-Veroeffentlichung: Qualitaetstor, getestetes Webpaket, Android, Pages |

Das Qualitaetstor ist kein zweiter unabhaengiger Publish-Job. Es wird von den
beiden aufrufenden Workflows verwendet. Spieltests bleiben im zentralen
`tools/quality/run-all.sh`; keine Testdatei wurde fuer die Bereinigung entfernt.

## Optionale native Builds

- `build.yml` / `Build (unsigned)`: nur noch manueller Start.
- `build-signed.yml` / `Build (signed)`: weiterhin nur manueller Start.

Sie bleiben fuer native iOS/watchOS-Pakete erhalten. Diese Bereinigung loescht
keine Secrets, aendert keine Signing-Einstellungen und entfernt keine Targets.

## Was entfernt wurde

Die sieben alten branchspezifischen Paket-Workflowdateien wurden aus
`.github/workflows` entfernt: test-pokedex-1025.yml, test-management.yml,
test-egg-planning.yml, test-expeditions.yml, test-minigames.yml,
test-personality.yml und test-menu-diary.yml. Ihre bisherigen Inhalte bleiben
in der Git-Historie und in der externen Installer-Sicherung erhalten.

Der aktive Bestand sinkt von 12 auf 5 Workflowdateien. Alte Actions-Eintraege
koennen aufgrund bisheriger Laufhistorie weiterhin sichtbar sein. Dieser
Schritt loescht weder Laufhistorie/Artefakte noch Remote-/Sicherungsbranches.
Es wird auch kein Tag automatisch angelegt.

## Kontrolle und Veroeffentlichung

Auf dem Branch `wartung-github` muss `Qualitaet pruefen` erfolgreich laufen.
Die Automatik des unsigned Builds entfaellt auf diesem neuen Stand.
Der Browser-Publish-Workflow und seine Abhaengigkeiten bleiben bytegenau
unveraendert. Es werden keine Spiel-/Mess-/Sicherungsdateien geaendert.

Die geaenderten Pfade dieses reinen Workflow-/Dokumentations-Commits treffen
nicht auf die bisherigen main-Pfadfilter von Build (browser) zu. Nach der
Uebernahme ist deshalb kein automatisches Browser-Deployment zu erwarten;
die installierte Spielversion darf weiterhin c9cf801ffcbb anzeigen.
Ein manueller Build (browser) bleibt wie bisher moeglich.

Offene PRs, Branchschutz-/Ruleset-Einstellungen, aktive/abgeschaltete Workflows
und externe Referenzen sind nicht aus dem Git-Export ersichtlich. Sie wurden
nicht geaendert. Vor spaeterer Remote-Branch-Bereinigung separat pruefen.
