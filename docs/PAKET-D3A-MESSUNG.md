# D3a - Messversion vor Optimierungen

Keine Spielregelaenderung, kein Cache-Tuning, keine veraenderte Taktung,
kein Weglassen von Spielschritten. Gleiches Menue und zwei Diagnoseaktionen.
Zusaetzliche lokale Leistungsdaten in Diagnose und bestehendem JSON-Bericht.
Keine Netzwerkabfragen, keine Telemetrie, keine dauerhafte Speicherung.

## Messdefinitionen
- Start: performance.now() beim ersten erfolgreichen App-Durchlauf. Beginn
  ist Navigation/timeOrigin, NICHT erst Einlesen des Messskripts. Kein Nachweis
  bereits dargestellter Pixel/GPU-Paints. Hintergrund vor Start: nicht bewertet.
- Nativer Takt: tp_tick-Aufruf; Stichprobe jeder sechste sichtbare Durchlauf.
  Bei Entscheidungspausen keine falsche Nullmessung fuer einen uebersprungenen
  tp_tick. Weitere JS-Spielaktualisierungen sind NICHT in diesem Wert enthalten.
- Zeichenpfad: Dauer des draw()-Aufrufs, ebenfalls jeder sechste Durchlauf. Bei
  Minispielen inklusive deren bestehender step()-Aufrufe. Bei offenem neuen
  Menue kein Canvas-Zeichenwert. Fehlgeschlagene draw()-Aufrufe nicht als Erfolg.
- Durchlaufabstand: rAF-Zeitstempelabstand, jeder sichtbare Durchlauf; getrennt
  nach fest erlaubten Ansichtsgruppen. Keine Bildschirm-FPS, keine GPU-Zeit.
  Hintergrund-/Ansichtswechsel trennen die Reihe. Echte lange Vordergrund-
  Intervalle bleiben sichtbar, sofern <=60 Sekunden; ungueltige/ueberlange
  Werte werden verworfen und deren Anzahl wird genannt.
- Seiten: synchroner Aufbau der Hauptmenue-/Einstellungs-/Tagebuch-/Diagnose-
  Seiten. Bei Sicherungen/Dateiverwaltung inkl. erfolgreichem Daten-/DOM-Aufbau.
  Keine Browser-Paint-Messung, kein Versprechen alle Unterseiten zu erfassen;
  der spaetere Tagebuch-Nachlauf ist nicht Bestandteil des synchronen Werts.
- Zustands-Export: bestehender WASM-Export plus unmittelbare Kopie seiner Bytes.
  Auch manuelle Exporte/Backups nutzen ihn; nicht mit Anzahl Speichervorgaenge
  gleichsetzen. Keine zusaetzlichen Exporte durch die Messung selbst.
- Schreiben: ab Oeffnen der Datenbank bis nach Transaktionsabschluss inkl.
  bestehender D2-Bestaetigung. Erfolg/Fehler getrennt. Erfolgs-/Fehlerzaehler
  zaehlen auch Hintergrundvorgaenge, deren Dauer wird nicht ausgewertet.
  Stale-Guard nach DB-Oeffnung zaehlt als verworfen, nicht als Schreib-Erfolg;
  frueh wegen Ersetzung abgewiesene Aufrufe starten keinen Messversuch.

Pro fester Messreihe maximal 180 Werte, mit Mittel, Median, P95 (nearest rank),
Maximum sowie Gesamtzahl erfasster Werte. Statistik betrifft das begrenzte
Fenster, NICHT die gesamte Sitzung. Keine Rohdaten im Bericht. Gleiche Version
und Ansicht vergleichen; wenige Proben sind keine belastbare Leistungsdiagnose.
Messaufwand ist enthalten. Hintergrundwechsel verwerfen laufende Messspannen.

## Grafikcache
Nur auf explizite Diagnosepruefung: bereits geladene Sprite-Objekte, negative
Cacheeintraege, dekodierte Bilder und bekannte Puffer. Geteilte ArrayBuffer
innerhalb dieses untersuchten Caches einmal gezaehlt. Keine Puffer werden
kopiert, geladen, geloescht oder veraendert. Ohne JS-Objekte, Atlas, Audio,
Canvas/GPU und WASM; andere Referenzen ausserhalb des Caches nicht erfasst.
Aus diesen Zahlen folgt keine exakte RAM-Belegung der App oder des iPhones.
Keine Arten-IDs, Dateinamen, Nicknamen oder Grafik-/Spielstandinhalte im Bericht.

## Ausgangsmessung auf dem iPhone
Nach gruenem Branch-Lauf und gruener Veroeffentlichung:
1. Vollstaendig schliessen, mit Internetverbindung neu oeffnen.
2. 30 Sekunden normale Spielansicht im Vordergrund lassen.
3. Normale Navigation benutzen: Tagebuch, Sicherungen, Dateiverwaltung;
   falls gewuenscht auch Karten-/Boxansicht und Pokédex durchsehen.
4. Zum Spiel zurueck; optional eine Runde Typentraining.
5. Diagnose > Pruefen > Bericht speichern. Bericht hier hochladen.
Nicht gleichzeitig Bildschirmsperre/App-Wechsel in die Messung einbeziehen.
Kein Reset, kein Spielstandimport und kein Loeschen echter Dateien notwendig.
Noch keine behauptete Verbesserung; Bericht entscheidet ueber D3b.

## Absicherung
Neue reine JS-Pruefung im gemeinsamen D1-Runner; echte Browser pruefen positive
Messwerterfassung, unterdrueckte Menue-Zeichenwerte, lokale Berichtsdaten und
bekannte Cachepuffer. Vorhandene A/B/C/D1/D2-Tests bleiben aktiv. Bestehende
WebKit-Touch-/Offline-Grenzen unveraendert. Echte Browser/WASM laufen auf GitHub.
