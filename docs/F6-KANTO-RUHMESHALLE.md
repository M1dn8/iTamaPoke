# Kanto-Ruhmeshalle und Siegerehrung — erster Belohnungsbaustein

Nur Ruhmeshalle/Siegerehrung/Siegerdaten. Kein Ehrenei, keine Zuchtauswahl,
keine legendaeren Ereignisse und keine weiteren Regionen in diesem Baustein.
Einstieg Liga unten links Ruhmeshalle. Nach neuem Champsieg automatische
Ehrung, sofern sichtbar; sonst bleibt sie manuell in der Ruhmeshalle abrufbar.
Die Feier kann ohne Mutation verlassen werden. Erst ausdruecklicher Abschluss
speichert die Bestaetigung mit der vorhandenen Liga-Undo/force/epoch-Transaktion.

Sieger: Art, tatsächlicher Spitzname, Shiny, Level der eingefrorenen Kampfwerte,
Megaform des Durchlaufs, Lebensnonce, Champvariante, Zeitstempel. Erster Eintrag
bleibt; weitere Eintraege behalten die elf juengsten Siege. Zaehler und drei
Variantenbits bleiben dauerhaft. Snapshot statt aktuell gepflegtem Pokemon.
Keine nachtraeglichen Sieger-/Varianteneintraege fuer alte lgkdone-Spielstaende:
Abschluss und vorhandenes Datum anerkannt, leerer Ehrenplatz mit Erklaerung.
Bei spaeteren Siegen werden nur tatsaechlich neu erfasste Erfolge gezaehlt.

Eigene handgezeichnete Canvas-Pixelkulisse mit Thron, Podest, Teppich und
acht dekorativen Medaillons. Keine fremden Bilder/Audio/BINs enthalten. Pokemon-
Darstellung ausschliesslich aus bestehenden lokal importierten Sprite-Dateien;
fehlende Grafik blockiert nicht den rechtmaessigen Sieger-Eintrag.

lhver1/lhdata: streng typisiert, begrenzte kleine Binaertabelle, FNV-Pruefsumme gegen
Beschaedigung, UTF-8 und Feldgrenzen geprueft. Unbekannte Zukunftsversion wird
nicht migriert/repariert; neue Liga-Laeufe werden verweigert, bis kompatibel.
Historie und Ehrung sind spielerweit und bleiben bei neuem Pflegeei erhalten;
Factory Reset loescht sie wie andere Trainerdaten. Normale Wild-/Arenakaempfe
und deren Belohnungen bleiben unveraendert.

Native Tests binden echte bestehende Liga-Transaktionen ein; Siegzustand in
Tests synthetisch gesetzt (kein 26-Kaempfe-Balancingbeweis). Drei komplette
Varianten mit finaler Speicher- und Ehrungsruecknahme. Erster plus elf neueste,
Identitaet, Nickname/Shiny, Legacy, alle Bytekorruptionen, Zukunftsmetadaten,
Neues-Ei/Reload/Reset. Browserfixture durch echten nativen Serializer erzeugt
und bei jedem Gate bytegenau gegen das mitgelieferte JSON verglichen. JS prueft
echten Renderer/Controller und Quota-/Single-flight-Ablauf. Neue Chromium-/
WebKit-Faelle pruefen Legacy, getrenntes aktives Pflegepokemon, Feier, echten
IndexedDB-Retry und Reload. Wirklicher Browser/WASM/iPhone erst nach deren
Ausfuehrung bestaetigt; Native/DOM-Simulation ersetzt keine Geraeteabnahme.
