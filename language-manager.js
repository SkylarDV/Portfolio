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
                
                // Hero sections
                'hero.title.home': 'Hallo, ik ben Skylar',
                'hero.subtitle.home': 'Junior Developer & Creatieve Probleemoplosser',
                'hero.subtitle.project1': 'Een uitgebreide e-commerce platform met modern design',
                'hero.subtitle.project2': 'Voor gemak, snelheid en duidelijkheid',
                'hero.subtitle.project3': 'Een gedetailleerd 3D modelleerproject dat technische vaardigheden toont',
                
                // Buttons
                'btn.learn-more': 'Meer Over Mij ➔',
                'btn.view-project': 'Bekijk Project',
                'nav.back-to-projects': '← Terug naar Projecten',
                
                // Sections
                'section.featured-projects': 'Uitgelichte Projecten',
                
                // Status labels
                'status.school': 'Schoolproject',
                'status.workplace': 'Werkproject',
                'status.3d': '3D Modelleerproject',
                
                // Footer content - ALL MISSING FOOTER TRANSLATIONS
                'footer.title': 'Skylar V.',
                'footer.description': 'Junior Developer & Creatieve Probleemoplosser',
                'footer.heading': 'Navigatie',
                'footer.nav-label': 'Projecten',
                'footer.copyright': '© 2025 Skylar V. Alle rechten voorbehouden.',
                'footer.made-with': 'Gemaakt met 💜 en code',
                
                // About page - ALL MISSING ABOUT TRANSLATIONS
                'about.title': 'Over Mij',
                'about.subtitle': 'Developer • Student • Designer',
                'about.who-am-i': 'Wie Ben Ik?',
                'about.description1': 'Ik ben een gepassioneerde webdesigner en developer met een liefde voor het creëren van mooie en functionele websites, programma\'s of andere online platforms. Ik vind vreugde in het samenstellen van efficiënte code die de gebruikerservaring verbetert.',
                'about.description2': 'Hoewel mijn voorkeur ligt bij programmeren, stelt mijn ervaring met design mij in staat om extra inzicht te bieden in het creatieproces voor een over het algemeen vlottere conversatie- en samenwerkingservaring.',
                'about.education': 'Onderwijs',
                'about.university': 'Thomas More Hogeschool',
                'about.degree': 'Bachelor in Digital Experience Design',
                'about.year': '2023 - Heden',
                'about.degree-description': 'Een driejarig, praktijkgericht programma gericht op het ontwerpen en bouwen van echte digitale producten en meeslepende ervaringen. Studenten ontwikkelen praktische vaardigheden door projectgestuurd leren en presenteren hun werk aan professionele jury\'s voor feedback. Afgestudeerden krijgen ervaring in UX/UI-design, webontwikkeling en digitale strategie, waarbij ze oplossingen creëren die zowel maatschappelijk relevant als commercieel levensvatbaar zijn.',
                'about.get-in-touch': 'Neem Contact Op',
                'contact.email': 'E-mail',
                'contact.phone': 'Telefoon',
                'about.location': 'Locatie',
                'about.technical-skills': 'Technische Vaardigheden',
                'about.frontend': 'Front-end Ontwikkeling',
                'about.backend': 'Back-end Ontwikkeling',
                'about.tools': 'Tools & Technologieën',
                'about.work-examples': 'Voor enkele voorbeelden van mijn werk, bekijk',
                'about.past-projects': 'enkele van mijn eerdere projecten',
                'about.employers': 'Vorige Werkgevers Beschreven Mij Als',
                'skill.efficient': 'Efficiënt',
                'skill.professional': 'Professioneel',
                'skill.reliable': 'Betrouwbaar',
                'skill.helpful': 'Behulpzaam',
                'skill.quick-learner': 'Snelle leerling',
                
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
                'project.overview': 'Project Overzicht',
                'project2.intro1': 'Dit project was oorspronkelijk een taak die ik kreeg van het bedrijf GB Foods Puurs die door onvoorziene omstandigheden nooit kon worden gelanceerd. De preview hieronder is een recreatie van de oorspronkelijke taak met een volledig overzicht van het project, of je kunt',
                'project2.intro2': 'direct vooruitspringen',
                'project2.intro3': 'naar de demonstratie',
                'project2.intro4': 'Ik werd niet ingehuurd als developer, maar eerder als studentenassistent voor een van de langetermijnmedewerkers. Na het bekendmaken van mijn opleiding, vroeg hij me toen om het volgende project te maken tijdens de uren dat ik was ingepland om hem te assisteren.',
                'supervisor.contact': 'Supervisor Contact',
                'project2.vision': 'De Oorspronkelijke Visie',
                'project2.vision1': 'De exportafdeling van het bedrijf ontvangt kwartaal- tot jaarlijkse rapporten van de verkopen van hun distributeurs. Elk van deze heeft zijn eigen stijl om de informatie in een spreadsheet te noteren en dus was het krijgen van een volledig overzicht van de totale gemaakte verkopen onhandig. Om deze reden was mijn supervisor op zoek naar een oplossing en vroeg uiteindelijk of ik een manier wist om dit proces te stroomlijnen.',
                'project2.vision2': 'Mijn voorgestelde oplossing was om een webpagina te maken met PHP en SQL die deze Excel-bestanden (geëxporteerd als CSV-bestanden) zou nemen en automatisch zou toevoegen aan de grote overkoepelende database. Eenmaal daar, konden de gegevens handig worden gesorteerd, gefilterd en doorzocht.',
                'project2.went-wrong': 'Wat ging er mis?',
                'project2.went-wrong-text': 'Door een onvoorziene en onaangekondigde versterking van beveiligingsmaatregelen gepusht door de Spaanse tak van het bedrijf (zijnde het hoofd van alle afdelingen wereldwijd), ontstonden er verschillende problemen: De kernfunctionaliteit van het uploaden van bestanden naar deze website werd geblokkeerd op alle werkapparaten vanwege privacy- en gevoelige gegevensconcerns, samen met de firewall die de server blokkeerde die ik gebruikte voor mijn ontwikkelingsproces. Vanwege deze factoren werd overeengekomen dat de ontwikkeling niet langer zou doorgaan, maar mijn supervisor had geen bezwaar tegen het opnemen van deze recreatie in mijn portfoliowebsite met verwijzing naar hem.',
                'project2.development': 'Het Ontwikkelingsproces',
                'project2.development-text1': 'Vanaf de initiële briefing was functionaliteit aangegeven als de kernzorg betreffende het project, met weinig tot geen zorgen betreffende de esthetiek. Dit betekende dat ik geen pagina-ontwerp schetste voordat ik in de programmeerfase sprong, besluitend om vast te houden aan de bedrijfskleuren en een zeer minimale styling. Vanwege de manier waarop mijn werkgelegenheid werd afgehandeld, had ik beperkte tijd om aan het project te werken, dus besloot ik al mijn uren zorgvuldig te verdelen, dus besloot ik geen ontwerpfase te hebben.',
                'project2.development-text2': 'Mijn klant had al bepaalde stappen voor mij geschetst omdat hij wist hoe krap het tijdvenster was waarin ik werkte, en bood mij dus de kernfunctionaliteiten aan die hij graag zou zien in volgorde van belang. Hij vroeg me om prioriteit te geven aan de verwerking van gegevens afkomstig van de grootste distributeur eerst, een bestand dat bestond uit meer dan 22.000 regels. Hierdoor moest de code aanzienlijk worden geoptimaliseerd om wachttijden redelijk te houden. Helaas, toen ik het punt had bereikt waar na het uploaden van het bestand een doorzoekbare tabel werd gemaakt, gebeurde de eerder genoemde beveiligingsupdate en kon ik niet langer doorgaan.',
                'project2.development-text3': 'Hoe ik uiteindelijk de code schreef is als volgt: Omdat elke dataset naar het bedrijf zou worden gestuurd via een Excel-bestand, keek ik naar hoe deze te verwerken en vond dat ze konden worden geëxporteerd als een CSV (Comma Separated Values) bestand. Deze zouden dan worden geüpload naar de pagina en verwerkt in het juiste formaat om aan de database te worden toegevoegd. Door de redenering dat hetzelfde bedrijf hun gegevens elke keer op dezelfde manier zou formatteren, voegde ik de vereiste toe om de gegevensbron te controleren voor upload zodat het correct kon worden verwerkt. Vanaf daar kon ik de verwerkte gegevens weergeven in een tabel die zoek- en filterfuncties had, zoals gevraagd.',
                'project2.final-result': 'Het Eindresultaat',
                'project2.final-result-text': 'Het oorspronkelijke project was verloren, omdat ik het niet naar mijn persoonlijke laptop kon sturen, maar omdat ik recent de code had geschreven en nog steeds alle logica erachter herinnerde, kostte de reconstructie vrij weinig tijd.',
                'project2.disclaimer': 'De code hieronder is geen 1 op 1 reconstructie van het oorspronkelijke project, het meest prominente verschil is dat ik binnen dit portfolio niet werk met een database. Alle invoeren worden lokaal opgeslagen en worden vergeten bij het herladen van de pagina.',
                'project2.test-data-text': 'Het bestand hieronder is een zip-bestand met 3 verschillende bronnen van dummy verkoopgegevens in CSV-formaat die kunnen worden gebruikt om het prototype te testen. Als je dit bestand liever niet downloadt, is er ook een opname van mezelf die dit programma gebruikt.',
                'project2.download-data': 'Download Voorbeeldgegevens Voor Testen',
                'project2.watch-video': 'Bekijk De Video In Plaats Daarvan',
                
                // Project 3 (Food Stall) - ALL MISSING TRANSLATIONS
                'project3.overview': 'Project Overzicht',
                'project3.overview-text1': 'Dit 3D-model was een schoolopdracht voor de cursus 3D Design. De opdracht was om een voedselverkoopkraam te maken in Blender, met vrije keuze wat betreft het type voedsel, welke stylisatie en hoe gedetailleerd we het project wilden maken. Alleen een basiscomplexiteit werd gegeven als referentiepunt, wat veel creatieve vrijheid toeliet.',
                'project3.overview-text2': 'Gedurende het semester waren er verschillende check-ins en toevoegingen om toe te voegen aan onze eerste iteratie om onze beheersing van het programma verder te tonen, maar sommige daarvan zijn weggelaten uit de preview hieronder. Persoonlijk vond ik een paar van deze toevoegingen een esthetische downgrade of misplaatst, daarom liet ik ze weg uit dit eindresultaat zodat ik een model kon tonen waar ik trots op ben.',
                'project3.idea': 'Het Idee En Inspiraties',
                'project3.idea-text': 'Het kiezen van een voedselitem om mijn kraam rond te thematiseren was geen moeilijke taak, omdat ik onmiddellijk uitkwam op sushi en onigiri, beide traditionele Japanse rijstgerechten. Ik koos deze omdat ze vrij eenvoudige maar toch onderscheidende vormen hebben waarvan ik vond dat ze goed zouden vertalen naar een 3D-model. Daarnaast maakte het het kiezen van een visueel thema vrij gemakkelijk omdat ik meer kon leunen naar Oosterse esthetiek, die ik visueel aantrekkelijk vind.',
                'project3.carousel.kitsune': 'Een Kitsune, afgebeeld met rood, wit en goud zoals ze vaak zijn in folklore',
                'project3.carousel.onigiri': 'Onigiri, een Japanse rijstbal vaak gewikkeld in zeewier',
                'project3.carousel.torii': 'Een Torii-poort, een herkenbaar stuk Japanse architectuur',
                'project3.carousel.sushi': 'Sushi, specifiek nigiri en uramaki, nog een herkenbaar voedsel',
                'project3.carousel.palette': 'Het rood, wit en gouden kleurenpallet waarop ik besloot voor mijn model',
                'project3.carousel.dango': 'Dango, een snack die ik achteraf besloot toe te voegen omdat de muur te kaal voelde',
                'project3.mascot-text': 'Als een soort mascotte koos ik de Kitsune, een vossengeest uit de Japanse folklore die zich leende voor het thema van het project evenals de rode, witte en gouden kleuren die vaak geassocieerd worden met het land. Ik incorporeerde ook een torii-poort in de menustandaard, samen met het geven van het hoofdlichaam van de standaard een meer traditionele dakstijl om het allemaal samen te brengen.',
                'project3.final-result': 'Het Eindresultaat',
                'project3.final-result-text': 'Hieronder is het eindresultaat van mijn 3D voedselkraammodel. Het bevat dynamische belichting evenals windanimaties. Over het algemeen stelde dit project me in staat om zowel technische als artistieke aspecten van 3D-modellering te verkennen en was het een goede afsluiting van de cursus. Ik ben trots op het eindresultaat en de vaardigheden die ik tijdens het proces heb ontwikkeld.',
                'project3.download-text': 'Het model is beschikbaar voor download in .blend formaat als je het verder wilt verkennen in Blender zelf.',
                'project3.download-btn': 'Download Blender Bestand',
                'project3.disclaimer': 'Dit model wordt gedeeld alleen voor portfolio demonstratie doeleinden. Gebruik het alsjeblieft niet voor commerciële projecten of distribueer het anderszins.',
                'project3.favorite-text': 'Mijn favoriete delen van het model zijn enkele van de details die ik achteraf toevoegde omdat het resultaat dat ik op dat moment had ondermaats leek te zijn. Dit voedselkraammodel doorliep vele iteraties voordat ik er volledig tevreden mee was, en ik ben blij dat ik deze veranderingen bleef maken.',
                'project3.detail1-caption': 'De verschillende voedseltypen die ik modelleerde, met de dango-zakken tegen de achtermuur',
                'project3.detail2-caption': 'Het eetgedeelte, met 2 stoelen, borden en paren eetstokjes, evenals het menu tegen de muur',
                'project3.lighting-text': 'Het model wordt gepresenteerd in weinig licht omdat Kitsune ondeugende geesten zijn, dus ik wilde deze voedselkraam op een enigszins spookachtige manier presenteren. De lantaarns zijn ook geanimeerd om te flikkeren om dit idee te ondersteunen. Het uitzoeken van de verlichtingsdynamiek was misschien wel het moeilijkste deel van de hele opdracht.',
                'project3.blender-text': 'Blender is een programma dat ik vrij prettig vind om te gebruiken, hoewel ik wel de neiging heb om een beetje verloren te raken in de details. De vele mogelijkheden en de creatieve aard van het werk ligt specifiek in mijn straatje.'
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