# Paket D2: lokale Diagnose

Menue > Einstellungen > Diagnose. Keine neue Hauptkachel, keine zusaetzlichen
Knoepfe oberhalb des Spiels, keine Spielregel-/Spielstandschema-Aenderung.

Pruefen liest die gespeicherte Kopie mit dem vorhandenen Legacy-Parser;
keine Abfrage des lebenden WASM-Exports und kein implizites Speichern.
Dateizahlen: count() auf Grafik-, Ruf- und Text-Datenbanken, keine Grafik- oder
Audio-Dekodierung und kein vollstaendiger Bestands-/Gueltigkeitsscan.
Fehlende Datenbanken werden nicht angelegt (Upgrade-Versuch wird abgebrochen).
Eigene Verbindungen werden geschlossen. Keine automatische Reparatur.

Offline: aktueller steuernder Service Worker antwortet per MessageChannel mit
seiner Version und seiner FILES-Liste. Nur bei passender Seitenversion werden
Dateien mit CacheStorage.match und exaktem Cache-Namen geprueft. Kein fetch,
kein caches.open, kein Loeschen, keine Registrierung durch die Diagnose.
Nicht unterstuetzt, nicht gesteuert, Versionswechsel und unvollstaendiger
Bestand werden ausdruecklich unterschieden. Momentaufnahme, keine Garantie
gegen spaetere Speicherbereinigung durch das Betriebssystem.

Speicherung: Zeitstempel erst NACH bestaetigtem Abschluss der echten bestehenden
Schreibtransaktion. Keine Bestaetigung bei Zurueckweisen, Fehler/Abbruch oder
veraltetem Autosave. Normale Schreib-/Fehlerbehandlung bleibt bestehen.
Zeitstempel, letzter Ausgang und begrenzte Fehlerliste nur im Arbeitsspeicher,
also nur seit diesem App-Start. Nicht mit letzter externer Sicherung verwechseln.
Nach Neustart steht wahrheitsgemaess noch keine Bestaetigung aus dieser Sitzung.

Fehler: maximal 20 Kategorien mit Zeit, Haeufigkeit und erlaubtem technischen
Fehlertyp. Keine Rohmeldungen, Stacktraces, Dateinamen/Pfade/URLs, Nicknamen,
Tagebucheintraege, Sammellisten oder NVS-Binaerdaten. Erfasst werden explizite
Speicher-/Zeichen-/Verwaltungsfehler und globale Fehler/unbehandelte Promises;
nicht jede bewusst intern behandelte Warnung ist damit automatisch erfasst.
Keine console-Ueberschreibung, kein Senden, keine Telemetrie, kein Persistieren
von Diagnose-Daten. Berichte entstehen nur nach explizitem Knopfdruck und werden
per lokalem Teilen/Download ausgegeben. Abbrechen des Teilens ist kein Fehler.

Website-Speicher ist eine API-Schaetzung fuer den gesamten Origin, nicht fuer
freien iPhone-Speicher oder RAM dieser App. Keine Leistungs-/FPS-Behauptungen;
Performance-Instrumentierung bleibt D3.

Automatisierung: neuer JS-Test im zentralen D1-Lauf; vorhandene JS-Tests bleiben
aktiv. Echte Browser pruefen Navigation, Bericht ohne synthetischen Nicknamen,
und einen simulierten Schreibfehler ohne falsche Erfolgsbestaetigung. Der echte
warme Chromium-Offlinecheck prueft ausserdem den neuen Diagnose-Cachebefund.
Vorhandene WebKit-Grenzen bleiben unveraendert dokumentiert.

Lokal geprueft: neue D2-JS-Tests, bestehende acht D1/A/B/C1/C2/C4/C5-JS-Tests,
JavaScript-/Shell-Syntax und Installer. Vollstaendiger nativer/WASM-Build und
Chromium/WebKit muessen anschliessend auf GitHub laufen; hier kein SDK/Browser.
Erst nach gruenem Branch-Lauf nach main uebernehmen und am iPhone abnehmen.
