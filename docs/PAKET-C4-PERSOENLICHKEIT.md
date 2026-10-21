# C4 - Persoenlichkeit

## Regeln und Darstellung

Bestehende Wesenskarte, keine Auswahl und kein Zusatzmenue. Fuenf Wesen:
Ausgeglichen, Verspielt, Mutig, Ruhig und Gemuetlich (statt Traege).
Kurze Ursache und Bonusbeschreibung; bisherige sechs Rekorde bleiben.
Aktuelle Stimmung/Erschoepfung und persoenliche Praegung sind getrennt.

Vier individuelle Achsen 0-10: Spielen, Kampfsiege, wirksame Pflege, Erholung.
Passendes Ereignis +2, andere Achsen -1 (Minimum 0). Je Kategorie maximal
ein Ereignis pro 10 Spielminuten. Neues Wesen ab 6 und mindestens 2 Vorsprung.
Ohne klaren neuen Schwerpunkt bleibt das bestehende Wesen. Alle Achsen <=2:
Ausgeglichen. Zwischen Wechseln mindestens 30 Spielminuten; eine bereits
qualifizierte Richtung wird nach Ablauf der Sperre auch im Minutentakt geprueft.

Spielen: abgeschlossenes Minispiel mit mindestens einem Punkt/Runde/Treffer.
Kampf: Sieg. Pflege: tatsaechlicher Zugewinn an Nahrung/Freude/Energie/Hygiene/
Bindung oder beseitigter Schmutz. Volle Balken ohne Wirkung zaehlen nicht.
Pflege-Minispiel zaehlt als Spiel, nicht doppelt als Pflege.
Schlaf: 30 zusammenhaengende Spielminuten; hoechstens eine Praegung je
Schlafphase. Live und offline beruecksichtigt; Phase/Markierung gespeichert.

## Kleine Boni

- Ausgeglichen: +1 Freude bei Spiel/Pflege/Kampfsieg.
- Verspielt: +2 Freude nach Spielen.
- Mutig: +2 Freude nach Siegen.
- Ruhig: +1 Bindung bei wirksamer Pflege.
- Gemuetlich: +2 Energie beim Aufwachen nach tatsaechlich gezaehltem Schlaf.
  Die 30-Minuten-Schwelle gilt fuer Praegung; fuer Aufwachen-Bonus muss
  mindestens eine Spielminute geschlafen worden sein. Sofortiges Umschalten
  erzeugt nichts. Ist nach langem Schlaf Energie 100, gibt es keinen Gewinn
  und keinen Bonusverbrauch.

Gemeinsamer Bonusabstand 30 Spielminuten, maximal drei pro bestehendem
Spieltag (gleiche Tagesgrenze wie die anderen Spielsysteme). Keine Ausgabe
an einem erreichten Maximum und kein Verbrauch ohne echte Wirkung.
Budget/Abstand gelten ueber Wesenswechsel UND neue Eier hinweg. Dafuer ein
persistenter monotoner Spielminutenzaehler, unabhaengig vom Alter des Tiers.
Der Bindungsbonus zaehlt in den vorhandenen Aktions-Bindungszaehler mit
Limit acht. Dieser wird nun ebenfalls gespeichert und gegen Ueberschreiten
bei mehrpunktigen Gewinnen abgesichert. Der bestehende separate Tages-/
Pflegeserien-Grundbonus bleibt unveraendert.
Alte wesensabhaengige Zusatzeffekte aus interactPet werden nicht gestapelt;
der bisherige unabhaengige Abendbonus bleibt erhalten.

## Anbindung

Normale Browseraktionen caress/feed/clean, sinnvolle Gegenstandsverwendung,
Pet-Ereignisse und interactPet melden Pflege. Minispiele inkl. Boxsack melden
Spiel; applyBattleWin meldet Sieg. Keine Abhaengigkeit von einem nur im
nativen Port genutzten Interaktionsaufruf. Originale Primaerbelohnungen
bleiben bestehen; die kleinen C4-Boni kommen begrenzt hinzu.
Keine neuen Kampfwert-, Expeditions-, Ei- oder Shiny-Modifikatoren.
Bestehende Regeln, die Bindung beruecksichtigen, gelten natuerlich weiter.

## Lebenszyklus und Speicher

Entwicklung behaelt Wesen/Praegung. Neues Ei/Schluepfen setzt individuelle
Praegung zurueck, nicht Spielerrekorde/Sammlung oder gemeinsames Bonusbudget.
Alte Spielstaende uebernehmen einmal die bisher angezeigte Kategorie und
starten deren Achse mit sechs Punkten. Danach wirken keine Lebenszeitrekorde
mehr auf neue Wesen. Sicherungen aus B nehmen alle C4-Felder mit.

NVS-Felder psver/pskind/psvec/psevt/psmask/pschg/pstchg/pssleep/psrest,
psclock/psday/psused/psbonus/psbst/psbond/psbday. Eingelesene Bereiche werden begrenzt.
Kein neuer Exportcontainer und keine UI-Anzeige der internen Punktetabelle.

## Pruefungen und Grenzen

Lokal native Tests: Praegung/Cooldowns/Hysterese, wirkungslose Pflege,
Bonusabstand/Tagesbudget/Maxima/Bindungsgrenze, Schlaf live/offline mit Reload,
Migration, Entwicklung, neue Eier und Budget gegen Geburts-Farming.
JS-Test: fuenf deutsche Anzeigen, Gruende/Boni und sechs vorhandene Rekorde,
keine neuen Menues. Gesamtbuild des tatsaechlichen A/B/C1/C2/C3/C4-Stands und
Regressionen sowie echter Browser sind noch ausstehend. Gemeinsame iPhone-
Abnahme weiterhin spaeter. Workflow Test Paket C4 auf komfort-c4.
Tagebuch bleibt der naechste offene Paket-C-Teil.
