# Gemeinsame Kampfansicht

Gegner oben rechts, eigenes Pokemon unten links; versetzte Statuskaesten mit
Formname+Level sowie aktuellen/maximalen KP fuer beide Seiten. Mega-Metagross
zeigt bevorzugt Megametagross, Shiny-/Form-Sprite aus eingefrorenem Kampfzustand,
75%-Proportion beibehalten. Spitzname separat. Keine neuen Pokemonbilder/BINs.
Eigene Canvas-Pixelkulissen fuer Eis/Fels/Geist/Drachen/Champ. Kein kreisfoermiges
Abschneiden wichtiger Inhalte; gesamtes466-Feld nutzbar. Arena/Wild/Trainer nutzen
denselben Renderer, bestehende Arena-Ordensuebergabe bleibt davor unveraendert.

Kampf -> Schnell/Kraeftig/Ausweichen/Heilen; Pokemon -> reine Kampfinformationen,
kein implementierter Teamwechsel. Aufgeben nur mit echter Entscheidung, bezahlte
Energie wird nicht erstattet. Wildflucht/Fangsystem bleiben native Originalpfade.
Resultatflaechen enthalten keine alten Angriffstrefferzonen.

Nur readonly Praesentationswerte: eingefrorenes Level/Form/Stats, laufende echte
KP, aus Schadenssummen berechneter tatsaechlicher KP-Verlust (KO begrenzt),
separate tatsaechliche Heilung. Kein vorgetaeuschter garantierter Vorschaden.
Keine Aenderung an stepBattle, Schaden, RNG, Energie, Heilungen oder Save-Schema.

Browsertests bedienen sichtbar gezeichnete Aktionen ueber readonly Treffer-
rechtecke und echte Pointerevents. Keine Native-Aktionsabkuerzung. Bestehende
Werte-/Rollback-/Fang-/Energieasserts und Timeouts bleiben erhalten. Native/VM
pruefen echte Snapshots, Mega-Ablauf, numerische KP, Schaden/Heilung, Stiltraces
und Ergebnisinput. Mac-WASM/Browser und iPhone erst nach tatsaechlichem Lauf.
