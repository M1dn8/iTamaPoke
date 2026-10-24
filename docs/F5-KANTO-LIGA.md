# Kanto-Liga: begrenzter erster Liga-Baustein

Top Vier und Champ, erste Teams aus Rot/Blau. Quellen:
https://github.com/pret/pokered/blob/master/data/trainers/parties.asm
https://www.serebii.net/rb/elitefour.shtml
Nur Fakten ueber Teams/Level uebertragen; keine Original-Kampflogik oder Bilder.
Varianten Glurak/Turtok/Bisaflor vor Start waehlbar, waehrend Lauf unveraendert.
Freigabe nach agver1/agmask255. Insgesamt 26 Gegner-Pokemon, 5 Heilungen fuer
GESAMTEN Lauf, normaler vorhandener Heileffekt und unveraenderte Kampfmathematik.
Arenen/Trainer/Wild bleiben bei zwei Erholungen. Kein eigenes Wechselteam.

Einstieg: Arenenansicht unten links Liga. Zurueck unten rechts. Bestehender
mittiger Zurueck-Treffpunkt bleibt im rechten Rueckknopf. Ordenskoffer bleibt.
Alle Teams ansehen, Variante waehlen; acht Orden erforderlich fuer Start.
Liga verwendet eigenes natives BattleRuntime mit der existierenden Engine,
keine Wildfangoption, keine Trainings-/Item-Belohnung pro Gegner.

Zwischenstand nach JEDEM besiegten Pokemon wird mit dem normalen Savecodec
und force/epoch/single-flight-Gate dauerhaft gespeichert. Kein Weiter, bevor
IDB-Bestaetigung und native Finish bestaetigt sind. Fehler vor Commit rollt
Pet/Preferences komplett zurueck und erlaubt erneutes Speichern. Nach durablem
Commit wird bei unerwartetem Finishfehler kein fiktiver Rollback behauptet.

Pausieren ist an bestaetigten Sieg-Zwischenstaenden moeglich. KP, verbleibende
Heilungen, Gegnerindex und eingefrorene Kampfwerte bleiben exakt erhalten.
Unterbrechung IN EINEM LAUFENDEN KAMPF beendet diesen Lauf; er ist nicht an
alten vollen KP wiederaufnehmbar. Neustart beginnt dann bei Lorelei. Das ist
bewusst keine Mid-Turn-Speicherung. UI nennt den unterbrochenen Zustand.
Aktuelle Pflegeidentitaet/Nonce, Art, Gene, Shiny und Mindestalter binden den
Zwischenstand; ein neues Pflege-Pokemon darf ihn nicht uebernehmen.

Profilfelder lgver1/lgkrun (88 Byte Little-Endian mit FNV-Pruefsumme),
lgkdone bool, lgkdate Zeitstempel. Unbekannte Versionen/kaputte Datensaetze
sperren Liga ohne automatische Reparatur. Kanto-Abschluss bleibt trainerweit;
erster Abschlusszeitstempel bleibt bei Wiederholung. Spielreset loescht alles
wie bisher. Alte Spielstaende ohne Ligafelder werden erst bei Ligaaktion
angepasst. Noch keine Johto-Freigabe/Regionenoberseite oder Trainerportraets.
Diese kommen als eigene Folgebausteine; vorhandene Kanto-Grafiken bleiben.

Native Tests: alle 3 Varianten durch 26 durable Siege mit Rollbacks, HP/Rest,
Battle-Besitz, 8-Orden-Gate, Identitaet und unbekannte Zukunftsmetadaten.
Synthetische Siegesmarkierung im Transaktionstest, keine Behauptung aller
Balancing-Szenarien. Bestehende Engine fuer echte Aktionen. JS: Katalog,
Single-flight, deferred save, echte Finish-/Gate-Verwendung. Browserfaelle
fuer echte Heal-/Kampfaktionen und Reload-Checkpoint; noch auszufuehren.
Keine behauptete WASM-/iPhone-Abnahme allein durch Node/Native-Tests.
