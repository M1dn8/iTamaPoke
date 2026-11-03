# Projektplan und Übergabe — iTamaPoke

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


<!-- UI01_CURRENT_HANDOFF -->
## Aktuelle verbindliche Übergabe – 31.10.2026, 00:39 CET

- Arbeitsweise: docs/ARBEITSWEISE.de.md
- Maßgeblicher aktueller Stand: docs/UI01-UEBERGABE.de.md
- Kanto-Liga B ist getestet, importiert und abgenommen.
- Neue Kanto-/Johto-Arenaleiter und Willi/Melanie als Entwürfe freigegeben,
  aber noch nicht aufgeteilt, verpackt oder eingebunden.
- Nächster Schritt: diese Tafeln über bestehenden Grafikimport ergänzen.
- Original/A erhalten; kein Paketabschluss, Commit oder Push.
<!-- /UI01_CURRENT_HANDOFF -->



## Verbindlicher Arbeitsmodus — Terminal und bestehender Revisionsbrowser

Dauerhafte Nutzervorgabe, ausdrücklich bestätigt am 30.10.2026.
Dies ist die bereits gestern und heute Morgen praktizierte Arbeitsweise,
keine neue oder bei jedem Schritt erneut auszuhandelnde Vereinbarung.

### Übergabe und Ausführung
- Änderungen als vollständige, direkt kopierbare Terminalblöcke im Chat liefern.
- Eingebetteter Python-/Node-Code innerhalb dieser Terminalblöcke ist zulässig.
- Keine separat herunterzuladenden Installations-, Python- oder Shellskripte
  als eigenmächtigen Ersatz für die Terminalblöcke bereitstellen.
- Keine zusätzlichen Startprogramme, Dateiausführungen per Drag-and-drop
  oder sonstigen neuen Bedienwege ohne vorherige ausdrückliche Zustimmung.
- Vorprüfungen, eindeutige Abbruchmeldungen und passende kurze Tests
  gehören zum jeweiligen Terminalblock.
- Lokale, bereits vorhandene Änderungen erhalten; nicht ungefragt
  zurücksetzen oder durch einen älteren Remote-Stand ersetzen.

### Entwicklung und Prüfung
- Schrittweise entwickeln, unmittelbar im bestehenden Revisionsbrowser
  ansehen und dort nötige Korrekturen vornehmen.
- Während der Entwicklung gezielte, zum Änderungsschritt passende Prüfungen.
- Die vollständige Testsuite und Veröffentlichung erst zum vereinbarten
  Paketabschluss; keine eigenmächtigen Abschluss-, Commit- oder Push-Schritte.
- Bestehende Freigaben und Abnahmen mitführen; nicht erneut aushandeln
  und abgenommene Bereiche nicht ohne Anlass wieder verändern.
- Klar unterscheiden: vorbereitet, lokal ausgeführt, technisch geprüft
  und vom Nutzer sichtbar abgenommen.

### Revisionsbrowser
- Den bestehenden Revisionsbrowser mit seinem gespeicherten Testprofil,
  sichtbaren Testkennzeichen und vereinbarten Terminalbefehlen verwenden.
- Benötigte Testspielstände vor dem dafür erforderlichen Browserneustart
  vorbereiten, nicht erst danach.
- Bestehende Reload-, Screenshot-, Notiz- und Beenden-Funktionen nutzen.
- Keine zusätzlichen manuellen Browserprofile, parallelen Startwege
  oder neu erfundenen Tastenkürzel einführen.
- Keine zusätzlichen manuellen Spielstandimporte als Ersatz für
  den vereinbarten vorbereiteten Review-Ablauf verlangen.

### Informationsbeschaffung und Uploads
- Bereits vorhandene Quellen, ausgeführte Änderungen und bestätigte
  Testergebnisse weiterverwenden.
- Fehlende lokale Informationen möglichst mit gezielten kurzen
  Terminalausgaben ermitteln; keine vollständigen Dateidumps verlangen.
- Datei-Uploads sind kein regulärer Arbeitsweg.
- Nur wenn eine tatsächlich benötigte Datei anders nicht ausgelesen
  werden kann, gemeinsam eine Upload-Lösung als Ausnahme besprechen.
- Einen Remote-GitHub-Stand nicht ungeprüft dem lokal veränderten
  Arbeitsstand gleichsetzen.

### Bindung für weitere Arbeit und Übergaben
- Diese Regeln vor weiteren Umsetzungsschritten und bei Übergaben beachten.
- Der Nutzer muss diese Arbeitsweise nicht täglich erneut erklären.
- Eine vermeintlich bequemere Alternative rechtfertigt keine Abweichung.
- Falls eine Abweichung technisch wirklich erforderlich erscheint:
  Grund und Umfang vorher erklären und ausdrückliche Zustimmung abwarten.
- Diese zusammengefasste Regel hat bei Widersprüchen Vorrang vor älteren
  allgemeinen Workflow- oder pauschalen Uploadformulierungen.


## Verbindliche Arbeitsregel — keine Datei-Uploads

Nutzervorgabe vom 30.10.2026:
Datei-Uploads sind künftig nicht verfügbar und nicht gewünscht.

- Keine Quellstand-, Diagnose- oder Archiv-Uploads anfordern.
- Keine Exportdateien erzeugen lassen, die anschließend hier hochgeladen werden sollen.
- Vorliegende Quellen, bestätigte Änderungen und Testergebnisse weiterverwenden.
- Falls lokale Informationen fehlen, ausschließlich gezielte kurze
  Terminalausgaben zum Einfügen in den Chat anfordern.
- Keine vollständigen Dateidumps als Ersatz-Upload verlangen.
- Fehlende Informationen klar benennen; Schnittstellen nicht erraten.
- Remote-GitHub-Stand nicht mit einem lokal veränderten Arbeitsstand gleichsetzen.
- Keine automatischen Commits, Pushes oder externen Uploads zur
  Beschaffung des Arbeitsstands.
- Diese Regel bei weiteren Arbeits- und Übergabeschritten mitführen.


Stand dieser Planfassung: 28.10.2026.
Diese Datei ist die maßgebliche Aufgaben- und Übergabeliste für die
hier vereinbarten Browser-/iPhone-Erweiterungen.

## Aktueller Arbeitsstand

- Aktives Paket: UI01 — Oberfläche und Navigation.
- P06 einschließlich Build und iPhone-Abnahme abgeschlossen:
  Funktionscommit f16802e, Abschlussdokumentation fe7d6e6.
- Die folgenden älteren P06-Arbeitseinträge beschreiben den historischen
  Verlauf; maßgeblich sind die abschließenden Abnahmeabschnitte.
- Zapdos und Arktos einschließlich gemeinsamer UX-Nacharbeit abgenommen.
- Arktos-Funktionspaket: 24a3105.
- Gemeinsame Begegnungs-Tippsperre und Aufnahme-Finale-Korrektur: 3478b05.
- Veröffentlichter Abnahmestand einschließlich Johto-CI-Testfix:
  c58a67cc00e7574a5dad9af1882f2c41ddcdf284.
- GitHub-Build dieses Standes vom Nutzer als grün bestätigt.
- iPhone-Abnahme vom Nutzer bestätigt; Nacharbeit abgeschlossen.
- Gemeinsames lokales Restpaket P06: Lavados, Mewtu und Mew.
- Konzepte für alle drei vom Nutzer freigegeben; Einzelheiten siehe
  Abschnitt „Konzeptfreigabe Restpaket P06 — 28.10.2026“.
- Lavados lokal implementiert; gezielte Prüfungen bestanden und vom Nutzer
  nach Reviewkorrekturen am 28.10.2026 im Revisionsbrowser abgenommen.
- Lavados und Mewtu lokal im Revisionsbrowser vom Nutzer abgenommen.
- Geschichtenbuttons auf Ortsnamen ohne Pokémon-Spoiler korrigiert.
- Johto-Sperre gezielt im Browser geprüft und vom Nutzer bestätigt.
- Lavados, Mewtu und Mew lokal im Revisionsbrowser abgenommen.
- Letzte Mew-Brückenkorrektur vom Nutzer am 29.10.2026 bestätigt.
- Stand für vollständige Abschlussprüfungen eingefroren; Ergebnisse offen.
- Noch keine neue iPhone-Abnahme oder Abschlussfreigabe des Restpakets.
- Gemeinsame Tippsperre, Aufnahmewege und Finale-Regeln weiterverwenden.
- Danach innerhalb von P06 Mewtu und Mew.
- UI01 bleibt nach dem gesamten P06 und vor P07.
- Interaktiven Revisionsbrowser unverändert als Arbeitsweg weiterverwenden.

### Historischer Ausgangsstand vor dem Arktos-Abschluss

- Aktives Paket: P06 Legendären-Geschichten Kanto — gemeinsame Aufnahmefunktion
  mit Commit d5119a4 auf main veröffentlicht; Build vom Nutzer als grün
  bestätigt und iPhone-Abnahme am 27.10.2026 erfolgreich abgeschlossen.
- Zapdos ist als erster Storypilot abgenommen: Kraftwerk-Abenteuer und
  freiwilliger, garantierter Anschluss nach gewonnenem Prüfduell auf Level 50.
  Funktionscommit 22e6ab8 auf main veröffentlicht, Build vom Nutzer als grün
  bestätigt und iPhone-Abnahme am 27.10.2026 ausdrücklich bestätigt.
- Vor Arktos folgt die freigegebene Reviewnacharbeit: Kampfbedienung,
  Pokédex-/Geschichtennavigation, Sechs-Orden-Freischaltung und Hinweis,
  Kraftwerk-Gestaltung sowie Sicherungsaufgabe und Abschlussanimation.
- Funktionale Zapdos-Abnahme bleibt bestehen; Gestaltung ist noch nicht final.
- Arktos folgt erst danach; P06 insgesamt bleibt offen.
- P05c auf Stand 02e3973 veröffentlicht, Build vom Nutzer als grün
  bestätigt und am 26.10.2026 ausdrücklich abgenommen.
- Grafische P05c-Optimierungen sind zurückgestellt, aktuell nicht hoch
  priorisiert und blockieren P06 nicht.
- P05a bleibt abgenommen: veröffentlichter Funktionsstand 6cf9c07,
  vollständige Nutzerabnahme am 26.10.2026.
- P05b: Commit fb86920 auf main veröffentlicht; CI/Build vom Nutzer als
  grün bestätigt. Erfolgreiche iPhone-Abnahme am 26.10.2026 bestätigt.
- Arbeitsbranch nach Integration: main.
- P01 abgeschlossen mit Commit 99091dc.
- Gezielter Schutztest und vollständige zentrale Prüfung lokal bestanden.
- CI-/Veröffentlichungsworkflow laut Nutzerbestätigung erfolgreich.
- Keine Spieloberfläche oder Spielmechanik in P01 verändert; keine neue
  eigenständige iPhone-Abnahme dieses Schutzpakets durchgeführt.
- Letzter abgenommener Funktionsstand: Zapdos-Kraftwerk-Pilot,
  22e6ab8; iPhone-Abnahme am 27.10.2026.
- Gemeinsame Aufnahmefunktion d5119a4 bleibt als P06-Voraussetzung abgenommen.
- P05c Team in Liga-Kämpfen, 02e3973, bleibt abgenommen.
- Ebenfalls bereits abgenommen: Kanto-/Johto-Teamübersichten,
  26 lokale Trainerporträt-Zuordnungen, TPTR-v1/v2 und Quellenanzeige.
- Diese früheren Funktionsstände wurden nach grüner CI auf dem iPhone geprüft.
- Bilddateien bleiben außerhalb des Repositorys.
- Herkunft dokumentiert; Nutzungs-/Weitergabefreigabe nicht nachgewiesen.

## Verbindlicher Arbeitsablauf

1. Diese Datei und den Git-Arbeitsstand zuerst lesen.
2. Ein aktives Paket mit klaren Abnahmekriterien bestimmen.
3. Betroffene Dateien und vorhandene Tests lesen, nicht Schnittstellen raten.
4. Kleine Änderungen; keine Tests abschwächen, um einen Fehler zu verdecken.
5. Gezielte Tests, danach zentrale Prüfung vor Veröffentlichung.
6. Commit und Push über normale Git-Terminalbefehle.
7. Bestehenden CI-/Build-/Deployment-Workflow abwarten.
8. Änderungen mit sichtbarer Wirkung auf dem iPhone abnehmen.
9. Status, Entscheidungen und nächsten Schritt hier aktualisieren.

Keine GitHub CLI voraussetzen. Keine Schutzregeln umgehen.
Neue Ideen zunächst im Ideenspeicher aufnehmen.
Eine neue Sitzung darf abgeschlossene Arbeit nicht ungeprüft neu eröffnen.

## Reihenfolge und Abnahme

| ID | Paket | Status | Schwierigkeit | Abnahme |
|---|---|---|---|---|
| P00 | Kanto-/Johto-Übersichten und Trainerporträts | Abgenommen | Erledigt | Tests, Deployment und iPhone-Test erfolgreich |
| P01 | Veröffentlichungsschutz Kanto und Johto | Abgeschlossen | Niedrig–mittel | Beide Workflow-Sperren und Artefaktsperre weisen alle 26 Trainerdateinamen ab; Negativtests und zentrale Prüfung grün |
| P02 | Dokumentation und Kontinuität | Abgenommen | Niedrig | Plan/Übergabe versioniert; veraltete Format-/Quellentexte geprüft und bereinigt |
| P03 | Erweiterbare Spracharchitektur | Abgenommen | Mittel–hoch | Sprachregister, Textschlüssel, Rückfallsprache, persistente Sprachwahl und Prüfung fehlender Übersetzungen |
| P04 | Eigenes Team mit bis zu sechs Pokémon | Abgenommen | Erledigt | Individuelle Auswahl, sechs Plätze, Reihenfolge, Entfernen/Ersetzen und persistente Speicherung automatisiert sowie auf dem iPhone geprüft; Build grün, Nutzerabnahme am 25.10.2026 |
| P05 | Eigenes Team in Kämpfen | Abgenommen am 26.10.2026 | Erledigt | P05a, P05b und P05c getrennt implementiert, geprüft und vom Nutzer abgenommen |
| P05a | Team in Wildkämpfen | Abgenommen am 26.10.2026 | Erledigt | Individuelle Mitglieder, Wechsel, KP, Pokéball-Anzeigen, Levelbonus bis 100 und atomare Ergebnis-/Fangspeicherung |
| P05b | Team in Arena-Kämpfen | Abgenommen am 26.10.2026 | Erledigt | Commit fb86920; zentrale Prüfung, WASM-Build, Browserprüfungen, CI/Veröffentlichung und manuelle iPhone-Abnahme erfolgreich |
| P05c | Team in Liga-Kämpfen | Abgenommen am 26.10.2026 | Erledigt | Commit 02e3973; lokale Prüfungen und WASM-Build erfolgreich, 221 Browserprüfungen bestanden/1 übersprungen, Build grün gemeldet und Nutzerabnahme bestätigt; grafische Folgeoptimierungen zurückgestellt |
| P06 | Legendären-Geschichten Kanto | Aktiv; Restpaket lokal abgenommen, vollständige Abschlussprüfungen offen | Hoch | Arktos einschließlich gemeinsamer Nacharbeit veröffentlicht; Build grün und iPhone-Abnahme bestätigt. Lavados, Mewtu und Mew weiterhin getrennt festlegen, umsetzen und abnehmen |
| UI01 | Interface der Pokédex-Zentrale überarbeiten; Canvas aufräumen und optimieren | Offen; nach P06, vor P07 | Nach Umfangsfestlegung bewerten | Konkrete Ansichten und Änderungen gemeinsam festlegen; Revisionsbrowser-Prüfung, passende Tests und iPhone-Abnahme |
| P07 | Legendären-Geschichten Johto | Offen | Hoch | Auf Storysystem aufbauen; getrennte regionale Fortschritte und geprüfte Freischaltungen |
| P08 | Weitere Mega-Entwicklungen | Offen | Hoch | Bestand und Zielarten festlegen; Voraussetzungen, Werte, Darstellung, Rückverwandlung und Speicherung pro Ausbaustufe prüfen |
| P09 | Ligen aller Generationen erweitern | Offen | Sehr hoch | Umfang nach Region/Edition/Variante festlegen; danach jede Liga mit Gegnerdaten, Freischaltung, Fortschritt, Tests und iPhone-Abnahme |
| P10 | Dynamax/Gigadynamax | Konzept offen | Sehr hoch | Erst Machbarkeit und Regeln entscheiden; dann begrenzter Prototyp mit Aktivierung, Dauer, Effekten und Rückkehr zum Normalzustand |
| Q01 | Englisch, Spanisch und Französisch | Offen; nach P03 fortlaufend | Hoch | Alle vereinbarten Oberflächen inklusive dynamischer Texte/Fehler übersetzt; Layout und Sprachwechsel getestet; weitere Sprachen ohne grundlegenden Umbau ergänzbar |
| Q02 | Rechte und private Medien | Fortlaufend | Unterschiedlich | Keine privaten Medien im veröffentlichten Paket; Quellen nachvollziehbar; ungeklärte Erlaubnis nicht als Freigabe darstellen |
| Q03 | Reproduzierbare Bildvorbereitung | Offen | Niedrig–mittel | Entscheidung über medienfreies Beschaffungsskript, Quellenmanifest und Anleitung im Repository |
| Q04 | Testaufbau für gemeinsame UI-Module | Offen | Mittel | Abhängigkeiten von Arena/Liga dauerhaft absichern; vorhandene Tests nicht abschwächen |
| Q05 | Ältere Roadmap abgleichen | Offen | Zunächst Bestandsaufnahme | docs/ROADMAP.ko.md vollständig lesen; alte Punkte gegen aktuellen Code prüfen; nur bestätigte Restaufgaben übernehmen |

## Sprachumfang

P03 betrifft zunächst die Architektur, nicht die Behauptung einer
bereits vollständigen Übersetzung. Q01 umfasst die komplette vereinbarte
Oberfläche auf Englisch, Spanisch und Französisch.
Neue Oberflächentexte sollen nach Einführung von P03 über Textschlüssel
hinzukommen. Namen, importierte Metadaten und fremde Inhalte müssen
gesondert behandelt werden; keine ungeprüfte automatische Übersetzung.

## Entscheidungen vor den größeren Paketen

- P04/P05: Verhältnis Pflege-Pokémon, Box und Team; individuelle Identität,
  Austausch/Freigabe, KP, Heilung/Energie, Wechselregeln und Kampfarten.
- P06/P07: Ziel-Legendäre, Geschichten und Belohnungen gemeinsam festlegen.
  Keine erfundenen Wünsche des Nutzers als beschlossen behandeln.
- P08: Bereits vorhandene Mega-Formen und konkret fehlende Formen erfassen.
- P09: Definition aller Ligen einschließlich Editionen, Varianten und
  gegebenenfalls ligaähnlicher Formate beschließen.
- P10: Dynamax/Gigadynamax als zeitweiliges Kampfsystem untersuchen;
  nicht stillschweigend als dauerhafte Entwicklung umsetzen.
- Q02: Vor Weitergabe von Bildern passende Erlaubnisse klären oder
  ausreichend lizenzierte Alternativen wählen.

## Bekannte Grenzen / weitere Befunde

- Der gezeigte Asset-Pack-Erzeuger erkennt Trainerdateien bislang über
  eine Kanto-Liste. Die Unterstützung neuer Trainer für diesen separaten
  Paketweg ist zu prüfen; der Einzeldateiimport der 26 BINs ist abgenommen.
  Nicht ungefragt im Schutz-Paket mitändern.
- P02-Textbereinigung vorbereitet: Formatbeschreibung v1/v2,
  Trainer-Gesamtzähler und Quellenabschnitt für Arenaleiter/Top Vier/Champs.
  Pauschales Quelldatum entfernt; keine neue Rechteprüfung behauptet.
  Bezeichnungstest, Trainer-/Rechteprüfungen und vollständige zentrale
  Prüfung lokal bestanden. Mit Commit cf6d787 veröffentlicht;
  CI grün und iPhone-Textprüfung vom Nutzer bestätigt. P02 abgeschlossen.
- Alte Roadmap docs/ROADMAP.ko.md bleibt erhalten. Ihr historischer
  Aufgabenstatus ist nicht automatisch der aktuelle Projektstatus.
- Diese Roadmap ist ein Plan, kein Nachweis abgeschlossener Implementierung.

## Abgenommener Stand P05a — Wildkämpfe

P03 und P04 sind abgenommen. Die P04-iPhone-Abnahme wurde mit Commit
6b2bacb dokumentiert. Der folgende Abschnitt hält den P05a-Abnahmestand fest.

P05a ist abgeschlossen. Commit 6cf9c07 wurde auf main veröffentlicht;
der Build wurde vom Nutzer als grün bestätigt.
Am 26.10.2026 hat der Nutzer alle aufgeführten iPhone-Prüfpunkte als
bestanden bestätigt: manueller Start und natürliche Begegnung, aktive
Identität, Teamwechsel, Pokéball-Zustände, Levelbonus bis 100,
Kampfstatistik, Fang, Neuladen, leeres Team und Niederlage.

Implementierter Umfang:
- Vorhandene individuelle Sammlungs-IDs und Teamreihenfolge weiterverwenden.
- Manueller Wildkampf und Begegnungsannahme an denselben Teamweg angebunden.
- Explizit begrenzte wildPrepare-Aktion für den Sammlungsabgleich vor Start.
- Native individuelle KP, freiwilliger Wechsel mit Gegnerzug und erzwungener
  Wechsel ohne zusätzlichen Gegnerzug; gemeinsame zwei Heilungen pro Kampf.
- Aktives Individuum mit korrektem Namen, Art und Schillernd-/Mega-Snapshot.
- Pokéball-Anzeigen beider Seiten; besiegte Mitglieder grau mit Kreuz,
  aktive Position zusätzlich markiert.
- Sieger erhält genau ein Level bis maximal 100, ohne Trainingsbonus.
  Pflegealter bleibt unverändert; alte Spielstände laden Bonus null.
- Pflege- und Box-Sieger über denselben Ganzspielstand-Ergebnisweg speichern.
- Fangfreigabe erst nach bestätigtem Ergebnis; kein doppelter Levelbonus
  bei Speicher-Neuversuch oder anschließendem Fang.
- Profilstatistik für Sieg/Niederlage und Siegesserien wieder angebunden.
  Kampf-Tagesziel zählt mit, aber ohne zusätzliche persönliche Freude-/
  Bindungsbelohnung über diesen Wildkampfweg.
- Neue Texte über die vorhandene Sprachwahl auf Deutsch, Englisch,
  Spanisch und Französisch; kein zweiter Sprachspeicher.
- Zum P05a-Abnahmezeitpunkt blieben Arena und Liga auf ihrem bisherigen Spielerpfad.

Beschlossene Regeln für P05a laut Nutzerentscheidung vom 25.10.2026:
- Das erste kampffähige Mitglied der Teamreihenfolge beginnt.
- Bei leerem Team bleibt der Einzelkampf mit dem Pflege-Pokémon erhalten.
- Teamwechsel verändern die Pflegezuordnung nicht.
- Freiwilliger Wechsel kostet einen Zug; der Gegner kann das neu
  eingewechselte Mitglied angreifen.
- Nach Besiegen eines Mitglieds erfolgt der erzwungene Wechsel ohne
  zusätzlichen gegnerischen Gratisangriff.
- Besiegte Mitglieder bleiben für den restlichen Kampf gesperrt.
- KP bleiben beim Wechsel innerhalb desselben Kampfes erhalten.
- Jeder neue Wildkampf beginnt mit vollständig geheilten Mitgliedern.
- Neuladen beendet den laufenden Wildkampf; keine nachträgliche
  Sieg-/Fangbelohnung. Bereits dauerhaft gespeicherte Ergebnisse bleiben.
- Das Individuum, das das wilde Pokémon besiegt, erhält genau ein Level,
  höchstens Level 100. Dies gilt auch für den Pflege-Einzelkampf.
- Kein zusätzlicher Angriff-/Verteidigung-/Tempo-Trainingsbonus.
  Auf Level 100 kein weiterer Aufstieg und keine Ersatzbelohnung.
- Der Levelbonus hängt nicht vom anschließenden Fangerfolg ab.
- Keine doppelte Belohnung bei erneutem Speicherversuch.
- Beide Kampfseiten zeigen ihre tatsächliche Mitgliederzahl mit kleinen
  Pokébällen: kampffähig farbig, besiegt ausgegraut.
- Levelbonus nicht durch künstliche Erhöhung der Pflegezeit umsetzen.
  Pflege-Level, Kampfwerte und Sammlungssynchronisierung konsistent halten.

Tatsächlicher Prüfstand am 25.10.2026:
- Zentrale lokale Logik-/Oberflächenprüfung erfolgreich.
- Native Level-, Team-, Start- und Ergebnisprüfungen erfolgreich.
- Levelberechnung über 42.400 Alters-/Bonus-Kombinationen geprüft.
- Level-Sicherungsprüfung: 252 Assertions.
- Ergebnisadapter: 54 Assertions plus Ablehnungsprüfungen.
- Routing/neue Sprachkataloge: 74 Assertions.
- Echte WASM-/IndexedDB-Ergebnisfälle: zwölf Browserausführungen erfolgreich.
- Neue Team-Bedienfälle: zehn Browserausführungen erfolgreich.
- Fehlgeschlagene Gesamtläufe wurden nicht als Erfolg gewertet:
  ältere Fang-Testhelfer prüften die Freigabe vor dem asynchronen
  Ergebnisabschluss. Beide warten nun über waitForWildCatchReady auf
  abgeschlossenen Commit, freie Gates und Fangfreigabe; ursprüngliche
  Assertions bleiben erhalten. Keine Zeitlimits erhöht.
- Gemeinsame Fangregression: 24 Ausführungen ohne Retries erfolgreich.
- Abschließende vollständige Browser-Suite ohne Retries:
  187 bestanden, ein vorgesehener Skip, 9,8 Minuten.
- Der Skip betrifft ausschließlich offline.spec.js unter WebKit:
  dieser vorhandene Offlinecache-Test ist ausdrücklich Chromium-spezifisch.
- git diff --check ohne Befund.
- Lokal mit Emscripten 6.0.13 gebaut.
- Buildwarnung in browser_glue.cpp zu TPNamedPrompt/std::string mit
  C-Linkage beobachtet; nicht unterdrückt oder als behoben dargestellt.
- Natürlicher Begegnungsstart durch nativen Prompt-Test und Browser-
  Routingtest getrennt geprüft; keine durchgängige automatische Prüfung
  einer natürlich auftauchenden Begegnung behauptet.
- CI/Veröffentlichung von 6cf9c07 laut Nutzerbestätigung erfolgreich; vollständige manuelle P05a-iPhone-Abnahme am 26.10.2026 bestätigt.

## Abgenommener Stand P05b — Team in Arena-Kämpfen

Regeln vom Nutzer am 26.10.2026 ausdrücklich freigegeben:
- Geplante Individuen und Reihenfolge verwenden; bei leerem Team das
  vorhandene Pflege-Pokémon allein, ohne Kopie oder Pflegewechsel.
- Zu Beginn volle KP und zwei Heilungen je teilnehmendem Individuum.
- Eigene KP, Heilungsvorräte und ausgeschiedene Mitglieder über alle
  gegnerischen Pokémon derselben Arena erhalten; keine Zwischenheilung.
- Freiwilliger Wechsel verbraucht einen Zug mit möglichem Gegnerangriff.
- Pflichtwechsel nach eigenem K. o. ohne zusätzlichen Gratisangriff.
- Eintritt unverändert einmalig 25 Energie beim Pflege-Pokémon;
  20 Energie Reserve erforderlich. Speicherfehler beim Eintritt rollen zurück.
- Siegerindividuum erhält pro besiegtem Gegner ein Level bis maximal 100.
  Mehrere Boni desselben Individuums innerhalb einer Serie sind möglich.
- Boni zunächst nur vormerken; Kampfwerte und maximale KP der laufenden
  Serie bleiben eingefroren. Keine indirekte Zwischenheilung durch Aufstieg.
- Ergebnisabschluss speichert Boni und gegebenenfalls neuen Orden gemeinsam.
  Wiederholungssiege speichern Boni ohne erneuten Orden oder neues Ordensdatum.
- Bei späterer Niederlage bleiben bereits verdiente Boni über den
  Ergebnisabschluss speicherbar. Abbruch vor Abschluss verwirft Vormerkungen.
- Speicherfehler rollen Pflegezustand, Sammlung und Ordensänderung gemeinsam
  zurück; erneuter Versuch darf keine doppelte Belohnung erzeugen.
- Keine Fangoption und keine zusätzliche Wildkampfstatistik über den Arenaweg.
- Kanto und Johto bleiben getrennt. Liga-Teamkämpfe sind nicht Teil von P05b.

Implementierung:
- Arena nutzt den erweiterten Team-Unterbau mit ausdrücklich aktivierten
  individuellen Heilungsvorräten; Wildkämpfe behalten ihren gemeinsamen Vorrat.
- Native Team-Anbindung vor bestätigter Eintrittsspeicherung.
- Eigene und gegnerische Mitgliederanzeigen, aktive Identität und Teammenü.
- Gemeinsamer nativer Ergebnisabschluss und validierter JS-Sammlungsadapter.
- Vorherige reine Ordens-API kann Team-Arena-Ergebnisse nicht separat vergeben.
- Ergebnisanzeige für neuen Orden, Wiederholungssieg, Niederlage und Retry.
- Ergebnisadapter in App-Initialisierung und Offline-Dateiliste registriert.
- Neue native und JS-Prüfungen in der zentralen Prüfliste enthalten.
- Vorhandene Arena-Oberfläche enthält weiterhin deutsche Direkttexte;
  keine vollständige Q01-Übersetzung oder abgeschlossene Sprachabnahme behauptet.

Gefundene und behobene Fehler:
- Alte UI-Testdoubles kannten weder asynchrone Teamvorbereitung noch
  Team-Anbindung und Ergebnisadapter. Auf tatsächlichen Ablauf umgestellt;
  Energie-, Regions-, Rollback- und Sperrprüfungen bleiben erhalten.
- Neue Browserhelfer warten auf die zur nativen Kampf-ID, Runde und
  aktiven Position passende Darstellung statt auf alte Canvas-Menüziele.
- Zeitlimitfehler im gemeinsamen Team-Adapter behoben: Eine Niederlage
  am bestehenden 20-Runden-Limit darf keinen weiteren Pflichtwechsel und
  anschließenden künstlichen Sieg durch erneuten KP-Vergleich ermöglichen.
- Auch reguläre Zeitlimit-Siege mit gegnerischen Rest-KP können zum nächsten
  Arena-Gegner führen. Rundengrenze, Schadensformeln und Siegervergleich
  des Kampfkerns bleiben unverändert; ergänzt ist eine lesende Grenzabfrage.
- Diese gemeinsame Adapterkorrektur betrifft auch den Wild-Team-Unterbau;
  P05a-Regressionsfälle wurden im vollständigen Browserlauf erneut geprüft.

Tatsächlicher lokaler Prüfstand am 26.10.2026:
- Vollständige zentrale Logik-/Oberflächenprüfung erfolgreich.
- Native Arena-Laufzeit-, Team-/Transaktions- und Zeitlimitprüfungen erfolgreich.
- Arena-Ergebnisadapter: 120 Assertions plus Ablehnungsprüfungen,
  tatsächliches Modell, Speichercontroller und strikter Save-Parser;
  nativer Backend-Teil dieses JS-Tests simuliert.
- Aktueller WebAssembly-Kern mit vorhandenem Emscripten 6.0.13 gebaut.
- Vorhandene Warnung zu TPNamedPrompt/std::string mit C-Linkage weiter sichtbar;
  nicht unterdrückt und nicht als behoben dargestellt.
- Neun Arena-Team-Browserfälle in Chromium und WebKit jeweils zweimal:
  36 bestanden, ohne Retry-Erfolg als Ersatz für einen fehlgeschlagenen Lauf.
- Fälle umfassen beide Regionen, individuelle Heilungen, freiwilligen und
  erzwungenen Wechsel, eingefrorene Werte, Reload, Wiederholungssieg,
  Vorbereitung-/Eintrittsquota, Ergebnisrollback und einmaligen Retry-Commit.
- Zeitlimit-Niederlage nach bereits verdientem Bonus und vollständiges
  Team-K. o. werden getrennt im echten Browser geprüft.
- Abschließende vollständige Browser-Suite:
  205 bestanden, eine Prüfung übersprungen, 10,8 Minuten.
- Die übersprungene Prüfung zählt nicht als bestanden; für diesen Lauf
  liegt hier nur die übermittelte Gesamtsumme vor.
- Frühere fehlgeschlagene Browserläufe wurden nicht als Erfolg gewertet.
- git diff --check ohne Befund vor diesem Dokumentationsschritt.
- Commit fb86920 erfolgreich auf main veröffentlicht.
- CI/Build vom Nutzer am 26.10.2026 als grün bestätigt.
- Nutzerbestätigung am 26.10.2026: „P05b Abnahme erfolgreich abgeschlossen“.
- P05b damit abgenommen; keine zusätzlichen manuellen Einzelprüfungen
  über die vorliegende Nutzerbestätigung hinaus behauptet.

## Paket P05c — Team in Liga-Kämpfen

Bestandsaufnahme vor Beginn der Implementierung:
- P05b-Abnahme mit Commit 8c31e5c dokumentiert und auf main gepusht.
- Native Liga-Steuerung, Browser-Steuerung und vorhandene Kanto-/Johto-
  Liga-Prüfungen gelesen.
- Hallenadapter, Hallenoberfläche und regionale Format-/Rollback-
  Absicherungen gelesen.
- Bestehende Liga-Läufe enthalten genau einen Spieler-Snapshot.
- Bestehende Halleneinträge enthalten genau einen Pokémon-Snapshot;
  keine nachträgliche Teamhistorie aus heutigen Sammlungsdaten erfinden.
- Zu diesem damaligen Zeitpunkt war noch keine P05c-Spiellogik
  implementiert oder getestet; aktueller Stand siehe unten.

Vom Nutzer am 26.10.2026 freigegebene Liga-Regeln:
- Neue Läufe binden die geplanten individuellen Mitglieder und ihre
  Reihenfolge. Leere Planung verwendet das vorhandene Pflege-Pokémon allein.
- Mitgliedschaft, Kampflevel, Kampfwerte, Typen und Form werden als
  unveränderlicher Lauf-Snapshot gespeichert.
- Änderungen der aktuellen Teamplanung ersetzen kein Team eines
  gespeicherten Liga-Laufs.
- Neue Läufe beginnen mit vollen KP und fünf eigenen Heilungen je Mitglied.
- KP, verbrauchte Heilungen und ausgeschiedene Mitglieder bleiben über
  alle 26 Gegner erhalten, einschließlich des Übergangs zum Champ.
- Keine Zwischenheilung, Wiederbelebung oder Auffüllung durch Fortsetzen.
- Freiwilliger Wechsel kostet einen Zug mit möglichem Gegnerangriff.
- Pflichtwechsel nach eigenem K. o. ohne zusätzlichen Gratisangriff.
- Bestehende Zeitlimitentscheidung beachten: kein zusätzlicher Wechsel
  nach abschließendem Zeitlimit-Ergebnis.
- Gesamte Teamniederlage beendet den Versuch.
- Pflegezuordnung bleibt unverändert.
- Energie weiterhin einmalig 50 für Top Vier und zusätzlich 30 beim
  Start des Champ-Abschnitts, jeweils mit 20 Reserve beim Pflege-Pokémon.
- Keine Zusatzkosten pro Mitglied oder gewöhnlicher Checkpoint-Fortsetzung.
- Bereits bestätigte Eintrittskosten werden nicht erstattet.
- Pro besiegtem Gegner erhält das siegreiche Individuum ein Level bis 100.
- Levelbonus und nächster Checkpoint werden gemeinsam dauerhaft gespeichert.
- Kampfwerte und maximale KP bleiben während des gesamten Laufs eingefroren.
- Bereits bestätigte Boni bleiben bei späterer Niederlage oder Abbruch erhalten.
- Fehlgeschlagene Speicherung darf weder Bonus noch Fortschritt übernehmen.
- Retry darf weder Belohnung noch Gegnerfortschritt doppelt vergeben.
- Letzter Bonus, regionaler Abschluss und Halleneintrag teilen eine Transaktion.
- Bestehende Einzel-Pokémon-Läufe bleiben im bisherigen Modus nutzbar;
  keine stillschweigende Umwandlung in ein aktuelles Team.

Vom Nutzer am 26.10.2026 freigegebene Ruhmeshallen-Regeln:
- Neue Team-Erfolge verewigen alle zum Lauf gebundenen Individuen
  in ihrer gespeicherten Reihenfolge.
- Das tatsächliche Siegerindividuum des letzten Champ-Gegners wird markiert.
- Ausgeschiedene Mitglieder bleiben Teil des ausgezeichneten Teams;
  ihr Zustand beim Abschluss wird kenntlich gemacht.
- Angezeigt werden eingefrorene Kampflevel und Formen des Lauf-Snapshots,
  nicht spätere Sammlungswerte.
- Individuelle Sammlungs-IDs verwenden; Box-Mitgliedern keine Pflege-
  Lebenskennung erfinden.
- Jeder vollständig gewonnene Lauf zählt als ein Erfolg, nicht als
  mehrere Erfolge pro Teammitglied.
- Höchstens zwölf erfasste Erfolge nach bisherigem Aufbewahrungsprinzip:
  erster Erfolg und bei längerer Historie elf neueste weitere Erfolge.
- Bestehende Einzel-Pokémon-Einträge und historische Abschlüsse bleiben erhalten.
- Alte laufende Einzel-Pokémon-Ligen erzeugen weiterhin passende Einzeleinträge.
- Neues Teamformat ausdrücklich versionieren; unbekannte oder beschädigte
  Daten nicht stillschweigend überschreiben.
- Team-Historie nicht nachträglich für alte Siege rekonstruieren.

## Lokaler Implementierungs- und Prüfstand P05c — 26.10.2026

- Versionierter regionaler Liga-Teamzustand mit C++-/Python-/JS-Prüfungen.
- Individuelle KP, fünf eigene Heilungen je Mitglied, ausgeschiedene Reserven,
  eingefrorene Kampfwerte und Wiederherstellung ohne Auffüllen.
- Start, Fortsetzung, Wechsel und Sieg-Abrechnung an die gemeinsame
  Pflege-/Preferences-/Sammlungstransaktion angeschlossen.
- Eintrittskosten weiterhin 50 für Top Vier und 30 beim Champ-Start;
  gewöhnliche Fortsetzungen und Mitgliederwechsel ohne neue Eintrittskosten.
- Individuelle Levelgewinne bis 100; Bonus und Checkpoint gemeinsam gespeichert.
- Letzter Bonus, regionaler Titel, Team-Halleneintrag und Entfernen des
  Laufzustands werden innerhalb einer gemeinsamen Transaktion vorbereitet.
- Team-Hallenformat V2 mit gespeicherten Mitgliedern und separater Pflegebindung.
  Vorhandene Einzelsieger bleiben Einzelsieger; keine erfundene Teamhistorie.
- Liga- und Hallenoberfläche angeschlossen. Alte Einzelläufe behalten ihren Pfad.
- Fortsetzen und Sieg-Abrechnung verwenden die gebundene gespeicherte
  Mitgliederliste, nicht die heutige Teamplanung. Mitglieder müssen weiterhin
  vorhanden sein; Pflegebindung und gespeicherter Fortschritt werden geprüft.
- Neue P05c-Oberflächentexte über Textschlüssel für de/en/es/fr registriert;
  englische Basisschlüssel werden zuerst angelegt. Keine Behauptung einer
  vollständigen Übersetzung aller älteren Liga-Oberflächen; Q01 bleibt offen.

Vorliegende lokale Prüfergebnisse:
- Zentrale Logik-/Oberflächen-Vorprüfungen nach den letzten Korrekturen grün.
- Regulärer Emscripten-WASM-Build erfolgreich; native Quellen danach unverändert.
- 16 gezielte Team-Liga-Browserprüfungen in Chromium/WebKit bestanden:
  beide Regionen, individuelle Sieger und Heilungen, Checkpoint-Reload,
  Pflichtwechsel, Niederlage, Speicherfehler/Retry, Team-Halleneintrag sowie
  Sicherungsimport mit abweichender heutiger Teamplanung.
- 10 vorhandene Sprachpilot-Browserprüfungen bestanden.
- Arena-Synchronisationsschutz: 12 gezielte Wiederholungen und alle
  18 Arena-Team-Browserprüfungen bestanden; Erwartungen nicht abgeschwächt.
- Vollständiger Browserlauf nach den abschließenden Sprach-/Planungskorrekturen
  am 26.10.2026: 221 bestanden, 1 übersprungen, keine Fehlschläge
  (222 Testausführungen über Chromium und WebKit; Laufzeit 13,1 Minuten).
- Starke/schwache synthetische Sammlungswerte dienen der Integrationsprüfung,
  nicht als Balancing-Nachweis.
- Bekannte separate Build-Warnung: TPNamedPrompt mit C-Linkage und std::string
  in browser_glue.cpp. Build erfolgreich; Warnung nicht behoben oder unterdrückt.
- Keine CI-/Deployment-Bestätigung und keine iPhone-Abnahme durch diese
  lokalen Ergebnisse behauptet; diese Schritte separat bestätigen.

## P05c-Abnahme und Übergang zu P06 — 26.10.2026

- Veröffentlichter Funktionscommit: 02e3973 auf main.
- Nutzer meldete den Build als grün.
- Nutzerbestätigung: „P05c abgenommen einige Grafische Optimierungen sind
  nötig aber sind zum jetzigen Zeitpunkt nicht von hoher Priorität,
  weiter mit P06“.
- P05c ist damit abgenommen. Keine weiteren manuellen Einzelprüfungen
  über diese Nutzerbestätigung hinaus behauptet.
- Grafische Folgeoptimierungen sind kein aktueller P06-Umfang.
  Betroffene Ansichten und konkrete Änderungen wurden noch nicht benannt.
- Frühere lokale Zwischenstände mit offener Abnahme sind historisch;
  diese Abnahmebestätigung ist der aktuelle Status.

## Aktuelles Paket P06 — Legendären-Geschichten Kanto

- Zunächst einen einzelnen Pilotfall festlegen und vollständig abnehmen.
- Vom Nutzer am 26.10.2026 festgelegte Reihenfolge:
  Zapdos, Arktos, Lavados, Mewtu, Mew.
- Erster vollständig umzusetzender und abzunehmender Pilot: Zapdos.
- Freigegebene Zapdos-Grundlage: Variante 1, das Kraftwerk-Abenteuer,
  mit freiwilligem, garantiertem Anschluss nach gewonnenem Prüfduell.
- Die zunächst offenen Story-/Kampfregeln wurden am 27.10.2026 als
  begrenzter Pilotvorschlag freigegeben; verbindliche Einzelheiten
  siehe Abschnitt „Freigegebene Zapdos-Pilotregeln — 27.10.2026“.
- Vorhandene Begegnungs-, Kampf-, Sammlungs-, Fortschritts- und
  Speichermechanismen zuerst anhand des Codes prüfen.
- Voraussetzungen, Fortschritt, Begegnung und Ergebnis persistent abbilden.
- Fang-/Belohnungsregel, Wiederholbarkeit und Verhalten bei Niederlage,
  Abbruch, Reload oder fehlgeschlagener Speicherung ausdrücklich festlegen.
- Keine Wünsche, Orte, Dialoge oder Belohnungen als bereits vereinbart erfinden.
- Neue Oberflächentexte über das vorhandene Sprachregister ergänzen.
- P07 und weitere Geschichten erst nach dem abgenommenen Pilotfall angehen.

## Freigegebene gemeinsame Aufnahmefunktion — 26.10.2026

- Gilt für erfolgreiche Fänge und freiwillige Pokémon-Anschlüsse.
- Bei freiem Teamplatz wird das neue Individuum zusätzlich ins Team aufgenommen.
- Bei sechs Teammitgliedern fragt ein Dialog nach Teamaufnahme oder Boxablage.
- Bei gewünschter Teamaufnahme wählt der Spieler das zu ersetzende Mitglied.
- Das Pflege-Pokémon darf im Aufnahmedialog nicht ausgetauscht werden.
- Das ersetzte Individuum bleibt in der Sammlung; keine automatische Freilassung.
- Ohne Teamaufnahme wird das neue Individuum in einer freien Box gespeichert.
- Auch eine Teamaufnahme benötigt einen freien Sammlungsplatz:
  Ein Teamtausch entfernt das bisherige Individuum nicht aus der Sammlung.
- Bei fehlendem Platz bleibt die bestätigte Aufnahme dauerhaft ausstehend.
- Höchstens eine ausstehende Aufnahme pro Spielerprofil.
- Weitere Fang- und Anschlussvorgänge bleiben bis zu deren Abschluss gesperrt.
- Pflege und Boxverwaltung zum Schaffen eines freien Platzes bleiben möglich.
- Nach Neustart darf die Aufnahme weder verloren gehen noch überschrieben werden.
- Kein erneuter Fangwurf für einen bereits bestätigten erfolgreichen Fang.
- Teamänderung, neues Individuum und Abschluss der ausstehenden Aufnahme
  gemeinsam speichern; bei Fehler keine halbe oder doppelte Übernahme.
- Für Zapdos bleibt der gewonnene Prüfkampf bestätigt. Bei voller Sammlung
  wartet Zapdos auf seine Aufnahme; kein erneuter Kampf erforderlich.
- Die gemeinsame Aufnahmefunktion ist Voraussetzung des Zapdos-Piloten.
- Bereits abgenommene Kampf- und Belohnungswege nur gezielt erweitern und
  mit bestehenden sowie neuen Prüfungen absichern.

## P06-Zwischenstand — gemeinsame Aufnahmefunktion, 26.10.2026

Implementierter Umfang:
- Gemeinsames Aufnahmemodell für erfolgreiche Fänge und freiwillige Anschlüsse;
  höchstens ein wartendes Individuum je Profil.
- Native Speicherung mit Versions-/Prüfsummenmetadaten, strikte Save-Prüfung
  und Einbindung in die vorhandene Sammlungstransaktion.
- Erfolgreiche Fänge speichern zunächst die bestätigte Aufnahme. Bei freiem
  Team- und Sammlungsplatz folgt die automatische Einordnung.
- Bei sechs Teammitgliedern stehen ausdrückliche Teamaufnahme mit Auswahl
  des zu ersetzenden Mitglieds oder reine Boxablage zur Verfügung.
- Das aktuelle Pflege-Pokémon ist in dieser Austauschentscheidung gesperrt;
  das ersetzte Individuum bleibt in der Sammlung.
- Volle Boxen erhalten den Wartezustand über Reload hinweg. Die vorhandene
  Boxverwaltung ist aus der Aufnahmeoberfläche erreichbar; nach Freigabe
  eines Platzes kann die Aufnahme fortgesetzt werden.
- Weitere Fangversuche sind bei wartender Aufnahme nativ gesperrt;
  der gemeinsame Anschlussweg verweigert eine zweite Reservierung.
- Neues Sammlungsindividuum, Teamänderung und Abschluss der Aufnahme werden
  gemeinsam dauerhaft gespeichert. Bis zur Bestätigung bleiben die bisherigen
  veröffentlichten Zustände sichtbar; Fehler erlauben keine halbe Übernahme.
- Ein Fehler bei der Einordnung eines bereits bestätigten Fangs bewahrt
  die Aufnahme, statt einen neuen Fangwurf anzufordern.
- Neue Aufnahmetexte verwenden das vorhandene Sprachregister mit Einträgen
  für Englisch, Deutsch, Spanisch und Französisch. Keine vollständige
  Q01-Übersetzungsabnahme daraus ableiten.

Lokal bestätigte Prüfungen:
- Zentrale Logik-/Oberflächen-Vorprüfungen einschließlich Aufnahmemodell,
  nativem Speicheradapter und gemeinsamem Persistenzcontroller bestanden.
- Aktueller WASM-Build erfolgreich.
- Gezielter Browserlauf für Aufnahme, Fangadapter und Fangdarstellung:
  16 bestanden.
- Abschließende vollständige Browserregression über Chromium und WebKit:
  229 bestanden, 1 übersprungen, keine fehlgeschlagen; Laufzeit 13,3 Minuten.
  Die übersprungene Prüfung wird nicht als bestanden gezählt.
- Der Fangdarstellungstest hält Fangbestätigung und automatische Einordnung
  ausdrücklich getrennt an und prüft die unveröffentlichten Zwischenstände.
  Erfolgs-/Entkommensprüfungen folgen dem tatsächlichen Fangausgang;
  kein erzwungener nativer Erfolg und kein Nachweis beider Ausgänge je Lauf.
- Anschluss-Browserfälle verwenden vorbereitete Aufnahmedaten und echte
  Speicher-/UI-Wege. Das dortige Zapdos-Level ist ausschließlich ein
  Fixturewert, kein beschlossener Story- oder Balancingparameter.
- Bestehende Strukturassertion der Frame-Sperre an die zusätzliche
  Aufnahme-UI-Sperre angepasst; bisherige Sperren weiterhin verlangt.
- Fang-UI-Test von einer auf die tatsächlich erforderlichen Speichergrenzen
  umgestellt: zwei bei erfolgreicher automatischer Aufnahme, eine bei
  entkommenem Pokémon. Kein Timeout als Fehlerbehebung erhöht.

Abgrenzung / noch offen:
- Der damalige offene Veröffentlichungs-/Abnahmestand ist durch die
  nachfolgende Nutzerbestätigung vom 27.10.2026 überholt.
- Push des Funktionscommits d5119a4 auf main erfolgreich; der Nutzer hat
  den Build als grün bestätigt. Keine zusätzlichen CI-Einzelresultate
  über diese Bestätigung hinaus behauptet.
- Zum damaligen Aufnahme-Zwischenstand war der Zapdos-Pilot noch offen.
  Sein späterer Abschluss ist nachfolgend dokumentiert; P06 insgesamt
  bleibt wegen der weiteren vereinbarten Geschichten offen.
- Zum Aufnahme-Zwischenstand war noch kein Kraftwerk-Abenteuer, Prüfduell
  oder persistenter Zapdos-Storyfortschritt implementiert.
  Der spätere lokale Pilotstand einschließlich wartendem Anschluss ohne
  Wiederholungskampf ist im nachfolgenden Prüfbericht dokumentiert.
- Die damals offenen Pilotregeln sind inzwischen freigegeben;
  siehe „Freigegebene Zapdos-Pilotregeln — 27.10.2026“.
  Daraus folgt noch keine technische Implementierung oder Abnahme.
- Arktos, Lavados, Mewtu, Mew und P07 sind nicht Teil dieses Zwischenstands.

## Abnahme der gemeinsamen Aufnahmefunktion — 27.10.2026

- Veröffentlichter Funktionscommit auf main:
  d5119a4cf0583db8938cdc8ec60f8a82e2d0b54b.
- Commit-Titel: feat: add durable shared Pokemon admission.
- Push erfolgreich; abschließender Arbeitsstand beim Funktionscommit sauber.
- Build vom Nutzer als grün bestätigt.
- Nutzerbestätigung am 27.10.2026:
  „iPhone-Abnahme ist erfolgreich abgeschlossen“.
- Die gemeinsame Aufnahmefunktion als Voraussetzung des Zapdos-Piloten
  ist damit abgenommen.
- Keine zusätzlichen manuellen Einzelprüfungen, insbesondere kein separater
  manueller Vollbox-Nachweis, über diese Gesamtbestätigung hinaus behauptet.
- Diese Aufnahmeabnahme ist keine Abnahme des Zapdos-Storypiloten.
  Dessen späteren Implementierungs-/Prüfstand siehe nachfolgenden Bericht;
  P06 insgesamt bleibt offen.

## Freigegebene Zapdos-Pilotregeln — 27.10.2026

Nutzerfreigabe:
- „Ich gebe den Vorschlag frei und bestätige Lvl 50“.
- Die Freigabe betrifft den begrenzten Pilotvorschlag, nicht eine bereits
  implementierte oder geprüfte Geschichte.

Zugang und Geschichte:
- Eigener Einstieg „Kraftwerk“; genaue Einbindung nach Prüfung der
  vorhandenen Navigation.
- Keine zusätzlichen Orden-, Liga- oder Serienbedingungen im Pilot.
- Kampfbeginn nur, wenn die bestehenden Kampfregeln ihn erlauben.
- Drei kurze, persistent gespeicherte Storyabschnitte:
  Stromstörungen untersuchen, Anlage sichern und Zapdos begegnen,
  anschließend Zapdos' Prüfduell.
- Keine neuen Inventargegenstände, Zufallsfunde oder zeitabhängigen Aufgaben.

Prüfduell und Anschluss:
- Eigenes Team gegen ein einzelnes Zapdos auf festem Level 50.
- Kein Shiny-Zufall im Pilot.
- Keine zusätzlichen Story-Energiekosten; vorhandene Kampfkosten und
  Startbedingungen vor der Anbindung anhand des Codes prüfen.
- Kein Pokéballwurf und keine zusätzliche Fangwahrscheinlichkeit.
- Nach dauerhaft bestätigtem Sieg freiwilliger, garantierter Anschluss
  über die abgenommene gemeinsame Aufnahmefunktion.
- Prüfsieg und Reservierung der Aufnahme gemeinsam dauerhaft bestätigen:
  kein gespeicherter Sieg ohne zugehörigen Anschlussanspruch.

Niederlage, Abbruch und Speicherverhalten:
- Nach Niederlage oder freiwilligem Abbruch bleibt die Geschichte vor
  dem Prüfduell; späterer neuer Versuch ist möglich.
- Bei Schließen/Reload während eines unbestätigten Kampfes Rückkehr zur
  gespeicherten Vorbereitung; kein erfundener Sieg und keine Belohnung.
- Scheitert die Sieg-Speicherung, keine Erfolgsmeldung und kein
  Storyabschluss vor dauerhafter Bestätigung.
- Ein bereits gespeicherter Sieg mit wartendem Anschluss benötigt
  keinen erneuten Kampf, auch nicht nach Reload oder bei vollen Boxen.

Einmaligkeit und Abschluss:
- Genau ein Story-Zapdos pro Profil; nach bestätigtem Sieg kein weiterer
  Belohnungskampf.
- Wartender Anschluss wird in der Geschichte ausdrücklich angezeigt.
- Nach abgeschlossener Aufnahme ist das Abenteuer erledigt.
- Späteres Freilassen erzeugt keinen zweiten Anschlussanspruch.
- Keine zusätzliche Geld-, Gegenstands- oder sonstige Storybelohnung.
- Diese Regelfreigabe war noch keine Implementierungs- oder
  Abnahmebestätigung. Der spätere Abschluss des Zapdos-Piloten ist
  nachfolgend dokumentiert; P06 insgesamt bleibt offen.

## Zapdos-Pilot — lokaler Implementierungs- und Prüfstand, 27.10.2026

Implementierter Umfang:
- Einstieg „Geschichten“ im Spielmenü zur Seite „Kanto · Kraftwerk“.
- Gespeicherte Untersuchung der Stromstörungen und Sicherung der Anlage;
  anschließende Bereitschaft für das Prüfduell.
- Eigenes Team gegen ein einzelnes Zapdos auf festem Level 50.
- Bestehende native Kampfberechnung und individuelle Team-Runtime;
  eigene Story-Kampfzuordnung und eigene Ergebnisübergabe.
- Kein Shiny-Zufall, kein Fangknopf und kein Fangwurf im Prüfduell.
- Bestätigter Sieg reserviert den garantierten freiwilligen Anschluss.
  Story-Sieg, Aufnahmeticket und historischer Artennachweis werden
  innerhalb derselben vorhandenen Gesamtspielstand-Transaktion gespeichert.
- Vor dauerhafter Bestätigung bleiben die bisherigen veröffentlichten
  Story-, Aufnahme- und Sammlungszustände erhalten.
- Speicherfehler erlauben die erneute Bestätigung desselben aufgelösten
  Kampfs; kein neuer Kampf und kein neuer Fangwurf erforderlich.
- Nach Niederlage oder bestätigtem Abbruch bleibt die Vorbereitung erhalten;
  kein Zapdos-Anschlussanspruch aus diesen Ausgängen.
- Nach bestätigtem Sieg Übergabe an die abgenommene Aufnahmefunktion:
  automatische Teamaufnahme bei freiem Team-/Sammlungsplatz, ausdrückliche
  Entscheidung bei sechs Mitgliedern oder dauerhafter Wartezustand.
- Volle Boxen verlieren den bestätigten Sieg auch nach Reload nicht.
  Nach Platzschaffen kann Zapdos ohne Wiederholungskampf aufgenommen werden.
- Nach Aufnahme bleibt das Abenteuer abgeschlossen. Späteres Freilassen
  erzeugt keinen zweiten Anschlussanspruch.
- Typisierte native Storyfelder zpdver/zpdstep/zpdtick und strikte
  gegenseitige Prüfung von Story, Aufnahmeticket und Sammlungsherkunft.
  Unvollständige, unbekannte oder widersprüchliche Zustände werden verweigert.
- Bestehende Kampfbilanz wird fortgeführt; kein zusätzlicher Story-Levelbonus
  und keine zusätzlichen Trainings-, Freude-, Bindungs- oder Energiegaben.
- Historischer Artennachweis über die lokale Erweiterung
  Pet::recordStoryJoin, ohne Zufallsfang oder zusätzliche Tagesziel-/
  Pokédex-Belohnung bei diesem Aufruf.
- Neue Storytexte über das Sprachregister für Englisch, Deutsch, Spanisch
  und Französisch. Keine vollständige Q01-Abnahme daraus ableiten.

Lokal bestätigte Prüfungen:
- Zentrale Logik-/Oberflächen-Vorprüfungen bestanden.
- Reines Storymodell mit echten Aufnahme-/Sammlungsmodellen geprüft.
- Native Speicherung mit echter Pet-/Preferences-Rücknahme und striktem
  Save-Parser geprüft; alte Spielstände ohne Storyzustand bleiben lesbar.
- Eigene native Duellprüfung mit echter Kampfberechnung: Sieg, Niederlage,
  Wechsel, Abbruch, Akteurs-/Tokensperren, Ergebnis-Rollback, Wiederholung
  desselben Ergebnisses und einmaliger Anschlussanspruch.
- Browser-Transaktionscontroller mit echten Modellen, bestehendem
  Persistenzcontroller und echtem Save-Parser geprüft. Native Aufrufe
  werden dort simuliert; der echte Kampf wird separat geprüft.
- Aktueller WASM-Build erfolgreich.
- Gezielter Browserlauf: 30 bestanden über Chromium und WebKit.
- Abschließende vollständige Browserregression:
  243 bestanden, 1 übersprungen, keine fehlgeschlagen; Laufzeit 15,1 Minuten.
  Die übersprungene Prüfung wird nicht als bestanden gezählt.
- Neue Browserfälle prüfen gespeicherte Vorbereitung, vier Sprachvarianten,
  abgewiesene Vorbereitungsspeicherung, tatsächlichen Sieg und Niederlage,
  Abbruch, automatische Aufnahme, gesperrtes Pflege-Pokémon beim Austausch,
  volle Boxen mit Reload/Platzschaffen sowie Ergebnis-Speicherfehler mit
  Wiederholung derselben Begegnung ohne zweite Siegeszählung.
- Starke/schwache Teamwerte und volle Sammlungen sind Testfixtures;
  kein Balancing-Nachweis und keine behauptete manuelle Vollboxprüfung.
- Zwei Fehler im neuen Browsertest korrigiert: fehlenden JavaScript-
  Levelwrapper durch vorhandenen nativen RPC ersetzt und doppelte
  Abbruchdialog-Behandlung entfernt. Keine Testbedingung abgeschwächt.
- Bekannte separate Build-Warnung weiterhin vorhanden:
  TPNamedPrompt mit C-Linkage und std::string in browser_glue.cpp.
  Build erfolgreich; Warnung weder behoben noch unterdrückt.

Zum Zeitpunkt dieses lokalen Prüfberichts noch offene Folgeschritte:
- Veröffentlichung und eigene iPhone-Abnahme waren zunächst offen.
  Diese Punkte sind inzwischen durch den nachfolgend dokumentierten
  Push, die grüne Build-Meldung und die ausdrückliche Pilotabnahme bestätigt.
- P06 insgesamt bleibt offen. Arktos, Lavados, Mewtu, Mew und P07
  wurden mit diesem Pilotstand nicht implementiert oder abgenommen.

## Zapdos-Pilot — Veröffentlichung und Abnahme, 27.10.2026

- Veröffentlichter Funktionscommit auf main:
  22e6ab85f26da1464dab91fafe510759c3fdf940.
- Commit-Titel: feat: implement Kanto Zapdos story pilot.
- Push von de47e87 auf 22e6ab8 erfolgreich; abschließender Arbeitsstand
  beim Funktionscommit sauber.
- Build vom Nutzer als grün bestätigt. Keine zusätzlichen CI-Einzelresultate
  über diese Bestätigung hinaus behauptet.
- Nutzerbestätigung am 27.10.2026:
  „Zapdos-Pilot auf dem iPhone abgenommen“.
- Der Kraftwerk-/Zapdos-Pilot ist damit ausdrücklich abgenommen.
- Keine zusätzlichen manuellen Einzelprüfungen, insbesondere kein separater
  manueller Vollbox-Nachweis, über diese Gesamtbestätigung hinaus behauptet.
- Die gemeinsame Aufnahmefunktion d5119a4 bleibt ebenfalls abgenommen.
- P06 insgesamt bleibt offen. Als Nächstes folgt Arktos, anschließend
  Lavados, Mewtu und Mew. Aus der Reihenfolge folgt noch keine Freigabe
  konkreter Geschichten, Begegnungslevel oder Anschlussregeln dieser Fälle.

## Verbindliche Reviewentscheidungen — 27.10.2026

Grundlage:
- Neun Reviewaufnahmen mit zugehörigen Textdateien und Änderungsnotizen.
- PNG-Dateien wurden aufgelistet, ihre Bildinhalte im Chat aber nicht gesehen.
- Die konkrete Reviewliste ersetzt frühere allgemeine Menü-/Textentwürfe.
- Zusätzliche Bestätigung des Nutzers: „1. ja 2. ja“ für Angriffsanordnung
  und zehn Tipps innerhalb von fünf Sekunden.

Gemeinsame Kampfbedienung:
- Hauptmenü als 2x2-Anordnung:
  links oben Kampf, links unten Pokémon,
  rechts oben Heilung, rechts unten Aufgeben.
- Angriffsmenü als 2x2-Anordnung:
  links oben Kräftig, rechts oben Ausweichen,
  links unten Schnell, rechts unten Zurück.
- Reihenfolge von Kräftig und Schnell auf Nutzerwunsch während der
  manuellen Reviewphase am 27.10.2026 gegenüber der ersten Freigabe getauscht.
- Heilung entfällt im Angriffsmenü; kleiner Mini-Zurück-Knopf entfällt.
- Aktionswirkungen, Heilungsbudgets und native Kampfberechnung unverändert.

Arena und Navigation:
- Ordensübergabe mit passendem Arena-/Typenhintergrund.
- Zusätzlicher fünfter Zugang mit Pokédex-Symbol auf der Pflegeansicht.
- Pokédex-Zentrale bündelt Tagebuch, Geschichten und Arten-Pokédex.
- Wischmenü entsprechend aufräumen und auf Einstellungen ausrichten;
  bestehende Funktionen wie Eier, Entwicklung, Sicherungen und Dateiimporte
  nicht entfernen oder ohne erreichbaren Zugang zurücklassen.
- Freischalthinweis nach sechs unterschiedlichen Kanto-Orden mit
  Pokédex-Kennzeichnung; persistenter Gelesenstatus.
- Bestehende begonnene, wartende oder abgeschlossene Zapdos-Geschichten erhalten.

Geschichten und Kraftwerk:
- Vorgeschaltete Übersicht mit schmalen Geschichtenkacheln und eigenen Symbolen.
- Neue Freischaltungen zuerst, neueste oben; danach weitere offene Geschichten,
  abgeschlossene am Ende. Kraftwerk mit eigenem Kraftwerk-Symbol.
- Kraftwerk-Einstieg: Außenansicht mit flackernden Lichtern;
  Überschrift und Text zentrieren, Fortsetzen-Schaltfläche erhalten.
- Sicherungsseite: Hintergrund im Kraftwerk, Texte zentrieren.
- „Sichere den Weg“ durch „Sichere die Anlage“ ersetzen.
- Zehn Tipps auf eine Stromsicherung innerhalb von fünf Sekunden,
  Zeitbeginn beim ersten Tipp. Bei Ablauf nur den Versuch zurücksetzen.
- Erst nach erfolgreicher Aufgabe „Anlage sichern“ verfügbar machen;
  bestätigten Storyabschluss dauerhaft speichern und nicht erneut verlangen.

Begegnung und Abschluss:
- Überschrift: „Wow ein wildes Zapdos“.
- Haupttext: „Zapdos fordert dich zum Kampf heraus. Wirst du seinen
  gewaltigen Stromschlägen stand halten können?“.
- Große Zapdos-Grafik zwischen Text und Schaltfläche;
  Name und Level darunter möglich. „Ohne Fangwurf“ als sichtbaren Text entfernen.
- Schaltfläche: „Herausforderung beginnen“.
- Sichtbare Bezeichnung „Prüfduell“ durch „Herausforderung“ ersetzen.
- Erfolgstext: „Herausforderung bestanden. Du bist würdig.
  Zapdos möchte sich dir anschließen.“.
- Abschluss zentriert: „Zapdos gefangen. Kraftwerk-Abenteuer abgeschlossen.“.
  Bisherige zusätzliche Abschlusserklärungen entfernen.
- Gewünschte Pokéball-Flug-/Fanganimation ist rein visuell:
  kein neuer Fangwurf, keine neue Fangchance, kein zweites Individuum.
- Erfolgreichen Aufnahmeabschluss erst nach dauerhafter Bestätigung zeigen;
  volle Sammlung weiterhin als wartende Aufnahme darstellen.

Umsetzungsstand:
- Reviewentscheidungen freigegeben; nicht pauschal als bereits implementiert
  oder gestalterisch abgenommen behandeln.
- Funktionale Zapdos-Pilotabnahme 22e6ab8 bleibt bestehen.
- Nacharbeit vor Arktos in getrennten, prüfbaren Schritten abschließen.

## Nächster konkreter Schritt — ausschließlich P06

1. Funktionale Zapdos-Abnahme und konkrete Reviewentscheidungen erhalten.
2. Gemeinsame Kampfbedienung umstellen und einschließlich Heilungsrouting prüfen.
3. Pokédex-Zentrale, Geschichtenübersicht, Sechs-Orden-Freischaltung und
   persistenten Freischalthinweis mit Erhalt bestehender Storyfortschritte umsetzen.
4. Kraftwerk-Gestaltung, konkrete Texte, Sicherungsaufgabe und rein visuelle
   Abschlussanimation ergänzen; keine Fang-/Belohnungsregeln unbemerkt ändern.
5. Nacharbeit gezielt und zentral prüfen; Build, Browserregression,
   Veröffentlichung und passende iPhone-Abnahme separat bestätigen.
6. Erst danach Arktos-Geschichte und Regeln vorschlagen.


## Ideenspeicher

- 26.10.2026: Grafische Folgeoptimierungen für P05c vom Nutzer benannt.
  Aktuell nicht hoch priorisiert; konkrete Ansichten und Änderungen
  noch offen. Nicht automatisch in P06 aufnehmen.

Neue Ideen hier mit Datum, Nutzen, Abhängigkeiten und offenem
Entscheidungsbedarf ergänzen. Nicht automatisch ins aktive Paket aufnehmen.

## Übergabe nach jedem Paket

- Aktives Paket / ID:
- Branch und letzter Commit:
- Geänderte Bereiche:
- Gezielte Tests:
- Zentrale Prüfung:
- CI / Veröffentlichung:
- iPhone-Abnahme, sofern betroffen:
- Offene Fehler / Entscheidungen:
- Nächster konkreter Schritt:

## Reviewnacharbeit — bestätigter Zwischenstand, 27.10.2026

Manuelle Bestätigung:
- Nutzerbestätigung im Revisionsbrowser am 27.10.2026:
  „jetzt passt alles“.
- Bestätigt sind die nachfolgend beschriebenen gemeinsamen Bedienungs-,
  Navigations- und Hinweisänderungen.
- Keine Veröffentlichung, kein veröffentlichter grüner Build und keine
  gesonderte iPhone-Abnahme dieses Änderungsstands damit behauptet.

Lokaler Umfang:
- Kampfhauptmenü: Kampf / Heilung sowie Pokémon / Aufgeben.
- Angriffsmenü: Kräftig / Ausweichen sowie Schnell / Zurück.
  Heilung nur auf der Hauptebene; Aktionswirkungen unverändert.
- Fünfter Pflegezugang zur Pokédex-Zentrale.
- Zentrale mit Tagebuch, Geschichten, Arten-Pokédex, Eier und Entwicklung.
- Oberes Wischmenü auf Sicherungen und Einstellungen reduziert;
  bestehende Rückwege und Datei-/Verwaltungszugänge erhalten.
- Geschichtenübersicht mit Kraftwerk-Kachel.
- Neuer Zapdos-Beginn nach sechs unterschiedlichen Kanto-Orden;
  Johto zählt nicht mit, vorhandener Storyfortschritt bleibt erreichbar.
- Blau-weißes Informationssymbol und vollbreiter hellblauer Hinweisbutton:
  „In deinem Pokédex ist eine neue Geschichte verfügbar.“
  Bestätigung dauerhaft speichern und direkt Geschichten öffnen.
- Rote Zahlenplaketten für offene Geschichten und neue Tagebucheinträge.
- Roter Geschichtenpunkt bleibt bis zum vollständigen Abschluss bestehen.
- Neue Tagebucheinträge beim ersten Anzeigen markieren; nach gespeicherter
  Lesebestätigung beim erneuten Aufruf ohne Markierung.
- Fortlaufende native Tagebuchzählung berücksichtigt den 200-Einträge-Ring;
  vorhandener Altbestand wird nicht pauschal als neue Meldung behandelt.
- Schreibfehler behalten Hinweis-/Lesestatus und erlauben Wiederholung.
- Weitere Form-/Farboptimierung der Zentrale und Neuordnung der unteren
  Karten-/Statusseiten ausdrücklich zurückgestellt.

Prüfstand und Grenzen:
- Native Freischalt-, Hinweis- und Tagebuchprüfungen erfolgreich.
- WASM-Build erfolgreich; bekannte TPNamedPrompt-C-Linkage-Warnung bleibt.
- Letzter gezielter Browserlauf: 40/40 bestanden in Chromium und WebKit,
  ohne automatische Fehler-Retries.
- Frühere größere gezielte Läufe einschließlich Navigation und Offlinezugang
  ebenfalls erfolgreich; daraus keine vollständige aktuelle Gesamtregression
  ableiten.
- Abschließende zentrale Gesamtprüfung, vollständige Browserregression,
  Diff-Prüfung und Dokumentationsabgleich vor Veröffentlichung noch offen.

Jetzt folgende Zapdos-Nacharbeit:
1. Kraftwerk-Außenansicht mit flackernden Lichtern, zentrierter Einstieg
   und Sicherungsseite mit Innenansicht.
2. Sicherungsaufgabe mit zehn Tipps innerhalb von fünf Sekunden;
   Beginn beim ersten Tipp, bei Ablauf nur Versuch zurücksetzen.
3. Vereinbarte Begegnungs-/Erfolgstexte und große Zapdos-Darstellung.
4. Rein visuelle Aufnahmeanimation und bestätigter Abschluss ohne neue
   Fangchance oder zweites Individuum.
- Bestehende Story-, Aufnahme- und Speicherabsicherung erhalten.
- Weitere freigegebene, noch nicht umgesetzte Reviewpunkte bleiben offen.
- Arktos erst nach Abschluss der vereinbarten Reviewnacharbeit.

### Zapdos-Sicherungsaufgabe — Implementierung zur Prüfung

- Außenbeleuchtung nach Nutzerreview heller und doppelt so schnell;
  sechs Ansichtsprüfungen erfolgreich, Flackern manuell bestätigt.
- Innenansicht manuell bestätigt.
- Sicherungsaufgabe zur Prüfung ergänzt: zehn Tipps innerhalb von fünf
  Sekunden, Zeitbeginn beim ersten Tipp.
- Versuchszähler und Zeit sind flüchtig; kein Speichern einzelner Tipps.
- Zeitablauf oder Verlassen verwirft nur den unvollständigen Versuch.
- Erfolg nutzt den bestehenden dauerhaften Storyübergang.
- Bei fehlgeschlagener Speicherung bleibt der geschaffte Versuch auf
  der geöffneten Seite für eine Schreibwiederholung erhalten.
- Browser-UI verhindert den direkten secure-Übergang ohne geschaffte
  Aufgabe; kein neues natives Minispiel-Speicherfeld eingeführt.
- Texte in Deutsch, Englisch, Spanisch und Französisch.
- Gezielter kombinierter Browserlauf: 33 bestanden, eine
  Chromium-spezifische Offlineprüfung unter WebKit übersprungen;
  keine automatischen Fehler-Retries.
- Zusätzliche gezielte WebKit-Prüfungen für Zeitablauf und stabile
  Eingabe erfolgreich.
- Minispiel am 27.10.2026 manuell bestätigt: „das passt sehr gut“.
- Keine vollständige Projekt-Gesamtregression oder Veröffentlichung
  damit behauptet.
- Begegnungsseite vor dem Kampf und Aufnahme-/Abschlussdarstellung
  weiterhin als folgende Reviewnacharbeit offen.

### Zapdos-Begegnungsseite — Implementierung zur Prüfung

- Große zentrierte Darstellung aus lokalem p145.bin über den vorhandenen
  gemeinsamen TPK2-Lader und dessen Frame-Decoder.
- Statischer erster Idle-Frame; eigene Canvas-Zeichenfläche, kein Wechsel
  des aktiven Pflege-Pokémon und kein Zugriff auf den Hauptcanvas.
- Transparente Ränder beim Darstellen ausgespart.
- Fehlende/unlesbare Grafik verständlich anzeigen, Kampfzugang nicht
  zusätzlich sperren; keine externen Grafikdownloads.
- Begegnungsbeschreibung knüpft in vier Sprachen an die gesicherte Anlage an.
- Level, Kampfregeln, Aufnahmebedingungen und Storyzustand unverändert.
- Neue Grafikprüfungen verwenden synthetische TPK2-Testdaten, keine
  mitgelieferte Pokémon-Grafik.
- Prüfungen und manuelle Abnahme der Begegnungsseite noch ausstehend.
- Aufnahmeanimation und Abschlussdarstellung bleiben folgende Nacharbeit.

### Begegnungsseite — Nutzerkorrektur, 27.10.2026

- Überschrift: „Ein wildes Zapdos“.
- Beschreibung nach Nutzerwortlaut: „Beweise Zapdos, dass du würdig bist!“
- Name und Level bleiben; Zusatz „Ohne Fangwurf“ entfernt.
- Sichtbaren Startbutton entfernt. Der Grafikbereich ist selbst der
  Kampfzugang, einschließlich Tastaturbedienung und zugänglicher
  Aktionsbeschriftung.
- Vorhandene Sperren und derselbe start-Aufruf bleiben erhalten.
- Entsprechende Texte in allen vier Sprachen aktualisiert.
- Prüfungen und manuelle Abnahme dieser Korrektur noch ausstehend.

### Begegnungsseite — manuelle Abnahme und offenes Finale

- Begegnungsseite am 27.10.2026 manuell im Browser bestätigt.
- Deutscher Begegnungstext korrigiert:
  „Beweise Zapdos, dass du würdig bist!“
- Kombinierter gezielter Lauf vor dieser Satzkorrektur:
  45 bestanden, eine Chromium-spezifische Offlineprüfung unter WebKit
  übersprungen. Danach zwölf Begegnungsprüfungen bestanden.
- Neuer Nutzerwunsch: deutscher Siegtext „Du bist würdig!“;
  „Zapdos möchte sich dir anschließen.“ bleibt unverändert.
- Finale Aufnahme-/Fangdarstellung und Abschluss noch umzusetzen.
- Animation ausschließlich visuell; bestehende dauerhafte Aufnahme,
  Kapazitätsprüfung und Schutz vor zweitem Individuum erhalten.
- Keine Gesamtregression oder Veröffentlichung damit behauptet.

### Zapdos-Aufnahmeszene — Implementierung zur Prüfung

- Finale Abschlussseite um visuelle Pokéball-Aufnahmeszene ergänzt.
- Szene ausschließlich im bestehenden Abschlusszweig nach erfolgreicher
  dauerhafter Aufnahme; wartende Aufnahme und Kapazitätsverwaltung
  unverändert.
- Animation hat keine Speicher-, Zufalls- oder Aufnahmeautorität.
- Bereits abgeschlossene Abenteuer können die rein kosmetische Szene
  beim erneuten Öffnen wieder zeigen; kein zweites Individuum entsteht.
- Eigene Darstellungsfläche mit vorhandenem lokalem Zapdos-Porträt.
- Reduzierte Bewegung zeigt unmittelbar den statischen Erfolgszustand.
- Fehlende Grafik verhindert weder den gespeicherten Abschluss noch
  dessen Bestätigung; statischer Ball und verständlicher Hinweis.
- „Abschließen“ führt zurück zur Geschichtenübersicht.
- Deutscher Siegtext „Du bist würdig!“; bestehender Anschlusswunsch
  unverändert. Siegtext sinngemäß auch in den anderen drei Sprachen.
- Prüfungen und manuelle Abnahme der finalen Szene noch ausstehend.

### Zapdos-Abschlusskachel und Anschluss-Tagebuch

- Finale auf 7,2 Sekunden verlängert, drei getrennte Wackelbewegungen,
  einzelner goldener Blinkeffekt.
- Flexible Bildhöhe, kein Scrollen; zusätzlicher Abschlussbutton entfernt.
- Vier gezielte Finale-/Layoutprüfungen erfolgreich.
- Abgeschlossene Kraftwerk-Kachel ausgegraut und deaktiviert;
  18 Zapdos-Browserprüfungen danach erfolgreich.
- recordStoryJoin setzt weiterhin ausschließlich die bestehende historische
  Markierung; keine zusätzliche Belohnung oder Tagebuchmeldung am Sieg.
- Anschluss-Tagebuch zur Prüfung an die tatsächliche Aufnahme gekoppelt:
  spezieller nativer Staging-Aufruf mit Storyticket und Pending-Prüfung,
  eingebunden in den bestehenden vollständigen Pet-/Preferences-Undo.
- Der dekodierte Aufnahme-Datensatz wird weiterhin im JS-Modell validiert;
  der native Aufnahmetransport bleibt ein opaker Transport.
- JR_CAPTURE mit Flag 2 kennzeichnet freiwilligen Story-Anschluss.
  Bestehende Datensatzgröße und Ereignistypnummern unverändert.
- Tagebuchtext in vier Sprachen, vorhandener Ungelesen-Hook weiterverwendet.
- Neue native Wirkung wird durch echte WASM-Browserintegration geprüft;
  der Controller-Test mockt weiterhin nur den Transport.
- WASM-Build erfolgreich; bekannte TPNamedPrompt-C-Linkage-Warnung
  unverändert vorhanden.
- Vier Modell-/Controllerprüfungen erfolgreich; native Transportschicht
  in den betreffenden Controllerprüfungen weiterhin gemockt.
- Echter WASM-Browserlauf: 20 Zapdos-Prüfungen in Chromium und WebKit
  bestanden, ohne automatische Fehler-Retries.
- Aufnahme einschließlich Tagebucheintrag, Ungelesen-Zähler,
  fehlgeschlagener Speicherung, Wiederholung und Duplikatschutz geprüft.
- Revisionsbrowser am 27.10.2026 um 22:41 Uhr manuell abgenommen.
- Vollständige Browserregression nach dem neuen WASM-Build, zentraler
  nativer Gesamtcheck und abschließender Diff-/Planabgleich noch offen.
- Noch kein Commit, Push oder veröffentlichter grüner Build.

### Testworkflow — gebuendelter Abgleich nach dem Review

- Audit der bereitgestellten 330 Dateien und 41 Browser-Spec-Dateien.
- Veralteten Dex-Menueinstieg und veraltete C5-Menueerwartung korrigiert.
- Gemeinsame Navigationshelfer fuer die aktuellen fuenf Zentralenzugaenge;
  Menue-, Zentralen- und Rueckwege sprachabhaengig statt fest deutsch.
- Neuen kurzen Navigationstest fuer vier Sprachen und beide Browser ergaenzt.
- Automatische Ganztest-Retries auch in CI auf null; Standard-Fehlerbudget
  fuenf, vorgeschaltete Navigation weiterhin Fail-fast.
- Gestufter Runner mit eigenen Artefakten und Quell-/WASM-Fingerabdruck;
  Details in docs/TEST-WORKFLOW.de.md.
- Auf dem exportierten Stand lokal in der Auditumgebung: 57 eigenstaendig
  auswertbare vorhandene Node-Pruefungen nach Korrektur bestanden;
  sieben weitere benoetigen native Referenzen oder nicht exportierte Dateien.
- 50 JS-/CJS-Syntaxpruefungen bestanden. Keine Browser-, WASM- oder native
  Gesamtpruefung in der Auditumgebung behauptet.
- Neuer gestufter Lauf auf dem Zielrechner und Gesamtfreigabe noch offen.

### Paketworkflow und Parallelversuch — 27.10.2026

- Vollstaendige Browserregression nach Testaudit erfolgreich:
  315 bestanden, eine vorgesehene Offlinepruefung unter WebKit
  uebersprungen; vollstaendige Browserphase 20,0 Minuten mit einem Worker.
- Vorgeschaltete Navigation und betroffene Testgruppen zuvor bestanden.
- Vereinbarter Ablauf: erarbeiten, umsetzen, direkt im Revisionsbrowser
  pruefen/korrigieren, manuell abnehmen, erst am Paketende vollstaendig
  pruefen und nach Freigabe auf GitHub abschliessen.
- Expliziten quick-Modus und einstellbare Browser-Workerzahl ergaenzt.
- Zwei Worker werden erprobt, noch nicht als Standard freigegeben.
- Keine Aenderung an Spielcode oder Spielstaenden.
- Zentraler nativer Gesamtcheck, abschliessender Plan-/Diffabgleich
  und Veroeffentlichungsfreigabe weiterhin offen.

### Worker-Vergleich — zwei erfolgreich, vier zur Erprobung

- Vollstaendige Browserregression mit zwei Workern bestanden:
  315 erfolgreich, eine vorgesehene Offlinepruefung unter WebKit
  uebersprungen; Browserphase 11,4 Minuten.
- Gleicher Testumfang mit einem Worker zuvor: 20,0 Minuten.
- Vier Worker als zusaetzlicher Vergleich freigeschaltet,
  noch nicht als Standard bestaetigt.
- Keine Aenderung an Spielcode, Testumfang, Timeouts oder Retries.
- Zentraler nativer Gesamtcheck und abschliessende Freigabe weiterhin offen.

### Abschlussvorbereitung nach Workerentscheidung — 28.10.2026

- Vollstaendige Browserregression mit zwei Workern erfolgreich:
  315 bestanden, ein vorgesehener Test uebersprungen, 11,4 Minuten.
- Vier-Worker-Vergleich ohne beobachteten Zeitvorteil:
  affected 107 bestanden, ein Test uebersprungen, 3,7 Minuten.
- Nutzerentscheidung: lokal zwei Worker beibehalten.
- Iterativer Revisionsbrowser-/Paketabschluss-Workflow dokumentiert.
- Keine weiteren Benchmark-Runden vorgesehen.
- Zentraler nativer Gesamtcheck und abschliessende Git-Bestandsaufnahme
  werden vor Commit und Push ausgefuehrt.
- Noch keine erfolgreiche Veroeffentlichung behauptet.

### Geprüfter Abschluss des Reviewpakets — 28.10.2026

- Revisionsbrowser-Abnahme des Navigation-/Zapdos-Reviewstands erfolgt.
- Vollständige Browserregression mit zwei Workern bestanden:
  315 erfolgreich, eine vorgesehene Offlineprüfung unter WebKit
  übersprungen; Browserphase 11,4 Minuten.
- Zentraler nativer Logik-/Oberflächen-Gesamtcheck erfolgreich.
- Abschließendes git diff --check ohne Beanstandung.
- Lokaler Runner standardmäßig zwei Worker, CI ohne ausdrückliche
  Vorgabe weiterhin ein Worker; ein Worker als Rückfalloption.
- Iterativer Revisionsbrowser-/Paketabschluss-Workflow dokumentiert.
- Commit und Push dieses geprüften Reviewpakets nach main vorbereitet.
- Erfolgreicher GitHub-Build und Veröffentlichung sind erst nach dem
  Push gesondert zu kontrollieren; hier noch nicht als grün behauptet.
- Weitere Projektpakete und außerhalb dieses Reviewpakets verbleibende
  Aufgaben richten sich weiterhin nach dem Projektplan.

### CI-Nacharbeit — Trainer-Kampfhelfer, 28.10.2026

- Berichteter GitHub-Browserlauf fuer 27565e8 fehlgeschlagen:
  313 bestanden, zwei Trainerpruefungen fehlgeschlagen, ein Test uebersprungen.
- Bestaetigter Helferfehler: erneuter Zielabruf nach erfolgreichem Polling
  kann null liefern; Klickziel wird jetzt aus dem bestaetigten Snapshot benutzt.
- Nur frische Renderer-Snapshots passend zu Kampf-ID, Runde, Erholungen und
  Ergebniszustand akzeptieren. Canvas-Koordinaten im selben Snapshot erfassen.
- Heilung oeffnet nicht ersatzweise das Angriffsmenue. Menuewechsel und
  echte Zugwirkung werden bestaetigt, keine automatische Klickwiederholung.
- Trainerpruefung verlangt unveraendert genau eine verbrauchte Erholung.
- Fuenf simulierte Helfer-Protokollfaelle vorab bestanden; keine echten
  Browser-/Kampfergebnisse daraus abgeleitet.
- Protokollpruefung in lokale Vorpruefung und zentrales Gate aufgenommen.
- Spiel-/Native-Code, Timeouts und Ganztest-Retries unveraendert.
- Gezielte Browserpruefungen, Folgecommit und erfolgreicher GitHub-Lauf offen.

### CI-Nacharbeit — Liga-Checkpoint im Kampfhelfer

- Erster korrigierter Trainerlauf: sechs Browserprüfungen bestanden.
- Breiter Kampfgruppenlauf deckte eine zu enge neue Wirkungskontrolle auf:
  automatischer Liga-Siegcheckpoint wurde nicht als Zugwirkung erkannt.
- Helfer akzeptiert jetzt den bestätigten Fortschritt um einen Gegner
  beziehungsweise den abgeschlossenen finalen Sieg in derselben Region.
- Laufende/fehlgeschlagene Speicherung, Abbruch ohne Fortschritt,
  fremde Region und unabhängige neue Kampf-ID werden nicht als
  erfolgreicher Checkpoint gewertet.
- Zusätzliche Protokollprüfung mit 14 simulierten Fällen integriert.
- Spielcode, Timeouts, Ganztest-Retries und Klickanzahl unverändert.
- Erneuter echter Kampfgruppenlauf und erfolgreicher GitHub-Lauf offen.

### Geprüfter Folgefix — Kampf-Testhelfer, 28.10.2026

- GitHub-Lauf von 27565e8 mit zwei Trainerfehlern nicht erfolgreich.
- Kampfhelfer verwendet einen gemeinsam bestätigten Ziel-/Koordinatensnapshot
  statt eines erneuten möglicherweise leeren Zielabrufs.
- Menüwechsel und tatsächliche Zugwirkung werden ohne Nachklicken geprüft.
- Automatisch gespeicherter Liga-Siegcheckpoint und finaler Abschluss werden
  als gültige Übergänge berücksichtigt; Abbruch, fremde Region und
  unbestätigte Speicherung zählen nicht als erfolgreicher Checkpoint.
- Trainerprüfungen zunächst 6/6 erfolgreich.
- Danach alle 114 Prüfungen der 13 betroffenen Kampf-Testdateien in
  Chromium und WebKit bestanden; Laufzeit 5,1 Minuten, keine Test-Retries.
- Helfer-Protokollprüfungen in Vorprüfung und zentrales Gate aufgenommen.
- Keine Änderungen an Spielcode, nativen Regeln, Timeouts oder Fangchancen.
- Folgecommit wird gepusht; erfolgreicher GitHub-Gesamtlauf und
  Veröffentlichung bleiben bis zur CI-Bestätigung offen.

### Veröffentlichter Reviewstand — iPhone-Abnahme, 28.10.2026

- Review-Hauptcommit: 27565e838d4d02115908335e4286b78725637179.
- CI-Folgefix: f8907530c4618a7820a09971f1b2011c03229c1e.
- Folgefix auf main gepusht; GitHub-Build vom Nutzer als grün bestätigt.
- Veröffentlichte Änderungen am 28.10.2026 auf dem iPhone vom Nutzer
  abgenommen.
- Navigation-/Zapdos-Reviewpaket einschließlich CI-Nacharbeit und
  manueller iPhone-Abnahme abgeschlossen.
- Vereinbarter iterativer Revisionsbrowser-/Paketabschluss-Workflow
  bleibt für folgende Pakete verbindlich.

## Freigegebener Arktos-Umfang — 28.10.2026

Aktives Teilpaket: P06 — Arktos.
Status: Inhalt vom Nutzer freigegeben; Umsetzung beginnt.
Dieser Abschnitt ersetzt für die nachstehenden Punkte ältere
Planungsangaben, nicht die historischen Abnahmeprotokolle.

### Freischaltung

- Zapdos künftig mit mindestens vier Kanto-Orden statt sechs.
- Arktos mit mindestens sechs Kanto-Orden.
- Lavados später mit mindestens acht Kanto-Orden.
- Keine zusätzliche Voraussetzung einer vorherigen Zapdos-Aufnahme
  als beschlossen behandeln.
- Bestehende gespeicherte Storyfortschritte und Aufnahmen erhalten.
- Zugehörige Anzeigen und Freischalthinweise an die neuen Schwellen
  anpassen; historische Dokumentation nicht pauschal umschreiben.

### Geschichte und Darstellung

- Mischung aus den freigegebenen Vorschlägen 1 und 3.
- Eisformationen versperren den Zugang zur inneren Höhlenkammer.
- Grafischer Schwerpunkt: Schneewirbel, blockierter Luftstrom und
  eingeschränkte Sicht vor dem vereisten Durchgang.
- Nach bestandenem Minispiel wird der Durchgang frei; der Schneewirbel
  legt sich und gibt die Sicht in die innere Höhlenkammer frei.
- Dort erscheint ein wildes Arktos auf Level 50.

### Minispiel

- Innerhalb von zehn Sekunden zehn fallende Eiszapfen treffen.
- Ein Eiszapfen darf nur einmal als Treffer zählen.
- Zehn Treffer innerhalb des Zeitlimits bedeuten Erfolg.
- Weniger als zehn Treffer beim Ablauf bedeuten Nichtbestehen.
- Bei Nichtbestehen erscheint:
  „Der Schneesturm ist zu stark, ich muss es noch einmal versuchen.“
- Anschließend ist ein neuer Versuch möglich.
- Jeder Versuch startet mit zehn Sekunden und Trefferzähler null.
- Keine Strafen oder Energiekosten für Nichtbestehen oder Wiederholen.
- Kein Verlust bereits gespeicherter Fortschritte.
- Arktos-Begegnung erst nach bestandenem Minispiel.
- Keine zusätzlichen Strafregeln für Fehlklicks oder verpasste
  Eiszapfen als beschlossen behandeln.
- Schwierigkeit zunächst mit zehn Treffern in zehn Sekunden umsetzen.
  Falls im manuellen Review zu schwer, nach Nutzerfeedback anpassen.

### Pilot wiederverwenden

- Bestehende Zapdos-Kampf- und Anschlussregeln übernehmen.
- Freiwilliger, garantierter Anschluss nach gewonnenem Prüfduell.
- Vorhandene Begegnungs-, Aufnahme- und Abschlussanimationen übernehmen
  und inhaltlich/grafisch auf Arktos anpassen.
- Bestehende Speicher-, Wiederholungs- und Abschlussabsicherung nutzen;
  kein zweites unabhängiges Kampf- oder Aufnahmesystem aufbauen.
- Neue Inhalte über die vorhandene Spracharchitektur integrieren.
- Änderungen im Wesentlichen auf Inhalt, Grafik, Minispiel und die
  ausdrücklich geänderten Freischaltbedingungen begrenzen.

### Arbeitsablauf und Abnahme

- Zuerst betroffene Implementierung, Projektanweisungen und Tests lesen.
- Kleine Umsetzungsschritte mit passenden kurzen Prüfungen.
- Früh im Revisionsbrowser ansehen und Nutzerkorrekturen einarbeiten.
- Keine vollständige Testsuite nach jeder Darstellungsänderung.
- Abschließende Gesamtprüfung erst nach manueller Paketabnahme,
  auf unverändertem Stand; lokal grundsätzlich zwei Worker.
- Commit, Push, GitHub-Ergebnis und iPhone-Abnahme anschließend
  getrennt durchführen und dokumentieren.
- Keine bereits bestandenen Prüfungen oder erfolgte Implementierung
  allein aus dieser Freigabe ableiten.

### Arktos — gemeinsames Modell und Reviewvorbereitung

- Gemeinsames P06-Modell um ein fest definiertes Arktos-Profil erweitert.
- Zapdos bleibt Standardprofil mit unverändertem Schema und Container.
- Arktos erhält getrenntes Schema, Aufnahmeherkunft und Modellcontainer.
- Vorhandene Modellprüfungen für Arktos übernommen; zusätzliche
  Profiltrennung und Ablehnung unbekannter Profile geprüft werden sollen.
- Neue Modellprüfung im zentralen Prüflauf registriert.
- Noch keine native Arktos-Speicherung, Kampfanbindung oder sichtbare
  Arktos-Oberfläche durch diesen Modellschritt behaupten.
- Tatsächliche lokale Prüfergebnisse nach Ausführung separat ergänzen.
- Vor dem ersten manuellen Review zuerst Testspielstände vorbereiten,
  dann aktuellen Browser-/WASM-Stand bauen und Revisionsbrowser starten.
- Befehle für diese Vorbereitung vor den manuellen Prüfschritten ausgeben.
- Benötigte Ordensstände: drei/vier für Zapdos und fünf/sechs für Arktos.
- Zusätzliche Fortschrittsstände für Minispiel, Begegnung und Abschluss
  vorbereiten; echten Spielstand nicht durch Testdaten überschreiben.

### Arktos — native Vorbereitung auf gemeinsamem Speicherweg

- Gemeinsame native Funktionen fuer Vorbereitung und Hinweise erweitert.
- Bestehende Zapdos-Schluessel und Schnittstellen bleiben erhalten.
- Arktos-Fortschritt: arcver, arcstep, arctick.
- Getrennter Arktos-Hinweis: arcnver, arcnread.
- Freischaltung: Zapdos vier, Arktos sechs Kanto-Orden.
- Neue Arktos- und Trennungspruefungen im vorhandenen gezielten
  nativen Speichertest eingebunden.
- Implementierung zur Pruefung; Testerfolg separat dokumentieren.
- Noch keine Arktos-Kampfanbindung, Gesamtspeicherparser-Erweiterung
  oder sichtbare Oberflaeche durch diesen Schritt behaupten.
- Arbeitsweg bleibt: kopierbare Terminalbloecke ohne separate Patchdatei.

### Arktos — Gesamtspielstandprüfung für beide Storyprofile

- Native Vorbereitung lokal erfolgreich geprüft:
  je 256 Kanto-Ordenskombinationen für Zapdos und Arktos.
- Getrennte Fortschritte/Hinweise, Rollback, Reload und unveränderte
  Energie durch die übermittelte Prüfausgabe bestätigt.
- Gesamtspielstandprüfung auf beide Storyprofile erweitert.
- Arktos-Hinweise auf Vollständigkeit, Typ und Version prüfen.
- Aufnahmeherkunft, individuelle Sammlung und Storyticket verknüpfen.
- Doppelte Storytickets zwischen beiden Profilen auch nach Freilassung
  der aufgenommenen Individuen ablehnen.
- Arktos-Modell in Browser-Ladereihenfolge und Offline-Dateiliste ergänzt.
- Neue Parserprüfung im zentralen Ablauf registriert.
- Parser-Schritt zur Prüfung; Ergebnisse nach Ausführung ergänzen.
- Noch keine Arktos-Kampfanbindung oder Browser-/iPhone-Abnahme behaupten.

### Arktos — gemeinsamer nativer Prüfduellkanal

- Modell-, Profiltrennungs- und Gesamtspielstandprüfungen lokal bestanden.
- Zapdos und Arktos je 88 Modell-Assertions; Zapdos 30 Speicherprüfungen,
  erweiterte Arktos-Spielstandprüfung insgesamt 44 Prüfungen bestätigt.
- Nativen Pilot-Kampfkanal auf die beiden Storyprofile erweitert.
- Arktos auf Level 50; gleiche Kampf- und Ergebnisregeln.
- Bestehende Zapdos-Schnittstellen bleiben als profilgebundene Aufrufe.
- Ergebnisoperationen an das tatsächlich laufende Storyprofil binden.
- Zusätzliche native Arktos-Duellprüfung im zentralen Ablauf registriert.
- Duellimplementierung zur Prüfung; Ergebnisse separat dokumentieren.
- Noch keine vollständige JS-Kampfanbindung, Höhlendarstellung,
  Eiszapfen-Aufgabe oder Browser-/iPhone-Abnahme behaupten.

### Arktos — gemeinsamer JS-Adapter und Aufnahme-Tagebuch

- Native Zapdos- und Arktos-Duellprüfungen laut übermittelter Ausgabe bestanden.
- Gemeinsamen JS-Adapter um explizites Arktos-Profil erweitert.
- Arktos verwendet gemeinsame native Funktionen und getrennte Aktionsnamen.
- Vorhandene Zapdos-Aufrufe bleiben unverändert nutzbar.
- Arktos-Aufnahmeabschluss an die native Story-Tagebuchübergabe angebunden.
- Controllerprüfung mit tatsächlichen Modellen, Speichercontroller und
  Gesamtspielstandparser für Arktos ergänzt; nativer Transport simuliert.
- Native Arktos-Duellprüfung um Aufnahme-Tagebuch und Wiederholungssperre
  erweitert; Ergebnisse dieses Schritts separat dokumentieren.
- Noch keine Initialisierung des Arktos-Dienstes in main.js, sichtbare
  Höhlenseite, Minispiel- oder Browser-/iPhone-Abnahme behaupten.

### Arktos — App-Initialisierung und Dienstbindung

- Namenskollision im Adapter korrigiert: actionName statt action.
- Zapdos- und Arktos-Controller jeweils mit 42 Assertions plus
  Ablehnungsprüfungen laut übermittelter Ausgabe bestanden.
- Native Arktos-Duellprüfung mit Aufnahmeübergabe erneut bestanden.
- Arktos-Dienst an gemeinsame Adapterkette und Speichercontroller gebunden.
- Getrennte Arktos-Aktionen registriert; articunoResult nur im Kampfkontext.
- Isolierte Prüfung des tatsächlichen Initialisierungsabschnitts ergänzt.
- Initialisierung zur Prüfung; Ergebnisse separat dokumentieren.
- Noch keine sichtbare Höhlenseite, Minispiel- oder Browserabnahme behaupten.

### Arktos — Eiszapfen-Minispiel zur Einbindung

- App-Verdrahtungsprüfung laut Nutzer-Ausgabe bestanden.
- Eigenständige vorübergehende Minispielkomponente mit zehn Treffern
  innerhalb von zehn Sekunden ergänzt.
- Keine Speicher-, Energie- oder Kampfoperationen im Rundenmodell.
- Unterschiedliche Eiszapfen; Doppelwertung, abgelaufene Ziele und
  Ziele früherer Versuche zählen nicht.
- Nichtbestehen zeigt die vereinbarte Meldung und erlaubt neuen Versuch.
- Bestandene Aufgabe bleibt bei einer Schreibwiederholung erhalten.
- Anfangswerte für manuelles Balancing: neue Ziele alle 550 ms,
  Fallzeit 1800 ms und Tippflächen von 48 mal 64 CSS-Pixeln.
- Neue Texte über vorhandene Spracharchitektur in de/en/es/fr.
- Komponente in Browser- und Offline-Dateiliste aufgenommen.
- Rundenlogikprüfung registriert; tatsächliche lokale Ausgabe nachführen.
- Noch keine sichtbare Storyseite oder Touch-/Schwierigkeitsabnahme behaupten.

### Arktos — sichtbarer Ablauf über gemeinsame Storyoberfläche

- Minispiel-Rundenlogik und genaue Fehlermeldung lokal bestätigt.
- Gemeinsame Storyoberfläche für Zapdos und Arktos konfigurierbar gemacht.
- Arktos-Kachel, Sechs-Orden-Sperre und eigener Freischalthinweis ergänzt.
- Höhle mit versperrtem Eisgang und Schneewirbel als eigene SVG/CSS-Szene.
- Eiszapfen-Aufgabe an den gespeicherten Vorbereitungsschritt angeschlossen.
- Danach innere Kammer, Arktos-Begegnung und vorhandener Prüfduellweg.
- Bestehenden Porträtdecoder und vorhandene Aufnahmeanimation wiederverwendet.
- Texte in de/en/es/fr über vorhandene Spracharchitektur.
- Gemeinsame UI-Prüfung registriert; lokale Ausgabe separat dokumentieren.
- Noch keine Browser-/iPhone-Abnahme oder endgültiges Balancing behaupten.
- Vor manuellem Review Testspielstände vorbereiten, Browserstand bauen
  und Revisionsbrowser über vorher ausgegebene Befehle starten.

### Interaktiven Revisionsbrowser wieder bereitstellen

- Nutzer verlangt den bewährten Ein-Terminal-Reviewablauf mit Testbadge,
  Screenshot/Notiz-Taste und direktem Testspielstandwechsel.
- Wiederverwendbaren Runner unter tools/review/manual-review.cjs ergänzt.
- Start und Bedienung in docs/TEST-WORKFLOW.de.md festgehalten.
- Vorbereitete acht Arktos-Testspielstände weiterverwenden.
- Kein erneuter Build allein durch den Runnerstart.
- Erste tatsächliche Ausführung und manuelle Abnahme separat bestätigen.

### Arktos — Reviewkorrekturen aus fünf Textnotizen

- Grundlage: fünf übermittelte Textnotizen; Bildinhalte nicht gesehen.
- Kein Scrollen in den Arktos-Ansichten.
- Einstiegssatz: „Der Schneewirbel versperrt die Sicht in die Höhle.“
- Button: „Näher herangehen“; nächste Ansicht mit näherer Perspektive.
- Bild antippen öffnet und startet die eigene Minispielansicht.
- Zufällige horizontale Eiszapfenpositionen statt fester Reihenfolge.
- Zehn Treffer in zehn Sekunden und kostenlose Wiederholung unverändert.
- Arktos bei Begegnung und Finale zunächst 20 Prozent kleiner.
- Zur erneuten manuellen Prüfung; keine Abnahme behaupten.

## Verbindliche Reviewentscheidung — 28.10.2026

Der Nutzer bestätigt zum aktuellen sichtbaren Stand:
„genau so soll es aussehen! sehr gut“

Der interaktive Revisionsbrowser und seine Bedienung werden als
verbindlicher Arbeitsweg für weitere Pakete übernommen.

- Einstiegspunkt für Folgesitzungen: AGENTS.md.
- Detaillierter Ablauf und Startbefehl: docs/TEST-WORKFLOW.de.md.
- Werkzeug: tools/review/manual-review.cjs.
- Ein Terminal, sichtbarer Browser mit Testbadge, direkte
  Testspielstandwahl, Screenshots und zugehörige Textnotizen.
- Bestehenden Arbeitsweg wiederverwenden statt neue Startverfahren
  oder zusätzliche manuelle Importschritte einzuführen.
- Die positive Bestätigung betrifft den aktuellen sichtbaren Reviewstand
  und den Review-Arbeitsweg. Keine vollständige P06-, Browsergesamt-,
  Veröffentlichungs- oder iPhone-Abnahme daraus ableiten.

## Arktos — manuelle Browserabnahme, 28.10.2026

Nutzerbestätigung:
„minispiel bestanden -> begegnung erfolgreich -> Kampf gewonnen,
arktos schließt sich an, tagebuch eintrag vorhanden, nach einem
neu laden ist arktos noch da...“

- Sichtbare Darstellung zuvor ausdrücklich positiv bestätigt.
- Minispiel bestanden und Begegnung erfolgreich.
- Prüfduell gewonnen; Arktos hat sich angeschlossen.
- Zugehöriger Tagebucheintrag vorhanden.
- Arktos nach erneutem Laden weiterhin vorhanden.
- Manuelle Browserabnahme des Arktos-Pakets damit bestätigt.
- Keine darüber hinausgehenden manuellen Einzelprüfungen behaupten.
- Vollständige Abschlussprüfungen stehen noch aus.
- Noch keine GitHub-Veröffentlichung oder iPhone-Abnahme behaupten.

### Abschlussprüfung — Zählererwartungen für zwei Geschichten

- Betroffene Browsergruppe fehlgeschlagen:
  94 bestanden, fünf fehlgeschlagen, einer unterbrochen,
  einer übersprungen und sieben nicht ausgeführt.
- Ausgewiesene Zählerfehler betreffen alte Ein-Geschichten-Erwartungen:
  sechs Kanto-Orden ergeben zwei offene Geschichten;
  nach Zapdos-Abschluss bleibt Arktos als eine offene Geschichte.
- Konkrete Sollwerte korrigiert, ohne Spielcode zu ändern.
- Zusätzlich feste Browserfälle für drei, vier, fünf und sechs
  Kanto-Orden mit acht Johto-Orden ergänzt.
- Zapdos-Abschlusstest prüft ausdrücklich die weiterhin offene
  Arktos-Geschichte und ihren unveränderten Fortschritt.
- Keine Assertions entfernt, keine Timeouts erhöht, keine Tests übersprungen.
- Gezielt neu prüfen; vollständige Abschlussprüfungen weiterhin offen.

## Arktos — bestandene Abschlussprüfungen, 28.10.2026

Manuelle Browserabnahme:
- Darstellung ausdrücklich positiv bestätigt.
- Minispiel bestanden, Begegnung erfolgreich, Prüfduell gewonnen.
- Arktos angeschlossen, Tagebucheintrag vorhanden.
- Arktos nach erneutem Laden weiterhin vorhanden.

Automatische Abschlussprüfungen:
- affected: 115 bestanden, 1 übersprungen, 0 unerwartete Fehler,
  0 instabile Tests; zwei Browser-Worker.
- full: 323 bestanden, 1 übersprungen, 0 unerwartete Fehler,
  0 instabile Tests; zwei Browser-Worker.
- Zentraler nativer Check bestanden.
- Abschließendes git diff --check ohne Befund.
- Übersprungene Prüfungen werden nicht als bestanden gezählt.
- Keine parallele native Ausführung aus der Workerangabe ableiten.

Zusammengehörige Berichte:
- affected: itamapoke-review-vqHaSq
- full: itamapoke-review-m4owC1
- native: itamapoke-review-pzRuIq

Identischer Quellfingerabdruck:
6d5fd2e367df12ca3d1dd39c1eb68e9b0214f09c6f23c90966daf6d1dca6e07b

Identischer WASM-SHA-256:
1e4651e1a92f3bfd7622e291d83f014a0170c4154bf7c42ea161bc9cea95ecee

Veröffentlichungsumfang:
- Arktos-Eishöhlengeschichte mit vorhandenem Pilot-Kampf-/Aufnahmeweg.
- Zapdos-Freischaltung mit vier, Arktos mit sechs Kanto-Orden.
- Eiszapfen-Minispiel und bestätigte Darstellungskorrekturen.
- Gemeinsame Storykomponenten und profilgetrennte Speicherabsicherung.
- Erweiterte Tests sowie wiederverwendbarer interaktiver Reviewrunner.
- Keine privaten Medien, Reviewaufnahmen oder Testspielstände enthalten.

Status:
- Lokal abgenommen und Abschlussprüfungen bestanden.
- GitHub-Build/Deployment und iPhone-Abnahme separat bestätigen.
- P06 insgesamt bleibt offen; keine Freigabe von P07 oder UI01 ableiten.

## iPhone-Nacharbeit — Eingabeschutz und Aufnahmesequenz

Nutzerbestätigung vom 28.10.2026:
- GitHub-Build von 24a3105 grün.
- Grundlegender iPhone-Ablauf funktioniert.
- Zwei offene Befunde verhindern den endgültigen Abschluss:
  schnelles Weiter-Tippen überspringt die Begegnung;
  Aufnahmesequenz fehlt nach manueller Team-/Boxentscheidung.

Gemeinsame Nacharbeit für die Storyprofile:
- Begegnung mit 650 ms Anfangsschutz und 350 ms Berührungsruhe.
- Gedrückte und aus vorheriger Ansicht stammende Zeiger abfangen.
- Transparente Eingabefläche während der Sperre; kein Layoutumbau.
- Nach erfolgreich gespeicherter manueller Aufnahme zur passenden
  Story-Aufnahmesequenz zurückkehren.
- Kein Finale bei Speicherfehler, wartender Aufnahme oder „Später“.
- Quellen-/Ticketprüfung und Schutz vor doppelter automatischer Rückleitung.
- Neue Storykonfigurationen über dieselbe gemeinsame Registrierung anbinden.
- Noch keine bestandene Nacharbeits-/iPhone-Abnahme behaupten.
- Vor Lavados diese beiden Punkte prüfen, veröffentlichen und abnehmen.

## Gemeinsame Legendären-Korrekturen — Review bestätigt

Nutzerbestätigung vom 28.10.2026:
„alles funktioniert nun wie es soll auch die Tippsperre funktioniert sehr gut“

- Lokale Review-Nacharbeit zu Tippsperre und Aufnahmesequenz positiv bestätigt.
- Die Implementierung gilt gemeinsam für Zapdos und Arktos.
- Automatische Prüfungen für beide Profile lagen bereits vor.
- Zapdos-Browserprüfungen um tatsächliches Finale nach Teamtausch und
  verspäteter Boxaufnahme sowie um den Begegnungsschutz erweitern.
- Dieselben Funktionen künftig für Lavados, Mewtu, Mew und alle weiteren
  Legendären-Geschichten verwenden; keine abweichenden Kopien.
- Keine separate manuelle Zapdos-iPhone-Abnahme aus der Rückmeldung ableiten.
- Abschlussprüfungen, Veröffentlichung dieser Nacharbeit und erneute
  iPhone-Prüfung des veröffentlichten Fixstands stehen noch aus.

## Gemeinsame Legendären-Nacharbeit — Abschlussprüfungen bestanden

Nutzer hat die Nacharbeit im Revisionsbrowser positiv bestätigt.
Gemeinsame Implementierung für Zapdos und Arktos; keine getrennten Kopien.

Abschlussprüfungen:
- affected: 117 bestanden,
  1 übersprungen, 0 unerwartete Fehler,
  0 instabile Tests; 2 Browser-Worker.
- full: 325 bestanden,
  1 übersprungen, 0 unerwartete Fehler,
  0 instabile Tests; 2 Browser-Worker.
- Zentraler nativer Gesamtcheck bestanden.
- Keine parallele native Ausführung aus der Workerangabe ableiten.
- Übersprungene Prüfungen nicht als bestanden zählen.

Zusammengehörige Berichte:
- affected: itamapoke-review-iXfY27
- full: itamapoke-review-S76Y1G
- native: itamapoke-review-1NiBjM

Quellfingerabdruck:
e6664759ab096065e1e71aeacbdee0bd4b5eee9252fc4d03d3742bef0826adf7

WASM SHA-256:
1e4651e1a92f3bfd7622e291d83f014a0170c4154bf7c42ea161bc9cea95ecee

Umfang:
- Begegnungsschutz mit Anfangssperre, Berührungsruhe und Loslassprüfung.
- Finale nach dauerhaft gespeicherter manueller, Box- oder späterer Aufnahme.
- Keine Sequenz bei Speicherfehler oder „Später“.
- Quellen-/Ticketprüfung und Schutz vor doppelter automatischer Rückleitung.
- Gemeinsame Vorgaben für Lavados, Mewtu, Mew und spätere Geschichten.
- Zusätzliche Node- und echte Zapdos-Browserregressionen.

Veröffentlichung:
- Zur Veröffentlichung bereit.
- GitHub-Ergebnis und iPhone-Abnahme dieses Fixstands separat dokumentieren.

## CI-Nacharbeit nach 3478b05 — Johto-Rücknavigation

- Commit 3478b056ceb7b061def5f8d3bc78dc582c7a9646 erfolgreich gepusht.
- GitHub-Browserprüfung nicht bestanden:
  324 bestanden, einer fehlgeschlagen, einer übersprungen.
- Fehler im Chromium-Johto-Liga-/Ehrenei-Test:
  Rückkehr zur Karte erfolgt, abschließende Rückkehr zu idle bleibt aus.
- Test verwendet dort bislang eine separate, nicht vollständig
  synchronisierte Tippfolge.
- Bestehenden synchronisierten exitToIdle-Helfer wiederverwenden.
- Schließen von Ehrenei und Ruhmeshalle jeweils ausdrücklich abwarten.
- Bei erneutem Fehler Zustandsdaten anhängen und Originalfehler weiterwerfen.
- Spielcode, Sollzustand idle, Timeouts und Retryregeln unverändert.
- Gezielte Wiederholung zur Prüfung; keine grüne CI behaupten.

### Johto-CI-Testfix — gezielte Wiederholungsprüfung bestanden

- Gezielter Wiederholungslauf bestanden: sechs Ausführungen.
- Je drei Ausführungen in Chromium und WebKit, ein Worker.
- Keine Fehler, instabilen oder übersprungenen Prüfungen.
- Wiederholungen ausdrücklich ausgewählt; automatische Retries bleiben null.
- Bericht: itamapoke-review-FEkcMu.
- Vorhandenen synchronisierten Rückweg wiederverwendet.
- Erwartung idle und alle nachfolgenden Ehrenei-/Sammlungsprüfungen erhalten.
- Zusätzliche Zustandsdiagnose bei erneutem Fehler ergänzt.
- Keine Änderung an Spielcode, Speicherregeln oder Timeouts.
- Gesamte GitHub-CI nach diesem Testfix erneut bestätigen.

Quellfingerabdruck des Wiederholungslaufs:
49914491bcb1f1d900a1a8e36c5bc7adcc2975152bf0f3251691b5dfd6056a72

WASM SHA-256:
1e4651e1a92f3bfd7622e291d83f014a0170c4154bf7c42ea161bc9cea95ecee

## Arktos und gemeinsame Nacharbeit — Veröffentlichung und iPhone-Abnahme, 28.10.2026

Veröffentlichte Stände:
- 24a31057f321a97362d5007798efc6a8110ef9dc:
  Arktos-Eishöhlengeschichte und wiederverwendbarer Reviewbrowser.
- 3478b056ceb7b061def5f8d3bc78dc582c7a9646:
  gemeinsame Begegnungs-Tippsperre und Finale nach manueller Aufnahme.
- c58a67cc00e7574a5dad9af1882f2c41ddcdf284:
  synchronisierter Johto-Rückweg im Browsertest.

Nutzerbestätigung:
„build grün -> iphone abnahme erfolgt“

- GitHub-Build des letzten veröffentlichten Standes grün bestätigt.
- iPhone-Abnahme bestätigt.
- Arktos und gemeinsame Nacharbeit damit abgeschlossen und abgenommen.
- Keine weiteren manuellen Einzelprüfungen über die vorliegende
  Nutzerbestätigung hinaus behaupten.
- Keine erneuten lokalen Gesamtprüfungen allein für diese
  Dokumentationsänderung erforderlich.
- P06 insgesamt bleibt offen; als Nächstes Lavados.
- Noch keine konkrete Lavados-Geschichte, Minispielregel oder
  Begegnungslevel als freigegeben behandeln.
- Gemeinsame Übergangs-/Aufnahmeregeln und den dokumentierten
  interaktiven Revisionsbrowser verbindlich weiterverwenden.

## Konzeptfreigabe Restpaket P06 — 28.10.2026

Vom Nutzer ausdrücklich freigegeben:
- Alle drei Begegnungen auf Level 50.
- Kostenlose Minispielwiederholungen ohne Energieverlust bei allen drei.
- Lavados: acht unterschiedliche Kanto-Orden; Siegesstraße;
  Geschichte „Der versperrte Seitenpfad“; Felsenschieber-Minispiel.
  Felsen antippen, angrenzendes freies Feld wählen; Bodenplatten belegen.
  Blockierte Bewegungen nicht ausführen; Zurücksetzen; zunächst ohne Timer.
  Feldaufteilung und endgültige Felsenanzahl noch auszuarbeiten.
- Mewtu: erster vollständiger Ligasieg; Azuria-Höhle;
  Geschichte „Die unsichtbare Barriere“; schrumpfender Psi-Ring.
  Drei erfolgreiche Impulse im Zielbereich lösen die Barriere.
  Fehleingaben zählen nicht; zunächst kein zusätzlicher Gesamttimer.
- Mew: erst nach erfolgreichem Abschluss aller drei Liga-Durchläufe;
  keine zusätzliche Aufnahme von Mewtu als Voraussetzung beschlossen.
  Versteckte Lichtung nördlich der Nuggetbrücke;
  Geschichte „Das Versteck hinter der Nuggetbrücke“; Versteckspiel.
  Drei feste große Verstecke, drei richtige Entdeckungen, kein Gesamttimer.
  Falsche Wahl wiederholt dieselbe Runde mit neuem Hinweis.
- Hinweiszeiten, Ringgeschwindigkeit und Trefferbereich im Review abstimmen.
- Gemeinsame Tippsperre, Aufnahmewege und Finale-Registrierung verwenden.
- Finale erst nach dauerhaft bestätigter Aufnahme; auch nach Teamtausch,
  Boxentscheidung oder später freiem Platz; keine doppelten Abschlüsse.
- Nicht scrollende Storyansichten; Minispielstart über das Bild.
- Lokal in der Reihenfolge Lavados, Mewtu, Mew umsetzen und einzeln prüfen.
- Betroffene Tests/Helfer mitpflegen; bestehenden Revisionsbrowser nutzen.
- Vollständige Abschlussprüfungen erst nach manueller Paketabnahme.
- Kein zwischenzeitlicher Commit/Push; gemeinsame Veröffentlichung erst
  nach Fertigstellung, erfolgreichen Abschlussprüfungen und Nutzerfreigabe.

Erster lokaler Teilschritt:
- Lavados-Profil im gemeinsamen JS-Storymodell ergänzen.
- Dünnes Lavados-Modul und Modelltests ergänzen.
- Native Freischaltung, Persistenz, Kampf, Menü, Grafik und Minispiel
  sind damit noch nicht angebunden.
- Prüfergebnisse erst nach tatsächlicher Ausführung nachtragen.

### Lavados-Zwischenstand — Modell und JS-Anbindung

- Nutzer meldet erfolgreiche Modellprüfungen für Zapdos, Arktos und
  Lavados: jeweils 88 Assertions sowie vorhandene Profiltrennungsprüfungen.
- Lavados im gemeinsamen Controller, strikten Spielstandprüfer und
  gemeinsamen Aufnahmeweg ergänzt; Prüfungen dieses Schritts noch offen.
- Neue Modell-, Speicher- und Controllerprüfungen zentral registriert.
- Speicherprüfung um einen gemeinsamen Drei-Vogel-Spielstand erweitert.
- Native Lavados-Profile, Duellfreigabe, App-Initialisierung, Storytexte,
  Grafiken, Felsenschieber und Reviewspielstände weiterhin ausstehend.
- Keine Browser-/iPhone-Abnahme, kein neuer Build und keine Veröffentlichung.

### Lavados-Zwischenstand — native Anbindung vorbereitet

- Nutzer meldet erfolgreiche JS-Aufnahme-, Controller- und Speicherprüfungen.
- Lavados-Speicherprüfung: 50 akkumulierte Prüfungen einschließlich
  Drei-Vogel-Spielstand; Controller: 42 Assertions plus Ablehnungsprüfungen.
- Natives Lavados-Profil mit acht Kanto-Orden und eigenen mlt-Schlüsseln
  ergänzt; vorhandenen gemeinsamen Storyduell-Einstieg für ID 146 geöffnet.
- Native Freischaltprüfung für alle 256 Kanto-Ordensmasken ergänzt;
  Johto-Abgrenzung, Rollback, Reload und Profilisolation mitprüfen.
- Native Lavados-Duellprüfung und zentralen Testeintrag vorbereitet.
- Native Ergebnisse dieses Schritts noch offen; kein neuer WASM-Build.
- App-Anbindung, Storytexte, Grafik, Felsenschieber und Review weiterhin offen.
- Keine Veröffentlichung und keine Browser-/iPhone-Abnahme behauptet.

### Lavados-Zwischenstand — Felsenschieber als Reviewentwurf

- Nutzer meldet erfolgreiche native Zugriffs-/Speicherprüfungen und
  Zapdos-, Arktos- sowie Lavados-Duellprüfungen.
- Felsenschieber als erster Reviewentwurf: zwei Felsen auf einem 5x5-Feld,
  zwei Bodenplatten, Auswahl und orthogonaler Einzelfeldzug ohne Spielfigur.
- Eigene CSS-Formen; keine neuen Bilddateien oder Mediendownloads.
- Kostenloses Zurücksetzen, kein Timer, keine eigene Energie-/Speicherlogik.
- Gemeinsamer Minispielvertrag: create, attach, start, solved, dispose.
- Gelöste Aufgabe bleibt bei Speicherfehler erhalten; nach bestätigtem
  Erfolg keine zweite Erfolgsmeldung.
- Logik-/DOM-Double-Prüfung zentral registriert; lokales Ergebnis noch offen.
- Minispiel noch nicht in App-/Storyoberfläche eingebunden.
- App-Anbindung, Storygrafik, aktueller WASM-Build und Revisionsbrowser folgen.
- Verbindlicher Arbeitsweg: direkt kopierbare Terminalbefehle; keine
  herunterzuladenden Einbauskripte oder Dateiauswahl-Installationsschritte.
- Bestehenden interaktiven Revisionsbrowser unverändert weiterverwenden.
- Kein Commit/Push und keine Browser-/iPhone-Abnahme dieses Entwurfs.

### Lavados-Zwischenstand — App- und Storyanbindung

- Nutzer bestätigt erfolgreiche Lavados-Minispielprüfungen und weiterhin
  erfolgreiche Arktos-Minispielprüfungen nach Korrektur des Test-Syntaxfehlers.
- Lavados-Controller in die vorhandene Bridge-/Speicherkette eingebunden.
- Storyroute, Katalog, Hinweis, Eingabesicherungen und Kampfsteuerung ergänzt.
- Storytexte für de/en/es/fr und eigene Siegesstraßen-SVG-Szenerie ergänzt.
- Minispiel startet über das Bild in eigener Storyansicht.
- Gemeinsame Tippsperre, Portrait- und Aufnahmesequenz weiterverwendet.
- Gemeinsame UI-/Finale-Prüfungen um Lavados erweitert;
  separater App-Initialisierungstest zentral registriert.
- Neue Dateien in Ladereihenfolge und Offline-Dateiliste aufgenommen.
- Kompaktes Minispiel-Layout für den bestehenden quadratischen Spielrahmen
  vorbereitet; tatsächliche Darstellung noch im Revisionsbrowser prüfen.
- JS-Prüfergebnisse dieses Schritts, aktueller WASM-Build, Reviewspielstände
  und manuelle Sicht-/Funktionsprüfung noch offen.
- Kein Commit/Push und keine Browser-/iPhone-Abnahme behauptet.

### Lavados — WASM-Build und Reviewvorbereitung

- Nutzer meldet erfolgreichen Emscripten-6.0.13-Build.
- Bestehende SDK-Umgebung: ~/Developer/emsdk/emsdk_env.sh.
- Bekannte TPNamedPrompt-C-Linkage-Warnung weiterhin offen.
- Bestätigter WASM-SHA-256: ca6fa9a961210591142e1777968c4157e157388c05f30e83e87a162cd576ab41.
- Bestehenden Reviewrunner um optionale Paketkonfiguration erweitert.
- Ohne review.json bleibt die bisherige Arktos-Auswahl erhalten.
- Profil, Playwright-Chromium, Port, Bedienung und Aufnahmefunktionen erhalten.
- Acht synthetische Lavados-Fälle erstellt und mit dem strikten Parser geprüft.
- Originalvorlagen unverändert; keine neuen Medien veröffentlicht.
- Reviewspielstände: /Users/M1dn8/Downloads/iTamaPoke-Lavados-Review-SiUqSs
- Manuelle Browserprüfung und iPhone-Abnahme noch offen.
- Vollständige Abschlussprüfungen und Commit/Push weiterhin ausgesetzt.

### Lavados — erste manuelle Reviewkorrekturen

- Nutzer bestätigt sichtbare Lavados-Grafik nach lokalem Paketimport.
- Fünf TXT-Notizen ausgewertet; keine eigene Screenshot-Sicht behauptet.
- Lavados im gemeinsamen Portrait und dadurch auch im Finale um 20 Prozent
  verkleinert; Zapdos-/Arktos-Skalierung unverändert.
- Einstieg und nähere Seitenpfadansicht grafisch gemeinsam überarbeitet.
- Leuchtende Feder räumlich zwischen den Vordergrundfelsen verankert;
  Schimmeranimation mit statischer Reduced-Motion-Alternative ergänzt.
- Sichtbare seitliche Minispielerklärung entfernt; zugängliche Beschreibung
  für assistive Technik erhalten.
- Rätsel zentriert, Zurücksetzen darunter; Größe an verfügbaren Platz angepasst.
- Schwierigerer Entwurf mit drei Felsen und gemeinsamem Engpass:
  mindestens 18 Verschiebungen statt acht; weiterhin ohne Timer/Energieverlust.
- Betroffene Logik-/DOM-Double-/Darstellungsverträge aktualisiert.
- Lokale Ergebnisse und erneute manuelle Sichtprüfung dieses Schritts offen.
- Nur JS-/Darstellungsänderungen; keine nativen Änderungen dieses Schritts.
- Kein Commit/Push und keine vollständige Paketabnahme behauptet.

### Mewtu — erster gemeinsamer Modell-/Controllerbaustein

- Lavados-Browserabnahme durch Nutzerbestätigung „jetzt passt alles“ erteilt.
- Dies ist keine iPhone-Abnahme oder vollständige P06-Abschlussfreigabe.
- Mewtu-Konzept bleibt: Azuria-Höhle, unsichtbare Barriere, Level 50,
  Freischaltung nach erstem vollständigem Kanto-Ligasieg.
- Psi-Ring: drei erfolgreiche Impulse; zunächst kein Gesamttimer.
- Kostenlose Wiederholungen ohne Energieverlust.
- Eigenes mewtwo-Profil im gemeinsamen Modell/Controller/Parser ergänzt.
- Gemeinsamen Aufnahmeweg erweitert, keine getrennte Speicherverwaltung.
- Mewtu-Modell-, Speicher- und Controllerprüfungen zentral registriert.
- Gemischten Vier-Profil-Spielstand samt Tickettrennung mitprüfen.
- Prüfungen dieses Schritts noch offen.
- Native Freischaltung/Anbindung, Minispiel, Texte, Grafik, App-Anbindung,
  WASM-Build und Revisionsbrowser für Mewtu weiterhin ausstehend.
- Lavados-Grafik, Rätsel und Browserprofil dieses Schritts unverändert.
- Kein Commit/Push; Abschlussprüfungen erst nach dem gemeinsamen Restpaket.

### Mewtu — native Freischaltung und Prüfduell

- Nutzer meldet bestandene Mewtu-Modell-, Controller- und Speicherprüfungen:
  88 Modell-Assertions, 42 Controller-Assertions plus Ablehnungen sowie
  56 akkumulierte Speicherprüfungen einschließlich Vier-Profil-Verknüpfung.
- Natives Mewtu-Profil und gemeinsamer Level-50-Duelleinstieg ergänzt.
- Erstfreischaltung über versionierte, typgeprüfte historische
  Kanto-Ligaabschlussmetadaten; acht Orden oder Johto-Abschluss reichen nicht.
- Aktuelle Ordensmaske ersetzt den historischen Ligasieg nicht.
- Bereits etablierter Storyfortschritt bleibt wie bei den anderen Profilen
  erhalten; es wird kein erneuter Ligasieg für Wiederholungen verlangt.
- Neue native Zugriffsprüfung in bestehenden Speichertest eingebunden;
  Mewtu-Duellprüfung zentral registriert.
- Native Prüfergebnisse dieses Schritts noch offen.
- Psi-Ring, Texte, Grafik, App-Anbindung, aktueller WASM-Build und Mewtu-Review
  weiterhin ausstehend.
- Lavados-Browserabnahme bleibt bestehen; kein Commit/Push.

### Mewtu — Psi-Ring-Minispiel vorbereitet

- Nutzer meldet erfolgreiche native Mewtu-Zugriffs-/Duellprüfungen und
  weiterhin erfolgreiche Zapdos-/Arktos-/Lavados-Regressionen.
- Psi-Barriere als eigener flüchtiger Minispielbaustein ergänzt.
- Drei erfolgreiche Impulse, kein Gesamttimer und keine Energiebuchung.
- Erster Abstimmungswert: 2,4 Sekunden je Ringdurchlauf; großzügiger Zielbereich.
- Höchstens eine gewertete Eingabe pro Durchlauf; gehaltene Zeiger/Tasten
  und Tastaturwiederholung erzeugen keine zusätzlichen Impulse.
- Fehleingaben zählen nicht; erfolgreiche Impulse bleiben innerhalb
  des laufenden Versuchs erhalten.
- Nach Speicherfehler bleibt die gelöste Aufgabe für Speichern-Retry erhalten.
- Sichtbarer Hintergrundwechsel beendet nur einen ungelösten flüchtigen
  Versuch; erneuter Start bleibt kostenlos.
- Gemeinsamer Minispielvertrag create/attach/start/solved/dispose erhalten.
- Nicht notwendige Umgebungsanimation berücksichtigt Bewegungsreduktion;
  die für die Timing-Aufgabe wesentliche Ringbewegung bleibt sichtbar.
- Isolierte Node-Logik-/DOM-Double-Prüfung im Assistenzwerkzeug bestanden.
- Lokale Ergebnisse dieses Schritts und echte Touch-/Layoutprüfung noch offen.
- Storytexte, Azuria-Höhlen-Grafik, App-Anbindung, WASM-Build und Review folgen.
- Lavados-Darstellung und Rätsel unverändert; kein Commit/Push.

### Mewtu — App-Anbindung und Höhlenansichten

- Nutzer meldet bestandene Psi-Ring-Logik-/DOM-Double-Prüfungen;
  Lavados-Minispiel weiterhin unverändert erfolgreich geprüft.
- Mewtu in Controllerkette, Menü, Katalog, Hinweise, Eingabesicherungen
  und gemeinsame Kampfsteuerung eingebunden.
- Eigene Azuria-Höhlenansichten mit Wasser, schwebenden Steinen und
  Psi-Barriere sowie freier innerer Kammer ergänzt.
- Storytexte für de/en/es/fr und Offline-Dateiliste erweitert.
- Gemeinsame Tippsperre, Minispielübergänge, Portrait und Finale verwendet.
- Mewtu zunächst ebenfalls mit 80 Prozent Portraitskalierung darstellen;
  abgenommene Zapdos-/Arktos-/Lavados-Skalierungen bleiben gleich.
- Gemeinsame UI-/Finale-Prüfungen auf vier Profile erweitert.
- Bestehenden Reviewrunner um Mewtu-Modell, Fallauswahl und p150 ergänzt;
  Profil, Bedienung und Startverfahren unverändert.
- Lokale Ergebnisse dieses Schritts, neuer WASM-Build, Mewtu-Testspielstände
  und manuelle Mewtu-Abnahme noch offen.
- Lavados-Browserabnahme bleibt bestehen; kein Commit/Push.

### Mewtu — aktueller Build und Reviewspielstände

- Nutzer meldet erfolgreiche App-/UI-/Finale-/Minispiel-Teilprüfungen.
- Neuer WASM-Build mit Emscripten erfolgreich; bekannte
  TPNamedPrompt-C-Linkage-Warnung bleibt offen.
- Bestätigter WASM-SHA-256: d9361e22786c9f62ec5e6c1405cfc6aa92fde671548633f8fee48e45d9d53b35.
- Acht synthetische Mewtu-Fälle aus unveränderten Lavados-Vorlagen erstellt.
- Alle Fälle besitzen acht Kanto-Orden; Fälle 1/2 ohne Kanto-Ligaabschluss,
  Fall 2 zusätzlich mit Johto-Abschluss; ab Fall 3 Kanto-Abschluss gesetzt.
- Story-/Aufnahme-/Sammlungsverknüpfung und gespeicherte Dateien mit
  tatsächlichen Modellen und strengem Parser geprüft.
- Keine native Browser-Freischaltprüfung durch diese Dateierzeugung behauptet.
- Reviewspielstände: /Users/M1dn8/Downloads/iTamaPoke-Mewtu-Review-LnWXHs
- Bestehender Reviewrunner und gespeichertes Profil weiterverwenden.
- Manuelle Mewtu-Abnahme und iPhone-Abnahme noch offen.
- Kein Commit/Push; vollständiger Abschlusslauf weiterhin ausgesetzt.

### Mewtu-Review — Ortsnamen und bestätigte Johto-Freischaltlücke

- Nutzer bewertet Mewtus Darstellung, Minispiel, Animationen und Anschluss positiv.
- Verbleibende Screenshotnotiz: Geschichtenbuttons dürfen das versteckte
  Pokémon nicht vorwegnehmen.
- Katalog-Ortsnamen in de/en/es/fr ohne Pokémonzusatz; sichtbare
  Symbolhinweise entfernt; wartende Aufnahme in der Liste als Offen führen.
- Dialoge, Begegnung und Aufnahmesequenz behalten ihre Pokémonbezeichnung.
- Lokale Datenprüfung: ältere Lavados-Fälle enthalten acht Johto-Orden,
  aber keinen gespeicherten Johto-Ligasieg; Mewtu-Fall 2 ist ein absichtlicher
  synthetischer Johto-Liga-Negativtest.
- Lokaler Regionaltest bestätigt fehlende native Johto-Eintrittssperre:
  Johto-Arenen sind ohne ersten Kanto-Ligasieg startbar.
- Verbindliche Korrektur offen: Johto-Arenen erst nach dauerhaft bestätigtem
  ersten vollständigen Kanto-Ligasieg; UI und native Starts vor Energieabzug.
- Vorhandene Fortschritte nicht löschen; positive Testfixtures anpassen
  und gezielte Sperrtests ergänzen.
- Katalogkorrektur-Prüfungen dieses Schritts noch offen.
- Johto-Sperre durch diesen Text-/Katalogschritt noch nicht behoben.
- Kein Commit/Push; vollständiger Abschlusslauf weiterhin ausgesetzt.

### Johto — Kanto-Liga-Voraussetzung abgesichert

- Nutzer meldet bestandene Ortsnamen-/Katalogprüfungen.
- Gemeinsamen lesenden Kanto-Ligaabschlussprüfer für Mewtu und Johto eingeführt.
- Johto-Auswahl verlangt bestätigten historischen Kanto-Ligasieg.
- Direkte und bezahlte native Johto-Arenastarts vor Energieabzug gesperrt.
- Fehlende/falsche/future Abschlussmetadaten schalten Johto nicht frei.
- Vorhandene Johto-Fortschritte bleiben unverändert; keine automatische
  Kanto-Siegvergabe und keine Migration zum Umgehen der Voraussetzung.
- Positive Regional-/Arena-Team-/Browser-Fixtures um Kanto-Abschluss ergänzt.
- Kanto-Teamliga-Fälle behalten ihren anfänglich fehlenden Kanto-Titel;
  Johto-Teamliga-Fälle bewahren den vorausgesetzten historischen Kanto-Titel.
- Native Sperrprüfungen für alle 256 Ordensmasken und ungültige Metadaten,
  UI-Sperrprüfungen sowie gezielten echten Browser-Negativtest ergänzt.
- Lokale Prüfungen, neuer WASM-Build und manuelle Johto-Nachprüfung noch offen.
- Keine vollständige Paketfreigabe, kein Commit/Push.

### Johto — erwartete Art im Browser-Teststart korrigiert

- Gezielter Browserlauf scheiterte vor der Sperrprüfung im beforeEach:
  importierte Johto-Fixture enthält Art 376, prepare erwartete standardmäßig 1.
- Dieser fehlgeschlagene Lauf ist keine Browserfreigabe der Johto-Sperre.
- prepare um optionale expectedSpecies mit unverändertem Standard 1 erweitert.
- Johto-beforeEach übergibt ausdrücklich 376.
- Tatsächliche Artenprüfung im Importhelfer bleibt erhalten.
- Keine Änderung an Zeitlimits, Retries oder Spielmechanik.
- Regressionstest für Standard-/explizite Artenweitergabe ergänzt.
- Erneuter gezielter Browserlauf noch offen; kein neuer WASM-Build nötig.
- Kein Commit/Push.

### Mew — gemeinsamer Modell-/Controllerbaustein

- Nutzer bestätigt Mewtus Funktion, Animationen und erfolgreichen Anschluss
  sowie nachträglich Johto-Sperre und korrigierte Geschichtenbuttons.
- Gezielter Johto-Browsertest bestanden; fehlgeschlagener vorheriger
  Teststart bleibt als Fehler dokumentiert und wird nicht als Erfolg gezählt.
- Keine iPhone-Abnahme oder vollständige P06-Abschlussfreigabe behauptet.
- Mew-Konzept: versteckte Lichtung nördlich der Nuggetbrücke, Versteckspiel
  mit Busch, Baum und Felsen; drei richtige Entdeckungen; Level 50.
- Nach richtigem Fund neues Versteck; bei falscher Wahl gleiche Runde
  mit neuem Hinweis; kein Gesamttimer.
- Kostenlose Wiederholungen ohne Energieverlust.
- Freischaltung erst nach allen drei vorhandenen Kanto-Ligavarianten;
  vorhandene validierte Ruhmeshallen-Variantenmaske verwenden, nicht
  bloß eine Anzahl von drei Wiederholungssiegen.
- Eigenes mew-Profil im gemeinsamen Modell/Controller/Parser ergänzt.
- Gemeinsamen Aufnahmeweg erweitert; keine separate Speicherverwaltung.
- Modell-/Controller-/Speicherprüfungen einschließlich Fünf-Profil-
  Spielstand zentral registriert; Ergebnisse dieses Schritts noch offen.
- Native Variantenfreischaltung, Versteckspiel, Texte, Grafik, App-Anbindung,
  aktueller Build und manueller Mew-Review weiterhin ausstehend.
- Geschichtenbutton später nur mit Ortsnamen, ohne Mew vorwegzunehmen.
- Bestehenden gespeicherten Revisionsbrowser weiterverwenden.
- Kein Commit/Push; vollständiger Abschlusslauf erst nach Mew-Abnahme.

### Mew — native Drei-Varianten-Freischaltung und Prüfduell

- Nutzer meldet erfolgreiche Mew-Modell-, Controller- und Speicherprüfungen:
  88 Modell-Assertions, 42 Controller-Assertions plus Ablehnungen sowie
  62 akkumulierte Speicherprüfungen einschließlich fünf Storyprofilen.
- Native Mew-Freischaltung verlangt gültigen Kanto-Abschluss und alle
  drei Bits der validierten Kanto-Ruhmeshallen-Variantenmaske.
- Vorhandenen Hall-Decoder für Version, CRC, Region und Datensätze nutzen;
  keine zweite vereinfachte Hall-Interpretation oder bloße Siegzahlprüfung.
- Drei Siege derselben Variante und Johto-Erfolge reichen nicht.
- Historischer Variantenfortschritt bleibt trotz begrenzter sichtbarer
  Eintragshistorie maßgeblich; keine alten Siege nachträglich erfinden.
- Interne lesende Variantenabfrage ergänzt; ohne echte Hall-Anbindung
  verweigern isolierte Testbuilds die Erstfreischaltung.
- Gemeinsamen Level-50-Duell-/Aufnahmeweg für Mew ergänzt.
- Neue Zugriffsprüfung nutzt echte Hall-Serialisierung/-Validierung;
  ihre eingetragenen Hall-Siege bleiben ausdrücklich synthetische Fixtures.
- Native Tests dieses Schritts noch offen.
- Versteckspiel, Texte, Lichtungsgrafik, App-Anbindung, aktueller Build
  und manueller Mew-Review folgen.
- Kein Commit/Push; vollständiger Abschlusslauf weiterhin ausgesetzt.

### Mew — Versteckspiel vorbereitet

- Nutzer meldet erfolgreiche native Mew-Freischalt-/Duellprüfungen,
  Hall-Regression, Mewtu-Duell und Johto-Sperr-/Arenaprüfungen.
- Versteckspiel mit drei festen Verstecken: Busch, Baum und Felsen.
- Drei richtige Entdeckungen; nach Erfolg anderes Versteck.
- Falsche Wahl behält dieselbe Runde und Position, zeigt anderen Hinweis.
- Kein Gesamttimer, keine Energiebuchung und keine Wiederholungskosten.
- Rosa Schwanzspitze, Ohren oder Silhouette als visuelle und zugängliche
  Hinweise; reduzierte Bewegung schaltet dekoratives Schimmern ab.
- Rundenrevision und getrennte DOM-Elemente verwerfen veraltete Eingaben.
- Nach Speicherfehler bleibt das gelöste Spiel für Speichern-Retry erhalten.
- Gemeinsamer Minispielvertrag create/attach/start/solved/dispose erhalten.
- Isolierte Node-Logik-/DOM-Double-Prüfung im Assistenzwerkzeug bestanden.
- Lokale Ergebnisse und echte Touch-/Darstellungsprüfung noch offen.
- Storytexte, Nuggetbrücken-/Lichtungsgrafik, App-Anbindung, aktueller Build
  und Mew-Revisionsbrowser folgen.
- Keine Änderung an Lavados-/Mewtu-Grafik und Minispielen; kein Commit/Push.

### Mew — App-Anbindung und Nuggetbrücken-Lichtung

- Nutzer meldet bestandene Versteckspiel-Logik-/DOM-Double-Prüfungen;
  Mewtus Psi-Barriere weiterhin erfolgreich geprüft.
- Mew in gemeinsame Controllerkette, Menü, Katalog, Hinweis,
  Eingabesicherungen und Kampfsteuerung eingebunden.
- Ortsname im Geschichtenbutton nur Nuggetbrücke, ohne Pokémon-Spoiler.
- Eigene Brücken-/Lichtungsansichten mit Busch, Baum, Felsen und rosa Spur;
  nach Aufgabe freie Lichtung für Begegnung und gemeinsame Aufnahmesequenz.
- Storytexte für de/en/es/fr und Offline-Dateiliste ergänzt.
- Mew zunächst mit 65 Prozent Portraitskalierung; übrige Skalierungen erhalten.
- Gemeinsame UI-/Finale-Prüfungen auf alle fünf Profile erweitert.
- Bestehender Reviewrunner um Mew-Profil, p151 und Diagnosefeld erweitert;
  Browserprofil, Bedienung und Startverfahren unverändert.
- Nativer Zugriffstest erzeugt zusätzlich validierte Hall-Reviewdaten:
  zwei Varianten, drei gleiche Siege und alle drei Varianten.
- Prüfungen dieses Schritts, aktueller WASM-Build, Reviewspielstände und
  manuelle Mew-Abnahme noch offen.
- Kein Commit/Push; vollständiger Abschlusslauf erst nach Mew-Abnahme.

### Buildwarnung — interne Named-Prompt-Linkage korrigiert

- Nutzer fordert Behebung der wiederholt gemeldeten TPNamedPrompt-Warnung.
- Aufrufer geprüft: interner C++-Helfer in browser_glue.cpp; zwei lokale
  const-char*-Exporte. Separate Objective-C-Implementierung unverändert.
- Explizite C++-Linkage ausschließlich am std::string-Helfer ergänzt.
- Funktionskörper und öffentliche C-/JavaScript-Schnittstellen unverändert.
- WASM-Build behandelt return-type-c-linkage künftig als Fehler;
  keine Warnungsunterdrückung hinzugefügt.
- Zentral registrierter Regressionstest nutzt tatsächliche Funktionskörper
  mit simulierten Pet-/Übersetzungsabhängigkeiten und separatem C-Linkage-
  Aufrufer; prüft Namen, UTF-8, Pufferlebensdauer und Abschneiden.
- Clang-Test prüft zusätzlich Ablehnung der alten Deklaration.
- Lokale Regression und strikter WASM-Neubau dieses Schritts noch offen.
- Mew-Reviewvorbereitung folgt erst nach erfolgreicher Korrekturprüfung.
- Kein Commit/Push und keine vollständige Paketfreigabe.

### Mew — Reviewvorbereitung nach behobener Linkage-Warnung

- Nutzer meldet bestandene Named-Prompt-Regression und Clang-Negativkontrolle.
- Strikter WASM-Neubau erfolgreich; bekannte C-Linkage-Warnung nicht mehr vorhanden.
- Bestätigter WASM-SHA-256: bc9c04d3d6f6dffadf39d6cc1c7b38da2975972cabd64cc6865cc02691a4671d.
- Acht synthetische Mew-Fälle aus unveränderten Mewtu-Vorlagen erstellt.
- Hall-Daten durch tatsächlichen nativen Hall-Serializer erzeugt und
  vor Export mit tatsächlicher Mew-Freischaltung validiert:
  zwei Varianten gesperrt, drei gleiche Siege gesperrt, alle drei frei.
- Keine zweite vereinfachte Hall-Serialisierung im JS-Vorbereiter eingeführt.
- Modell-/Aufnahmeverknüpfung und gespeicherte Dateien strikt geprüft.
- Reviewspielstände: /Users/M1dn8/Downloads/iTamaPoke-Mew-Review-d0vAcc
- Manuelle Mew-Darstellungs-/Touch-/Funktionsprüfung noch offen.
- Finale-Direktfall ist nur Sichtprüfung, kein Nachweis eines echten Anschlusses.
- Bestehendes Reviewprofil und importierte Grafiken weiterverwenden.
- Kein Commit/Push; gemeinsamer Abschlusslauf weiterhin ausgesetzt.

### Letzte Mew-Reviewkorrektur und echte Browserabdeckung

- Mew-TXT-Notiz: Nuggetbrücke mittig zwischen Busch und Felsen platzieren.
- Brückendeck und anschließenden Weg zentriert; übrige Szenerie erhalten.
- Audit: neue Tests registriert, Webmodule geladen/gecacht, Sammlung
  erfolgreich; 328 Browserausführungen in 42 Dateien vor Erweiterung.
- Fehlende echte Browserfälle für Lavados/Mewtu/Mew ergänzt:
  sieben Freischaltfälle und zwölf Spiel-/Aufnahme-/Retryfälle.
- Reproduzierbare native Hall-Testfixture ohne private Medien versionieren;
  nativer Generator prüft künftig Gleichheit gegen diese Fixture.
- Browserfixtures haben explizite Pflege-Art 1 und geprüfte F4-Identität.
- Laufzeit-Sprites sind synthetische Farbfelder, keine Pokémon-Bilddateien.
- Gemeinsame Tippsperre verfolgt Kontakte schon vor Aktivierung und über
  Reset/Arm hinweg; bereits gehaltene Kontakte müssen erst beendet werden.
- Zusätzliche echte Browser-Halteprüfung beim letzten Psi-Impuls.
- affected-Auswahl um neue Legendären-, Johto- und Teamliga-Fälle erweitert.
- Gezielte neue Prüfungen und manuelle Bestätigung der Brückenposition offen.
- Noch keine vollständige Paketabnahme, kein Gesamtlauf und kein Commit/Push.

### Restpaket P06 — manuelle Abnahme und eingefrorener Abschlussstand

- Nutzer bestätigt Lavados, Mewtu und Mew im bestehenden Revisionsbrowser.
- Letzte Mew-Notiz erledigt: Brücke mittig zwischen Busch und Felsen;
  Position am 29.10.2026 ausdrücklich bestätigt.
- Ortsnamen ohne Pokémon-Spoiler und Johto-Sperre manuell bestätigt.
- Neue Legendären-Chromiumfälle: 19 bestanden, Bericht dUucos.
- Letzter gemeldeter gezielter Browserlauf: 24 bestanden, Bericht AjqIH4.
- Gezielte Prüfungen ersetzen nicht die vollständige Gesamtregression.
- Vollständige Browserregression und zentraler nativer Gesamtcheck
  werden auf unverändertem Stand ausgeführt; Ergebnisse noch offen.
- Keine Timeout-Erhöhungen, abgeschwächten Assertions oder automatischen Retries.
- Aktueller WASM-Build enthält die behobene Named-Prompt-Linkage;
  return-type-c-linkage wird im Build als Fehler behandelt.
- Noch keine Veröffentlichung, CI-/Deployment-Bestätigung oder iPhone-Abnahme.
- Commit/Push erst nach erfolgreichen Abschlussprüfungen und Nutzerfreigabe.

### Abschlusslauf fehlgeschlagen — Arena-Fixture und Guard-Aktualisierung

- Vollständiger Browserlauf gFr5Bc fehlgeschlagen:
  362 bestanden, 3 fehlgeschlagen, 1 übersprungen.
- Native Gesamtprüfung wurde wegen des vorherigen Fehlers nicht gestartet.
- Übersehene parametrisierte arena-team-Johto-Fixture erhält jetzt vor
  Teamaufbau den vorausgesetzten historischen Kanto-Abschluss.
- Region-0-Fixture bleibt unverändert; Artenprüfung bleibt ausdrücklich 1.
- Tippsperre aktualisiert ihren Freigabestatus auch bei Kontaktende
  außerhalb der momentan sichtbaren Begegnung.
- Halteverfolgung, 650-ms-Einstiegsschutz und 350-ms-Ruhephase bleiben erhalten.
- Neue Regression für diesen Kontaktende-Fall und read-only Guard-Diagnostik.
- Zapdos-Test behält seine Aktivierungsassertion unverändert bei Fehlern
  und hängt zusätzliche Zustandsdaten an.
- affected-Auswahl um arena-team ergänzt.
- Quellen für gezielte Korrektur geöffnet; neuer vollständiger Abschlusslauf
  auf anschließend erneut eingefrorenem Stand erforderlich.
- Keine Timeout-Erhöhung, keine Retries und keine Veröffentlichung.

### Zapdos — verlorene Freigabebenachrichtigung an Timergrenze

- Stabilitätslauf FUb6Sr fehlgeschlagen: 35 bestanden, 1 fehlgeschlagen.
- Arena-Team-Fixture zeigte in diesem Lauf keine weiteren Fehler.
- Neue Zapdos-Diagnose: Guard intern bereit, keine gehaltenen Kontakte,
  alle Schreib-/Busy-Gates frei, aber data-tap-ready weiterhin false.
- Zeitgrenzenrennen isoliert reproduziert: Uhr überschreitet Freigabegrenze
  zwischen falscher Benachrichtigung und erneuter Timerentscheidung.
- refresh verwendet eine gemeinsame Zeitprobe für Benachrichtigung und
  Folgetimer; keine zusätzliche Polling-Schleife und keine erzwungene
  Schaltflächenfreigabe.
- Deterministischer Regressionstest simuliert den Grenzübertritt und
  verlangt eine nachfolgende tatsächliche Freigabebenachrichtigung.
- Kontaktverfolgung sowie 650-/350-ms-Schutzzeiten unverändert.
- Lokale Regression und erneute gezielte Browserprüfung noch offen.
- Gesamtlauf und native Gesamtfreigabe weiterhin offen; kein Commit/Push.

### Erneut eingefrorener Abschlussstand — Guard-Zeitgrenze

- Nutzer meldet erfolgreichen Stabilitätslauf aWOeQG:
  alle 30 Browserausführungen bestanden.
- Enthalten: Zapdos-Finale und tatsächliche Minispiel-/Begegnungsübergänge
  in Chromium und WebKit, jeweils drei explizite Durchgänge ohne Retries.
- Deterministische Regression für verlorene Freigabebenachrichtigung
  an der Timergrenze ergänzt; Schutzzeiten und Halteprüfung erhalten.
- Zuvor korrigierte Arena-Team-Johto-Fixture bleibt Bestandteil des Pakets.
- Fehlgeschlagene Läufe gFr5Bc und FUb6Sr bleiben als fehlgeschlagen
  dokumentiert und werden nicht durch erfolgreiche Teilprüfungen ersetzt.
- Manuelle Abnahme von Lavados, Mewtu und Mew einschließlich der
  Brückenposition bleibt dokumentiert.
- Korrigierten Stand für vollständige Abschlussprüfungen erneut eingefroren.
- Browsergesamtregression und zentraler nativer Gesamtcheck noch offen.
- Kein Commit/Push, keine CI-/Deployment- oder iPhone-Abnahme behauptet.

### Geschichtenübersicht — schrittweise Entdeckung statt gesperrter Vorschau

- Veröffentlichung auf Nutzerwunsch weiter ausgesetzt; kein Commit/Push.
- Bisheriger Abschlusslauf historisch erfolgreich, einschließlich
  nativem Gesamtcheck ZZ60rS; gilt nicht als Prüfung dieser neuen Änderung.
- Geschichten erscheinen erst bei erfüllter tatsächlicher Freischaltung.
- Ohne verfügbare Geschichte erscheint:
  „Hier ist noch nichts zu entdecken. Komm später wieder!“
- Abgeschlossene Geschichten bleiben sichtbar und deaktiviert.
- Keine gesperrten Ortskacheln oder Voraussetzungstexte als Vorschau.
- Neue-Geschichten-Hinweis und Bestätigung nur für freigeschaltete,
  noch nicht abgeschlossene Geschichten; bestehender Offen-Zähler bleibt.
- Leertext in Deutsch, Englisch, Spanisch und Französisch.
- Regressionen für leeren Katalog, alle fünf Freischaltstufen,
  abgeschlossene Geschichten, Zustandswechsel, Zähler und Hinweise ergänzt.
- Gezielte Tests und RevisionBrowser-Sichtprüfung noch offen.
- Vollständige Abschlussprüfungen erst nach Abschluss dieser Änderung.

### Geschichtenentdeckung — Browserabdeckung und Testinventur

- Nutzer bestätigt Katalog-, Shared-UI- und Follow-up-Tests erfolgreich.
- Browserprüfung der vorhandenen nativen Freischaltfälle IEa8Xw erfolgreich:
  gesperrte Geschichten samt Ortsnamen fehlen, freigeschaltete sind bedienbar.
- Bestehende Prüfungen abgeschlossener Kacheln und geschützter
  Begegnungsschaltflächen bleiben unverändert erhalten.
- Sechs zusätzliche echte Browserfälle ergänzt: kein Zugang, vier/sechs/
  acht Kanto-Orden, Kanto-Champion und vollständige Mew-Voraussetzungen.
- Jede Stufe prüft native Freischaltung, genaue Kachelzahl, verborgene
  Ortsnamen, Offen-Zähler, rote Punkte und Zustand nach Neuladen.
- Zusätzlicher Browserlauf und vollständige Sichtung weiterer
  katalogbezogener Testfundstellen noch offen.
- RevisionBrowser-Sichtprüfung und erneute Gesamtprüfungen noch offen.
- Kein Commit/Push.

### Geschichtenentdeckung — bestehende Tests korrigiert und Katalogreview

- Erweiterte Browserprüfung y3ljQl vom Nutzer als erfolgreich gemeldet.
- Weitere Testinventur gesichtet: veraltete Erwartungen zusätzlich
  in stories-overview.spec.js gefunden und gezielt korrigiert.
- Drei-Orden-Fall verlangt leeren Katalog ohne Orts-/Voraussetzungsspoiler.
- Bestehende Vier-/Fünf-/Sechs-Orden-Matrix verlangt genaue sichtbare
  Kachelzahl und vollständige Abwesenheit noch gesperrter Geschichten.
- Native Zugriffsverweigerung, bestehender Fortschritt ohne Orden,
  Speicherfehler-Wiederholung und Hinweisgestaltung unverändert geprüft.
- Übrige gezeigte Menü-/Navigations- und statische Vertragsfundstellen
  benötigen nach Sichtung keine geänderten Erwartungen.
- Bestehender RevisionBrowser um strikt validiertes Katalogprofil erweitert.
- Alte Storyprofile und deren Navigation bleiben erhalten und werden
  zusammen mit allen acht Katalogrouten im Profiltest geprüft.
- Gezielter Browserlauf und visuelle Katalogabnahme noch offen.
- Frühere Gesamtläufe bleiben historische Ergebnisse; erneuter Abschluss
  erst nach dieser Änderung. Kein Commit/Push.

### Geschichtenentdeckung — visuell abgenommen und erneut eingefroren

- Nutzer bestätigt gezielten Browserlauf tzLUbm:
  46 Prüfungen bestanden, Laufzeit 1,1 Minuten.
- Enthalten sind die angepassten bestehenden Geschichtenprüfungen,
  native Freischaltfälle und sechs neue Katalogstufen samt Neuladen.
- Acht synthetische Katalog-Review-Spielstände erfolgreich vorbereitet
  und über den vorhandenen Save-Decoder unverändert geprüft.
- Nutzer bestätigt RevisionBrowser-Abnahme:
  alles funktioniert und sieht gut aus.
- Leerer Anfangszustand und schrittweise sichtbare Geschichten abgenommen.
- Bereits abgeschlossene Geschichten bleiben sichtbar und deaktiviert;
  bestehende Fortschritts-, Speicherfehler- und Eingabeschutzprüfungen erhalten.
- Korrigierten Stand für vollständige Abschlussprüfungen erneut eingefroren.
- Frühere erfolgreiche Gesamtläufe bleiben historische Ergebnisse;
  Browsergesamtregression und zentraler nativer Gesamtcheck dieses
  abschließenden Standes noch offen.
- Kein Commit/Push. GitHub-Build/Deployment und iPhone-Abnahme
  dieses Gesamtpakets weiterhin nicht behauptet.

### P06 — abschließende lokale Freigabe und Veröffentlichung

- Nutzer bestätigt den erneuten Abschlusslauf als erfolgreich.
- Vollständige Browserregression und anschließender zentraler
  nativer/Logik-Gesamtcheck erfolgreich; der freigegebene Befehlsblock
  erreichte die abschließende Diffprüfung und Statusausgabe.
- Bericht des zuletzt ausgeführten zentralen Checks: MdbxIN.
- Abschließendes git diff --check ohne Beanstandung.
- Zuvor 46 gezielte Katalog-Browserprüfungen im Lauf tzLUbm bestanden.
- RevisionBrowser-Abnahme der schrittweisen Geschichtenentdeckung
  ausdrücklich vom Nutzer bestätigt.
- Früher fehlgeschlagene Läufe bleiben als historische Fehler dokumentiert.
- Gemeinsamer Paketumfang umfasst die legendären Geschichten,
  Aufnahmewege, Fortschrittssperren, Eingabeschutz, spoilerfreie
  Katalogentdeckung und zugehörige Regressionen/Reviewwerkzeuge.
- Nutzer hat Dokumentation, gemeinsamen Commit und Push nach
  M1dn8/iTamaPoke auf main ausdrücklich freigegeben.
- Durchführung über den vereinbarten Git-Terminalablauf.
- Synthetische Review-Spielstände, Aufnahmen und private Grafikpakete
  sind nicht Teil des Veröffentlichungsschritts.
- GitHub-Build/Deployment und iPhone-Abnahme dieses Gesamtstands
  bleiben separat zu prüfen; hier keine erfolgreiche Durchführung behauptet.

### P06 — Veröffentlichung und iPhone-Abnahme abgeschlossen

- Paketcommit: f16802ee6628d772109a2e5c7132cbac44ee924f
  (feat(p06): complete legendary stories and spoiler-free discovery).
- Push nach M1dn8/iTamaPoke auf main erfolgreich.
- Nutzer bestätigt anschließend: Build grün, iPhone-Test erfolgreich.
- Lokale Gesamtprüfungen und RevisionBrowser-Abnahmen sind bereits
  in den vorherigen Abschlussabschnitten dokumentiert.
- Einschließlich der nachträglichen Katalogänderung:
  zunächst leerer Geschichtenbereich mit Hinweistext, danach schrittweise
  Anzeige tatsächlich freigeschalteter Geschichten ohne Ortsvorschau.
- P06-Gesamtpaket damit einschließlich Veröffentlichung und
  nutzerbestätigter iPhone-Abnahme abgeschlossen.
- Dieser Nachtrag verändert ausschließlich die Projektdokumentation.

### UI01-01 — Pokédex-Zentrale als Gestaltungsprototyp

- Nutzer hat die UI01-Vorgehensweise und den Start bestätigt.
- Grundlage sind zehn Review-Notizen aus Sitzung T9pnfQ.
- Erster Schritt: lokaler, bedienbarer Gestaltungsprototyp der Zentrale.
- Rotes Retro-Pokédex-Gehäuse, zwei helle Displayhälften und lokale SVG-Icons.
- Die fünf bestehenden Zugänge bleiben funktional unverändert.
- Sammlung und direkter eigentlicher Pokédex folgen mit geprüften
  Rückwegen im nächsten Teilschritt; keine funktionslosen Platzhalter.
- Geschichtenhinweise, Zähler, Sperren und Speicherung unverändert.
- Mega-Entwicklungsseite als abschließender eigener UI01-Reviewpunkt
  aufgenommen; passende synthetische Spielstände vor Review vorbereiten.
- Vorhandene Menütests erhalten; Icon- und Layoutprüfungen ergänzt.
- Gezielte Prüfungen und visuelle Prototypabnahme noch offen.
- Kein WASM-Neubau, kein Commit/Push und kein P07-Start.

### UI01-01 — zweite Gestaltungsrunde nach Review QBNWHq

- Erster Prototyplauf 8DfAnp: Nutzer meldet 38 bestandene Prüfungen.
- Nutzerreview QBNWHq: Gehäusefarben und Iconauswahl gefallen.
- Gewünschte Korrekturen: farbige Icons, passendere Displayflächen,
  schlankere Schaltflächen.
- Rotes Gehäuse und Sensor bleiben unverändert.
- Displayflächen auf kühles helles Blaugrau umgestellt.
- Kachelreihen nicht mehr flächenfüllend gestreckt, maximal 56 Pixel hoch;
  Mindesthöhe bleibt 44 Pixel.
- Icons erhalten dezente eigene Farben und ausgewählte Füllflächen.
- Browserprüfungen für tatsächliche Iconfarben und kompakte Höhe ergänzt;
  Überlauf-, Bediengrößen- und Rückwegprüfungen bleiben erhalten.
- Navigation, Fortschritte, Speicherung, Geschichtenhinweise und Zähler
  unverändert.
- Anhangslimit beachten: Review-Aufnahmen weiter lokal speichern;
  zunächst Textfeedback, zusätzliche Uploads nur bei tatsächlichem Bedarf.
- Gezielte Prüfungen und visuelle Rückmeldung zur zweiten Fassung offen.
- Kein Commit/Push.

### UI01-02 — Sammlung aus der Pokédex-Zentrale

- Nutzer bestätigt Gestaltungsrunde s7AtcD: zwölf Prüfungen bestanden;
  Gehäuse, Displayfarben, Iconfarben und kompakte Buttons passen.
- Gestaltung vorläufig abgenommen; endgültige Anordnung erst nach
  Einbau aller vorgesehenen Zugänge gemeinsam abstimmen.
- Sammlung als sechsten echten Zugang mit übersetzter Beschriftung
  und farbigem Boxen-Icon ergänzt.
- Vorhandene Sammlungsoberfläche, Modelle und Transaktionen weiterverwendet.
- Ursprung beim Öffnen ausdrücklich card oder pokedex; Zentralenzugang
  nur aus der aktiven tatsächlichen Pokédex-Zentrale erlaubt.
- Normaler Rückweg führt zum jeweiligen Ursprung.
- Pflege-Umbenennung und offene Aufnahme verlassen die Sammlung über
  ihre bisherigen Spielwege, ohne die Zentrale darüber einzublenden.
- Bisheriger Canvas-Zugang bleibt während dieser Integrationsprüfung
  erhalten; Entfernung erst nach geprüftem neuen Zugang.
- Bestehende Boxen-/Team-/Quota-Prüfungen erhalten; zusätzliche
  Ursprungs-/Gate-, Hub-Rückweg-, Reload- und Schreibfehlertests ergänzt.
- Vorhandene Zentralen- und Hinweisprüfungen auf sechs echte Zugänge
  aktualisiert; Bediengrößen- und Überlaufprüfungen beibehalten.
- Gezielte Tests und RevisionBrowser-Abnahme dieses Teilschritts offen.
- Keine Änderung an Fang-/Team-/Pflegeregeln. Kein Commit/Push.

### UI01-02 — einheitliche Zurück-Beschriftung und Headerposition

- Sammlungsintegration xm5G4q: Nutzer meldet 46 bestandene Prüfungen
  und bestätigt, dass Öffnen und Rückweg funktionieren.
- Reviewkorrektur: Zurück statt Zurueck; außerdem sichtbarer
  Positionswechsel des Buttons zwischen Zentrale und Unterseiten.
- Sammlungs-Kopfzeile verwendet den vorhandenen common.back-Textschlüssel;
  lesbarer deutscher Rückfalltext und Übersichtslink korrigiert.
- Gemeinsame Buttonmaße 64 x 44 Pixel und angeglichene Headerabstände
  für Zentrale, normale Menüseiten, modale Werkzeuge und Sammlung.
- Lange Überschriften dürfen die Kopfzeile nicht mehr erhöhen;
  sichtbare Kürzung bei Platzmangel, vollständiger Titel bleibt im DOM.
- Neue Browsergeometrieprüfung bei 320/390/430 Pixel:
  alle sechs Zentralenzugänge und Rückkehr zum Hub, jeweils Position
  und Größe relativ zum Spielfeld verglichen.
- Bestehende Sammlungs- und Menüprüfungen erhalten und Beschriftungen angepasst.
- Navigation, Speicher-, Aufnahme- und Pflegefunktionen unverändert.
- Gezielte Prüfungen und Sichtprüfung dieser Korrektur noch offen.
- Kein Commit/Push.

### UI01-02 — zusätzlichen Sticky-Header-Versatz korrigiert

- Headerprüfung q33JtZ fehlgeschlagen:
  44 bestanden, fünf fehlgeschlagen, eine unterbrochen, zwei nicht ausgeführt.
- Zusätzlich meldet der Runner einen Fehler außerhalb eines Testfalls;
  dessen vollständige Details liegen im übermittelten Ausschnitt nicht vor.
- Geometriefehler in beiden Browsern: Eier-Dialog mit exakt zwölf Pixeln
  zusätzlichem vertikalem Versatz.
- Nutzer beobachtet denselben sichtbaren Effekt auch bei Entwicklung
  und Arten-Pokédex; diese nutzen ebenfalls den modalen Header.
- Fehlerhafte zusätzliche top:12px-Regel des Sticky-Headers auf top:0
  korrigiert; zwölf Pixel Panel-Innenabstand bleiben bestehen.
- Keine Gegenverschiebung per transform, keine Animation als Kaschierung.
- Buttonmaße, Navigationswege und Geometrietoleranz unter einem Pixel
  unverändert. Keine Testbedingungen abgeschwächt.
- Erneuter vollständiger gezielter Lauf noch offen; unterbrochene und
  nicht ausgeführte Fälle werden nicht als bestanden gewertet.
- Kein Commit/Push.

### UI01 — gemeinsame abgerundete Seitenrahmen

- Headerkorrektur yQ7r4Z: Nutzer meldet 52 bestandene Prüfungen.
- Nutzer bestätigt: Zurück-Schaltflächen sind nun positionsgleich.
- Nutzer wünscht die Rundung der Pokédex-Zentrale für alle Seiten.
- Gemeinsamer äußerer Seitenradius: zwölf Pixel.
- Spielrahmen begrenzt mit vorhandenem overflow:hidden auch die
  Canvas-Darstellung auf die runde Außenkontur.
- Normale Menüseiten, modale Werkzeugflächen, Sammlung/Aufnahme
  und Pflegedialog verwenden dieselbe äußere Rundung.
- Innere Scrollbereiche, Button-/Kartenradien, Headerabstände und
  Spielkoordinaten unverändert.
- Bestehende Headergeometrieprüfung um Rundungsprüfungen aller vier
  Ecken an der Zentrale und ihren sechs Zielseiten ergänzt.
- CSS-Vertragsprüfung erweitert; keine Pixel-Screenshotprüfung behauptet.
- Gezielte Tests und visuelle Rückmeldung zur gemeinsamen Rundung offen.
- Kein Commit/Push.

### UI01-03 — direkter Pokédex aus der Zentrale

- Gemeinsame Rundung QBrVDI: Nutzer meldet 52 bestandene Prüfungen
  und bestätigt die Darstellung; weiterer UI01-Schritt freigegeben.
- Zentralenzugang heißt Pokédex und verwendet den ursprünglichen
  Wisch-Einstieg mit Raster, Seite null und Filter Alle.
- Vorhandene Suchansicht bleibt hinter einer übersetzten Lupenschaltfläche
  erreichbar; nicht gelöscht oder als neues Suchkonzept ausgegeben.
- Rückweg aus der Suche zunächst zum Pokédex, von dort zur Zentrale.
- Zurück verwendet weiterhin die gemeinsame Position und 64x44 Pixel.
- Nur beim Zentralenweg Raster/Filter um 26 logische Pixel versetzt;
  Sammelzähler in die Fußzeile verlagert, damit die Kopfzeile frei bleibt.
- Eingaben werden passend zur Darstellung abgebildet; ursprünglicher
  Wischweg, Detailansicht und Raster-Eingabefunktion bleiben unverändert.
- D3b-Referenzvergleich für das ursprüngliche Rendering unverändert
  erhalten; zusätzliche Transformations-/Lookup-Prüfung ergänzt.
- Suchhelfer, Raster-, Navigations-, Sprach- und Headerprüfungen angepasst.
- Verbliebene alte Erwartung von fünf Zentralenzugängen im
  Navigation-Smoke-Test auf sechs korrigiert.
- Erster Änderungsversuch vor Dateischreibzugriff sicher abgebrochen:
  Schleifen-Suchmuster traf Zeichen- und Eingabefunktion.
- Ersetzung nun ausdrücklich auf drawDexGrid begrenzt.
- Keine neue Gesehen-/Silhouettenlogik, keine Spielstandsmigration.
- Gezielte Prüfungen und RevisionBrowser-Abnahme offen.
- Kein WASM-Neubau und kein Commit/Push.

### UI01-03 — Rückkehrwunsch bei vorübergehend belegten Gates erhalten

- Lauf WOI37s fehlgeschlagen: 63 bestanden, ein Fehler unter WebKit/430.
- Vorhandener Trace ausgewertet: Geschichten, Tagebuch, Eier und Entwicklung
  erfolgreich verlassen; der letzte Klick betraf eindeutig #tp-dex-back.
- Pokédex danach weiterhin geöffnet; im ausgewerteten Trace-Ereignistyp
  keine Seitenfehler gefunden.
- Gatezustand zum Klickzeitpunkt war im Trace nicht aufgezeichnet;
  zeitliche Ursache daher nicht allein durch den Trace bewiesen.
- Im Code vorhandenen Verlustpfad korrigiert: returnFromDex verwarf
  den Wunsch bei quiet()===false bisher vollständig.
- Buttons bilden die Bereitschaft ab; bei einer unmittelbar im Klick
  beginnenden Sperre bleibt ein einzelner Rückkehrwunsch vorgemerkt.
- Ausführung erst bei freien bestehenden Gates und unverändertem
  Modul/Ziel/Ansicht; ungültige Wünsche werden verworfen.
- Keine neuen Timer, kein erzwungener Klick, keine Gate-Umgehung.
- Deterministische Modellumgebung prüft verzögerte Rückkehr und
  Verwerfen nach Modulwechsel.
- Echter Browsertest startet im Klick eine Sammlungs-Transaktion,
  hält deren dauerhaften Schreibabschluss und prüft die Rückkehr danach.
- Bestehende Geometrietoleranz, Zeitlimits und Funktionsprüfungen unverändert.
- Stabilitätsprüfung und erneuter betroffener Gesamtlauf noch offen.
- Kein Commit/Push.

### UI01-03 — UI-Gate-Prüfung und echte Schreibverweigerung getrennt

- Stabilitätslauf cfyfLf fehlgeschlagen:
  18 bestanden, fünf fehlgeschlagen, eine Ausführung unterbrochen.
- Die 18 bestandenen Fälle betreffen die wiederholten Kopfzeilenprüfungen.
- Nachgeschalteter betroffener Gesamtlauf wegen Abbruch nicht gestartet.
- Lokale Speicheranbindung gelesen: gewöhnliche Sammlungsoperationen
  sind ausschließlich in idle/card/settings erlaubt, nicht in dex.
- Vorheriger neuer Test wollte aus dex renameBox starten und erreichte
  deshalb seinen Schreib-Haltepunkt nicht. Testanordnung war unzulässig.
- Produktionsfreigaben bleiben unverändert; dex wird nicht als erlaubter
  Schreibkontext ergänzt.
- Ungültigen Test durch ausdrücklich simulierten UI-Gate-Vertrag ersetzt:
  Gate im Klick setzen, unveränderte Ansicht während der Sperre,
  automatische Rückkehr nach Freigabe ohne zweiten Klick.
- Separater echter Controller-Test verlangt Schreibverweigerung aus dex:
  konkrete Fehlermeldung, kein erzwungener Schreibaufruf, unveränderte
  Sammlung und freigegebene Gates nach Ablehnung.
- Vorhandene echte Speicher-/Quota-Tests aus collection-boxes.spec.js
  bleiben erhalten und werden im betroffenen Lauf mit ausgeführt.
- Frühere Behauptung, der ersetzte Browserfall erreiche eine echte
  Speichertransaktion, gilt nicht als Prüfnachweis.
- Keine Änderung am Produktionscode oder an Zeitlimits.
- Neue gezielte Prüfungen und betroffener Gesamtlauf offen.
- Kein Commit/Push.

### UI01-03 — unveränderte Navigationsbuttons nicht neu beschreiben

- Lauf C38Xkm fehlgeschlagen: zehn bestanden, zwei WebKit-Fehler.
- UI-Gate-Test meldet entered=false: Capture-Klicklistener wurde nicht
  ausgeführt; das simulierte Gate wurde somit gar nicht gesetzt.
- Zweiter Fehler erneut beim normalen Klick auf den Pokédex-Rückweg.
- Vorherige Gate-Erklärung ist damit keine nachgewiesene Originalursache.
- Konkrete Fehlerquelle im Navigations-Updater gefunden:
  unverändertes textContent wurde bei jeder Aktualisierung neu gesetzt.
- TextContent-Zuweisungen ersetzen Textknoten; unveränderte Beschriftung
  wird jetzt nicht mehr während laufender Eingaben neu aufgebaut.
- Auch hidden, disabled und aria-label nur bei tatsächlicher Wertänderung.
- Rückkehrwunsch-/Gate-Mechanismus bleibt separat geprüft; er ersetzt
  nicht die notwendige Stabilität des nativen Eingabeziels.
- Node-Regression verlangt null Beschriftungs-Schreibzugriffe bei
  zwölf unveränderten Aktualisierungen.
- Neuer echter Browsertest hält die Maus über acht Aktualisierungsframes
  gedrückt: keine DOM-Mutationen, gleicher Textknoten, danach native
  Freigabe der Taste und Rückkehr ohne zweiten Klick.
- Keine synthetische Klickauslösung, keine Wiederholungs- oder Timeout-
  Lockerung. Bestehende Rückweg-, Geometrie- und Schreibschutztests erhalten.
- Stabilitätslauf und betroffene Gesamtprüfung noch offen.
- Kein Commit/Push.

### UI01-03 — Detail-Rückweg und weitere Pokédex-Gestaltungsabnahme

- Betroffener Lauf ZHGIzx: Nutzer meldet 78 bestandene Prüfungen.
- Eingabe-/Rückwegstabilisierung technisch geprüft; sichtbarer Pokédex
  vom Nutzer noch nicht abschließend abgenommen.
- Neue Reviewpunkte: Überschrift positionsgleich, Pokémonbilder in
  Kacheln zentriert, Gehäusefarben/Umrandung wie Pokédex-Zentrale.
- Detailziel: links Pokémon, Name und Typ; rechts verfügbare
  Artinformationen in aufgeklappter Pokédex-Darstellung.
- Falschen Detail-Rückweg korrigiert:
  Detail -> bisheriges Raster; Raster -> Zentrale.
- Rasterseite und Sammelfilter bleiben bei Detail-Rückkehr erhalten;
  keine neuen Entdeckungs- oder Sammlungsnachweise.
- Bestehende Eingabestabilisierung und Gateprüfungen unverändert.
- Node- und Browserregression für hierarchischen Rückweg ergänzt.
- Optischer Raster-/Detailumbau einschließlich sichtbarer Bildzentrierung
  und gemeinsamer Kopfzeile weiterhin offen.
- Kein Commit/Push.

### UI01-03 — Pokédex-Gehäuse, zentrierte Bilder und geteilte Detailansicht

- Detail-Rückweg W6opf1: Nutzer meldet 14 bestandene Prüfungen.
- Neuer optischer Entwurf für den aus der Zentrale geöffneten Pokédex.
- DOM-Überschrift an derselben horizontalen/vertikalen Mitte wie die
  Zentrale; Beschriftung nur bei tatsächlicher Änderung aktualisieren.
- Rotes Gehäuse, dunkler Rahmen und hellblaue Displayfläche übernommen.
- Rastergeometrie und Klickflächen aus derselben Layoutfunktion abgeleitet.
- Bilder anhand ihrer sichtbaren Alpha-Pixel beschnitten und zentriert;
  gemeinsame Atlas-/Sprite-Ersatzwege, keine neuen Grafikdateien.
- Geteilte Detailansicht: links Bild/Name/Typ, rechts vorhandene
  Artinformationen und separat anwählbarer Beschreibungstext.
- Lange Beschreibungstexte innerhalb der rechten Hälfte seitenweise lesbar.
- Detail -> vorheriges Raster -> Zentrale bleibt erhalten.
- Keine neuen Entdeckungsnachweise, Eigenschaften oder Spielstandsänderungen.
- Bisheriger Wischweg bleibt zunächst unverändert als geschützter Vergleich.
- D3b-Referenzvergleiche erhalten; nur expliziten neuen Detail-Dispatch
  für den Vergleich normalisiert. Zusätzliche Layout-/Alpha-Tests.
- Browser prüft Titelmitte, tatsächliche Rahmen-/Displaypixel und Rückwege.
- Eingabe-/Gate-/DOM-Stabilitätstests weiterhin Bestandteil der Prüfung.
- Gezielte Prüfungen und sichtbare Gestaltungsabnahme offen.
- Kein Commit/Push.

### UI01-03 — echtes Doppeldisplay und Detail-Eintragsnavigation

- Gestaltungszwischenstand hcZtWw: Nutzer meldet 86 bestandene Prüfungen
  und positive Sichtprüfung.
- Nutzer hat Doppeldisplay-Konzept einschließlich Detailpfeilen,
  kleinerem Bild und Rückkehrregeln ausdrücklich freigegeben.
- Raster: je Display zwei Spalten und vier Reihen, insgesamt weiterhin
  16 Einträge; erste acht links, nächste acht rechts.
- Mittelsteg in Raster und Detailansicht; Filter auf dem gemeinsamen
  Gehäuse oberhalb, Seitensteuerung/Zähler gemeinsam unterhalb.
- Detailbildfläche auf 85 Prozent reduziert und mittig gehalten.
- Detailpfeile folgen der aktuellen Such-/Filterliste, ohne Umlauf über
  Anfang/Ende; Ruf liegt bei Verfügbarkeit zwischen den Pfeilen.
- Beim Artwechsel Info-Tab aktivieren und laufenden Ruf beenden.
- Nach bewusstem Detailblättern über eine Rasterseitengrenze führt
  Zurück auf die Rasterseite des zuletzt betrachteten Eintrags.
- Ohne Detailblättern bleibt der bestehende Seite-/Filter-Rückweg erhalten.
- Inhalte von Info/Text bleiben für spätere gemeinsame Festlegung offen.
- Keine neuen Sammel-/Entdeckungsnachweise oder Änderungen am Spielstand.
- Bestehende Referenz-, Eingabe-, Gate- und Rückwegprüfungen erhalten;
  Displayzuordnung, Grenzen und gefilterte Eintragsnavigation ergänzt.
- Gezielter Browserlauf und sichtbare Abnahme dieses Entwurfs offen.
- Kein WASM-Neubau und kein Commit/Push.

### UI01-03 — Doppeldisplay als Standard, kleineres Bild und gestalteter Leerzustand

- Lauf AzYsg7: Nutzer meldet 92 bestandene Prüfungen und bestätigt,
  dass das Doppeldisplay-Design sehr gut gefällt.
- Doppeldisplay als neuer Gestaltungsstandard für weitere UI01-Seiten
  festgehalten; konkrete Inhaltsaufteilung jeweils passend abstimmen.
- Detailbild war weiterhin zu groß: Fläche von 85 auf 65 Prozent
  des vorgesehenen Bildbereichs reduziert; Zentrierung erhalten.
- Mittiger Keine-Treffer-Text über dem Mittelsteg entfernt.
- Leerzustand innerhalb der getrennten Displays:
  links neutrales Motiv und Keine Einträge, rechts kontextbezogener Hinweis.
- Eigene Hinweise für Gefangen, Aufgezogen und eingeschränkte Suche;
  deutsch/englisch/spanisch/französisch.
- Leertexte wortweise umbrochen und auf ihre jeweilige Displayfläche begrenzt.
- Filter/Suche bleiben unverändert; Seitenpfeile bei nur einer Seite
  optisch deaktiviert, keine neue Leerzustandsaktion oder Datenänderung.
- Rechte Info-/Textinhalte bleiben wie vom Nutzer gewünscht später festzulegen.
- Bestehende Zentrierungs-, Eingabe-, Navigations- und Referenzprüfungen
  erhalten; neue Leerzustandsprüfung bei drei Breiten ergänzt.
- Gezielter Lauf und visuelle Rückmeldung zu diesen Korrekturen offen.
- Kein Commit/Push.

### UI01-03 — identische Display- und Pfeilgeometrie in Raster und Detail

- Nutzer bemängelt inkonsistente Grundgeometrie trotz gleicher Farben:
  Detaildisplays größer und Detailpfeile an anderen Positionen als im Raster.
- Gemeinsame Geometrie ausdrücklich vom Nutzer bestätigt.
- Ansichtsspezifische Displayhöhe entfernt:
  Raster und Detail verwenden identische Displaypositionen und Außenmaße.
- Oberer roter Bereich in der Detailansicht entspricht dem Filterbereich
  des Rasters und bleibt zunächst frei.
- Detail-Eintragspfeile verwenden exakt dieselben Rechtecke wie die
  äußeren Raster-Seitenpfeile.
- Ruf ist wieder eine separate Aktion innerhalb der linken Displayhälfte.
- Keine zusätzlichen Inhalts-, Farb- oder Bildskalierungsänderungen.
- Node-Prüfung vergleicht die vollständige Geometrie nach tatsächlichem
  Wechsel des Ansichtsstatus bei drei Breiten.
- Browser prüft gleiche Displays/Pfeilrechtecke sowie rote Bildpunkte
  oberhalb und unterhalb der Detaildisplays und beide Eintragspfeile.
- Vorherige optionale Bildgrößen-/Leerzustandskorrektur wird durch diesen
  Schritt weder vorausgesetzt noch rückgängig gemacht.
- Prüfungen und Sichtabnahme dieser Geometriekorrektur noch offen.
- Kein Commit/Push.

### UI01-04 — Hauptseite der Zentrale an gemeinsame Pokédex-Referenz angleichen

- Nutzer bestätigt die gemeinsame Raster-/Detailgeometrie ausdrücklich;
  Lauf niw4dc mit 104 bestandenen Prüfungen gemeldet.
- Aktuelle Pokédex-Gestaltung ist verbindlicher Standard für die weiteren
  Pokédex-Seiten einschließlich der Hauptseite der Zentrale.
- Nächster Teilschritt: Gehäuse, Displayflächen, Rahmen und Mittelsteg
  der Zentrale an die abgenommene Raster-/Detailreferenz angleichen.
- Gemeinsame Maße/Farben zusammenführen, keine weitere unabhängige
  Gestaltungsvariante anhängen.
- Reihenfolge der sechs bestehenden Zugänge zunächst erhalten;
  endgültige Anordnung nach Einbau aller vorgesehenen Menüs abstimmen.
- Neue-Geschichten-Hinweis einschließlich Lesebestätigung, Zähler,
  vollständiger Sichtbarkeit und Bedienbarkeit erhalten.
- Leeren Hinweiszustand und sichtbaren Hinweis bei schmalen Ansichten
  vor Umsetzung der endgültigen Rahmengeometrie berücksichtigen.
- Offener Merkpunkt für den UI01-Abschluss:
  Pokédex-Zentralen-Icon auch im Ruhemodus verfügbar machen, ohne
  Aufwecken/Pflegeaktion und ohne andere Schutzsperren aufzuheben.
- Keine neue Funktions- oder Veröffentlichungsfreigabe behauptet.
- Implementierung und gezielte Prüfung dieses Teilschritts offen.
- Kein Commit/Push.

### UI01-04 — gemeinsamer Rahmen und feste Hinweis-/Filterleiste

- Nutzer hat gemeinsame obere Leiste und Displaybeginn bei 112 Pixeln
  für Zentrale, Raster und Detail ausdrücklich freigegeben.
- Geschichtenhinweis sitzt als einzelner eingerückter Button dort,
  wo das Raster seine drei Filter hat; Höhe weiterhin 44 Pixel.
- Gemeinsames Modell für Farben, Rahmen, Displayabstände und Mittelsteg
  eingeführt; Canvas und CSS-Zentrale beziehen daraus ihre Werte.
- Zwei echte Displayrahmen ersetzen die bisherige Farbverlaufsfläche.
- Reihenfolge und Funktionen der sechs Zentralenzugänge unverändert.
- Kompakte Menüabstände erhalten drei mindestens 44 Pixel hohe
  Buttonreihen auch bei 320 Pixel Ansichtsbreite.
- Speicherfehler im Hinweis als kurze Wiederholungsaufforderung,
  vollständige Meldung weiterhin zugänglich; kein Zusatzabsatz über Displays.
- Gemeinsame Geometrie wird ohne Hinweis, mit Hinweis, nach Speicherfehler
  und nach erfolgreicher Lesebestätigung geprüft.
- Keine Änderungen an Aufnahme-/Freischalt-/Speicherregeln.
- Ruhemodus-Zugang bleibt separat vorgemerkt und wird hier nicht mitgeändert.
- Gezielte Prüfungen und RevisionBrowser-Abnahme dieses Rahmens offen.
- Kein WASM-Neubau und kein Commit/Push.

### UI01-04 abgenommen — UI01-05 Geschichtenübersicht vorbereiten

- Nutzer meldet Lauf iylc4l mit 116 bestandenen Prüfungen und bestätigt
  die gemeinsame Darstellung ausdrücklich als richtig und abgenommen.
- Zentralen-Hauptseite und gemeinsamer Rahmen damit lokal abgenommen.
- Nächster Teilschritt UI01-05: Geschichtenübersicht an denselben
  Gehäuse-/Display-/Mittelsteg-Standard anbinden.
- Direkte vorhandene Geschichtenzugänge, Status, rote Punkte und
  deaktivierte abgeschlossene Geschichten erhalten.
- Gesperrte Geschichten bleiben vollständig verborgen.
- Leerzustand innerhalb einer Displayhälfte, nicht über dem Mittelsteg.
- Keine neuen Vorschauseiten, Freischaltregeln oder Fortschrittsänderungen.
- Einzelne Abenteuer und Minispiele sind nicht Teil dieses Teilschritts.
- Aktuelle Darstellung und betroffene Tests vor Implementierung lesen.
- Ruhemodus-Zugang zur Zentrale bleibt für den UI01-Abschluss vorgemerkt.
- Gesamtes UI01 weiterhin offen; kein Commit/Push.

### UI01-05 freigegeben — Auswahl links, Einstieg und Start rechts

- Nutzer gibt die vorgeschlagene Auswahl-/Einstiegsansicht ausdrücklich frei.
- Diese Freigabe ersetzt die vorherige UI01-05-Vorgabe direkt startender
  Kacheln ohne Vorschauseite.
- Linkes Display: Schauplatzicon, Ortsbezeichnung, offene rote Punkte
  und eindeutige Auswahlmarkierung.
- Rechtes Display: kurzer eigener Einstiegstext und Startbutton.
- Auswahl allein startet keine Geschichte, bestätigt keinen Fortschritt
  und entfernt keinen offenen roten Punkt.
- Startbutton öffnet den bestehenden Geschichteneinstieg, ohne vorhandene
  Szenen oder Entscheidungen zu überspringen.
- Gesperrte Geschichten bleiben verborgen; abgeschlossene Geschichten
  bleiben sichtbar und deaktiviert.
- Falls erforderlich durch die linke Liste blättern, statt die Einträge
  unter die vorgesehene Mindestgröße zusammenzudrücken.
- Fünf vorgeschlagene Schauplatz-Teaser sind Arbeitsentwürfe.
- Teaser vor Einbau mit den vorhandenen Anfängen abgleichen; keine
  Pokémon-Enthüllung, kein vorweggenommener Ausgang.
- Texte, Icons und fertige Darstellung werden gemeinsam abgenommen.
- Bestehende Abenteuer, Aufnahmewege und Speicherregeln unverändert.
- Kein Commit/Push; gesamte UI01-Abnahme weiterhin offen.

### UI01-05 — Auswahl- und Einstiegsansicht umgesetzt

- Geschichtenübersicht verwendet die freigegebene gemeinsame Geometrie,
  Farben, Displayrahmen, Lichtkante und Kopfzeilenbehandlung.
- Obere Leistenposition ebenfalls in gemeinsames Modell aufgenommen.
- Linke Auswahl mit eigenen kleinen SVG-Schauplatzicons und Auswahlmarkierung.
- Drei Einträge pro Seite; weitere vorhandene Einträge über obere Leiste.
- Verborgene Listenseiten sind keine gesperrten Geschichten:
  gesperrte Geschichten werden weiterhin überhaupt nicht gerendert.
- Rechte Vorschau mit kurzem eigenem Teaser und Start-/Fortsetzen-Button.
- Schauplatzname Eishöhle beibehalten; Teaser auf Schneewirbel, Feder,
  unsichtbare Barriere und Spur im Laub abgestimmt.
- Neue Texte auf Englisch, Deutsch, Spanisch und Französisch.
- Auswahl, Blättern und Rückkehr erhalten eine nachvollziehbare Markierung.
- Auswahl/Blättern ersetzen keine Szenen und bestätigen keinen Fortschritt.
- Start validiert den aktuellen Zugang erneut und öffnet vorhandene Route.
- Bestehende Browser-Startwege an neue bewusste Startaktion angepasst.
- Beide Startstellen in stories-overview.spec.js im Kontext geprüft:
  Hinweis-/Rückkehrtest sowie fortgesetzter Fortschritt ohne Orden.
- Native Freischaltmatrix prüft auch Erreichbarkeit aller Listenseiten.
- Neue Prüfungen für Geometrie, Mindestgrößen, Überlauf, schreibfreie
  Auswahl, rote Punkte, Start und Wiederkehr zur Auswahl.
- Vorhandene Abenteuer, Minispiele, Core und Speicherregeln unverändert.
- Gezielte Prüfungen sowie gemeinsame Text-/Darstellungsabnahme offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-05 — erhaltene Auswahl und Katalogtest korrigiert

- Erster Umsetzungslauf hat Dateien geschrieben und die Menü-/Rahmen-
  sowie zahlreiche P06-Verträge bestanden.
- Anschließend Stopp im neuen Katalogtest: zwei sichtbare Einträge
  statt der dort vorausgesetzten drei.
- Ursache: vorhandene Auswahl wurde aus vorherigen Prüfungen erhalten
  und stellte korrekt die zweite Listenseite wieder her.
- Test prüft zunächst die sichtbare wiederhergestellte Auswahl und
  blättert anschließend über den echten UI-Callback auf die erste Seite.
- Erwartung von drei Einträgen auf Seite eins bleibt unverändert.
- Randfall korrigiert: Entfällt die ausgewählte Geschichte beim erneuten
  Zugangscheck, folgt die Listenseite der gültigen Ersatzauswahl.
- Zusätzliche Prüfung für sichtbare und markierte Ersatzauswahl.
- Keine Änderung an Freischaltungen, Speicherregeln oder Abenteuern.
- Browserprüfungen und gemeinsame Darstellungsabnahme weiterhin offen.

### UI01-05 abgenommen — UI01-06 Tagebuch vorbereiten

- Nutzer meldet Lauf eveWQO mit 216 bestandenen Prüfungen.
- Nutzer bestätigt Geschichtenübersicht und Einstiegstexte ausdrücklich
  als gut und gibt den nächsten Schritt frei.
- UI01-05 damit lokal funktional und visuell abgenommen.
- Nächster Teilschritt UI01-06: Tagebuch an gemeinsamen Rahmen anbinden.
- Vor Implementierung bestehende Eintragsarten, Gruppierungen,
  Lesemarkierungen, Aktualisierung und Tests lesen.
- Aufteilung von Auswahl und Inhalt sowie passende Filtericons auf
  Grundlage der vorhandenen Tagebuchdaten ausarbeiten.
- Bestehende Tagebuchtexte und Funktionen erhalten.
- Keine neuen Ereignisarten oder Speicherregeln nebenbei ergänzen.
- Abgenommene Geschichtenübersicht und bestehende Abenteuer unverändert.
- Ruhemodus-Zugang zur Zentrale bleibt für den UI01-Abschluss vorgemerkt.
- Gesamtes UI01 weiterhin offen; kein Commit/Push.

### UI01-06 freigegeben — Tagebuch mit Auswahl, Detail und Filtern

- Nutzer gibt den Tagebuchumbau ausdrücklich frei.
- Gemeinsamer abgenommener Pokédex-Rahmen, gleiche Displaypositionen,
  Kopfzeile, Zurück-Geometrie, Farben und Mittelsteg.
- Links drei Einträge pro Listenseite mit Ereignisicon, kurzer
  Bezeichnung, bestehendem Neu-Punkt und Auswahlmarkierung.
- Neueste Einträge zuerst; bestehende Zusammenfassung gleichartiger
  Expeditionsfunde erhalten.
- Rechts Datum, Uhrzeit und vollständiger vorhandener Ereignistext.
- Bei langen Texten eigene Textseitennavigation im rechten Display,
  keine Verkleinerung der Schrift zum Hineinpressen.
- Obere gemeinsame Leiste: Listennavigation und Filterauswahl.
- Sechs Filter: Alle, Pokémon, Level, Erfolge, Expedition und Mega.
- Pokémon: Typen 1, 2, 3, 4, 5, 11.
- Level: Typ 8; Erfolge: Typen 6, 9, 10.
- Expedition: Typ 7; Mega: Typen 12, 13, 14.
- Keine künstliche Siegkategorie und keine neuen Ereignistypen.
- Bestehende Leseregel ausdrücklich beibehalten: beim Öffnen den
  damaligen Eintragsstand bestätigen; Neu-Punkte dieses Besuchs erhalten.
- Auswahl, Filter und Blättern lösen keine zusätzlichen Speicheraktionen aus.
- Fehlerbehandlung und Schutz vor fehlgeschlagener Lesebestätigung erhalten.
- Bestehende Texte, Ereignisse und Speicherregeln unverändert.
- UI01-05-Geschichtenübersicht bleibt abgenommen und unverändert.
- Zuständige bestehende Browser-/DOM-Tests vor Implementierung abgleichen.
- Danach vollständiger kopierbarer Umsetzungsblock; keine Teilaustausche.
- Funktionale Prüfungen und gemeinsame Darstellungsabnahme offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-06 — Tagebuch mit Auswahl, Detail und Filtern umgesetzt

- Tagebuch verwendet gemeinsamen abgenommenen Rahmen und Displaygeometrie.
- Linke Auswahl mit drei Einträgen pro Seite, Ereignisicons und Markierung.
- Rechte Ansicht mit Datum/Uhrzeit und vollständig paginiertem Originaltext.
- Sechs freigegebene Filter und eigene Filterauswahl im gemeinsamen Rahmen.
- Bestehende Ereignistexte und Expeditionsgruppierung erhalten.
- Alle Artikel bleiben im DOM prüfbar; nur passende drei Einträge sind sichtbar.
- Tagesüberschriften bleiben als zugängliche Metadaten erhalten;
  Datum und Uhrzeit erscheinen zusätzlich im rechten Display.
- Bestehende Lesebestätigung und ihre Transaktion unverändert.
- Besuchsbezogene Neu-Grenze verhindert, dass Filter oder Darstellung
  die roten Punkte nach bestätigtem Lesen desselben Besuchs verlieren.
- Speicherfehler im rechten Display, bei Bedarf vollständig textpaginiert.
- Veraltete Timer und Resize-Beobachter werden beim Seitenwechsel abgegrenzt.
- Bestehenden Scrolltest durch vollständiges Erreichen aller 120 Einträge
  über die Seitennavigation inklusive Neuladen ersetzt.
- Bestehende Sicherungs- und Ungelesen-Tests bleiben erhalten.
- Neue reale Browserprüfung für Rahmen, Bediengrößen und schreibfreie Bedienung.
- Zusätzliche Filter-/Langtextprüfung verwendet ausdrücklich synthetische
  Darstellungsdaten; keine native Ereigniserzeugung damit behauptet.
- Gemeinsame Text-/Darstellungsabnahme und gezielte Prüfungen offen.
- Abgenommene Geschichten und Core-/Speicherregeln unverändert.
- Kein WASM-Neubau, Commit oder Push.

### UI01-06 Revision — Gestaltung nicht abgenommen, Testspielstand erforderlich

- Nutzer lehnt den aktuellen Tagebuchentwurf ausdrücklich noch ab.
- Filterbutton und Pfeile wirken nicht ausreichend in die Grafik integriert.
- Rechte Eintragsansicht neu gliedern: Ereignisbezeichnung/Icon,
  nachgeordnetes Datum/Uhrzeit und zusammenhängender Ereignistext.
- Rechte Textnavigation nur anzeigen, wenn der Text mehrere Seiten benötigt;
  dann eindeutig als Textnavigation kennzeichnen.
- Gemeinsame freigegebene Rahmengeometrie erhalten.
- Lauf lmQ5JE fehlgeschlagen: 5 Tests fehlgeschlagen, 32 bestanden,
  2 unterbrochen, 197 nicht ausgeführt; zusätzlich Fehler außerhalb eines Tests.
- Keine vollständige Regression oder Abnahme behaupten.
- CSS-Konflikt zwischen Artikelanzeige und hidden-Regel korrigieren.
- Erreichbarkeit aller 120 Einträge und Größenfehler gezielt untersuchen;
  Erwartungen nicht auf drei Einträge oder kleinere Bedienziele abschwächen.
- Separaten gekennzeichneten Review-Spielstand mit mehreren synthetischen
  Tagebucheinträgen für alle sechs Kategorien vorbereiten.
- Kurze/lange Texte, mehrere Tage, Neu-Markierungen und zusammengefasste
  Expeditionsfunde abdecken.
- Echter importierbarer Spielstand für bestehenden RevisionBrowser;
  kein bloßer JavaScript-Austausch und kein Überschreiben des normalen Saves.
- Keine tatsächlich erspielten Siege/Freischaltungen/Aufnahmen behaupten.
- Zuerst vorhandenen Spielstandgenerator und Review-Anschlüsse lesen.
- Danach vollständiger Korrektur-/Vorbereitungsblock ohne Teilaustausche.
- UI01-06 weiterhin offen; UI01-04 und UI01-05 bleiben abgenommen.
- Kein Commit/Push.

### UI01-06 Revision 2 — integrierte Bedienung und Tagebuch-Teststand

- Globaler Reportfehler als automatischer Abbruch nach fünf Fehlschlägen
  identifiziert; kein zusätzlicher Anwendungsfehler daraus abgeleitet.
- Spezifischen hidden-Konflikt für Tagebuchartikel behoben.
- Tagebuchaktionen während Lesebestätigung tatsächlich deaktiviert;
  vorherige Zustände und Navigationsgrenzen anschließend wiederhergestellt.
- Filter als eindeutiger Symbolbutton im linken Kopfzeilenplatz.
- Listennavigation mit lokalen SVG-Pfeilen und ruhiger Filter-/Seitenanzeige.
- Rechte Ansicht mit Ereignisüberschrift/Icon, nachgeordnetem Datum
  und leichter gesetztem zusammenhängendem Text.
- Textnavigation nur bei tatsächlichem Mehrseitenbedarf und mit Textkennzeichnung.
- Größenprüfung bleibt streng und liefert bei Fehlern konkrete Elemente/Maße.
- Langtextprüfung akzeptiert eine einzelne Seite nur bei vollständigem Text
  und ausgeblendeter Navigation; keine Inhalte oder Erwartungen entfernt.
- Separater synthetischer Tagebuch-Spielstand wird über vorhandenen
  Fixturegenerator und bestätigte Journal-Transportfelder vorbereitet.
- RevisionBrowser-Anschluss wird vor automatischer Einbindung vollständig gelesen.
- Noch keine visuelle Abnahme und kein vollständiger Regressionserfolg.
- Kein WASM-Neubau, Commit oder Push.

### UI01-06 — eigenes Tagebuchprofil im bestehenden RevisionBrowser

- Lauf VU8kul: Nutzer meldet 90 bestandene gezielte Browserprüfungen.
- Kein vollständiger Regressionserfolg und keine manuelle Tagebuchabnahme
  daraus abgeleitet.
- Vorbereiteter importierbarer Grundstand: 24 synthetische Einträge,
  sieben neue Einträge, alle 14 Ereignistypen; Decoder/Parser bestanden.
- Vorhandenen RevisionBrowser um ausdrücklich erlaubtes journal-Profil erweitert.
- Bestehende Profilprüfung mit acht Namen und bisherige Storyprofile erhalten.
- Acht Tagebuchfälle für gemischten Bestand, gelesene Einträge,
  kurzen/längeren Text, Expeditionsgruppen, leeren Bestand und 120/200 Einträge.
- Vor manuellem Start tatsächlichen Import, native Eintragszahlen,
  Ungelesen-Zustand, Rahmen und Erreichbarkeit aller Gruppen prüfen.
- Bestehender persistenter Reviewbrowser, Test-Badge und Bedienkürzel erhalten.
- Kein anderer Browser, keine Änderung am normalen Nutzer-Spielstand.
- Gesamte UI01-06-Darstellungsabnahme und vollständige Regression weiterhin offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-06 Revision 3 — direkte Filter und Ereigniskarten

- Nutzer gibt die neue Ereigniskarten-Gestaltung ausdrücklich als nächsten
  gemeinsamen Prototyp frei; bisherige Tagebuchgestaltung bleibt nicht abgenommen.
- Alle sechs Filtericons einzeln und direkt oberhalb der Displays.
- Filter-Auswahlfenster und zusätzlicher Filterbutton vollständig entfernt.
- Einzige Navigation: vorheriger/nächster Eintrag unten im roten Gehäuse.
- Sichtbare Navigationsflächen entsprechen den Pokédex-Pfeilpositionen;
  größere transparente Bedienflächen bleiben innerhalb des Gehäuses.
- Linke Liste folgt der Eintragsauswahl automatisch in Dreiergruppen.
- Bei höchstens einem passenden Eintrag keine Pfeile und kein Navigationszähler.
- Rechte Ereigniskarte mit Schauplatz-/Kategorieicon, Akzentfläche,
  Ereignisüberschrift, vorhandenen Werten und nachgeordnetem Datum.
- Vollständiger unveränderter Ereignistext innerhalb der Karte.
- Nur der Textbereich darf bei tatsächlichem Überlauf vertikal scrollen.
- Keine eigene Textseitennavigation und keine zerstückelten Sätze mehr.
- Auf schmalen Ansichten entfällt die separate doppelte Akteurszeile;
  Akteur bleibt im unveränderten Ereignistext enthalten.
- Bestehende Lesebestätigung und visitbezogene Neu-Markierungen erhalten.
- Tests auf direkte Filter, vollständige Eintragsnavigation, Pfeilpositionen,
  vollständigen Text und begrenzten inneren Scrollbereich angepasst.
- Vorhandene acht Review-Spielstände bleiben unverändert.
- Gezielte Tests und erneute manuelle Darstellungsabnahme offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-06 abgenommen — UI01-07 Eierübersicht vorbereiten

- Nutzer bestätigt die überarbeitete Tagebuchgestaltung ausdrücklich:
  direkte Filtericons gut, untere Pfeile besser, kurze Texte passen gut.
- Nutzer gibt die aktuelle Darstellung frei und möchte damit weiterarbeiten.
- Lauf RN45uW: 106 gezielte Prüfungen bestanden.
- UI01-06 damit lokal abgenommen; kein vollständiger Regressionserfolg
  aus diesem gezielten Lauf abgeleitet.
- Abgenommene Tagebuchdarstellung in dieser Form erhalten.
- Nächster Teilschritt UI01-07: Eierübersicht im gemeinsamen Pokédex-Standard.
- Vor Implementierung tatsächlichen Eier-Renderer und Tests lesen.
- Bestehende Funktionen, Informationsgrenzen und Ei-Spoilerschutz erhalten.
- Keine neuen Zuchtregeln, Freischaltungen oder Speicheränderungen.
- Danach Entwicklung bearbeiten und Sammlung gegen gemeinsamen Standard abgleichen.
- Ruhemodus-Zugang zur Zentrale bleibt für den UI01-Abschluss vorgemerkt.
- Gesamte UI01-Abnahme und vollständige Regression weiterhin offen.
- Kein Commit/Push.

### UI01-07 — Ei-Planung mit typgefärbtem Wunsch-Ei umgesetzt

- Nutzer gibt Planungsansicht frei und wünscht typgefärbtes Ei-Symbol.
- Anschlussstellen anhand tatsächlicher Datei ohne Einrückungsannahme erkannt.
- Gemeinsamer Rahmen mit drei Einstellungen links und Ei-Karte rechts.
- Obere Aktionen: Speichern, Zufall und Information.
- Neutrales lokales SVG-Ei wird nach Typwunsch eingefärbt.
- Farbe ausdrücklich nur Wunschdarstellung, keine Vorhersage des Ei-Inhalts.
- Vorhandenes Ei zeigt ausschließlich gespeicherte berücksichtigte Wünsche;
  keine zusätzlichen Abfragen geheimer Ei- oder Artdaten.
- Bei vorhandenem Ei passende Metadaten schreibgeschützt darstellen.
- Entwurf und gespeicherte Auswahl sichtbar unterscheiden.
- Ausführliche bestehende Gewichtungs-/Grenzhinweise vollständig erhalten.
- Ursprüngliche storePlan-Funktion unverändert aus Quellstand übernommen.
- Rücknahme bei Schreibfehlern, Speichergate, Neuladen und Rückkehrpfad erhalten.
- Bestehender Modaltest unterscheidet ausdrücklich roten Ei-Rahmen und
  unveränderte übrige Dialoge; Hintergrundprüfung nicht entfernt.
- Neue DOM-Double-Tests für Vorschau, verwendeten Typwunsch,
  verbotene Zusatzabfragen sowie bisherigen Speicher-/Rollbackweg.
- Neue Browserprüfung für Rahmen, Größen, Farbe und unveränderten Plan
  während der Vorschau; vorhandener echter Speichern-/Neuladentest bleibt.
- Funktionale Prüfungen und gemeinsame Darstellungsabnahme offen.
- Tagebuch und Geschichten unverändert.
- Kein WASM-Neubau, Commit oder Push.

### UI01-07 Revision 2 — interne Auswahl und großes Wunsch-Ei

- Nutzer lehnt den ersten Eierentwurf noch ab und fordert interne Auswahl.
- Beiger Kopfbereich ausdrücklich transparent, normale Zurück-Geometrie erhalten.
- Aktionen oben auf reine Icons reduziert; zugängliche Namen erhalten.
- Links zwei optisch kompaktere Felder mit weiterhin mindestens 44px Bedienfläche.
- Generationen rechts als Gen-Buttons, Typen rechts als farbige eigene SVG-Symbole.
- Keine nativen Selects/Checkboxen mehr; gemeldete 24px-/42px-Bedienelemente entfernt.
- Auswahl mit höchstens sechs Zielen pro Seite; nötige Pfeile unten im Gehäuse.
- Größeres typgefärbtes Wunsch-Ei; Entwurf-Stempel entfernt.
- Ungespeicherte Auswahl bei Bedarf als Status, nicht als dekorativer Kartenstempel.
- Farbe weiter ausschließlich Typwunsch, niemals versteckter Ei-Inhalt.
- Unraised-Schalter aus Hauptansicht entfernt; vorhandener Wert bei
  Generation-/Typänderungen unverändert weitergegeben.
- Keine stillschweigende Aktivierung einer zusätzlichen Gewichtung.
- Bestehendes Zufall-Zurücksetzen und ursprüngliche storePlan-Funktion erhalten.
- Infoansicht auf kurze verständliche Aussagen reduziert; Spielmechanik unverändert.
- Gemeldeter Kopfzeilentest war unterbrochen, nicht als fertiger Fehlerbefund gewertet.
- Neue Tests für interne Auswahl, alle Auswahlseiten, Icons und Vorschau ohne Schreiben.
- 44px-Anforderungen bleiben bestehen; keine Absenkung zum Kaschieren der Fehler.
- Gezielte Prüfungen und erneute manuelle Abnahme offen.
- Tagebuch und Geschichten unverändert; kein WASM-Neubau, Commit oder Push.

### UI01-07 — gerichtete Typnavigation und sichtbare Typfarben

- Nutzer bewertet interne Auswahl als besser, wünscht weitere visuelle Überarbeitung.
- Forschung: 18 reguläre Typen nicht durch erfundene Haupttypen ersetzen.
- UI-Kurzliste mit vollständiger Erweiterung als Vorschlag, noch nicht umgesetzt.
- Generationen-Plaketten und bildhafte Info als nächste Gestaltungsvorschläge.
- Pfeile sollen ausdrücklich der tatsächlichen Pokédex-Referenz entsprechen.
- Aktueller Fehler für Typ 0 als Richtungsfehler des Testhelfers erkannt:
  vorletzte/letzte Seite wurden abwechselnd angesteuert.
- Testhelfer navigiert jetzt gezielt zur Seite des gewünschten Typs.
- Prüfung der tatsächlich gerenderten Kachelfarbe ergänzt.
- Typfarbe als wichtige Inline-Deklaration gegen allgemeine Buttonregeln abgesichert.
- Unerwünschte sichtbare Beschriftung Farbe = Typwunsch entfernt.
- Ei-Farbgebung bleibt ausschließlich Wunschdarstellung.
- Speicherfunktion, verfügbare Typen und Gewichtung unverändert.
- UI01-07 weiter offen; keine vollständige Abnahme oder Regression behauptet.
- Kein WASM-Neubau, Commit oder Push.

### UI01-07 Freigabe — alle Typen, Plaketten und bildhafte Info

- Nutzer bestätigt: alle 18 regulären Typen bleiben verfügbar.
- Vorgeschlagene Kurzliste ausdrücklich vorerst nicht umsetzen.
- Typkacheln übernehmen sichtbar ihre jeweilige Typfarbe.
- Nummerierte Pokédex-Plaketten für Generationen freigegeben.
- Bildhafte Info mit Wunsch-/Zufallsdarstellung freigegeben.
- Wunsch-Ei-Farbe erhalten; zusätzliche Farberklärung darunter entfernen.
- Pfeile anhand tatsächlicher abgenommener Pokédex-Zeichenroutine angleichen.
- Historische Recherche: 15 Typen in Generation 1;
  Unlicht/Stahl ab Generation 2, Fee ab Generation 6.
- Keine automatische historische Typbeschränkung bei Generation-1-Wunsch:
  heutige Typzuordnungen und vorhandene Gewichtungsregeln bleiben erhalten.
- Keine Änderung an Speicherfunktion, Ei-Inhalt oder Gewichtung.
- UI01-07 weiterhin nicht abgenommen.
- Kein Commit/Push.

### UI01-07 Revision 3 — Plaketten, Bildkarten und Referenzpfeile

- Alle 18 regulären Typen plus Alle bleiben unverändert erreichbar.
- Keine Kurzliste und kein Mehr-Zwischenschritt eingeführt.
- Typkacheln ausdrücklich typgefärbt; bisherige Wunsch-Ei-Farben erhalten.
- Generationen als kleine nummerierte Pokédex-Plaketten dargestellt.
- Info als zwei Bildkarten Du wünschst / Der Zufall entscheidet.
- Vorhandenes Ei erhält passende Schon-festgelegt-Variante.
- Keine zusätzliche sichtbare Farbbeschriftung unter dem Wunsch-Ei.
- Pfeile verwenden tatsächliche Pokédex-Zeichen < und >,
  Normal-/Sperrfarben sowie aus hubDexBox gelesene Rahmenwerte.
- Zeichnungshelfer nur isoliert mit Canvas-Doubles gelesen;
  Spielcanvas und Spielkern dabei nicht verändert.
- Typ-Testhelfer navigiert zielgerichtet; alle 19 Auswahlwerte
  einschließlich Alle und Rückwegen von Typ 18 werden geprüft.
- Keine Änderung an Gewichtung, verborgenem Ei-Inhalt oder Speicherfunktion.
- Funktionale Prüfungen und gemeinsame Darstellungsabnahme weiterhin offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-07 Revision 4 — Auswahlraster, Fokus und Referenzdarstellung

- Nutzer bestätigt Farben/Typicons und wünscht weitere gezielte Anpassungen.
- Linke Infografik: Generations- und Typicon zusammen zentriert,
  kontrastreiche kleine Symbolflächen; Text Du wählst.
- Rechte Infokarte unverändert.
- Generationenfolge: Seite 1 mit 1–6, Seite 2 mit 7, 8, 9, Alle.
- Typen ohne Zufallskachel; kein Typwunsch bleibt bestehender Wert 0.
- Erneutes Antippen des ausgewählten Typs hebt diesen Wunsch auf.
- Keine automatische Änderung gespeicherter Wünsche.
- 3x3-Raster mit zwei Seiten bei ausreichender Innenbreite.
- Bei 320 Pixel Ansichtsbreite 2x3-Fallback, damit 44px-Bedienflächen
  nicht verkleinert werden; dort drei Seiten für 18 Typen.
- Raster reagiert auch auf Breitenwechsel bei geöffneter Auswahl.
- Linke Felder übernehmen Flächen-/Rahmenstil der Zentralenbuttons.
- Pfeilflächen mit deutlich spezifischeren wichtigen Regeln abgesichert:
  Referenzzeichen, Rahmenwerte, Schriftgröße und Zustandsfarben.
- Gemeldeten WebKit-Escape-Fehler durch explizite Fokusführung und
  Tastaturbehandlung nur bei sichtbarem Eierdialog adressiert.
- Tests behalten Escape-Prüfung bei und prüfen tatsächlichen Fokus,
  Raster, Reihenfolge, Typabwahl und Pfeilgestaltung.
- Keine Änderung am Ei-Inhalt, Gewichtung oder Speicherablauf.
- UI01-07 weiter offen; kein Commit/Push.

### UI01-07 Revision 5 — neun Generationen und transparente Pfeilträger

- Nutzer meldet Lauf R6rPLN mit 76 bestandenen gezielten Prüfungen.
- Noch keine vollständige UI01-07-Abnahme daraus abgeleitet.
- Generationen zeigen 1–9 ohne Alle-Kachel.
- Bei ausreichender Breite 3x3 auf einer Seite, schmaler 2x3-Fallback erhalten.
- Beide Auswahlraster reagieren auf Breitenwechsel.
- Generation 0 bleibt über den vorhandenen mittleren Zufallsbutton erreichbar.
- Zufallsbutton setzt wie bisher Generation, Typ und zusätzliche Gewichtung
  über den vorhandenen Speicherweg zurück und lädt neu.
- Neue native Browserprüfung für Speichern eines Wunsches und anschließendes
  dauerhaftes Zurücksetzen, bei erhaltener aktiver Pokémonidentität.
- Äußere Pfeil-Buttonflächen ausdrücklich transparent, ohne Rahmen,
  Schatten oder dekorative Pseudoelemente.
- Kleine Referenz-Pfeilflächen und 44px-Bedienflächen bleiben erhalten.
- Fokusmarkierung für Tastaturbedienung bleibt sichtbar.
- Weitere gezielte Prüfungen und manuelle Abnahme offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-07 — abschließender gemeinsamer Typ-Kategorieicon

- Nutzer meldet den letzten Testlauf als passed und bestätigt,
  dass die übrige Eierdarstellung jetzt passt.
- Einzige verbleibende gewünschte Anpassung: Typ-Kategoriesymbol links
  an das bisherige Symbol der Infoansicht angleichen.
- Gemeinsame Symbolfunktion für Typbutton und Info eingeführt.
- Allgemeines Kategoriesymbol bleibt unabhängig vom gewählten Einzeltyp.
- Alle 18 individuellen Typicons, ihre Farben und die Ei-Farbgebung unverändert.
- DOM- und Browserprüfung auf identischen SVG-Inhalt ergänzt.
- Keine Änderungen an Auswahlwerten, Gewichtung oder Speicherablauf.
- Abschließende Icon-Sichtprüfung und UI01-07-Abnahme noch festzuhalten.
- Keine vollständige UI01-Regression oder Paketabnahme daraus abgeleitet.
- Kein WASM-Neubau, Commit oder Push.

### UI01-07 abgenommen — UI01-08 Entwicklung vorbereiten

- Nutzer bestätigt die Darstellung nach dem letzten Iconabgleich als sehr gut.
- Letzter gezielter Testlauf vom Nutzer als passed gemeldet.
- Abnahmebedingung Speichern/Zufall anhand vorhandener echter Browsertests erläutert:
  Auswahl Generation 2/Typ 5 speichern, Neuladen abwarten, native Werte prüfen;
  danach Zufall wiederherstellen, Neuladen abwarten und 0/0/0 prüfen.
- Aktive Pokémonidentität und Sammlungsanzahl bleiben dabei erhalten.
- Ursprünglicher Schreibabschluss vor Neuladen und getesteter Rollback erhalten.
- Kein Anspruch absoluter Fehlerfreiheit bei nicht verfügbarem Browserspeicher.
- UI01-07 damit lokal funktional und visuell abgenommen.
- Nächster Teilschritt UI01-08: Entwicklungsansicht an gemeinsamen Standard anbinden.
- Vor Implementierung tatsächlichen Entwicklungsrenderer und Tests lesen.
- Keine Änderung an Entwicklungsbedingungen, verfügbaren Zielen,
  Verbrauch von Gegenständen oder Speicherregeln.
- Abgenommene Eier-, Tagebuch- und Geschichtenansichten erhalten.
- Sammlung anschließend gegen gemeinsamen Standard abgleichen.
- Ruhemodus-Zugang zur Zentrale bleibt für UI01-Abschluss vorgemerkt.
- Gesamte UI01-Abnahme und vollständige Regression weiterhin offen.
- Kein Commit/Push.

### UI01-08 — Entwicklungsansicht im gemeinsamen Rahmen umgesetzt

- Nutzer gibt Pokémon-Karte links und Ziel-/Voraussetzungsansicht rechts frei.
- Gemeinsame abgenommene Rahmengeometrie und Referenz-Pfeilgestaltung verwendet.
- Aktuelles lokales Pokémonbild read-only darstellen; neutrale Ersatzgrafik
  bei fehlendem Bild, keine neuen Medien erforderlich.
- Einzelnes Ziel mit fünf vorhandenen nativen Bedingungsfreigaben.
- Pflegefehler-Hinweis bei Bedarf im begrenzten Bedingungsbereich erhalten.
- Zielwechsel unten; bei keinem/einem Ziel keine unnötigen Pfeile.
- Aktualisieren, bestehende automatische Zielwahl und Info oben erreichbar.
- Automatische Zielwahl verwendet unverändert tp-auto-evolve und bestehenden Getter.
- Originalen Bestätigungs-/tp_evo_choose-/saveNow-Aktionskörper übernommen.
- Keine Änderung an Bedingungen, Zielverbindungen oder Entwicklungsanimationen.
- Gemeinsamen Comfort-Dialog beim Öffnen anderer Ansichten zurücksetzen;
  Suche/Familienansicht nicht umgestaltet.
- DOM-Double-Prüfungen für Zielwechsel, Freigaben, Autoeinstellung,
  originalen Aktionsweg, Ablehnung und Endform ergänzt.
- Reale Browserprüfungen vergleichen Bedingungen mit nativen Feldern;
  bestehender Metang-zu-Metagross-Test bleibt echter Entwicklungsnachweis.
- Gezielte Tests und gemeinsame Darstellungsabnahme offen.
- Eier-, Tagebuch- und Geschichtenansichten bleiben abgenommen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-08 — Formatierungsprüfung vor Browserlauf korrigiert

- Entwicklungsansicht und Tests wurden geschrieben.
- Entwicklungs-, Menü-, Raster-, Canvas-, Eierplan- und Review-Verträge bestanden.
- git diff --check stoppte vor dem Browserlauf wegen Leerzeichen
  auf einer Leerzeile in comfort.js.
- Ausschließlich Leerzeichen auf leeren Zeilen dieser Datei entfernt.
- Kein funktionaler Code und keine Testanforderung verändert.
- Browserprüfungen werden anschließend erstmals für diesen Umbau ausgeführt.
- UI01-08 bleibt bis zu Tests und gemeinsamer Sichtprüfung offen.

### UI01-08 — Verzweigungssymbol und eindeutige Zielwahl

- Nutzer gibt Variante 1, Y-Verzweigung mit bestehender M-/A-Markierung, frei.
- Zufallssymbol ausschließlich für die Entwicklungsziel-Einstellung ersetzt.
- Geltungsbereich ausdrücklich Zielwahl im Hauptspiel genannt.
- Zustandsbeschriftungen Selbst wählen / Automatisch verständlicher gemacht.
- Info erklärt: In dieser Übersicht wird das ausgewählte Ziel bestätigt.
- Beide Infokarten verwenden feste gemeinsame Icon- und Überschriftenzeilen.
- Restliche freigegebene Darstellung unverändert.
- Auswertung bereitgestellter Projektquellen: 19 Arten mit mehreren
  unterschiedlichen Entwicklungszielen und 438 mit genau einem Ziel.
- Diese Quellstandauswertung nicht als neue Messung des aktuellen WASM ausgeben.
- Vorhandene automatische Zielwahl und ihre Präferenz für noch nicht
  aufgezogene zulässige Ziele nicht verändert.
- Keine selbsttätige Entwicklung eingeführt.
- Keine Änderung an Bedingungen, Bestätigung, tp_evo_choose oder Speicherung.
- Gezielte Prüfungen und abschließende Icon-/Info-Sichtprüfung offen.
- Gesamte UI01-Abnahme weiter offen; kein Commit/Push.

### UI01-08 abgenommen — Eier-Info ausrichten und Sammlung vorbereiten

- Nutzer meldet erfolgreichen Testlauf und bestätigt die Entwicklungsansicht
  vollständig als passend.
- UI01-08 damit lokal funktional und visuell abgenommen.
- Kleine nachträgliche Darstellungsangleichung in der Eier-Info:
  gleiche Illustrationszeilen und gleicher oberer Beginn der Überschriften.
- Unterschiedliche Textlängen verschieben Icons/Überschriften nicht mehr.
- Vorhandene Symbole, Texte, Auswahlwerte und Speicherfunktionen unverändert.
- Browserprüfung auf gleiche Illustrations-/Überschriftenpositionen ergänzt.
- Nächster Teilschritt UI01-09: vorhandene Sammlung gegen gemeinsamen
  Standard abgleichen, vor Änderungen Renderer und Tests lesen.
- Keine Sammlungs-, Team-, Freilass- oder Speicherregeln nebenbei ändern.
- Ruhemodus-Zugang zur Zentrale bleibt für den UI01-Abschluss vorgemerkt.
- Gesamtes UI01 und vollständige Regression weiterhin offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-09 freigegeben — Sammlung und Freilassansichten

- Nutzer gibt Sammlung mit Miniaturenraster links, Exemplar-Karte rechts
  und getrennter Verwaltungsansicht ausdrücklich frei.
- Zusätzlicher Wunsch: selten sichtbare Freilassansicht ebenfalls überarbeiten.
- Gelagertes Exemplar endgültig freilassen und Pflege-Endemenü am aktuellen
  Pokémon als unterschiedliche Abläufe behandeln.
- Vor Änderung zusätzliche Pflege-Ende-Oberfläche und Tests lesen.
- Keine stillschweigende Änderung von Behalten, Entfernen, Pflegeabschluss
  oder Erzeugung eines Folge-Eis.
- Endgültige Freilassbestätigung mit eindeutigem Exemplar:
  Name/Bild, Level, ID und Standort.
- Abbrechen-Fokus, ausdrückliche Bestätigung, Schutz des aktuellen
  Pflege-Pokémon und bestehende Speicher-/Rücknahmewege erhalten.
- Vorhandene Boxen, Plätze, Teamplanung und wartende Aufnahme erhalten.
- Alle Sammlungsänderungen weiterhin über TPCollection.apply.
- Seltene Freilassfälle im späteren Reviewbestand ausdrücklich abdecken.
- Eier-Info nach letzter Ausrichtung vom Nutzer bestätigt; Test passed.
- Bestehende abgenommene Ansichten unverändert.
- UI01-09 noch nicht umgesetzt oder abgenommen.
- Gesamtes UI01 und vollständige Regression weiterhin offen.
- Kein Commit/Push.

### UI01-09a — Pflege-Ende-Dialog im gemeinsamen Rahmen

- UI01-09 kontrolliert aufteilen: zuerst zusätzlicher Pflege-Ende-Dialog,
  danach Sammlungsübersicht mit ihrer eigenen Freilassbestätigung.
- Pflege-Ende-Dialog im gemeinsamen Gehäuse, aktuelles Exemplar links,
  drei bestehende Entscheidungen rechts.
- Name, Level und aktive Exemplar-ID sichtbar; vorhandene lokale Grafik
  read-only nutzen, neutrale Ersatzgrafik bei fehlendem Bild.
- Vollständige bisherige Erklärung und Release-Bonushinweis erhalten.
- Behalten, endgültiges Gehenlassen und Abbrechen klar unterscheiden.
- Bestehenden finish-Handler bytegleich erhalten.
- Native careEnd-Transaktion, Bestätigung, expectedLife und Rücknahme unverändert.
- Abbrechen behält den anfänglichen Fokus.
- Neue Browserprüfung für Dialoggeometrie, Größen, Bestätigungsabbruch
  und unverändertes Modell; vorhandene echte Behalten-/Rollbacktests bleiben.
- Sammlungsübersicht und gelagerte Freilassbestätigung noch nicht umgebaut.
- UI01-09 insgesamt weiter offen; keine Abnahme behauptet.
- Kein WASM-Neubau, Commit oder Push.

### UI01-09a — nativen Testläufer und verschachtelte DOM-Suche verwenden

- Erster Lauf stoppte nach bestandenem JS-Lebenszyklusvertrag:
  Wire-Test wurde ohne seinen nativen Testläufer aufgerufen.
- Korrekter Aufruf über tools/quality/test-f4-lifecycle.py;
  dieser erzeugt das Testprogramm und setzt TP_F4_LIFE_NATIVE selbst.
- Keine manuelle Scheinvariable und kein Überspringen des Wire-Tests.
- Bestehender DOM-Test sucht Entscheidungsbuttons und Exemplartext
  nun rekursiv in der neuen Displaystruktur.
- Prüfungen für Abbrechen-Fokus, unverändertes Modell,
  Bestätigungsablehnung, einmaliges Behalten und volle Boxen bleiben erhalten.
- Anwendungslogik und Testanforderungen nicht geändert.
- Browserlauf und manuelle Sichtprüfung weiterhin offen.

### UI01-09a Revision 2 — Pokémonkarte, klare Aktionen und Dialogtest

- Nutzer bestätigt Gehäusedarstellung als sehr gut.
- Linke Pokémonkarte an Entwicklungsansicht angeglichen:
  Bild, Name/Art, Level, vorhandene Bindung und Exemplar-ID.
- Fehlende Bindungsdaten nicht als erfundener Zahlenwert darstellen.
- Release-Modus beschriftet mit In Box verschieben und Freilassen.
- In Box verschieben bleibt das bestehende Pflegeende mit Behalten
  desselben Individuums, kein normaler Boxwechsel.
- Sichtbarer Hinweis erklärt Pflegeende und Endgültigkeit.
- Bestehende zusätzliche Browserbestätigung vor endgültiger Entfernung erhalten.
- Test-Timeout als Dialog-Wartefehler erkannt:
  Bestätigung und auslösender Klick werden jetzt gemeinsam abgearbeitet.
- Keine Timeout-Erhöhung, kein force-Klick und kein Entfernen der Bestätigung.
- Bestehende Tests nur auf neue aktuelle Pflege-Aktionsnamen angepasst.
- Freilassaktion gelagerter Exemplare bleibt vorerst unverändert beschriftet.
- Native Lebenszyklus-/Speicherlogik unverändert.
- Tests und abschließende Sichtprüfung weiterhin offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-09a Revision 3 — spielinterne letzte Bestätigung

- Nutzer wünscht links ausschließlich Pokémonkarte wie in Entwicklung.
- Erklärungstexte und sichtbare Exemplar-ID entfernt;
  native Lebensidentität und erwarteter Life-Token unverändert geschützt.
- Rahmenwarnung exakt Freilassen ist endgültig!
- Körper-Abbrechen entfernt; Zurück oben rechts.
- Zurück schließt zur Pokédex-Zentrale; in letzter Frage zunächst zurück
  zur unveränderten Entscheidung.
- Systembestätigung durch eigene letzte Abfrage Sicher? ersetzt.
- Ja grün, Nein rot; anfänglicher Fokus auf Nein.
- Erst Ja übergibt confirmed:true an den bestehenden Freilassweg.
- Kein Freilassen durch bloßes Öffnen der Frage oder versteckte Ja-Aktion.
- Nein/Zurück erhalten Modell und aktives Exemplar.
- Fehlermeldungen in eigenem Statusbereich, ohne die Rahmenwarnung zu ersetzen.
- Native careEnd-Transaktion, expectedLife, Behalten und Rücknahme unverändert.
- Neue Tests für fehlenden Systemdialog, Abbruch und tatsächlich
  bestätigtes Entfernen genau des aktuellen Exemplars.
- Sichtprüfung und gezielte Tests offen; UI01-09 insgesamt weiter offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-09a — Rückkehr zum Pflegebildschirm und abgegrenzte Dialogprüfung

- Nutzer bestätigt die aktuelle Darstellung des Pflege-Ende-Dialogs.
- Letzte Navigationskorrektur: Zurück führt zum Hauptbildschirm des
  Pflege-Pokémon, nicht zur Pokédex-Zentrale.
- Rückkehr innerhalb der Sicher?-Frage bleibt zunächst die Entscheidung.
- Testfehler Cannot accept dialog which is already handled als Konflikt
  zweier Handler beim vorbereitenden Spielstandimport erkannt.
- Überwachung unerwünschter Systemdialoge erst nach vollständiger
  Vorbereitung und Öffnung des Pflege-Ende-Dialogs registrieren.
- Importhelfer nicht verändert; Importbestätigung nicht übersprungen.
- Prüfung auf fehlende Systembestätigung im eigentlichen Pflege-Ende-Ablauf erhalten.
- Rückweg jetzt mit verborgenem App-Menü und screen idle geprüft.
- Bestätigung, native Transaktion, Behalten und endgültiges Entfernen unverändert.
- Visuelle Freigabe liegt vor; gezielter funktionaler Abschluss noch offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-09a — Entscheidungsfarben gegen Grundregel absichern

- Nutzer bestätigt aktuelle Darstellung und Rückkehr zum Pflegebildschirm.
- Gezielter Lauf RPLkxb bleibt wegen abweichender Ja-Hintergrundfarbe rot.
- Ursache: neutrale Entscheidungsbutton-Regel besitzt höhere Selektorstärke
  als die bisherigen Zustandsfarben.
- Bestehende Grün-/Rot-Regeln gezielt stärker gefasst.
- Erwartete Testfarben, Nein-Anfangsfokus und Bestätigungsprüfungen erhalten.
- Keine Änderung an Dialogereignissen, Lebensidentität oder Speicherlogik.
- Visuelle Freigabe liegt vor; funktionaler Abschluss des Teilschritts
  erst nach erfolgreichem gezielten Lauf.
- Eigentliche Sammlungsübersicht bleibt nächster Arbeitsschritt.
- Kein WASM-Neubau, Commit oder Push.

### UI01-09a abgenommen — UI01-09b Sammlungsübersicht umgesetzt

- Nutzer meldet gezielten Pflege-Ende-Testlauf als passed.
- Zusammen mit bestätigter Darstellung und korrigiertem Rückweg UI01-09a
  lokal abgenommen; keine Gesamtregression daraus abgeleitet.
- UI01-09b: gemeinsame Sammlungsgeometrie mit sechs Rasterplätzen links,
  Exemplarvorschau und Verwalten rechts.
- Vorhandene Boxplätze vollständig erhalten und nur seitenweise angezeigt.
- Teamplanung als sechs Plätze, aktive Pflegeidentität davon unabhängig.
- Sechs obere Zugänge einschließlich aktueller Pflege und internem Boxwechsel.
- Zehn Boxen bleiben erreichbar; keine native Boxauswahl in der Übersicht.
- Bestehende Metadaten und unbekannte Werte unverändert übernommen.
- Bisherige allgemeine Exemplaraktionen und editor-Funktion übernommen.
- Teamreihenfolge und explizites Ersetzen über bestehende Modelloperationen.
- Alle Änderungen weiterhin ausschließlich über vorhandenes controller.apply.
- Wartende Aufnahme bleibt als oberer Hinweiszugang erreichbar.
- Alte DOM-/Browsertests folgen neuen sichtbaren Verwaltungsschritten;
  Modell-, Rücknahme-, Ersatz- und Freilassprüfungen bleiben bestehen.
- Bewegte Miniaturen weiterhin über vorhandenen Zeichenpfad;
  keine behauptete neue Leistungsverbesserung.
- Pflege-Ende-Dialog nicht verändert.
- Gezielte Tests und gemeinsame Darstellungsabnahme offen.
- Kein WASM-Neubau, Commit oder Push.

### UI01-09b Revision 2 — Boxen mit Teamstart und Pokémonwerten

- Zentralenzugang heißt Boxen; bestehender Übersetzungsschlüssel und Route erhalten.
- Vom Zentralenzugang zuerst Teamplanung.
- Exemplar links, Team-/Boxraster rechts.
- Vorhandene ANG-/VERT-/TMP-Werte mit vergleichenden Balken;
  fehlende Werte bleiben unbekannt.
- Freier Teamplatz führt zur Boxauswahl; Ansicht eines Kandidaten schreibt nichts.
- Bewusste Übernahme weiterhin über bestehendes selectTeam.
- Kompakter Teamplan belegt nächsten freien Platz; Pflegeidentität unverändert.
- Boxwechsel und Platzseiten getrennt unten erreichbar.
- Miniaturen mit sichtbarem Namen und gecachten Alphagrenzen.
- Editor vor bestehendem Fokusaufruf an den sichtbaren DOM anhängen.
- Beide bisherigen freien Teamzugänge trotz unterschiedlicher Schreibweise erfasst.
- Testhelfer als vollständige Funktion statt über Einrückungsausschnitt aktualisiert.
- Zusätzliche isolierte Node-Vorprüfung mit vorgeschlagenen Quelldateien
  vor dem Schreiben; danach normale Prüfungen auf geschriebenem Stand.
- Keine abgeschwächten Fokus-, Speicher-, Rücknahme- oder Modellprüfungen.
- UI01-09b weiterhin offen; kein WASM-Neubau, Commit oder Push.

### UI01-09b Vorgaben — fester Pflegeplatz und 24 Boxplätze

- Nutzer meldet letzten gezielten Testlauf als passed.
- Neue Vorgaben für den nächsten Sammlungsentwurf:
  Pflege-Pokémon bleibt während laufender Pflege festes Teammitglied.
- In Teamübersicht Platz 1, Kampfreihenfolge davon getrennt behandelbar.
- Pflege-Pokémon nicht abwählbar und nicht durch Teamersatz verdrängbar.
- Schutz auf Modellebene prüfen, nicht ausschließlich im Renderer.
- Boxen auf 24 Plätze erweitern: vier Seiten mit je sechs Plätzen.
- Kompatibilität bisheriger Spielstände ausdrücklich erhalten:
  bestehende IDs, Exemplare, Positionen und Reihenfolge nicht verlieren.
- Älteres volles Team ohne Pflege-Pokémon nicht still überschreiben;
  gegebenenfalls expliziten Reparatur-/Ersatzfall berücksichtigen.
- Herz erklärt als Auswahl des aktuellen Pflege-Pokémon.
- Ordner erklärt als direkter Boxwechsel.
- Plus entfernen; freie Teamkacheln übernehmen diese Funktion.
- Verwaltungsansicht links: Ins Team, In andere Box verschieben, Details.
- Namensaktion rechts: Namen ändern, passende Pokédex-Bearbeitungsansicht.
- Details links: Exemplar wie Entwicklung, eigene vorhandene Werte
  einschließlich Level/Bindung und ANG-/VERT-/TMP-Balken.
- Details rechts: Entwicklungsziele und Voraussetzungen.
- Gelagerte Exemplare nicht anhand der Live-Daten des Pflege-Pokémon
  als entwicklungsbereit darstellen; keine direkte Boxentwicklung hinzufügen.
- Zunächst Modell, Aufnahme, Teamreihenfolge und Kapazitätsgrenzen lesen.
- Keine pauschale Ersetzung der Zahl 200:
  Tagebuch- und andere unabhängige Grenzen unverändert lassen.
- Aktueller Entwurf weiterhin in Bearbeitung, keine Gesamt-Abnahme.
- Kein Commit/Push.

### UI01-09b Revision 3 — Pflegeplatz, 24er-Boxen und Entwicklungsdetails

- Sammlungsnutzdaten Version 2: zehn Boxen mit je 24 Plätzen.
- ITC1-Transport und bestehende atomare Speicherwege unverändert.
- Version 1 strikt prüfen, dann je Box vier leere Plätze ergänzen.
- IDs, Exemplardaten, vorhandene Positionen und Zähler erhalten.
- Pflege-Pokémon bei freiem Platz auch nach neuer Aufzucht aufnehmen.
- Volles Team ohne Pflege-Pokémon bis ausdrücklicher Auswahl erhalten.
- Neue Wildteam-/Ligastarts bis zur Pflegeplatzzuordnung sperren.
- Bestehende eingefrorene Ligakader nicht umschreiben.
- Pflege-Pokémon weder abwählbar noch ersetzbar.
- Anzeigeplatz 1 unabhängig von gespeicherter Kampfreihenfolge.
- Freie Teamwahl findet bei ungeeigneter aktueller Box eine geeignete Box.
- Plus aus Teamwerkzeugleiste entfernen, freie Teamkachel erhalten.
- Verwaltungsraster: Ins Team / Verschieben / Details links,
  Namen ändern / Freilassen / Zurück rechts.
- Aktive Namensänderung behält bisherigen nativen Delegationsweg.
- Namenseditor mit kompakter Speichern/Abbrechen-Zeile.
- Details mit eigenen Werten, Bindung, Balken und statischen nativen Regeln.
- Entwicklungslevel: Basis plus eigene bekannte Pflegefehler, max. 100.
- Fehlende Pflegefehler nicht als null erfinden.
- Keine Live-Freigabe des Pflege-Pokémon für Boxexemplare übernehmen.
- Keine Entwicklung direkt aus Boxdetails.
- Tagebuchgrenze und native Speichergrößen unverändert.
- Anfangsgrößenprüfung, volle Pflegeabschluss-Fixture und Zukunftsversionstest
  gezielt auf die neuen Anforderungen angepasst.
- Standalone-Node-Vorprüfung mit ausdrücklicher Dateiliste.
- Native und vorbereitungsabhängige Tests über vorhandene Python-Runner.
- Gestaltung weiterhin offen, kein Commit/Push.

### UI01-09b Revision 4 — reduzierte Details und Rahmennavigation

- Nutzer meldet vorherigen Testlauf passed; Gestaltung weiter in Überarbeitung.
- Details links enden nach den Balken; Bindung bleibt oberhalb erhalten.
- Metadaten-/Exemplardatenblock und ungenutzten Renderer entfernen.
- Details rechts nur Ziel und Voraussetzungen, ohne ergänzende Erklärungstexte.
- Unbekannte Pflegefehler innerhalb der Levelbedingung kenntlich lassen.
- Plus und Zurück-Pfeil in den Rahmen unter den Displays verlegen.
- Plus nutzt selectTeam beziehungsweise ausdrückliche Ersatzliste.
- Pflegeplatzschutz, Duplikatverweigerung und atomare Speicherung unverändert.
- Verwaltungsbutton Freilassen kürzen; endgültige Bestätigungsfrage erhalten.
- Oben genau Boxen, Team und Info; Herz, Ordner und Stift entfernen.
- Boxwechsel über Rahmenpfeile, auch bei Speicherrückmeldung erreichbar.
- Wartende Aufnahme weiterhin über Info erreichbar.
- verifyBoxChoices prüft alle zehn Boxen über reale Rahmenpfeile
  und die Rückkehr zur Ausgangsbox.
- Auswahlhelfer verwenden ebenfalls die Rahmenpfeile.
- Modellprüfung für Boxnamen und unbekannte Gene erhalten.
- Neuer DOM-Testdummy initialisiert className wie ein echtes HTML-Element.
- Kein Modell-/Speicherformatwechsel, WASM-Neubau, Commit oder Push.

### UI01-09b Revision 5 — Displayaktionen und spielinterne Zielboxwahl

- Vorherige Browserprüfung: 116 bestanden, vier Fehler aus zwei veralteten
  Boxauswahl-/Boxumbenennungs-Testfällen in beiden Browserprojekten.
- Entfernte Toolbarzugänge nicht wieder einführen.
- Detailaktionen Plus/Zurück ins linke Display, unter die Wertekarte verlegen.
- Symbolbuttons an Displaygestaltung anpassen; 44px Bedienflächen erhalten.
- Erklärung unter dem Exemplar-Namensfeld entfernen.
- Native Zielbox-Auswahl durch spielinternes, scrollbar gestaltetes Boxraster ersetzen.
- Boxbelegung und gesperrte aktuelle/volle Boxen anzeigen.
- Zielwahl schreibt noch nichts; Verschieben bleibt ausdrücklich zu bestätigen.
- Abbrechen-Fokus und bestehende Modell-/Speicheroperationen erhalten.
- Alter Browser-Boxnamensfall prüft Legacy-Namen über ausdrückliches Modell-Fixture,
  Rahmen-Navigation, Wiederöffnen, Reload und unveränderte Pflegeidentität.
- Schreibfehlerfall prüft echte UI-Namensänderung:
  unveränderte veröffentlichte/native Sammlung nach Fehler, erhaltener Entwurf,
  erfolgreiche Wiederholung und dauerhaftes Ergebnis nach Reload.
- Zusätzliche Chromium/WebKit-Prüfung bei 320/390/430px für linke Aktionen,
  Namensmaske ohne Erklärung und spielinterne Zielboxwahl.
- Kein Modell-/Speicherformatwechsel, WASM-Neubau, Commit oder Push.

### UI01 — Ideenspeicher zur Kartenbereinigung, 30.10.2026

Dokumentationsauftrag des Nutzers:
„Bitte als Idee im Projektplan sichern, noch nicht als Freigabe.“

Dieser Abschnitt bewahrt auch unentschiedene Entwürfe.
Er ist keine zusätzliche Implementierungs- oder Gestaltungsfreigabe.
Bereits bestätigte Entscheidungen werden dadurch nicht zurückgenommen.

#### Ziel und bereits bestätigtes Bedienprinzip

- Pokémon-Kartenseiten deutlich reduzieren, nicht lediglich alle
  bisherigen Seiten einzeln neu gestalten.
- Verwandte Informationen zusammenfassen.
- Ausführbare Funktionen aus den Informationskarten auslagern.
- Ein Tipp auf den Pokéball des Hauptbildschirms klappt drei Icons auf:
  Training, Kampf und Expedition.
- Bedienprinzip ist das vorhandene Beerenmenü mit seinen
  unterschiedlichen Beeren.
- Bestehende Funktions-, Start-, Speicher- und Schutzregeln erhalten.
- Konkrete grafische Ausführung und Anordnung sind noch zu reviewen.

#### Offene Gestaltungsideen — nicht abschließend freigegeben

| Thema | Festgehaltene Idee | Status |
|---|---|---|
| Kampf-Icon | Gekreuzte Schwerter | Entwurfsvariante; Auswahl offen |
| Kampf-Icon | Ein Tor mit einem Pokéball darin | Alternative Entwurfsvariante; Auswahl offen |
| Training-Icon | Passendes Symbol im gemeinsamen Retro-Stil | Konkrete Auswahl offen |
| Expeditions-Icon | Passendes Symbol im gemeinsamen Retro-Stil | Konkrete Auswahl offen |
| Aufklappmenü | Gestaltung und Interaktion am Beerenmenü ausrichten | Genaue Geometrie und Rückmeldung offen |
| Statuskarten | Profil, Wesen, Werte und Fortschritt sinnvoll bündeln | Aufteilung und endgültige Seitenzahl offen |
| Tagesziele, Rekorde, persönliche Medaillen | Zusammenfassung und geeigneten Zugang gemeinsam bestimmen | Zielbereich offen |

#### Nicht als beschlossen behandeln

- Zwei verbleibende Statusseiten waren ein Vorschlag des Assistenten,
  keine bestätigte Festlegung des Nutzers.
- Zusätzliche Pokédex-Bereiche „Aktivitäten“ und „Ziele & Erfolge“
  sowie eine zweite Zentralenseite wurden nicht freigegeben.
- Weitere Pokédex-Bereiche erst gemeinsam abwägen; nicht automatisch
  als Voraussetzung der Kartenbereinigung anlegen.
- Keine weiteren angeblich früher besprochenen Iconvarianten erfinden.

#### Bereits abgenommener Rahmen

- Nutzer hat UI01-09b einschließlich der letzten Detailkorrekturen
  am 30.10.2026 ausdrücklich abgenommen und test: passed gemeldet.
- Boxen, Teamverwaltung, Detailansicht, Namensänderung und spielinterne
  Zielboxwahl nicht ohne konkreten Anlass erneut grundlegend gestalten.
- Diese Teilabnahme ist keine Gesamtfreigabe oder Veröffentlichung von UI01.

#### Fortsetzung und Übergabe

- Diesen Ideenspeicher vor weiteren Kartenentwürfen lesen.
- Zuerst vorhandene Pokéball-Aktion und Beerenmenü prüfen.
- Danach konkreten Entwurf gemeinsam abstimmen.
- Ideen, Freigaben, Umsetzung und Abnahme getrennt dokumentieren.
- Bei Pausen oder Übergaben auch offene und verworfene Varianten erhalten.
- Verbindlichen interaktiven Revisionsbrowser weiterverwenden.

### UI01 — bestätigter Umfang des Pokéball-Menüs, 30.10.2026

Nutzerbestätigung:
„ja vier icons einschließlich Spielen“

- Pokéball auf dem Hauptbildschirm öffnet ein aufklappendes Aktionsmenü.
- Vier Einträge: Spielen, Training, Kampf und Expedition.
- Spielen öffnet weiterhin die vorhandenen Minispiele.
- Training, Kampf und Expedition werden als zusätzliche Zugänge ergänzt.
- Beerenmenü als Referenz für Darstellung und Tippverhalten verwenden.
- Bestehende Startbedingungen, Sperren und Speicherwege erhalten.
- Kein zusätzlicher Pokédex-Bereich für diese vier Aktionszugänge.
- Konkrete Icons und Anordnung bleiben Gegenstand des Gestaltungsreviews.
- Kampf-Iconvarianten Schwerter beziehungsweise Tor mit Pokéball erhalten;
  keine endgültige Symbolauswahl aus dieser Bestätigung ableiten.
- Zunächst Aktionsmenü umsetzen und ansehen; Kartenreduzierung danach.
- Verbleibende Kartenzahl und Informationsaufteilung weiterhin offen.

### UI01 — Pokéball-Aktionsmenü, erster bedienbarer Prototyp

- Vier Menüeinträge bestätigt: Spielen, Training, Kampf, Expedition.
- Erste Iconvariante zum Ansehen: Pokéball, Hantel, Schwerter, Kompass.
- Tor mit Pokéball bleibt alternative Kampf-Iconidee.
- Aufklappfeld und Außenklickverhalten am Beerenmenü ausrichten.
- Menü besitzt Tipps und sperrt Wischen sowie Freilass-Halten.
- Nach Ablauf keine Weitergabe einer im Menü begonnenen Berührung.
- Eigene Herkunft idle für Training/Kampf mit passenden Rückwegen.
- Bestehende Kartenaufrufe und natürliche Wildbegegnungen erhalten.
- Expedition eigenständig mit vorhandener Darstellung und Speicheraktionen.
- Kartenreduktion noch nicht umgesetzt; Seitenzahl weiterhin offen.
- Bestehende HTML-/Offline-Ladeliste ergänzen.
- Spiele-Browsertests über sichtbaren gemeinsamen openGames-Helfer.
- Funktionsleser berücksichtigt verschachtelte Parameterklammern.
- Kurze Controllerprüfungen und gezielter Chromiumlauf, danach manuelles Review.
- Kein nativer Quellwechsel, WASM-Neubau, Gesamtabschluss, Commit oder Push.

### UI01 — Aktionsmenü Revision 2: Pixelstil und eigener Trainingsbildschirm

- Erster Aktionsmenü-Prototyp vom Nutzer gestalterisch abgelehnt.
- Keine Abnahme aus damaligen bestandenen Teilprüfungen ableiten.
- Hauptbildschirm erhält nur eine Ebene mit vier Haupticons.
- Neue Motive als eigene 16x16-Pixelgrafiken über vorhandenen drawIcon-Renderer
  und dessen Palette; originale Glyphen unverändert.
- Keine zweite Trainings-/Kampf-Iconreihe auf dem Hauptbildschirm.
- Eigener Trainingsbildschirm als erste Gestaltungsreferenz:
  beschriftete Auswahl links, eigene Werte/Informationen und Start rechts.
- Auswahl allein startet nichts und verändert keine Spielwerte.
- Training kehrt danach zur Trainingsauswahl zurück; deren Zurück zum Pflegebild.
- Eigene beschriftete Kampf-Auswahl nutzt dieselbe Grundgeometrie.
- Trainer-/Arena-Unteransichten und Expedition gestalterisch noch gesondert offen.
- Bestehende Kartenwege bleiben während der Iteration funktionsfähig.
- Bisherige Spiel-, Kosten-, Belohnungs- und Speicheroperationen weiterverwenden.
- Kurze Controllerprüfungen und gezielter Chromiumlauf; danach manuelles Review.
- Kein nativer Quellwechsel, WASM-Neubau, Gesamtabschluss, Commit oder Push.

### UI01 — Aktionsmenü Revision 3: neue Motive und Trainingsvorschau

- Nutzer meldet vorherigen Testlauf passed, gibt aber keine vollständige
  Gestaltungsabnahme: neue Icons und rechtes Trainingsdisplay weiter offen.
- Linke Trainingsauswahl und grundsätzliche Bildschirmaufteilung beibehalten.
- Neue Motivvariante zum Ausprobieren freigegeben:
  Spielen unverändert, Boxsack, Arenator mit Pokéball, Rucksack.
- Originale TPIcon-Glyphen unverändert lassen.
- Gemeinsamen Pixelrenderer um eine Ziel-Zeichenfläche ergänzen;
  Standardrenderer delegiert an dieselbe Implementierung.
- Rechtes Trainingsdisplay mit lokalem Pokémonbild und kleiner Trainingsszene.
- Stärke: Boxsack; Verteidigung: Schild/blaue Punkte; Tempo: Laufpose,
  sofern vorhanden, und Pixel-Bewegungsspuren.
- Kurze Bildunterschrift, aktueller Wert und Dauer als zurückhaltende Angaben.
- Keine garantierten Gewinne anzeigen oder durch Vorschau erzeugen.
- Vorschau nutzt vorhandene lokale Spriteframes, gecachte Alphagrenzen
  und gedrosselte Canvas-Aktualisierung; keine nativen Trainingsaktionen.
- Fehlende lokale Grafik durch Platzhalter anzeigen, keine Medien herunterladen.
- Training startet weiterhin ausschließlich über den Startbutton.
- Kurze passende Prüfungen und erneute Sichtprüfung; kein Gesamtabschluss.
- Kein Modell-/Speicherformatwechsel, WASM-Neubau, Commit oder Push.

### UI01 — Kampf-Auswahl mit eigener Teamvorschau

- Nutzer meldet letzten Testlauf passed; Trainingsansicht passt,
  Haupticons ausdrücklich als besser bewertet.
- Trainingsgestaltung und vorhandene Haupticon-Motive in diesem Schritt erhalten.
- Rechte Kampf-Auswahl an die Trainingsreferenz angleichen.
- Eigenes Startmitglied und symbolische Wildnis/Trainer/Arenator darstellen.
- Wild/Arena zeigen erstes geplantes Kampfmitglied, nicht pauschal das Pflege-Pokémon.
- Trainer-Grundfunktion verwendet weiterhin das aktuelle Pflege-Pokémon.
- Symbolische Vorschau erzeugt keinen Gegner und startet keinen Kampf.
- Lokalen gemeinsamen Spritecache, Pixelrenderer und gedrosselte Vorschau verwenden.
- Start-/Kosten-/Speicher-/Belohnungslogik unverändert.
- Teamreihenfolge, Pflegeidentität und Sammlung durch Auswahl nicht verändern.
- Syntaxfehler der vorgeschlagenen Teamangabe vor dem Schreiben abgefangen
  und schließendes Anführungszeichen korrigiert.
- Trainer-/Arena-Unteransichten sowie Expedition bleiben offene Reviewpunkte.
- Kurze passende Prüfungen, danach manuelle Sichtprüfung.
- Kein nativer Quellwechsel, WASM-Neubau, Gesamtabschluss, Commit oder Push.

### UI01 — Vier Kampfbereiche freigegeben und Youngster-Porträt vorbereiten

- Nutzer gibt Vierer-Startseite und sämtliche beschriebenen Gestaltungsbereiche frei.
- Kampf-Startseite: eigenes Team links, vier beschriftete Kampfarten rechts:
  Wildkampf, Trainerkampf, Arenakampf, Ligakampf.
- Kategorien öffnen Auswahl/Vorbereitung; keine Kampfstarts durch bloße Auswahl.
- Arena und Liga werden gleichberechtigte Zugänge, keine zusätzlichen Pokédexbereiche.
- Trainer: echter generischer Pokémon-Trainersprite statt eigener Pixelperson.
- Arena: vorhandenes Arenaleiterporträt/Ordenstatus statt vergrößertem Menüicon.
- Liga: eigene Region-/Varianten-/Laufansicht mit Start/Fortsetzen.
- Eingefrorene Ligakader und gespeicherte Fortschritte nicht durch heutige Teamplanung ersetzen.
- Grafische Unterseiten neu am gemeinsamen Doppeldisplay-Konzept ausrichten;
  Kampf-, Kosten-, Belohnungs- und Speicherregeln erhalten.
- Umsetzung in getrennten Prüf-/Reviewschritten.
- Dieser erste Schritt ergänzt kanto-youngster am Ende der TPTR-v2-Zuordnung.
- Bisherige 26 Einträge und Indizes bleiben unverändert.
- Bestehenden lokalen Grafikimport und vorhandene Quellenanzeige verwenden.
- Bildquelle durch tatsächliche Verzeichnisauflösung bestimmen.
- PNG unverändert verpacken; Herkunft/Rechte nicht als verifiziert ausgeben.
- Medien nur privat außerhalb des Repositorys erzeugen.
- Fehlendes Porträt als Platzhalter zeigen, keine erfundene Ersatzperson.
- Vierer-Startseite und Arena-/Liga-Gestaltung folgen; nicht als schon umgesetzt ausgeben.
- Kein Spielstand-/WASM-Wechsel, Gesamtabschluss, Commit oder Push.

Lokale Recherche-/Importdatei dieses Laufs:

- Quelle: https://play.pokemonshowdown.com/sprites/trainers/youngster-gen4.png
- Privat vorbereitet: trainer-kanto-youngster.bin; kein Medieninhalt im Repository.

### UI01 — Youngster: Import- und Schutztest-Gesamtzahlen korrigiert

- Vorheriger Block hat Traineranbindung und Packer bereits geschrieben.
- Anschließender vorbereiteter Importlauf scheiterte an alter Gesamtzahl 26.
- V1-Importprüfung behält acht importierte Leiter und alle Transaktionsprüfungen.
- Verfügbare Gesamtzahl und Manageranzeige auf 27 Einträge umstellen.
- Acht ursprüngliche V1-Leiter und angehängten Youngster-v2-Eintrag zusätzlich prüfen.
- Veröffentlichungsschutz-Test zählt ebenfalls 27 bekannte Dateien
  und verlangt ausdrücklich trainer-kanto-youngster.bin.
- Bestehende Workflow-/Artefakt-Negativtests laufen mit dem erweiterten Satz.
- Keine Schutzregel oder ungültige-Daten-Prüfung entfernen.
- Kein erneuter Download, keine Anwendungscode-/Spielstandänderung.
- Erneuter Import-, Schutz- und kurzer Browserlauf folgen.
- Kein Commit/Push; keine Gesamtfreigabe.

### UI01 — Kampfvierer und direkter Liga-Einstieg

- Umsetzung weiterhin ausschließlich als direkt kopierbarer Terminalblock.
- Keine herunterzuladenden Installationsskripte oder neuen Bedienwege.
- Trainergrafik vom Nutzer eingelesen und abgenommen; unverändert lassen.
- Teamstart links, vier beschriftete Kampfarten rechts im 2x2-Raster.
- Auswahl öffnet Vorbereitung ohne sofortigen Kampfstart oder Zahlung.
- Vorbereitung zurück zur Viererauswahl, von dort zur Hauptansicht.
- Liga über expliziten Aktivitätskontext ohne versteckten Arena-Umweg öffnen.
- Liga-Rückweg zur Aktivität oder zum bisherigen Arena-Einstieg erhalten.
- Vorhandene Regionssperren erhalten; kein automatisches Freischalten.
- Liga-Vorbereitung zeigt heutige Teamplanung, nicht einen behaupteten Laufkader.
- Gespeicherte Ligakader, Transaktionen, Kosten und Kampfregeln unverändert.
- Vergrößertes Arena-Menüicon aus der Aktivitätsvorschau entfernen.
- Trainingsansicht und lokale Trainerdatei unverändert.
- Browserprüfungen für 320/390/430 sowie bestehende Individuenprüfung mitführen.
- Vollständiger grafischer Arena-/Liga-Neuaufbau folgt als nächster Schritt.
- Uploads nur gemeinsam besprochene Ausnahme bei anders nicht lesbarer Datei.
- Keine neuen manuellen Browserstarts, Spielstandimporte, Commits oder Pushes.
- Lokale Tests und sichtbare Abnahme erst nach ihrer Durchführung bestätigen.

### UI01 — Korrektur: vier Kampfarten links, Vorschau rechts

- Nutzer lehnt die vorherige Rechtsraster-/Zwischenseiten-Anordnung ab.
- Verbindliche korrigierte Anordnung:
  links vier Auswahlbuttons untereinander;
  rechts zugehörige Grafik/Animation, Beschreibung und Öffnen-/Startaktion.
- Alle vier Auswahlbuttons bleiben auf derselben Seite erreichbar.
- Bei geringem Platz linke Liste scrollen, Mindestbedienhöhe nicht unterschreiten.
- Keine zusätzliche Vierer-Startseite und kein 2x2-Raster.
- Auswahl links aktualisiert Vorschau rechts, ohne sofortigen Kampfstart.
- Zurück schließt diese Auswahl direkt zur Hauptansicht.
- Regionenauswahl der Liga befindet sich rechts, nicht zwischen den vier Kampfarten.
- Direkten Liga-Einstieg und vorhandene Regionssperren erhalten.
- Abgenommene Trainergrafik unverändert.
- Arena-/Liga-Vorschauen vorläufig; eigentliche Grafikentscheidung folgt im Review.
- Dahinterliegende Arena-/Liga-Unterseiten sind weiterhin im alten Design
  und bleiben ausdrücklich als nächster Gestaltungsauftrag offen.
- Keine Kampf-, Kosten-, Speicher- oder Ligakaderregeln ändern.
- Vorherige widersprechende Layoutbeschreibung ist durch diese Vorgabe ersetzt.
- Übergabe weiterhin ausschließlich als Terminalblock; kein Installationsdownload.
- Keine Spielstandimporte, neuen manuellen Browserstarts, Commits oder Pushes.

### UI01 — Arena- und Liga-Vorschauszenen

- Nutzer bestätigt korrigierte Anordnung und meldet Tests bestanden.
- Abgenommenes Layout erhalten: vier Buttons links; Vorschau/Beschreibung/Aktion rechts.
- Arena bekommt eigene Gebäude-Pixelszene mit Pokéball-Schild und Türlicht.
- Liga bekommt eigene Pokal-Pixelszene mit vier Lichtern.
- Keine vergrößerten Hauptmenüicons und keine zusätzlichen Medienimporte.
- Pokémon-Animation daneben weiterverwenden; Trainerdatei unverändert.
- Zeichnung rein in bestehendem Vorschau-Canvas; keine Kampf-/Speicheränderung.
- Technische Szenenprüfungen und Szenenkennung im Browser ergänzen.
- Sichtbare Grafikabnahme erst nach Nutzerreview dokumentieren.
- Dahinterliegende Arena-/Liga-Seiten sind weiterhin im alten Design.
- Nächster Auftrag: diese Unterseiten in das gemeinsame Doppeldisplay-Design überführen.
- Terminalworkflow, bestehender Revisionsbrowser und bisherige Freigaben erhalten.
- Kein Commit/Push, zusätzlicher manueller Browserstart oder Spielstandimport.

### UI01 — Vorschauszenen abgenommen; Arena-/Liga-Unterseiten aktiv

- Nutzer meldet Tests bestanden und bestätigt Arena-/Liga-Vorschauszenen.
- Kampf-Auswahl und ihre vier linken Buttons sowie rechte Vorschau sind abgenommen.
- Diese Anordnung und die abgenommenen Grafiken nicht erneut verändern.
- Aktiver nächster Schritt: Arena-Unterseiten im gemeinsamen Doppeldisplay-Design.
- Danach Liga-Unterseiten einschließlich gespeicherter Läufe und Fortsetzung.
- Arena: Leiterliste links, Porträt/Ort/Ordenstatus/Aktionen rechts.
- Gegnerteam, Regionen und Ordenkoffer in das gemeinsame Design einbeziehen.
- Kampf-, Kosten-, Belohnungs-, Kader- und Speicherregeln erhalten.
- Bestehende Browserprüfungen auf echte neue Bedienelemente umstellen;
  keine versteckte alte Bedienoberfläche oder Koordinatenumleitung für Tests.
- Weiterhin direkt kopierbare Terminalblöcke und bestehenden Revisionsbrowser verwenden.

### UI01 — Arena-Auswahl als gemeinsam zu prüfender Entwurf

- Nutzer möchte den Entwurf ausprobieren und gemeinsam beurteilen.
- Keine sichtbare Abnahme vorwegnehmen.
- Zunächst nur Arena-Auswahl neu: acht Leiter links, Porträt/Ort/Ordenstatus rechts.
- Arena ansehen öffnet vorerst die vorhandene Detailseite.
- Optionen führen vorerst zu bestehenden Regionen, Ordenkoffer und Liga.
- Detailseite, Regionen/Ordenkoffer und Liga bleiben weitere offene Gestaltungsschritte.
- Gemeinsame Rahmengeometrie wiederverwenden; Kampf-Auswahl nicht neu gestalten.
- Vorhandenen lokalen Porträtloader verwenden; kein neuer Grafikimport.
- Kampf-, Start-, Energie-, Speicher- und Belohnungsfunktionen unverändert.
- Betroffene Tests klicken neue DOM-Bedienelemente; H.tap bleibt unverändert.
- Keine Koordinatenumleitung auf eine versteckte alte Auswahl.
- Neue isolierte DOM-Prüfung und Browser-Layoutprüfung ergänzen.
- Weiterhin Terminalblöcke und bestehenden Revisionsbrowser verwenden.
- Kein Commit/Push, zusätzlicher manueller Browserstart oder Spielstandimport.

### UI01 — Acht Ordensymbole und direkte Regionsauswahl

- Nutzer meldet Tests bestanden und bewertet rechtes Arena-Display als sehr gut.
- Gestaltung des rechten Displays unverändert lassen.
- Linke Namenliste durch acht Ordensymbole in zwei Spalten/vier Zeilen ersetzen.
- Alle acht Symbole müssen ohne Scrollen in das vorhandene Display passen.
- Kompakte Ordensflächen dürfen dafür von der bisherigen Listen-Mindesthöhe abweichen.
- Vorhandene Kanto-/Johto-Zeichnungen verwenden; kein neuer Medienimport.
- Namen bleiben rechts sowie als zugängliche Beschriftungen/Tooltips verfügbar.
- Erhaltene Orden markieren; Auswahlhighlight separat erhalten.
- Optionen als beschriftetes/zugängliches Drei-Punkte-Symbol in den Rahmen verlagern.
- Region direkt über Kanto-/Johto-Rahmenbutton und eigene Regionsbuttons erreichen.
- Keine Platzhalter für noch nicht umgesetzte Info-/Aktionsfunktionen anlegen.
- Kampfregeln, Energie, Speicherformat und vorhandene Sperren nicht ändern.
- Detailseite, Ordenkoffer und Liga bleiben weitere offene Gestaltungsschritte.
- Terminalworkflow und bestehenden Revisionsbrowser beibehalten.
- Sichtbare Abnahme erst nach gemeinsamem Review bestätigen.

### UI01 — Abgenommene Ordenaufteilung und direkte Rahmenaktionen

- Nutzer meldet Tests bestanden und akzeptiert die Aufteilung mit acht Ordensymbolen.
- Rechtes Display: Name, Trainerporträt, Ort und Ordensbezeichnung beibehalten.
- Erhaltene Orden links golden hervorheben; Auswahl separat blau markieren.
- Rechts Noch-offen/Erhalten-Zusatz sowie Anzahl/Levelbereich entfernen.
- Drei-Punkte-Menü vollständig durch direkte Rahmenicons ersetzen.
- Regionswechsel als Icon mit kurzem Regionsnamen oben links.
- Direkte Rahmenicons für regionalen Ordenkoffer und Liga.
- Liga-Icon erst bei allen acht erhaltenen Orden dieser Region antippbar.
- Aktuellen Ordenstand auch unmittelbar vor dem Liga-Öffnen prüfen.
- Keine neuen Kampf-, Energie-, Speicher- oder Belohnungsregeln.
- Liga-Sperrtest auf deaktiviertes echtes Icon und native Startverweigerung umstellen.
- Liga-, Ordenkoffer- und Arenaleiter-Unterseiten bleiben offen.
- Terminalworkflow und bestehenden Revisionsbrowser beibehalten.
- Kein Commit/Push und keine zusätzliche manuelle Browserinstanz.

### UI01 — Orden-Teststände, Rahmenreferenz und Wildkampf-Startfehler

- Nutzer meldet bisherige Tests bestanden.
- Benötigt werden vorbereitete Review-Spielstände:
  gemischte erhaltene/offene Orden sowie alle acht Orden.
- Regionale Trennung und Liga-Icon-Freigabe damit sichtbar prüfen.
- Vorhandenen Review-Fall-/Spielstandvorbereitungsweg verwenden.
- Teststände vor dem dazugehörigen Revisionsbrowser-Neustart vorbereiten.
- Keine manuellen Ersatzimporte oder neuen Browser-Startwege einführen.
- Arena-Rahmenicons direkt über den Displays ausrichten.
- Referenz ist das bestehende Eiermenü der Pokédex-Zentrale.
- Zurück-Button von dieser Icon-Ausrichtung ausnehmen.
- Wildkampf meldet Kampfstart fehlgeschlagen und beginnt nicht.
- Aktuellen Startkontext und Transaktionsfreigabe prüfen, nicht Sperren umgehen.
- Regression für tatsächlichen Wildkampfstart und Rückkehr ergänzen;
  bloße Kategorieauswahl deckt diesen Fall nicht ab.
- Liga-, Ordenkoffer- und Arenaleiter-Unterseiten bleiben weitere offene Aufgaben.

### UI01 — Wildkampf-Kontextfreigabe und Werkzeugleiste nach Eiermenü

- Aktueller Quellstand bestätigt: Wildstart akzeptiert activity,
  aber wildPrepare-Transaktionsfreigabe weist activity bisher zurück.
- Gezielt nur wildPrepare im aktiven Wildkampf-Auswahlkontext zulassen.
- Keine allgemeine Freigabe anderer Sammlungsaktionen in activity.
- Isolierter Test verwendet die tatsächliche acquire-Funktion.
- Browserregression startet echten Wildkampf und prüft Rückkehr nach activity.
- Bei verbleibendem Startfehler dessen konkreten Code im Browsertest ausgeben.
- Arena-Icons in eigene Werkzeugleiste nach tp-egg-actions verschieben.
- Identische Pokedex-Inset-/Toolbar-Positionsvariablen verwenden.
- Zurück bleibt im Kopfbereich; Region im Titel und zugänglicher Iconbeschriftung.
- Abgenommene Displayinhalte und Ordensraster unverändert.
- Orden-Review-Spielstände noch vorzubereiten:
  gemischter Stand sowie alle acht Orden, regional getrennt.
- Zuerst tatsächliches Dateiformat des bestehenden --saves-Review-Runners lesen.
- Kein Ersatzimport und kein neuer manueller Browser-Startweg.
- Spielstände erst als vorbereitet und Tests erst als bestanden melden,
  wenn die jeweiligen Schritte tatsächlich ausgeführt wurden.

### UI01 — Orden-Reviewfälle mit geprüftem Sicherungsformat vorbereitet
- Fehler der vorherigen Vorbereitung war ein unzulässig wörtlicher Parservergleich.
- Vorhandene Fixture-Funktionen und Speicherbibliothek verwendet.
- Acht synthetische Fälle mit getrennten Kanto-/Johto-Ordenständen erstellt.
- Mit seal/decode inklusive Prüfsumme und Rückleseprüfung validiert.
- Dateiendung aus tatsächlicher Fallpfadbildung des vorhandenen Runners gelesen.
- Bestehenden --saves-/Manifestvertrag und gespeicherten Revisionsbrowser beibehalten.
- Nur Terminal-Fallhilfe dieses Ordenprofils an tatsächliche Fallnamen angepasst.
- Ausgabe außerhalb des Repositorys: /Users/M1dn8/Downloads/iTamaPoke-UI01-Ordenreview
- Normalen Spielstand nicht verändert; noch kein Browser gestartet.
- Sichtbare Prüfung der goldenen Orden und regionalen Liga-Sperre noch offen.
- Danach Arenaleiter-Detailseite weitergestalten; Ordenkoffer und Liga bleiben offen.
- Kein Commit/Push oder neuer Browser-Startweg.

### UI01 — Arenaleiter-Details und Ordenkoffer im Doppeldisplay

- Nutzer bestätigt: bisherige Savegames reichen zur Prüfung der goldenen Ordenmarkierung.
- Johto setzt einen erfolgreichen Kanto-Ligaabschluss voraus; diese Sperre erhalten.
- Reviewfälle 6–8 sind ohne Kanto-Ligaabschluss derzeit nicht für Johto verwendbar.
- Keine Umgehung der Freischaltung und keine weitere Fixturekorrektur in diesem Schritt.
- Abgenommene Arena-Auswahl und Rahmenaktionen erhalten.
- Arenaleiter-Detailseite auf gemeinsames Doppeldisplay umstellen.
- Gegnerteam in zwei Spalten mit kleinen Grafiken, Name, Level und farbigen Typen.
- Native Herausforderung und Energiefreigabe weiterverwenden.
- Ordenkoffer mit acht Orden links und ausgewähltem Orden rechts.
- Nur vorhandenes Erwerbsdatum zeigen; keine historischen Siege/Datumswerte erfinden.
- Rückweg Detail -> Herkunftsansicht (Auswahl oder Ordenkoffer).
- Rückweg Ordenkoffer -> Arena-Auswahl.
- Bestehende Start-, Transaktions-, Kampf- und Belohnungsfunktionen unverändert.
- Browserprüfungen nutzen echte neue Bedienelemente.
- Liga-Unterseiten folgen als eigener nächster Gestaltungsschritt.
- Neuer Entwurf noch nicht als sichtbar abgenommen erklären.
- Terminalworkflow und bestehenden Revisionsbrowser beibehalten.

### UI01 — Größere Gegnerkarten und untere Rahmenaktionen

- Nutzer meldet bisherigen Unterseiten-Testlauf bestanden und wünscht Layoutkorrekturen.
- Gegnerteam nutzt beide Displays ohne darin platzierten Herausfordern-Button.
- Maximal drei Pokémon je Display; vorhandene Karten gleichmäßig verteilen.
- Größere lokale Sprite-Zeichenfläche und Zuschnitt transparenter Ränder nur zur Anzeige.
- Native Gegnerdaten, Level und farbige Typen unverändert verwenden.
- Herausfordern/erneut herausfordern unten rechts im Pokédexrahmen.
- Energie-/Statusinformation unten links im Rahmen.
- Ordenkoffer erhält kleine Vor-/Zurück-Flächen wie vorhandene Rahmenpfeile.
- Sichtbare Pfeilfläche 30x24, Bedienfläche 44x44.
- Nur tatsächlich verfügbare regionale Koffer anbieten.
- Kein Umgehen der Johto-Freischaltung durch Kanto-Ligaabschluss.
- Bei nur einem verfügbaren Koffer Pfeile deaktivieren.
- Keine Kampf-, Speicher-, Belohnungs- oder Energielogik ändern.
- Abgenommene Arena-Auswahl und ihre Rahmenicons unangetastet lassen.
- Neue Darstellung noch gemeinsam sichtbar prüfen; Liga-Unterseiten bleiben offen.
- Terminalworkflow und bestehenden Revisionsbrowser beibehalten.

### UI01 — Feste Teamplätze und korrigierte Rahmenpositionen

- Nutzer korrigiert ausdrücklich: keine größenabhängige Verteilung der Teamkarten.
- Beide Displays haben immer drei feste, gleich große Plätze.
- Weniger Pokémon vergrößern die belegten Plätze nicht; übrige Plätze bleiben frei.
- Herausfordern/erneut herausfordern nicht unten im Rahmen darstellen.
- Stattdessen Kampf-Icon rechts über dem Display, unter dem Zurück-Button.
- Zugänglichen Namen und Tooltip für Erst-/Wiederholungskampf erhalten.
- Bestehende Startaktion und Energiefreigabe unverändert.
- Energie-/Kosteninformation unten links beibehalten.
- Ordenkoffer-Pfeile an die äußerste linke/rechte Position des unteren Rahmens.
- Kleine sichtbare Pfeilflächen und vorhandene Bedienflächen erhalten.
- Keine Umgehung der Johto-/Regionensperren.
- Abgenommene Arena-Auswahl nicht verändern.
- Darstellung erneut gemeinsam prüfen; Liga-Unterseiten bleiben offen.

### UI01 — Teamkartengröße/Pfeile abgenommen; Footerprüfung präzisieren

- Nutzer akzeptiert feste Teamkartengröße und äußere Kofferpfeile.
- Diese Darstellungen nicht erneut verändern.
- Herausfordern-Icon noch nicht abgenommen.
- Vorschläge: VS-Symbol, Pokéball mit Aktionsdreieck oder Herausforderungsflagge.
- Vor Umsetzung der Iconänderung Nutzerwahl abwarten.
- Bisheriger Browserlauf: 13 bestanden, 3 Footer-Geometrieprüfungen fehlgeschlagen.
- Alte Prüfung bezog sich auf gesamten Footer gegen äußere Displaybegrenzung.
- Nach Verlagerung der Herausforderung nach oben tatsächliche Kosteninformation prüfen.
- Kosten müssen im Footer liegen und dürfen keine Gegnerkarte überdecken.
- Keine pauschal erhöhte Pixeltoleranz und keine Änderung der abgenommenen App-Geometrie.
- Gesamtlauf erst nach erfolgreichem Wiederholungstest als bestanden melden.
- Liga-Unterseiten bleiben weiterhin offen.

### UI01 — VS-Icon für Arena-Herausforderung

- Nutzer wählt ausdrücklich Variante 1: schlichtes blaues VS-Symbol.
- Nur Herausfordern-Icon ändern; vorhandene obere Position erhalten.
- Tooltip und zugängliche Erst-/Wiederholungsbeschriftung erhalten.
- Feste Teamkartengröße und äußere Kofferpfeile sind abgenommen.
- Energiekosten und ihre Position unverändert.
- Noch ausstehende Footer-Testkorrektur gegebenenfalls mit übernehmen:
  sichtbare Kosten innerhalb Footer und ohne Kartenüberdeckung prüfen.
- Keine pauschal größere Toleranz und keine Änderung der App-Geometrie.
- Kampf-, Speicher- und Freischaltungslogik unverändert.
- Sichtbare Prüfung des neuen VS-Icons noch offen; Liga-Unterseiten bleiben offen.

### UI01 — Optische Zentrierung und offener Kampfmenü-Umbau

- VS innerhalb der Schaltfläche anhand der tatsächlichen Textgrenzen zentrieren.
- Zusätzlich Canvasfläche innerhalb der Schaltfläche zentriert halten.
- Energiekosten mittig über gesamten unteren Rahmen ausrichten.
- Feste Teamplätze, äußere Kofferpfeile und obere Aktionsposition unverändert.
- Browserprüfungen messen sowohl Canvaslage als auch tatsächliche VS-Pixelgrenzen.
- Offener weiterer Gestaltungsauftrag:
  das eigentliche Kampfmenü an den modernen Pokédex-/Doppeldisplay-Look anpassen.
- Dieser Auftrag betrifft die Kampfoberfläche selbst, nicht nur ihre Auswahlseiten:
  Aktionen/Attackenauswahl, Teamwechsel, Status- und Ergebnisdarstellung.
- Bestehende Kampfberechnung, Kosten, Belohnungen, Speicher- und Freigaberegeln erhalten.
- Kampfmenü-Umbau nicht in diesem Zentrierungsschritt vorwegnehmen.
- Liga-Unterseiten und weitere offene UI01-Arbeiten weiterführen.
- Keine Gesamtfreigabe oder Veröffentlichung aus diesem Schritt ableiten.

### UI01 — Liga-Auswahl und Gegnerteam-Vorschau

- Nutzer meldet Tests bestanden und nimmt VS-Zentrierung/Kostenanzeige sichtbar ab.
- Diese Arena-Darstellungen unverändert lassen.
- Neue Liga-Auswahl: fünf vorhandene Trainerporträts links, Auswahl rechts.
- Gegnerteam-Vorschau mit identischen Karten und drei festen Plätzen je Display.
- Aktuelle abgenommene Zeichen-/Kartenhelfer nur für Darstellung übernehmen.
- Start, Resume, Transaktionen und Siegabschlussfunktionen nicht verändern.
- Gespeicherter Lauf behält Kader, Variante und Zwischenstand beim Fortsetzen.
- Variantenauswahl betrifft Vorschau/neuen Lauf, nicht den vorhandenen Lauf.
- Native Bestätigung vor Ersetzen eines vorhandenen Laufs beibehalten.
- Lauf beginnt bei erstem Top-Vier-Gegner, nicht beim angeklickten Vorschaugegner.
- Start/Fortsetzen/Ruhmeshalle über tatsächliche DOM-Bedienelemente prüfen.
- Laufender Kampf, unmittelbare Checkpoints, Fehlerabschluss und Ruhmeshalle
  bleiben in diesem ersten Liga-Schritt auf bisheriger Darstellung.
- Diese verbleibenden Seiten sowie eigentliches Kampfmenü bleiben offene Aufgaben.
- Keine Johto-Freischaltung, Kosten-, Speicher- oder Belohnungsregeln ändern.
- Terminalworkflow und bestehenden Revisionsbrowser beibehalten.
- Neue Liga-Darstellung noch nicht als manuell abgenommen erklären.

### UI01 — Liga-Region, Champ-Partner und Energieanzeige korrigieren

- Nutzer verlangt Regionsauswahl oben statt im scrollbaren rechten Display.
- Kampf-Auswahl erhält oberen Regionsbutton für Arena/Liga.
- Region über vorhandenes remember/available/locked steuern.
- Kein Umgehen der Johto-Voraussetzung und keine Regionswahl während Sperre.
- Abstrakten Nummernbutton durch tatsächlichen Champ-Partner ersetzen.
- Kanto-Partner aus vorhandenen Champion-Teams lesen, keine Teamdaten erfinden.
- Variantenauswahl betrifft weiter nur Vorschau/neuen Lauf.
- Energiekosten der Hauptaktion mittig im unteren Liga-Rahmen anzeigen.
- Bei Fortsetzung der Top Vier keinen erneuten Top-Vier-Einsatz behaupten;
  Champ-Fortsetzung verwendet vorhandenen nativen Champ-Preis.
- Fehler-/Laufhinweise erhalten und getrennt von Kosten darstellen.
- Top-Vier-Grafiken noch nicht abgenommen.
- Vorschläge: einheitliche Kopf-/Schulterdarstellung bestehender Motive
  oder neues einheitliches Pixelporträt-Set.
- Keine neuen Trainerbilder ohne abgestimmte Gestaltung importieren/ersetzen.
- Ruhmeshalle ausdrücklich weiter an gemeinsames Doppeldisplay-Design anpassen.
- Siegerdaten, Ehrungsbestätigung und regionale Belohnungsregeln dabei erhalten.
- Laufende Kämpfe, Zwischenstandsseiten und eigentliches Kampfmenü bleiben offen.
- Keine Gesamtfreigabe oder Veröffentlichung aus diesem Schritt ableiten.

### UI01 — Original als Referenz; zuerst Porträtvariante A testen

- Nutzer benennt die bisher verwendeten Liga-Trainerbilder/Darstellung als Original.
- Vereinbart: zuerst Variante A ausprobieren, gegebenenfalls Variante B.
- Falls keine Variante passt, zur Originaldarstellung zurückkehren.
- Original-Bilddateien und lokale BIN-Zuordnungen nicht überschreiben.
- Bisherigen Liga-Porträtpainter als leaguePagePaintOriginal erhalten.
- Variante A ist reiner Anzeigeausschnitt: oberer Kopf-/Schulterbereich.
- Aktive Anzeige wird nur über leaguePortraitVariant gesteuert.
- Rückkehr zu Original benötigt nur die Anzeigevariante Original,
  keinen erneuten Medienimport und keinen Spielstandwechsel.
- Automatischer Erstausschnitt muss pro Motiv sichtbar beurteilt werden.
- Bei nicht lesbarem Ausschnitt ursprüngliche Zeichnung als Fallback erhalten.
- Arena-Porträts, Gegner-Pokémon, Layout, Kosten und Kampfregeln unverändert.
- Noch keine neuen Bilder für B erzeugen/importieren.
- Erst bei Bedarf B gemeinsam entwerfen; Originale weiterhin als Rückfall behalten.
- Technische Prüfung ist keine künstlerische/manuelle Abnahme.
- Ruhmeshalle und weitere offene Liga-/Kampfmenüseiten bleiben offen.
- Prüfsumme des unveränderten Original-Painters: 7f728048714678c4dc499c188b195861155d6a735a54a6fbd773dd3c8d30c5f0

### UI01 — Variante B separat verpacken und einbinden

- Nutzer hat B-Bildentwurf sichtbar freigegeben, Einbau im Spiel noch zu prüfen.
- Fünf Kanto-Liga-Porträts aus bestätigter RGB-Bildtafel getrennt.
- Fünf zusätzliche TPTR-v2-IDs an bestehende 27 Kennungen anhängen.
- Alle bisherigen Indizes, Originaldateien und A-Routinen erhalten.
- Original-Painter unverändert erhalten; Anzeigevariante Original/A/B umschaltbar.
- B nur für diese fünf Kanto-Figuren; ohne passende B-Datei Original als Rückfall.
- Keine zusätzlichen Medien in Repository oder Webartefakt aufnehmen.
- Private PNG/BIN-Dateien außerhalb des Repositorys vorbereiten.
- Vorhandenen Grafikimport verwenden; kein separater Importmechanismus.
- KI-Herkunft und fehlende Rechtegarantie in Dateimetadaten dokumentieren.
- Erneutes Laden nach lokalem Import, damit B-Bildcache neu aufgebaut wird.
- Keine Spielstände, Kampfregeln, Energiepreise oder Regionssperren ändern.
- Nach technischer Prüfung neue Porträts klein und groß im Spiel gemeinsam ansehen.
- Bei Nichtgefallen A oder Original wieder aktivieren; B-Dateien nicht darüber schreiben.
- Ruhmeshalle und weitere offene Liga-/Kampfmenüseiten bleiben offen.


### UI01 — B-Stil für weitere Trainer freigegeben
- Kanto-Liga B im Spiel abgenommen.
- Acht Kanto-Arenaleiter, acht Johto-Arenaleiter und Willi/Melanie
  als neue B-Entwürfe sichtbar freigegeben.
- Koga/Bruno/Siegfried rollenübergreifend aus passenden B-Motiven wiederverwenden.
- Neue Tafeln noch nicht als importierte Spielgrafiken behandeln.
- Original/A und etablierte Terminal-/Review-Arbeitsweise erhalten.
- Fortsetzung laut aktualisierter UI01-Übergabe.

### UI01 — B-Porträts für Kanto-/Johto-Arenen und Johto-Liga

- Nutzer hat Dateizuordnung ausdrücklich bestätigt:
  JPEG = Kanto-Arenaleiter; PNG (2) = Johto-Arenaleiter;
  PNG (1) = Willi links/Melanie rechts.
- 18 neue Einzelporträts aus freigegebenen Tafeln vorbereiten.
- Bestehende 32 Trainerkennungen unverändert erhalten; neue Einträge 32 bis 49.
- Originale und A erhalten; kein Überschreiben vorhandener Trainerdateien.
- Arena-Auswahl, Detailkopf und Übergabedarstellung verwenden vorhandenen picture-Zugang mit B/Original-Fallback.
- Johto-Liga: Willi neu, Koga aus Kanto-Arenaset, Bruno aus abgenommenem Kanto-Ligaset,
  Melanie neu, Champ Siegfried aus abgenommenem B-Motiv.
- Keine unnötigen unterschiedlichen Porträts derselben Person erzeugen.
- Private Bild-/BIN-Dateien nur außerhalb des Repositorys.
- Vorhandenen Grafikimport und dessen Quellenanzeige verwenden.
- Herkunft/Rechtehinweise dokumentieren, keine freie Lizenz behaupten.
- Nach Import neu laden und kleine/große Darstellung gemeinsam prüfen.
- Johto-Sperre, Kampfregeln, Energiekosten und Spielstände unverändert.
- Neue Bilder erst nach tatsächlichem Import und Sichtprüfung als im Spiel abgenommen kennzeichnen.
- Ruhmeshalle und verbleibende Liga-/Kampfmenüseiten bleiben offen.

### UI01 — Neue Johto-Reviewstände mit Kanto-Ligaabschluss geprüft

- Neue synthetische Reviewstände aus vorhandener Ruhmeshallen-Sieger-Fixture vorbereitet.
- Kanto-Abschlussdaten und bestehender Siegerdatensatz gemeinsam verwendet.
- Keine Johto-Sperre in Anwendung oder Spielkern geändert.
- Sieben positive Johto-Fälle und eine negative Kontrolle ohne Kanto-Sieg.
- Reales TPRegions.available(1), regionale Orden und Liga-Icon im Browser geprüft.
- Spielstände inklusive Prüfsumme geschrieben und zurückgelesen.
- Neuer privater Ordner: $HOME/Downloads/iTamaPoke-UI01-Johtoreview
- Bestehenden --saves-Runner, Profil und Tastenkürzel erhalten.
- Vorherige Orden-Reviewstände unverändert.
- Grafikenimport und sichtbare Abnahme der neuen Johto-Bilder bleiben getrennte Schritte.

### UI01 — B-Grafiken abgenommen; Ruhmeshalle neu gestalten

- Alle Arena-/Liga-B-Porträts vom Nutzer abgenommen; unverändert lassen.
- Ruhmeshalle auf gemeinsamen Doppeldisplay-Rahmen umstellen.
- Gespeichertes Sieger-Pokémon/Teammitglied links, gespeicherte Angaben rechts.
- Keine Rekonstruktion aus heutigem Pflege-Pokémon oder heutiger Teamplanung.
- Ehrungs-Speicherfunktion einschließlich Rücknahme/Bestätigung unverändert.
- Regionale Ehrenei-Auswahl weiterhin über bestehenden Controller.
- Ehrenei-Auswahloberfläche bleibt vorerst bestehend.
- Bestehende Johto-Rückwegsynchronisierung erhalten.
- Nur tatsächlichen Hallen-Schließklick durch neuen DOM-Zurückbutton ersetzen.
- Alle vorhandenen Zustandswartebedingungen beim Rückweg beibehalten.
- Moderner Liga-Exit über echtes Bedienelement; alte Zwischenstandsseite getrennt.
- Neue Ruhmeshalle erst gemeinsam sichtbar abnehmen.
- Liga-Zwischenstände und eigentliches Kampfmenü bleiben offen.
- Keine Arbeitsweisenänderung, Veröffentlichung oder Paketfreigabe.

### UI01 — Ruhmeshalle Vorschlag 1: Panorama-Ehrensaal

- Nutzer lehnt zweigeteilte Ruhmeshallen-Datenseite ausdrücklich ab.
- Zuerst Vorschlag 1 testen: großer Ehrensaal innerhalb des Pokédexrahmens.
- Vorschlag 2 (Querformat-Sonderansicht) nur bei Bedarf danach.
- Rotes Gehäuse und Rahmenaktionen erhalten; innen eine zusammenhängende Szene.
- Ursprüngliches Thron-Pixelmotiv und warme Raumfarben wiederverwenden.
- Ehrensaal mit Säulen, Podest und Teppich ins breite Innenformat übertragen.
- Gespeichertes Sieger-Pokémon im Zentrum, keine heutige Pflege-Rekonstruktion.
- Kleine Ehrentafel mit Name, Level und gespeicherter Sieginformation.
- Weitere unveränderte Daten über Info-Icon in integrierter Infotafel.
- Keine Geräte-/CSS-Drehung, kein neuer Browser- oder Reviewablauf.
- Ehrungsbestätigung, Belohnungen und Speichertransaktionen unverändert.
- Originale Raumroutine zusätzlich erhalten; neue Darstellung noch nicht abgenommen.
- Die alten Spaltentests durch echte Panorama-/Informationsprüfungen ersetzen.
- Kampfmenü, Liga-Zwischenstände und Ehrenei-Auswahl bleiben offene Gestaltungsaufgaben.

### UI01 — Ruhmeshalle V1 erhalten, Querformat-V2 ausprobieren

- Nutzer gefällt Panorama-Ehrensaal V1; als Rückfall erhalten.
- Bekannte Abweichung: V1 entfernt den Mittelsteg und bricht damit das gemeinsame Design.
- V1 nicht als endgültigen Standard für andere Seiten übernehmen.
- Nächster Versuch: Querformat-Sonderansicht mit erhaltenem Mittelsteg.
- Ehrensaalcharakter erhalten, keine Rückkehr zu zwei normalen Datenspalten.
- Thron/Sieger nicht hinter dem Mittelsteg platzieren.
- Nur Ruhmeshalle anpassen, andere Ansichten unverändert.
- Bestehende Größen-/Viewportsteuerung vor Änderung gezielt prüfen.
- Bestehenden Revisionsbrowser und w-Steuerung weiterverwenden;
  keinen neuen Startweg oder neue manuelle Browserprofile einführen.
- Native Ehrungs-, Sieger- und Belohnungslogik unverändert.
- V1-Sicherung: /Users/M1dn8/Downloads/iTamaPoke-Ruhmeshalle-V1-20261031-114056-189048

### UI01 — Ruhmeshalle V2 im Querformat mit Mittelsteg

- V1 gefällt dem Nutzer und bleibt als gesicherte Rückfalloption erhalten.
- V2 übernimmt unveränderte V1-Zeichen-/Ansichtsroutinen als Basis.
- hallPageVariant=2 aktiviert V2; Wert 1 plus Reload stellt V1 wieder her.
- Nur aktive Ruhmeshalle erweitert den bestehenden Spielrahmen im Viewport.
- Kein CSS-rotate und keine erzwungene Geräteausrichtung.
- Querformat nutzt zwei Displays und den vorhandenen echten Mittelsteg.
- Thron/Sieger vollständig links; grafische Ehrenwand und Ehrentafel rechts.
- Galerie zeigt ausschließlich gespeicherte Teammitglieder; keine heutige Teamrekonstruktion.
- Infoansicht, historische Daten, Ehrungs- und Belohnungsfunktionen erhalten.
- Beim Verlassen/Öffnen alter Ehrenei-Auswahl normale Größe wiederherstellen.
- Bestehende Taste w um Querformatgrößen ergänzen; keine neue Taste oder Startverfahren.
- Gewählte Größe beim Fallwechsel erhalten.
- Initialer Review bleibt 390x844; Querformat wird mit w gewählt.
- Neue Darstellung noch nicht manuell abgenommen.
- Gesicherte V1-Dateien nicht blind über spätere Gesamtdateien zurückkopieren.
- Native Transaktionen und Spielstände unverändert.

### UI01 — Ruhmeshalle V3: horizontale Displays und gemeinsamer Grund

- V2 überzeugt den Nutzer nicht; abweichende Hintergrundfarbe ausdrücklich beanstandet.
- Vereinbart: zwei breite Displays übereinander, Mittelsteg horizontal.
- Inhalte und Bedienung bleiben aufrecht; keine erzwungene Geräteausrichtung.
- Oberes Display: Ehrensaal mit Thron, Podest und gespeichertem Sieger.
- Unteres Display: ruhige Ehrentafel; keine zusätzliche Ehrenwand/Galerie.
- Hintergrund, Text und Linien aus gemeinsamen Pokédex-Designwerten.
- Gold/Burgunder nur als örtliche Akzente an Thron und Teppich.
- Vorhandenen Mittelsteg mit gemeinsamen Farben und Glanzlinie horizontal anordnen.
- V1-Raum und V1-Ansicht sowie V2-Galerieroutinen erhalten.
- hallPageVariant=1/2/3 plus Reload erlaubt gezielten Variantenwechsel.
- Aktuell Variante 3; V1 bleibt positiv bewertete Rückfalloption mit bekannter Steg-Abweichung.
- Normalen Seitenrahmen beim Verlassen wiederherstellen.
- Ehrungs-/Belohnungslogik und gespeicherte Siegerdaten unverändert.
- Vorhandenen Revisionsbrowser weiterverwenden; kein Runner-Neustart nötig.
- Neue Darstellung noch nicht manuell abgenommen.

### UI01 — V4: vollständiges Pokédex-Gerät um 90 Grad drehen

- Nutzer stellt klar: vollständige Gerätegrafik drehen, nicht nur innere Displays.
- V3 war deshalb ein Missverständnis und keine angenommene Lösung.
- V4 dreht die gesamte vorhandene Ruhmeshallen-Gerätehülle um 90 Grad im Uhrzeigersinn.
- Linse, Reflex, Rand, Displays, Mittelsteg und Bedienpositionen drehen gemeinsam.
- Originales quadratisches Gehäuse nicht zu einem anderen Seitenverhältnis strecken.
- Digitale Inhalte, Titel-/Statusangaben und Bediensymbole innerhalb ihrer mitgedrehten Positionen aufrichten.
- Gemeinsamen blaugrauen Displaygrund aus den bestehenden Designwerten verwenden.
- V1 und V2 als Rückfall erhalten; V3 ebenfalls im Code nachvollziehbar.
- Native Speicher-/Belohnungsfunktionen und historische Siegerdaten unverändert.
- Nur aktive Ruhmeshalle betroffen; normales Gehäuse beim Verlassen zurück.
- Browserprüfungen für Gesamtrotation, mitwandernde Linse, aufrechten Inhalt und Rückkehr ergänzen.
- Bestehenden Revisionsbrowser weiterverwenden; kein Runner-Neustart erforderlich.
- V4 noch nicht manuell abgenommen.

### UI01 — V4 Detailrunde: Rahmen, Rückpfeil, Ehrensaal und Siegerurkunde

- Gesamtdrehung wird vom Nutzer positiv bewertet; V4 bleibt Grundlage.
- Rahmenzähler auf schmale Eintragsnummer ohne Regionsbezeichnung reduzieren.
- Titel einzeilig entlang der Rahmenkante; Region im unteren Display.
- Gebogenen Rückpfeil zuerst in der Ruhmeshalle testen.
- Zugängliche Namen und Später-/Zurück-Semantik behalten; Klickfunktionen unverändert.
- Übernahme des Rückpfeils auf andere Seiten nach Review als eigener Schritt offen.
- Ursprüngliche warme Raumgrafik innerhalb des gemeinsamen blaugrauen Displays wiederherstellen.
- Siegerurkunde mit gespeicherter Art, Spitzname, Level, Schillernd-Markierung, Siegnummer und Datum.
- Bei Teams Startlevel, individuelle Siege, Levelgewinne und Mitgliedsposition unterscheiden.
- Ältere Abschlüsse ohne Siegerdaten nicht nachträglich rekonstruieren.
- Status-/Speichermeldungen in der Urkunde behalten, nicht im schmalen Rahmen verstecken.
- Native Funktionen für Öffnen, Schließen, Ehrungsabschluss und Auswahl unverändert.
- V1/V2-Rückfall und vollständige Drehung einschließlich Linse erhalten.
- Detailrunde noch nicht manuell abgenommen; bestehender Revisionsbrowser bleibt Arbeitsweg.

### UI01 — Gespeichertes Siegerteam und Zuschauer im V4-Ehrensaal

- V4-Gesamtdrehung und korrigierte Ehrensaalgrafik erhalten.
- Unteres Display bei Team-Einträgen: alle gespeicherten Mitglieder, 3x2 Plätze.
- Antippen wechselt den ausgewählten historischen Sieger oben.
- Auswahlkontur, Pokal für letzten Sieger und Schillernd-Markierung unterscheiden.
- Individuelle Siege und Levelgewinne aus dem gespeicherten Lauf anzeigen.
- Einzel-Sieger-/Alt-Einträge bleiben ehrliche Urkunden ohne heutige Teamrekonstruktion.
- Pixel-Zuschauer nur während der Ehrung; bei reduzierter Bewegung statisch.
- Teststand mit sechs Mitgliedern über vorhandenen echten Liga-Ablauf erzeugen.
- Review-Fall 7 erhält diesen geprüften Stand; bisherige Datei vorher sichern.
- Übrige Review-Fälle, Tasten, Profil und Startweg unverändert.
- Lokale Grafikliste im bestehenden Runner ergänzen, keine externen Medien.
- Rückpfeil für ALLE Zurück-Navigationen freigegeben; globale Übernahme als nächster Schritt offen.
- Keine weiteren JSON-Uploads als Arbeitsweg: Terminalblöcke und kurze Copy-paste-Ausgaben.
- Neue Teamansicht/Zuschauer noch nicht manuell abgenommen.

### UI01 — Team-Reviewtests: Raumfarben und geschützter Pflegeplatz

- Drei Farbfehler stammen aus falscher Erwartung für einen übermalten Hintergrundpixel.
- Originale Raumgrafik unverändert; Wand, Boden und Teppich jetzt getrennt exakt prüfen.
- CARE_MEMBER_PINNED ist die gewünschte Regel, kein zu umgehender Fehler.
- Synthetisches Testteam behält das Pflege-Pokémon und ergänzt fünf Mitglieder.
- Pflege-Pokémon in der Testfixture kampfstark vorbereiten, Produktionsregeln unverändert.
- Teamreihenfolge und Pflege-Mitglied im gespeicherten Siegerteam ausdrücklich prüfen.
- Review-Spielstand erst nach erfolgreichem gesamten Prüflauf übernehmen.
- Bisheriger Review-Fall 7 wird vor Übernahme gesichert.
- Alte Liga-Testfixtures mit Entfernen des Pflegeplatzes bei weiteren Prüfungen beachten.
- Globale Übernahme des freigegebenen Rückpfeils bleibt als nächster Schritt offen.

### UI01 — Team-Vorbereitung behandelt erzwungene Wechsel regulär

- Darstellungstests bestanden; verbleibender Fehler betrifft Vorbereitung des Team-Spielstands.
- Annahme 'kein erzwungener Wechsel' im neuen Reviewtest war falsch.
- Besiegte Mitglieder nicht erneut auswählen; echte sichtbare Teamauswahl verwenden.
- Beim erzwungenen Wechsel Runde, Gegner-KP, neue eigene KP und besiegtes Mitglied prüfen.
- Keine Heilung, Wiederbelebung oder Umgehung von Produktionsregeln.
- Gespeicherten letzten Sieger mit dem tatsächlich letzten Angreifer vergleichen.
- Vollständiges gespeichertes Team, 26 Siege und unveränderte Historie weiterhin prüfen.
- Anwendungscode, Darstellungsprüfungen und ursprünglicher Liga-Test unverändert.
- Review-Fall 7 weiterhin erst nach komplett erfolgreicher Prüfung übernehmen.

### UI01 — V4: reine Kachelnavigation und jubelnde Pokémon

- Zusätzliche Start-Level-/Siege-/Levelgewinne-Zeile im unteren Teamdisplay entfernen.
- Historische Daten bleiben gespeichert und über die vorhandene Infoansicht erreichbar.
- Pokémon-Pfeile rechts in V4 entfernen; Auswahl ausschließlich über die unteren Kacheln.
- Konstante Teamplatz-Geometrie über sämtliche Mitgliedswechsel prüfen.
- Menschenfiguren durch echte Pokémon-Sprites ersetzen.
- Bei Team-Einträgen jubeln gespeicherte Kameraden neben dem ausgewählten Sieger.
- Bei Einzelsiegern sind generische Pokémon-Zuschauer reine Dekoration, kein erfundenes Team.
- V4-Konfetti deutlich dichter und während der geöffneten Ehrung sichtbar.
- Reduzierte Bewegung: statische Zuschauer und statisches Konfetti.
- Gerätehülle, Rückpfeil, Raumgrafik und Speicher-/Belohnungslogik erhalten.
- Vorhandener Review-Teststand bleibt nutzbar; keine erneute Spielstandvorbereitung nötig.
- Neue Detailrunde noch nicht manuell abgenommen.

### UI01 — Gemeinsamer Rückpfeil für bestehende Zurück-Navigation

- Freigegebenen gebogenen Rückpfeil als gemeinsame Grafik in icons.js ergänzen.
- Bekannte DOM-Navigationsbereiche ausstatten; keine beliebige globale Textersetzung.
- Bestehende Schaltflächen, Handler, Sperren und Geometrie erhalten.
- Übersetzte zugängliche Namen und textContent-Verträge erhalten.
- Abbrechen, Beenden, Später, Zurücksetzen und Vormerkung-Aufheben nicht umdeuten.
- Canvas-Zurückstellen verwenden dieselbe Grafik; Zielrechtecke und Tap-Funktionen unverändert.
- Keine neuen Spielstände, keine Änderungen an Produktionsregeln.
- Aktuelle Ruhmeshalle ausdrücklich ausnehmen und Datei unverändert lassen.
- Neuester V4-Stand mit reiner Kachelnavigation und jubelnden Pokémon bleibt erhalten.
- Komponenten-/Rendererprüfungen und sichtbare Navigation in vier Sprachen ergänzen.
- Globale Umsetzung noch nicht manuell abgenommen; keine Paket-/Gesamtfreigabe.

### UI01 — Rückpfeil: spanische Menü-Rückkehr über menu.home

- Gemeinsame Rückpfeilprüfung scheiterte ausschließlich bei spanischem menu.home.
- Vorhandenen Übersetzungsschlüssel menu.home zusätzlich zu common.back erkennen.
- Keine pauschale Umdeutung von Volver-/Retry-Schaltflächen.
- Komponentenregression für Volver al Pokémon, Atrás und ausgeschlossenen Retry ergänzen.
- Bestehende Browserassertionen unverändert.
- Rücksprungfunktionen, Klickflächen, Sperren und Ruhmeshalle unverändert.
- Globale sichtbare Abnahme weiterhin offen.

### UI01 — Liga-Review: startfähiger Kader und echter Zwischenstand

- Globale Rückpfeilprüfungen bestanden und Nutzer hat im Review getestet.
- Nächster Bereich: Liga-Zwischenstands- und Fortsetzenansicht.
- Zunächst tatsächlich startfähige Review-Spielstände vorbereiten.
- Fall 5: Kanto-Liga startbereit, acht Orden, 100 Energie, Sechserteam.
- Fall 6: echter gespeicherter Zwischenstand nach erstem Ligasieg.
- Eine Heilung regulär verbrauchen, damit verbleibende Kontingente sichtbar prüfbar sind.
- Pflege-Pokémon im Team behalten; über reguläre Team-Umsortierung ans Ende stellen.
- Kampfstarkes synthetisches UI-Testteam; keine Aussage zur normalen Spielbalance.
- Start und Fortsetzen einschließlich Reload, Rest-KP und Heilungen tatsächlich prüfen.
- Bisherige Spielstandsdateien 5/6 behalten; Review-Zuordnung erst nach erfolgreichem Test ändern.
- Fall 7, Ruhmeshalle, übrige Fälle und Anwendungsoberfläche unverändert.
- Vorhandenen Runner, Profil und Tasten weiterverwenden.
- Keine neue Spielstand-Upload-/Export-Arbeitsweise.
- Neue Liga-Zwischenstandsoberfläche noch nicht umgesetzt.

### UI01 — Review-Runner lädt Liga-Teamcodec für Zwischenstände

- Neuer Liga-Zwischenstand benötigt TPLeagueTeamState auch bei der Node-Vorprüfung.
- Vorhandenes league-team-state.js in die bestehende Runner-Ladeliste aufnehmen.
- Alle acht Review-Spielstände vor Änderung mit vollständigen Prüfmodulen decodieren.
- Keine Validierung abschalten, keine Spielstände umschreiben oder neu erzeugen.
- Profil, Browserinstallation, Tasten und Startbefehl unverändert.

### UI01 — Liga-Zwischenstand im gemeinsamen Pokédexrahmen

- Nutzer bestätigt: neue Liga-Start-/Zwischenstands-Spielstände vorhanden und funktionsfähig.
- Startbereite Liga-Auswahl unverändert lassen.
- Fortsetzbare Team-Läufe zeigen links nächsten Gegner und Fortschritt.
- Rechts gespeicherten Ligakader mit KP, Heilungen, aktiver Position und besiegten Mitgliedern zeigen.
- Daten ausschließlich aus nativer Ligaansicht, nicht aus heutiger Teamplanung.
- Kaderanzeige bleibt lesend; kein neuer Wechsel-/Heilweg außerhalb des Kampfes.
- Bestehende Fortsetzen-, Neustart-, Varianten- und Gegnerteam-Vorschauaktionen erhalten.
- Tatsächliche Energiekosten weiterhin aus bestehender Energieansicht.
- Endgültigen Abschluss, Kampfansicht und Ruhmeshalle erhalten.
- Tests/Helfer auf sichtbaren Fortsetzen-Button statt alte Canvas-Koordinate umstellen.
- Gespeicherte KP/Heilungen im Browser gegen echten Checkpoint prüfen.
- Keine Spielstände neu erzeugen oder überschreiben.
- Neue Zwischenstandsansicht noch nicht manuell abgenommen.

### UI01 — Liga-Zwischenstand: Porträtfortschritt und lesbare Statuskacheln

- Zeile 1/26 besiegt entfernen; Fortschritt als fünf vorhandene Trainerporträts.
- Aktuellen Trainer markieren, abgeschlossene Trainer mit Häkchen, kommende zurückhaltend.
- Große Gegnerdarstellung tiefer, Name darunter.
- Allgemeinen Fortsetzen-Erklärungssatz entfernen; tatsächliche Fehlermeldungen erhalten.
- Nächstes Gegner-Pokémon mit Level, Artentypen und Pokéball-Fortschritt zeigen.
- Rechts 2x3 Plätze erhalten, aber volle Kachelbreite statt schmaler Seitenspalte nutzen.
- KP-Balken und KP-Zahl getrennt, fünf kleine gespeicherte Heilungsmarkierungen.
- Eigene besiegte Pokémon: grauer Sprite, Besiegt-Hinweis, echte 0 KP, leerer Balken.
- Namen/Zahlen lesbar lassen; KO nicht nur durch Farbe ausdrücken.
- Anzeige bleibt lesend, keine Heilung oder Wiederbelebung außerhalb des Kampfes.
- Bestehende Savegames 5/6, Kampfregeln, Rückpfeil und Ruhmeshalle unverändert.
- Neue Detailrunde noch nicht manuell abgenommen.

### UI01 — Liga-Ablauf: Einzelsieg kompakt, Übersicht zwischen Trainern

- Rechtes Display heißt Dein Team.
- Heilungsmarkierungen aus dieser Übersicht entfernen; gespeicherte Kontingente erhalten.
- Nach bestätigtem Einzelsieg innerhalb eines Trainers Kampfansicht mit Weiter zeigen.
- Kein automatischer Angriff und kein ungefragtes Fortsetzen.
- Große Übersicht an Trainergrenzen 5/10/15/20 sowie beim Wiederöffnen/Reload.
- Champ-Pokémon 21 bis 25 bleiben innerhalb desselben Trainerkampfs; Abschluss 26 bleibt Ruhmeshalle.
- Übersicht ist aus der kompakten Siegrückmeldung bewusst erreichbar.
- Flüchtige Sieganzeige an Modul, Region, Phase und bestätigten nächsten Index binden.
- Bestehende native Speichertransaktionen unverändert.
- Kein Weiter nach abgelehntem Speichern; Retry bleibt bestehender Kampfablauf.
- Rest-KP, Heilungen, Levelboni, Kader und Kosten unverändert.
- Alte Canvas-Aktionsziele während kompakter Bestätigung nicht auslösen.
- Vorhandene Spielstände und Ruhmeshalle unverändert.
- Tests für Speicherfehler, Retry, bewusstes Weiter, Reload und Trainergrenze ergänzen.
- Neuer Ablauf noch nicht manuell abgenommen.

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

### UI01 — Kampfmenü: Aufgeben zuerst funktional absichern

- Nutzer meldet vermuteten funktionslosen Aufgeben-Button.
- Bestehende Abbruchpfade enthalten Browser-confirm; durch gemeinsame In-Game-Abfrage ersetzen.
- Frage Wirklich aufgeben? mit Ja/Nein, standardmäßig Nein fokussieren.
- Nein und Escape verändern keine Kampfwerte.
- Ja ruft bestehenden modusabhängigen Abbruch auf; doppelte/stale Bestätigung sperren.
- Dialog an Modul, Kampf-ID, Modus, Region, Runde, aktives Mitglied und KP binden.
- Keine Abbruchaktion während Speicher-/Ergebnissperren.
- Gemeinsamer Story-Abbruch erhält ausdrücklich bestätigten Aufruf ohne zweite Browserabfrage.
- Testhelfer verwendet sichtbares In-Game-Ja statt automatischem Browserdialog.
- Echte Browserprüfungen für Wild-, Trainer-, Arena- und Ligakampf.
- Keine Rückerstattung oder Änderung an Kampf-/Speicherregeln.
- Noch keine gedrehte Kampfoberfläche umgesetzt.
- Danach vollständiges Gerät drehen: oberes Display Kampfbild mit beiden Pokémon,
  unteres Display vorhandene Aktionen und Untermenüs.
- Ruhmeshalle und abgenommener Liga-Zwischenablauf erhalten.
- Neue Bestätigung noch nicht manuell abgenommen.

### UI01 — Aufgeben bestätigt; Dialog unten mit Ja grün und Nein rot

- Nutzer bestätigt die In-Game-Aufgeben-Funktion als passend.
- Dialog im unteren Bedienbereich positionieren; Kampfbild darüber sichtbar lassen.
- Ja mit grünem, Nein mit rotem Hintergrund.
- Nein bleibt zunächst fokussiert.
- Bekannte Nein-/Escape-/Ja-Funktionen, Besitzerbindung und Speichersperren unverändert.
- Browserprüfungen für Position, Farben und Anfangsfokus ergänzen.
- Keine neuen Spielstände, kein Browser-Neustart und keine Regeländerungen.
- Vollständig gedrehte Kampfoberfläche weiterhin als nächster Umsetzungsschritt offen.
- Neue Dialogposition/Farben noch nicht manuell abgenommen.

### UI01 — Gedrehtes Kampfgerät einschließlich Wildfang-Ergebnis

- Nutzer bestätigt Aufgeben-Abfrage vorläufig als passend.
- Im gedrehten Gerät gehört die Abfrage ausschließlich ins untere Display.
- Ja grün, Nein rot; geprüfte Abbruchfunktion und Sicherheitsbindung erhalten.
- Vollständige Gerätehülle wie Ruhmeshalle um 90 Grad drehen.
- Oberes Display im Kampf: bisheriges Kampfbild mit beiden Pokémon.
- Unteres Display: vorhandene Kampfaktionen und Untermenüs.
- Zusätzlich Wildfang-Ergebnisseite an diese Gestaltung anpassen.
- Nach erfolgreichem Fang oben gefangenes Pokémon, unten Ergebnis/Aufnahmeaktionen.
- Vorhandene gemeinsame Aufnahme-/Team-/Boxentscheidungen weiterverwenden.
- Fangsequenz, Speicherung, Retry, wartende Aufnahme und Schutz vor Doppelbuchung erhalten.
- Keine neue parallele Fangverwaltung und keine Änderungen an Kampfregeln.
- Ruhmeshalle und abgenommener Liga-Zwischenablauf unverändert.
- Gedrehte Kampf-/Fangoberfläche noch nicht umgesetzt oder abgenommen.

### UI01 — Erster gedrehter Kampf- und Wildfang-Prototyp

- Ganze Gerätehülle wie Ruhmeshalle um 90 Grad drehen; Linse und Mittelsteg drehen mit.
- Oberes Display erfasst bestehendes Kampfbild vor alten Menüüberlagerungen.
- Unteres Display verwendet vorhandene Aktions-IDs, Beschriftungen und Sperren.
- Aktionen weiterhin über bestehenden zentralen Eingabedispatcher führen.
- Identität, Runde, Menü und tatsächlichen nativen Kampf vor DOM-Aktion prüfen.
- Testhelfer auf sichtbare gedrehte Bedienelemente abbilden, virtuelle Aktionsziele erhalten.
- Aufgeben-Abfrage an tatsächliche untere Displayfläche binden.
- Bestehende bestätigte Liga-Siegrückmeldung mit ihren echten Buttons unten anzeigen.
- Große Ligaübersicht und Ruhmeshalle erhalten.
- Wildfangsequenz und Speicherzustände unverändert.
- Bestätigtes Fang-Ergebnis mit tatsächlichem Fang-Snapshot darstellen.
- Native Aufnahmeentscheidung mit ihren vorhandenen Buttons ins untere Display übernehmen.
- Keine neue Fang-/Aufnahmeverwaltung, keine neuen Kampf- oder Speicherregeln.
- Fehlende lokale Medien nicht durch externe Downloads ersetzen.
- Keine Spielstände neu vorbereiten oder überschreiben.
- Erster Prototyp noch nicht manuell abgenommen.

### UI01 — Kampfgeräte-CSS von bestehender Aktivitätsvorschau isolieren

- Trainer-/Arena-/Liga-Vorschau wurde durch zu breite neue .tp-battle-scene-Regeln überlagert.
- Gemeinsamer Klassenname war vorhanden; neue Gerätepositionierung darf nur unter #tp-battle-page gelten.
- Sämtliche neuen .tp-battle-Komponentenregeln auf diesen Gerätecontainer begrenzen.
- Bestehende Aktivitätsvorschau, Auswahlknopf und deren ursprüngliche Geometrie erhalten.
- Regression prüft Positionierung, tatsächliches Element am Klickpunkt und normalen Klick.
- Keine force-Klicks, keine Pointer-Events-Kaschierung, keine Timeout-Erhöhung.
- Abbruchlogik, Fangtransaktionen, Spielstände und Ruhmeshalle unverändert.
- Gedrehter Kampf-Prototyp weiterhin nicht manuell abgenommen.

### UI01 — Kampf/Fang: größere Darstellung und Aufnahmeaktionen innerhalb des Displays

- Äußere Gerätehülle unverändert lassen; obere Zeichenfläche an tatsächliches Display anpassen.
- Im Kampf Hintergrund separat übernehmen, Pokémon/KP passend neu zeichnen.
- Native Kampf-/Fangzustände und Aktionsziele unverändert.
- Originale Fangsequenz während Animation/Speicherung erhalten.
- Bestätigt gefangenes Pokémon größer mit Alpha-Zuschnitt; Level deutlich größer.
- Rahmen mit Kampfkontext und aktueller Bedienebene/Runde beschriften.
- Native Aufnahme-Schaltflächen unverändert weiterverwenden und sinnvoll gruppieren.
- Aufnahmeaktionen innerhalb unteren Displays; bei vielen Optionen intern scrollen.
- Doppelte Namens-/Levelzeile unten ausblenden, da oben sichtbar und zugänglich beschriftet.
- Keine Umbenennung oder Funktionsänderung der Aufnahmeaktionen in dieser Runde.
- Keine Änderung an Speicherung, Team-/Boxentscheidung, Regeln oder Review-Spielständen.
- Ruhmeshalle unverändert.
- Diese Detailrunde noch nicht manuell abgenommen.

### UI01 — Fangszene und Team-Untermenü konsistent darstellen

- Aktuelle Kampf-Darstellungsgröße erhalten.
- Fanganimation im aktuellen Displaymaßstab, native Phasen/Timing/Ergebnisse unverändert.
- Name, Bild und Level beim Fang-Ergebnis kompakt zentrieren.
- Normale Aufnahmeentscheidung: Ins Team aufnehmen und In Box ablegen.
- Boxen öffnen und Später im eingebetteten Fangdialog entfernen.
- Rückpfeil bei Ersetzungsauswahl und notwendiger Rückkehr aus vollem Speicher erhalten.
- Keine Aufgabe eines gefangenen Pokémon und keine neuen Aufnahme-/Speicherwege.
- Tatsächliche Speicherfehler und notwendiges Neuladen sichtbar halten.
- Fester Informationsraum über Kampfbuttons.
- Team-Untermenü mit Bildern, Namen, KP und aktiver/besiegter Kennzeichnung.
- Ruhmeshalle und Review-Spielstände unverändert.
- Neue Detailrunde noch nicht manuell abgenommen.

### UI01 — Sechs feste Teamplätze und bestätigte Nicht-Fang-Entscheidung

- Nicht-Fang-Button heißt nicht fangen.
- Erster Klick öffnet ausschließlich UI-Bestätigung, setzt noch keinen nativen Fangabschluss.
- Rückpfeil rechts unten kehrt zur offenen Wahl Fangen/nicht fangen zurück.
- Weiter bestätigt und schließt ohne Fang über vorhandene Native-Aufrufe ab.
- Keine Rücksetzung bereits abgeschlossener Fangzustände und kein zusätzlicher Fangwurf.
- Beide Team-Auswahlen: sechs feste Plätze, Bilder, Namen, tatsächliche verfügbare KP, kein Scrollen.
- Unbekannte KP ausdrücklich als unbekannt anzeigen, nicht mit vollen KP auffüllen.
- Geschützten Pflegeplatz und native Wechsel-/Ersetzungssperren erhalten.
- Boxaktion in Ersetzungsauswahl als Symbol im Rahmen, kein siebter Displayplatz.
- Temporär Heilen als viertes Kampf-Untermenüfeld; vorhandenes Kontingent unverändert.
- Blocken als spätere echte Kampfaktion außerhalb UI01 vormerken; nicht implementieren.
- Allgemeine Aufforderung Wähle deine Aktion entfernen, reale Rückmeldungen erhalten.
- Ruhmeshalle, Spielstände und Produktionsregeln unverändert.
- Neue Detailrunde noch nicht manuell abgenommen.

### UI01 — Aufnahme-Boxsymbol rechts in der Rahmen-Bedienleiste

- Nutzer beanstandet Boxsymbol links auf Rahmen/Display.
- Boxaktion gehört rechts neben die Displays in die gemeinsame Rahmen-Bedienleiste.
- Vorhandene Toolbar-Position aus Pokédex-Designwerten verwenden.
- Bei vollständiger Drehung nicht von ungedrehten right/bottom-Ecken ausgehen.
- Position rechts außerhalb der Displayfläche automatisch prüfen.
- Symbol, Handler, Aufnahmeentscheidung, Spielstände und Ruhmeshalle unverändert.
- Neue Position noch nicht manuell abgenommen.

### UI01 — Regionale Ehrenei-Auswahl als gedrehtes Gerät

- Nutzer gibt Ehrenei-Seite als letzten Gestaltungsbereich dieser Sitzung frei.
- Gedrehte Hülle, aufrechte Inhalte, Auswahlkacheln und Rahmenaktionen.
- Vier oder sechs Auswahlkacheln je nach tatsächlich verfügbarem Platz.
- Einmalige Reservierung mit spielinterner Ja-/Nein-Bestätigung.
- Bestehende regionale Speichertransaktion unverändert übernommen.
- Aktuelle Pflege, normaler Eierplan und Anspruchsregeln unverändert.
- Bestehende Kanto-Browsertests auf sichtbare DOM-Bedienung umgestellt.
- Geometrie, Seitenwechsel und schreibfreier Bestätigungsabbruch ergänzt.
- Testausführung und manuelle Abnahme noch offen.
- Danach Sitzung sichern und Dokumentation lesbar strukturieren:
  aktuelle Kurzfassung getrennt vom vollständig erhaltenen historischen Archiv.
- UI01 bleibt aktiv; Spiele, Canvas-/Kartenbereinigung, Mega-Ansicht,
  Ruhemodus-Zugang und Gesamtabschluss weiter mitführen.
- Kein Commit, Push, P07-Start oder Spielstandumbau.

### UI01 — Ehrenei-Startfehler: Englisch vor Deutsch registrieren

- Erster Ehrenei-Browserlauf: fünf fehlgeschlagen, ein Fall nicht ausgeführt.
- Alle fünf sichtbaren Fehler betreffen den deaktivierten Ruhmeshallen-Ehrenei-Button.
- Ursache im neuen UI-Code: deutsche Schlüssel vor englischem Basiskatalog registriert.
- Bestehendes Sprachregister verlangt ausdrücklich Englisch zuerst.
- Nur Reihenfolge korrigiert; keine Zugangs- oder Anspruchssperre aufgehoben.
- Startprüfung mit echtem Sprachregister vor dem Schreiben bestanden.
- Separaten Node-Regressionstest für erfolgreiche API-Initialisierung ergänzt.
- Browser-Wiederholung und manuelle Abnahme weiterhin offen.
- Nutzer benötigt zusätzlich einen geprüften Review-Spielstand vor dem Champ:
  Top Vier vollständig besiegt, Champ offen, kampffähiger eigener Kader.
- Bestehenden Generator und Checkpoint-Codec dafür zuerst abgleichen.
- Noch keinen neuen Champ-Spielstand erzeugt oder als vorbereitet melden.
- Nach Ehrenei-Abnahme lokale Sitzungssicherung und lesbare Dokumentationsaufteilung.

### UI01 — Ehrenei-Review: Frage, rechte Pfeile und Buttonfarben

- Nutzer meldet vorherigen Ehrenei-Testlauf als passed.
- Nutzer verwendet vorhandenen Spielstand; keinen neuen Champ-Spielstand eingerichtet.
- Pokémon-Darstellung im unteren Display ausdrücklich als sehr gut bewertet.
- Diese Darstellung unverändert erhalten.
- Obere Statuszeile: Soll das dein nächstes Ei werden?
- Beide Seitenpfeile vollständig rechts in der Rahmenleiste.
- Auswahlhaken bleibt rechts neben dem unteren Display.
- Rahmenbuttons transparent; Kacheln in gemeinsamer Displayfarbe,
  auch bei ausgewähltem Pokémon. Auswahlkontur bleibt erhalten.
- Ja grün und Nein rot ausdrücklich gegen überlagernde Buttonregeln absichern.
- Browserprüfungen für Positionen, Hintergründe und Bestätigungsfarben ergänzt.
- Tests und Sichtabnahme dieser Korrekturrunde noch offen.
- Vorhandenen Review mit r weiterverwenden; keine Spielstände verändern.
- Danach lokale Fortschrittssicherung und lesbare Dokumentationsaufteilung.

### UI01 — Ehrenei: verbindliche Hintergrund- und Positionskorrektur

- Vorherige Assistenteninterpretation ausdrücklich vom Nutzer zurückgewiesen.
- Alle Pokémon-Kacheln und Buttons verwenden denselben gemeinsamen
  Button-/Kachelhintergrund wie andere Seiten, über --tp-card.
- Keine transparenten Rahmenbuttons und keine Displayfarbe als Kachelfarbe.
- Gilt auch für ausgewählte Kacheln und Buttons nach der Auswahl.
- Haken rechts neben dem oberen Display.
- Beide Seitenpfeile rechts neben dem unteren Display.
- Pokémon-Darstellung unverändert erhalten.
- Bestehender Spielstand und Review bleiben erhalten.
- Tests und Sichtprüfung dieser Korrektur noch offen.
