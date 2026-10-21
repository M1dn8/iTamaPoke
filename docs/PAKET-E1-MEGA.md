# Paket E1 - Mega-Glurak X

## Funktionsumfang
Optionale neunte Seite in der bestehenden Pokemon-Karte (nach oben wischen).
Nur bei aktivem Glurak, auch aus alten Spielstaenden. Bisherige Indizes 0..7
bleiben gleich. Profil-Link auf der ersten Seite; Rename-Hinweis wird fuer
Glurak nach oben verschoben, ohne Mega-Link/Seitennavigation zu ueberlagern.
Keine Hauptmenuekachel, keine Funktion unter Entwicklungen.

Einmalige Trainer-Freischaltung: Bindung >=50, alle vier Pflegewerte >=60,
drei positive abgeschlossene Trainingsrunden mit Glurak (Ball, Merken, Typen,
Boxsack). Keine rueckwirkende Gutschrift aus bisherigen Rekorden. Fang- und
Putzspiel zaehlen nicht als Kampftraining. Fortschritt gehoert zum Individuum,
Stein und Wiederaufladezeit dem Trainer. Neues Ei setzt Fortschritt/Form zurueck,
nicht Stein/Cooldown. Alte Saves starten mit unveraendertem Pokemon und 0/3.

Abholung und Aktivierung nutzen eine reversible Pet-/Preferences-Kopie bis
zum echten IndexedDB-Commit. Fehler stellt auch Journal/Cooldown/Stein zurueck.
E-Aktion sperrt Eingaben und den nativen Takt kurz; reale Spielzeit holt danach
wie bisher auf. Stale-Autosave-Epochensperre und bestehendes C2-Gate bleiben.
Keine Aktivierung bei Schlaf/Kampf/Dialog oder laufender anderer Speicheraktion.

## Dauer und Kampf
15 Minuten reale Geraetezeit, danach 60 Minuten Pause ab vorgesehenem Ende.
Gespeicherte Start-/End-/Cooldownzeit, kein Reset bei Neustart/Offline.
Rueckwaertssprung der Uhr beendet die Form konservativ und begrenzt die
anschliessende Sperre. Ohne vertrauenswuerdige Serverzeit kein umfassender
Schutz vor manueller Zeitmanipulation; normale Offline-Nutzung funktioniert.

Angriff x1.60, Verteidigung x1.40, Tempo x1.25 auf normale Werte inkl. Training,
abgerundet, auf uint16 begrenzt. Keine veraenderten Gene/Trainingswerte.
Mega-Glurak X: Feuer/Drache. Effektive Werte in Wertekarte und echtem Kampf.
Verteidigung erhoeht im bestehenden System auch abgeleitete Kampf-KP; kein
zusaetzlicher pauschaler KP-Multiplikator. Ausschliesslich Mega-Angriffe haben
im rundenbasierten Kampf 45% statt 35% gegnerische Max-KP als Trefferobergrenze.
Das ist ein vorlaeufiger eigener Balancewert; normale Kaempfe unveraendert.
Noch kein neues Attackenset: bestehende Angriffe nutzen weiterhin den primaeren
Typ Feuer, der Drache-Zweittyp wirkt auf die Typenberechnung der Verteidigung.

Beim Kampfstart wird der Mega-Zustand eingefroren. Ein begonnener Kampf endet
mit diesen Werten/Grafik/Typen auch nach Zeitablauf, neue Kaempfe danach normal.
Keine doppelte Bonusvergabe oder vergroesserten Kampfbelohnungen. Tagebuch:
Stein erhalten, Mega begonnen, Form beendet; keine zusaetzliche Dex-Art.

## Lokale Grafikdateien erforderlich
- p006-mega-x.bin: normale Mega-Form
- ps006-mega-x.bin: schillernde Mega-Form

Es muessen echte, gueltige TPK2-Dateien sein, keine umbenannten PNGs. Gleicher
Dateiimport wie bisher unter Einstellungen > Dateien. Keine Downloads und
keine mitgelieferten Pokemon-Grafiken. Schillernde Glurak verlangen die passende
schillernde Mega-Datei; keine stille Normalfarben-Ersatzgrafik. Fehlt/ist sie
ungueltig, startet keine Aktivierung und keine Wartezeit. Stein bleibt erhalten.
Dateinamen/Grafikinhalte lassen sich nicht auf die korrekte dargestellte Art
verifizieren; diese Zuordnung verantwortet die lokal geladene Datei.
Die Veroeffentlichungspruefung blockiert auch Mega-Dateinamen im Webpaket.

Der Grafikbeschaffungs-/Konvertierungsschritt fuer deine persoenlichen Dateien
ist NICHT durch diese Code-Erweiterung erledigt. Vor echter Mega-Abnahme muessen
passende Dateien bereitstehen. CI verwendet nur einen selbst erzeugten Pixel,
keine verteilten Pokemon-Bilder. Er testet Dateiformat/Zuordnung, nicht echte Art.

## Abnahme und Tests
Bestehender zentraler Prueflauf bleibt, dazu native E- und reale Battle-Bridge-
Tests sowie JS-Rollback-/Grafiknamenpruefung und Browserfaelle. Nicht mit dem
echten Spielstand testen/resetten. Vor Installation auf iPhone externe Sicherung.
Ohne Glurak bleibt die Oberflaeche unveraendert. Fuer echte Mega-Abnahme:
Aufgabe mit Glurak, Stein einmal abholen, Datei laden, aktivieren, Werte/Typen,
15-Minuten-Ende/60-Minuten-Sperre, Reload und Sicherung pruefen.
Vollstaendiger WASM-/Browserlauf muss auf GitHub noch erfolgreich sein.
