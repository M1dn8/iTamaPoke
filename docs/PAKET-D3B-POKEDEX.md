# D3b - ein gefilterter Snapshot pro Raster-Zeichenlauf

Basis: abgenommene D3a-Version 495c7040f558. Eingriff nur in drawDexGrid und
neuer lokaler Hilfsfunktion dexGridSnapshot. Einmal tpComfortDexIds statt 19
Abrufen bei vollstaendigem Zeichenlauf (Seitenzaehlung, Leermeldung, 16 Kacheln,
Seitenfuss). Dadurch auch nur eine Runde Cache-Schluessel/Sammlungszaehler.
Keine neue dauerhafte Cacheebene, kein Kopieren oder Aendern der gespeicherten
ID-Liste. Ohne Komfortmodul wird die sichtbare Liste einmal aufgebaut.

Detailsicht, Tipp-/Blaetterbehandlung, Filter, Kartenansicht, Thumb-Darstellung,
Grafikcache, Speicherintervalle, nativer Spieltakt und Animationen unveraendert.
Filter-/Sammlungsabfragen erfolgen beim naechsten Zeichenlauf erneut ueber den
bestehenden Cachemechanismus. Keine Verringerung der Bildrate.

Messung wie D3a; nur Kennzeichnungen in Leistungsmodul, Diagnose und zugehoeriger
Browserpruefung auf D3b-Vergleichsversion/Pokedex-Vergleich angepasst.
Keine Messformeln, Grenzen oder Stichproben veraendert.

Reine JS-Tests vergleichen alle protokollierten Canvas-/Thumb-/Status-Ausgaben
mit der alten Rasterfunktion, inklusive leerer/letzter Seite, Such-/Sammelfiltern,
Silhouette/Lookup, Atlas/Sprite-Fallback und Aktualisierung nach Sammlungszuwachs.
Strukturell 19 -> 1 Listen-/Zaehlerabrufe; das ist KEIN Nachweis 19-facher
Geschwindigkeit und keine vorhergesagte Millisekundenverbesserung.
Echte Browser pruefen Paging, Details, Rueckwege, leere Suche und Sammelfilter.

Vergleich nach gruener Veroeffentlichung: App neu oeffnen. Ueber Pokedex-Suche
Erste Dex-Seite oeffnen, 10 Sekunden Raster stehen lassen, mehrere Rasterseiten
durchblaettern und erneut 10 Sekunden stehen lassen. Keine Detailseite in dieser
Raster-Messrunde, damit der bisher gemischte dex-Messwert besser eingegrenzt wird.
Diagnose > Pruefen > Bericht speichern. Gleiche Abfolge fuer einen wirklich
vergleichbaren Vorher-/Nachher-Test auf beiden Versionen erforderlich; bestehender
D3a-Bericht ist nur grobe Referenz (dex 76 Proben, Mittel 7.053 ms, P95 14 ms).

D3 bleibt offen bis zum realen Vergleich. Bei fehlendem relevanten Gewinn keine
pauschale Behauptung; weitere Ursachen getrennt untersuchen. Kein Loeschen,
Neuladen privater Grafiken, Spielstandimport oder Reset erforderlich.
