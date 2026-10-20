# Paket C3: Minispiele und deutsche Oberflaeche

## Funktionen

Das Typenspiel verwendet alle 18 Verteidigungstypen und die echte Kampftabelle.
Drei verschiedene Antworten, genau eine sehr effektiv. Nach falscher oder zu
spaeter Antwort 700 ms Rueckmeldung (korrekte Antwort gruen, falsche rot);
waehrenddessen keine weiteren Fehlversuche. Danach neue Frage; nach drittem
Fehler Ergebnis. Die Antwortzeit bleibt 4,2 Sekunden. Keine neue Menueebene.

Die bestehende Ergebnisansicht zeigt Punkte/Runden/Treffer, tatsaechlichen
primaeren Trainings-/Pflegegewinn und Rekord. Rohwerte werden unmittelbar vor
und nach der ORIGINALEN Belohnungsfunktion gelesen, nicht aus einer ungekapp-
ten Formel geschätzt. 99 auf 100 ergibt +1; Maximum erhaelt eine Kurzmeldung.
Nebenwirkungen auf Freude/Energie bleiben unveraendert. Jedes Spiel vergibt
einmal seine Belohnung und stoesst eine normale Speicherung an, ohne Reload.

## Deutsch

Deutsch als Standard bei fehlender/ungueltiger Spracheinstellung. Eine
bewusst gespeicherte andere Sprache bleibt erhalten. Deutsche Typnamen in
Quiz, Pokedex und Kampf; deutsche Status-, Spiel-, Ergebnis-, Datei- und
Navigationstexte. Verbliebene Begriffe wie MEMO/SHINY/SCOUT in der deutschen
Kerntabelle ersetzt. Bisherige Komforttexte nennen Dateien/Grafiken statt
Assets/Sprites. Interne IDs, API-Namen und Dateiformate werden nicht umbenannt.

Eigene importierte Pokedex-Texte werden NICHT automatisch uebersetzt; die
passende deutsche Sprachdatei muss vorhanden sein. Systemeigene Browser-
Dialoge folgen weiterhin der Geraete-/Browsersprache.

## Bestehender Stand

A/B/C1 und vier feste C2-Expeditionen bleiben enthalten. C3 baut auf komfort-c2
auf, nicht auf main. Keine neuen Spielstandfelder. B-Sicherungen bleiben
verwendbar. Persoenlichkeit und Tagebuch sind noch offene Teile von Paket C.
Kein neues Toolbar-Menue und keine veraenderten Belohnungsformeln.

## Tests und Grenzen

Lokal erfolgreich: Native C++-Tests fuer Sprachstandard/-persistenz, deutsche
Texte/Namen, Rohwert-Getter und alle 18 Typen. Die reale C++-Typentabelle wird
fuer die JS-Tests ausgegeben. JS prueft 1000 Fragen, eindeutige Antworten,
Rueckmeldesperre, Zeitablauf, einmalige Belohnung und tatsächliche Obergrenzen.
Installer prueft den Ausgangs-Hash der unveraenderten Minispiel-Datei und
bearbeitet andere Quelldateien gezielt; Originale werden extern gesichert.

Noch ausstehend: Gesamtbuild des tatsaechlichen A+B+C1+C2+C3-Stands, dessen
Regressionstests, echter Browser und gemeinsame spaetere iPhone-Abnahme.
Workflow Test Paket C3 auf komfort-c3. Artefakt iTamaPoke-Paket-C3-Test.
