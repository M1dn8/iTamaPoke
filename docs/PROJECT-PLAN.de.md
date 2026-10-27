# Projektplan und Übergabe — iTamaPoke

Stand dieser Planfassung: 27.10.2026.
Diese Datei ist die maßgebliche Aufgaben- und Übergabeliste für die
hier vereinbarten Browser-/iPhone-Erweiterungen.

## Aktueller Arbeitsstand

- Aktives Paket: P06 Legendären-Geschichten Kanto — gemeinsame Aufnahmefunktion
  mit Commit d5119a4 auf main veröffentlicht; Build vom Nutzer als grün
  bestätigt und iPhone-Abnahme am 27.10.2026 erfolgreich abgeschlossen.
- Zapdos bleibt der erste Storypilot: Kraftwerk-Abenteuer und freiwilliger,
  garantierter Anschluss nach gewonnenem Prüfduell freigegeben. Weitere
  Story-/Kampfregeln und die konkrete Storyimplementierung bleiben offen.
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
- Letzter abgenommener Funktionsstand: gemeinsame Aufnahmefunktion als
  P06-Voraussetzung, d5119a4; iPhone-Abnahme am 27.10.2026.
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
| P06 | Legendären-Geschichten Kanto | Aktiv: gemeinsame Aufnahme abgenommen; Zapdos-Pilot offen | Hoch | Aufnahme-Voraussetzung d5119a4 veröffentlicht, Build grün und iPhone-Abnahme am 27.10.2026 bestätigt; nächstes Ziel vollständig abgenommener Zapdos-Pilot, danach vereinbarte weitere Geschichten; Voraussetzungen, Fortschritt, Begegnung und Ergebnis persistent |
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
- Weitere Storydetails, Begegnungslevel, Energie sowie Shiny- und
  Wiederholungsregeln sind noch nicht abschließend beschlossen.
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
- P06 insgesamt und der Zapdos-Pilot sind nicht abgeschlossen.
- Noch kein Kraftwerk-Abenteuer, Prüfduell oder persistenter Zapdos-
  Storyfortschritt implementiert. Die freigegebene Regel, dass ein
  bestätigter Zapdos-Sieg bei voller Sammlung keinen Wiederholungskampf
  erfordert, muss beim Anschluss der Story umgesetzt und geprüft werden.
- Weitere Storydetails, Begegnungslevel, Energie sowie Shiny- und
  Wiederholungsregeln bleiben ausdrücklich freizugeben.
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
- P06 insgesamt sowie Kraftwerk-Abenteuer, Zapdos-Prüfduell und persistenter
  Zapdos-Storyfortschritt bleiben offen.

## Nächster konkreter Schritt — ausschließlich P06

1. Abnahme der gemeinsamen Aufnahmefunktion dokumentarisch versionieren.
2. Für Zapdos die noch offenen Story-/Kampfregeln als begrenzten Vorschlag
   zur Freigabe vorlegen; beschlossene Kraftwerk-Grundlage beibehalten.
3. Vorhandene Story-/Fortschrittsansatzpunkte gezielt prüfen und danach den
   freigegebenen Piloten an den abgenommenen gemeinsamen Aufnahmeweg anschließen.
4. Voraussetzungen, Prüfduell, bestätigten Sieg, wartenden Anschluss,
   Wiederaufnahme sowie Niederlage/Abbruch/Reload/Speicherfehler prüfen;
   anschließend zentrale Regression, Build, Browserprüfungen,
   Veröffentlichung und iPhone-Abnahme des Piloten.
5. Weitere Fälle erst nach abgenommenem Zapdos-Piloten in der vereinbarten
   Reihenfolge Arktos, Lavados, Mewtu, Mew angehen.

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
