# Paket C2 - vier feste Expeditionen (aktuelle Testversion)

Die vorherige gewichtete Auswahl und die separate Zeitwahl sind ersetzt.

| Expedition | Garantierter Gegenstand | Feste Dauer | Energiekosten |
|---|---|---|---|
| Beerenwiese | Nahrung x1 | 15 Minuten | 12 |
| Quellpfad | Energie x1 | 15 Minuten | 12 |
| Waldlichtung | Pflege x1 | 15 Minuten | 12 |
| Trainingspfad | Training x1 | 30 Minuten | 26 |

## Bedienung

Vier direkte Buttons in einem 2x2-Raster auf der bisherigen Expeditionskarte.
Jeder Button zeigt Name, Gegenstand, Dauer und Kosten. Ein Antippen startet.
Keine Ziel-Vorauswahl, Zeitbuttons, Dropdowns, Zusatzfenster oder Chancenlisten.
Inventar darunter wie bisher direkt antippbar und einheitlich beschriftet.
Die vorhandene kleine ATK/DEF/Tempo-Auswahl fuer Trainingsgegenstaende bleibt.
Start, Abholung und Verwendung ohne automatisches Neuladen.

## Regeln

- Genau ein angegebener Gegenstand, kein Trainings-Zufallsfund auf anderen
  Routen und kein Wechsel zu einem anderen Gegenstand bei vollem Fach.
- Das Zielfach muss beim Start Platz haben (Limit weiterhin drei je Typ).
- Trainingspfad gesperrt, wenn alle drei Trainingswerte bereits maximal sind.
- Nahrung, Freude, Hygiene jeweils mindestens 40; nach Abzug mindestens
  20 Energie. Kein Start als Ei, schlafend, in Entwicklung/Zeremonie, bei
  laufender Expedition oder ausstehender Abholung. Browser sperrt Aktionen
  waehrend Kampf/Minispiel und kurz waehrend des Speicherns.
- Eine Expedition gleichzeitig. Normale Pflege und Zeitverlauf bleiben
  moeglich. Gegenstand und Endzeit werden beim Start gespeichert.
- Bei spaeter vollem Zielfach bleibt die Belohnung gespeichert, bis Platz
  geschaffen wurde. Keine neue Auswahl, kein stilles Verwerfen.
- Ist ein alter Trainingsfund nachtraeglich nicht aufnehmbar, bleibt auch
  dieser unveraendert gespeichert. Kein Tausch gegen einen anderen Typ.
- Pflege und Bindung bestimmen keine Fundwahrscheinlichkeit mehr. Die
  Mindestversorgung ist weiterhin eine Startbedingung.
- Die bisherigen Roll-Parameter bleiben technisch in der C++-API, werden
  fuer neue Starts aber ignoriert. Der Browser verbraucht keinen Zufallswurf.

## Alte Expeditionen und Speicherformat

Bereits laufende/fertige Touren behalten ihre exakte Endzeit und gespeicherte
Belohnung, auch wenn Route, Dauer oder Fund nicht mehr dem neuen Schema
entsprechen. Sie werden knapp mit (alt) markiert, nicht erneut bezahlt und
nicht umgewuerfelt. Auch alte Erkundungstouren bleiben abholbar; Erkundung ist
nur nicht mehr als neuer Auftrag waehlbar.

Neu: Preferences-Feld exfixed (0/1), Browser-Getter tp_c2_get(26).
Fehlendes Feld bedeutet alte Expedition. Bei offensichtlich unpassenden
Metadaten wird nur die Kennzeichnung als feste Expedition entfernt, nicht
Belohnung oder Endzeit. Bestehende exend/exrwd und C2-Metadaten bleiben erhalten.
Das Feld ist Bestandteil der Sicherungen aus Paket B. A/B/C1 bleiben erhalten.

Die reversible C2-Aktion und der Speicher-Generationszaehler der Button-
Ueberarbeitung bleiben aktiv: Commit erst nach IndexedDB-Erfolg, Ruecknahme
bei Schreibfehlern und Abweisung verspaeteter alter Autosaves. Kein Reload.

## Tests

Lokal erfolgreich: C++-Pruefungen aller vier festen Zeiten/Kosten/Funde,
abweichender alter Rollwerte, Zielkapazitaet, Maximaltraining, Energie- und
Pflegegrenzen, kein RNG-Verbrauch, gespeicherte Kennzeichnung, einmalige
Abholung, alte Route-0- und variable C2-Touren sowie Kern/Map-Rollback.
JS: direkte vier Startbuttons mit festen Parametern, kein Extra-DOM/Reload,
Schreibfehler-Ruecknahme, Abholung nach Freimachen eines Fachs und Schutz
vor verspaeteten Autosaves.

Noch ausstehend: Gesamtbuild und A/B/C1-Regressionen des tatsaechlichen
Projektstands auf GitHub, echte Browser-/IndexedDB- und iPhone-Abnahme.
Bestehender Workflow Test Paket C2 auf komfort-c2 wird weiter verwendet.
Keine NAS-Anbindung, neuen Fremdassets oder weiteren Paket-C-Funktionen.
