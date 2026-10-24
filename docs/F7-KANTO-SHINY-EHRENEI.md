# Kanto-Shiny-Ehrenei

Ein Anspruch pro Spielerprofil nach lgver1/lgkdone. Alte echte Kanto-Abschluesse
zaehlen ebenfalls. Zusaetzliche Titel erneuern den Anspruch nicht. Auswahl aus
Kanto-Dex1..151 und den vorhandenen TP_EGG_ELIGIBLE-Grundformen, ohne legendaere
Seltenheitsklasse und ohne Ditto (nicht aus eigenem Ei erhaeltlich). 62 Optionen,
einschliesslich aller drei Starter. Arten mit spaeter eingefuehrter Babyform
bleiben gemaess bestehender Zuchtbasis ausgeschlossen, etwa Pichu als Baby-Vorstufe von Pikachu.
Keine nachtraegliche Veraenderung der allgemeinen Zucht-/Evolutionsliste.

Einstieg Ruhmeshalle, linker kleiner Shiny-Ei-Knopf ausserhalb der Hauptsteuerung.
Erst Art mit benannter Bestaetigung unwiderruflich reservieren. Spaeter getrennt
fuer das naechste regulaere neue Pflege-Ei vormerken. Vormerkung kann bis dahin
zurueckgenommen werden, Artenwahl bleibt reserviert. Kein direkter Pflege-Ende-,
Freilassen- oder neues-Ei-Aufruf im Geschenkbildschirm. Aktuelles Pokemon bleibt.

rkver1/rkstate/rkdex/rkarm/rkborn streng typisiert; Teil des normalen Saveexports.
Reservierung/Vormerkung nutzen vorhandenen F4-Ganz-Pet/Preferences-Undo; opaque
Sammlung bleibt unveraendert. force/epoch/globalbusy vor Export, IDB-Bestaetigung
vor Finish, volle Ruecknahme vor durablem Commit. Keine erfundene Modell-ID.

Beim tatsaechlichen normalen newEgg wird genau die vorgemerkte Art eingesetzt,
eggShiny=true gesetzt und Anspruch im selben Preferences-Zustand als verbraucht
markiert. Bindung an naechsten Lebensnonce verhindert Anwendung auf ein bereits
existierendes Ei oder anderen spaeteren Lebensabschnitt. Geburt und Gutschein
werden gemeinsam exportiert; Reload erzeugt kein zweites Geschenk. Ein normales
Eierplan-Vorhaben bleibt fuer ein spaeteres normales Ei erhalten. Normale Art-
und Shiny-RNG-Aufrufe laufen vorher wie bisher; ohne nutzbare Praemie gleicher
RNG-Pfad. Gene werden ausschliesslich durch bestehendes hatch() erzeugt: 90..110,
kein Perfektwertebonus. Bewusstes Rueckspielen alter Spielstaende kann wie bisher
alte Spielereignisse wiederherstellen; keine manipulationssichere Server-Wallet.

Nicht-Legendaeres im globalen normalen Eierpool wird nicht veraendert; diese
Einschraenkungen betreffen nur das regionale Ehrenei. Keine automatische Box-
Belegung, kein Pokemon-Wechsel, keine weiteren Regionen in diesem Teil.

Geprueft: echte Native-F4-Transaktionen/Ruecknahme, regulaere Release-Zeremonie,
Geburtsnonce, Shiny/Hatch/Reload, normaler Plan, 256 Seeds und normale Gene/RNG,
Future/Stale/Reset; echter JS-Controller Single-flight/Quota/Abbruch. Neue echte
Chromium-/WebKit-Faelle fuer Auswahl/Quota/Reload, regulaeres Behalten-Geburt-
Schluepfen und einmaligen Anspruch. Browser/WASM/iPhone erst nach realem Lauf.
