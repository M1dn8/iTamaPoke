# E3 - Mega-Flunkifer, dritte unterstuetzte Form

Ausgangsstand: main 31b481d48b72ef848d9637795742b5173180242c.
Drei Formen: Glurak X (Form 1, Steinbit 1), Metagross (Form 2, Steinbit 2),
Flunkifer #303 (Form 3, Steinbit 4). Mega-Flunkifer verwendet Stahl/Fee.
Kein zusaetzlicher Hauptmenueknopf. Vorhandene neunte Mega-Seite und Profil-Link
werden fuer das aktive Flunkifer sichtbar; andere nicht unterstuetzte Arten
bleiben unveraendert. Name/Spitznamen-Anzeige bleibt formabhaengig wie abgenommen.

Steine sind trainerweit getrennt dauerhaft freigeschaltet. Neuer mgver=3.
- E1 mgver=1/mgstone migriert weiterhin ausschliesslich zum Glurak-X-Bit.
- E2 mgver=2/mgmask behaelt ausschliesslich die bisherigen Bits 1 und 2.
- E3 mgver=3/mgmask erlaubt Bits 1, 2 und 4, auch alle drei gemeinsam.
Alte Flunkifer-Spielstaende bekommen weder Stein noch Trainingsfortschritt
rueckwirkend. Vorhandene E1-/E2-Zeiten, Cooldowns und gueltige Glurak-/Metagross-
Aufgabenfortschritte werden erhalten. Unbekannte Maskenbits werden verworfen.
Kein zugesicherter Rueckweg zu E2: vor der Veroeffentlichung externe aktuelle
Spielstandsicherung behalten. Quellcode-Backup ist KEINE Spielstandsicherung.

Unveraenderte Regeln: Bindung mindestens 50, alle Pflegewerte mindestens 60,
drei positive Trainingsabschluesse mit dem aktuellen unterstuetzten Individuum.
Aktivierung 15 Minuten, danach 60 Minuten trainerweite Pause ab geplantem Ende.
Angriff x1.60, Verteidigung x1.40, Tempo x1.25; unveraenderte vorlaeufige Werte.
Keine Kampferweiterung, neuen Belohnungen oder neue Faehigkeiten in diesem Paket.

Private Grafiken: p303-mega.bin und ps303-mega.bin. Sie werden nicht mit dem
Spielcode veroeffentlicht und muessen separat aus den geprueften lokalen Quellen
exportiert werden. Kein automatischer Grafikdownload durch die App, kein Ersatz
durch normales Flunkifer oder andere Mega-Formen. Fehlende passende Grafik
verhindert Aktivierung und Cooldown-Start. Normale Dateien p303.bin/ps303.bin
bleiben normale Flunkifer-Grafiken; Mega-Dateien zaehlen nicht als neue Dex-Arten.

Metagross-Renderfaktor 0.75 und Namensfix bleiben unveraendert. Flunkifer benutzt
die vorhandene normale PMD-Skalierung. Kampfsnapshot und Grafikcache trennen
Formen und Farbvarianten; Ablauf waehrend eines Kampfes bleibt wie in E2 behandelt.
Tagebuchtexte verwenden die gemeinsame Frontend-Formzuordnung.

Alle vorhandenen Pruefungen bleiben aktiv. Neue native Tests pruefen E1/E2-
Migration, alle acht Masken, keine Gratisfreischaltung, Aufgabe, Reload, Zeit,
Cooldown, Identitaet und Ruecknahme fehlgeschlagener Speicheraktionen. Neue JS-
Pruefungen: genaue Dateinamen, Cache, Grafikpflicht, Namensanzeige, Tagebuch und
Native/JS-Vertrag. Isolierte Browser-Fixtures testen Flunkifer-Import/Aufgabe,
Aktivierung, Reload und Stahl/Fee-Kampfanbindung. Sie ersetzen KEINE echte
Grafik-/Groessen-/Aktionsabnahme auf dem iPhone.

Bestehendes Metagross nicht ersetzen, nicht zuruecksetzen und keine kuenstliche
Aufzucht erzwingen. E3 erst nach gruenem GitHub-Gesamtprueflauf veroeffentlichen.
Die bereits lokal betrachtete Flunkifer-Galerie ersetzt keine Spielabnahme.
