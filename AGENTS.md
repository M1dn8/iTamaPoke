# Arbeits- und Übergabehinweise

Vor Änderungen docs/PROJECT-PLAN.de.md sowie Git-Status und Branch lesen.
Dort stehen der vereinbarte Ablauf, die Aufgaben und der nächste Schritt.
docs/ROADMAP.ko.md ist eine ältere Quelle und bleibt unverändert, bis
ihre Aufgaben ausdrücklich gegen den aktuellen Stand abgeglichen wurden.

- Ein aktives Paket bearbeiten; neue Wünsche im Plan nachführen.
- Vor Abschluss den Plan mit tatsächlichem Test-/Deploymentstatus aktualisieren.
- Kopierbare Terminalbefehle bereitstellen; keine GitHub CLI voraussetzen.
- Keine Schnittstellen raten; zuerst betroffene Dateien und Tests lesen.
- Tests nicht abschwächen und Qualitäts-/Deployment-Sperren nicht umgehen.
- Vor Veröffentlichung gezielte und zentrale Prüfungen ausführen.
- CI-Erfolg nicht mit manueller iPhone-Abnahme gleichsetzen.
- Keine privaten PNG-/BIN-Medien oder ungeklärten Bildrechte als frei behandeln.
- Keine Zusicherung dauerhafter Chat-Erinnerung: versionierte Übergabe nutzen.

## Verbindlicher manueller Revisionsbrowser

Vor Arbeiten an sichtbaren Änderungen zuerst diese Datei,
docs/PROJECT-PLAN.de.md und docs/TEST-WORKFLOW.de.md lesen.

- Bestehenden interaktiven Runner verwenden:
  tools/review/manual-review.cjs.
- Ein Terminal startet lokalen Server und sichtbaren Browser gemeinsam.
- Vorhandenen Playwright-Chromium und sein eigenes Reviewprofil verwenden.
- Testbadge, direkte Testspielstandwahl und Screenshot/Notiz-Funktion erhalten.
- Nicht durch normalen Chrome, einen einfachen Webserver mit manuellem
  Spielstandimport oder täglich neue Startverfahren ersetzen.
- Keine neue Browserinstallation oder Änderung des normalen Chrome-Profils.
- Vor dem ersten manuellen Review benötigte Testspielstände vorbereiten
  und die konkreten Startbefehle vorab ausgeben.
- Bei reinen JS-/CSS-/Textänderungen im bestehenden Review neu laden;
  bei nativen Änderungen vorher den aktuellen WASM-Kern bauen.
- Erst gemeinsam ansehen und korrigieren; vollständige Abschlussprüfungen
  erst nach manueller Paketabnahme auf unverändertem Stand.
- Automatische Tests und deren Browserkontexte bleiben davon getrennt.
- Keine dauerhafte Chat-Erinnerung zusichern: diese versionierten
  Anweisungen sind die maßgebliche Grundlage für Folgesitzungen.

## Gemeinsame Übergänge aller Legendären-Geschichten

- Begegnungs-Tippsperre und Aufnahmesequenz sind gemeinsame Funktionen.
- Gilt für Zapdos und Arktos sowie künftig Lavados, Mewtu, Mew und
  alle weiteren Legendären-Geschichten einschließlich späterer Regionen.
- Vorhandene gemeinsame Storyoberfläche und story-tap-guard.js verwenden.
- Keine separaten abweichenden Kopien dieser Abläufe je Pokémon anlegen.
- Neue Storyprofile mit eindeutiger Quelle, Pokémon-ID und Route anlegen.
- Die gemeinsame Finale-Registrierung und den gemeinsamen Aufnahmedialog
  verwenden, damit auch manuelle und verspätete Aufnahmen zurückführen.
- Finale erst nach dauerhaft bestätigter Aufnahme zeigen: automatisch,
  nach Teamtausch, nach Boxentscheidung oder nach später freiem Platz.
- Kein Finale bei Speicherfehler, wartender Aufnahme oder „Später“.
- Wiederholte Rückmeldungen dürfen keine doppelte Aufnahme, Belohnung,
  Tagebuchbuchung oder automatische Finale-Rückleitung auslösen.
- Berührungen aus der vorherigen Ansicht dürfen kein Prüfduell starten.
- Halten und schnelles Weitertippen prüfen, nicht nur eine feste Wartezeit.
- Bewegungsreduktion und vorhandene Speicher-/Retryregeln erhalten.
- Bei neuen Geschichten diese Übergänge im Browser und auf dem iPhone
  mitprüfen; reine Modell-/Nativeprüfungen ersetzen dies nicht.
