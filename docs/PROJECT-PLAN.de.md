## P07 — Planungsgrundlage freigegeben

<!-- P07-PLAN-FREIGEGEBEN-20261105 -->
Nutzerfreigabe: 05.11.2026, 23:13 CET.
UI01 abgenommen. Nächstes Paket: Legendären-Geschichten Johto.
Teilfolge: P07a Suicune, P07b Raikou/Entei, P07c Lugia/Ho-Oh,
P07d Celebi und Abschluss.
Storyideen und Gestaltungsrichtung angenommen; konkrete Regeln und
Geschichten morgen finalisieren. Keine Umsetzung bereits behaupten.
Verbindliche Details: [P07-UEBERGABE.de.md](P07-UEBERGABE.de.md).

---

## UI01 abgenommen — 05.11.2026, 23:06 CET

<!-- UI01-ABGENOMMEN-20261105 -->
Dokumentiert: 2026-11-05T23:07:36+01:00
Lokaler Quell-HEAD zum Zeitpunkt der Abnahmedokumentation: c1d4dc20858935748a03f45e51bd061ef61ea596

### Verbindliche Nutzerrückmeldung
- GitHub-Build grün.
- Abnahme auf dem iPhone bestätigt.
- Grafiken funktionieren.
- Wildkampf und Fangen funktionieren.
- In Arena- und Ligakämpfen können nach einem K. o. andere
  einsatzfähige Teammitglieder eingewechselt werden.

UI01 ist damit für den vereinbarten Umfang abgenommen.
Keine zusätzliche Team-Erweiterung für normale Trainerkämpfe beschlossen.
Die Bestätigung ist keine Aussage, dass jede optionale Regression,
jedes Gerät oder jede denkbare Spielsituation geprüft wurde.

### Erhalten
- Fang-/Aufnahmesicherheit und genau einmalige Speicherung.
- Wiederaufnahme in der bestehenden Gerätehülle.
- Arena-Sechserteam und Pflichtwechsel.
- Kanto-Variantenanzeige aus gespeicherten Nachweisen.
- Private Grafikpakete einschließlich registrierter Trainer/B-Porträts.
- Vereinbartes Releaseprofil sowie Speicher-, Medien- und Kandidatenschutz.

### Nachverfolgung
Die frühere Beobachtung Metagross/Aerodactyl wird nicht als
ursächlich geklärt behauptet. Bei erneutem Auftreten den konkreten
Zustand vor dem Boxen-Workaround sichern und separat untersuchen.
Bereits abgenommene Oberflächen nicht deshalb erneut umgestalten.

### Weiterarbeit
- Keine erneute UI01-Gesamttestschleife ohne konkreten neuen Fehler.
- Nächstes vorgesehenes Paket: P07, Legendären-Geschichten Johto.
- P07 ist noch nicht begonnen; zuerst Umfang und vorhandene Grundlagen abgleichen.
- Bestehende Arbeitsweise, Revisionsbrowser und gesichertes Profil erhalten.
- Keine privaten Medien oder echten Spielstände veröffentlichen.

---

## Veröffentlichungsstand UI01 — 05.11.2026

<!-- UI01-VEROEFFENTLICHUNGSSTAND-20261105 -->
Dokumentiert: 2026-11-05T22:46:26+01:00

### Lokal bestätigt
- Fangabschluss und Wiederaufnahme: vier Browserfälle in Chromium/WebKit bestanden.
- Offene Aufnahme nach Reload nutzt die bestehende Gerätehülle.
- Aufnahme genau einmal; Team/Pflegeidentität erhalten; Weiter wieder erreichbar.
- Arena-Sechserteam: acht Fälle in Kanto/Johto und Chromium/WebKit bestanden.
- Frischer Liga-Team-Pflichtwechsel in WebKit bestanden.
- Kanto-Variantenanzeige: acht Fälle für Masken 0, 1, 3 und 7 bestanden.
- Variantenanzeige liest gespeicherte Nachweise; Mew-Regeln nicht geändert.
- Nutzer bestätigt Grafikpakete erstellt und auf dem iPhone importiert.
- Neue gezielte Browsergruppen sind in der verbindlichen Freigabeauswahl.
- Kurze Syntax-/Vertrags-/Erfassungsprüfung für diesen Veröffentlichungsstand bestanden.

### Veröffentlichung und Abnahme
- Dieser Stand wird für Commit/Push vorbereitet.
- Neuer GitHub-Lauf und Deployment sind noch separat zu bestätigen.
- Kein vollständiger lokaler Browser- oder Native-Gesamtlauf wiederholt.
- Keine vollständige iPhone- oder UI01-Gesamtabnahme behaupten.
- P07 bleibt bis zum UI01-Abschluss zurückgestellt.

### Verbleibender gezielter iPhone-Abgleich nach Veröffentlichung
1. Erfolgreicher Fang mit vollem Team: Entscheidung, Boxablage und Weiter.
2. Offene Aufnahme nach vollständigem Schließen/Neustart: aktuelle Hülle,
   bedienbare Entscheidung und keine doppelte Aufnahme.
3. Kanto-Variantenanzeige sowie Liga-/Top-Vier-Grafiken sichtbar prüfen.
4. Ursprünglichen Pflegeabgleich Metagross/Aerodactyl und Liga-Abbruch
   bei Wiederauftreten mit konkretem Spielstand eingrenzen.
   Nicht allein wegen grüner frischer Testteams als behoben markieren.

Bestätigte Gestaltung erhalten. Keine Originalmedien oder echten Spielstände
zurücksetzen; Grafikpakete bleiben außerhalb des Repositorys.

---

## Aktueller Abschlussabgleich UI01 — 05.11.2026

<!-- UI01-ABSCHLUSSABGLEICH-20261105 -->
Dokumentiert: 2026-11-05T22:03:26+01:00
Basis-HEAD: b62b538fb12e5f654d747a46d5573c8e3ee96dcd

### Bestätigte Ergebnisse dieser Sitzung
- Fang-Aufnahmereihenfolge: Fehler am alten Code reproduziert, Korrektur geprüft.
- Rückgabe nach Aufnahme: Neuzeichnung der Kampfknöpfe abgesichert.
- Vier Fang-Browserfälle in Chromium/WebKit bestanden:
  volles Team, verzögerte Speicherung, Boxentscheidung, Weiter,
  offene Aufnahme nach Reload und genau einmalige Ablage.
- Acht Arena-Sechserteam-Fälle in Kanto/Johto und Chromium/WebKit bestanden:
  alle Mitglieder auswählbar, Pflichtwechsel ohne Extrazug,
  besiegtes Mitglied gesperrt, Fortsetzung gegen nächsten Gegner.
- Frischer Liga-Team-Pflichtwechsel in WebKit bestanden.
- Keine zusätzliche Team-Erweiterung für Wild- oder normale Trainerkämpfe beschlossen.
- Arena-Kampflogik nicht neu implementiert; vorhandenen Sechserteam-Pfad geprüft.
- Änderungen dieser Sitzung noch nicht veröffentlicht.

### Verbindliche Restreihenfolge
1. Aufnahme-Wiederansicht nach Reload an die bestehende UI01-Gerätehülle anschließen.
   Funktionsnachweis ist keine sichtbare Abnahme dieser Wiederansicht.
2. Pflegeabgleich Metagross/Aerodactyl und ursprünglichen Liga-Befund gezielt klären.
   Keine Spielstandidentitäten oder alten Läufe auf Verdacht verändern.
3. Grafikpaketwerkzeug an die vollständige bestehende Trainerregistrierung anbinden.
   Danach vorhandene echte BINs außerhalb des Repositorys neu verpacken.
4. Gezielte restliche Sichtprüfung, Veröffentlichung über das Releaseprofil,
   anschließend iPhone-Prüfung von Fang, Wiederaufnahme und Liga-/Top-Vier-Grafiken.
5. UI01 erst nach Klärung beziehungsweise ausdrücklicher Entscheidung über die
   verbleibenden Befunde abschließen. P07 bleibt zurückgestellt.

### Freigabe und Arbeitsweise
- Neue Fang-, Arena-Sechserteam- und Liga-Pflichtwechselgruppen in Releaseauswahl.
- Native-/Speicher-/Medien- und Kandidatenschutz unverändert.
- Kein zusätzlicher vollständiger lokaler Browser- und Native-Gesamtlauf.
- Erweiterte Gesamtregression bleibt ausdrücklich separat und manuell.
- Bestehenden Revisionsbrowser und dessen gespeichertes Profil verwenden.
- Keine Originalmedien, Spielstände oder bisherigen Sicherungen überschreiben.
- Bereits bestätigte Gestaltungen nicht erneut bearbeiten.

---

<!-- UI01-TAGESABSCHLUSS-20261103-2306 -->
## Aktueller UI01-Stand — 03.11.2026, 23:06 CET

GitHub grün laut Nutzer; erste iPhone-Prüfung positiv.
Vollständige iPhone-Abnahme noch offen.
Verbindliche Restpunkte: Pflege-/Sammlungsabgleich Metagross/Aerodactyl
vor Wildkampfstart, private Grafikpakete und gezielte Liga-/Top-Vier-Grafikprüfung.
P07 bleibt zurückgestellt. Heute keine weiteren Tests oder Änderungen.
Maßgeblich: [aktuelle Übergabe](UI01-UEBERGABE.de.md).
Ältere Planstände darunter nicht als erneut offene Pflichtliste behandeln.

---

# Projektplan — iTamaPoke

## Aktueller Haltepunkt — Statusseite

Stand: 01.11.2026, 18:15 CET

- Nutzerbewertung am 01.11.2026 um 18:12 CET:
  erster Entwurf ganz okay, aber Gestaltung, Bedienung und Informationen
  müssen gemeinsam nachgearbeitet werden.
- Vier Rubriken sind freigegeben: Profil, Werte, Heute und Erfolge.
- Der aktuelle Prototyp ist ausdrücklich noch nicht abgenommen.
- Nach der Pause genau hier weiterarbeiten; keine nächste Baustelle beginnen.
- Noch keine konkreten Detailkorrekturen als bereits vereinbart erfinden.
- Alte Karten-IDs und noch benötigte Rückwege bleiben zunächst erhalten.
- Danach erst die übrigen alten Zugänge und betroffenen Tests migrieren.
- Aktuelle Diffprüfung: bestanden.
- Aktuelle Node-Startprüfung: bestanden.
- Kein neuer Browserlauf für diese Sicherung.
- Letztes Status-Browserergebnis nicht separat vom Nutzer gemeldet;
  keinen bestandenen Browserlauf oder UI01-Gesamtabschluss behaupten.


Stand: 01.11.2026, 17:53 CET

## Verbindlicher aktueller Stand
- Aktives Paket: UI01. Nicht eigenmächtig P07 beginnen.
- Ehrenei-Seite vom Nutzer um 01:11 CET sichtbar abgenommen:
  „sehr gut so können wir es lassen!“
- Diese Teilabnahme ist keine Gesamtfreigabe oder Veröffentlichung von UI01.
- Arbeitsweise: docs/ARBEITSWEISE.de.md
- Testworkflow: docs/TEST-WORKFLOW.de.md, sofern vorhanden.
- Einstieg nach einer Pause: docs/WEITERARBEITEN.de.md

## Pakete
| ID | Thema | Status |
|---|---|---|
| P00 | Kanto-/Johto-Übersichten und Trainerporträts | Abgenommen |
| P01 | Veröffentlichungsschutz privater Medien | Abgeschlossen |
| P02 | Dokumentation und Kontinuität | Grundlage abgenommen; fortschreiben |
| P03 | Erweiterbare Spracharchitektur | Abgenommen; Übersetzungsumfang unter Q01 |
| P04 | Eigenes Team mit sechs Plätzen | Abgenommen |
| P05a | Team in Wildkämpfen | Abgenommen |
| P05b | Team in Arenakämpfen | Abgenommen |
| P05c | Team in Ligakämpfen | Abgenommen |
| P06 | Legendären-Geschichten Kanto | Abgeschlossen einschließlich iPhone-Abnahme |
| UI01 | Oberfläche, Navigation und Canvas-/Kartenbereinigung | Abgenommen am 05.11.2026; Build und iPhone bestätigt |
| P07 | Legendären-Geschichten Johto | Planungsgrundlage freigegeben am 05.11.2026; Start mit P07a/Suicune; Umsetzung offen |
| P08 | Weitere Mega-Entwicklungen | Offen; Ausbauumfang festlegen |
| P09 | Weitere Ligen | Offen; regionalen Umfang festlegen |
| P10 | Dynamax/Gigadynamax | Konzept offen |
| Q01 | Englisch, Spanisch und Französisch | Vollständigkeitsarbeit offen |
| Q02 | Rechte und private Medien | Fortlaufend |
| Q03 | Reproduzierbare Bildvorbereitung | Offen |
| Q04 | Tests gemeinsamer UI-Module | Offen |
| Q05 | Ältere Roadmap mit Code abgleichen | Offen |

## Nächste UI01-Arbeiten
1. Statusprototyp gemeinsam nacharbeiten und abnehmen; danach alte Kartenzugänge migrieren.
2. Canvas-/Kartenbereinigung: vorhandene Karten und doppelte Zugänge abgleichen.
3. Profil, Wesen, Werte, Fortschritt, Tagesziele, Rekorde und Medaillen bündeln.
   Endgültige Kartenanzahl und Aufteilung sind nicht beschlossen.
4. Mega-Entwicklungsseite als eigenen UI01-Reviewpunkt bearbeiten.
5. Pokédex-Zentrale im Ruhemodus zugänglich machen, ohne Aufwecken
   oder Aufheben anderer Schutzsperren.
6. Kampf-/Fang-Sonderfälle gezielt prüfen; abgenommene Gestaltung erhalten.
7. Restliste, Übersetzungen und betroffene Tests abgleichen.
8. Erst nach Gesamt-Abnahme: eingefrorener Stand, vollständige Regression,
   nativer Check und gesonderte Veröffentlichungsfreigabe.

## Verbindliche Ehrenei-Abnahme
- Gedrehte Gerätehülle und aufrechte Inhalte.
- Oben: „Soll das dein nächstes Ei werden?“
- Pokémon-Darstellung unten ausdrücklich sehr gut; nicht neu gestalten.
- Alle Pokémon-Kacheln und Buttons im gemeinsamen Hintergrund --tp-card.
- Das gilt auch für ausgewählte Kacheln und Buttons nach der Auswahl.
- Keine transparenten Rahmenbuttons und keine Displayfarbe als Kachelfarbe.
- Haken rechts neben dem oberen Display.
- Beide Seitenpfeile rechts neben dem unteren Display.
- Bestehende Pflege, Anspruchsregeln und Speichertransaktion unverändert.

## Weitere bestätigte Grundlagen
- Gemeinsames Pokédex-Design, abgenommene Zentrale und Unterseiten erhalten.
- Boxen/Teamverwaltung nicht ohne konkreten Anlass neu gestalten.
- Pflege-Pokémon bleibt geschütztes Teammitglied; zehn Boxen mit je 24 Plätzen.
- Arena-/Liga-B-Porträts und Ruhmeshalle V4 sind abgenommen.
- Liga-Zwischenstand und vereinbarter Weiter-/Fortsetzen-Ablauf sind abgenommen.
- Boxsymbol bei Fangaufnahme sitzt rechts im Rahmen und ist abgenommen.
- „Blocken“ bleibt spätere Kampfmechanik außerhalb UI01; „Heilen“ vorläufig erhalten.
- Canvas-Bereinigung gehört zu UI01. Ein einziger technischer Canvas
  für sämtliche Ansichten ist damit nicht automatisch beschlossen.

## Prüfnachweise
- Ehrenei-Wiederholung nach Korrektur der Sprachregistrierung:
  Nutzer meldete am 01.11. um 00:55 CET „test: passed“.
- Letzte Ehrenei-Gestaltungsrunde: Nutzerabnahme um 01:11 CET.
- Für die letzte Detailrunde wurde kein separates Testergebnis gepostet.
- Keine vollständige UI01-Regression oder Paketabnahme behaupten.

## Historie
Vollständige vorherige Dokumentation, unverändert:
docs/archive/UI01-20261101-011303/

Frühere offene Zwischenstände nicht gegen spätere Abnahmen ausspielen.
Bei Detailfragen gezielt das Archiv lesen, nicht den ganzen Verlauf erneut ausgeben.

## UI01 — Erster Entwurf der Spieleauswahl

- Links-Auswahl und Rechts-Vorschau vom Nutzer freigegeben.
- Nicht gedrehter gemeinsamer Doppeldisplay-Rahmen.
- Bestehende fünf Spiele, Namen, Rekorde und Startfunktionen erhalten.
- --tp-card-Hintergrund; Auswahl startet noch kein Spiel.
- Bei geringer Höhe seitenweise Auswahl mit mindestens 44 Pixel großen Buttons.
- Vorschau verändert keine Minispielzustände; expliziter Startbutton.
- Typenspiel-/Tagebuchprüfungen auf sichtbare Bedienung umgestellt.
- Gezielte Tests und sichtbare Gestaltungsabnahme noch offen.
- Ehrenei und andere abgenommene Ansichten unverändert.
- Kein Spielstandwechsel, WASM-Neubau, Commit, Push oder P07-Start.

## UI01 — Spieleauswahl Revision 2

- Nutzer gibt Rastervariante zum gemeinsamen Test frei.
- Links 2x3-Raster; fünfte Kachel über beide Spalten.
- Bei ausreichendem Platz alle fünf Spiele gleichzeitig; kleiner Größenfallback.
- Obere Rahmenleiste: vorheriges/nächstes Spiel und Spielnummer statt Seitenzahl.
- Pfeile vollständig oberhalb der Displays und außen ausrichten.
- Typenspiel-Vorschau mit Typ-Plakette, drei Antworten und richtiger Markierung.
- Effektivität nur lesend aus bestehender Typentabelle; kein Minispielstart.
- Statische richtige Antwort bei Bewegungsreduktion.
- Spielregeln, Rekorde, Startfunktionen und Spielstände unverändert.
- Gezielte Tests und sichtbare Abnahme dieser Revision noch offen.

## UI01 — Spieleauswahl ohne Blätterpfeile

- Nutzer verlangt Entfernung der jetzt überflüssigen Blätterpfeile.
- Alle fünf Spiele dauerhaft im linken Raster; keine versteckten Spielseiten.
- Auf kleinen Höhen bei Bedarf innerhalb des Displays erreichbar scrollen.
- Normale Zurück-Navigation erhalten; Spielzähler entfernt.
- Typen als vorhandene Symbole innerhalb der Vorschau-Banner statt Textnamen.
- Grüne Auswahlkontur und Hakenanimation bleiben erhalten.
- Symbolformen aus tatsächlicher bestehender Typauswahl übernommen und geprüft.
- Spielregeln, Startfunktionen, Rekorde und Spielstände unverändert.
- Scrollposition beim Raster-Neuaufbau erhalten; Prüfgrenzen unverändert.
- Nutzer meldet Wiederholungsprüfung am 01.11.2026 um 17:29 CET als passed.
- Sichtabnahme: „so kann es bleiben, gefällt mir gut!“
- Spieleauswahl damit lokal abgenommen; keine UI01-Gesamtfreigabe.
- Nächster Gestaltungsbereich: Expeditionsseite.

## UI01 — Erster Expeditions-Prototyp

- Grafikdetailrunde: mehr Beerensträucher, erkennbare Felsquelle mit Bach,
  dichter Wald um eine Lichtung und Trainingsgeräte am Trainingspfad.
- Vorschaugrafik vom Nutzer am 01.11.2026 um 17:52 CET ausdrücklich abgenommen.

- Nutzer gibt vier Ziele links, Vorschau/Status rechts und Inventaricons oben frei.
- Gemeinsamer Doppeldisplay-Rahmen und --tp-card-Hintergründe.
- Auswahl startet nicht; bestehende Start-/Abhol-/Verbrauchsaktionen verwenden.
- Trainingswertwahl rechts; Zurück verlässt zuerst diese Wahl.
- Bestehende Transaktion unverändert; Sperrhinweis nur lesend freigegeben.
- Alte Canvas-Klickwege entfernt; Tests verwenden reale DOM-Bedienung.
- Controller-, Rollback- und Autosaveprüfungen erhalten; DOM-Renderertest ergänzt.
- Erster Vorabtest stoppte ohne Schreibvorgang wegen fehlendem VM-Timer.
- Testkontext um setInterval/clearInterval ergänzt; keine Spieltimer verändert.
- Nutzer meldet die gezielten Prüfungen als passed.
- Expeditionsseite einschließlich Vorschauszenen lokal abgenommen.
- Keine UI01-Gesamtfreigabe oder Veröffentlichung daraus ableiten.
- Spieleauswahl und Ehrenei bleiben abgenommen; keine Spielstände verändert.

## UI01 — Statusansicht mit vier Rubriken, Schritt 1

- Nutzer gibt Profil, Werte, Heute und Erfolge am 01.11.2026 um 17:59 CET frei.
- Neue gemeinsame Statusdarstellung für die bisherigen Informationskarten.
- Vorhandene Wesenstexte aus aktuellem Code übernehmen; Daten und Regeln erhalten.
- Namensänderung nutzt vorhandenen Keyboard-Core.
- Mega-Zugang bleibt beim vorhandenen Mega-Ablauf.
- Alte interne Karten-IDs bleiben für Übergänge und Aufrufer zunächst erhalten.
- Box-/Aufnahme-/Kampf-/Mega-Routing und deren ältere Navigationstests sind
  ausdrücklich noch nicht vollständig migriert oder bereinigt.
- Keine versteckten Testbuttons und keine Abschwächung bestehender Prüfungen.
- Gezielte neue Statusprüfungen und sichtbare Abnahme noch offen.
- Danach Schritt 2: verbliebene Kartenzugänge samt Aufrufern und Tests bereinigen.
- Ehrenei, Spiele, Expedition, Boxen und Kampfgestaltung unverändert.

## UI01 — Detailrunde Profil und Werte

- Nutzer gibt Überarbeitung von Profil rechts und Werte am 01.11.2026 um 20:36 CET frei.
- Profil links bleibt unverändert.
- Werte links: nur feste Balkenfarben, Angriff rot, Verteidigung grün,
  Initiative/Tempo gelb; bestehende Zahlen und Bezeichnungen bleiben.
- Profil rechts: Wesensplakette, Bindung und kompakte Pflege-/Altersplaketten.
- Werte rechts: Level-Fortschritt, Entwicklungsstatus und Pflegeplakette.
- Bestehende Angaben und Bonusformulierungen vollständig erhalten.
- Heute und Erfolge in dieser Runde unverändert; deren Neugestaltung folgt danach.
- Gezielte Prüfungen und Sichtabnahme dieser Detailrunde noch offen.
- Gesamte Statusansicht weiterhin nicht abschließend abgenommen.

## UI01 — Profil ohne Scrollen, Alter und Pflegeserie links

- Nutzer gibt neue Profilaufteilung am 01.11.2026 um 20:50 CET zur Prüfung frei.
- Wesen und Bindung als gestalterische Grundlage erhalten; Beschriftung Bindung.
- Alter und Pflegeserie links unter dem Pokémon, mit bestehendem Rekordwert.
- Stift im Rahmen; reservierter Werkzeugplatz hält die Rubrikpositionen stabil.
- Rechts Wesen, Bindung und bevorzugte Beere ohne doppelte Altersanzeige.
- Unbekannte Beerenvorliebe nicht enthüllen; vorhandene Angabe verwenden.
- Vollständige Wesenserklärung im rechten Display nach Antippen.
- Zurück verlässt zuerst diese Detailansicht.
- Profilhauptansicht und Details ausdrücklich auf Überlauf/Scrollen prüfen.
- Werte, Heute, Erfolge und Spielregeln inhaltlich unverändert.
- Gezielte Tests und manuelle Abnahme dieser Profilrunde noch offen.

## UI01 — Stift am Namen, Tagesformen und Pflegepatzer

- Nutzer stellt klar: Pokémonname bleibt links; Stift direkt rechts daneben.
- Stift ohne sichtbaren Buttonhintergrund oder Rahmen; normale Bedienbarkeit erhalten.
- Alter und Pflegeserie: 1 Tag, sonst 0/2/3/4 Tage.
- Bestehende Pflegepatzer rechts im Profil neben der Beerenplakette.
- Pflegepatzer unter Werte nicht erneut anzeigen.
- Mega-Zugang bei Verfügbarkeit als Rahmenicon erhalten.
- Keine Änderung an Zählregeln, Pflegewerten oder Spielständen.
- Gezielte Tests und Sichtabnahme dieser Runde noch offen.

## UI01 — Profilzentrierung und offene Umbenennungs-Tastatur

- Name und Level unabhängig vom seitlichen Stiftsymbol mittig ausrichten.
- Wesen und Bindung: Icon und Überschrift als gemeinsame Gruppe zentrieren.
- Keine Änderung an Pflegewerten, Datensätzen oder Umbenennungsregeln.
- Nutzer weist auf noch nicht gestaltete Umbenennungs-Tastatur hin.
- Tastatur ausdrücklich als offenen UI01-Reviewpunkt mitführen.
- Vor Tastaturänderung tatsächliche Eingabe-, Sprach- und Abschlusslogik lesen.
- Zentrierung und Gesamtstatus weiterhin erst nach Prüfung abnehmen.

## UI01 — Verworfener separater Umbenennungsentwurf

- Nutzer gibt Systemtastatur-Prototyp am 01.11.2026 um 21:34 CET frei.
- Links Pokémon und Namensvorschau, rechts Eingabe und Übernehmen.
- Zurück verwirft den Entwurf; keine eigene Buchstabenkachel-Tastatur mehr.
- C++-Namensentwurf weiterverwenden; UTF-8, Zeichen- und Bytegrenzen prüfen.
- Übernehmen über bestehenden nativen Namen und gemeinsamen careSync-Speicherweg.
- Bei bestätigbar nicht dauerhaftem Fehler alten Namen wiederherstellen;
  bei unklarem/gesperrtem Speicherabschluss Neuladen verlangen.
- Automatische Tests ersetzen keine Beurteilung der echten Handy-Systemtastatur.
- Danach zuerst Werte gemeinsam besprechen, vor Heute und Erfolge.
- Danach alte Kartenzugänge und Mega-Einbindung bearbeiten.
- Mega-Vorschlag: Einstieg im Profil, aktive Form/Wertewirkung unter Werte;
  Mega-Neugestaltung damit noch nicht umgesetzt oder abgenommen.
- Gezielte Tests und Sichtabnahme der Umbenennung noch offen.

## UI01 — Umbenennung direkt im rechten Profildisplay

- Nutzer gibt Inline-Umbenennung am 01.11.2026 um 21:50 CET frei.
- Stift schaltet nur das rechte Profildisplay auf Eingabe und Übernehmen um.
- Links bleiben Pokémon und bisheriger Name bis zur bestätigten Speicherung.
- Zurück/erneuter Stift/Rubrikwechsel verwerfen einen ungespeicherten Entwurf.
- Eingabefeld während der Bearbeitung nicht laufend neu aufbauen.
- Separate Umbenennungsseite samt CSS entfernt.
- Bestehende alte Aufrufer führen in denselben Inline-Ablauf, nicht zu versteckter Alt-UI.
- Namensprüfung und vorhandene Speicher-/Rücknahmelogik übernommen.
- Tests und manuelle Abnahme dieser Runde noch offen.
- Danach zuerst Werte besprechen, dann Heute/Erfolge.

## UI01 — Werte als Wachstums- und Trainingsübersicht

- Nutzer gibt die Werte-Variante am 01.11.2026 um 22:05 CET zur Prüfung frei.
- Links bestehende Werte und Farben; gemeinsame Skala auch oberhalb von 260.
- Rechts Wachstum statt doppelter aktueller Levelanzeige.
- Zeitfortschritt als Medaillon; Maximallevel ohne weitere Levelankündigung.
- Vorhandene Trainingsstände nur lesend über tp_c2_get 17/18/19.
- Drei farbige Trainingsplaketten und kompakter Entwicklungsstatus.
- Aktive Mega-Form nur kennzeichnen; keine zweite Aktivierungsaktion.
- Beide Displays auf Erreichbarkeit ohne Scrollen prüfen.
- Profil und Inline-Umbenennung inhaltlich unverändert.
- Gezielte Tests und Sichtabnahme dieser Werte-Runde noch offen.

## UI01 — Wachstum im Profil und Entwicklungs-Direkteinstieg

- Nutzer gibt die Variante am 01.11.2026 um 22:25 CET zur Prüfung frei.
- Wachstumsring in die bestehende Pokémon-Bildfläche des Profils integrieren.
- Level und verbleibender Zeithinweis kompakt; keine weitere Kachelzeile.
- Normale rechte Profilgruppe vertikal zentrieren; Inline-Eingabe unverändert.
- Werte rechts: dekorative Trainingsszene, Trainingsplaketten, Entwicklung.
- Entwicklungskachel öffnet die bestehende TPComfort-Entwicklungsansicht.
- Kein kopierter Entwicklungsrenderer und keine Änderung an Voraussetzungen.
- Rückkehr zur Werteansicht und unveränderte Pokémonidentität im Browser prüfen.
- Mega bleibt kontextabhängiger Profilzugang, keine zusätzliche große Infokachel.
- Gezielte Tests und Sichtabnahme dieser Runde noch offen.

## UI01 — Entwicklungsring und Profilabstand

- Nutzer bewertet letzte Darstellung positiv und wünscht zwei Details.
- Entwicklungsseite: goldener Wachstumsring am linken Pokémonporträt.
- Vorhandenen Zeitfortschritt und Hinweis zum nächsten Level anzeigen.
- Aktualisierung beim Schließen/Neuaufbau beenden; keine Änderung an Entwicklungsregeln.
- Profil: drei Pixel Abstand zwischen Name/Stift und Level-/Zeitzeile.
- Bestehende Rendererfixtures nur um benötigte Zeitdaten ergänzen;
  Assertions unverändert erhalten.
- Gezielte Tests und Sichtprüfung dieser Detailrunde noch offen.
- Anschließend Heute und Erfolge gemeinsam gestalten.

## UI01 — Heute als Aufgabenbrett und Tagesblick

- Vorherige Detailprüfung vom Nutzer am 01.11.2026 um 22:46 CET als passed gemeldet.
- Heute-Entwurf am 01.11.2026 um 22:52 CET zur Prüfung freigegeben.
- Erster Schreibversuch vor Änderungen wegen mehrdeutigem Suchanker gestoppt.
- Korrigierter Anker ausschließlich für back(), nicht für rename().
- Links drei Tagesziele und Tagesblick; rechts Szene oder Zieldetails.
- Zielauswahl startet kein Spiel und vergibt keine Belohnung.
- Bestehende Ziel-/Bonusregeln anhand aktueller Nativequellen geprüft.
- Kein Abholbutton; keine manuellen Spielstände verändert.
- Gezielte Tests und Sichtabnahme dieser Runde noch offen.
- Danach Erfolge gestalten.

## UI01 — Erfolge als Medaillenvitrine

- Nutzer bestätigt Heute am 01.11.2026 um 23:08 CET optisch, bis auf Abschlussmarkierung.
- Vitrinenentwurf am 01.11.2026 um 23:09 CET zur Umsetzung freigegeben.
- Erledigte Tagesziele: salbeigrüner Grund, grüner Innenrahmen und größere Hakenplakette.
- Auswahl weiterhin separat blau erkennbar.
- Acht persönliche Medaillen links als kompakte Symbolplätze.
- Rechts ausgewählte Medaille, tatsächliche Voraussetzung und gespeicherter Zustand.
- Spielrekorde und Kampfbilanz bleiben über zwei Symbolzugänge rechts erreichbar.
- Gespeicherte Medaillen nicht aus aktuellen Werten neu berechnen.
- Native Bedingungen anhand lokaler Quellen vor dem Schreiben abgleichen.
- Keine neuen Erfolgsregeln, Belohnungen oder Spielstandänderungen.
- Gezielte Prüfungen und Sichtabnahme dieser Runde noch offen.
- Keine Gesamtfreigabe von UI01 und kein Commit/Push.

## UI01 — Spielrekorde und Kampfbilanz als Spielplaketten

- Nutzer bestätigt Vitrinengestaltung am 01.11.2026 um 23:19 CET als sehr gut.
- Gewünschte Nacharbeit ausschließlich rechte Unterseiten Spielrekorde/Kampfbilanz.
- Fünf Rekordkarten mit Spielmotiven und hervorgehobenen bestehenden Bestwerten.
- Drei Bilanzplaketten mit Schwert-, Flammen- und Pokalmotiv.
- Vorhandene Native-Bilanzzeilen erhalten; doppelte zusätzliche Bestwertzeile entfernt.
- Linke Medaillenauswahl, Vitrine, Heute, Profil und Werte unverändert.
- Keine neuen Zähler, Rekorde, Fortschrittsprozente oder Belohnungen.
- Gezielte Tests und Sichtabnahme dieser Nacharbeit noch offen.
- Kein behaupteter Gesamtabschluss, Commit oder Push.

## UI01 — Ergebnistafel und zentrierte Statusnavigation

- Nutzer gibt Ergebnistafel-Entwurf am 01.11.2026 um 23:24 CET zur Prüfung frei.
- Zusätzlich vier Rubrikbuttons gemeinsam über beiden Displays zentrieren.
- Separater Mega-Werkzeugplatz zählt nicht zur Vierergruppen-Zentrierung.
- Kampfbilanz-Icon als Ergebnistafel, nicht als Angriffsschwert.
- Siege/Niederlagen als zwei beschriftete Zahlenfelder mit Fähnchen.
- Aktuelle und beste Serie als eigene Plaketten mit großem Wert.
- Vorhandene Native-Anzeigefelder in geprüfter Reihenfolge für Darstellung aufteilen.
- Bei unerwartetem Zahlenformat vorhandenen Rohtext zeigen, keine Nullwerte erfinden.
- Native Spielzähler, Regeln und Speicherwege unverändert.
- Bestehende Bilanztests auf echte dargestellte Zahlen statt alte Textzeilen umstellen.
- Gezielte Tests und Sichtabnahme dieser Runde noch offen.

## UI01 — Mega-Reviewstände vorbereiten

- Nutzer bestätigt Ergebnistafel und Zentrierung am 01.11.2026 um 23:28 CET.
- Mega-Buttons und Mega-Seiten wegen fehlender Teststände noch nicht manuell abgenommen.
- Acht separate synthetische Fälle für Glurak, Metagross und Flunkifer.
- Normale/schillernde Varianten, Steinfreischaltung und Sperrzeit.
- Aktive Formen über die tatsächlichen sichtbaren Aktivierungsbuttons prüfen.
- Privater neuer Ordner Downloads/iTamaPoke-UI01-Megareview.
- Vorhandenen seal/decode-Transport samt Rückleseprüfung verwenden.
- Bestehenden --saves-Runner um Mega-Profil ergänzen; Browserprofil und Tasten erhalten.
- Vorhandene manuelle Spielstände und andere Reviewordner nicht überschreiben.
- Fall 8 besitzt eine reale, zeitlich begrenzte Sperrzeit von einer Stunde ab Vorbereitung.
- Fehlende lokale Grafikdateien melden; keine Medien herunterladen.
- Vorbereitung, technische Prüfungen und manuelle Mega-Abnahme getrennt behandeln.
- Kein Commit/Push oder Gesamtabschluss von UI01.

## UI01 — Mega-Review: erwartete Art beim Import übergeben

- Erster gezielter Lauf: drei Zentrierungsprüfungen bestanden.
- Fünf Mega-Fälle bei falscher Importerwartung gestoppt; drei nicht ausgeführt.
- H.prepare ohne dritten Parameter erwartete Art 1 statt der jeweiligen Testart.
- Testaufruf übergibt jetzt definition.dex; eigentliche Artprüfung bleibt erhalten.
- Spielstände, Prüfhelfer, Spiellogik und Reviewrunner unverändert.
- Erneute Mega-Prüfung und manuelle Mega-Abnahme weiterhin offen.
- Fehlende lokale Grafikquellen bleiben ein separates Thema der Bildabnahme.

## UI01 — Goldener Mega-Zugang beim Pokémon

- Nutzer gibt das goldene Mega-Emblem am 01.11.2026 um 23:42 CET zur Umsetzung frei.
- Bestehenden Mega-Zugang aus der oberen Leiste neben das Pokémon links verschieben.
- Tatsächlichen Button/Handler erhalten; nur sichtbare Buttonhülle entfernen.
- Goldverlauf, Bereitschaftsglanz, aktive violette Aura und Reduced-Motion-Alternative.
- Vierergruppe oben bleibt zentriert, separater Mega-Werkzeugplatz entfällt.
- Zweiter Mega-Testlauf erreicht Aktivierung, aber ohne importierte Mega-Grafik.
- Bestehende Aktivierung verlangt gültige Mega-Grafik; diesen Schutz nicht umgehen.
- Vorhandene synthetische TPK2-Funktionsfixture in isolierte Browserprüfungen übernehmen.
- Funktionsfixture ist keine echte Mega-Grafik und wird nicht im manuellen Review installiert.
- Zusätzliche Negativprüfung: fehlende Grafik startet weder Mega-Zeit noch Sperrzeit.
- Vorbereitete Teststände und manuelles Reviewprofil unverändert.
- Technische Wiederholungsprüfung, echte Grafikprüfung und manuelle Emblemabnahme offen.

## UI01 — Tagesabschluss: Mega-Emblem und Pokémon-Zentrierung

- Stand: 01.11.2026, 23:52 CET.
- Mega-Emblem vom Nutzer angenommen; ursprüngliche Pokémon-Zentrierung wiederhergestellt.
- Nur verengende/links ausrichtende CSS-Ergänzung entfernt.
- Gezielte Emblem-, Mega-, Navigations- und Statusprüfungen erfolgreich.
- Letzte Zentrierungs-Sichtprüfung und manuelle Mega-Abnahme getrennt offen halten.
- Detaillierten Wiedereinstieg in docs/WEITERARBEITEN.de.md gesichert.
- Reviewstände morgen wegen Zeitstempeln und Offlinefortschritt frisch vorbereiten.
- Lokale Quellstand-/Differenz-/Reviewstand-Sicherung: /Users/M1dn8/Downloads/iTamaPoke-Fortsetzung-20261101-235241-785737
- Kein Commit, Push oder UI01-Gesamtabschluss.

## UI01 — Mega-Review am 02.11.2026 fortsetzen

- Gesicherten Fortsetzungsstand vom 01.11.2026, 23:52 CET gelesen.
- Dortige gezielte Emblem-, Mega-, Navigations- und Statusprüfungen bestanden.
- Keine vollständige UI01-Freigabe daraus ableiten.
- Acht zeitaktuelle Ausgangsstände mit vorhandenem Fixture-Modul erzeugen.
- Neuer privater Ordner: /Users/M1dn8/Downloads/iTamaPoke-UI01-Megareview-20261102
- Alte Teststände und ursprünglicher Sicherungsordner unverändert.
- seal/decode und Byte-Rückleseprüfung vor Verwendung.
- Fall 8 besitzt eine reale Sperrzeit bis ungefähr 02.11.2026, 21:42 CET.
- Bestehenden Reviewrunner um rein lesende Grafikbestandsausgabe ergänzen.
- Bereits importierte Grafiken im gespeicherten Profil prüfen, nichts ersetzen.
- Gezielt neue Teststände prüfen; manuelle Zentrierungs- und Mega-Sichtprüfung offen.

## UI01 — Mega-Seite im kreisförmigen Doppeldisplay

- Nutzer gibt Mega-Seitenentwurf am 02.11.2026 um 20:48 CET zur Prüfung frei.
- Rahmengeometrie und Grundhaut aus aktuellem Statusrahmen übernehmen.
- Links normale beziehungsweise tatsächlich aktive Mega-Form in kreisförmiger Darstellung.
- Sprite-Alphagrenzen diagonal in den Ring einpassen, keine Figur außerhalb des Kreises.
- Rechts Steinstatus, Voraussetzungen beziehungsweise Laufzeit und tatsächliche Hauptaktion.
- Bestehende Wertevorschau bei vorhandenem Stein erhalten.
- Native Aktivierungs-/Grafik-/Speicherfunktion unverändert lassen.
- Rückweg über sichtbaren gemeinsamen Pfeil direkt zum Profil.
- Alte Canvas-Mega-Aktionsfläche nicht als versteckten Ersatz weiterverwenden.
- Neue Mega-Reviewprüfungen auf tatsächliche DOM-Bedienelemente umstellen.
- Profil-Emblem und bestätigte Statusrubriken unverändert.
- Technische Prüfungen und manuelle Mega-Seitenabnahme dieser Runde offen.
- Ältere Mega-Browserfälle vor dem späteren Gesamtlauf auf aktuelle UI-Anschlussstellen prüfen.

## UI01 — Mega-Seitenstart: Englisch zuerst registrieren

- Lauf vom 02.11.2026 um 21:08 CET: neun bestanden, fünf fehlgeschlagen,
  ein Fall unterbrochen, vierzehn nicht ausgeführt.
- Neue Mega-Texte wurden irrtümlich mit Deutsch vor Englisch registriert.
- Echtes Sprachregister verlangt zuerst englische Schlüssel.
- Initialisierung brach dadurch vor dem Export von TPMega ab.
- Fehlendes Mega-Emblem und TPMega-ReferenceError als zusammenhängende Symptome behandeln.
- Nur Reihenfolge auf en/de/es/fr korrigieren.
- Fehler vor Schreiben mit echtem Register reproduzieren und Kandidatenstart prüfen.
- Dauerhafte Startprüfung mit echtem de-ui.js und allen vier Mega-Katalogen ergänzen.
- Keine Aktivierungsregeln, Speichertransaktionen, Teststände oder UI-Geometrie ändern.
- Unterbrochenen Stift-Test nicht als gesondert nachgewiesenen Fehler behandeln.
- Betroffener Browserlauf und manuelle Mega-Seitenabnahme weiterhin offen.

## UI01 — Mega-Seite Revision 2: Aura und dauerhafte Pokémon-Darstellung

- Nutzer kritisiert erste Mega-Darstellung am 02.11.2026 um 21:16 CET.
- Zweiten Gestaltungsentwurf um 21:20 CET zur Prüfung freigegeben.
- Pokémon-Zeichenfläche dauerhaft behalten; keine Neuerzeugung bei Zeitupdates.
- Rechte Karten nur bei relevanten Zustandsänderungen erneuern.
- Profil-M aus tatsächlichem Grafikquelltext unverändert übernehmen, eigene Gradient-ID.
- Goldring mit weicher violett/magenta/cyan Aura und wandernden Energiebögen.
- Kurze Energiewelle nur bei tatsächlichem Wechsel zur aktiven Mega-Form.
- Rest-/Erholungszeit groß und getrennt unter dem Pokémonring.
- Ovaler Mega-Kristall als Besitz-/Zustandssiegel im oberen freien Rahmenband.
- Voraussetzungen als drei größere Prüfungskarten.
- Mega-Werte mit Attributsymbol, großem Zielwert und kleinem Basiswert.
- Während aktiver Mega-Form keinen nutzlosen deaktivierten Aktionsbutton anzeigen.
- Grafikschutz, Aktivierungs-/Speichertransaktion und Preview-Rechnung unverändert.
- Profilgestaltung und andere Statusseiten unverändert.
- Neue technische Prüfung und manuelle Abnahme der Revision 2 offen.

## UI01 — Mega-Revision 2: sichtbare Flächen und frische Testkopien

- Lauf vom 02.11.2026 um 21:32 CET: 25 bestanden, vier fehlgeschlagen.
- Alle Statusfälle, normale/schillernde Aktivierungen und Grafikschutz bestanden.
- Layoutprüfung erreichte Flächenkontrolle nach M-Gleichheit und Canvas-Persistenz.
- Absichtlich ausgeblendete Zeitplakette nicht als sichtbares Rechteck behandeln.
- Scrollhöhe und Grenzen aller sichtbaren Kinder unverändert streng prüfen.
- Zeitplakette in Bereitschaft verborgen und bei tatsächlicher Aktivierung sichtbar prüfen.
- Veraltete Ausgangszeitstempel können Mega-Prüfung durch Offlinefortschritt verändern.
- Isolierte Tests erzeugen frische Kopien über vorhandenen Generator und seal/decode.
- Vorhandene gespeicherte Ausgangsdateien weiterhin decodieren und Art prüfen.
- Native quest-Erwartung und Aktivierungsregeln nicht abschwächen.
- Nach erfolgreicher Wiederholung neue manuelle Ausgangsstände in separatem R2-Ordner.
- Keine Darstellungsänderung und keine normale Spielstandänderung in diesem Fix.

## UI01 — Mega-Testvorbereitung: Buffer-Vertrag des Dateiimports

- Lauf vom 02.11.2026 um 21:36 CET bereits bei setInputFiles gestoppt.
- Frische seal/decode-Testdaten lieferten Uint8Array statt Node-Buffer.
- Datei-Payload vor Übergabe an vorhandenen Importhelfer mit Buffer.from normalisieren.
- Rückgabe behält sämtliche decodierten Metadaten und unveränderte Nutzdaten.
- Buffer-Typ und Bytegleichheit vor Browserlauf prüfen.
- Keine Änderung an Importvalidierung, Spiellogik, Grafikschutz oder Darstellung.
- Vorheriger nachgelagerter R2-Erzeugungsschritt wurde wegen Testabbruch nicht erreicht.
- Gezielte Wiederholung und manuelle Mega-Abnahme weiter offen.


## Mega-Revision 2: korrigierte gezielte Prüfungen bestanden

- Dateiimport erhält echte Node-Buffer mit unverändertem Byteinhalt.
- Korrigierter Mega-, Layout- und Statuslauf erfolgreich.
- Frische manuelle Ausgangsstände: /Users/M1dn8/Downloads/iTamaPoke-UI01-Megareview-20261102-R2
- Fall 8: Sperrzeit bis 2026-11-02T21:39:19.000Z
- Manuelle Gestaltungsabnahme weiterhin offen.

<!-- UI01-CLOSEOUT-20261102-MEGA-ACCEPTED -->
## UI01 — Mega-Abnahme und freigegebene Abschlussreihenfolge

- Nutzer bestätigt am 02.11.2026 um 21:40 CET bestandenen gezielten Lauf
  sowie Grafiken und Darstellung der Mega-Revision 2.
- Gestaltungsstand erhalten; keine weitere Mega-Neugestaltung beauftragt.
- Nutzer genehmigt um 21:49 CET folgende Reihenfolge:
  1. Abnahme dokumentieren.
  2. Beide horizontalen Hauptbildschirm-Gesten entfernen und sichtbaren
     Zentralenzugang im Ruhemodus ohne Aufwecken/Pflege ermöglichen.
  3. Herunterwischbares Verwaltungsmenü und bestehende Einstellungen
     im gemeinsamen Design mit sachlichen Informationen gestalten.
  4. Aktuelle UI01-Restpunkte einschließlich Ehrenei-Abgleich und älterer
     UI-Testanschlüsse klären, danach vereinbarte Abschlussprüfungen.
- Wischfunktionen anderer Ansichten nicht pauschal entfernen.
- Bestehende Schutzsperren, Transaktionen und Spielregeln erhalten.
- Schritt 2 und Schritt 3 noch nicht umgesetzt.
- Gezielte Mega-Abnahme ist keine vollständige UI01-Freigabe.
- Kein automatischer Commit/Push und kein P07-Start.

## UI01 — Schritt 2: sichtbarer Zentralenzugang statt Idle-Wischroute

- Schritt 1 mit Mega-Abnahme und freigegebener Reihenfolge dokumentiert.
- Beide horizontalen Hauptbildschirm-Gesten entfernen, andere Seitenfunktionen erhalten.
- Sichtbarer Pokédex-Einstieg aus der Zentrale hing intern an onSwipe.
- Expliziten UI-Einstieg mit bestehenden Navigationssperren ergänzen und Menü darauf umstellen.
- Nur LIGHT und POKEDEX im Ruhemodus zeichnen/bedienen; Pflegeaktionen weiter sperren.
- Keine Schlafänderung oder Pflegeaktion durch Öffnen/Schließen der Zentrale.
- Vertikale Gesten, Native-Regeln und Speichertransaktionen unverändert.
- Isolierte Unit- und echte Gesten-/Icon-Browserprüfungen ergänzen.
- Technische Prüfung und manuelle Abnahme von Schritt 2 noch offen.
- Schritt 3 bleibt danach: bestehendes Verwaltungsmenü/Einstellungen gestalten.

<!-- UI01-STEP2-ACCEPTED-MAIN-ICON-IDEA-20261102 -->
## UI01 — Schritt 2 abgenommen, Hauptleisten-Idee und Schritt 3

- Nutzer meldet am 02.11.2026 um 22:00 CET bestandenen Lauf und bestätigt:
  Wischgesten auf dem Hauptbildschirm entfernt, Zentrale im Schlaf erreichbar.
- Schritt 2 damit im gezielt geprüften und sichtbar bestätigten Umfang abgenommen.
- Gesten innerhalb anderer Ansichten und bestehende Schutzsperren erhalten.
- Schritt 3 als nächste Arbeit: vorhandenes Verwaltungsmenü/Einstellungen gestalten.

### Zusätzlicher UI01-Restpunkt — Hauptbildschirm-Leiste

- Nutzer beauftragt am 02.11.2026 um 22:03 CET, die Idee in UI01-Restarbeiten aufzunehmen.
- Vorschlag: fünf Haupticons beibehalten.
- Vergleichsreihenfolge:
  Füttern · Saubermachen · Pokéball-Aktivitäten · Schlaf/Licht · Zentrale.
- Direkte Pflege links, Aktivitätsmenü mittig, Schlaf/Zentrale rechts.
- Pokéballmenü mit Spielen, Training, Kampf und Expedition vorerst erhalten.
- Keine zusätzlichen Haupticons oder doppelten Funktionszugänge nebenbei ergänzen.
- Erkennbarkeit des Schlaf-/Lichtmotivs bei dieser Vergleichsrunde prüfen.
- Noch keine Reihenfolge oder Motive geändert.
- Vor dem UI01-Abschluss gemeinsam entscheiden und gegebenenfalls gezielt umsetzen.

### Aktuelle Reihenfolge

1. Mega-Abnahme dokumentiert.
2. Idle-Gesten/Ruhemodus-Zentrale gezielt geprüft und abgenommen.
3. Jetzt Verwaltungsmenü und bestehende Einstellungen angleichen.
4. Restarbeiten einschließlich Hauptleisten-Idee und Ehrenei-Abgleich,
   ältere Testanschlüsse und vereinbarte Abschlussprüfungen.
- Keine Gesamtfreigabe, kein P07-Start und kein automatischer Commit/Push.

## UI01 — Schritt 3a: Verwaltungseinstieg, Einstellungen und Dateiauswahl

- Schritt 2 vom Nutzer technisch und sichtbar abgenommen.
- Erste Teilrunde Schritt 3: vorhandene Verwaltungsaktionen neu anordnen/gestalten.
- Gemeinsame Gehäusegrundhaut und Displaypositionen verwenden.
- Hauptmenü behält Sicherungen und Einstellungen sowie Rückkehr zum Pokémon.
- Einstellungen: bestehende vier Alltagsaktionen links, Quellen/Rücksetzbereich rechts.
- Dateien: vier bestehende Zugänge links, Orientierung rechts.
- Tatsächliche Buttons und ihre bisherigen Handler erhalten, nicht nachimplementieren.
- Tonzyklus, Sprachzyklus, Importaufrufe und geschützten Reset unverändert lassen.
- Quellenzugang bleibt außerhalb des Aktionsrasters in eigener Displayhälfte.
- Sicherungsdialog, Bestandsprüfung, Diagnose- und Quelleninhalte in dieser Teilrunde unverändert.
- Diese Unterseiten bleiben weitere Punkte innerhalb Schritt 3.
- Hauptbildschirm-Reihenfolge bleibt offene Restidee, noch nicht geändert.
- Gezielte Prüfung und sichtbare Abnahme von Schritt 3a offen.

## UI01 — Verwaltung: neue Gestaltung gegen alte Menükaskade abgrenzen

- Erster Schritt-3a-Lauf: 42 bestanden, ein Flächenfehler im Verwaltungseinstieg bei 320.
- Neue Verwaltungsregeln müssen alte globale Raster-/Schriftregeln gezielt überstimmen.
- Ein Zeilenraster mit zwei Displayspalten explizit festlegen.
- Beabsichtigte Button-Schriftgrößen gegen ältere priorisierte Schriftregeln abgrenzen.
- Mindesthöhe 44 und unveränderte Displaygrenzen beibehalten.
- Flächenprüfung nicht lockern; bei Fehler tatsächliche Maße ausgeben.
- Keine Navigations-, Einstellungs-, Speicher- oder Rücksetzfunktion geändert.
- Vollständiger betroffener Lauf und manuelle Schritt-3a-Abnahme noch offen.

## UI01 — Dateikacheln und tatsächliche Ruf-/Textbereitstellung

- Nutzer wünscht am 02.11.2026 um 22:21 CET kürzere Dateikachel-Bezeichnungen.
- Grafikkachel sichtbar „Grafiken laden“, Prüfkachel sichtbar „Bestand“.
- Vollständige ursprüngliche Aktionsnamen als zugängliche Beschriftung/Hinweis erhalten.
- Tatsächliche Import-/Bestandsprüfungs-Handler unverändert.
- Bestandsmotiv als Ordner mit Lupe.
- Sichtbaren Kurztext und vollständigen zugänglichen Grafiknamen getrennt prüfen.
- Vorherige Versuche vor Schreiben gestoppt: Python-Stringsyntax beziehungsweise
  noch nicht angepasste Erwartung des sichtbaren Grafiklabels.
- Rufe und Pokédex-Texte als konkreten UI01-Inhalts-/Importpunkt verfolgen.
- Vor Download lokale Dateien und tatsächlich importierten Profilbestand prüfen.
- Vorbereitungsskripte und aktuellen Arten-/Sprachumfang abgleichen.
- Keine Medien automatisch herunterladen oder vorhandene Dateien überschreiben.
- Import, Wiedergabe/Textanzeige, Sprachzuordnung und Erhalt nach Neuladen prüfen.
- Private Inhalte nicht ungeprüft in öffentliches Repository/Veröffentlichung übernehmen.
- Gezielte technische und visuelle Abnahme dieser Kachelkorrektur noch offen.

<!-- UI01-ADMIN-FOUR-REMAINING-20261102 -->
## UI01 — Verwaltung: vier verbleibende Unterseiten

- Nutzer meldet am 02.11.2026 um 22:33 CET bestandenen gezielten Lauf
  für Dateikachel-/Menüanpassungen.
- Kurze Dateikacheln „Grafiken laden“ und „Bestand“ technisch bestätigt.
- Innerhalb Schritt 3 verbleiben:
  1. Bestand/Dateiverwaltung.
  2. Diagnose.
  3. Quellen & Nutzungsrechte.
  4. Sicherungen.
- Bestand zuerst anhand tatsächlicher Anzeigefunktion gestalten.
- Nur jeweils eigene Seiten/Dialoge gestalten; andere Modalflächen nicht global ändern.
- Bestehende Import-, Prüf-, Sicherungs-, Wiederherstellungs- und Schutzaufrufe erhalten.
- Technische Informationen vollständig und lesbar lassen.
- Rufe/Pokédex-Texte bleiben eigener Bereitstellungs-/Importrestpunkt.
- Installierten Umfang nicht ohne konkrete Profilbestandsanzeige annehmen.
- Hauptleisten-Idee bleibt weiterer offener UI01-Restpunkt.
- Keine vollständige Abnahme von Schritt 3 oder UI01 ableiten.

## UI01 — Bestandsseite mit Kategorien und erhaltenen Originalaktionen

- Tatsächliche Bestands-/Dialogfunktionen anhand lokaler Ausgabe abgeglichen.
- Nur Dateibestandsseite in gemeinsames Gehäuse überführen.
- Links Grafiken, Trainer, Rufe und Texte mit tatsächlichen Bestandswerten.
- Rechts kategorisierte Informationen, vorhandene Nur-fehlende-Option und Originalimportbutton.
- Originalprüfung und Fehlendenexport als feste Symbolwerkzeuge.
- Vollständige bisherige Hinweise über eigenes Infowerkzeug erhalten.
- Vorhandene Buttons, Eingaben und Handler bewegen, nicht neu implementieren.
- Dateinamenanzahl nicht mit Inhalts-/Audio-/Rechteprüfung gleichsetzen.
- Bereichskennzeichnung bei anderen Managerseiten zurücksetzen, keine globale Modaländerung.
- Sicherungs-/Importtransaktionen, Validator und Datenbanklesefunktion unverändert.
- Technische Detailtexte dürfen innerhalb der rechten Informationsfläche scrollen.
- Gezielte Tests und manuelle Bestandsabnahme offen.
- Diagnose, Quellen und Sicherungen bleiben danach innerhalb Schritt 3 offen.

<!-- UI01-CHECKPOINT-20261102-ASSETS-NOT-ACCEPTED -->
## UI01 — Tagesabschluss: Bestandsseite noch nicht abgenommen

- Stand: 02.11.2026, 22:47 CET.
- Nutzer bestätigt um 22:44 CET bestandenen gezielten Bestands-/Import-/Verwaltungslauf.
- Nutzer erklärt Bestandsseite ausdrücklich als noch nicht abgenommen.
- Keine neue konkrete optische Beanstandung daraus erfinden.
- Morgen zuerst aktuelle Bestandsseite gemeinsam ansehen und gezielt nacharbeiten.
- Aktuelle Manager-/CSS-/Test-Anschlussstellen im Wiedereinstieg dokumentiert.
- Danach Diagnose, Quellen & Nutzungsrechte und Sicherungen.
- Hauptleisten-Idee, Ruf-/Textbereitstellung und weitere Abschlussrestpunkte erhalten.
- Detaillierter Zwischenstand in docs/WEITERARBEITEN.de.md.
- Lokale Sicherung: /Users/M1dn8/Downloads/iTamaPoke-Fortsetzung-20261102-224752-429971
- Kein Commit/Push, P07-Start oder UI01-Gesamtabschluss.

## UI01 — Bestandsrevision 2: klare Hinweise und erklärter Dateilistenexport

- Nutzer gibt Bestandskorrekturen am 03.11.2026 um 16:14 CET zur Prüfung frei.
- Beige Titelunterlage nur auf Bestandsseite entfernen.
- Dokument-/Listenmotiv statt allgemeinem Downloadpfeil.
- Vor Dateilistenexport kurze Erklärung im rechten Display; Originalexport bestätigt ausführen.
- Keine Grafikdownloads behaupten oder einführen.
- Hinweise als drei kurze Themenansichten mit sichtbarer Blätternavigation.
- Grafikübersicht auf Normal-/Schillernd-Karten und kompakte gespeicherte Prüfergebnisse reduzieren.
- Blau kennzeichnet Dateibestand, nicht erfolgreiche Inhaltsprüfung.
- Einzelbild-/Animationshinweis in Hinweisansicht erhalten.
- Standard-Grafikübersicht ohne Scrollen prüfen.
- Bestehende Backendfunktionen und openAssets-Aufbau unverändert abgleichen.
- Technische Wiederholungsprüfung und manuelle Abnahme dieser Revision offen.
- Diagnose, Quellen und Sicherungen weiterhin danach.

## UI01 — Gemeinsame Grafikprüf- und Importstation

- Nutzer gibt am 03.11.2026 um 16:30 CET gemeinsame Prüf-/Importstation frei.
- Gleiches Pokédex-Gehäuse während Vorbereitung, Fortschritt, Pause und Ergebnis.
- Stabile Dateistationsszene links, tatsächlicher Fortschritt und strukturierte Zähler rechts.
- Bestehende Verarbeitung um reine UI-Meldungen an Fortschrittsstellen ergänzen.
- Unbekannte Gesamtmenge nicht mit erfundenen Prozenten darstellen.
- Vorhandene Pausen-, Rückkehr- und Berichtaktionen behalten.
- Vollständige originale Statusmeldungen, Dateinamen und Hinweise über Details erreichbar.
- Ursprüngliche Fehler weitergeben und bereits bestätigte Dateien nicht zurückrollen.
- Andere Fortschrittsdialoge ohne Dateioperationskennung unverändert.
- Grafik-, Ruf- und Textimporte verwenden ihre bisherigen Prüfer und Speicherwege.
- Gezielte Prüfung und manuelle Abnahme dieser Stationsrunde offen.
- Bestandsseite insgesamt noch nicht manuell abgenommen.

## UI01 — Ruf- und Textimport in gemeinsamer Station absichern

- Nutzer bestätigt am 03.11.2026 um 16:39 CET den Animationsstil.
- Keine pauschale Bestands-/Importseitenabnahme daraus ableiten.
- Am 03.11.2026 um 16:44 CET Fortsetzung der vereinbarten Reihenfolge freigegeben.
- Gezielt Ruf-/Textimport über vorhandene sichtbare Dateiauswahl prüfen.
- Gültige stille PCM-WAV und ausdrücklich synthetischen Text nur in isolierten Tests verwenden.
- Echte Dateispeicherung, Bytegleichheit, Audio-Dekodierung und Erhalt nach Reload prüfen.
- Texte über tatsächliche Lese-/Anzeigeschnittstellen prüfen.
- Nur-fehlende-Verhalten und Einzeldatei-Fehlerregel erhalten.
- Keine Grafik-Pausenfunktion für Rufe/Texte erfinden.
- Keine echten Pokémon-Inhalte heruntergeladen oder im manuellen Review installiert.
- Tatsächliche private Ruf-/Textbereitstellung bleibt vom installierten Profilbestand abhängig.
- Nach dieser Funktionsrunde Diagnose, Quellen und Sicherungen weitergestalten.

## UI01 — Diagnose im gemeinsamen Verwaltungsgehäuse

- Nutzer meldet Ruf-/Text-/Stationslauf am 03.11.2026 um 16:48 CET als bestanden.
- Echte Pokémon-Inhalte dadurch nicht als bereitgestellt markieren.
- Nächste Seite: Diagnose, mit vier Bereichen Spielstand/Dateien/Speicher/System.
- Technische Werte vollständig in lesbaren Karten, Detailbereich darf scrollen.
- Vorhandene Prüfung, Berichtserzeugung, Fehlererfassung und Nur-Lese-Zugriffe unverändert.
- Hinweis auf Momentaufnahme/seit App-Start und keine automatische Reparatur/Übertragung erhalten.
- Keine Dateianzahl mit Inhaltsprüfung und keinen Grafikcache mit Gesamt-RAM verwechseln.
- Neue Oberflächenprüfung plus bestehende Diagnose-Backendprüfung.
- Technische Prüfung und manuelle Diagnoseabnahme offen.
- Danach Quellen & Nutzungsrechte und Sicherungen.

## UI01 — Diagnose Revision 2: Instrumente statt Textkarten

- Nutzer bestätigt am 03.11.2026 um 16:55 CET linke Diagnoseauswahl.
- Rechte Textkarten noch nicht abgenommen; Instrumentenentwurf um 16:57 CET freigegeben.
- Linke Kacheln unverändert lassen.
- Spielstand: gespeicherte Kopie, Bestätigungszeit und echte Warnung getrennt.
- Dateien: Offline-Bestand und echte Datei-/Sprachzähler, keine Inhaltsfreigabe behaupten.
- Speicher: Webspeicherschätzung und Grafikcache klar getrennt, kein Gesamt-RAM.
- System: Version, seit App-Start erfasste Fehler und tatsächliche Messwerte ohne Leistungsnoten.
- Normale rechte Übersichten ohne Scrollen prüfen.
- Vollständige bisherige Einzelwerte über sichtbaren Detailumschalter erhalten.
- Backendprüfung, Bericht und Fehlererfassung unverändert.
- Technische Wiederholungsprüfung und manuelle rechte Diagnoseabnahme offen.

## UI01 — Quellenregister mit vollständigen Offline-Dokumenten

- Nutzer bestätigt Diagnose-Darstellung am 03.11.2026 um 17:02 CET als passend.
- Nächste Oberfläche: Quellen & Nutzungsrechte.
- Links Quellen/Trainer/Lizenzen/Hinweise, rechts jeweils ein lesbarer Eintrag.
- Rahmenpfeile blättern zwischen Einträgen, vollständige technische Texte rechts scrollbar.
- Bisherigen sicheren card()-Renderer und Quelldaten unverändert erhalten.
- Keine HTML-Injektion; Symbole mit sicheren SVG-DOM-Methoden erstellen.
- Vollständige Lizenztexte unverändert, keine pauschalen Rechtezusagen.
- Lokale Trainerangaben weiter ausdrücklich unbestätigt kennzeichnen.
- Externe Links nur bewusst öffnen, weiterhin ausschließlich HTTP(S) und noopener/noreferrer.
- Vorhandene Sicherheitstests behalten sämtliche Inhalts-/Link-/Artefaktsperrprüfungen.
- DOM-Testmodell nur um verwendete Standard-DOM-Methoden erweitern.
- Technische Prüfung und manuelle Quellenabnahme dieser Runde offen.
- Danach Sicherungsseite; UI01-Restpunkte bleiben erhalten.

## UI01 — Quellenpfeile und Sicherungsentwurf, 03.11.2026

- Nutzer meldet den Lizenzlauf als bestanden und bestätigt beide deutschen Lesefassungen.
- Quellenpfeile an tatsächliche hubDexLayout-Rechtecke und Zeichen < / > angleichen.
- Sichtbare Referenzfelder 30 x 24, größere transparente Klickflächen erhalten.
- Sicherungen: Lokal sichern, Exportieren, Datei laden und Lokale Kopien.
- Vorhandene Speicher-, Import-, Export-, Vorschau- und Löschcallbacks weiterverwenden.
- Lokale Kopien einzeln anzeigen; vorhandene Aktionen als zugängliche Symbolbuttons.
- Originalhinweise über Info erhalten; beschädigte Kopien nicht als wiederherstellbar ausgeben.
- Bestehender Download-/Wiederherstellungstest bleibt mit neuem Exportzugang erhalten.
- Gezielte Prüfungen und Sichtabnahme der Pfeile/Sicherungsseite noch offen.
- Keine Änderung an Speicherformat, Sicherheitskopien oder Medienumfang.

## UI01 — Sicherungen Revision 2, 03.11.2026 18:44 CET

- Nutzer lehnt die bisherige Sicherungsdarstellung noch ab.
- Screenshot zeigt weiterhin beigen Dialoghintergrund und Kopf-Trennlinie.
- Pokédex-Gehäuse aus HUB_DEX_DESIGN gegen allgemeine Dialogregeln durchsetzen.
- Lokal sichern: Spielstand-Kapsel, Name/Level und vorhandene Aufgezogen-/Gefangen-Zähler.
- Export: erkennbare Dateikarten; Laden: bildhafte Einlesestation.
- Lokale Kopien als Archivkarten, vorhandene Lesefehler weiterhin vollständig sichtbar.
- Keine vorgetäuschte Speicherbestätigung und keine neue Import-/Exportlogik.
- Neue Prüfung für tatsächliche Gehäusefarbe, fehlende Dialog-Trennlinie und kompakte Ansichten.
- Technische Wiederholungsprüfung und gemeinsame Sichtabnahme offen.

## UI01 — Sicherungsinformationen als Bildkarten, 03.11.2026 18:50 CET

- Nutzer wünscht abschließend eine bessere rechte Infoansicht der Sicherungsseite.
- Vollständige bestehende Hinweise als einzelne bebilderte Karten darstellen.
- Themen: Aufbewahrung, Export/Inhalt und gegebenenfalls vorhandener Leerbestandshinweis.
- Bestehende Rahmenpfeile und Zähler auch für Info-Karten verwenden.
- Kopienauswahl unabhängig erhalten; Info schließen kehrt zur gewählten Kachel zurück.
- Keine Kürzung von Hinweisen oder Änderung von Sicherungsaktionen.
- Browserprüfung vergleicht Hinweisabsätze exakt mit den ursprünglichen Texten aus openSaves.
- Technische Prüfung und abschließende Sichtabnahme weiterhin offen.

<!-- UI01-ABSCHLUSSMODUS-20261103-1920 -->
## Verbindlicher Abschlussmodus UI01 — 03.11.2026, 19:20 CET

- Nutzer gibt Aufräumen, Abschlussabgleich und Vorbereitung der Prüf-/Veröffentlichungsphase frei.
- Ausdrücklich abgeschlossen: Pokédex-Zugang im Ruhemodus, Ehrenei-Auswahl,
  Mega-Ansichtsreview und Kartenbereinigung.
- Sicherungsseite einschließlich bildhafter Infoansicht am 03.11.2026 um
  18:53 CET vom Nutzer gestalterisch abgenommen.
- Bereits bestätigte Bestand-, Diagnose- und Quellenansichten nicht neu gestalten.
- Entwicklungsprüfung: 1025 interne Arten, 484 Regelverbindungen,
  keine fehlenden/zusätzlichen Verbindungen gegenüber den internen Artendaten.
- Nativer Bindungs-Verhaltenstest: 24 Prüfungen bestanden.
- Anschließender isolierter Web-App-Bindungstest vom Nutzer als bestanden gemeldet.
- Frühere Handybeobachtung aktuell nicht reproduzierbar. Bei Wiederauftreten
  konkreten Speicherstand prüfen; keine Bindungs-/Entwicklungsgrenzen auf Verdacht ändern.
- Entwicklungsanzeige „aktueller Wert / 0“ als separaten bekannten
  Darstellungsbefund führen; vor Abschluss ausdrücklich entscheiden beziehungsweise korrigieren.
- Ab jetzt Umfang einfrieren: keine neuen Funktionen und keine neuen Gestaltungsvarianten.
- Nur nachgewiesene Restfehler, sichere Bereinigung und Abschlussprüfungen bearbeiten.
- Historische Planvermerke und unverbindliche Ideen nicht erneut als offene Pflichtaufgaben behandeln.
- Noch nicht behaupten: vollständige Abschlussprüfung, neuer Veröffentlichungsstand
  oder abschließende iPhone-Abnahme.
- Nächster Schritt: Inventurergebnis auswerten, notwendige Bereinigung festlegen,
  danach vorhandene Gesamtprüfungen und Veröffentlichung vorbereiten.
- Kein automatischer Commit/Push; P07 bleibt zurückgestellt.
