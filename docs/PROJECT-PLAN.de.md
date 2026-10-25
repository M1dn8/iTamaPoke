# Projektplan und Übergabe — iTamaPoke

Stand dieser Planfassung: 25.10.2026.
Diese Datei ist die maßgebliche Aufgaben- und Übergabeliste für die
hier vereinbarten Browser-/iPhone-Erweiterungen.

## Aktueller Arbeitsstand

- Aktives Paket: P02 Dokumentation und Kontinuität — Textbereinigung.
- Arbeitsbranch: docs-trainer-labels.
- P01 abgeschlossen mit Commit 99091dc.
- Gezielter Schutztest und vollständige zentrale Prüfung lokal bestanden.
- CI-/Veröffentlichungsworkflow laut Nutzerbestätigung erfolgreich.
- Keine Spieloberfläche oder Spielmechanik in P01 verändert; keine neue
  eigenständige iPhone-Abnahme dieses Schutzpakets durchgeführt.
- Letzter abgenommener Funktionsstand:
  Kanto-/Johto-Teamübersichten, 26 lokale Trainerporträt-Zuordnungen,
  TPTR-v1/v2, Quellenanzeige.
- Dieser Funktionsstand wurde nach grüner CI auf dem iPhone abgenommen.
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
| P02 | Dokumentation und Kontinuität | In Arbeit | Niedrig | Plan/Übergabe versioniert; veraltete Format-/Quellentexte geprüft und bereinigt |
| P03 | Erweiterbare Spracharchitektur | Offen | Mittel–hoch | Sprachregister, Textschlüssel, Rückfallsprache, persistente Sprachwahl und Prüfung fehlender Übersetzungen |
| P04 | Eigenes Team mit bis zu sechs Pokémon | Offen | Hoch | Auswahl aus besessenen individuellen Pokémon, Reihenfolge, Entfernen/Ersetzen, Speichern und Laden; keine unbeabsichtigten Duplikate |
| P05 | Eigenes Team in Kämpfen | Offen | Sehr hoch | Vereinbarte Kampfarten unterstützen Team, Wechsel, besiegte Mitglieder, Heilung, Ergebnis und Fortsetzen ohne Speicherfehler |
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
  Prüfung lokal bestanden. CI, Veröffentlichung und kurze iPhone-
  Textprüfung noch bestätigen.
- Alte Roadmap docs/ROADMAP.ko.md bleibt erhalten. Ihr historischer
  Aufgabenstatus ist nicht automatisch der aktuelle Projektstatus.
- Diese Roadmap ist ein Plan, kein Nachweis abgeschlossener Implementierung.

## Nächster konkreter Schritt

P02: lokale Prüfungen bestanden. Commit und Veröffentlichung durchführen.
Danach CI-Erfolg und kurze iPhone-Textprüfung bestätigen:
Trainerdateien-Zähler sowie Quellenabschnitt für Arenaleiter/Top Vier/Champs.
Erst anschließend P02 abschließen und P03-Spracharchitektur vorbereiten.

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
