# F4-B3b Pflegelebenszyklus

Entwicklungsbaustein, nicht komplettes F4. Basis ist der bestaetigte B3a-Stand
f4-collection-a / 977c0f7814adde840504295ccfcd36dda9ed6ddb.
Fuenf vollstaendige Produktionsdateien wurden gegen die eingefuegten SHA256-
Werte geprueft. Keine historischen Dex-/Fangbits werden in Exemplare verwandelt.

Aktuelles Wesen: genau einmal zuordnen, reale Daten und stabile Modell-ID.
Native f4lver=1/f4life-Nonce kennzeichnet die Lebensphase, keine erfundene Zeit.
Entwicklung und reale Werte synchronisieren dieselbe ID. Altes Ei/Neustart-
Hatch wird als raised erkannt; vorhandener Actor als existing. Boxeintraege
altern/trainieren nicht. Bekannte eigene Zusatzdaten bleiben erhalten.

Abschied und vorzeitiges Pflegeende oeffnen ein helles Entscheidungsblatt:
Behalten, endgueltig gehenlassen, Abbrechen (Standardfokus). Endgueltig verlangt
separate Bestaetigung. Behalten verschiebt dieselbe ID, keine Kopie und keine
zusaetzlichen Ei-/Abschiedsboni. Volle Box sperrt Behalten vor Native-Endaktion.
Runaway behaelt nichts; native Vernachlaessigungsbedingung bleibt Pflicht.
Die originalen Pet-Endungs- und Ei-Regeln bleiben bestehen. Eine lange
Entscheidung verkuerzt die Zeremonie nicht; monotone Startzeit wird aktualisiert.
Zeremonie und Sammlung werden atomar gespeichert. Neustart mitten in ihr
vollendet den Ei-Uebergang einmal. Neue Eier erhoehen die Nonce ohne RNG-Zugabe.

Globale Transaktions-/Dialog-Sperre blockiert konkurrierende Eingaben,
Spielschritte und Import/Reset. Saves synchronisieren zuerst. Capture gleicht
den Actor vor/nach Fangfolgen ab. Fehler nehmen Pet und Store zurueck; defekte
oder kuenftige Identitaetsmetadaten werden nicht normalisiert/geloescht.
Import prueft Version, Nonce, Art, Shiny und unveraenderliche Gene. Sounds erst
nach Speicherbestaetigung. Alte direkte End-Exporte bei enrolled Profil gesperrt.

Noch offen: Box-/Teamoberflaeche, Teamkaempfe, Wiederaufnahme gelagerter Pflege,
Leiter-BINs, Ordenkoffer, Rechteansicht und Geraeteabnahme. Standardablage
Box 1/naechste freie bis zur Boxauswahl-UI. Passender neuer WASM-Build ist Pflicht.
Installation bearbeitet nur Quellcode und greift nicht auf Browser-Saves zu.

Pruefungen: echte native Pet-/Store-/Savecodec-Tests; 73 JS-Assertions mit echtem
Modell/Controller und simuliertem Backend; DOM-Simulation fuer Fokus, Abbruch,
Endgueltig-Nein, Behalten, volle Box und gleichzeitige Oeffnungsversuche.
Originale verfuegbare A/B1/B2/F3-Regression lief mit neuen Lifecycle-Tests.
Die vollstaendigen alten B3a-Testdateien fehlen in den Chat-Auschnitten;
ihr kompletter Lauf wird lokal NICHT behauptet. Der Installer fuehrt bei dir
unveraendert ALLE vorhandenen B3a-Tests plus B3b aus und meldet nur bei Exit 0
Erfolg. Bei Fehlern Quell-Ruecknahme auf B3a. Kein Commit/Push/Branchwechsel.
Browser-Test-Helper warten auf einmalige enrollment-Fertigstellung.
B2/B3a-Browser-Erwartungen zaehlen jetzt ein reales Pflegewesen, nicht leere
Sammlung. Outcome-/Rollback-Pruefungen bleiben erhalten. B3a-Spec bekommt
nur zwei eindeutig gepruefte Textersetzungen; der uebrige Inhalt bleibt exakt.
Keine Workflow-/Timeout-/Retry-/Containeraenderung. Kein echter WASM-/Browser-
oder iPhone-Lauf in dieser Umgebung, keine Veroeffentlichungsfreigabe.
