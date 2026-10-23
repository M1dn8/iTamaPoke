# F4-A: Sammlungs- und Boxmodell (erster Implementierungsbaustein)

## Status / absichtliche Grenze
Dieses Paket enthaelt echten Modellcode und Tests, NICHT das vollstaendige
F4-Update. Es aendert keine laufenden Spielstaende. Das Modul ist absichtlich
noch nicht in index.html oder den Service Worker eingebunden und wird noch
nicht von Fang, Pflegeende, Spielstandimport oder Oberflaeche aufgerufen.
Keine Anzeige der neuen Boxen oder geaendertes Kampfverhalten zu erwarten.

Basis: main 977c0f7814adde840504295ccfcd36dda9ed6ddb.
Neue Dateien: browser_ver/web/collection-model.js, tests/package-f4-collection.test.js,
docs/F4-A-SAMMLUNGSMODELL.md. Der bestehende zentrale Test-Runner fuehrt den
neuen Test zusaetzlich aus. Keine Assertions entfernt, keine Workflow-,
Container-, Timeout- oder Retryaenderung.

## Implementiert und isoliert geprueft
- Zehn umbenennbare Boxen mit je 20 Slots, ein zusaetzliches aktives Pflegewesen.
- Dauerhafte IDs; dieselbe Art mehrfach. Ein Exemplar an genau einem Ort.
- Sechs Teamreferenzen, getrennt von Lagerplaetzen. Explizites Ersetzen,
  Reihenfolge und Entfernen. Kein automatischer Pflegewechsel.
- Neue Faenge in gewaehlte Box, sonst zyklisch naechste freie. Volle Sammlung
  und volle Verschiebeziele werden ohne Mutation abgewiesen.
- Attach/sync fuer reale aktive Snapshots: Entwicklung behaelt die ID.
- Behalten verschiebt dieselbe ID in eine Box, kein Duplikat. Release/Runaway
  entfernt Besitz und Teamreferenz. Endgueltiges Freilassen verlangt explizit
  confirmed:true plus konkrete Exemplar-ID; aktive Tiere nicht ueber Boxrelease.
- Reale mitgegebene Daten werden kopiert, nicht ergaenzt. Keine Zeitstempel,
  Gen-, IV- oder Historienerfindung. Historische Dexbits sind kein Modellinput.
- Gelagerte Exemplare erhalten keine Alters-/Trainings-/Wertupdates. Umbenennen
  und Verschieben aendert Werte nicht. Datenimporte muessen validiert sein.
- Jeder Modellaufruf liefert einen neuen, tief eingefrorenen Zustand. Bei
  Ablehnung bleibt der Eingangszustand unveraendert.
- Versionierter ITC1-Container mit JSON-Payload und FNV-1a fuer versehentliche
  Beschaedigung (KEINE kryptographische Authentifizierung). Zukunftsversionen,
  doppelte IDs/Plaetze, verwaiste Eintraege, falsche Teams und ungueltige Felder
  werden abgewiesen, nicht still repariert.
- Persistenzadapter veroeffentlicht einen Kandidaten erst nach erfolgreicher,
  vom Aufrufer bereitgestellter atomarer Speicherung. Ablehnung/Exception behaelt
  den alten Modellzustand, parallele Aenderung wird gesperrt. Dies ist NICHT
  bereits die atomare Transaktion des nativen Pet und des ganzen Spielstands.

## Schnittstelle
CommonJS: const M=require('../browser_ver/web/collection-model.js');
Browser (spaeterer Anschluss): globalThis.TPCollectionModel.
Snapshot: {dex,level,nickname,shiny,origin,data}.
origin: existing / raised / wild. data ist das exakt bekannte, JSON-faehige
Datenobjekt; unbekannte Werte koennen null sein oder fehlen. Keine Ableitung
von Genen aus gegnerischen Kampfwerten. Stabile ID vergibt das Modell.
Konkrete Datenfelder und native Snapshotabbildung folgen mit der Integration.
Spitznamen maximal 23 UTF-8-Bytes passend zur bestehenden Kernspeicherung;
Boxnamen maximal 160 UTF-8-Bytes. Platzgrenzen und Version explizit validiert.

create, attachCurrent, syncCurrent, catchWild, endCare, renameBox,
renamePokemon, moveBox, selectTeam, unselectTeam, moveTeam, releaseStored,
summary, encode/decode, session. Funktionen dokumentieren Fehler ueber
CollectionError.code, etwa BOXES_FULL, TEAM_FULL, CONFIRMATION_REQUIRED.
EndCare unterscheidet keep/release/runaway; regulaeres/vorzeitiges Ende,
Boni, explizite Benutzerabfragen und rechtzeitiges Anhalten sind Aufgabe
kommender Pflegeintegration. Weder Boni noch native Pflege werden hier geaendert.

## Noch nicht implementiert / kein Anspruch auf Gesamt-F4
Native und dauerhafte Spielstandanbindung, Dex-Pokeballanzeige, Fangtransaktion,
aktuelle Snapshots/Migration, Abschieds-/Pflegeende-Dialoge und Schutz bei voller
Box, Box-/Team-/Detailoberflaeche, BIN-Leiterkonverter/-import/-anzeige,
PNG-Abwaertskompatibilitaet, Ordenkoffer und Offline-Rechteverzeichnis.
Keine fremden Dylan-Saves, keine fremden Party-Blobs. Keine Teamkaempfe.
Die bestaetigten Regeln bleiben unveraendert und werden nicht durch dieses
Teilpaket als bereits vollstaendig implementiert dargestellt.

## Installation / Weiterarbeit
Installer zuerst ohne --apply pruefen. --apply erstellt den lokalen Branch
f4-collection-a, schreibt nur die oben genannten Dateien und fuehrt den neuen
Modelltest aus. Originale und Bericht liegen ausserhalb des Repositories.
Kein Commit, Push oder Deployment. Danach den kompletten zentralen Runner
ausfuehren. Erst mit erfolgreichem Integrationspaket spaeter auf dem iPhone
abnehmen. Die volle Browser-/WASM-Pruefung ist hier noch nicht erfolgt.
