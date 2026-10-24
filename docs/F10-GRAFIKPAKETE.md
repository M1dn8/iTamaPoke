# TPAK1 Grafikpakete — Importstabilitaet, noch kein neues Design

Problem tritt bereits im iPhone-Dateiauswahldialog auf. App kann nicht Tausende
nicht uebergebener File-Objekte nachtraeglich retten. Pakete reduzieren die Zahl
der Auswahlobjekte; kein behauptetes fixes iOS-Limit von100. Echte zweite-iPhone-
Auswahl muss nach Installation geprueft werden; setInputFiles simuliert den OS-
Picker nicht. Reale Grafiken bleiben ausschliesslich auf eigenen Geraeten.

Mac-Helfer aus eigenem Grafikordner, Standard32MiB Payload je Paket, konfigurierbar
16..64. Einzelgrafik maximal16MiB, maximal4096 Eintraege. Originalbytes bleiben,
Dateinamen normalisieren, unterschiedliche Duplikate verweigern. Ausgabe ausser-
halb Git/Quellordner. Keine Downloads. Es entstehen grafikpaket-001.bin usw und
ein lokaler JSON-Bericht. Nur Pakete aufs iPhone, nicht ins Repository/Pages.
Unterstuetzt Normal/Shiny/Mega/Atlas und acht bestehende Kanto-Trainer-BINs.

64Byte Kopf: TPAK, u16 Version1, u16 Flags0, u32 Manifestlaenge, u32 Payload-
laenge, u32 Eintragszahl, 32Byte Manifest-SHA256, 12Byte Null. Danach UTF8JSON
format=TPAK1, entries=[name,offset,size,sha256]. Eintraege grenzen exakt aneinander,
keine unbekannten Namen/Pfade/Duplikate, keine Restdaten. Header/Manifest zuerst,
Payload erst je benoetigter Grafik ueber Blob.slice gelesen und SHA-geprueft.
Kein gesamtes Paket-arrayBuffer, keine 2000 simultanen Lesepuffer. Normale lokale
Validatoren pruefen danach Sprite/PNG-Strukturen wie bisher.

Bestehender zentraler Grafiken/Atlas-Picker, accept.bin unveraendert. Einzel-BINs
bleiben. Aktueller Manager/Trainer-Importer verwendet unveraenderte Live-APIs;
sprites.js/storage-tools.js werden nicht durch aeltere Exporte ersetzt. Trainer
weiter atomar bis8, Sprite/Atlas einzeln nach IDB-Commit. Zusatzindexfehler sind
nicht fiktiv fehlgeschlagene Grafik-Commits. Pause nach aktueller Datei, bei
Hintergrundwechsel Pause anfordern; OS kann trotzdem jederzeit suspendieren.
Bestätigte Grafiken bleiben. Nach Neuoeffnen dieselben Pakete wieder waehlen,
Nur-fehlende anlassen. Vorhandene, nicht als defekt bekannte Namen bleiben
bewusst geschuetzt; diese Inhalte werden nicht erneut gelesen/verifiziert.
Nur mit abgeschalteter Option werden andere gueltige Varianten ersetzt.

Keine Spielstandformataenderung, Native-/WASM-/Kampfregel-Aenderung oder neue
Oberflaechenpalette. Retro-Design ist das naechste eigenstaendige Paket.

Tests: echter Python-Produzent -> echter JS-Reader, Grenzen/Hash/Kanonisierung,
2050 virtuelle Dateien, defekte/manipulierte Header/Inhalte/Pfade, Originaldatei-
Schutz und vorhandene Ausgabe. Neue Browserfaelle verwenden echte IDB/Sprite/
Trainer-Validatoren/PNG-Dekodierung, Pause/Resume/Quota-Sicherheit sowie2050 winzige
synthetische Grafiken. Keine Behauptung gleicher RAM-Belastung wie echte2000
Animationsdateien. Kein OS-Dateiauswahl-/iPhone-Beweis durch Headless-Browser.
