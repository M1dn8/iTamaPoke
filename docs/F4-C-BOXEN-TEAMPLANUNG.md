# F4-C: individuelle Boxen und Teamplanung

Auf dem bestaetigten B3b-Entwicklungsstand, weiterhin f4-collection-a und
HEAD 977c0f7814adde840504295ccfcd36dda9ed6ddb. Keine neuen nativen Speicher-
formate oder parallelen Sammlungsdaten. Jede Mutation geht ausschliesslich
ueber den vorhandenen TPCollection.apply-Controller und dessen atomaren Save.

## Sichtbare Verwaltung
Ein Einstieg auf der bestehenden Box-Karte, auch bei leerem historischem
Fangnachweis. Keine siebte Hauptmenue-Kachel. Alte Artenliste bleibt erhalten.
Zehn direkt auswaehlbare Boxen zu je 20 Slots, belegte/freie Plaetze, Boxnamen,
Vor/Zurueck. Die zuletzt betrachtete Box bleibt fuer die laufende Sitzung
gewaehlt, keine neue sessionfremde Speicherung. Nach Neustart beginnt Box 1.
Neue Faenge und Behalten verwenden die gewaehlte Box, sonst naechste freie;
Fangabschluss nennt die tatsaechliche Ablagebox.

Individuen mit Name/Art, Level, Shiny, ID und lokalen Sprite-Dateien. Fehlende
Grafik wird durch ? ersetzt, keine Netzwerk-Downloads. Detail zeigt echte
bekannte Werte, fehlende Gene/Training explizit nicht vorhanden, vorhandene
Medaillen/Persoenlichkeit/Pflegewerte und bekannten Fangzeitpunkt. Keine neuen
historischen Zeitpunkte, keine Mega-Form als eigene Kreatur.

Teamplanung: sechs dichte geordnete Referenzplaetze, weniger/keine erlaubt.
Auswahl, ausdrueckliches Ersetzen bei vollem Plan, nach vorne/hinten, entfernen.
Kein Pflegewechsel und noch keine Teamkaempfe. Aktives Pflege-Pokemon nimmt
keinen Boxplatz ein. Gespeicherte Teammitglieder behalten ihren Boxplatz.

Stored rename/move/single release: Draft speichern/abbrechen; leerer Spitzname
zeigt Artname. Zielbox-Auswahl sperrt volle und eigene Box; Ziel erster freier
Slot. ID und Teamreferenz bleiben erhalten. Endgueltiges Freilassen zeigt
Art/Name/Level/ID/Box und Hinweis auf Teamverlust; Abbrechen Standardfokus,
kein Massenrelease. Aktiver Actor bekommt KEINEN Release-/Verschiebeknopf;
seine Namensaenderung delegiert an die bestehende native Pflege-Tastatur.

## Sicherheit und Darstellung
View-Aktionen/Mutationen waehrend Controller-Speicherung gesperrt. Bei
Schreibfehler bleibt das alte Modell und die Eingabe erhalten. Bei unklarem
Speicherabschluss Neu-Laden-Hinweis, kein behaupteter Rollback nach Commit.
Ungueltige/unbekannte Sammlung: schreibgeschuetzte Fehlerseite, nicht geleert.
Andere Native-Eingaben, Swipes und Menue unter Boxseite gesperrt. Aktive Pflege
laeuft weiter und synchronisiert ueber B3b; UI-Refresh nur bei Revisionwechsel,
keine Draft-Neuerstellung waehrend Editor offen. Animations-/Refresh-Timer nur
solange sichtbar, beim Schliessen entfernt. Verdecktes Hauptcanvas wird nicht
gezeichnet; vorhandene Performance-Kategorie Menue verwendet. Helles Layout,
44px-Bedienelemente, vertikales Scrollen, keine externen Medien eingebaut.

## Teststand
55 Assertions gegen echtes Modell und durable-model Session, eigener DOM-
Simulator: Auswahl/Name/Move/Team/Ersetzen/Release/aktives Umbenennen, voller Plan,
Quota-Ruecknahme, bestaetigter Release-Fehler, keine aktiven Loeschknopf,
Default-Browser-Bootstrap/Rootzustand, unbekannte Version und Timercleanup.
Das ist KEIN nativer/IndexedDB- oder echter Browsernachweis. Zwei Playwright-
Faelle fuer UI/Reload und synthetische Stored-Testfixtures/Quotafehler enthalten,
nur Syntax hier geprueft. Kein behauptetes WASM-/Chromium/WebKit-/iPhone-Gruen.
Der Installer fuehrt zwingend ALLE vorhandenen A/B1/B2/B3a/B3b-Tests plus UI aus.
Fruehere originale B3b-Dateien fehlen als Gesamtexport; Integration erfolgt
ueber enge, eindeutig gepruefte Anker, nicht blindes Ueberschreiben der main.js.
Box-Modell, card.js und expedition.js haben bekannte unveraenderte Quellhashes.

Noch offen im Gesamt-F4: Leiter-BIN-Einrichtung, Ordenkoffer, Quellen/Rechte,
GitHub-WASM-/Browsertor und iPhone-Abnahme. Kein Commit/Push/Branchwechsel
oder Deployment durch Installer. Aktuelle Web-App aendert sich dadurch nicht.
