# P07a — lokaler Abschluss vom 20.11.2026

## Aktueller Freigabestand — 22.11.2026

### Nachtrag — Liga-Testvorbereitung, 22.11.2026, 23:18 CET

<!-- P07A-LIGA-SETUP-CI-FIX-20261122 -->
- GitHub-Lauf für f06798e erreichte 116 bestandene Browserprüfungen.
  WebKit-Liga-Fall scheiterte beim Testteamaufbau; 37 Fälle liefen nicht.
- Gezielte Zustandsprüfung belegte die offene Entwicklungsentscheidung
  choice=evolve bei ansonsten freier Sammlung.
- Liga-Testvorbereitung lehnt die angebotene Entwicklung über den sichtbaren
  Nein-Button ab und prüft unveränderte Art und aktive Pflege-Identität.
- Vollständiger Bereitschaftsnachweis vor Sammlungsänderungen ergänzt.
- Keine produktive Sperre umgangen; keine Liga-Assertion entfernt,
  keine Timeout-Erhöhung und keine Test-Retries ergänzt.
- Gezielter WebKit-Liga-Fall bestanden: 1 Test, 11 Sekunden Gesamtlaufzeit.
- Bericht: itamapoke-review-Vl2cwj; zusätzlich außerhalb des Repositorys gesichert.
- Nur Testvorbereitung geändert; Spielcode und bestätigte Gestaltung unverändert.
- Dieser Nachtrag und die Liga-Spec bilden den nächsten Korrekturcommit.
- Vollständiger 154er-GitHub-Nachweis, Veröffentlichung und iPhone-Abnahme offen.
- P07b–d nicht begonnen.


### Nachtrag — Reviewprofil-Test, 22.11.2026, 22:46 CET

<!-- P07A-REVIEWPROFIL-CI-FIX-20261122 -->
- Der weitere GitHub-Lauf stoppte im zentralen Check am simulierten
  Reviewprofil-Routentest; noch kein erfolgreicher 154er-Release-Nachweis.
- Testkontext um names und finishReviewNames vervollständigt.
- Asynchrones openStory wird im Test jetzt mit await ausgewertet;
  Fehler werden an den Testprozess weitergereicht.
- Bestehende Routenerwartungen unverändert; zusätzlicher Test für einmalige
  Delegation direkter Sichtfälle ohne Rückfall in die Storyroute.
- Nutzer meldet gezielten Reviewprofil-Test und Diff-Check als bestanden.
- Runner, Spielverhalten und bestätigte Darstellung unverändert.
- Testkorrektur und dieser Nachtrag bilden den nächsten Korrekturcommit.
  GitHub-Freigabelauf, Veröffentlichung und iPhone-Abnahme bleiben offen.
- P07b–d nicht begonnen.

### Vorheriger Korrekturstand

<!-- P07A-CI-KORREKTUR-20261122 -->
Diese Aktualisierung hat bei zeitabhängigen Status- und Freigabeangaben
Vorrang vor dem darunter erhaltenen Abschlussstand vom 20.11.

- Nutzer hat den bestehenden Commit-/Push-/Veröffentlichungsweg am 22.11.
  ausdrücklich freigegeben.
- P07a-Ausgangsstand als 47db00a5728421135abbd048c2308774abe156dd
  committed und auf origin/main gepusht.
- GitHub-Qualitätslauf im zentralen Check an retro-ui.test.js gestoppt;
  kein erfolgreicher 154er-Release-Nachweis aus diesem Lauf.
- Vier Schriftdefinitionen des Suicune-Wasserkampfs auf die gemeinsame
  Monospace-Variable korrigiert; Größen, Farben und Abstände nicht geändert.
- Bestehende eingebettete Reisebuch-SVG unverändert erhalten.
- Retro-UI-Test akzeptiert ausschließlich die geprüfte Grafikregel per
  festem SHA-256; zusätzliche Imports, externe URLs und andere Data-URLs
  werden durch Negativprüfungen weiterhin abgelehnt.
- Gezielter Retro-UI-Test einschließlich Negativprüfungen bestanden.
- Nutzer bestätigt am 22.11. um 22:33 CET den Browser-Sichtcheck:
  „Ja, im Browser geprüft und alles sieht sauber aus“.
- Diese Korrekturen werden mit dieser Statusaktualisierung zusammengeführt.
  Erneuter GitHub-Freigabelauf und Veröffentlichung noch nicht bestätigt.
- Historischer 68er-Abschlusslauf bleibt dokumentiert; er wird nicht als
  erneuter Lauf auf dem schriftkorrigierten Stand ausgegeben.
- Endgültige P07a-Freigabe und iPhone-Gegencheck weiterhin offen.
- P07b–d nicht begonnen.

## Erhaltener Abschlussstand vom 20.11.2026

<!-- P07A-LOKALER-ABSCHLUSS-20261120 -->
Dokumentiert: 2026-11-20T23:28:28+01:00
Branch: main
HEAD: cd1f6e34a6b026623064e3a6e76cc8ab60cddef3
Maßgeblich ist der lokale Arbeitsbaum einschließlich unversionierter Dateien.

## Verbindlicher Status
- P07a lokal umgesetzt; bestätigte Gestaltung nicht erneut aufrollen.
- Gemeinsame Chromium-/WebKit-Abschlussauswahl bestanden.
- Releasepflichtprofil auf 154 Browserprüfungen erweitert und Erfassung geprüft.
- Der vollständige 154er-Releaselauf wurde damit NICHT ausgeführt.
- Keine endgültige Release-/iPhone-Freigabe.
- Kein Commit, Push oder Deployment freigegeben oder durch diesen Abschluss ausgeführt.
- P07b–d nicht begonnen.

## Umgesetzt und bestätigt
- Suicune: Quellenaufgabe, bestätigte Speicherung, Katalog, Begegnung,
  Prüfkampf, gemeinsame Aufnahme und Reisebuch-Abschluss.
- Suicune: automatische Aufnahme, Teamtausch, spätere Boxaufnahme,
  Speicherfehler/Retry, normale Animation und vollständig belegte Boxen geprüft.
- Arktos: bereits bestätigte gemeinsame Bühnen-/Begegnungs-/Finaledarstellung erhalten.
- Pflegewechsel: fehlenden Zugang zur Pflegeplatz-Auswahl bei vollem Team korrigiert.
  Acht Fälle: kleines/volles Team, Freilassen/Behalten, Wildkampf/Arena.
- Entwicklung: direkte Hauptbildschirm-Abfrage; keine Pflichtweiterleitung
  oder Browserbestätigung. Eindeutige und verzweigte Zielwahl geprüft.
- Entwicklungsfenster kompakt, weiß, Ja grün und Nein rot;
  Nutzer bestätigt die letzte Darstellung am 20.11. um 23:06.
- Ordenübergaben: gemeinsamer Pokédex-Renderer für Kanto und Johto.
  Speicherung/Retry, Wiederholung ohne zweite Verleihung, Niederlage und Reload geprüft.
- Nutzer bestätigt Kanto-/Johto-Ordenübergabe im manuellen Review.
- Nicht jeder der 16 Arenasiege wurde einzeln als Sichtfall durchgespielt.

## Gemeinsamer Abschlussnachweis
34 Fälle je Browser, Chromium und WebKit:
- Quellenpfad: 7
- Gemeinsame Bühne/Arktos: 6
- Suicune-Aufnahme: 6
- Pflegewechsel/Kampfzugang: 8
- Hauptbildschirm-Entwicklung: 4
- Regionale Ordenübergabe: 3

68 bestandene Fälle ohne Skip/Flaky/Fehler im lokalen Bericht bestätigt.
Ursprungsbericht: /var/folders/3c/wh907z7d081_tmmlzhb6_jfm0000gn/T/itamapoke-review-h6Kq5t
Berichtsdateien zusätzlich im lokalen Sicherungsordner aufbewahrt.

Nach diesem Browserabschluss wurden die Release-Erfassung und Dokumentation
angepasst; keine weitere Spielcodeänderung in diesen Abschlussblöcken.

## Vor endgültiger Paket-/Veröffentlichungsfreigabe
1. Den verbindlichen Veröffentlichungsweg mit erweitertem Pflichtprofil
   erfolgreich durchlaufen; 154 registrierte Fälle sind noch kein Laufnachweis.
2. Den tatsächlich korrigierten Stand kontrolliert auf dem iPhone prüfen:
   Suicune-Pilotablauf, Pflegewechsel bei vollem Team, direkte Entwicklung
   und Ordenübergabe. Bestehenden Spielstand und private Medien erhalten.
3. Erst nach erfolgreichem Gerätegegencheck P07a endgültig freigeben.
4. Commit/Push/Deployment weiterhin nur nach ausdrücklicher Freigabe.

## Danach
P07b: Raikou und Entei auf derselben gemeinsamen Grundlage.
Keine erneute Gestaltung bestätigter Suicune-/Arktos-Flächen.
P07c: Lugia/Ho-Oh. P07d: Celebi und Gesamtabschluss.

## Arbeitsweise
- Vor Änderungen Git-Status und diesen Abschluss lesen.
- Keine alten Schreibblöcke wiederholen und keinen alten Upload als aktuellen Stand behandeln.
- Bestehenden Revisionsbrowser und sein Profil für Gestaltung verwenden.
- Automatische Tests für Funktion/Speicherung; Uploads nur bei konkretem Bedarf.
- Keine täglichen neuen Browserprofile, Installationen oder pauschalen Testschleifen.
- Projekt-Node: $HOME/.nvm/versions/node/v24.22.1/bin/node
- SDK nur bei nötigem Build: $HOME/Developer/emsdk/emsdk_env.sh

## Historie
Frühere aktuelle Übergaben unverändert archiviert:
[Dokumentationsarchiv](archive/P07a-vor-lokalem-Abschluss-20261120-232828-158449/).
Die Historie ist keine aktuelle Aufgabenliste.
