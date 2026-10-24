# Kampfenergie: Arena25, Top Vier50 gesamt, Champ30

Kosten pro Versuch/Abschnitt, niemals pro Pokemon oder Runde. Reserve20 nach
Bezahlung: Arena braucht45, TopVier70, Champ50. Reine Kampfkosten bei100:
50 nach TopVier, 20 nach Champ. Bisherige Pflegeabzuege kommen hinzu; eine
kurze Erholung vor Champ kann deshalb auch dann sinnvoll sein. Auch bei sinkender Pflege-
energie KEINE weitere Energiepruefung innerhalb der20 TopVier-Pokemon. Bestehende
freiwillige/technische Checkpoints bleiben; keine erneuten Kosten bei Fortsetzung.
Nur vor Champ wird bei Bedarf eine kurze externe Erholungsphase verlangt.

Arenakosten werden mit vorhandenem F4-Ganz-Pet/Preferences-Undo vor Kampfbeginn
vorbereitet und per force/epoch gespeichert. Kampf wird erst nach durablem Commit
aufgedeckt. Fehlschlag schliesst tentative Serie und rollt Pet/Store zurueck.
Niederlage/Abbruch nach Start erstatten nichts. Wiederholte Arenasiege kosten25
wie jeder neue Versuch. Separater Ordensspeicherfehler erstattet den Eintritt
nicht: dessen Undo beginnt erst nach der bereits bezahlten Serie.

Liga benutzt eigenen bestehenden Undo: 50 einmal beim Durchlaufstart, 30 einmal
beim Start des Champ-Abschnitts an Index20. Alle anderen gespeicherten Gegner-
wechsel sind kostenlos. KP, eingefrorene Kampfwerte, 5 Heilungen und bisherige
Fang-/Trainings-/Siegerehrungsregeln bleiben. Heilungen erzeugen keine Pflege-
energie. Normale Erholung und Energiegegenstaende werden nicht geaendert.

Kein neues Save-Schema; bestehendes ene-Feld. Alte pausierte TopVier-Laeufe
werden nicht nachtraeglich belastet. Ihr noch nicht begonnener Champ kostet30.
Laufender Kampf bleibt wie bisher nicht mid-turn wiederaufnehmbar. Neuer Versuch
nach Verlust/Abbruch kostet wieder. Keine Rueckerstattung bei altem Backup-Restore
als Online-Sicherheitsversprechen; weiterhin lokales Spiel.

Browser-WASM nutzt echte Energiepolitik. Alte isolierte Native-Altsuiten bleiben
in ihrem bisherigen Umfang; eigene neue Native-Suite aktiviert reale Energie-
Arenen und den tatsaechlichen Ligakern. 20 TopVier- und 6 Champ-Uebergaenge mit
synthetischen Siegzuständen; echtes Care-/Store-Undo, Grenzen, Wiederholungen,
Speicherfehler, Nullenergie innerhalb TopVier und unveraenderte KP/Heilungen.
Champ-Browserfixture wird mit echtem Ligacode erzeugt und im Gate verglichen.
Neue echte Chromium/WebKit-Faelle fuer Kosten, Quota, Abbruch/Reload, freien
Gegnerwechsel und Champ-Grenze. Kein balancierter Komplettkampf-/Geraetebeweis
allein aus Native/VM-Tests. Keine bisherigen Testasserts/Timeouts abgeschwaecht.
