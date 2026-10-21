# E2 - Anzeige von Mega-Metagross verkleinern

Erster iPhone-Abstimmwert: 75 Prozent der bisherigen linearen Darstellungsgrösse.
Nur geladene Mega-Form 2 (Mega-Metagross), normal und schillernd. Normales
Metagross, Gegner-Sprites ohne Mega-Markierung und andere Mega-Formen bleiben
unverändert. Die Markierung liegt nur am dekodierten Grafikobjekt im RAM;
sie wird nicht im Spielstand oder in der BIN-Datei gespeichert.

Die vorhandene Bodenlinien-/Zentrierungsberechnung bleibt unverändert.
Gemeinsame Skalierungsfunktion wirkt auf Hauptansicht, Profil, Ballspiel und
Kampfdarstellung. Beim aktuell verwendeten 146x118-Asset: Zoom 2 -> 1.5.
Originalgrafik, Animationsframes, Laufzeiten und TPK2-Format bleiben unverändert.
Keine Anpassung von Kampfwerten, Aufgaben, Steinen, Dauer oder Cooldown.

Regression: nur Mega-Objekt 2 verkleinert; normale Objekte/andere Formen über
viele Bildgrössen identisch; normale und schillernde Loader-Zuordnung;
unveränderter Boden-/Mittelpunkt im echten drawPet-Pfad; keine Abhängigkeit
vom aktuellen Mega-Status während eines bereits gestarteten Kampfes.

Vollständiger GitHub-Prüflauf vor Veröffentlichung. Danach neue Version laden;
vorhandene BIN nicht neu erzeugen/importieren. iPhone-Grössenabnahme bleibt offen.
