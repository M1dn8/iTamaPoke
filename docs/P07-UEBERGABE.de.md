# P07 — Legendären-Geschichten Johto

<!-- P07-PLAN-FREIGEGEBEN-20261105 -->
Planungsfreigabe durch den Nutzer: 05.11.2026, 23:13 CET.
Dokumentiert: 2026-11-05T23:18:24+01:00
Ausgangs-HEAD: 62164c0c3aee40f3456feca3e6b63413ff21f0da

## Verbindlicher Stand
- UI01 ist im vereinbarten Umfang abgenommen: grüner Build und iPhone-Abnahme.
- Nutzer bewertet den vorgeschlagenen P07-Ablauf positiv und gibt ihn
  als Grundlage für die Fortsetzung frei.
- Teilpaketfolge und sechs Geschichten sind die vereinbarte Planungsgrundlage.
- Die folgenden Storyideen sind erste Entwürfe, keine fertigen Spezifikationen.
- Morgen Geschichten gemeinsam finalisieren und im vorhandenen grafischen,
  verspielten Design ausarbeiten.
- Noch keine P07-Implementierung, Spielregeln oder Medien erstellt.
- Heute keine weiteren Entwicklungs- oder Testarbeiten.

## Freigegebener Teilpaketablauf

### P07a — Grundlage und Suicune
- Vorhandene gemeinsame Geschichtenarchitektur für Johto weiterverwenden.
- Suicune als erste vollständig durchgehende Geschichte umsetzen.
- Freischaltung, Vorbereitung, Begegnung, Prüfkampf, Aufnahme,
  Finale und Wiederaufnahme an diesem Pilotfall zusammenführen.
- Erst danach weitere Storyprofile ergänzen; keine sechs parallelen Baustellen.

### P07b — Raikou und Entei
- Dieselben Speicher-, Begegnungs-, Aufnahme- und Finale-Bausteine verwenden.
- Eigene Szenen, Aufgaben und Rückmeldungen statt bloßer Umbenennung.
- Keine getrennte Kopie der gemeinsamen Schutz- und Speicherlogik.

### P07c — Lugia und Ho-Oh
- Zwei größere Höhepunkte des Johto-Geschichtenpakets.
- Thematisch ausgearbeitete Begegnungen mit Meeres-/Sturm- beziehungsweise
  Turm-/Glocken-/Regenbogenmotiv.
- Konkrete Voraussetzungen und Aufgaben erst finalisieren.

### P07d — Celebi und Paketabschluss
- Celebi als spätere besondere Geschichte.
- Wald-, Wachstums- und Zeitmotiv als Entwurfsgrundlage.
- Gesamtzusammenhang, Abschlussdarstellung und Restabnahme von P07.

## Erste Geschichtenentwürfe — erhalten und morgen weiterentwickeln

| Pokémon | Atmosphäre / Schauplatzidee | Erste Aufgabenidee |
|---|---|---|
| Suicune | Verunreinigte Quelle, Nebel und klares Wasser | Wasserlauf wiederherstellen und die Quelle reinigen |
| Raikou | Gewitterpfad, Strom und aufleuchtende Spuren | Eine kurze Blitzfolge erkennen und richtig beantworten |
| Entei | Verbrannte Landschaft, Glut und wiederkehrendes Leben | Einen sicheren Weg durch die Glut herstellen |
| Lugia | Meeresgrotte, Strömungen und Sturm | Strömungen beruhigen und den Begegnungszugang öffnen |
| Ho-Oh | Turm, Glocken und Regenbogenlicht | Eine Glockenfolge vervollständigen |
| Celebi | Waldheiligtum, Wachstum und Zeitmotiv | Eine beschädigte Lichtung wiederherstellen |

Diese Ideen sind TamaPoke-Entwürfe. Sie sind weder als festgelegte
Originalspielabläufe noch als bereits fertige Spielmechaniken auszugeben.

## Gemeinsamer Ablauf
1. Hinweis erst nach erfüllter Voraussetzung.
2. Geschichte im bestehenden Geschichtenbereich sichtbar machen.
3. Kurze Vorbereitung oder passende Aufgabe.
4. Bewusster neuer Tipp startet die Begegnung beziehungsweise den Prüfkampf.
5. Bestehender Aufnahmeablauf nach Erfolg.
6. Finale erst nach dauerhaft bestätigter Aufnahme.
7. Abgeschlossene Geschichte eindeutig kennzeichnen.

Keine unnötigen Spoiler für noch nicht freigeschaltete Geschichten.

## Gestaltung
- Grafisch und verspielt im bestehenden, abgenommenen UI01-Stil.
- Vorhandene Gerätehülle, Displays, Navigation, Icons und Grundfarben verwenden.
- Thematische Szenen und verständliche visuelle Rückmeldungen ausarbeiten.
- Keine neue parallele Designsprache und keine Neugestaltung bestätigter Seiten.
- Gemeinsame Aufgabenbausteine nutzen; nicht sechs isolierte Minispielsysteme bauen.
- Echte private Grafiken über vorhandenen Import und Grafikpakete verwenden.
- Synthetische Testgrafiken niemals als echte Reviewgrafiken übernehmen.

## Aufnahme, Identität und Speicherung
- Pflege-Pokémon bleibt geschützt.
- Bei vollem Team bestehende Austausch-/Boxentscheidung verwenden.
- Ausgetauschte Mitglieder behalten; keine Individuen löschen.
- Bei fehlendem Platz wartende Aufnahme dauerhaft erhalten.
- Reload/App-Neustart darf keine Aufnahme verlieren oder duplizieren.
- Kein vorzeitiges Finale bei Speicherfehler, wartender Aufnahme oder Später.
- Finale auch nach späterer erfolgreicher Aufnahme korrekt erreichen.
- Keine doppelten Pokémon, Belohnungen, Abschlüsse oder Tagebucheinträge.
- Region, Storyquelle und Individuum eindeutig halten.
- Bestehenden Kanto-Fortschritt und vorhandene Spielstände schützen.
- Gemeinsame Begegnungs-Tippsperre und Finale-Registrierung weiterverwenden.

## Noch zu finalisieren — keine Werte erfinden
- Freischaltungen je Geschichte und Reihenfolge ihrer Sichtbarkeit.
- Konkrete Johto-Orden-/Liga-/Storyvoraussetzungen.
- Aufgabenmechanik, Schwierigkeit und eventuelle Zeitgrenzen.
- Gegnerlevel, Kampfparameter und zulässiger Kampfkader.
- Energie/Kosten sowie Verhalten bei Aufgabe oder Niederlage.
- Weitere Belohnungen über die Aufnahme hinaus.
- Texte, Szenenaufbau, Animationen und Finale jeder Geschichte.

Johto nicht mit drei Kanto-Champvarianten gleichsetzen.
Keine täglichen Wartezähler oder Zusatzwährungen nebenbei einführen.

## Arbeitsweise und Prüfungen
- AGENTS.md und docs/ARBEITSWEISE.de.md beachten.
- Tatsächliche bestehende Schnittstellen vor Umsetzung lesen.
- Bestehenden Revisionsbrowser und gespeichertes Profil weiterverwenden.
- Testspielstände zuerst vorbereiten; danach bestehenden Review starten/wechseln.
- Während Entwicklung nur passende kurze Prüfungen.
- Aufnahme, volles Team, Platzmangel, Speicherfehler, Reload,
  schnelle/alte Berührungen und Bewegungsreduktion gezielt absichern.
- Keine Wiederholung vollständiger alter Testsammlungen nach jeder Szene.
- Freigabeumfang vor Veröffentlichung an den neuen Änderungsumfang anpassen.
- Technische Prüfung, sichtbare Abnahme und iPhone-Abnahme unterscheiden.
- Vollständige kopierbare Terminalblöcke; keine neue Browserinstallation.
- Keine privaten Medien oder echten Spielstände veröffentlichen.

## Morgen direkt fortsetzen
1. Diese Übergabe lesen; UI01 nicht erneut aufrollen.
2. P07a / Suicune: Geschichte und spielerischen Ablauf finalisieren.
3. Freischaltung und Aufgaben-/Kampfregeln konkret festhalten.
4. Gemeinsame vorhandene Storybausteine gezielt abgleichen.
5. Erste grafische Szene im bestehenden verspielten Design ausarbeiten.
6. Danach schrittweise implementieren und im vorhandenen Revisionsbrowser prüfen.

Einstiegssatz:
Weiter mit P07a – Suicune: freigegebenen Teilpaketplan lesen,
Quellengeschichte finalisieren und im bestehenden verspielten Design ausarbeiten.
