# Paket F2: Trainerkampf-Grundsystem und Verteidigungsbild

Basis: main, 284f12d94fff670c41132f10599eb571d88b2fe7 (nach abgenommenem F1).

## Enthalten
- Kampfseite: Wildkampf bleibt links; Trainer-Auswahl rechts.
- Einzelduell: ein Gegner (Dex 19). Teamduell: zwei Gegner (Dex 16, danach 19).
- Gegnerlevel entspricht beim Start dem Level des aktuellen Pflege-Pokemon.
- Spielerseite: nur das aktuell aufgezogene Pokemon; keine eigene Teamwahl.
- Bestehende Kampfmathematik, Typen und Aktionen bleiben unveraendert.
- Expliziter Gegnerwechsel: Rest-KP, maximale KP, verbleibende Erholungen und
  der Spieler-/Mega-Stat-Snapshot bleiben fuer die ganze Serie erhalten.
- Rundenlimit bleibt wie bisher pro Einzelkampf; Gesamtanzeige summiert die Serie.
- Kein kostenloses Heilen oder Auffuellen der Erholungen beim Gegnerwechsel.
- Trainer-Kampfsieg erst nach dem letzten Gegner; keine Zwischenbelohnungen.
- Keine Trainer-Fangoption (auch nicht nach knapper Niederlage), keine Eintraege
  in die Wildkampf-Siegesserie, keine neuen Trainingspunkte, Waehrungen, Marken,
  Orden, Mega-Fortschritt oder Trainer-Belohnungen.
- Trainer-Niederlagen und Abbrueche vergeben ebenfalls nichts; die bestehenden
  Wildkampf-Belohnungen und Wildkampf-Fangoptionen bleiben erhalten.

## Unterbrechung / Speicherung
Die Trainer-Serie ist in diesem Grundpaket absichtlich eine RAM-Sitzung.
App-Wechsel, pagehide, Neuladen oder Abbruch beendet sie. Kein Resume nach Neustart.
Dies steht auch in der Trainer-Auswahl. Es gibt keine neuen Save-Schluessel und
keine ausstehende Belohnung, die bei Wiederholung doppelt vergeben werden koennte.
Die normalen Pflege-/Uhrzeitregeln laufen unveraendert weiter.
Ein Wechsel des aktiven Pokemon oder ungueltige Pflegebedingungen beendet die
Sitzung; Attacken und Gegnerwechsel sind nativ abgesichert.

## Verteidigungstraining
- Vollstaendige elliptische Schutzhülle um die tatsaechliche gezeichnete Figur.
- Mit Abstand um alle Ecken des Sprite-Frames; passt sich an dessen Abmessungen an.
- Zwoelf gleichzeitig anfliegende blaue Punkte; sie bleiben ausserhalb der Huelle.
- Abwehrimpuls und Einschlagsringe beim Tippen; Effekte bleiben im Trainingsfeld.
- Zaehlung, Dauer, Kosten, Caps, Rekorde und Speichertransaktion aus F1 unveraendert.
- Punkte sind visuell: keine automatische Tippwertung und kein Reaktionstest.

## Bewusst nicht enthalten
Eigene Teams, Sechserteams, Arenen, Orden, Marken und neue Belohnungsregeln.
Keine Grafikdateien, keine Grafikdownloads, kein Zugriff auf den iPhone-Spielstand.
Keine Veraenderung der abgenommenen Mega-Namen, Mega-Groessen oder Mega-Balance.
Keine Veraenderung des CI-Containers, seiner Versionen oder seiner Teststrenge.

## Pruefung vor Auslieferung des Installers
- Vollstaendiger zentraler nativer und JavaScript-Vorprueflauf erfolgreich.
- Bestehende F1-, E1/E2/E3-, Save-/Rollback-, UI- und CI-Integritaetstests erhalten.
- Native F2-Tests direkt gegen Produktionsbridge und reale Kampfmathematik:
  Startbedingungen, falsche Auswahl, Kampfeigentum, Rest-KP/Erholungen,
  Gesamtwerte, einfache Gegnerwechsel, Verlust/Abbruch, Identitaetswechsel,
  keine Trainer-Belohnungen/Fangoption und unveraenderter Wildkampfpfad.
- 40 echte berechnete Trainer-Serien mit vorbereiteter starker Testfigur.
- Zusaetzlicher nativer UndefinedBehaviorSanitizer-Lauf erfolgreich.
- UI-Tests gegen echten Controller und Zeichencode: Eingaberouten,
  Hintergrundabbruch, Schutzhülle fuer drei verschiedene Sprite-Formate,
  zwoelf visuelle Punkte und keine dadurch erzeugten Tipps.
- Echter Emscripten/WASM-Build und Playwright Chromium/WebKit hier NICHT ausgefuehrt.
  Neue Browserfaelle sind in tools/browser-tests/specs/trainer.spec.js enthalten
  und werden vom unveraenderten GitHub-Prueftor automatisch ausgefuehrt.
- Die drei vom aktuellen Text-Export ausgelassenen .inc-Hilfsdateien wurden fuer
  lokale native Tests aus dem vorherigen Quellstand entnommen. Der Installer
  prueft deren bekannte SHA256-Werte im echten Repository und bricht bei jeder
  Abweichung ab; er schreibt diese Hilfsdateien nicht um.
- Echte iPhone-Abnahme steht noch aus.

## Lokaler Ablauf
Installer auf sauberem main am obigen Commit ausfuehren. Er prueft die Basis,
legt Originale ausserhalb des Repositories ab und erstellt battle-trainer-f2.
Kein automatischer Commit, Push oder Deployment. Erst Branch-CI pruefen,
danach main uebernehmen und gemeinsam Trainerkampf und Schild auf iPhone abnehmen.
