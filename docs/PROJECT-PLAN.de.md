# Projektplan und Übergabe — iTamaPoke

Stand dieser Planfassung: 26.10.2026.
Diese Datei ist die maßgebliche Aufgaben- und Übergabeliste für die
hier vereinbarten Browser-/iPhone-Erweiterungen.

## Aktueller Arbeitsstand

- Aktives Paket: P05b Team in Arena-Kämpfen — implementiert und lokal
  automatisiert geprüft; Commit/Veröffentlichung und iPhone-Abnahme offen.
- P05a bleibt abgenommen: veröffentlichter Funktionsstand 6cf9c07,
  vollständige Nutzerabnahme am 26.10.2026.
- P05b: zentrale Prüfung, aktueller WASM-Build und vollständige Browserprüfung
  lokal erfolgreich; dies ist noch kein CI- oder iPhone-Abnahmenachweis.
- Arbeitsbranch nach Integration: main.
- P01 abgeschlossen mit Commit 99091dc.
- Gezielter Schutztest und vollständige zentrale Prüfung lokal bestanden.
- CI-/Veröffentlichungsworkflow laut Nutzerbestätigung erfolgreich.
- Keine Spieloberfläche oder Spielmechanik in P01 verändert; keine neue
  eigenständige iPhone-Abnahme dieses Schutzpakets durchgeführt.
- Letzter abgenommener Funktionsstand: P05a Team in Wildkämpfen, 6cf9c07.
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
| P05 | Eigenes Team in Kämpfen | In Arbeit; stufenweise Umsetzung | Sehr hoch | P05a zuerst, danach P05b und P05c jeweils getrennt prüfen und abnehmen |
| P05a | Team in Wildkämpfen | Abgenommen am 26.10.2026 | Erledigt | Individuelle Mitglieder, Wechsel, KP, Pokéball-Anzeigen, Levelbonus bis 100 und atomare Ergebnis-/Fangspeicherung |
| P05b | Team in Arena-Kämpfen | Lokal automatisiert geprüft; Veröffentlichung und iPhone-Abnahme offen | Sehr hoch | Individuelle Teams, eigene Heilungsvorräte, regionale Energie-/Ordenstransaktionen und gemeinsame Levelbonus-Speicherung; iPhone-Abnahme noch ausstehend |
| P05c | Team in Liga-Kämpfen | Offen | Sehr hoch | Nach P05b; regionale Läufe, KP, Wechsel, Checkpoints, Ergebnis und Fortsetzung absichern |
| P06 | Legendären-Geschichten Kanto | Offen | Hoch | Ein vollständig abgenommener Pilot, danach vereinbarte weitere Geschichten; Voraussetzungen, Fortschritt, Begegnung und Ergebnis persistent |
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

## Aktuelles Paket P05b — Team in Arena-Kämpfen

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
- P05b noch nicht veröffentlicht; CI-/Deployment-Ergebnis und manuelle
  iPhone-Abnahme sind offen.

## Nächster konkreter Schritt — ausschließlich P05b abschließen

1. Vollständigen Commit-Inhalt einschließlich neuer Dateien prüfen.
2. Dokumentation und Implementierung über normale Git-Befehle committen/pushen.
3. Bestehenden CI-/Build-/Veröffentlichungsworkflow abwarten.
4. Auf dem iPhone Kanto und Johto, individuelle Heilungen, Wechsel,
   Gegnerfortsetzung, Levelboni, Orden, Wiederholung und Neuladen prüfen.
5. Abbruch sowie erreichbare Niederlagenfälle prüfen; nicht ausgeführte
   Fälle ausdrücklich offenlassen und persönliche Spielstände nicht erzwingen.
6. Nur tatsächlich bestätigte Ergebnisse als abgenommen dokumentieren.
7. P05c Liga erst nach P05b-Abnahme beginnen.

## Ideenspeicher

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
