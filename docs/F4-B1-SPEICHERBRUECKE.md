# F4-B1: native Speicherbruecke (Teil von F4-B, noch keine komplette Anbindung)

Voraussetzung: lokal gepruefter F4-A-Baustein auf f4-collection-a, Basiscommit
977c0f7814adde840504295ccfcd36dda9ed6ddb. F4-A-Dateien werden bis auf die
zusaetzliche Runner-Zeile nicht veraendert. Kein Commit/Push/Deployment.

## Konkret implementiert
- Neues browser_collection_store.cpp im WASM-Build. Aktuell KEIN Aufrufer im
  Spiel: keine automatische Sammlungserzeugung, Migration oder Fang-/Endungs-
  Aenderung und kein Zugriff auf einen echten Spielstand bei Installation.
- Sammlung als opaque UTF-8-Binaerwert `f4col` im vorhandenen Preferences-Store.
  Kein separater IndexedDB-Bestand. Maximal 262144 Bytes, passend zum schon
  vorhandenen Datenfeldlimit des strikten Saveparsers; Limits nicht angehoben.
- Fehlendes Feld = alter Save, kein automatischer Eintrag. Falscher Typ,
  ungueltiges UTF-8, leeres/zu grosses Feld: Fehlerstatus, Daten nicht loeschen.
- Tokenisierte Vorbereitung/Ruecknahme mit exakter Kopie des realen Pet und
  gesamten Stores. Zweite offene Transaktion und Start im Kampf gesperrt.
  Stale Tokens duerfen keine fremde Transaktion bestaetigen/zuruecknehmen.
- Ruecknahme umfasst auch Aenderungen durch den normalen Export-Clock-Flush,
  unbekannte Savefelder und bestehende Orden. Reset entfernt das neue Feld.
- Read-only Snapshot des aktiven Pet mit echten Gen-/Trainings-/Basiswerten,
  Art, Level, Spitzname, Shiny, Medaillen und bekannten Pflegewerten. Keine
  ID-/Herkunfts-/Fangzeit-Erfindung. Origin/Identitaet erst im JS-Modell zuordnen.
- Nach Reset oder im Ei wird kein altes Pflegewesen als DTO ausgegeben.

Native API: tp_f4_store_size/ptr/pending/begin/stage/finish und
 tp_f4_current_snapshot. size 0 bedeutet abwesend, negative Werte einen
 lesbaren Fehlerstatus. ptr muss vor Mutationen sofort kopiert werden.
 stage validiert Transport, UTF-8 und Laenge, NICHT das JSON-Modell oder dessen
 Checksumme. Das unveraenderte F4-A-Modell muss vor stage das ITC1 validieren.
 finish(commit=1) darf erst nach erfolgreicher dauerhafter Gesamtspeicherung
 erfolgen. Diese Reihenfolge ist noch NICHT im Browsercontroller eingebaut.
 Native API vorerst nicht manuell in der Browserkonsole aufrufen.

## Tests und Aussagegrenze
Echter Pet.cpp und neue Produktionsbruecke gegen die bestehenden Preferences-
und Emscripten-Testshims kompiliert. 100 volle Pet/Store-Ruecknahmen mit
Clock-/Export-Aenderungen, Grenzen, Unicode, Tokens, Reload, Orden/unknown fields
und Reset geprueft. Snapshot-JSON geparst und echte Werte abgeglichen.

Der Test extrahiert zur Laufzeit den ORIGINALEN Savecodec-Abschnitt aus
browser_glue.cpp unveraendert in eine temporaere Include-Datei. Kein neuer
Produktionscodec, keine unabhaengige Nachimplementierung. Dessen echte
Exportbytes gehen durch tp_import_state, den vorhandenen strikten JS-Parser
und SHA256-Sicherungshuellen. Exakte Bytegleichheit fuer normale und volle
256-KiB-Testfelder. Modell-JSON des Testtransportes bleibt bewusst opaque.

Der lokal exportierte F3-Regressionsstand plus B1 wird hier geprueft. F4-A
wurde vom Nutzer separat vollstaendig geprueft. Der gemeinsame aktuelle
F4-A+B1-Runner muss nach Installation auf dem Nutzerstand erneut laufen.
Kein behaupteter vollstaendiger WASM-, Chromium/WebKit- oder iPhone-Test.

## Noch offen (F4-B2 und folgende Schritte)
JS-Controller, der F4-A validiert, die globale Speichersperre/Autosave-Epochen
und Tick-/Eingabe-Sperren setzt, einen gesamten Save atomar schreibt und erst
danach bestaetigt oder bei Fehlern gemeinsam zuruecknimmt. Dazu die
Saveimport-Modellvalidierung, einmalige aktuelle Individuen-Zuordnung, Sync
von Entwicklung/Alter, echte Fang-/Abschieds-/Pflegeende-Integration und
Anhalten vor vollem Speicher. Nichts davon wird als erledigt dargestellt.
Die Boxoberflaeche, Leiter-BINs, Ordenkoffer und Rechteansicht folgen separat.
