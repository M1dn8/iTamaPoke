# F3 Browserfix 1

Basis: battle-arena-f3, Commit 838c167ddd48cfac8d335954de5a62f91198841d.
Beleg: D1-Browserbericht / Version 838c167ddd48, sechs Fehlerkontexte inkl. Retries.

1. Der Wiederherstellungstest erreichte Kampf, Ordensvergabe, Reload und Wiederholung.
   Erst der anschliessende Sicherungsimport scheiterte: H.importSave rief das
   Hauptmenue auf, waehrend die Kampfkarte noch geoeffnet war. Der Test benutzt
   jetzt zuerst den vorhandenen sichtbaren Karten-Rueckweg und prueft idle.
   Erst danach wird ueber das echte Menue importiert. Keine Bildschirmvariable
   wird direkt umgeschrieben, keine Assertion entfernt und kein Timeout erhoeht.

2. Im temporaeren WebKit-Kontext war der Portrait-Datensatz nach der Dateiauswahl
   nicht vorhanden. Der Trace nennt keine konkrete IndexedDB-Exception. Das passt
   zur bekannten Blob/File-Einschraenkung ephemerer WebKit-Kontexte:
   https://github.com/microsoft/playwright/issues/42795
   Die App speichert nun das normalisierte PNG als ArrayBuffer statt Blob.
   Beim Lesen werden sowohl diese Bytepuffer als auch bisherige Blob-Portraets
   unterstuetzt. Namen, Datenbank, Bildlimits und lokale Zuordnung bleiben gleich.

Der echte Browsertest verlangt statt bloss instanceof Blob nun gespeicherte
Binaerdaten mit PNG-Signatur, Dekodierbarkeit, 16x16-Abmessungen und korrekten
RGBA-Pixeln der synthetischen Testgrafik. Dieselben Checks laufen nach Reload;
anschliessend wird die Grafik tatsaechlich in einer gewonnenen Arena gezeigt.
Vor dem Kampf darf weiterhin kein Orden vorhanden sein. Fang-/Ordens-/Backup-
Pruefungen bleiben erhalten.

Lokale Pruefung: JavaScript-Syntax; gezielte Tests der veraenderten Speicher-
Routinen mit simuliertem Blob-Schreibverbot, exakten PNG-Bytes, neuem Controller,
Alt-Blob-Lesen, ungueltiger PNG, Speicherfehler und geloester Busy-Sperre.
Die alte Schreibroutine scheitert im negativen Kontrolllauf erwartungsgemaess.
Diese lokale Kontrolle verwendet die isolierten Original-Speicherroutinen;
der neue CI-Unit-Test laedt die vollstaendige echte Produktionsdatei.
Ein echter Chromium/WebKit-Gesamtlauf wurde hier NICHT ausgefuehrt.
Keine Aenderung an nativer Kampfmathematik, Orden, Saveformat, CI-Image, Retry-
Regel, Zeitlimits oder Playwright-Version. Erneuter kompletter GitHub-Lauf noetig.
