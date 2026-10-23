# F4-D: lokale Leiter-BINs, Ordenkoffer und Offline-Quellen

Entwicklungsbaustein, keine Releasefreigabe. Basis: bestaetigter Vollabgleich
vom 23.10.2026 22:15 (253 Dateien), f4-collection-a,
977c0f7814adde840504295ccfcd36dda9ed6ddb. Kein nativer C++-Code,
kein Spielstandformat, Gene, Level, Kampfregeln oder Fanglogik geaendert.

## Grafikimport

Menue -> Einstellungen -> Dateien verwalten -> Grafiken laden (Pokemon und
Leiter). Auch der Grafikknopf in der Arena oeffnet denselben .bin-Import.
Pokemon, Shiny, Mega, Atlas und Leiter koennen gemeinsam ausgewaehlt werden.
Nur neuer Namespace trainer-kanto-{rocko,misty,major-bob,erika,koga,sabrina,
pyro,giovanni}.bin. Dateiname muss zur Kennung passen. Kein Umbenennen einer
PNG/TPK2 in eine BIN und kein Einfluss auf Pokemon-/Shiny-/Mega-Zaehler.

Alle ausgewaehlten Leiterdateien werden erst validiert und dekodiert, dann
in EINER IndexedDB-Transaktion gespeichert. Bei Duplikat, ungueltiger Datei
oder Speicherfehler wird das ganze Leiterpaket nicht uebernommen; vorherige
Bilder bleiben. Pokemon-/Atlas-/Ruf-/Textdateien behalten die bisherige
Einzeldatei-Regel. Die Anzeige erklaert beide Ergebnisse getrennt. Ein
Zusatzindexfehler nach Grafik-Commit wird nicht als Rollback behauptet;
Metadaten bleiben im BIN. Nur-fehlende prueft bestehende Leiterdateien und
ersetzt erkannte Defekte. Neue BINs haben Vorrang vor alten PNGs. Alte lokale
Blob/ArrayBuffer/TypedArray-PNGs und importPortrait-API bleiben kompatibel,
aber ohne zweiten normalen PNG-Einrichtungsweg. Generationsguard verhindert
stale async-Bilder nach Invalidierung. Keine Bilder/Downloads/Uploads.

## Konverter: Python-Standardbibliothek

Nur eigene/rechtmaessig verwendbare PNGs verwenden. Beispiel nach Installation:

    python3 tools/pack-trainer-bin.py --leader rocko --input "$HOME/Downloads/rocko.png" --output-dir "$HOME/Downloads/Leiter-BINs"

Mit den acht passenden --leader-Werten wiederholen, dann BINs zusammen laden.
Optionale --author, --source, --license, --changes sind unverifizierte
Nutzerangaben; leere Angaben bleiben undokumentiert. Keine geratenen Credits.
Statische PNG max1MiB, max1024x1024; CRC/Struktur werden geprueft. Endgueltige
Dekodierbarkeit prueft der Browser vor Speicherung. Ausgabe ausserhalb von
Git-Repositories; Ueberschreiben nur explizit --force. Keine Zusatzpakete.

TPTR v1: magic TPTR (4), Version u16le=1, Index u16le=0..7,
Metadatenlaenge u32le, PNG-Laenge u32le, UTF8-JSON, PNG, SHA256-Trailer32.
SHA ueber Header+Metadaten+PNG, keine Herkunfts-/Rechtegarantie. JSON exakt
{author,source,license,changes}, Strings, max8192Bytes gesamt/2048 je Feld.
Pokemon-/Atlasformat TPK2/TPTH bleibt unveraendert.

## Anzeige, Quellen, Rechte

4x2 Ordenseinlagen mit klaren Erhalten/Offen-Zustaenden, neue geometrische
Interfacezeichnungen; Felsorden silberne Facetten. Keine fremden Pixelarrays.
Keine Aenderung an Ordensvergabe. Einstellungen -> Quellen & Nutzungsrechte:
belegte Projektquellen laut NOTICE, exakte unveraenderte LICENSE/NOTICE-Texte,
lokale unverifizierte Angaben, fehlende Herkunft explizit undokumentiert.
Keine Rechtsberatung oder pauschale Rechtssicherheit. TextContent statt
HTML, HTTP(S)-Links erst bewusst, Texte/Seite offline gecacht. Code-only-
Artifaktpruefung und bestehende Workflow-RegEx blockieren nun auch
trainer-kanto-*.bin. Keine Runner/Images/Timeouts/Retry-Aenderung.

## Tests

Vorhandener zentraler Testlauf unverkuerzt, erweitert um
python3 tools/quality/test-f4-trainer.py (eigene temporaere Einpixel-Bilder,
keine geschuetzten Bilder): Python/JS-Paritaet, 8 IDs, Header/SHA/CRC/Schema,
Transaktionsabbruch, Reparatur, echter Manager mit gemischtem Import und
Zaehlern, echter Arena-Controller mit stale-cache-Guard. Node-Image/DOM/Canvas
simuliert. Originale F3-Regressionsfaelle erhalten. PNG-Browserfall befuellt
Legacy-API statt des absichtlich ersetzten Pickers; Pixel/Reload/Ordenschecks
bleiben. C5 nur neues Label. Rechte/Symboltest prueft exakte Texte, lokale
Angaben, untrusted Text, blockierte javascript-Links, 16 Symbolzustaende,
Ladereihenfolge und Code-only-Schutz. Neuer Playwright-Fall fuer echten
8-Dateien-Picker, echte Pixel/Reload/Zaehler, Quellenansicht und atomare
Ablehnung. WASM/Chromium/WebKit/iPhone separat pruefen; Syntax ist kein Gruen.

Nicht automatisch committen, pushen, nach main wechseln oder deployen.
