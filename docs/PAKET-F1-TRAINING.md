# F1 - drei direkte Kampftrainings, GEW aus der Kampfseite

Quelle: main a7477d321f23c6f9174ecedf2915f8a93be8018d, Export 132 Dateien.
Nur Training; keine Trainerkaempfe, Teamwahl, Marken oder Arena-Orden.

Kampfseite: drei Balken Angriff/Verteidigung/Tempo, darunter drei direkte
44-Pixel-Trainingsbuttons Staerke/Tempo/Verteidigung. Bestehender Wildkampf
bleibt am bisher getesteten Punkt erreichbar. GEW wird nicht mehr abgefragt
oder dargestellt. Interner wgt-Zustand und seine bestehenden Regeln bleiben;
es werden keine Kilogrammwerte erfunden und keine Artgewichte geladen.

Drei Runden zu 10 Sekunden, sofortiger Zaehler. Ein Punkt je vier gueltigen
Tipps, maximal 18, Trainingswert maximal 100. Ergebnisse zeigen tatsaechlichen
Zuwachs. Kosten wie bisher positiver Boxsacklauf: Energie minus 12 (bestehender
Boden 5), Nahrung minus 5 (Boden 5), Freude plus 6, Bindung wie bisher plus 2
mit bestehendem Tageslimit. Bisherige Gewichts-/Persoenlichkeitsregeln beim
Training bleiben. Null-Tipp-Runde im neuen System: keine Vergabe/Kosten/Rekorde.
Ein bis drei Tipps: kein Trainingspunkt; keine falsche Maximum-Meldung.
Positive absolvierte Runde zaehlt einmal fuer die bestehende Mega-Aufgabe,
auch bei bereits maximalem Trainingswert. Kein Credit pro einzelner Beruehrung.

Native Stat-IDs unveraendert: 0 Angriff, 1 Verteidigung, 2 Tempo. UI-Reihenfolge
Staerke, Tempo, Verteidigung wird ausdruecklich auf 0/2/1 abgebildet. Alte
Staerke-Rekorde shi bleiben; neue optionale Spieler-Rekorde sphi/dfhi beginnen
bei alten Saves bei 0 und bleiben wie die bisherigen Highscores nach neuem Ei.
Keine Mega-Balance- oder Save-Format-Neudeutung. Legacy-Sack-API bleibt erhalten.

Native Session hat Token, Uhrzeit-/Identitaets-/Wachheits-/Kampf-/Zeremonie-
Guards. In der Runde keine Pet-/Save-Aenderung durch Tipps. Bei Abschluss
reversible Vergabe mit Pet/Preferences-Backup, IndexedDB-Bestaetigung vor
Erfolg und Ruecknahme bei Schreibfehler. Frame-tp_tick pausiert nur waehrend
laufendem Trainings-Commit; stale Autosaves werden wie bisher ueber Epoch-Gate
abgewiesen. Tokens verhindern spaete/doppelte Abschluesse.

Tapzaehlung auf primaerem Pointerdown; normales Pointerup erzeugt deshalb
keinen zweiten Treffer. Sekundaere Finger werden ignoriert. Kein beliebiger
niedriger Tippgeschwindigkeitsdeckel; zeitgleiche doppelte native Ereignisse
werden ignoriert. Abbrechen und Hintergrundwechsel waehrend laufender Runde
geben keine Punkte/Kosten. Eine Vordergrund-Unterbrechung ueber 2 Sekunden
bricht ebenfalls ab. Keine vorzeitig oder deutlich verspaetet vergessene Runde
wird belohnt. Ein bereits laufender Speicher-Commit wird nicht blind abgebrochen.

Grafiken: vorhandene Lauf-/Angriffsaktionen werden verwendet, sonst offen
kommunizierte bewegte Grundanimation. Keine fehlenden Spezialgrafiken werden
als vorhanden ausgegeben. Tempotraining bewegt das Pokemon pro Tipp auf einer
Laufstrecke, Verteidigung zeigt Schild-/Abwehreffekte; keine Reaktionszeitpflicht.
Graficdateien und 0.75-Faktor fuer Mega-Metagross unveraendert.

Neue Native-/JS-Pruefungen plus isolierte echte Browserrunden fuer alle drei
Arten, Reload/Highscore, Speicherfehler und Hintergrundabbruch. Bestehende CI-
Container-, Artefakt-, Mega-, Namens- und Groessenpruefungen bleiben aktiv.
Echter WASM-/Browser-Gesamtlauf und iPhone-Bedien-/Darstellungsabnahme offen.
Aktuellen Spielstand extern sichern, bevor F1 nach gruenem Branch-Lauf
veroeffentlicht wird. Quellcode-Backup ist keine Spielstandsicherung.
