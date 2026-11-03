<!-- ITAMAPOKE_UI01_HANDOFF -->
# UI01 – aktueller Übergabestand

## Teilabnahme 31.10.2026, 22:30 CET — Liga-Zwischenstand und Ablauf

- Nutzerbestätigung: „sehr gut so ist es viel besser -> wir können weiter machen“.
- Aktuelle Liga-Zwischenstandsansicht und neuer Übergangsablauf manuell abgenommen.
- Rechte Überschrift Dein Team; keine Heilungsmarkierungen in dieser Übersicht.
- Trainerporträt-Fortschritt, nächster Gegner und lesbare KP-Statuskacheln erhalten.
- Besiegte Mitglieder grau und ausdrücklich als Besiegt gekennzeichnet.
- Speicherung weiterhin nach jedem Einzelsieg.
- Innerhalb eines Trainers kurze bestätigte Siegrückmeldung mit bewusstem Weiter.
- Große Übersicht zwischen Trainern, auf Wunsch und beim Wiederaufnehmen.
- Speicherfehler/Retry, gespeicherte KP und Heilungen unverändert.
- Ruhmeshalle und globalen Rückpfeil nicht nebenbei erneut gestalten.
- Vorhandene Liga-Teststände 5/6 und Ruhmeshallenfall 7 weiterverwenden.
- Nächster Bereich: eigentliches Kampfmenü in normaler Pokédex-Ausrichtung.
- Zuerst Hauptansicht und vorhandene Aktions-/Attackenauswahl.
- Anschließend Team-/Zwangswechsel und Ergebnisse gezielt prüfen.
- Keine neuen Kampfregeln, keine zusätzlichen Angriffstypen oder Kosten.
- Weitere UI01-Restpunkte einschließlich Ehrenei-Auswahl weiter mitführen.
- Keine vollständige Paketfreigabe oder Gesamttestbestätigung aus dieser Teilabnahme ableiten.
- Kein Commit, Push oder Beginn von P07.


<!-- UI01_CONTINUATION_CHECKPOINT_20261031 -->
## Fortsetzungsstand — 31.10.2026, 13:29 CET

### Verbindlicher Status
- Aktives Paket: UI01. Nicht eigenmächtig P07 beginnen.
- Letzte Nutzerbestätigung am 31.10.2026 um 13:25 CET:
  „test passed -> sehr gut so kann es bleiben“.
- Aktuelle Ruhmeshalle V4 damit sichtbar abgenommen.
- Gezielter Testlauf vom Nutzer als bestanden bestätigt.
- Daraus keinen vollständigen Paketabschluss oder vollständigen Gesamttest ableiten.
- Kein Commit oder Push durch diesen Sicherungsschritt.

### Abgenommene Ruhmeshalle
- Vollständiges geöffnetes Pokédex-Gerät um 90 Grad im Uhrzeigersinn gedreht.
- Linse, Reflex, Gehäuse, Displayrahmen, Mittelsteg und Bedienpositionen drehen gemeinsam.
- Digitale Inhalte passend zur Gerätehaltung aufrecht.
- Knapper Rahmenzähler ohne Regionsnamen; einzeiliger Rahmentitel.
- Gebogener, nach links gerichteter Rückpfeil in der Ruhmeshalle angenommen.
- Ursprüngliche Ehrensaalgrafik oben; blaugraue gemeinsame Displaygestaltung erhalten.
- Bei Team-Einträgen alle gespeicherten Mitglieder unten auswählbar.
- Auswahl wechselt das dargestellte Pokémon oben.
- Letzter Sieger, Auswahl und Schillernd-Markierung unterscheidbar.
- Zuschauer während der Ehrung; reduzierte Bewegung berücksichtigen.
- Einzel-Sieger und alte Abschlüsse ohne Teamdaten nicht nachträglich mit heutigen Daten auffüllen.
- Gestaltung jetzt erhalten und nicht nebenbei erneut umbauen.
- V1-Panorama bleibt Rückfall mit bekannter Abweichung: fehlender Mittelsteg.
- Keine älteren Gesamtdateien blind über den aktuellen Arbeitsstand kopieren.

### Nächster Arbeitsschritt
- Nutzer hat den Rückpfeil ausdrücklich für ALLE Seiten freigegeben.
- Globale Übernahme ist noch offen, nicht bereits umgesetzt.
- Bestehende Rücksprungziele, Sperren und Tastaturbedienung erhalten.
- Abbrechen, Beenden und Später nicht pauschal mit Zurück gleichsetzen.
- Weitere offene UI01-Aufgaben aus dem bestehenden Projektplan beibehalten;
  nicht aus dieser Teilabnahme als erledigt ableiten.

### Teststand und behobene Testannahmen
- Team-Review über bestehenden Fall 7:
  07-johto-vier-andere.tpsave.
- Vorbereitung über echten Liga-/UI-Ablauf; keine erfundenen historischen Siege.
- Sechs Mitglieder einschließlich des geschützten Pflege-Pokémon.
- CARE_MEMBER_PINNED ist eine gewünschte Produktionsregel.
- Erzwungene Wechsel regulär über die sichtbare UI ausführen.
- Besiegte Mitglieder nicht erneut auswählen.
- Bei erzwungenem Wechsel Runde, Gegner-KP und neue eigene KP prüfen.
- Tatsächlich letzten Sieger mit gespeichertem winnerId vergleichen.
- Wand-, Boden- und Teppichfarben getrennt prüfen:
  (0,0) ist Wandfarbe und nicht der zuvor unterlegte Grundton.
- Ursprünglicher Liga-Test und Produktionsregeln nicht für den Review verbiegen.

### Verbindliche Arbeitsweise
- Vollständige, direkt kopierbare Terminalblöcke im Chat.
- Ausgaben per Copy-and-paste, bei Bedarf gezielte kurze Ausschnitte.
- Keine regelmäßigen JSON-/Quellstand-Uploads; Uploadplätze freihalten.
- Vorhandene Quellen und bestätigte Änderungen weiterverwenden.
- Nicht denselben fehlgeschlagenen Schreibblock blind wiederholen.
- Bei Fehlern tatsächlichen Dateistand prüfen, nichts ungefragt zurücksetzen.
- Vorbereitet, geschrieben, technisch bestanden und sichtbar abgenommen unterscheiden.
- Schrittweise entwickeln, im vorhandenen Revisionsbrowser prüfen und korrigieren.
- Vollständige Tests und Veröffentlichung erst beim vereinbarten Paketabschluss.
- Keine neuen Starter, manuellen Browserprofile oder alternativen Reviewwege.
- Benötigte Testspielstände zuerst vorbereiten und prüfen.
- Erst danach alten Review mit q beenden und über bestehenden Startweg neu starten.
- Keine privaten Medien oder Spielstände veröffentlichen.

### Bestehender Review
- Runner: tools/review/manual-review.cjs
- Save-Ordner: ~/Downloads/iTamaPoke-UI01-Johtoreview
- Vorhandenes gespeichertes Revisionsbrowser-Profil und sichtbare Testmarkierung nutzen.
- 1–8: Testfall neu starten.
- s: Screenshot und Notiz.
- r: neu laden, Fortschritt behalten.
- w: vorhandener Größenwechsel einschließlich Hoch-/Querformat.
- h: Hilfe.
- q: Review beenden.
- Keine neuen Testspielstände als Datei in den Chat hochladen.

### Beim nächsten Einstieg
1. AGENTS.md, diese Übergabe, docs/ARBEITSWEISE.de.md und Projektplan lesen.
2. Git-Status und Branch prüfen.
3. Aktuellen lokalen Arbeitsstand nicht mit älteren Uploads oder GitHub gleichsetzen.
4. Abgenommene Ruhmeshalle erhalten.
5. Mit der globalen Rückpfeil-Übernahme fortfahren, sofern der Nutzer nichts anderes vorgibt.

### Lokaler Bezug bei dieser Sicherung
- Branch: main
- HEAD vor Dokumentationsänderung: fe7d6e6
- Statuszeilen vor Dokumentationsänderung: 105
- Geänderter Arbeitsstand ist nicht automatisch eingecheckt.
<!-- END_UI01_CONTINUATION_CHECKPOINT_20261031 -->


## Aktuell: V4-Detailrunde nach positiv bewerteter Gesamtdrehung

- V4-Gesamtdrehung bleibt; Detailrunde noch im Review.
- Einzeiliger Rahmentitel, schmaler Zähler, gebogener Rückpfeil.
- Ursprüngliche Ehrensaalgrafik oben, gespeicherte Siegerurkunde unten.
- Rückpfeil zunächst nur Ruhmeshalle; gemeinsame Übernahme auf andere Seiten noch offen.
- Keine neue Grundgestaltung und keine Änderung an Speicher-/Belohnungslogik.


## Aktueller Ruhmeshallen-Entwurf – V3 horizontale Displays

- Aktuell V3: Ehrensaal oben, Ehrentafel unten, Mittelsteg horizontal.
- Gemeinsamen Displaygrund und gemeinsame Text-/Linienfarben verwenden.
- V2 nicht angenommen; seine zusätzliche Ehrenwand entfällt in V3.
- V1 bleibt als positiv bewerteter Rückfall erhalten.
- Variantenkonstante 1/2/3 plus Reload; keine Gesamtdateien blind zurückkopieren.
- Native Daten-/Belohnungslogik unverändert; V3 noch nicht abgenommen.


## Aktueller Ruhmeshallen-Entwurf – Panorama Vorschlag 1

- Die zweigeteilte Hallen-Datenseite wurde vom Nutzer verworfen.
- Vereinbart ist zunächst der ursprüngliche Ehrensaal im großen Pokédex-Innenbild.
- Kein Drehzwang; Querformat-Vorschlag 2 bleibt spätere Alternative.
- Thron/Podest/Teppich, zentraler gespeicherter Sieger, kleine Ehrentafel.
- Weitere Daten über Info; Native-Speicher-/Belohnungslogik bleibt unverändert.
- Neuer Panorama-Entwurf noch gemeinsam sichtbar abzunehmen.


## Aktualisierung – B-Porträts vollständig abgenommen

- Alle Arena-/Liga-B-Porträts vom Nutzer sichtbar abgenommen.
- Johto-Reviewstände mit Kanto-Ligaabschluss sind geprüft.
- Ältere Hinweise „neue Porträts noch nicht eingebunden“ sind überholt.
- Aktiver Entwurf: Ruhmeshalle im gemeinsamen Doppeldisplay.
- Ruhmeshallen-Umbau und verbleibende Kampf-/Zwischenstandsseiten noch nicht abgenommen.


Gesprächsstand: 31.10.2026, 00:39 CET.
Lokal gesichert: 2026-10-31T00:42:36+01:00
Branch: main
HEAD: fe7d6e620f18fd3906b3041af7e403f88b4bba35

## Verbindlicher Wiedereinstieg
- AGENTS.md, docs/ARBEITSWEISE.de.md, docs/TEST-WORKFLOW.de.md
  und docs/PROJECT-PLAN.de.md beachten.
- Arbeitsweise nicht erneut aushandeln.
- Vollständige Terminalblöcke im Chat; eingebetteter Python-/Node-Code erlaubt.
- Keine herunterzuladenden Installationsskripte als Ersatz.
- Lokalen veränderten Stand erhalten; nicht durch GitHub/alte Auszüge ersetzen.
- Fehlende Informationen durch gezielte kurze Terminalausgaben beschaffen.
- Upload nur als gemeinsam besprochene Ausnahme.
- Bestehenden Revisionsbrowser und dessen gespeichertes Testprofil verwenden.
- Teststände zuerst vorbereiten, erst danach passenden Review starten.
- Keine manuellen Ersatzimporte, neuen Browserprofile oder Startwege.
- Gezielt testen, gemeinsam ansehen, korrigieren.
- Vollständige Abschlussprüfungen erst nach manueller Paketabnahme.
- Kein automatischer Commit/Push und keine Abschwächung von Tests.

## Aktives Paket
UI01 ist aktiv, nicht abgeschlossen. P07 nicht eigenmächtig beginnen.

## Abgenommene Grundlagen
- Kampf-Auswahl: vier Buttons links untereinander; Vorschau/Beschreibung/Aktion rechts.
- Youngster-Trainersprite lokal importiert und abgenommen.
- Arena-/Liga-Vorschauszenen angenommen.
- Arena-Auswahl: acht Orden links, ohne Scrollen; erhaltene Orden golden.
- Rechts Name, Porträt, Ort und Ordensname; keine zusätzliche Gesamtstatistik.
- Regionen/Ordenkoffer/Liga als Rahmenaktionen über den Displays nach Eiermenü-Referenz.
- Liga-Icon regional erst bei acht Orden antippbar.
- Gegnerteam: immer drei feste Plätze je Display, unabhängig von Teamgröße.
- VS-Icon oben rechts unter Zurück, optisch zentriert.
- Energiekosten mittig im unteren Rahmen.
- Kofferpfeile unten ganz links und rechts; nur verfügbare Regionen.
- Wildkampfstart aus activity gezielt repariert und bestätigt.
- Gespeicherte Ligakader und Native-Transaktionen nicht verändern.

## Porträtvarianten – verbindliche Benennung
- Original: die vorherigen Trainerbilder/Darstellung.
- A: Kopf-/Schulter-Anzeigeausschnitt aus Original.
- B: neu gezeichnetes einheitliches Pixelporträt-Set.
- Original und A bleiben als Rückfall erhalten.
- Neue B-Grafiken nicht unter Originaldateinamen überschreiben.

## B bereits eingebunden und abgenommen
- Kanto-Liga: Lorelei, Bruno, Agathe, Siegfried, Blau.
- Nutzer meldete erfolgreichen Testlauf, Import und sichtbare Abnahme.
- Browser-/Packer-Zuordnung zuletzt von 27 auf 32 Einträge erweitert.
- B nutzt fünf eigene TPTR-v2-Kennungen; vorherige 27 Indizes erhalten.
- Privater Importordner:
  $HOME/Downloads/iTamaPoke-Liga-Portraets-B
- Original-Painter und A-Routinen erhalten.
- B-Stil soll jetzt auch für Arena Kanto/Johto und Liga Johto gelten.

## Neue Bildentwürfe freigegeben, NOCH NICHT eingebunden
1. Kanto-Arenaleiter, zwei Reihen zu vier:
   oben Rocko, Misty, Major Bob, Erika;
   unten Koga, Sabrina, Pyro, Giovanni.
   Generierte Tafel: 1536 x 1536.

2. Johto-Arenaleiter, zwei Reihen zu vier:
   oben Falk, Kai, Bianka, Jens;
   unten Hartwig, Jasmin, Norbert, Sandra.
   Generierte Tafel: 1536 x 1024.

3. Johto-Liga-Ergänzung, zwei Porträts:
   links Willi, rechts Melanie.
   Generierte Tafel: 1536 x 1024.

Nutzer hat diese Entwürfe mit „sehr gut“ bestätigt.
Das ist eine Bildentwurfsfreigabe, noch keine Import-/Kleinformat-Abnahme.
Neue Tafeln müssen lokal aufbewahrt werden; ihre Speicherung auf dem Mac
wurde noch nicht durch eine Dateiprüfung bestätigt.

## Wiederverwendung gleicher Personen
- Johto-Liga Koga verwendet das neue Kanto-Arenaleiter-B-Motiv Koga.
- Johto-Liga Bruno verwendet das abgenommene Kanto-Liga-B-Motiv Bruno.
- Johto-Champ Siegfried verwendet das abgenommene B-Motiv Siegfried.
- Keine unnötig unterschiedlichen Porträts derselben Person erzeugen.

## Genau hier weitermachen
1. Lokale Dateien der drei neuen Bildtafeln gezielt prüfen.
2. Aktuelle Import-/Packerzuordnung lesen und erhalten.
3. Neue Tafeln passend zu 4x2 beziehungsweise 2x1 aufteilen.
4. Alten Fünfer-Splitter für 2172x724 NICHT unverändert darauf anwenden.
5. Neue B-Porträts separat verpacken; Originale und Indizes erhalten.
6. Bestehenden Grafik-/BIN-Import verwenden, keine neue Importstrecke.
7. Arena-Auswahl, Detailkopf/Übergabe und Johto-Liga konsistent auf B prüfen.
8. Kleine und große Darstellung im bestehenden Revisionsbrowser gemeinsam ansehen.
9. Erst dann Import-/Sichtabnahme dokumentieren.

## Weitere offene UI01-Arbeiten
- Ruhmeshalle im gemeinsamen Doppeldisplay-Design.
- Unmittelbare Liga-Zwischenstands-/Fortsetzen-Seiten.
- Eigentliches Kampfmenü: Aktionen, Attacken, Teamwechsel, Status und Ergebnisse.
- Verbleibende UI01-Abnahmen und vollständiger Abschluss gesondert.

## Unveränderte Regeln
- Johto erst nach erfolgreichem Kanto-Ligaabschluss.
- Acht Johto-Orden ersetzen diesen Abschluss nicht.
- Freischaltungen nicht für Reviews umgehen.
- Gespeicherter Ligakader unabhängig von heutiger Teamplanung.
- Native Kampfberechnung, Kosten, Heilungen, Belohnungen und Speicherregeln erhalten.
- Ruhmeshallen-/Ehrenei-Regeln nicht nebenbei verändern.
- Medien privat halten; Quellenhinweise sind keine Rechtegarantie.

## Bestehender Review
Runner: tools/review/manual-review.cjs --saves ORDNER
Node: v24.22.1 aus $HOME/.nvm/versions/node/v24.22.1/bin
Profil: $HOME/Library/Application Support/iTamaPoke-Revisionsbrowser-Playwright
Vorbereitete Fälle: $HOME/Downloads/iTamaPoke-UI01-Ordenreview

Tasten:
1–8 Testfall neu starten; s Screenshot/Notiz; r Reload mit Fortschritt;
w Breite; h Hilfe; q Ende.

Ordenfälle 6–8 enthalten keinen Kanto-Ligaabschluss und sind daher
derzeit nicht zum Johto-Review geeignet. Nutzer möchte sie vorerst so lassen.

## Statusgrenzen
- Keine vollständige UI01-Paketabnahme oder Veröffentlichung.
- Kein Commit/Push beauftragt.
- Neue B-Tafeln noch nicht importiert.
- Arbeitsweise bleibt unverändert.
