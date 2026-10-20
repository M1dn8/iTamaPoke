# Paket C2: erweiterte Expeditionen - Testversion

## Umfang und bestaetigte Regeln

C2 erweitert die Expeditionen. A, B und C1 bleiben erhalten. Minispiele,
Persoenlichkeitsboni und das Tagebuch sind separate verbleibende C-Themen.
Keine NAS-Anbindung, neue Waehrung oder neue Fremdassets.

- Ziele: Erkundung (0), Beerenwiese/Nahrung (1), Quellpfad/Energie (2),
  Waldlichtung/Pflege (3), Trainingspfad (4). Alle ohne Level-Freischaltung.
- Dauer: 15/30/60 Minuten. Kosten 12/20/32 Energie; Trainingspfad +6.
- Nahrung, Freude und Hygiene jeweils mindestens 40. Nach Abzug bleiben
  mindestens 20 Energie. Kein Start als Ei, schlafend, waehrend Entwicklung
  oder Zeremonie oder solange eine Expedition/Abholung aussteht.
- Browseransicht sperrt Aktionen auch waehrend Kampf, Minispiel und Tastatur.
- Genau ein Gegenstand. Trainingswurf zuerst: bestehende Chancen 8/15/25,
  bei Durchschnitt >=60 und Bindung >=20: 13/22/35, bei Durchschnitt >=80
  und Bindung >=50: 18/30/45 Prozent. Trainingspfad +10 Prozentpunkte.
  Berechnung VOR Energieabzug. Kein Trainingsfund ohne Aufnahmekapazitaet.
- Bei anderem Fund gewoehnliche Gewichte 1:1:1, bzw. 3:1:1 zugunsten des
  Routengegenstands. Diese Prozente gelten bedingt auf einen gewoehnlichen
  Fund, nicht als Gesamtchance. Volle Faecher ausgeschlossen und Gewichte
  neu normiert. Browser zieht den gewichteten Roll ueber die aktuelle Summe.
- Nur Training aufnehmbar: 100 Prozent Training statt eines Fehlschlags.
  Die Ansicht weist auf eingeschraenkten Pool und fehlenden Zusatznutzen
  des Trainingspfads in diesem Fall hin.
- Inventarlimit weiterhin 3 pro Typ. Bei maximalen ATK/DEF/TEMPO-Werten ist
  Training kein sinnvoll aufnehmbarer neuer Gegenstand.
- Belohnung beim Start festgelegt. Keine Neuauswahl beim Neuladen/Abholen.
- Ein spaeter volles Fach oder maximales Training blockiert Abholung, loescht
  aber die gespeicherte Belohnung nicht. Inventar bleibt bedienbar, damit
  ein Fach geleert werden kann. Normale Gegenstaende duerfen nach expliziter
  Warnung auch ohne unmittelbaren Pflegeeffekt verwendet werden, um Platz
  zu schaffen. Training kann nicht nutzlos in einen maximalen Wert gesteckt
  werden. Ein blockierter Trainingsfund bleibt bis spaeterer Kapazitaet bestehen.
- Hintergrundauftrag: Pflege und Spiel bleiben moeglich; normale Zeit laeuft
  weiter. Keine neue Verletzung, Verlustchance oder zusaetzliche Abwesenheit.
- Die letzte Abholung wird als einzelne Ergebniszeile gespeichert. Das ist
  noch kein vollstaendiges Tagebuch.

## Bedienung

Die bestehende Expeditionskarte bleibt der Einstieg. Dort auf Expeditionen
 oeffnen tippen. Auch ein Tippen auf deren Inventar oeffnet die neue Ansicht.
Kein weiterer Toolbar-Knopf; der vorhandene Expeditions-Hinweis bleibt.

Die neue Ansicht zeigt Ziel/Dauer, Energiekosten und Restenergie,
tatsaechliche Trainingschance, gewoehnliche bedingte Fundverteilung,
Start-Sperrgrund, gespeicherte Route, Endzeit/Restzeit und Inventar.
Laufende und fertige Touren lassen sich nicht nachtraeglich umplanen.
Inventar kann auch bei blockierter Abholung verwendet werden.

## Speicherung und Sicherheit

Neue Felder: exroute, exstart, exmins, exchance, exlast, exlroute, exlwhen.
Bestehende Felder exend und exrwd behalten ihre Bedeutung.
Alte gueltige laufende/fertige Expeditionen werden NICHT neu ausgewuerfelt,
verkuerzt oder erneut bezahlt. Fehlende Route bedeutet Erkundung. Historische
Dauer/Startchance werden nicht erfunden; unbekannt wird ausdruecklich angezeigt.
Die neuen Felder werden in die bisherigen A/B-Spielstandformate aufgenommen.

Start, Abholung und Verbrauch sind in der neuen Browseransicht reversible
In-Memory-Aktionen: Klasse und Preferences-Map werden vorher kopiert.
Nach erfolgreichem IndexedDB-Commit wird neu geladen; Autosave bleibt bis
zur Navigation gesperrt. Bei Schreibfehlern werden Spielkern und Map auf den
Stand vor der Aktion zurueckgesetzt. Dauerhafte Speicherung im echten Browser
muss noch getestet werden. Keine Behauptung manipulationssicherer Zeitmessung:
Die lokale Geraeteuhr ist weiterhin die Zeitbasis.

## Lokale Vorpruefungen

Erfolgreich ausgefuehrt gegen bereitgestellten Kern mit C2-Patches:
- C++: alle Kosten, Energiegrenzen, Mindestversorgung, Start-Sperren,
  Versorgung/Bindung vor Abzug, genaue gewichtete Zyklen, volle Faecher,
  Nur-Training-Fallback, maximale Trainingswerte, Sperre paralleler Starts,
  Endzeit, Metadaten, erneutes Laden und alte Expeditionen, einmalige Abholung,
  blockierte Belohnungen und Ruecknahme von Kern+Map bei fehlendem Commit.
- JS: Syntax und simulierte DOM-Unit-Tests fuer Commit/Reload-Sperre,
  fehlgeschlagenes Speichern und benutzbares Inventar bei voller Abholung.

Noch ausstehend: vollstaendiger tatsaechlicher A+B+C1+C2-Build, alle A/B/C1-
Regressionstests auf GitHub, echter Browser/IndexedDB, iPhone-Abnahme.
Der neue Workflow Test Paket C2 auf komfort-c2 fuehrt die Regressionstests
und anschliessend den WASM-Build aus. Artefakt iTamaPoke-Paket-C2-Test.
Native Adaptertests nutzen ausschliesslich im Test einen Keepalive-Makro-
Stub; der echte WASM-Build nutzt den echten Emscripten-Header.

## Kuenstliche Testspielstaende (nur Mac-Testinstallation)

- C2-Start: Bisasam, Level 10, 25 aufgezogene Arten, Versorgung 80,
  Bindung 20, leeres Inventar. Ein C1-Eierplan Gen9/Pflanze ist mitgespeichert,
  damit dessen Erhalt bei C2-Aktionen ebenfalls geprueft werden kann.
- C2-Alte-Expedition-fertig: alte gespeicherte Energie-Belohnung ohne C2-
  Metadaten; Route muss als Erkundung erscheinen und genau einmal abholbar sein.
- C2-Fach-voll: fertiger Pflegefund, Pflegebestand 3/3. Abholung muss blockieren;
  Pflegegegenstand verwenden, dann genau einmal abholen, Bestand wieder 3/3.
- C2-Nur-Training: alle gewoehnlichen Faecher 3/3, Training 2/3 und Werte
  unter 100. Vorschau muss 100 Prozent Training und Poolwarnung zeigen.

Nicht auf dem iPhone einlesen. Keine echten Nutzerdaten und keine Grafiken
enthalten. Es gibt keinen Produktions-Schalter zur Zeitbeschleunigung.
