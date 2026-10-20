# Projektplan und Paket C1: Eierauswahl

## Vereinbarter Plan

| Paket | Umfang | Vorschlaege | Stand vor C1 |
|---|---|---|---|
| A | Entwicklung & Pokedex: Voraussetzungen, Zielauswahl, Suche, Filter, Schnellnavigation | 1, 2, 4 | iPhone-Abnahme erfolgreich |
| B | Sicherungen & Assets: Vorschau, Wiederherstellung, Sicherheitskopien, Bestand, Importfortschritt | 3, 5 | iPhone-Abnahme erfolgreich |
| C | Spieltiefe: beeinflussbare Eierauswahl, erweiterte Expeditionen und Minispiele, Persoenlichkeit und Tagebuch | 6, 7, 8 | C1 ist der erste Teil |
| D | Qualitaet & Optimierung: automatische Tests, Diagnoseansicht, gezielte Performance-Arbeit | 9 | Spaeter; Regressionstests bereits begleitend vorhanden |

## C1-Testversion: Regeln

Die konkreten Gewichtungsregeln sind ein erster Umsetzungsvorschlag,
keine aus dem alten Projektplan abgeleiteten Zahlenvorgaben.

- Neue Schaltflaeche Eier in der bestehenden Komfortleiste.
- Wunschgeneration 1-9 oder alle; Wunschtyp oder alle; optional staerkere
  Gewichtung noch nicht aufgezogener Arten (nicht gleichbedeutend mit ungefangen).
- Ein Treffer erhaelt das dreifache Losgewicht, kombiniert maximal 27.
  Das bedeutet NICHT dreifache Wahrscheinlichkeit und garantiert keine Art.
- Zuerst findet weiterhin der bisherige Seltenheitswurf statt. Die bisherigen
  ei-faehigen Arten, der Vorrang unvollstaendiger Entwicklungslinien und die
  Fallback-Reihenfolge bleiben unveraendert. Erst im ausgewaehlten Pool wird
  nach den Wuenschen gewichtet. Gibt es dort keine passenden Arten, macht
  der Wunsch dort keinen Unterschied. Keine Filterung in einen anderen Tier.
- Keine Verbesserung der Shiny-Chance. Pflege-, Abschieds- und Weglaufregeln
  fuer Seltenheit und Shiny bleiben bestehen.
- Ohne Plan bleibt die bisherige Zufallsauswahl inklusive RNG-Aufrufzahl
  unveraendert. Die erste manuelle Starterauswahl bleibt ebenfalls bestehen.
- Der Plan ist vor der Erzeugung des naechsten Eis festzulegen. Aktuelles
  Pokemon, Alter, Bindung und Sammlung werden durch die Auswahl nicht ersetzt.
- Einmalige Verwendung beim naechsten regulaeren neuen Ei, auch nach Freilassen
  oder Weglaufen; dann wird der Plan automatisch geloescht. Auch ein zufaellig
  nicht zum Wunsch passendes Ei verbraucht den Plan: keine Erfolgsgarantie.
- Bereits erzeugte Eier werden nicht neu ausgelost. Typ und Shiny werden
  nicht durch wiederholtes Oeffnen, Laden oder Tippen neu gezogen.
- Ein bewusstes Zurueckspielen eines frueheren Spielstands VOR der Erzeugung
  eines Eis kann wie bisher den Ablauf erneut durchlaufen. C1 ist keine
  manipulationssichere Anti-Save-Scumming-Loesung.
- Im Ei-Zustand ist die Planung gesperrt; der verwendete Plan bleibt ablesbar,
  ohne die versteckte Art oder den Shiny-Status zu enthuellen.
- Speichern eines Plans aktualisiert den Spielstand und laedt die Seite neu.
  Die Autosave-Sperre bleibt bis zur Navigation gesetzt, damit kein veralteter
  ausstehender Autosave die gerade gespeicherte Auswahl ueberschreibt.
- Bei einem Schreibfehler wird die Auswahl im laufenden Spielkern auf den
  bisherigen Plan zurueckgesetzt. Kein absichtlicher Reset des Spielstands.

## Speicherung und Kompatibilitaet

Sechs zusaetzliche Preferences-Felder: eggen, egtyp, egunk (naechster Plan),
egugen, egutyp, eguunk (zuletzt beim Erzeugen verwendeter Plan).
Alle fehlen in alten Spielstaenden und werden dann als 0/false geladen.
Ungueltige Generationen/Typen werden beim Laden auf keine Praeferenz gesetzt.
Die Felder sind Teil des normalen Spielstandexports und somit der Sicherungen
von Paket B. Das binaere Containerformat und die Pokedex-Bitmaps werden nicht
geaendert. Alte App-Versionen werten die neuen Funktionen nicht aus.

## Tests

Lokal ausgefuehrt:
- Native C++-Tests gegen den bereitgestellten 1025er Quellstand, mit den
  gezielten C1-Aenderungen: bestehende Standardauswahl mit 4096 festen Seeds
  verglichen; Generation/Typ-Gewichtung nachgewiesen; Seltenheit und Shiny-
  RNG-Folge unveraendert; Plan speichern/laden, einmaliger Verbrauch,
  erneutes Laden eines bereits erzeugten Eis, Schluepfen, Sammelstaende,
  alte Spielstaende und ungueltige Praeferenzen geprueft.
- JS-Syntax und kleine UI-Unit-Tests mit simuliertem DOM: erfolgreicher
  Commit mit Neuladen sowie Ruecknahme bei simuliertem Schreibfehler.

Noch ausstehend:
- Vollstaendiger Build des tatsaechlichen A+B+C1-Stands auf GitHub.
- Alle A/B-Regressionspruefungen dort.
- Echter Browser, echte IndexedDB-Schreibfehlerfaelle, iPhone-Abnahme.
DOM-Unit-Tests ersetzen diese Browserpruefung nicht.

## Lokale Abnahme nach gruenem Build

Nur eine getrennte lokale Testinstallation verwenden, nicht auf dem iPhone
experimentell Freilassen oder Reset ausfuehren.

1. Bereitgestellten kuenstlichen C1-Teststand-ohne-Plan.tpsave ueber Paket B
   laden. Er hat Bisasam, Level 10 und 25 aufgezogene Arten; kein echter
   Nutzerspielstand. Grafiken sind nicht enthalten.
2. Eier oeffnen: Generation 9, Pflanze und neue Arten waehlen, speichern.
3. Nach Neuladen pruefen: Plan erhalten; aktuelles Pokemon und Sammlung gleich.
4. Klassisch und als Version 1 exportieren/importieren: Plan muss mitkommen.
5. Manuell lokal sichern; nur im Test das Pokemon regulaer freilassen.
6. Nach der Zeremonie: neues Ei, naechster Plan leer, verwendeter Plan sichtbar.
   Keine bestimmte Art erwarten! Vor Schluepfen erneut laden und pruefen,
   dass Rissstand/Seltenheit erhalten bleiben. Nach drei Tipps schluepft es.
7. Echte alte iPhone-Sicherung NICHT fuer diesen Freilassen-Test verwenden.
8. Zum Vergleich Zufall wiederherstellen; Auswahl muss auf alle/alle/aus stehen.

Andere Teile von C (Expeditionen, Minispiele, Persoenlichkeit/Tagebuch) sind
NICHT in C1 enthalten. Keine NAS-Anbindung und keine Fremdassets.
