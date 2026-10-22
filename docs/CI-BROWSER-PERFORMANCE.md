# CI Browser Performance - vorbereitete Browserumgebung

Nur Infrastruktur; keine Aenderung an Spielcode, Spielstandformat oder Grafiken.
E3 kann auf dem bisherigen main-Workflow parallel fertig laufen. CI-Aenderungen
zuerst auf ci-browser-performance pruefen, nicht direkt nach main pushen.

## Unveraenderte Qualitaetsanforderungen
Alle vorhandenen Logik-/Native-Pruefungen bleiben im zentralen Testlaeufer.
Chromium UND WebKit, ein Worker, Test-/Expect-Timeouts, Retry-Regel und
failOnFlakyTests bleiben wie bisher. Keine Fehlerunterdrueckung. Nur erfolgreiche
Build- und Browserjobs koennen das freigegebene Webartefakt erzeugen.
Der aufrufende Build-browser-Workflow und seine Abhaengigkeiten bleiben gleich.
Auch Branch und main werden weiterhin separat vollstaendig geprueft.

## Jobfolge
1. build: Native Tests und WASM auf ubuntu-24.04 mit Node 22 und bisherigem
   Emscripten-Setup. Npm-Lockdatei einmal pro Lauf erzeugen, Kandidat versiegeln.
2. browser: offizielles Playwright-Image 1.64.1-noble, auf OCI-Digest festgelegt.
   Chromium/WebKit und Linux-Systembibliotheken sind bereits enthalten.
   Kein APT und keine Browserinstallation im Browserjob. Nur npm ci mit exakt
   der Kandidat-Lockdatei; npm-Cache nach dieser Lockdatei, keine node_modules-
   Wiederverwendung. Installierte Paketversionen und Browserpfade werden geprueft.
3. quality: nur nach erfolgreichen build UND browser. Kandidat erneut aus
   demselben Workflow-Run laden, Herkunft/Hashes pruefen und als bisherigen
   iTamaPoke-D1-Test bereitstellen. Kein erneutes Kompilieren zur Freigabe.

Image:
mcr.microsoft.com/playwright:v1.64.1-noble@sha256:7852dc5a7d72f5fe458a597d690f6c42fbc8e9e26ddfa95f8e6ef552558d9bbf
Tag und OCI-Index-Digest sind im Microsoft Artifact Registry verifiziert:
https://mcr.microsoft.com/en-us/artifact/mar/playwright
https://playwright.dev/docs/docker

## Integritaet
Manifest bindet kompletten nicht versteckten Web-Dateisatz, Dateigroessen und
SHA-256, vollstaendigen Commit, Package-Definition und Lockdatei. Buildjob gibt
den Manifest-Hash als Job-Output weiter. Browser prueft den Kandidaten vor UND
nach Tests gegen diesen Siegelwert; Freigabe prueft dasselbe Siegel erneut.
Manipulationen/fehlende/zusaetzliche Webdateien, falsche Stempel, private
Sprite-/Ruf-/Dex-Assets und Symlinks werden abgelehnt. Versteckte Dateien werden
wie beim bisherigen Artefakt-Upload nicht publiziert. Bilder-Privatheit kann aus
beliebigen umbenannten Dateien nicht automatisch erkannt werden; die bisherigen
Namensverbote bleiben aktiv und werden zusaetzlich rekursiv angewendet.

## Lokaler Testserver
Node-HTTP statt Python fuer die Browser-Fixtures; keine Python-Annahme im Image.
Nur 127.0.0.1, GET/HEAD, korrekte WASM-/JS-MIME-Typen, keine Directory-Listings,
keine versteckten Dateien oder Ausbrueche ueber Symlinks. App-Dateien unveraendert.
Service-Worker-/Offline-Pruefungen bleiben Teil der bisherigen Tests.

## Messung und Grenzen
GitHub-Schritte bleiben einzeln sichtbar. Zusaetzlich echte Laufzeiten und
Exitcodes fuer native Logik, WASM, npm-Lock, npm ci und Browsertests in JSON und
Job-Zusammenfassung. Image-Pull, Checkout, SDK-Setup und Artefakttransfer sind
separate GitHub-Zeiten und nicht Teil dieser Summen. Es wird keine feste
Beschleunigung behauptet, bevor der echte neue GitHub-Lauf abgeschlossen ist.
Kaltes Container-Image und zusaetzliche Artefakttransfers koennen Zeit kosten.
Der bestehende Android-Paketjob hat weiterhin seine eigene Installation; sie
ist nicht Gegenstand dieses Patches. Selbstgehostete Runner werden nicht benoetigt.

## Abnahme
Lokal: Server/MIME/HEAD/Pfadschutz, Artefakt- und Lock-Manipulationen, Siegelwert,
Timing/Exitcode-Weitergabe und statische Workflow-Anforderungen getestet.
Offen: echter GitHub-Containerpull, npm-Installation im Container, vollstaendiger
WASM-/Chromium-/WebKit-Lauf, anschliessend Vergleich mit bisherigen Zeiten.
Keine neue Veroeffentlichung allein aufgrund lokaler Infrastrukturtests.
