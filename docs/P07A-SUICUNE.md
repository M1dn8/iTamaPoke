# P07a — Suicune: Die verborgene Quelle

Freigabe des konkretisierten Entwurfs: 09.11.2026, 22:26 CET.
Dokumentiert: 2026-11-09T22:28:51+01:00
Ausgangs-HEAD: cd1f6e34a6b026623064e3a6e76cc8ab60cddef3

## Umfang
P07a umfasst gemeinsame Johto-Storygrundlagen und Suicune als ersten
vollständigen Pilotfall. P07b bis P07d werden noch nicht implementiert.
UI01 bleibt abgenommen; bestätigte Oberflächen nicht erneut gestalten.

## Geschichte
Eine stille Waldquelle ist durch einen unterbrochenen Bachlauf getrübt.
Blätter sammeln sich in kleinen Wirbeln; zwischen den Bäumen liegt Nebel.
Ein blauer Lichtschein deutet die Begegnung an, ohne Suicune vorwegzunehmen.

Einstieg:
„Zwischen den Bäumen liegt eine stille Quelle. Ihr Wasser fließt kaum noch.
Für einen Augenblick schimmert etwas Blaues im Nebel.“

Nach vollständig verbundenem und gespeichertem Wasserweg:
„Das Wasser beginnt wieder zu fließen. Ein kühler Wind streicht über
die Quelle. Am anderen Ufer steht Suicune.“

## Freigegebene Regeln
- Zugängliches Johto und mindestens vier unterschiedliche Johto-Orden.
- Sichtbarer Geschichtenname zunächst: Die verborgene Quelle.
- Drei drehbare Bachstücke; jeder bewusste Tipp dreht um eine Vierteldrehung.
- Wasserfluss zeigt die tatsächlich verbundene Strecke.
- Kein Zeitlimit, keine Strafe für falsche Stellungen.
- Keine zusätzlichen Energiekosten oder neue Währung für die Wasseraufgabe.
- Nur die vollständige Verbindung löst den gespeicherten Aufgabenabschluss aus.
- Unvollständiger Versuch darf bei Neustart zurückgesetzt werden.
- Gereinigte und dauerhaft gespeicherte Quelle bleibt erledigt.
- Begegnung erst nach bestätigter Speicherung des Aufgabenabschlusses.
- Prüfkampf gegen Suicune auf Level 50.
- Bestehendes Story-Kampfsystem verwenden, keine eigene Schadensberechnung.
- Niederlage oder Abbruch verliert die gespeicherte Quellenreinigung nicht.
- Späterer erneuter Begegnungsversuch bleibt möglich.
- Bestehender gemeinsamer Aufnahmeablauf.
- Finale erst nach dauerhaft bestätigter Aufnahme.
- Zunächst keine zusätzliche Spezialbelohnung neben Pokémon/Storyabschluss.

## Darstellung
Maßgeblich ist die am 09.11.2026 um 23:01 CET freigegebene Entscheidung
in [P07A-STORYMODUS.md](P07A-STORYMODUS.md).

- Eigene gemeinsame Storybühne statt kleiner Auswahl-/Vorschaudisplays.
- Breite übereinanderliegende Displays im vorhandenen Pokédex-Stil.
- Große Quellenlandschaft mit demselben Bachlauf, der tatsächlich bedient wird.
- Drei markierte Abschnitte; ausgewählten Abschnitt unten vergrößert drehen.
- Sichtbarer Wasserfluss nur durch tatsächlich verbundene Abschnitte.
- Eigene Kompositionen für gereinigte Quelle und vollständige Suicune-Begegnung.
- Grafisch, verspielt und atmosphärisch; keine technische Text-/Kachelsammlung.
- Bewegungsreduktion und fehlende echte Grafik ausdrücklich behandeln.
- Vorhandene Wasserweglogik bleibt erhalten.

## Gemeinsame Schutzregeln
- Letzter Aufgabentipp darf keinen Kampf starten.
- Begegnung verlangt nach Berührungsruhe eine neue bewusste Eingabe.
- Pflege-Pokémon bleibt geschützt; vorhandene Team-/Boxentscheidung verwenden.
- Wartende Aufnahme bei Platzmangel bleibt dauerhaft erhalten.
- Reload darf kein Individuum und keinen Storyabschluss duplizieren.
- Kein Finale bei Speicherfehler, wartender Aufnahme oder Später.
- Spätere erfolgreiche Aufnahme erreicht dasselbe Finale.
- Kanto-Fortschritt und normale Spielstände bleiben unverändert.
- Gemeinsame Story-, Tippsperren-, Aufnahme- und Finalebausteine weiterverwenden.

## Technisch vor Umsetzung abgleichen
- Bestehende Storyregistrierung, Zugriffsgates und regionale Fortschrittsleser.
- Gemeinsamer Aufgabenvertrag: attach/dispose, Sperren und Abschlusscallback.
- Bestehende Spielstands-/Storytransaktion für den Aufgabenabschluss.
- Konkrete Kampfkosten und Kaderregeln des vorhandenen Storypfads übernehmen;
  vor Anschluss prüfen, keine zusätzlichen Zahlen oder Sonderregeln erfinden.
- Wasserstückformen, Positionen und gültige Verbindungen so festlegen,
  dass echte Durchgängigkeit statt einer geratenen Drehfolge geprüft wird.
- Benötigte Textschlüssel und Registrierung in den vorhandenen Sprachen.
- Vorhandener Revisionsbrowser: Teststände zuerst vorbereiten, Profil erhalten.

## Umsetzungsschritte
1. Quellenansicht und Wasserweg-Aufgabe als zusammenhängenden Prototyp.
2. Im bestehenden Revisionsbrowser ansehen und grafisch nacharbeiten.
3. Johto-Freischaltung und gespeicherten Aufgabenabschluss anbinden.
4. Begegnung, Prüfkampf, Aufnahme und Finale durchgängig anschließen.
5. Nur betroffene gezielte Prüfungen während der Entwicklung.
6. Technische Prüfung, sichtbare Abnahme und iPhone-Abnahme getrennt dokumentieren.

Diese Datei hält die Freigabe fest. Sie behauptet keine bereits
implementierte, gespeicherte oder getestete Suicune-Geschichte.

<!-- P07A-NATIVE-VORBEREITUNG-20261111 -->
## Native Vorbereitung — technischer Zwischenstand

Geprüft: 2026-11-11T22:39:31+01:00

- Suicune-Profil mit eigenen Schlüsseln und Johto-Zuordnung ergänzt.
- Zugriff: bestehendes Regionsgate plus vier unterschiedliche Johto-Orden.
- Kanto-Profile behalten ihre Schlüssel und bisherigen Bedingungen.
- Quellenabschluss benötigt gültiges Token und vollständig verbundenen Weg.
- Allgemeiner Vorbereitungsschalter kann Suicunes Aufgabe nicht abschließen.
- Gezielte native Prüfung bestanden: Zugriff, ungültige Metadaten,
  Rücknahme, Commit, In-Memory-Neuladen und Wiederholungsverweigerung.
- Alle 64 Abschlussstellungen gegen das bestehende JS-Modell geprüft.
- Prüfung verwendet ausschließlich synthetische Preferences.
- Kein Nachweis einer dauerhaften Browser-/Dateispeicherung.
- Noch kein neuer WASM-Build und keine produktive Browseraktivierung.
- Vor Aktivierung folgen gemeinsame JS-Modell-/Spielstandsvalidierung,
  Serviceanschluss und bestätigte Speicherung im bestehenden Savepfad.
- Kampf, Aufnahme und Finale für Suicune weiterhin nicht angeschlossen.

<!-- P07A-JS-VORBEREITUNG-20261111 -->
## JS-Modell und Vorbereitungsspeicher — technischer Zwischenstand

Geprüft: 2026-11-11T22:54:40+01:00

- Suicune als Profil des gemeinsamen Storymodells ergänzt.
- Gemeinsamer Spielstandsprüfer kennt Suicune-Story, Hinweisstatus,
  Aufnahmeverknüpfung und individuelle Herkunft.
- Gemeinsamer Service verwendet für Suicune regionale Ordenmetadaten.
- Quellenabschluss über tp_suicune_source_complete, nicht über den
  allgemeinen Vorbereitungsschalter.
- Drei Rotationen werden streng geprüft und unveränderlich übergeben.
- Gezielte JS-Prüfung bestanden, einschließlich zurückgehaltener
  Veröffentlichung sowie simuliertem Speicherfehler und Wiederholung.
- Native Aufrufe und Speicherbestätigungen im JS-Test sind simuliert.
- Keine tatsächliche Browser-/IndexedDB-Speicherung damit nachgewiesen.
- Kein neuer WASM-Build, keine aktive Suicune-Story im Katalog.
- Als Nächstes: vorhandenen Collection-Controller anbinden und den
  Quellenabschluss mit echtem Browser-Speicherpfad prüfen.
- Suicunes Kampf, Aufnahme und Finale bleiben noch anzuschließen.

<!-- P07A-BROWSER-SPEICHER-20261111 -->
## Tatsächlicher Browser-Speicheranschluss

Geprüft: 2026-11-11T23:03:22+01:00

- Suicune-Modell vor dem Spielstandsprüfer geladen.
- Service in vorhandene Bridge-/Collection-Controller-Kette eingebunden.
- Bestehenden WASM-Kern gebaut; neue Schnittstellen im Kernpaar geprüft.
- Gezielte Chromium-Prüfung mit echtem Kern und Browser-Speicherpfad bestanden.
- Regionsgate verhindert Vorbereitung trotz vier Johto-Orden ohne Johto-Zugriff.
- Zurückgehaltene Speicherbestätigung veröffentlicht keine Begegnungsphase.
- Absichtlich fehlgeschlagene Speicherung rollt die Quellenreinigung zurück.
- Erfolgreicher Wiederholungsversuch bleibt nach Reload erhalten.
- Geprüfte Kanto-Fortschrittsfelder unverändert.
- Der Test bedient den Service direkt, nicht die sichtbare Wasseraufgabe.
- Suicune-Katalogeintrag und vorhandene Quellenoberfläche noch nicht produktiv
  angeschlossen. Kampf, Aufnahme und Finale bleiben weitere Schritte.
- Keine WebKit-/iPhone-Abnahme und kein vollständiger P07a-Abschluss.

<!-- P07A-LIVE-QUELLE-20261111 -->
## Sichtbare Bachbedienung — technischer Zwischenstand

Geprüft: 2026-11-11T23:12:20+01:00

- Getrennter produktiver Aufruf TPSourceStoryStage.openLive().
- Vorhandene Vorschaufälle bleiben ohne Speicherung.
- Gezielte Chromium-Prüfung bei 320/390 bestanden:
  sichtbare Drehbedienung, ausstehende Bestätigung, Fehler/Wiederholung,
  bestätigter Übergang, Reload und unveränderte Vorschau-Speicherneutralität.
- Der letzte Drehtipp öffnet weder Begegnung noch Kampf.
- Manueller produktiver Review noch offen.
- Noch kein Kataloganschluss, Prüfkampf, Aufnahme oder Finale für Suicune.
