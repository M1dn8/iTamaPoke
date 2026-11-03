/* Offline documentation; never untrusted HTML or automatic fetch. */
(function(){'use strict';
function node(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;}
function card(root,e){const c=node('section');c.className='tp-rights-card';c.append(node('h3',e.name),node('p',e.author),node('p',e.status),node('p',e.note));if(e.source){c.append(node('p','Quelle: '+e.source));try{const url=new URL(e.source);if(['http:','https:'].includes(url.protocol)){const a=node('a','Quelle bewusst oeffnen');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';c.append(a);}}catch(_){}}root.append(c);}

/* UI01 rights: source register and complete offline documents */
const rightsUiWords={"en": {"sources": "Sources", "trainers": "Trainers", "licenses": "Licenses", "notes": "Notes", "notice": "Documentation, not a rights guarantee.", "previous": "Previous entry", "next": "Next entry", "loading": "Reading local metadata …", "empty": "No entries available", "record": "Entry", "metadata": "Metadata", "docTitle": "Documentation", "docNote": "Documentation, not legal advice or a guarantee. Credits do not replace missing rights. External source links are not opened automatically.", "trainerTitle": "Local trainer metadata", "trainerNote": "Local file information is not verified and does not establish usage permission.", "offlineTitle": "Offline documents and links", "offlineNote": "License texts and notes are included offline. Source links need internet only when deliberately opened. User files are not uploaded."}, "de": {"sources": "Quellen", "trainers": "Trainer", "licenses": "Lizenzen", "notes": "Hinweise", "notice": "Dokumentation, keine Rechtsgarantie.", "previous": "Vorheriger Eintrag", "next": "Nächster Eintrag", "loading": "Lokale Angaben werden gelesen …", "empty": "Keine Einträge vorhanden", "record": "Eintrag", "metadata": "Angaben", "docTitle": "Dokumentation", "docNote": "Dokumentation, keine Rechtsberatung oder Rechtsgarantie. Credits ersetzen keine fehlenden Rechte. Externe Quellenlinks werden nicht automatisch aufgerufen.", "trainerTitle": "Lokale Trainerangaben", "trainerNote": "Angaben aus lokalen Dateien sind nicht verifiziert und belegen keine Nutzungsfreigabe.", "offlineTitle": "Offline-Texte und Links", "offlineNote": "Lizenztexte und Hinweise sind offline enthalten. Quellenlinks brauchen erst beim bewussten Öffnen Internet. Nutzerdateien werden nicht hochgeladen."}, "es": {"sources": "Fuentes", "trainers": "Entrenadores", "licenses": "Licencias", "notes": "Notas", "notice": "Documentación, no garantía de derechos.", "previous": "Entrada anterior", "next": "Entrada siguiente", "loading": "Leyendo metadatos locales …", "empty": "No hay entradas", "record": "Entrada", "metadata": "Datos", "docTitle": "Documentación", "docNote": "Documentación, no asesoría ni garantía jurídica. Los créditos no sustituyen permisos. Los enlaces externos no se abren automáticamente.", "trainerTitle": "Metadatos locales", "trainerNote": "Los datos de archivos locales no están verificados y no acreditan permiso de uso.", "offlineTitle": "Textos y enlaces", "offlineNote": "Licencias y notas disponibles sin conexión. Los enlaces solo necesitan internet al abrirlos conscientemente. No se suben archivos del usuario."}, "fr": {"sources": "Sources", "trainers": "Dresseurs", "licenses": "Licences", "notes": "Notes", "notice": "Documentation, sans garantie de droits.", "previous": "Entrée précédente", "next": "Entrée suivante", "loading": "Lecture des métadonnées locales …", "empty": "Aucune entrée", "record": "Entrée", "metadata": "Données", "docTitle": "Documentation", "docNote": "Documentation, sans conseil ni garantie juridique. Les crédits ne remplacent pas les autorisations. Aucun lien externe ne s’ouvre automatiquement.", "trainerTitle": "Métadonnées locales", "trainerNote": "Les données des fichiers locaux ne sont pas vérifiées et ne prouvent pas une autorisation.", "offlineTitle": "Textes et liens", "offlineNote": "Licences et notes disponibles hors ligne. Internet sert uniquement à ouvrir volontairement les liens. Aucun fichier utilisateur n’est téléversé."}};
/* UI01 rights: complete German reading versions, originals retained */
const rightsGermanDocuments={"Projekt-LICENSE (unveraendert)": {"title": "Projekt-Lizenz", "text": "iTamaPoke — Lizenz zur persönlichen Nutzung 1.0\n(„Personal Use License 1.0“)\n\nCopyright (c) 2026 Mitwirkende am TamaPoke-Port für iOS/watchOS\n(Ursprüngliche Firmware: Copyright (c) 2026 Quique Tortosa — siehe unten „Upstream“)\n\nDies ist eine eigens formulierte Lizenz, keine zertifizierte Open-Source-Lizenz. Ihr Stil orientiert sich an der PolyForm-Lizenzfamilie (https://polyformproject.org), ihre Bedingungen wurden jedoch speziell für dieses Projekt verfasst. Sie ist keine offizielle PolyForm-Lizenz. Lies sie; gehe nicht davon aus, dass sie dasselbe besagt wie eine andere Lizenz mit ähnlichem Namen.\n\n--------------------------------------------------------------------------\n1. Geltungsbereich\n--------------------------------------------------------------------------\n\nDiese Lizenz gilt für den Quellcode, die Erstellungsskripte und die Dokumentation in diesem Repository („die Software“), AUSGENOMMEN:\n\n- upstream/ — ein Git-Submodul, das auf github.com/socquique/TamaPoke verweist und hier unter dessen EIGENER MIT-Lizenz verwendet wird (siehe upstream/LICENSE). Diese Lizenz gewährt keine Rechte an diesem Projekt selbst und legt ihm keine Einschränkungen auf. Jede Person kann es unter seinen eigenen Bedingungen direkt aus seinem eigenen Repository beziehen.\n\n- upstream-expanded/ — unverändert übernommene Spiellogikdateien aus github.com/ShadowEnemyx/TamaPoke („TamaPoke — Expanded“, eine gemeinschaftliche Abspaltung des oben genannten Projekts). Die Zeilen für Generation 2 und 3 der Artentabelle wurden aus github.com/DylanPDao/TamaPoke übertragen, einer weiteren Abspaltung desselben Projekts. Beide stehen unter der MIT-Lizenz; siehe upstream-expanded/LICENSE und upstream-expanded/README.md. Wie bei upstream/ gilt: Diese Lizenz gewährt keine Rechte an diesen Projekten und legt ihnen keine Einschränkungen auf. Sie bleiben unter ihren jeweiligen Bedingungen aus ihren eigenen Repositorys verfügbar.\n\n- Sämtliche Medien Dritter, etwa Figuren-Sprites oder das Bild des App-Symbols, die bewusst NICHT in diesem Repository enthalten sind. Siehe NOTICE.\n\n--------------------------------------------------------------------------\n2. Persönliche Nutzung — ohne vorherige Anfrage erlaubt\n--------------------------------------------------------------------------\n\nDu darfst kostenlos:\n\n- die Software verwenden, lesen und untersuchen;\n- sie für dich selbst verändern, einschließlich persönlicher Experimente wie der Umgestaltung der Kreaturen zu einer anderen Art oder einem anderen Tier, der Änderung von Namen oder der Anpassung des Spielablaufs;\n- sie erstellen und das Ergebnis auf Geräten installieren, die dir persönlich gehören oder die du verwaltest, etwa deinem eigenen iPhone, deiner eigenen Apple Watch oder einem Simulator;\n- dieses Repository auf GitHub für dieselben oben beschriebenen persönlichen Zwecke abspalten;\n- die Browserversion aus deiner eigenen persönlichen Abspaltung erstellen und sie unter einer Adresse deines eigenen Kontos veröffentlichen, beispielsweise über GitHub Pages, wie es der Arbeitsablauf dieses Repositorys vorsieht. Anschließend darfst du sie auf deinen eigenen Geräten als Web-App oder als das beim Erstellen erzeugte Android-Paket installieren („persönliche Erstellung“ beziehungsweise „Personal Build“). Dies ist der vorgesehene Weg, das Spiel zu erhalten: Der Rechteinhaber betreibt keine gemeinsame Adresse für alle. Eine persönliche Erstellung ist für dich bestimmt. Ihre Adresse kann technisch auch für andere erreichbar sein; dies wird geduldet, solange du sie nicht als Bezugsort für andere bewirbst, weitergibst oder darstellst. Eine persönliche Erstellung enthält ausschließlich Code. Die Kreaturen-Sprites, Rufe und Pokédex-Texte, die sie anzeigen beziehungsweise wiedergeben kann, gehören niemals zum veröffentlichten Inhalt. Du stellst sie von deinem eigenen Gerät bereit; für sie gilt Abschnitt 7, nicht diese Lizenz.\n\nNichts davon erfordert eine Zahlung oder Genehmigung, unabhängig davon, ob die Nutzung kommerziell ist oder nicht.\n\n--------------------------------------------------------------------------\n3. Was ohne vorherige schriftliche Genehmigung des Rechteinhabers NICHT erlaubt ist\n--------------------------------------------------------------------------\n\nUnabhängig davon, ob Geld fließt, darfst du ohne vorherige Anfrage NICHT:\n\na. Eine Erstellung, Binärdatei, .ipa-Datei, ein Paket oder ein installierbares Erzeugnis der Software oder einer veränderten beziehungsweise abgeleiteten Version davon veröffentlichen, verbreiten oder einer anderen Person als dir selbst anderweitig zur Verfügung stellen. Dies gilt über den App Store, TestFlight, alternative Marktplätze, Dienste zum Installieren außerhalb eines App-Stores, öffentliche Downloadlinks, GitHub Releases und sämtliche anderen Wege. Die einzige Ausnahme ist deine eigene persönliche Erstellung nach Abschnitt 2: Sie unter deinem eigenen Konto für dein eigenes Spielen zu veröffentlichen ist erlaubt. Andere Personen auf deine oder die persönliche Erstellung einer anderen Person hinzuweisen ist nicht erlaubt — jede Person erstellt ihre eigene Version aus ihrer eigenen Abspaltung.\n\nb. Dasselbe mit einer Version tun, in der Figuren, Namen, Grafikstil oder Arten wesentlich ersetzt wurden, beispielsweise einer auf Katzen, Hunde oder andere Kreaturen umgestalteten Version dieses Projekts. Auch eine solche Version bleibt eine Ableitung dieser Software und unterliegt dieser Einschränkung genau wie das Original. Ein Austausch der Grafik ist keine Möglichkeit, diese Klausel zu umgehen.\n\nc. Eine Abspaltung dieses Repositorys oder ein daraus erstelltes Projekt als unabhängiges oder nicht damit zusammenhängendes Produkt darstellen.\n\nd. Diese Lizenz, die Datei NOTICE oder die Herkunftskommentare in übersetzten Quelldateien entfernen oder verändern.\n\n„Verbreiten“ und „zur Verfügung stellen“ schließen ein, einer anderen Person auf irgendeinem Weg die Installation der App auf ihrem Gerät zu ermöglichen — auch kostenlos, auch nur einer einzigen weiteren Person und auch innerhalb einer privaten Gruppe. Die persönliche Nutzung nach Abschnitt 2 endet bei deinen eigenen Geräten.\n\n--------------------------------------------------------------------------\n4. Genehmigung anfragen\n--------------------------------------------------------------------------\n\nWenn du etwas aus Abschnitt 3 tun möchtest, frage zuerst den Rechteinhaber. Eine gegebenenfalls erteilte Genehmigung gilt nur für den konkret angefragten Zweck. Sie überträgt sich nicht auf eine andere Veröffentlichung, eine andere grafische Umgestaltung oder einen anderen Verbreitungsweg.\n\n--------------------------------------------------------------------------\n5. Verstöße\n--------------------------------------------------------------------------\n\nWenn du zum ersten Mal schriftlich darüber informiert wirst, dass du gegen diese Lizenz verstoßen hast, bleibt deine Lizenz bestehen, sofern du innerhalb von 32 Tagen nach dieser Mitteilung sämtliche Bedingungen wieder vollständig einhältst und praktische Schritte zur Behebung des Verstoßes unternimmst, etwa eine verbreitete Erstellung zurückziehst. Andernfalls enden sämtliche dir durch diese Lizenz gewährten Rechte sofort.\n\n--------------------------------------------------------------------------\n6. Keine Haftung\n--------------------------------------------------------------------------\n\nDie Software wird „WIE BESEHEN“ bereitgestellt, ohne ausdrückliche oder stillschweigende Gewährleistung irgendeiner Art. Dies umfasst insbesondere, aber nicht ausschließlich, Gewährleistungen der Marktgängigkeit, der Eignung für einen bestimmten Zweck und der Nichtverletzung von Rechten Dritter. In keinem Fall haften die Urheber oder Rechteinhaber für Ansprüche, Schäden oder sonstige Verbindlichkeiten, die aus der Software oder ihrer Nutzung entstehen.\n\n--------------------------------------------------------------------------\n7. Upstream und Material Dritter\n--------------------------------------------------------------------------\n\nDiese Lizenz gewährt, beschränkt oder beeinflusst keine Rechte an den folgenden Bestandteilen und kann dies auch nicht:\n\n- dem Submodul upstream/ — socquique/TamaPoke, MIT-Lizenz, eigenes Projekt, eigene Bedingungen;\n- den in upstream-expanded/ übernommenen Dateien — ShadowEnemyx/TamaPoke und den Artentabellenzeilen aus DylanPDao/TamaPoke, MIT-Lizenz, eigene Projekte, eigene Bedingungen;\n- Pokémon-Namen, -Designs und -Artendaten, (c) Nintendo / Game Freak / The Pokémon Company, die hier nicht verbreitet werden;\n- aus PMD SpriteCollab abgeleiteten Sprites, CC BY-NC 4.0, die hier nicht verbreitet werden.\n\nEine vollständige Aufstellung dessen, was in diesem Repository enthalten beziehungsweise nicht enthalten ist, steht in NOTICE.\n"}, "Projekt-NOTICE (unveraendert)": {"title": "Herkunft und Hinweise", "text": "NOTICE — Herkunftsangaben und Geltungsbereich für iTamaPoke\n\nDiese Datei dient der Information. Die verbindlichen Bedingungen stehen in LICENSE, einer eigens formulierten „Lizenz zur persönlichen Nutzung“ („Personal Use License“) — lies sie, sie ist kurz. Diese Datei ergänzt keine Bedingungen über LICENSE hinaus. Sie erläutert die Herkunft und führt genau auf, was in diesem Repository enthalten beziehungsweise nicht enthalten ist.\n\n\nHERKUNFTSANGABEN\n\nDieses Repository ist eine abgeleitete Arbeit von TamaPoke von Quique Tortosa (https://github.com/socquique/TamaPoke), verwendet unter der MIT-Lizenz.\n\nWesentliche Teile von Sources/ sind direkte Übersetzungen des C++-Codes dieses Projekts nach Swift und Objective-C++. Dazu gehören insbesondere die Szenendarstellung, die Anordnung und Eingabeverarbeitung des Ruhebildschirms, die Farbpalette und Anordnungskonstanten der Oberfläche sowie die Logik der Statustexte. Diese Teile verbleiben unter (c) Quique Tortosa. Die Erlaubnis zur persönlichen Nutzung und das Weiterverbreitungsverbot aus LICENSE gelten für die Kopie dieser Teile in diesem Repository genauso wie für den übrigen Port. Das ursprüngliche Projekt bleibt unabhängig von den hiesigen Aussagen unter seinen eigenen MIT-Bedingungen aus seinem eigenen Repository verfügbar. Jede Datei mit übersetztem Code nennt ihren Ursprung in einem Kopfkommentar.\n\nupstream/ ist ein Git-Submodul: Dieses Repository speichert nur einen Verweis auf einen bestimmten Versionsstand, keine kopierten Dateien. Für seinen Inhalt gilt seine eigene LICENSE-Datei.\n\nDie MIT-Lizenz verlangt, dass ihr Hinweis in Kopien des von ihr erfassten Codes enthalten ist, einschließlich einer übersetzten Ableitung. Ein einfacher ZIP-Download dieses Repositorys enthält jedoch keine Submodulinhalte. Ein bloßer Verweis auf upstream/LICENSE würde diese Kopie daher nicht erreichen. Der Hinweis wird im englischen Original unverändert wiedergegeben, damit er jeder Kopie dieses Repositorys beiliegt, unabhängig davon, wie diese bezogen wurde. Hier folgt seine deutsche Lesefassung:\n\n    MIT-Lizenz\n\n    Copyright (c) 2026 Quique Tortosa\n\n    Hiermit wird jeder Person, die eine Kopie dieser Software und der zugehörigen Dokumentationsdateien („die Software“) erhält, unentgeltlich die Erlaubnis erteilt, ohne Einschränkung mit der Software zu verfahren. Dies umfasst insbesondere die Rechte, die Software zu verwenden, zu kopieren, zu verändern, zusammenzuführen, zu veröffentlichen, zu verbreiten, Unterlizenzen zu erteilen und/oder Kopien der Software zu verkaufen sowie Personen, denen die Software überlassen wird, dies zu gestatten, vorbehaltlich der folgenden Bedingungen:\n\n    Der vorstehende Urheberrechtshinweis und dieser Erlaubnishinweis müssen in allen Kopien oder wesentlichen Teilen der Software enthalten sein.\n\n    DIE SOFTWARE WIRD „WIE BESEHEN“ BEREITGESTELLT, OHNE AUSDRÜCKLICHE ODER STILLSCHWEIGENDE GEWÄHRLEISTUNG IRGENDEINER ART, INSBESONDERE OHNE GEWÄHRLEISTUNG DER MARKTGÄNGIGKEIT, DER EIGNUNG FÜR EINEN BESTIMMTEN ZWECK ODER DER NICHTVERLETZUNG VON RECHTEN DRITTER. IN KEINEM FALL HAFTEN DIE URHEBER ODER RECHTEINHABER FÜR ANSPRÜCHE, SCHÄDEN ODER SONSTIGE VERBINDLICHKEITEN, OB AUS VERTRAG, UNERLAUBTER HANDLUNG ODER ANDERWEITIG, DIE AUS DER SOFTWARE, IHRER VERWENDUNG ODER DEM SONSTIGEN UMGANG MIT DER SOFTWARE ENTSTEHEN ODER DAMIT ZUSAMMENHÄNGEN.\n\nDieser Hinweis erfasst die oben genannten Teile von Sources/, die aus dem C++-Code des ursprünglichen Projekts übersetzt wurden. Die zusätzlichen, strengeren Bedingungen aus LICENSE gelten darüber hinaus für dieses Repository als Ganzes; siehe LICENSE, Abschnitt 1. Die MIT-Lizenz erlaubt zusätzliche Bedingungen für eine Ableitung, solange dieser Hinweis mitgeliefert wird. Genau dies leistet dieser Abschnitt.\n\nDie Zeilen für Generation 2 und 3 der Artentabelle, Pokédex-Nummern 152–386, wurden aus einer dritten Quelle übertragen: DylanPDao/TamaPoke (https://github.com/DylanPDao/TamaPoke), einer weiteren gemeinschaftlichen Abspaltung desselben Projekts, die wie die anderen unter der MIT-Lizenz steht. Übernommen wurden ausschließlich diese Tabellenzeilen, umgewandelt in die eigene Spaltenanordnung dieser Erstellung; siehe upstream-expanded/README.md. Die in diesen Zeilen beschriebenen Artennamen, Designs und Pokédex-Texte verbleiben unter (c) Nintendo / Game Freak / The Pokémon Company und fallen unter den nachfolgenden Abschnitt „NICHT ERFASST“.\n\nDie Funktionen Persönlichkeit, Tagesziele, Box und Pokédex-Filter, das Wildkampfsystem, die Fang-, Merk-, Reinigungs- und Typen-Minispiele, Expeditionen sowie der Klangeffekt-Synthesizer wurden aus einer zweiten, getrennten Quelle übersetzt: ShadowEnemyx/TamaPoke (https://github.com/ShadowEnemyx/TamaPoke), einer gemeinschaftlichen Abspaltung des oben genannten Projekts. Dazu gehören beim Synthesizer die Notentabellen, Wellenformen und das Tonmodus-Konzept, von dem der eigene dreistufige Schalter LAUTLOS/VIBRATION/VOLL dieser Erstellung abstammt. Die Quelle ist nicht socquiques eigenes Repository und nicht das Submodul upstream/, das weiterhin auf socquiques Projekt festgelegt bleibt. Sie verwendet dieselbe MIT-Lizenz und nennt denselben ursprünglichen Rechteinhaber; siehe upstream-expanded/LICENSE. Deshalb erfasst der oben wiedergegebene Hinweis auch diese Teile. Dieser zusätzliche Absatz benennt lediglich die tatsächliche Quelle dieses Codes. Anders als upstream/ besteht upstream-expanded/ aus einigen direkt übernommenen Dateien, nicht aus einem Submodul und nicht aus einer vollständigen Kopie dieser Abspaltung. Welche Dateien aus welchem Grund übernommen wurden, steht in upstream-expanded/README.md.\n\n\nQUELLEN UND MITWIRKENDE\n\nDie in dex.h des ursprünglichen Projekts eingebundenen Kampfgrundwerte, etwa Angriff, Verteidigung und Initiative, stammen laut dessen eigenem tools/dex_stats.py von PokéAPI (https://pokeapi.co).\n\nScripts/fetch_dex_entries.sh verwendet dieselbe Schnittstelle, um Pokédex-Eintragstexte für die Detailansicht abzurufen, jeweils eine Datei pro Sprache: mons/dex_entries_<lang>.txt. Diese Texte gehören Nintendo, nicht PokéAPI. Das Skript schreibt sie in einen von Git ausgeschlossenen Pfad. Sie werden für die jeweilige nutzende Person abgerufen und hier niemals eingecheckt oder weiterverbreitet. Siehe den README-Abschnitt „Pokédex entries“.\n\nScripts/fetch_cries.sh ruft die Rufe der einzelnen Arten aus dem Repository PokeAPI/cries (https://github.com/PokeAPI/cries) ab. Dies ist eine von der Gemeinschaft gepflegte Spiegelung derselben Spielaudiodaten. Beim Abruf werden .ogg-Dateien mit ffmpeg nach .m4a umgewandelt, weil AVFoundation Ogg Vorbis nicht dekodieren kann. Es gilt derselbe Status wie für die Pokédex-Texte: Die Audiodaten gehören Nintendo, nicht PokéAPI oder diesem Repository. Sie werden für die jeweilige nutzende Person in einen von Git ausgeschlossenen Pfad geladen, mons/psnd<dex>.m4a, und hier niemals eingecheckt oder weiterverbreitet. Siehe den README-Abschnitt „Cries“.\n\nScripts/fetch_sprites.sh, pack_normal_sprites.py und pack_shiny_sprites.py beziehen Kreaturen-Sprites aus PMD SpriteCollab (https://github.com/PMDCollab/SpriteCollab), einem von Fans gepflegten Kunstprojekt unter CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/). Auch sie werden in einen von Git ausgeschlossenen Pfad geschrieben und hier niemals eingecheckt oder weiterverbreitet. Siehe den README-Abschnitt „Sprites“ und den nachfolgenden Abschnitt „NICHT ERFASST“. Dort wird erläutert, warum dieses Repository sie dennoch nicht verbreitet, obwohl CC BY-NC für sich genommen eine nichtkommerzielle Weiterverbreitung mit Herkunftsangabe erlauben würde: Sie werden zusammen mit Nintendos eigenen Pokédex-Texten und Rufaudiodaten abgerufen, für die keine entsprechende Erlaubnis vorliegt. Dieses Projekt behandelt sämtliche Kreaturen-Medien nach einer einheitlichen Regel — pro Gerät abrufen, niemals weiterverbreiten — statt die Behandlung je nach Lizenz aufzuteilen.\n\nScripts/fetch_assets.sh ist ein kleines übergeordnetes Skript, das die drei oben genannten Abrufwege gemeinsam für die gewünschten Arten ausführt: mit --only sprites,shiny,sound oder standardmäßig mit allen.\n\n\nDURCH KEINE HIER GEWÄHRTE LIZENZ ERFASST\n\n- Pokémon-Designs, Grafiken, Audiodaten und Pokédex-Texte — (c) Nintendo / Game Freak / The Pokémon Company. Sie werden NICHT in diesem Repository oder in der bereitgestellten Browsererstellung verbreitet. Eine Lizenz dafür wird weder erteilt noch angedeutet. Die Pokédex-Detailansicht liest Eintragstexte zur Laufzeit aus einer von der nutzenden Person bereitgestellten Datei mons/dex_entries_<lang>.txt, genauso wie sie Sprites und Rufe liest. Nichts davon wird mitgeliefert.\n\n  Was der Code als einfache, aus der MIT-lizenzierten ursprünglichen Firmware übernommene Daten enthält, ist die Artentabelle: Pokédex-Nummern, Namen in sieben Sprachen, Typen, Grundwerte von PokéAPI und Entwicklungsverknüpfungen. Namen und Nummern werden zur Benennung verwendet, um anzugeben, zu welcher Kreatur eine bereitgestellte Datei gehört. Es sind keine Grafiken, Audiodaten oder beschreibenden Texte enthalten.\n\n- Sprites aus PMD SpriteCollab — CC BY-NC 4.0. Sie werden hier NICHT verbreitet.\n  https://github.com/PMDCollab/SpriteCollab\n\n- Das 3D-gedruckte Gehäuse des ursprünglichen Projekts — CC BY-NC-SA. Es wird hier NICHT verbreitet.\n\n\nNUTZUNG\n\nDies ist ein inoffizielles Fanprojekt zur persönlichen Nutzung. Es ist weder mit Nintendo verbunden noch von Nintendo unterstützt. LICENSE erfasst den Quellcode in diesem Repository. Sie gewährt keine Rechte am oben aufgeführten Material Dritter und kann dies auch nicht.\n\nKurz gesagt — die verbindliche Fassung steht in LICENSE, Abschnitt 3: Veröffentliche keine Erstellungen, verbreite keine Binärdateien und stelle dieses Projekt oder eine grafisch umgestaltete Ableitung davon — gleiche Spieltechnik, andere Kreaturen — niemandem außer dir selbst zur Verfügung, in welcher Form auch immer, gegen Geld oder kostenlos. Die Erstellung für deine eigenen Geräte und beliebige Änderungen an deiner eigenen Kopie sind erlaubt. Siehe den Abschnitt „Legal“ in README.md.\n"}};
Object.assign(rightsUiWords.de,{
 readingNote:"Deutsche Lesefassung zur Orientierung. Sie ersetzt das unveränderte englische Original nicht und erteilt keine zusätzlichen Rechte.",
 originalDocument:"Original (Englisch)"
});
Object.assign(rightsUiWords.en,{
 readingNote:"German reading version; the unchanged English original is retained.",
 originalDocument:"Original (English)"
});
Object.assign(rightsUiWords.es,{
 originalDocument:"Original (inglés)"
});
Object.assign(rightsUiWords.fr,{
 originalDocument:"Original (anglais)"
});
function rightsLicenseDocument(item){
 const card=node("section");card.className="tp-rights-card tp-rights-license";
 card.dataset.rightsLicense=item.name;
 const translated=window.TPText?.language?.()==="de"?rightsGermanDocuments[item.name]:null;
 if(translated){
  const reading=node("pre",translated.text);reading.dataset.rightsTranslation="de";
  const original=node("details");original.className="tp-rights-original";
  const originalText=node("pre",item.text);originalText.dataset.rightsOriginal="";
  original.append(node("summary",rightsText("originalDocument")),originalText);
  const note=node("p",rightsText("readingNote"));note.className="tp-rights-reading-note";
  card.append(node("h3",translated.title),note,reading,original);
 }else{
  const originalText=node("pre",item.text);originalText.dataset.rightsOriginal="";
  card.append(node("h3",item.name),originalText);
 }
 return card;
}

let rightsUiLocaleReady=false;
function rightsText(key){
 if(!rightsUiLocaleReady&&window.TPText?.registerLocale){
  for(const code of ["en","de","es","fr"]){
   TPText.registerLocale(code,Object.fromEntries(
    Object.entries(rightsUiWords[code]).map(([key,value])=>["rightsPage."+key,value])
   ));
  }
  rightsUiLocaleReady=true;
 }
 return window.TPText?.t?TPText.t("rightsPage."+key):rightsUiWords.en[key];
}
function rightsIcon(kind){
 const span=node("span");span.className="tp-rights-icon";
 span.setAttribute("aria-hidden","true");
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.setAttribute("viewBox","0 0 24 24");
 svg.setAttribute("fill","none");svg.setAttribute("stroke","currentColor");
 svg.setAttribute("stroke-width","1.6");svg.setAttribute("stroke-linecap","round");
 svg.setAttribute("stroke-linejoin","round");
 const paths={
  sources:"M4 3h6v6H4Zm10 12h6v6h-6ZM10 6h7v9M7 9v9h7",
  trainers:"M4 21v-3a8 8 0 0 1 16 0v3M8 5h8M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8",
  licenses:"M4 2h12l4 4v16H4Zm4 6h8m-8 4h8m-8 4h5",
  notes:"M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 8v8m0-12v1",
  previous:"m15 4-8 8 8 8",
  next:"m9 4 8 8-8 8"
 };
 const path=document.createElementNS("http://www.w3.org/2000/svg","path");
 path.setAttribute("d",paths[kind]);svg.append(path);span.append(svg);return span;
}

/* UI01 paging: actual Pokedex rectangles and glyphs */
function ui01PagingFace(glyph){
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");
 svg.setAttribute("viewBox","0 0 44 44");
 svg.setAttribute("aria-hidden","true");
 svg.classList.add("tp-ui01-paging-face");
 const box=document.createElementNS(ns,"rect");
 for(const [key,value]of Object.entries({
  x:7,y:10,width:30,height:24,rx:5,
  fill:"#f6f9fa",stroke:"#292831","stroke-width":1.5
 }))box.setAttribute(key,String(value));
 const text=document.createElementNS(ns,"text");
 for(const [key,value]of Object.entries({
  x:22,y:22,"text-anchor":"middle","dominant-baseline":"central",
  "font-family":"monospace","font-size":10,"font-weight":700,fill:"#292831"
 }))text.setAttribute(key,String(value));
 text.textContent=glyph;svg.append(box,text);return svg;
}
function ui01BindPaging(owner,nav,previous,next,counter,alive){
 nav.classList.add("tp-ui01-paging");
 previous.replaceChildren(ui01PagingFace("<"));
 next.replaceChildren(ui01PagingFace(">"));
 function sync(){
  for(const button of [previous,next]){
   const svg=button.children[0];
   svg.children[0].setAttribute("fill",button.disabled?"#b9c7cd":"#f6f9fa");
   svg.children[1].setAttribute("fill",button.disabled?"#74838a":"#292831");
  }
  if(typeof hubDexLayout!=="function"||!owner.getBoundingClientRect)return;
  const canvas=document.getElementById("tp");
  if(!canvas?.getBoundingClientRect)return;
  const c=canvas.getBoundingClientRect(),o=owner.getBoundingClientRect();
  if(!(c.width>0))return;
  const g=hubDexLayout(c.width),scale=c.width/466;
  const style=getComputedStyle(owner);
  const bx=parseFloat(style.borderLeftWidth)||0,by=parseFloat(style.borderTopWidth)||0;
  const ox=c.left-o.left-bx,oy=c.top-o.top-by;
  for(const [button,rect]of [[previous,g.previous],[next,g.next]]){
   button.style.left=(ox+rect.x*scale-(44-rect.w*scale)/2)+"px";
   button.style.top=(oy+rect.y*scale-(44-rect.h*scale)/2)+"px";
  }
  counter.style.top=(oy+g.previous.y*scale)+"px";
  counter.style.height=(g.previous.h*scale)+"px";
  counter.style.lineHeight=(g.previous.h*scale)+"px";
 }
 if(typeof ResizeObserver==="function"&&owner.getBoundingClientRect){
  const resize=new ResizeObserver(()=>{if(alive())sync();else resize.disconnect();});
  resize.observe(owner);
  if(typeof MutationObserver==="function"){
   const watch=new MutationObserver(()=>{
    if(!alive()){resize.disconnect();watch.disconnect();}
   });
   watch.observe(owner,{childList:true});
  }
 }
 sync();return sync;
}

async function mount(root,alive=()=>true){
 root.className="tp-rights-scroll tp-rights-device";
 root.dataset.rightsReady="false";
 let selected="sources";
 const positions={sources:0,trainers:0,licenses:0,notes:0};
 const groups={},records={sources:[],trainers:[],licenses:[],notes:[]};
 const frame=node("div");frame.className="tp-admin-frame";
 frame.setAttribute("aria-hidden","true");
 for(const cls of ["tp-pokedex-display tp-pokedex-display-left",
  "tp-pokedex-display tp-pokedex-display-right","tp-pokedex-spine"]){
  const part=node("span");part.className=cls;frame.append(part);
 }
 const notice=node("div",rightsText("notice"));notice.className="tp-rights-notice";
 const body=node("div");body.className="tp-admin-body";
 const left=node("div"),right=node("div");
 left.className=right.className="tp-admin-column";
 const categories=node("div");categories.className="tp-rights-categories";
 const content=node("div");content.className="tp-rights-content";
 content.tabIndex=0;
 left.append(categories);right.append(content);body.append(left,right);
 for(const key of ["sources","trainers","licenses","notes"]){
  const group=node("div");group.className="tp-rights-records";group.hidden=true;
  groups[key]=group;content.append(group);
 }
 const navigation=node("div");navigation.className="tp-rights-navigation";
 const previous=node("button"),next=node("button"),counter=node("span");
 previous.type=next.type="button";
 previous.dataset.rightsPrevious="";next.dataset.rightsNext="";
 counter.dataset.rightsCounter="";
 previous.setAttribute("aria-label",rightsText("previous"));
 next.setAttribute("aria-label",rightsText("next"));
 previous.append(rightsIcon("previous"));next.append(rightsIcon("next"));
 navigation.append(previous,counter,next);

 const choices={};
 for(const key of ["sources","trainers","licenses","notes"]){
  const pick=node("button");pick.type="button";pick.dataset.rightsCategory=key;
  const count=node("small");
  pick.append(rightsIcon(key),node("span",rightsText(key)),count);
  pick.addEventListener("click",()=>{
   selected=key;positions[key]=0;render();
  });
  categories.append(pick);choices[key]={pick,count};
 }
 root.append(frame,notice,body,navigation);
 const syncPaging=ui01BindPaging(root.parentNode,navigation,previous,next,counter,alive);

 function addRecord(key,element){
  element.dataset.rightsEntry=String(records[key].length);
  element.hidden=true;records[key].push(element);groups[key].append(element);
 }
 function addCard(key,entry){
  card(groups[key],entry);
  const element=groups[key].children[groups[key].children.length-1];
  element.dataset.rightsEntry=String(records[key].length);
  element.hidden=true;records[key].push(element);
 }
 function infoCard(title,text){
  const element=node("section");element.className="tp-rights-card";
  element.append(node("h3",title),node("p",text));return element;
 }
 function render(){
  if(!alive())return;
  root.dataset.rightsView=selected;
  for(const key of ["sources","trainers","licenses","notes"]){
   const active=key===selected;
   groups[key].hidden=!active;
   const total=records[key].length;
   positions[key]=Math.max(0,Math.min(positions[key],total-1));
   records[key].forEach((element,index)=>{element.hidden=!active||index!==positions[key];});
   choices[key].pick.setAttribute("aria-pressed",String(active));
   if(key!=="trainers"||root.dataset.rightsReady==="true"){
    choices[key].count.textContent=String(total);
   }
  }
  const total=records[selected].length;
  counter.textContent=total?(positions[selected]+1)+" / "+total:"0 / 0";
  previous.disabled=positions[selected]===0||total===0;
  next.disabled=positions[selected]>=total-1||total===0;
  content.setAttribute("aria-label",rightsText(selected));
  content.scrollTop=0;syncPaging();
 }
 previous.addEventListener("click",()=>{
  if(previous.disabled)return;positions[selected]--;render();
 });
 next.addEventListener("click",()=>{
  if(next.disabled)return;positions[selected]++;render();
 });

 for(const entry of window.TPRightsData.entries)addCard("sources",entry);
 if(!records.sources.length)addRecord("sources",infoCard(rightsText("sources"),rightsText("empty")));

 for(const item of window.TPRightsData.licenses){
  addRecord("licenses",rightsLicenseDocument(item));
 }
 if(!records.licenses.length)addRecord("licenses",infoCard(rightsText("licenses"),rightsText("empty")));

 addRecord("notes",infoCard(rightsText("docTitle"),rightsText("docNote")));
 addRecord("notes",infoCard(rightsText("trainerTitle"),rightsText("trainerNote")));
 addRecord("notes",infoCard(rightsText("offlineTitle"),rightsText("offlineNote")));

 addRecord("trainers",infoCard("Lokal dokumentierte Trainer-BINs",
  "Arenaleiter, Top Vier und Champs. Die folgenden Angaben stammen aus den lokal importierten Dateien. Sie sind nicht verifiziert und belegen keine Nutzungsfreigabe."));
 choices.trainers.count.textContent="…";
 render();

 let count=0;
 if(window.TPTrainerArt&&typeof loadSpriteAsset==="function"){
  for(const entry of TPTrainerArt.entries){
   if(!alive())return;
   const id=entry.leader;
   try{
    const raw=await loadSpriteAsset(entry.key);
    if(!alive())return;
    if(!raw)continue;
    const item=await TPTrainerArt.inspect(raw,id),m=item.metadata;
    if(!alive())return;
    count++;
    addCard("trainers",{
     name:id,author:m.author||"Urheber nicht dokumentiert",
     status:m.license?"Angegebene Lizenz/Erlaubnis (nicht verifiziert): "+m.license:
      "Lizenz/Erlaubnis nicht dokumentiert",
     note:m.changes?"Angegebene Aenderungen: "+m.changes:"Aenderungen nicht dokumentiert",
     source:m.source
    });
   }catch(e){
    if(!alive())return;
    addCard("trainers",{name:id,author:"Lokaler Datensatz",
     status:"Nicht pruefbar",note:e.message,source:""});
   }
  }
 }
 if(!count)addRecord("trainers",infoCard("Bestandshinweis",
  "Keine gueltigen Trainer-BIN-Angaben gefunden. Alte PNG-Portraets koennen dennoch vorhanden sein."));
 root.dataset.rightsReady="true";render();
}

window.TPRights=Object.freeze({mount});})();
