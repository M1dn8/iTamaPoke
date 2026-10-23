# F4-B3a: dauerhafte individuelle Wildfaenge

Basis: Nutzer-TXT 20261023-164145-897f0153, f4-collection-a,
HEAD 977c0f7814adde840504295ccfcd36dda9ed6ddb. Dies ist der Wildfang-Teil
von B3, NICHT das gesamte F4 und noch keine Pflege-/Abschiedsanbindung.

## Aktivierter Pfad nach einem passenden WASM-Build
Die bestehende Fangtaste nutzt den neuen Capture-Adapter und den realen
A-Modell/B2-Controller. Erfolgreiche Faenge erzeugen individuelle Exemplare
mit Art, tatsächlichem Wildlevel und Kampfwerten, Herkunft wild und bekanntem
Zeitpunkt. Wilde Gene/Training sind null, nicht gewuerfelt oder rueckgerechnet.
Wilde Gegner sind im bestehenden Spiel nicht schillernd; das wird unveraendert
abgebildet. Doppelfaenge derselben Art erzeugen verschiedene IDs.

Fangbits, bisherige Fangfolgen/Belohnungen und Sammlung werden atomar als ganzer
Spielstand geschrieben. Kein neues Fangwahrscheinlichkeits-/Kampfmodell.
Fehlfaenge erzeugen kein Individuum. Ein alter Artennachweis erzeugt keines.
Kein eigenes Individuum fuer Trainer-/Arena-Pokemon, keine Teamkaempfe.

## Kein Ergebnis-Farming durch Speicherruecknahme
Native Ruecknahme umfasst Pet, gesamten Preferences-Store und Fangflags.
Das schon berechnete Ergebnis und sein erster Zeitpunkt bleiben nur in der
laufenden Kampfsitzung als Wiederholungswert erhalten. Wiederholen nach einem
Schreibfehler wuerfelt NICHT erneut. Derselbe Erfolg/Misserfolg wird mit den
unveraenderten Pet-Erfolgsfunktionen genau einmal erneut angewendet. Die
vorhandenen Chancegrenzen ermoeglichen deterministische Replaywerte 0/99.
Neuer Kampf/Schliessen beendet diesen Cache. Keine Kampf-Wiederaufnahme ueber
App-Neustart versprochen; bestehende RAM-Sitzungsregel bleibt.

Der Model-Kapazitaets-/Groessencheck erfolgt vor dem nativen Versuch/RNG.
200 belegte Boxplaetze: Hinweis und gesperrte Fangtaste, kein Versuch/Verlust.
Bei zu grossem Datenfeld wird ebenfalls vor Versuch abgewiesen. Root-Datenfeld-
limit bleibt 262144 Bytes; keine Saveparser-Grenzen angehoben. Standardablage
ist vorerst Box 1 bzw. naechste freie, da die Boxauswahl-UI noch aussteht.
Der Adapter kann eine explizite Boxnummer entgegennehmen, ohne UI vorzugreifen.

Fangton erst nach Speicherbestaetigung. Temporäre Capture-Sounds inkl. nativer
Meilenstein-Sounds werden waehrend der vorbereitenden Ruecknahmephase unterdrueckt;
nach Erfolg ertönt der Fangton, der bestehende Medaillen-/Meilensteinzustand
bleibt erhalten. Fehlgeschlagene Speicherung zeigt keinen bestaetigten Fang.

## Pokeball-Hinweis
Die bestehende native bereits-gefangen-Abfrage bleibt die Quelle: historische
Fangbits zaehlen, blosse Aufzucht/Registrierung nicht. Der bisherige Platzhalter
wird durch einen neu gezeichneten Pokeball neben dem Gegner-KP-Balken ersetzt.
Keine heruntergeladene Bilddatei, kein Fangsperren fuer bekannte Arten.
Historische Nachweise werden nicht geloescht. Fehlende/defekte Sammlung wird
nicht still ersetzt; der Fangpfad bleibt gesperrt mit Hinweis.

## Tests
Reale Pet-/Battle-/Store-Bruecke in der Produktions-F4-Verzweigung getestet.
40 Seeds mit Erfolgen und Fehlschlaegen; exakte Ruecknahme, Respektfang,
veraltete Tokens, unveraenderter RNG-Fortgang bei Retry, keine doppelten Freude/
Bindung-/Sammlungs-Meilensteinbelohnungen, Actor-Identitaetsguard, kein Arena-
Fang, Erhalt bei neuem Ei und Entfernung beim Profilreset.
F3-Nativtests werden zusaetzlich mit der F4-Verzweigung und echter Store-Bruecke
kompiliert. Keine bestehenden Assertions entfernt, keine Workflow-/Retry-/
Timeout-/Containeraenderungen. Eigenes JS-Capture-Protokoll gegen die echten
A/B2-Module mit simuliertem Native/IndexedDB-Backend; reales Routing/Zeichen-
programm separat aufgerufen. Alter A/B1/B2-Regressionslauf bleibt erhalten.
Zwei Playwright-Tests enthalten, nur Syntax lokal geprueft. KEIN behaupteter
WASM-/Chromium-/WebKit-/iPhone-Lauf in dieser Umgebung.

## Bewusst offen
Aktives Pflegewesen einmalig zuordnen, Lebenszyklus-/Entwicklungs-Sync und
Abschied/Behalten/Freilassen/Weglaufen folgen als gemeinsamer B3b-Schritt.
Bisheriges Pflegeende ist in B3a unveraendert; kein vorgetaeuschtes Behalten.
Ein alter lokal liegengebliebener WASM-Build wird vor neuen Native-Aufrufen
erkannt; der Fangpfad zeigt eine Build-Meldung statt unbekannte Exporte
aufzurufen. Die Box-/Teamoberflaeche folgt danach. Noch nicht auf main veroeffentlichen.
Leiter-BINs, Ordenkoffer, Rechteverzeichnis und volle Geraeteabnahme stehen aus.

## Installation
Auf dem unveraenderten uncommitteten B2-Branch. Installer prueft Quellhashes
und exakten Git-Arbeitsstand, sichert Originale ausserhalb, schreibt nur seine
Ziele und fuehrt den vollstaendigen lokalen Runner automatisch aus.
Bei Fehlern Ruecknahme auf B2; keine parallel veraenderten Dateien blind
ueberschreiben. Kein Commit, Push, Branchwechsel, Deployment oder Zugriff
auf den echten Browser-/iPhone-Spielstand waehrend Installation.
