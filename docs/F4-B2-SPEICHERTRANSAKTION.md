# F4-B2: Modellvalidierung und dauerhafte Browser-Speichertransaktion

Basis: tatsaechlicher TXT-Arbeitsstand 20261023-161841-0b33ed0d,
Branch f4-collection-a, HEAD 977c0f7814adde840504295ccfcd36dda9ed6ddb.
F4-A-Modell und native B1-Produktionsbruecke unveraendert.

## Implementiert
- Collection-Modell wird vor storage-tools geladen. Die neue Persistence-
  Bibliothek wird im normalen Startpfad nach dem Laden des Stores gebunden.
  Alle neuen Skripte sind im Offline-Cache. Keine automatische Erzeugung von
  Individuen oder Migration beim Laden; read eines alten Saves schreibt nichts.
- TPCollection.read liefert einen validierten, unveraenderlichen Zustand.
  Bei laufender Transaktion bleibt die vorherige Ansicht sichtbar.
- apply: globale Sperre/Epochenschutz -> validiertes aktuelles Modell -> reine
  Modelloperation -> erneutes Encode/Validierung und 256-KiB-Limit -> natives
  Begin/Stage -> kompletter echter Export -> strikte Savepruefung und exakter
  Vergleich des exportierten f4col-Feldes -> force writeSave -> erst nach
  IndexedDB-tx.oncomplete native Bestaetigung -> Sperre frei.
- Fehler vor dauerhafter Bestaetigung: Pet und kompletter Preferences-Store
  ueber B1 zuruecknehmen. Pending-Ansicht wird nicht als gespeichert angezeigt.
- Schlaegt Ruecknahme fehl oder kommt nach erfolgreichem Plattenschreiben eine
  unerwartete native Bestaetigungsstoerung: NICHT die RAM-Seite auf den alten
  Stand zuruecknehmen. Fail closed, Sperre bleibt bis zum Neuladen bestehen.
- Native Heap-Pointer sofort kopieren; grosse Stage-Daten via malloc/HEAPU8,
  nicht als grosse Stack-Strings. Pointer-/Groessenfehler und Freigabe getestet.
- Gemeinsame Sperre blockiert Taps/Swipes, alle frame-seitigen nativen
  Aenderungen und Import/Reset ueber den bestehenden Manager. Das Spiel laeuft
  nach regulaerem Abschluss unveraendert weiter; kein Erloeschen realer Zeit.
- Autosaves, die vor der Sperre begonnen, aber noch nicht geschrieben haben,
  werden per Epochengrenze verworfen. Hintergrund-saveNow schreibt nicht in
  eine fremde Transaktion. Eine offene Operation wird NICHT als separat
  wiederaufnehmbare Sitzung versprochen; IndexedDB schreibt den ganzen Save.
- writeSave gibt nach tatsaechlichem Commit true, bei Ueberspringen false und
  bei force-Schreibfehler eine Exception zurueck. Nach-Commit-Telemetrie ist
  isoliert und darf keinen falschen Speicherfehler mit RAM-Rollback ausloesen.
- Der reale bisherige Saveparser prueft bei f4col den Binaertyp, UTF8, das
  echte Modell und dessen Version/Checksumme/Invarianten. Gilt fuer rohe und
  SHA256-versiegelte Importdateien, Vorschauen und Sicherungen. Fehlendes Feld
  bleibt ein legitimer alter Save. Keine Normalisierung/Erfindung bei Defekten.

## Noch absichtlich nicht aktiviert
Kein Einlesen des aktuellen Pet als Individuum beim Start, keine echten
Fang-/Pflegeende-Hooks, keine neue Sammlung/Box-UI. Keine Teamkaempfe, keine
Leiter-BINs, kein neuer Ordenkoffer oder Rechtebildschirm in diesem Paket.
Nicht manuell ueber die Browserkonsole Pokemon anlegen oder entfernen:
Die passenden atomaren nativen Spielereignisse folgen erst in F4-B3.

## Tests / ehrliche Grenzen
- Originales F4-A-Modell aus dem TXT-Export, kein Ersatzmodell.
- Modell/Controller mit simulierter Native-/IndexedDB-Umgebung: Commit-
  Reihenfolge, Schreibfehler, Stage/Exportfehler, Parallelaufrufe, Sperrung,
  unbekannte/beschaedigte Daten und 200 Lagerplaetze + aktives Wesen.
- Reale writeSave-Funktion isoliert ausgefuehrt: stale Autosaves, force-
  Bestaetigung, Abbruch und Telemetriefehler nach Commit.
- Unveraenderte native B1-Tests mit echtem Pet und realem Export-/Importcodec.
  Wire-Test nun mit gueltigen, vom ECHTEN F4-A-Modell erzeugten Daten samt
  echtem Pet-Snapshot. Auch genau 256 KiB (gueltiges JSON mit Randpadding).
- Bestehender D3-Frame-Test erhaelt eine zusaetzliche Busy-Trace-Pruefung.
  Die statische RAF-Anzahl wird von 2 auf 3 angepasst, weil der neue
  gesperrte Pfad genau einen eigenen RAF-Fortsetzungspunkt hat. Bisherige
  dynamische Vergleiche und alle anderen Assertions bleiben erhalten.
- Drei neue Playwright-Faelle: echte Native/IndexedDB-Speicherung, Reload und
  Alt-Save-Import; Schreibfehler-Ruecknahme; wartender Commit mit Eingabe-/
  Tick-Sperre. Hier nur Syntax geprueft, NICHT in echten Browsern ausgefuehrt.
- Keine CI-Versionen, Timeouts, Retries oder Workflows geaendert.
- Vollstaendiger lokaler kombinierter Runner auf rekonstruiertem echten
  A/B1-Arbeitsstand plus B2. Keine behauptete WASM-/Browser-/iPhone-Abnahme.

## Installation
Installer bleibt auf bestehendem uncommittetem f4-collection-a, prueft die
vorhandenen Quellen und den exakten geaenderten/untracked Arbeitsstand.
Originale ausserhalb sichern, Aenderungen schreiben, kompletten zentralen
Runner automatisch ausfuehren. Bei Fehlern exakte Ruecknahme auf A/B1,
aber keine parallel geaenderten Dateien blind ueberschreiben.
Kein Commit, Push, Deployment oder Zugriff auf echte Browser-Spielstaende.
