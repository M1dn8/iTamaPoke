# Projektplan und Übergabe — iTamaPoke

Stand dieser Planfassung: 28.10.2026.
Diese Datei ist die maßgebliche Aufgaben- und Übergabeliste für die
hier vereinbarten Browser-/iPhone-Erweiterungen.

## Aktueller Arbeitsstand

- Aktives Gesamtpaket bleibt P06: Legendären-Geschichten Kanto.
- Arktos ist manuell im Revisionsbrowser abgenommen.
- Betroffene Browsergruppen, vollständige Browserregression und zentraler
  nativer Check sind auf identischem Quell-/WASM-Stand bestanden.
- Arktos ist zur Veröffentlichung bereit; GitHub-Ergebnis und
  iPhone-Abnahme des veröffentlichten Standes stehen noch aus.
- Nach diesem Veröffentlichungsabschluss folgt innerhalb von P06 Lavados
  mit acht Kanto-Orden, anschließend Mewtu und Mew.
- UI01 bleibt als eigenständiges Paket nach dem gesamten P06 und vor P07.
- Der interaktive Revisionsbrowser ist verbindlicher Arbeitsweg;
  Start und Bedienung stehen in docs/TEST-WORKFLOW.de.md.

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
| P06 | Legendären-Geschichten Kanto | Aktiv; Arktos lokal abgenommen und Abschlussprüfungen bestanden | Hoch | Arktos zur Veröffentlichung bereit; GitHub-/iPhone-Abnahme offen. Danach Lavados, Mewtu und Mew getrennt festlegen, umsetzen und abnehmen |
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
