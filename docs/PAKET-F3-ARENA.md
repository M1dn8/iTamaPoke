# Paket F3: Kanto-Arenen, Ordenkoffer und Uebergabeszene

Basis: main, 79e43401773d96ab64067e4bb4e43c01b2fa1505, nach F2-Abnahme.

## Umfang und Datenstand
- Eigener Arena-Einstieg neben Wildkampf und Trainerkampf.
- Kanto als erste Vorschau; acht Leiter, 27 Teamplaetze, feste Rot/Blau-Level.
- Keine Gelb-, Rematch- oder Remake-Teams. Doppelte Arten bleiben doppelt.
- Quellen fuer Namen/Orden/Teams/Level:
  https://www.bisafans.de/spiele/editionen/rot-blau/arenaleiter.php
- Kogas Einsatzreihenfolge zusaetzlich abgeglichen:
  https://www.dittobase.com/red-blue/gym-leaders-elite-four/koga
- Es bleibt die vorhandene Kampfmathematik mit den vorhandenen Aktionen und
  Typdaten. Dies ist KEINE originalgetreue Nachbildung aller Gen-I-Kampfregeln.
- Auswahl ist frei; es werden keine unbesprochenen Arenareihenfolge-Sperren,
  Zusatzwaehrungen, Stat-Boni oder neuen Heilungen eingefuehrt.

## Ablauf
Aktuelles aufgezogenes Pokemon gegen das gesamte Leiterteam. Rest-KP,
verbleibende Erholungen und Spieler-/Mega-Kampfsnapshot bleiben erhalten.
Zwischensiege geben nichts; der naechste Gegner wird explizit gestartet.
Keine Fangoption. Erst der vollstaendige Arenasieg berechtigt zur Ordensvergabe.
Die vorhandene Rundenlimit-Entscheidung bleibt pro Einzelkampf erhalten.
Eigene Teams und weitere Regionen folgen spaeter.

## Ordenkoffer und Speicherprotokoll
Arenen und Orden sind zwei Ansichten desselben hellen Arena-Bereichs, keine
zusaetzliche Hauptmenue-Kachel. Acht Plaetze in zwei Spalten und vier Reihen;
Status ausser ueber Farbe auch als Text/Haken. Detail: Leiter, Ort, Team, Level,
Ordensname und erster Gewinntag. Geometrische Ordenssymbole werden lokal gezeichnet.

agver=1, agmask=0..255 und agt0..agt7 liegen als profilweite Schluessel in der
bestehenden Preferences-Tabelle. Der ganze vorhandene Save-Export nimmt sie mit.
Keine Kopie in einem fremden Cloud-Speicher, kein zweiter Ordens-Spielstand.
Alte Saves ohne Schluessel starten mit null Orden. Unbekannte/ungueltige Versionen
werden nicht ueberschrieben; die Arena-Vergabe bleibt dann gesperrt.

Native Start-/Sitzungstoken und vollstaendiger Sieg werden geprueft. Vergabe wird
reversibel vorbereitet, zusammen mit dem normalen Spielstand in IndexedDB
bestaetigt und erst danach als erhalten angezeigt. Fehlgeschlagene Speicherung
stellt Pet und Preferences exakt zurueck; die Ergebnisansicht bietet Wiederholen
oder Verlassen. Kein automatischer Endlos-Retry. Wiederholte Siege behalten das
erste Datum und geben keinen zweiten Orden.

Orden bleiben nach Entwicklung, Pokemonwechsel und neuem Ei erhalten. Vollstaendiger
Spielreset entfernt sie. Import einer aelteren Sicherung stellt deren damaligen
Ordensstand wieder her. Die laufende Kampfserie ist weiterhin eine RAM-Sitzung:
App-Wechsel/Neuladen beendet sie, kein Resume. Bereits bestaetigt gespeicherte
Orden bleiben bei Unterbrechung der Uebergabe erhalten. Waehrend der Schreibphase
sind Bedienung/Autosave und regulare Ticks ueber die bestehende Sperre geschuetzt.

## Leitergrafiken
In der Leiterdetailseite: Grafik fuer [Name] laden (PNG). Das gewaehlte Bild wird
explizit diesem Leiter zugeordnet. Eingabe maximal 1 MB und 1024 x 1024 Pixel;
PNG-Signatur und Abmessungen werden geprueft. Nach Dekodierung wird ein bereinigtes
PNG mit maximal 512 Pixeln Kantenlaenge lokal gespeichert.

Die Datenbank itamapoke-arena-art / portraits enthaelt nur lokale Bilddateien.
Keine automatischen Downloads, Fremd-URLs, SVGs oder mitgelieferten Portraets.
Ohne Bild erscheint eine gekennzeichnete Ersatzfigur; alle Arena-Funktionen
bleiben nutzbar. Die originale Darstellung des jeweiligen Leiters wird also
ERST nach lokalem Laden seines Bildes gezeigt. Bilddateien gehoeren nicht zum
.tpsave-Export; deren Originale separat behalten. Ein Import/Spielreset veraendert
nicht nebenbei diese getrennte lokale Grafikdatenbank.

Uebergabe: Leiter links, eigenes Pokemon rechts, Orden bewegt sich nach bestaetigter
Speicherung zur Mitte. Reduzierte Bewegung wird beruecksichtigt. Wiederholung:
Anerkennung statt zweiter Vergabe. Die Animation ist niemals eine zusaetzliche
Voraussetzung fuer den Besitz eines bereits gespeicherten Ordens.

## Zentrierung und unveraenderte Teile
Drei gleich breite Kampf-Einstiege; Records unter denselben Mittelachsen.
Im Kampf sind Namen, KP-Balken und Sprites symmetrisch aufeinander ausgerichtet.
Bestehende Mega-Skalierung/Formnamen, Trainings-Schild, Trainingszaehlung/-kosten
und Wild-/Trainer-Kampfregeln bleiben erhalten. Nur die kleine Figur der neuen
Uebergabeszene hat eine eigene feste Maximalflaeche.
Bestehende Browsertests bleiben aktiv; ihre gezielten Klickkoordinaten fuer die
absichtlich verschobenen Wild-/Trainer-Schaltflaechen werden angepasst. Keine
Assertions abgeschwaecht, kein Timeout erhoeht, kein Test uebersprungen.
Keine neuen Workflowdateien und keine Aenderung der CI-Container/Versionen.

Bei der Sanitizer-Pruefung wurde im vorhandenen Browser-Preferences-Helfer ein
memcpy mit leerem Vektor und Laenge 0 sichtbar. Ein Guard verhindert ausschliesslich
diesen Null-Laengen-Aufruf; die Datensemantik bleibt gleich.

## Vorpruefung des Pakets
Vollstaendiger zentraler nativer/JavaScript-Regressionslauf erfolgreich, einschliesslich
F1, F2, E1/E2/E3, Speicherung/Rollback, UI und CI-Integritaet. Native F3-Tests gegen
die Produktionsbridge und den echten Kampfcode: alle Teams/Level, KP/Erholungen,
Tokens, Zwischensiege, Verlust/Abbruch, Wiederholung, Datum, Neustart/neues Ei/Reset,
Alt-/Fremdsaves und exakte Ruecknahme. 40 reale berechnete Arenaserien mit einer
vorbereiteten starken Testfigur. Zusaetzlicher UndefinedBehaviorSanitizer-Lauf gruen.
JS-Tests pruefen Controller, Speicherung, Wiederholung, Abbruch und Navigation.
Die native Katalogausgabe wird mit der Browser-Konfiguration verglichen.

Neue Playwright-Faelle: echter Arenakampf, Gegnerwechsel, persistierter Orden,
Reload/Backup-Import, Wiederholung, Speicherfehler/Retry, Hintergrundabbruch und
echter lokaler PNG-Dateiwaehler. Diese Faelle sind hier nur syntaktisch geprueft;
der echte WASM-/Chromium-/WebKit-Gesamtlauf steht auf GitHub noch aus.
Echte iPhone-Abnahme steht ebenfalls aus. Kein behauptetes Browser-Gesamtgruen.

## Installation
Nur auf sauberem main an obiger Quellbasis. Der Installer verifiziert alle
ersetzten Dateien und die unveraenderten Quellabhaengigkeiten mit SHA256,
sichert Originale ausserhalb des Repositories und erstellt battle-arena-f3.
Kein automatischer Commit, Push, Deployment oder Zugriff auf den iPhone-Spielstand.
Branch-CI zuerst, anschliessend gemeinsame Veroeffentlichung und iPhone-Abnahme.
