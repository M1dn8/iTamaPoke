# C5 - Hauptmenue und Tagebuch (Testversion)

## Navigation

Beide oberen Buttonleisten werden ausgeblendet. Im Spielfeld nach unten
wischen: sechs Kacheln Tagebuch, Entwicklung, Pokedex, Eier, Sicherungen,
Einstellungen. Im Hauptmenue nach oben oder Zurueck zum Pokemon schliesst.
Auch Pfeil nach unten bei fokussiertem Spielfeld oeffnet das Menue.
Bisherige Direktgesten zu Statistikkarten und Pokedex bleiben erhalten.

Dateien unter Einstellungen: Grafiken, Rufe, Pokedex-Texte laden sowie
Dateibestand pruefen. Neues Spiel abgesetzt mit den bestehenden Rueckfragen
und Sicherheitskopien. Sicherungen/Import/Export nur noch ueber Sicherungen.
Sprache/Ton verwenden die bisherigen gespeicherten Einstellungen.

Bisherige A/B/C1-Seiten werden weiterverwendet und fuellen das Spielfeld,
statt als schwebende Fenster ueber dem Spiel zu liegen. Ihre bestehenden
Pruefungen, Sicherungs- und Dateiauswahlfunktionen bleiben aktiv. Schliessen
wird zu Zurueck; Rueckweg ins Menue bzw. zur Dateiseite. Pokedex-Suche kann
wie bisher in den eigentlichen Pokedex wechseln; von dort Menue-Button und
Rueckgesten zum Ausgangspunkt. Native Direktaufrufe behalten ihren Rueckweg.
Listen scrollen in ihrer eigenen Seite; Tagebuchscrollen schliesst kein Menue.
Zeit/Pflege laufen wie bisher weiter, kein Pausieren des Spielkerns.

## Tagebuch

Neue Ereignisse ab C5, keine erfundene Rekonstruktion alter Spielstaende:
- neues Ei (KEINE verborgene Art/Schillernd-Information);
- Schluepfen mit Art und ggf. schillernder Variante;
- abgeschlossene Entwicklung (wird waehrend der Animation vorgemerkt);
- erstmaliger Fang je Art, auch wenn diese vorher schon aufgezogen war;
- Wesenswechsel, nicht einmalige Altstand-Migration;
- neuer persoenlicher Rekord in jedem Minispiel inkl. Boxsack;
- tatsaechlich abgeholte Expedition;
- Level 10/25/50/100 und 10/25/50/100/1025 aufgezogene Arten;
- verdiente Medaillen;
- tatsaechlicher Abschied, Freilassen oder Weglaufen am Lebenszyklusende.

Keine Eintraege fuer Routinepflege, normale Spiele/Kaempfe, Expeditionsstarts,
Gegenstandsverbrauch, Speichern oder Import. Namen werden beim Ereignis
festgehalten; spaetere Umbenennung aendert alte Eintraege nicht.

Maximal 200 gespeicherte Ereignisse, dann faellt das aelteste weg. Neueste
zuerst, gruppiert nach lokalem Datum. Direkt aufeinanderfolgende identische
Expeditionsfunde desselben Pokemon am gleichen lokalen Tag werden NUR in der
Anzeige zusammengefasst, ohne Rohereignisse zu verfaelschen. Uhrzeiten sind
Erfassungszeiten der lokalen Geraeteuhr; offline erkannte Ereignisse werden
beim Erkennen erfasst, nicht mit erfundenen historischen Uhrzeiten versehen.

## Speicherung und Sicherheit

Ereignisse gehoeren zum normalen Spielstand, nicht zu einem separaten Cloud-
Dienst. Neue Eier loeschen das Tagebuch nicht. Vollstaendiger Spielreset
beginnt neu; vorherige B-Sicherheitskopie enthaelt das bisherige Tagebuch.
B-Exporte/Importe nehmen den Eintragsbestand mit. Wiederherstellung selbst
wird nicht als neues Ereignis eingetragen.

jrver/jrcount/jrdata/jrlvl/jrdex/jrfrom/jrto/jrpend: kompakte Versionsdaten und
Binaerfelder. 200 Eintraege zu 36 Bytes, unter bestehenden B-Dateigrenzen.
JSON fuer die Anzeige maskiert Namen korrekt; Ausgabe als Textknoten statt
HTML. Ungueltige Datensatzbereiche werden verworfen. Entwicklungs-Vormerkung
wird gespeichert und einmalig nach Ende der Animation aufgeloest.

## Tests und Grenzen

Lokal: Native Tests fuer Speicherung, 200er-Grenze, fehlende Altgeschichte,
ersten Fang, feste Namensschnappschuesse, Entwicklungs-Vormerkung ueber Reload,
JSON-Escapes und Ei-Geheimnisse. Simulierte DOM-Tests fuer sechs Kacheln,
Vollseiten/Rueckweg, Dateiaufrufe, Resetweiterleitung und Tagebuchgruppierung.
Die echten bisherigen A/B/C1-Modale und ein echter Browser/Safari sind damit
NICHT vollstaendig abgenommen; diese Integrationspruefung folgt nach dem
Gesamtbuild. C5-Workflow fuehrt alle bisherigen Regressionen ebenfalls aus.

Branch komfort-c5 aus komfort-c4. Keine Uebernahme nach main/iPhone vor der
vereinbarten gemeinsamen Abnahme. Tagebuch und Menue koennen danach lokal
zusammen getestet werden. Keine NAS-Anbindung und keine Fremdassets.
