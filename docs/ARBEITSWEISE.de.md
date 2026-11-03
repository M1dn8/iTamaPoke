<!-- ITAMAPOKE_BINDING_WORKFLOW -->
# Verbindliche Arbeitsweise für iTamaPoke

Diese Arbeitsweise wurde bereits am Vortag und am 30.10.2026 verwendet.
Sie ist der dauerhafte Standard und muss nicht täglich neu verhandelt werden.

## Vor jedem weiteren Umsetzungsschritt
- AGENTS.md, docs/PROJECT-PLAN.de.md und docs/UI01-UEBERGABE.de.md beachten.
- Git-Status und aktuellen Branch prüfen.
- Ein aktives Paket bearbeiten; aktuell UI01, nicht eigenmächtig P07 beginnen.
- Bestätigte Freigaben, Abnahmen und offene Aufgaben mitführen.
- Lokalen veränderten Arbeitsstand nicht mit älteren Uploads oder GitHub gleichsetzen.
- Benötigte Schnittstellen zuerst aus tatsächlich vorhandenen Quellen prüfen.
- Bereits geänderte Dateien nicht ungefragt zurücksetzen oder überschreiben.

## Übergabe der Änderungen
- Vollständige, direkt kopierbare Terminalblöcke im Chat liefern.
- Eingebetteter Python-/Node-Code innerhalb der Terminalblöcke ist zulässig.
- Keine herunterzuladenden Installationsskripte als Ersatz bereitstellen.
- Kein Drag-and-drop-Ausführen und keine neuen Startprogramme einführen.
- Keine GitHub CLI voraussetzen.
- Vorprüfungen und klare Abbruchmeldungen einbauen.
- Bei Fehlern nach dem Schreiben nicht denselben Block blind erneut ausführen.
- Bereits abgenommene Bereiche nicht nebenbei umgestalten.

## Entwicklung und Tests
- Schrittweise entwickeln, im bestehenden Revisionsbrowser ansehen und korrigieren.
- Während der Entwicklung passende gezielte Prüfungen verwenden.
- Vollständige Tests und Veröffentlichung erst beim vereinbarten Paketabschluss.
- Tests nicht durch Weglassen, größere Pauschaltoleranzen oder versteckte
  alte Bedienwege zum Bestehen bringen.
- Tests an die tatsächlichen Anforderungen und echten Bedienelemente anbinden.
- Vorbereitet, geschrieben, technisch bestanden und sichtbar abgenommen
  ausdrücklich auseinanderhalten.
- Keine vollständige Paketfreigabe aus einem einzelnen grünen Testlauf ableiten.
- Kein automatischer Commit oder Push.

## Bestehender Revisionsbrowser
- Vorhandenen Runner tools/review/manual-review.cjs mit --saves verwenden.
- Vorhandenes gespeichertes Revisionsbrowser-Profil und sichtbare Testmarkierung nutzen.
- Keine neue manuelle Browserinstanz, keinen alternativen Profil-/Serverweg einführen.
- Benötigte Testspielstände zuerst vorbereiten und prüfen.
- Erst danach bisherigen Review mit q beenden und über den bestehenden
  Startbefehl mit dem vorbereiteten Ordner neu starten.
- Kein zusätzlicher manueller Spielstandimport als Ersatz.
- 1–8: jeweiligen Testspielstand neu starten.
- s: Screenshot und Notiz.
- r: neu laden und Fortschritt behalten.
- w: Breite wechseln.
- h: Hilfe.
- q: Review beenden.
- Screenshots und Notizen über diesen vorhandenen Ablauf erfassen.

## Informationsbeschaffung und Dateien
- Vorhandene Quellen, ausgeführte Änderungen und bestätigte Ergebnisse weiterverwenden.
- Falls etwas fehlt, gezielte kurze Terminalausgaben zum Einfügen in den Chat verwenden.
- Keine vollständigen Dateidumps oder Uploads als regulären Arbeitsweg verlangen.
- Nur wenn eine benötigte Datei anders nicht ausgelesen werden kann,
  gemeinsam eine Upload-Lösung als Ausnahme besprechen.
- Keine privaten Medien oder Spielstände veröffentlichen.
- Quellenangaben ersetzen keine fehlenden Bildrechte.
- Vorhandenen lokalen Grafik-/BIN-Import weiterverwenden.

## Änderungen der Arbeitsweise
- Eine bequemere Alternative rechtfertigt keine eigenmächtige Umstellung.
- Technisch tatsächlich notwendige Abweichungen vorher erklären und abstimmen.
- Diese verbindliche Arbeitsweise bei Übergaben mitführen.
- Bei widersprüchlichen älteren Workflowformulierungen gilt diese aktuelle Fassung.

## Ergänzung vom 31.10.2026 — Informationsbeschaffung
- Terminalbefehle und Copy-and-paste-Ausgaben bleiben der Standard.
- Nur gezielte Funktionen oder begrenzte Zeilenbereiche anfordern.
- Keine unnötigen zusätzlichen JSON-Dateien oder Upload-Exporte erzeugen.
- Uploads nur als vorher begründete Ausnahme.
- Abgenommene UI-Bereiche nicht nebenbei erneut gestalten.

## Gebündelte Startübergabe — 01.11.2026

- Zu Sitzungsbeginn genau einen zusammenhängenden Leseblock bereitstellen.
- Eine kompakte Gesamtausgabe zum Einfügen in den Chat, keine regulären Uploads.
- Zentrale Einstiegsdatei: docs/WEITERARBEITEN.de.md.
- Gemeinsam erfassen: AGENTS.md, aktuelle Arbeitsregeln, Fortsetzung,
  Projektstatus, maßgeblichen Testworkflow sowie Git-Branch/HEAD/Status.
- Den maßgeblichen aktuellen Regelstand berücksichtigen, nicht historische
  Zwischenstände ungeprüft als aktuelle Vorgaben übernehmen.
- Bereits gelesene Informationen nicht erneut einzeln anfordern.
- Weitere Quellausschnitte nur gezielt für die konkrete Umsetzung.
- Kein neuer Browserstartweg, keine neue Browserinstallation.
