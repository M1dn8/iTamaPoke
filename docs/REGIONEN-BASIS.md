# Regionenbasis, Schritt 1

Die zentrale Schlüsselzuordnung wird von Arena, Liga, Ruhmeshalle und Ehrenei
für Kanto tatsächlich verwendet. Alle 14 alten Kanto-Namen bleiben exakt gleich.
Bestehende Daten werden weder migriert noch beim Lesen neu geschrieben.

Johto hat einen reservierten getrennten Namensraum. Das aktiviert noch keine
Johto-Arena, Liga, Ruhmeshalle oder Belohnung. Es gibt noch keine Regionsauswahl.
Unbekannte IDs liefern keinen Schlüsselvertrag; kein stiller Kanto-Fallback.

`test-region-keys.py` prüft die Namen, Grenzen und getrennte Schreibbereiche
mit opaken Testwerten. Die bestehenden Kanto-Suites bleiben verantwortlich
für gültige Spielstände, Kampfverläufe, Siegerehrung, Ehrenei und Rollback.

Nächste Schritte: expliziter Regionskontext und kontrollierter Wechsel, getrennte
Fortschrittsleser/-schreiber, danach geprüfte Johto-Gegnerdaten und Abschluss.
Bei weiteren Regionen jeweils deren Spielformat berücksichtigen.

Nicht Bestandteil dieses Schritts: neue Teams, neue Belohnungen, Änderungen
an Pflege, Wildleveln, Fangchance, Grafikdateien oder Benutzeroberfläche.

## Schritt 2: explizite Lesekontexte

`tp_region_arena_mask(region)`, `tp_region_arena_date(region,id)` und
`tp_region_league_view(region)` lesen ausschließlich den angegebenen Namensraum.
Sie wählen keine globale Region und schreiben keine Spielstanddaten. Die bisherigen
Kanto-APIs behalten ihren Kanto-Kontext und ihr Verhalten.

Das alte Kanto-Checkpointformat bleibt 1. Für Johto ist Kennung 2 reserviert; ein
kopierter Kanto-Checkpoint wird dort abgewiesen. Die vorhandene Prüfsumme und
Feldprüfung gelten weiterhin. Zukünftige/ungültige Daten werden nicht bereinigt.

Die regionale Ligaansicht zeigt gespeicherten Fortschritt, keine neue aktive
Kampfsitzung. `playable` bleibt für Johto 0, auch wenn synthetische gültige
Testdaten gelesen werden. Es gibt noch keine Johto-Schreibwege, Gegner oder UI.

Der Kontext-Test verwendet echte Arena-/Liga-Leser und eine echte Kanto-Sitzung.
Johto-Zwischenstände darin sind synthetisch, keine vorgetäuschten erspielten Siege.

## Schritt 3: Johto-Katalog, Gold/Silber

Enthalten sind acht Johto-Arenen (23 Teampositionen), vier Top-Vier-Teams
(20 Positionen) und Siegfrieds Team (6 Positionen). Es gibt einen Champ-Kader,
keine erfundenen drei Kanto-Varianten für Johto. Der Abschluss gehört in der
Regionsverwaltung zu Johto; der Originalspielort der Liga ist das Indigo-Plateau.

Datenbasis der Arten, Level und Listenreihenfolge:
- https://www.serebii.net/gs/gyms.shtml
- https://www.serebii.net/gs/elitefour.shtml
Gegenprüfung der Arten und Level:
- https://pokemondb.net/gold-silver/gymleaders-elitefour
Deutsche Arenaleiter-, Städte- und Ordensnamen:
- https://www.pokewiki.de/Johto

Einzelne Sekundärlisten sortieren Pokémon innerhalb desselben Teams anders.
Die hier gewählte Listenreihenfolge folgt den Serebii-Gold/Silber-Tabellen. Sie
bildet nicht die situationsabhängige Wechsel-KI des Originalspiels nach.

Nicht übernommen werden Attacken, Items, KI, historische Typregeln, Grafiken,
Originalspielcode oder Texte der Quellseiten. TamaPoke behält seine bestehende
Kampfberechnung. Daten aus HeartGold/SoulSilver, Rematches, Rot oder den
zusätzlichen Kanto-Arenen aus Gold/Silber sind nicht Teil dieses Johto-Katalogs.

Native Header und tief eingefrorene JS-Daten werden gegen dieselbe geprüfte
Roster-Fixture verglichen. Der Datentest ersetzt keine zukünftige Prüfung der
Kampf-/Speichercontroller. Johto bleibt bis zu deren Anbindung nicht spielbar;
die JS-Kataloge sind noch nicht in index.html oder den Offline-Start eingebunden.
Die Wildlevel-Grenze gilt nicht für diese festen Arena- und Liga-Level.

## Schritt 4: regionsgebundene Arena-Transaktionen

Native Johto-Arenen verwenden jetzt den geprüften Johto-Katalog. Die Region
wird beim Start in der Sitzung festgehalten, nicht aus einer globalen UI-Auswahl
beim Speichern abgeleitet. HP und Erholungen werden über Gegnerwechsel getragen.

Explizite regionale Start-/Orden-/Abschlussaufrufe und bezahlte Starttransaktionen
weisen eine falsche Region oder einen falschen Token ab. Die alten Kanto-
Schreibaufrufe bleiben Kanto-only. Startfehler rollen den ganzen Pet/store zurück;
Abbruch nach bestätigtem Start erstattet wie bisher keine Energie.

Johto-Orden und Daten landen nur in jagver/jagmask/jagtN. Kanto-Daten bleiben
unverändert; Johto-Orden öffnen nicht die Kanto-Liga. Ein Orden entsteht nur nach
dem letzten gewonnenen Teamkampf und bestätigter Speicherung. Wiederholung
ändert weder Maske noch erstes Vergabedatum. Es gibt keine Arena-Fänge.

Tests prüfen echte native Transaktionen, synthetische Siege für Rollback-Fälle
und zusätzliche Serien mit der tatsächlichen Kampfberechnung. Dies ist kein
Balancingbeweis und noch kein IndexedDB-/WASM-Browsertest.

Die UI ist noch nicht freigeschaltet. Bei der späteren Anbindung müssen Arena-
und Kampfansicht die Region der Sitzung für Namen, Orden und Leitergrafiken
verwenden; kein Kanto-Katalog-/Grafik-Fallback für Johto. Johto-Liga, Ruhmeshalle
und Ehrenei sind noch nicht regionsgebunden schreibbar.

## Schritt 5: regionale Liga und Ruhmeshalle

Die native Liga bindet Region und Token in jedem Start-/Sieg-/Fortsetzungs-/
Abschlussschritt. Alte tp_lg_*-Aufrufe bleiben Kanto-only. Explizite
tp_region_lg_*-Aufrufe verwenden den mitgegebenen Kontext und weisen einen
falschen aktiven oder schwebenden Regionsbesitzer ab. Es existiert keine globale
UI-Auswahl als Schreibziel. Ein Regionsleser beeinflusst keine andere Sitzung.

Johto verwendet die 26 Katalogpositionen mit einer Champvariante. Der Aufstieg
behält Rest-KP und die fünf Erholungen; 50 Energie werden einmal vor den Top Vier
und 30 einmal vor dem Champ bezahlt. Ein gespeicherter Top-Vier-Lauf darf auch
mit leerer Pflegeenergie fortgesetzt werden; nur der Champ-Eintritt prüft erneut.

Der finale Sieg speichert Abschluss und Gewinner-Snapshot derselben Region
in derselben vorhandenen Pet/store-Transaktion. Kanto behält die LHK-Bytes exakt;
Johto nutzt LHJ. Beide Formate bleiben prüfsummen-/feldvalidiert und speichern
das tatsächliche Sieger-Pokémon. Ein fremder Hall-Payload wird abgewiesen.
Siegerehrung/Bestätigung, Wiederholung und erstes Abschlussdatum sind getrennt.

Der Metadaten-Leser tp_region_league_view hält Johtos UI-playable-Flag noch auf 0;
die nativen Controller sind nun für Tests verfügbar. Die spätere gemeinsame
Oberfläche muss tp_region_lg_view und tp_region_hall_view sowie die Region der
Sitzung verwenden. Kanto-JS ist unverändert und darf Johto nicht steuern.

Kein Ehrenei wird in diesem Schritt vergeben oder vorgemerkt. Der regionale
Belohnungsablauf folgt separat. Keine UI-Freischaltung und kein WASM-Test in
diesem Schritt. Rollback-Prüfungen nutzen synthetische Siegzustände; ergänzende
Serien verwenden die echte Kampfberechnung, ohne einen Balancingbeweis zu liefern.

## Schritt 6: regionale Ehrenei-Ansprüche und ein gemeinsamer Ei-Platz

Kanto behält seine 62 bisherigen Kandidaten und seine fünf rk*-Felder unverändert.
Johto verwendet jrk*-Felder und 47 Basisformen aus Nationalnummern 152–251 nach
den bestehenden TamaPoke-Artfamilien. Endivie, Feurigel und Karnimani sind dabei.
Icognito (201), Legendäre und Mysteriöse sind ausgeschlossen. Babyformen können
als regulär durch Zucht erhältliche Ei-Basis enthalten sein; sie sind nicht selbst
sofort zuchtfähig. Dies ist keine historische Gold/Silber-Zuchtsimulation.
Quellen zur Ausnahme und Einordnung:
- https://pokemondb.net/egg-group/undiscovered
- https://bulbapedia.bulbagarden.net/wiki/Baby_Pok%C3%A9mon

Beide regionalen Auswahlen bleiben unabhängig und unveränderlich reserviert.
Nur eine darf für das nächste natürliche neue Ei vorgemerkt sein. Eine zweite
Vormerkung wird abgewiesen; die zweite Auswahl geht nicht verloren. Es gibt
keine versteckte Kanto-Priorität. Bei korrupten doppelten Vormerkungen oder
unlesbaren Belohnungsmetadaten erfolgt kein Spezial-Override und keine
Bereinigung. Reservierungen bleiben erhalten; stale Vormerkungen können später
bewusst zurückgenommen und erneut gesetzt werden.

Der vorhandene Pet::newEgg-Hook verbraucht ausschließlich die eine vorgemerkte
Region am passenden Lebenszähler. Die gegenwärtige Pflege wird nicht beendet.
Gene entstehen weiterhin durch den normalen Hatch-Pfad; kein Perfektwertebonus.
Die kommende normale Eierplanung wird bei einem Ehrenei wie bisher erhalten.

Neue tp_region_rg_*-Aufrufe binden Vorbereitung und Abschluss an Region/Token.
Kantos alte Vorbereitung und direkter F4-Transportabschluss bleiben kompatibel.
Der neue read-only Transport-Token-Getter verhindert veraltete Regionsbesitzer
bei späteren fremden F4-Transaktionen. Kein zusätzliches Queue-Speicherformat.

Der neue Test setzt Abschlussflags als Fixture; die echten Ligatransaktionen
werden weiterhin separat geprüft. Er nutzt echte Transport-/Pet-Lebensende-,
Neues-Ei- und Hatch-Pfade inklusive Rollback und 256 RNG-/Genvergleichen.
Die gemeinsame Regionsoberfläche und ihre Browser-Ende-zu-Ende-Prüfung folgen.

## Schritt 7: gemeinsame regionale Canvas-Oberfläche

Die Arenaübersicht besitzt eine Regionsschaltfläche. Auswahl, Ordensübersicht,
Liga, Ruhmeshalle und Ehrenei führen einen eigenen Kontext; jede asynchrone
Transaktion hält Region und Module-Instanz bis zum Abschluss fest. Kanto verwendet
weiter die alten nativen APIs; Johto ausschließlich die expliziten regionalen APIs.
Die Auswahlpräferenz liegt lokal im Browser, nicht als Fortschrittsmigration im
Spielstand. Außerhalb aktiver/pending Sitzungen bleiben regionale Checkpoints
erhalten und können mit demselben Pflege-Pokémon wieder aufgenommen werden.

Das Metadaten-UI-Flag wird für gültige registrierte Regionen nun freigegeben.
Es ist keine Startberechtigung: native Orden-, Identitäts-, Daten- und Energiegates
bleiben verbindlich. Die UI prüft zusätzlich alle benötigten Exporte und verweigert
Johto bei altem/partiellem WASM-Kern statt auf Kanto-Schreibaufrufe zurückzufallen.

Johto besitzt passende Namen/Teams, symbolische eigene Ordenszeichnungen und
getrennte Räume für Willi/Koga/Bruno/Melanie/Siegfried. Alle Ansichten bleiben
Canvas-basiert mit dem bestätigten Retro-Stil. Bestehende Kanto-BIN-/PNG-Portraits
werden nicht als Johto-Leiter wiederverwendet. Ohne Johto-Leiterdateien bleibt eine
Platzhalterfigur; Johto-NPC-Grafikimport ist in diesem Schritt nicht enthalten.
Pokémon-Sprites nutzen weiterhin die vorhandenen lokalen Dateien.

Das Ehrenei zeigt einen fremden Vormerkplatz und widersprüchliche/unlesbare
Warteschlangendaten an. Seine Oberfläche bietet keinen Pflegeabschluss an.

Offline-Start umfasst beide Johto-Kataloge und die Regionsbrücke. Die bestehende
Fanganimation bleibt im Renderer erhalten; nur regionale Namen/Themen werden ergänzt.
Die neue VM-Prüfung testet Routing/deferred-save-Races; sie ist kein nativer Browser-
Ende-zu-Ende-Nachweis. Die sechs neuen Browserfälle benötigen den neu gebauten Kern.
Der vollständige Liga-Browserfall verwendet echte Kämpfe und einen gespeicherten
Checkpoint-Roundtrip nach den Top Vier; dabei füllt ausschließlich die Testfixture
die Pflegeenergie auf. Liga-KP, Erholungen und Position werden nicht verändert.
Er testet außerdem Siegerehrung, Reservierung, bewusstes Behalten des bisherigen
Pokémon, tatsächliches Shiny-Schlüpfen und Reload. Kein Balancingbeweis.
