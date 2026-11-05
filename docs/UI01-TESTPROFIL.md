# UI01-Testprofil

## Verbindliche Veröffentlichung
Ein GitHub-Freigabelauf führt die bestehenden Native-/Node-Prüfungen,
den WASM-Build und das explizite Browserprofil aus.
Die Veröffentlichung verwendet ausschließlich den erfolgreich geprüften,
versiegelten Kandidaten. Medien- und Herkunftsschutz bleiben unverändert.

Die Browserauswahl steht in tools/quality/release-browser.cjs.
Jeder Pflichtbereich hat eine erwartete Fallzahl. Leere Auswahl,
übersprungene Fälle, Flaky-Ergebnisse und Fehler verhindern die Freigabe.
Die kritischen Fälle laufen in Chromium und WebKit; der vollständige
Liga-Flow einmal in WebKit. Weitere Breiten und Varianten sind nicht
automatisch releasepflichtig.

## Lokal
Kein verpflichtender zweiter Gesamtlauf vor GitHub.
Nach einer Änderung nur Syntax, Formatierung und unmittelbar betroffene
kurze Prüfungen ausführen.

## Zusätzliche Regression
Der Workflow 'Erweiterte Regression (manuell)' führt die verbleibende
gesamte Browsersuite ausdrücklich auf Anforderung aus.
Ein erfolgreicher Releaseprofil-Lauf bedeutet nicht, dass diese zusätzliche
Regression ausgeführt wurde.

## Ausgemustert
Die alten Browserdateien retro-ui, ui-unified und navigation-polish
sowie die zwei alten F4-C-Boxenfälle wurden entfernt.
Aktuelle Navigation, Status-/Seitenlayouts, Pflegeabschluss, Boxenaktionen,
Quellen und Speicherverhalten werden von den aktuellen Prüfungen abgedeckt.
collection-team prüft ausschließlich die heutige Teamoberfläche,
geschützten Pflegeplatz, Kapazität, Reload und rücknehmbare Schreibfehler.

## Ergänzung vom 05.11.2026
- Fangabschluss: zwei Fälle in Chromium und WebKit.
- Arena-Sechserteam: vier Fälle je Browser, Kanto und Johto.
- Liga-Pflichtwechsel: ein gezielter Fall in WebKit.
- Erwartete Fallzahlen bleiben verbindlich; keine stillen Auslassungen.
- Automatische Funktionsnachweise ersetzen keine iPhone-Sichtabnahme.

## Abnahme vom 05.11.2026

Nutzer bestätigt grünen GitHub-Build und iPhone-Abnahme einschließlich Grafiken, Wildfang und Pflichtwechsel in Arena/Liga. UI01 im vereinbarten Umfang abgenommen. Keine zusätzliche optionale Gesamtregression daraus behaupten.
