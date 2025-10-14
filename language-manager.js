class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.originalTexts = {}; // Store original texts when first encountered
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.storeOriginalTexts(); // Store original texts before any changes
        this.loadLanguageFromURL();
        this.loadTranslations();
        this.updateLanguageDisplay();
        this.updateAllLinks();
        this.applyTranslations();
    }

    storeOriginalTexts() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (!this.originalTexts[key]) {
                this.originalTexts[key] = element.textContent || element.innerHTML;
            }
        });
    }

    loadLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && langParam === 'nl') {
            this.currentLanguage = 'nl';
        } else {
            this.currentLanguage = 'en';
        }
    }

    updateURL() {
        const url = new URL(window.location);
        if (this.currentLanguage === 'nl') {
            url.searchParams.set('lang', 'nl');
        } else {
            url.searchParams.delete('lang');
        }
        window.history.replaceState({}, '', url);
    }

    loadTranslations() {
        // Only load Dutch translations - English stays as hardcoded HTML
        this.translations = {
            nl: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'Over Mij',
                'nav.projects': 'Projecten',

                // Projects in navigation and cards
                'project.webshop': 'Functionele Webshop',
                'project.dataorganizer': 'Data Organisator & Formatter Prototype',
                'project.foodstall': '3D Model Voedselkraam',

                // Hero sections (updated for new homepage text)
                'hero.title.home': 'Op zoek naar een Developer?',
                'hero.subtitle.home': 'Code, debug, deploy, repeat — Ik ben Skylar, een junior developer, en ik ben op mijn best als ik dingen laat werken!',
                'hero.subtitle2.home': 'Ik streef ernaar anderen te helpen hun dromen waar te maken en hun software werkelijkheid te laten worden.',
                // The line "I aspire to help others..." is not translatable as it has no data-translate
                'hero.subtitle.project1': 'Een uitgebreid e-commerce platform gebouwd met PHP, SQL en JS',
                'hero.subtitle.project2': 'Voor gemak, snelheid en duidelijkheid',
                'hero.subtitle.project3': 'Een gedetailleerd 3D-modelleerproject dat technische vaardigheden toont',

                // Buttons
                'btn.learn-more': 'Meer Over Mij ➔',
                'btn.view-project': 'Bekijk Project',
                'nav.back-to-projects': '← Terug naar Projecten',

                // Sections
                'section.featured-projects': 'Featured Projecten',

                // Status labels
                'status.school': 'Schoolproject',
                'status.workplace': 'Werkproject',
                'status.3d': '3D Modelleerproject',

                // Footer content (updated for new English text)
                'footer.title': 'Skylar V.',
                'footer.description': 'Junior Developer & Creatieve Probleemoplosser',
                'footer.heading': 'Navigatie',
                'footer.nav-label': 'Projecten',
                'footer.copyright': '© 2025 Skylar V. Alle rechten voorbehouden.',
                'footer.made-with': 'Gemaakt met 💜 en code',
                
                // About page (unchanged)
                'about.title': 'Over Mij',
                'about.subtitle': 'Developer • Student • Designer',
                'about.who-am-i': 'Wie ben ik?',
                'about.description1': 'Ik ben een gepassioneerde Developer met praktische ervaring in HTML, CSS, PHP en JS. Ik hou van het creëren van mooie en functionele websites, programma’s en online platforms. Mijn doel is om efficiënte code te schrijven die de gebruikerservaring verbetert.',
                'about.description2': 'Hoewel mijn voorkeur uitgaat naar programmeren, geeft mijn ervaring met design extra inzicht in het creatieproces, wat zorgt voor een vlottere samenwerking en communicatie. Ik gebruik mijn programmeerkennis regelmatig om dynamische en interactieve webapplicaties te bouwen.',
                'about.education': 'Opleiding',
                'about.university': 'Thomas More Hogeschool',
                'about.degree': 'Bachelor in Digital Experience Design',
                'about.year': '2023 - Heden',
                'about.CV': 'Bekijk mijn CV', 
                'about.degree-description': 'Een driejarig, praktijkgericht programma gericht op het ontwerpen en bouwen van echte digitale producten en meeslepende ervaringen. Studenten ontwikkelen praktische vaardigheden door projectgestuurd leren en presenteren hun werk aan professionele jury\'s voor feedback. Afgestudeerden krijgen ervaring in UX/UI-design, webontwikkeling en digitale strategie, waarbij ze oplossingen creëren die zowel maatschappelijk relevant als commercieel levensvatbaar zijn.',
                'about.get-in-touch': 'Neem Contact Op',
                'contact.email': 'E-mail',
                'contact.phone': 'Telefoon',
                'about.location': 'Locatie',
                'about.technical-skills': 'Technische Vaardigheden',
                'about.frontend': 'Front-end Development',
                'about.backend': 'Back-end Development',
                'about.tools': 'Tools & Technologieën',
                'about.work-examples': 'Voor enkele voorbeelden van mijn werk als Developer en Designer, bekijk',
                'about.past-projects': 'enkele van mijn eerdere projecten',
                'about.employers': 'Vorige Werkgevers Beschreven Mij Als',
                'skill.efficient': 'Efficiënt',
                'skill.professional': 'Professioneel',
                'skill.reliable': 'Betrouwbaar',
                'skill.helpful': 'Behulpzaam',
                'skill.quick-learner': 'Snelle Leerling',
                
                // 404 Error page
                'error.title': 'Pagina Niet Gevonden',
                'error.description': 'Oeps! De pagina die je zoekt bestaat niet. Het is mogelijk verplaatst, verwijderd, of je hebt de verkeerde URL ingevoerd.',
                'error.home': 'Ga naar Home',
                'error.back': 'Ga Terug',
                
                // Project 1 (Webshop) - ALL MISSING TRANSLATIONS
                'project1.overview': 'Project Overzicht',
                'project1.overview-text': 'Dit project werd gemaakt als de eindopdracht van de Back-end Development cursus die ik volgde. Het gebruikt voornamelijk PHP en MySQL voor alle functionaliteiten, evenals wat JavaScript (AJAX) voor dynamisch content laden. Dit project diende ook als eerste ervaring met server hosting via GitHub en Azure.',
                'project1.assignment': 'De Opdracht',
                'project1.assignment-text': 'De vereisten voor het project waren zeer specifiek vermeld in de opdrachtbeschrijving, evenals een stap-voor-stap overzicht van hoe het ontwikkelingsproces zou moeten verlopen. Hierdoor waren er weinig problemen tijdens de ontwikkeling en verliep de creatie van de website zonder problemen. Vanaf het begin werd duidelijk gemaakt dat de focus op functionaliteit moest liggen in plaats van esthetiek, omdat dat de focus van de cursus was, maar een minimum aan aantrekkelijkheid werd nog steeds verwacht.',
                'project1.process': 'Het Proces',
                'project1.process-text': 'Door de manier waarop de opdracht was opgezet, werden we gedwongen om ons te houden aan het schema dat onze leraar ons gaf in plaats van onze eigen voorkeuren. Dit betekende dat we elke stap in de gespecificeerde volgorde moesten voltooien, zonder af te wijken van het plan, en de voortgang die we hadden gemaakt wekelijks moesten tonen. De stappen waren als volgt verdeeld:',
                'project1.step1-title': 'Stap 1: Een Niche Kiezen',
                'project1.step1-text': 'Iedereen in onze klas moest een winkel maken, maar we moesten eerst aan de leraar laten weten wat voor soort producten we wilden verkopen. Twee personen konden niet dezelfde niche kiezen, dus we moesten unieke ideeën bedenken. Dit was om zowel plagiaat als directe concurrentie of vergelijking tussen degenen die exact dezelfde productlijst zouden hebben te voorkomen. Het kiezen van de niche kon op twee manieren: ofwel noemden we een merkproducttype dat we wilden verkopen, of we konden ervoor kiezen om een bestaande online winkel na te maken en dezelfde catalogus te bieden die zij deden.',
                'project1.step1-choice-prefix': 'Wat ik koos was om de catalogus te lenen van',
                'project1.step1-choice-suffix': ', die gespecialiseerd is in anime merchandise maar genoeg bestaande categorieën had om aan de minimumvereiste van 4 categorieën te voldoen voor de filterfuncties die later zouden worden opgenomen.',
                'project1.step2-title': 'Stap 2: Producten Kiezen',
                'project1.step2-text': 'Zoals eerder vermeld, moesten we producten kiezen die in ten minste 4 categorieën pasten. Elke categorie moest ten minste 10 producten bevatten, en elk product had een naam, prijs, beschrijving, afbeelding en een toegewezen categorie nodig. Al deze gegevens werden genomen van de eerder genoemde Ichiban website en in een SQL-database gezet.',
                'project1.step3-title': 'Stap 3: Een Database Creëren',
                'project1.step3-text': 'Na het maken van de tabel met alle producten, moest ik nog steeds de rest van de database in kaart brengen. Door vooruit te kijken in de opdracht, kon ik al zien dat ik extra tabellen nodig zou hebben voor gebruikers, bestellingen en reviews, evenals enkele verbindingen daartussen. Hoewel ik wel een oorspronkelijk plan maakte, moesten er nog enkele kleine wijzigingen worden gemaakt tijdens het project om de volledige gewenste functionaliteit te waarborgen.',
                'project1.step4-title': 'Stap 4: Functionaliteiten Bouwen',
                'project1.step4-text1': 'Met de databasestructuur op zijn plaats, kon ik beginnen met het implementeren van de kernfunctionaliteiten van de website. Dit omvatte gebruikersregistratie en inloggen, productbrowsing en het winkelwagensysteem, en admin-accounts met extra rechten werden ook gemaakt om de productlijsten te beheren. Ik gebruikte PHP voor de backend-logica en integreerde het met de SQL-database om alles werkend te krijgen.',
                'project1.step4-text2': 'Door de nadruk dat "uiterlijk er niet toe deed", besteedde ik niet veel tijd aan het overwegen van het visuele ontwerp van het eindresultaat. Hierdoor kon ik me volledig richten op ervoor zorgen dat alles werkte zoals bedoeld, zonder me zorgen te maken over CSS in de tijd die gegeven was om dit project af te maken. Helaas maakt dat ook dat het eindresultaat er nogal ondermaats uitziet, en als ik opnieuw zou beginnen zou ik toch meer tijd besteden aan het overwegen ervan, zodat ik volledig trots kan zijn op het eindresultaat.',
                'project1.step5-title': 'Stap 5: De Website Deployen',
                'project1.step5-text': 'Voor de deployment van de website werd Azure aan ons aanbevolen als hostingplatform. Het was gratis voor een beperkte tijd en onze leraar kon een tutorial geven over hoe het op te zetten voor ons project. Ondanks deze voordelen zou ik het niet opnieuw gebruiken, omdat het ongelooflijk contra-intuïtief was om te gebruiken en veel meer stappen en informatie vereiste in vergelijking met andere platforms die dezelfde gratis service boden. Deze portfoliowebsite, bijvoorbeeld, wordt gehost via een .tech domein, wat me ongeveer 15 minuten kostte om op te zetten vergeleken met de dag die ik besteedde aan het uitzoeken van Azure (inclusief deployment tijd, wat behoorlijk veel was).',
                'project1.final-result': 'Het Eindresultaat',
                'project1.final-result-text-prefix': 'De gehoste website is niet langer toegankelijk omdat het domein waarop het werd gehost is weggenomen nadat de opdracht was beoordeeld. Er is echter een videodemonstratie van de primaire functionaliteiten van de website hieronder beschikbaar, en hier is de',
                'project1.github-link': 'link naar de GitHub repository',
                'project1.final-result-text-suffix': 'die ook de broncode bevat.',
                
                // Project 2 (Data Organizer) - ALL MISSING TRANSLATIONS
                'project.overview': 'Projectoverzicht',
                'project2.intro1': 'Dit project was oorspronkelijk een opdracht die ik kreeg van het bedrijf GB Foods Puurs, maar door onvoorziene omstandigheden kon het nooit worden gelanceerd. De preview hieronder is een hercreatie van de oorspronkelijke opdracht met een volledig overzicht van het project, of je kunt',
                'project2.intro2': 'direct naar beneden scrollen',
                'project2.intro3': 'voor de demonstratie',
                'project2.intro4': 'Ik werd niet aangenomen als developer, maar als studentenassistent voor een van de vaste medewerkers. Nadat ik mijn opleiding had vermeld, vroeg hij me om het volgende project te maken tijdens de uren dat ik hem assisteerde.',
                'supervisor.contact': 'Contactpersoon',
                'project2.vision': 'De oorspronkelijke visie',
                'project2.vision1': 'De exportafdeling van het bedrijf ontvangt kwartaal- tot jaarlijkse rapporten van de verkopen van hun distributeurs. Elk van deze heeft zijn eigen manier om de informatie in een spreadsheet te noteren, waardoor het verkrijgen van een volledig overzicht van de totale verkopen onhandig was. Daarom zocht mijn supervisor naar een oplossing en vroeg uiteindelijk of ik een manier wist om dit proces te stroomlijnen.',
                'project2.vision2': 'Mijn voorgestelde oplossing was om een webpagina te maken met HTML, CSS< en JavaScript (JS) die deze Excel-bestanden (geëxporteerd als CSV-bestanden) zou nemen en automatisch zou toevoegen aan de grote overkoepelende database. Eenmaal daar konden de gegevens handig worden gesorteerd, gefilterd en doorzocht met dynamische JS en gestyled met CSS.',
                'project2.went-wrong': 'Wat ging er mis?',
                'project2.went-wrong-text': 'Door een onverwachte en onaangekondigde aanscherping van beveiligingsmaatregelen door het Spaanse hoofdkantoor ontstonden er verschillende problemen: De kernfunctionaliteit van het uploaden van bestanden naar deze website werd geblokkeerd op alle werkapparaten vanwege privacy- en gegevensbeveiliging, samen met de firewall die de server blokkeerde die ik gebruikte voor mijn ontwikkelproces. Hierdoor werd overeengekomen dat de ontwikkeling niet verder zou gaan, maar mijn supervisor had geen bezwaar tegen het opnemen van deze hercreatie in mijn portfolio met verwijzing naar hem.',
                'project2.development': 'Het ontwikkelproces',
                'project2.development-text1': 'Vanaf de eerste briefing was functionaliteit het belangrijkste aandachtspunt, met weinig tot geen aandacht voor esthetiek. Dit betekende dat ik geen pagina-ontwerp maakte voordat ik begon te programmeren, en ik koos ervoor om vast te houden aan de bedrijfskleuren en een zeer minimale styling met CSS. Door de manier waarop mijn dienstverband was geregeld, had ik beperkte tijd om aan het project te werken, dus besloot ik mijn uren zorgvuldig te verdelen en geen ontwerpfase te houden.',
                'project2.development-text2': 'Mijn opdrachtgever had de belangrijkste stappen al voor mij uitgestippeld omdat hij wist hoe krap het tijdsbestek was waarin ik werkte, en bood mij dus de kernfunctionaliteiten aan die hij graag in volgorde van belangrijkheid wilde zien. Hij vroeg me om prioriteit te geven aan de verwerking van gegevens van de grootste distributeur, een bestand met meer dan 22.000 regels. Hierdoor moest de code aanzienlijk worden geoptimaliseerd om de wachttijden redelijk te houden. Helaas, toen ik het punt had bereikt waarop na het uploaden van het bestand een doorzoekbare tabel werd gemaakt met HTML en JavaScript, vond de eerder genoemde beveiligingsupdate plaats en kon ik niet verder.',
                'project2.development-text3': 'Hoe ik uiteindelijk de code schreef: omdat elke dataset naar het bedrijf zou worden gestuurd via een Excel-bestand, onderzocht ik hoe ik deze kon verwerken en ontdekte dat ze konden worden geëxporteerd als een CSV-bestand. Deze zouden dan worden geüpload naar de pagina en verwerkt in het juiste formaat om aan de database te worden toegevoegd. Omdat hetzelfde bedrijf hun gegevens elke keer op dezelfde manier zou formatteren, voegde ik de eis toe om de gegevensbron te controleren voor upload zodat het correct verwerkt kon worden. Vanaf daar kon ik de verwerkte gegevens weergeven in een tabel met zoek- en filterfuncties, zoals gevraagd.',
                'project2.final-result': 'Het eindresultaat',
                'project2.final-result-text': 'Het oorspronkelijke project is verloren gegaan, omdat ik het niet naar mijn persoonlijke laptop kon sturen, maar omdat ik de code recent had geschreven en alle logica nog wist, kostte de heropbouw weinig tijd.',
                'project2.disclaimer': 'De code hieronder is geen 1-op-1 reconstructie van het oorspronkelijke project; het grootste verschil is dat ik binnen dit portfolio niet met een database werk. Alle invoeren worden lokaal opgeslagen en worden vergeten bij het herladen van de pagina.',
                'project2.test-data-text': 'Het bestand hieronder is een zip-bestand met drie verschillende bronnen van dummy verkoopgegevens in CSV-formaat die kunnen worden gebruikt om het prototype te testen. Als je dit bestand liever niet downloadt, is er ook een opname van mezelf die dit programma gebruikt.',
                'project2.download-data': 'Download voorbeeldgegevens voor testen',
                'project2.watch-video': 'Bekijk de video in plaats daarvan',
                
                // Project 3 (Food Stall) - ALL MISSING TRANSLATIONS
                'project3.overview': 'Projectoverzicht',
                'project3.overview-text1': 'Dit 3D-model was een schoolopdracht voor het vak 3D Design. De opdracht was om een voedselkraam te maken in Blender, met volledige vrijheid in het soort voedsel, de stylisatie en het detailniveau. Alleen een minimale complexiteit werd als referentiepunt gegeven, wat veel creatieve vrijheid en verkenning van 3D-modellering mogelijk maakte.',
                'project3.overview-text2': 'Gedurende het semester waren er verschillende check-ins en toevoegingen om onze eerste versie verder uit te breiden en onze beheersing van Blender en 3D-modellering te tonen, maar sommige daarvan zijn uit de preview hieronder weggelaten. Persoonlijk vond ik een paar van deze toevoegingen een esthetische achteruitgang of misplaatst, dus liet ik ze weg uit het eindresultaat zodat ik een model kon tonen waar ik trots op ben.',
                'project3.idea': 'Het idee en inspiratie',
                'project3.idea-text': 'Het kiezen van een voedselitem om mijn kraam rond te thematiseren was niet moeilijk; ik kwam direct uit op sushi en onigiri, beide traditionele Japanse rijstgerechten. Ik koos deze omdat ze eenvoudige maar toch onderscheidende vormen hebben die goed vertalen naar een 3D-model. Daarnaast maakte het kiezen van een visueel thema het makkelijk, omdat ik meer kon leunen op Oosterse esthetiek, die ik visueel aantrekkelijk vind.',
                'project3.carousel.kitsune': 'Een Kitsune, afgebeeld met rood, wit en goud zoals vaak in folklore',
                'project3.carousel.onigiri': 'Onigiri, een Japanse rijstbal vaak gewikkeld in zeewier',
                'project3.carousel.torii': 'Een Torii-poort, een herkenbaar stuk Japanse architectuur',
                'project3.carousel.sushi': 'Sushi, specifiek nigiri en uramaki, nog een herkenbaar gerecht',
                'project3.carousel.palette': 'Het rood, wit en gouden kleurenpalet dat ik koos voor mijn model',
                'project3.carousel.dango': 'Dango, een snack die ik achteraf toevoegde omdat de muur te kaal was',
                'project3.mascot-text': 'Als mascotte koos ik de Kitsune, een vossengeest uit de Japanse folklore die goed paste bij het thema van het project en de rood-wit-gouden kleuren die vaak met het land worden geassocieerd. Ik verwerkte ook een torii-poort in de menustandaard en gaf het hoofdgedeelte van de kraam een traditioneel dak om het geheel samen te brengen in het 3D-model.',
                'project3.final-result': 'Het eindresultaat',
                'project3.final-result-text': 'Hieronder vind je het eindresultaat van mijn 3D-voedselkraammodel gemaakt in Blender. Het bevat dynamische belichting en windanimaties. Dit project gaf me de kans om zowel technische als artistieke aspecten van 3D-modellering te verkennen en was een mooie afsluiting van het vak. Ik ben trots op het resultaat en de vaardigheden die ik tijdens het proces met Blender heb ontwikkeld.',
                'project3.download-text': 'Het model is beschikbaar voor download in .blend-formaat als je het zelf wilt verkennen in Blender.',
                'project3.download-btn': 'Download Blender-bestand',
                'project3.disclaimer': 'Dit model wordt alleen gedeeld voor demonstratiedoeleinden in mijn portfolio. Gebruik het niet voor commerciële projecten of verspreid het niet verder.',
                'project3.favorite-text': 'Mijn favoriete delen van het model zijn enkele details die ik achteraf toevoegde omdat het resultaat op dat moment wat tegenviel. Dit voedselkraammodel doorliep vele iteraties voordat ik er volledig tevreden mee was, en ik ben blij dat ik deze veranderingen heb doorgevoerd.',
                'project3.detail1-caption': 'De verschillende voedselsoorten die ik modelleerde, met de dango-zakken tegen de achterwand',
                'project3.detail2-caption': 'Het eetgedeelte, met 2 stoelen, borden en paren eetstokjes, en het menu tegen de muur',
                'project3.lighting-text': 'Het model is gepresenteerd in weinig licht omdat Kitsune ondeugende geesten zijn; ik wilde deze voedselkraam op een wat spookachtige manier tonen. De lantaarns zijn geanimeerd om te flikkeren om dit idee te ondersteunen. Het uitzoeken van de belichtingsdynamiek in Blender was misschien wel het moeilijkste deel van de opdracht.',
                'project3.blender-text': 'Blender is een programma dat ik prettig vind om te gebruiken, al verlies ik me soms in de details. De vele mogelijkheden en het creatieve karakter van 3D-modellering passen helemaal bij mij.'
            }
        };
    }

    switchLanguage(newLang) {
        if (newLang === this.currentLanguage) return;
        
        this.currentLanguage = newLang;
        this.updateURL();
        this.updateLanguageDisplay();
        this.updateAllLinks();
        this.applyTranslations();
    }

    updateLanguageDisplay() {
        const languageToggles = document.querySelectorAll('.dropdown-toggle');
        languageToggles.forEach(toggle => {
            if (toggle.parentElement.classList.contains('language-dropdown')) {
                toggle.textContent = this.currentLanguage.toUpperCase();
            }
        });
    }

    updateAllLinks() {
        const links = document.querySelectorAll('a[href]:not([href^="#"]):not([onclick])');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href.includes('http') && !href.includes('mailto:') && !href.includes('tel:')) {
                try {
                    // Handle relative URLs properly
                    let finalUrl;
                    
                    if (href.startsWith('/')) {
                        // Absolute path
                        finalUrl = href;
                    } else {
                        // Relative path - keep as is
                        finalUrl = href;
                    }
                    
                    if (this.currentLanguage === 'nl') {
                        // Add language parameter
                        if (finalUrl.includes('?')) {
                            // URL already has parameters
                            const [path, params] = finalUrl.split('?');
                            const urlParams = new URLSearchParams(params);
                            urlParams.set('lang', 'nl');
                            finalUrl = `${path}?${urlParams.toString()}`;
                        } else {
                            // No existing parameters
                            finalUrl = `${finalUrl}?lang=nl`;
                        }
                    } else {
                        // Remove language parameter for English
                        if (finalUrl.includes('?lang=nl')) {
                            finalUrl = finalUrl.replace(/[?&]lang=nl/, '');
                            // Clean up URL if it starts with & after removing lang
                            finalUrl = finalUrl.replace('?&', '?');
                            // Remove trailing ? if no parameters left
                            if (finalUrl.endsWith('?')) {
                                finalUrl = finalUrl.slice(0, -1);
                            }
                        }
                    }
                    
                    link.href = finalUrl;
                } catch (error) {
                    console.warn('Error updating link:', href, error);
                }
            }
        });
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            
            if (this.currentLanguage === 'nl') {
                const translation = this.getTranslation(key);
                if (translation) {
                    element.textContent = translation;
                }
            } else {
                // Restore original English text
                if (this.originalTexts[key]) {
                    element.textContent = this.originalTexts[key];
                }
            }
        });
    }

    getTranslation(key) {
        if (this.currentLanguage === 'nl' && this.translations.nl && this.translations.nl[key]) {
            return this.translations.nl[key];
        }
        return null;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

window.languageManager = new LanguageManager();

function switchLanguage(lang) {
    window.languageManager.switchLanguage(lang);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}