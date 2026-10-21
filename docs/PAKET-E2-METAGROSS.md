# E2 - Mega-Metagross und zwei unabhaengige Mega-Freischaltungen

Zweite unterstuetzte Form: Metagross #376 -> Mega-Metagross, Stahl/Psycho.
Metang #375 bleibt ohne Mega-Seite. Nach regulaerer Entwicklung oder bei bereits
vorhandenem Metagross erscheint dieselbe neunte Kartenseite mit Profil-Link.
Keine neue Hauptkachel und keine Verschiebung der bisherigen Kartenindizes.

Gemeinsame Regeln bleiben: Bindung 50, alle Pflegewerte 60, drei positive
Trainingsabschluesse mit der aktuellen unterstuetzten Endform. Metang-Aktivitaeten
zaehlen nicht rueckwirkend. Aufgabenfortschritt gehoert zum Individuum und wird
bei normaler Entwicklung neu begonnen. Keine veraenderten Evolutionsbedingungen.

Trainer-Steine jetzt als getrennte Bits: Glurak X=1, Metagross=2. Beide koennen
nebeneinander gespeichert bleiben. E1 mgver=1/mgstone migriert ausschliesslich
zum Glurak-Bit, niemals zur Metagross-Freischaltung. Teilfortschritt und laufende
Glurak-Zeiten bleiben erhalten. Neues mgver=2/mgmask. Keine zugesicherte
Abwaertsmigration zu E1: vor Aktualisierung externe Spielstandsicherung behalten.

15 Minuten aktive Form, anschliessend 60 Minuten Pause ab geplantem Ende.
Wie bei E1 bleibt der Cooldown trainerweit gemeinsam, auch nach neuem Ei oder
Wechsel zu einer anderen unterstuetzten Art. Kein Umgehen durch Artenwechsel.
Angriff x1.60, Verteidigung x1.40, Tempo x1.25; vorlaeufige eigene Balancewerte.
E1-Mega-Treffergrenze 45% bleibt; normale Kaempfe 35%. Keine neuen Belohnungen.
Kampf verwendet die beim Start eingefrorene Form und deren Typen/Grafik/Name,
auch wenn die Form ausserhalb des laufenden Kampfes inzwischen ablaeuft.

Lokale TPK2-Dateien:
- p006-mega-x.bin / ps006-mega-x.bin: vorhandene Glurak-X-Grafiken bleiben nutzbar.
- p376-mega.bin / ps376-mega.bin: neue Metagross-Grafiken, separat zu erzeugen.
Keine Pokemon-Grafiken mitgeliefert oder automatisch geladen. Ein normaler
Metagross-Sprite wird nicht stillschweigend als Mega ausgegeben. Fehlende passende
Grafik startet weder Aktivierung noch Cooldown. Variante und Art getrennt im
fluechtigen Grafikcache. Verzeichnis/Webpaket-Guard blockiert beide Namensformen.

Bestehende E1-Tests bleiben aktiv; Masken-Erhalt beim Ei wird mit dem expliziten
Trainer-Maskengetter geprueft. Neue native Tests: E1-Migration inkl. aktiver Form,
getrennte Steine, normale Metang-Entwicklung, Metagross-Werte/Typen/Timer, Reload,
Rollback. JS prueft Dateirouting/Schillernd/Cache/fehlende oder widerspruechliche
Metadaten. Browser pruefen natuerliche Entwicklung ueber bestehende UI, separate
Steinabholung und echte Aktivierung/Kampfanbindung mit kuenstlichem Testpixel.
Keine Aenderung deines echten Spielstands durch Installer oder CI-Fixtures.

Veroeffentlichung erst nach gruenem Branch-Prueflauf. Danach private Mega-Dateien
erzeugen, Vorschauen kontrollieren, importieren. Vorhandenes Metang normal
weiterentwickeln, nicht ersetzen oder beschleunigen. E1-Glurak-iPhone-Abnahme
bleibt separat offen; E2 ist kein Ersatz fuer deren echte Animationspruefung.
