/**
 * Language Manager - Handles multilingual functionality
 * Supports URL-based language switching with persistent state
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en'; // Default language
        this.translations = {};
        
        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Load language from URL parameter or localStorage
        this.loadLanguageFromURL();
        this.loadTranslations();
        this.updateLanguageDisplay();
        this.updateAllLinks();
        this.applyTranslations();
    }

    loadLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && ['en', 'nl'].includes(langParam)) {
            this.currentLanguage = langParam;
            localStorage.setItem('preferredLanguage', langParam);
        } else {
            // Fallback to localStorage or default
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && ['en', 'nl'].includes(savedLang)) {
                this.currentLanguage = savedLang;
                this.updateURL();
            }
        }
    }

    updateURL() {
        const url = new URL(window.location);
        url.searchParams.set('lang', this.currentLanguage);
        window.history.replaceState({}, '', url);
    }

    loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'About Me',
                'nav.projects': 'Projects',
                
                // Project titles
                'project.webshop': 'Functional Webshop',
                'project.dataorganizer': 'Data Organizer & Formatter Prototype',
                'project.foodstall': '3D Model Food Stall',
                
                // Hero sections
                'hero.title.home': 'Hello, I\'m Skylar',
                'hero.subtitle.home': 'Full-Stack Developer & Creative Problem Solver',
                'hero.subtitle.about': 'Passionate about creating innovative digital solutions',
                'hero.subtitle.project1': 'A comprehensive e-commerce platform with modern design',
                'hero.subtitle.project2': 'For convenience, speed and clarity',
                'hero.subtitle.project3': 'A detailed 3D modeling project showcasing technical skills',
                
                // About page
                'about.title': 'About Me',
                'about.subtitle': 'Developer • Student • Designer',
                'about.who-am-i': 'Who Am I?',
                'about.description1': 'I\'m a passionate web designer and developer with a love for creating beautiful and functional websites, programs or other online platforms. I find joy in putting together efficient code that improves user experience.',
                'about.description2': 'While my preference lies with coding, my experience with design allows for additional insight in the creation process for an overall smoother conversation and cooperation experience.',
                
                // Project content
                'project.overview': 'Project Overview',
                'supervisor.contact': 'Supervisor Contact',
                'contact.email': 'Email',
                'contact.phone': 'Phone',
                
                // Project descriptions
                'project.webshop.description': 'A school project showcasing features required for an online store platform, such as account functionality as well as product creation, filtering and management.',
                'project.dataorganizer.description': 'A prototype designed to streamline the processing of sales data from multiple distributors, transforming diverging spreadsheets into organized, searchable tables.',
                'project.foodstall.description': 'A model created in Blender showcasing a food stall inspired by Japanese culture and cuisine originally created for a school project that showcases detailed modeling and dynamic lighting.',
                
                // Project statuses
                'status.school': 'School Project',
                'status.workplace': 'Workplace Project',
                'status.3d': '3D Modeling Project',
                
                // Buttons
                'btn.learn-more': 'Learn More About Me ➔',
                'btn.view-project': 'View Project',
                
                // Section titles
                'section.featured-projects': 'Featured Projects',
                
                // Project 2 specific content
                'project2.intro1': 'This project was originally a task I received from the company GB Foods Puurs that due to unforeseen circumstances was never able to launch. The preview below is a recreation of the original task with a full rundown of the project, or you can',
                'project2.intro2': 'jump straight ahead',
                'project2.intro3': 'to the demonstration',
                'project2.intro4': 'I was not hired as a developer, but rather as a student assistant to one of the long-term employees. After disclosing my education, he then asked for me to make the following project during the hours I was listed to assist him.',
                'project2.vision': 'The Original Vision',
                'project2.vision1': 'The export department of the company receives quarterly to yearly reports of the sales of their distributors. Each of these has their own style of noting down the information in a spreadsheet and thus getting a complete overview of the total sales made was inconvenient. For this reason, my supervisor was looking into a solution and eventually asked me if I knew of a way to streamline this process.',
                'project2.vision2': 'My proposed solution was to create a webpage with PHP and SQL that would take these Excel files (exported as CSV files) and automatically add them to the grand overarching database. Once there, the data could be sorted, filtered and searched conveniently.',
                
                // About page additional content
                'about.education': 'Education',
                'about.university': 'Thomas More University of Applied Sciences',
                'about.degree': 'Bachelor in Digital Experience Design',
                'about.year': '2023 - Present',
                'about.degree-description': 'A three-year, hands-on program focused on designing and building real digital products and immersive experiences. Students develop practical skills through project-based learning, presenting their work to professional juries for feedback. Graduates gain experience in UX/UI design, web development, and digital strategy, creating solutions that are both socially relevant and commercially viable.',
                'about.get-in-touch': 'Get In Touch',
                'about.location': 'Location',
                'about.technical-skills': 'Technical Skills',
                'about.frontend': 'Front-end Development',
                'about.backend': 'Back-end Development',
                'about.tools': 'Tools & Technologies',
                'about.work-examples': 'For some examples of my work, check out',
                'about.past-projects': 'some of my past projects',
                'about.languages': 'Languages',
                'about.dutch': 'Dutch',
                'about.english': 'English',
                'about.french': 'French',
                'about.level.native': 'Native',
                'about.level.fluent': 'Fluent',
                'about.level.intermediate': 'Intermediate',
                'about.employers': 'Previous Employers Described Me As',
                
                // Skill tags for employers section
                'skill.efficient': 'Efficient',
                'skill.clever': 'Clever',
                'skill.insightful': 'Insightful',
                'skill.professional': 'Professional',
                'skill.reliable': 'Reliable',
                'skill.creative': 'Creative',
                'skill.detail-oriented': 'Detail-oriented',
                'skill.helpful': 'Helpful',
                'skill.adaptable': 'Adaptable',
                'skill.problem-solver': 'Problem-solver',
                'skill.dedicated': 'Dedicated',
                'skill.quick-learner': 'Quick learner',
                
                'nav.back-to-projects': '← Back to Projects',
                
                // Project 2 specific content
                'project2.went-wrong': 'What went wrong?',
                'project2.went-wrong-text': 'Due to an unforeseen and unannounced strengthening of security measures pushed by the Spanish branch of the company (being the head of all departments globally), several issues arose: The key functionality of uploading files into this website was blocked on all work devices due to privacy and sensitive data concerns, along with the firewall blocking the server I was running for my development process. Because of these factors, it was agreed that the development would no longer continue, but my supervisor had no objections to me including this recreation in my portfolio website with reference to him.',
                'project2.development': 'The Development Process',
                'project2.development-text1': 'From the initial briefing, functionality had been indicated as the core concern regarding the project, with little to no cares regarding the aesthetics. This meant that I did not draft any page design before I jumped into the programming phase, deciding to stick to the company colours and a very minimal styling. Because of the way my employment was handled, I had limited time to work on the project, so I decided to distribute all my hours carefully, thus deciding not to have a design phase.',
                'project2.development-text2': 'My client had already outlined certain steps for me to take since he did know how tight of a time window I was working with, and so offered me the core functionalities he would like to see in the order of importance. He asked me to prioritize the handling of data sourced from the biggest distributor first, a file that consisted of over 22 000 lines. Because of this, the code had to be significantly optimized for wait times to be reasonable. Unfortunately, once I had gotten to the point where after the uploading the file a searchable table was created, the aforementioned security update happened and I could no longer continue.',
                'project2.development-text3': 'How I ended up writing the code is as follows: Since every dataset would be sent to the company through an Excel file, I looked into how to process those and found they could be exported as a CSV (Comma Seperated Values) file. These would then be uploaded into the page and processed into the correct format to be added to the database. Through the reasoning that the same company would format their data the same way every time, I added the requirement to check the data source before upload so it could be processed correctly. From there on out I could display the processed data in a table that had search and filtering functions, as requested.',
                'project2.final-result': 'The Final Result',
                'project2.final-result-text': 'The original project was lost, as I could not send it over to my personal laptop, but since I had recently written the code and still recalled all the logic behind it, the reconstruction took rather little time.',
                'project2.disclaimer': 'The code below is not a 1 to 1 reconstruction of the original project, the most prominent difference being that within this portfolio I do not work with a database. All entries are stored locally and will be forgotten upon page reload.',
                'project2.test-data-text': 'The file below is a zip file with 3 different sources of dummy sales data in CSV format that can be used to test the prototype. If you would prefer not to download this file, there is also a recording of myself using this program.',
                'project2.download-data': 'Download Sample Data For Testing',
                'project2.watch-video': 'Watch The Video Instead',
                
                // Project 1 specific content
                'project1.overview': 'Project Overview',
                'project1.overview-text': 'This project was made as the final assignment of the Back-end Development course I followed. It utilises mainly PHP and MySQL for all the functionalities, as well as some JavaScript (AJAX) for dynamic content loading. This project also serves as a first experience with server hosting through GitHub and Azure.',
                'project1.assignment': 'The Assignment',
                'project1.assignment-text': 'The requirements for the project were very specifically listed in the assignment description, as well as a step-by-step outline of how the development process should progress. Because of this, there were rather little issues to run into throughout development and the creation of the website went on without a hitch. From the beginning it was made clear that the focus should be on functionality rather than aesthetics since that was the focus of the course, but a bare minimum of appeal was still expected.',
                'project1.process': 'The Process',
                'project1.process-text': 'Because of how the assignment was set up, we were forced to abide by the schedule our teacher gave us instead of our own preferences. This meant that we had to complete each step in the order specified, without deviating from the plan, and showing the progress we had made on a weekly basis. The steps were divided as follows:',
                'project1.step1': 'Step 1: Setting up the server and database',
                'project1.step2': 'Step 2: Making a basic register and login system',
                'project1.step3': 'Step 3: Making the website shell and base functionalities',
                'project1.step4': 'Step 4: Adding CRUD functionalities',
                'project1.step5': 'Step 5: Finalising the project with some bonus features',
                'project1.challenges': 'Challenges & Solutions',
                'project1.challenges-text': 'As mentioned earlier, there werent that many issues that popped up during development, but the ones that did pop up generally fell under two categories:',
                'project1.problem1': '1. Issues with the server and hosting',
                'project1.problem1-text': 'Initially, we were tasked with using our school server to host our projects, but there were some issues with the access to this server for outside connections. Because of this, we had to quickly pivot to a different solution. Since we were already working with GitHub to maintain version control over our projects, we decided to use GitHub Pages to host our frontend, and Azure to host our backend logic.',
                'project1.problem2': '2. Lack of CSS and design knowledge',
                'project1.problem2-text': 'Since this was a back-end focused project, most of us didnt have a lot of CSS knowledge at this point yet, so we decided to use Bootstrap to make our lives easier when it came to creating a basic responsive layout. This did mean that a lot of the projects made during this assignment look very similar, but since aesthetics were not the main focus, this wasnt really a big issue.',
                'project1.outcome': 'Outcome',
                'project1.outcome-text': 'By the end of the project, I had a fully functional recipe website that incorporated all the requirements that were asked in the assignment, as well as some extra features that I had added myself. The website allowed users to register and login, as well as add, edit, and delete their own recipes. Users could also view all recipes that were published by other users, and search through them using various filters.',
                'project1.step1-title': 'Step 1: Choosing a Niche',
                'project1.step1-text': 'Everyone in our class was supposed to make a store, but we first had to let the teacher know what type of products we wanted to sell. Two people could not choose the same niche, so we had to come up with unique ideas. This was to prevent both plagiarism and direct competition or comparison between those who would have the exact same product list. Choosing the niche could go one of two ways: either we named a branded product type we wanted to sell, or we could choose to remake an existing online store and provide the same catalogue they did.',
                'project1.step1-choice-prefix': 'What I chose was to borrow the catalogue of',
                'project1.step1-choice-suffix': ', which specializes in anime merchandise but had enough existing categories to meet the minimum requirement of 4 categories for the filter functions that would be incorporated later on.',
                'project1.step2-title': 'Step 2: Picking Products',
                'project1.step2-text': 'As previously mentioned, we had to pick products that fit at least 4 categories. Each category had to contain at least 10 products, and each product needed a name, price, description, image, and a category assigned to it. All of this data was taken from the aforementioned Ichiban website and put into an SQL database.',
                'project1.step3-title': 'Step 3: Creating a Database',
                'project1.step3-text': 'After creating the table with all the products, I still had to map out the rest of the database. By looking ahead in the assignment, I could already see that I would need additional tables for users, orders and reviews, as well as some connections between them. While I did make an original plan, as the project evolved further, some minor changes still had to be made along the way to ensure the full desired functionality.',
                'project1.step4-title': 'Step 4: Building Functionalities',
                'project1.step4-text1': 'With the database structure in place, I could start implementing the core functionalities of the website. This included user registration and login, product browsing, and the shopping cart system, and admin accounts with extra permissions were also created to manage the product listings. I utilized PHP for the backend logic and integrated it with the SQL database to get it all working.',
                'project1.step4-text2': 'Due to the insistence that that "looks did not matter", I did not spend much time considering the visual design of the final result. Because of this, I could focus entirely on making sure everything worked as intended, without having to worry about CSS in the time given to finish this project. Unfortunately that also makes the final result look quite underwhelming, and if I were to start over I would spend more time considering it after all, so I can be completely proud of the final result.',
                'project1.step5-title': 'Step 5: Deploying the Website',
                'project1.step5-text': 'For the deployment of the website, Azure was recommended to us as the hosting platform. It was free for a limited time and our teacher could provide a tutorial on how to set it up for our project. Despite these benefits, I would not use it again, as it was incredibly counterintuitive to use and required a lot more steps and information compared to other platforms that provided the same free service. This portfolio website, for example, is hosted through a .tech domain, which took me roughly 15 minutes to set up compared to the day I spent figuring out Azure (including deployment time, which was quite a lot).',
                'project1.final-result': 'The Final Result',
                'project1.final-result-text-prefix': 'The hosted website is no longer accessible because the domain it was hosted on has been taken down after the assignment was graded. However, a video demonstration of the website\'s primary functionalities is available below, and here is the',
                'project1.github-link': 'link to the GitHub repository',
                'project1.final-result-text-suffix': 'containing the source code as well.',
                
                // Project 3 specific content
                'project3.overview': 'Project Overview',
                'project3.overview-text1': 'This 3D model was a school assignment for the course 3D Design. The assignment was to make any kind of food vendor stall in Blender, with free range in terms of what type of food, what stylisation and how detailed we wanted to make the project. Only a baseline complexity was given as a point of reference, allowing for a lot of creative freedom.',
                'project3.overview-text2': 'Throughout the semester, there were several check-ins and additions to add onto our first iteration to further showcase our mastery of the program, but some of those have been removed from the preview found below. Personally, I found a few of these additions to be an aesthetic downgrade or out of place, hence why I left them out of this final result so I could showcase a model I am proud of.',
                'project3.idea': 'The Idea And Inspirations',
                'project3.idea-text': 'Choosing a food item to theme my stall around was not a difficult task, as I immediately landed on sushi and onigiri, both traditional Japanese rice dishes. I chose these because they have rather simple but still distinct shapes that I felt would translate well to a 3D model. Aside from that, it made choosing a visual theme quite easy as I could lean more into Eastern aesthetics, which I find visually appealing.',
                'project3.mascot-text': 'As a mascot of sorts, I chose the Kitsune, a fox spirit from Japanese folklore that leant themselves to the theme of the project as well as the red, white and gold colours often associated with the country. I also incorporated a torii gate into the menu stand, along with giving the main body of the stand a more traditional roof style to bring it all together.',
                'project3.final-result': 'The Final Result',
                'project3.final-result-text': 'Below is the final result of my 3D food stall model. It includes dynamic lighting as well as wind animations. Overall, this project allowed me to explore both technical and artistic aspects of 3D modeling and was a proper conclusion to the course. I am proud of the final result and the skills I developed throughout the process.',
                'project3.download-text': 'The model is available for download in .blend format if you would like to explore it further in Blender yourself.',
                'project3.download-btn': 'Download Blender File',
                'project3.disclaimer': 'This model is shared for portfolio demonstration purposes only. Please do not use it for commercial projects or otherwise redistribute it.',
                'project3.favorite-text': 'My favourite parts of model are some of the details I added retroactively because the result I had at the time seemed to be lackluster. This food stall model went through many iterations before I was fully satisfied with it, and I am glad I kept making these changes.',
                'project3.detail1-caption': 'The different food types I modeled, with the dango bags against the back wall',
                'project3.detail2-caption': 'The dining area, with 2 chairs, plates and pairs of chopsticks, as well as the menu against the wall',
                'project3.lighting-text': 'The model\'s presented in low lighting since Kitsune are mischievous spirits, so I wanted to present this food stall in a somewhat haunted way. The lanterns are also animated to flicker to support this idea. Figuring out the lighting dynamics might have been the hardest part of the whole assignment.',
                'project3.blender-text': 'Blender is a program I find quite pleasant to use, though I do tend to get a bit lost in the details. The many possibilities and the creative nature of the work is specifically up my alley.',
                
                // Project 3 carousel captions
                'project3.carousel.kitsune': 'A Kitsune, portrayed with red, white and gold as they often are in folklore',
                'project3.carousel.onigiri': 'Onigiri, a Japanese rice ball often wrapped in seaweed',
                'project3.carousel.torii': 'A Torii gate, a recognisable piece of Japanese architecture',
                'project3.carousel.sushi': 'Sushi, specifically nigiri and uramaki, another recogniseable food',
                'project3.carousel.palette': 'The red, white, and gold color palette I settled on for my model',
                'project3.carousel.dango': 'Dango, a snack I retroactively decided to add since the wall felt too plain',
            },
            nl: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'Over Mij',
                'nav.projects': 'Projecten',
                
                // Project titles
                'project.webshop': 'Functionele Webshop',
                'project.dataorganizer': 'Data Organisator & Formatter Prototype',
                'project.foodstall': '3D Model Voedselkraam',
                
                // Hero sections
                'hero.title.home': 'Hallo, Skylar hier',
                'hero.subtitle.home': 'Full-Stack Developer & Creatieve Probleemoplosser',
                'hero.subtitle.about': 'Gepassioneerd over het creëren van innovatieve digitale oplossingen',
                'hero.subtitle.project1': 'Een uitgebreid e-commerce platform met modern design',
                'hero.subtitle.project2': 'Voor gemak, snelheid en duidelijkheid',
                'hero.subtitle.project3': 'Een gedetailleerd 3D-modelleringsproject dat technische vaardigheden toont',
                
                // About page
                'about.title': 'Over Mij',
                'about.subtitle': 'Developer • Student • Designer',
                'about.who-am-i': 'Wie Ben Ik?',
                'about.description1': 'Ik ben een gepassioneerde webdesigner en developer met een liefde voor het creëren van mooie en functionele websites, programma\'s of andere online platforms. Ik vind vreugde in het samenstellen van efficiënte code die de gebruikerservaring verbetert.',
                'about.description2': 'Hoewel mijn voorkeur ligt bij coderen, zorgt mijn ervaring met design voor extra inzicht in het creatieproces voor een over het algemeen soepelere conversatie en samenwerkingservaring.',
                
                // Project content
                'project.overview': 'Project Overzicht',
                'supervisor.contact': 'Supervisor Contact',
                'contact.email': 'E-mail',
                'contact.phone': 'Telefoon',
                
                // Project descriptions
                'project.webshop.description': 'Een schoolproject dat de benodigde functies voor een online winkelplatform toont, zoals accountfunctionaliteit evenals productcreatie, filtering en beheer.',
                'project.dataorganizer.description': 'Een prototype ontworpen om de verwerking van verkoopgegevens van meerdere distributeurs te stroomlijnen, waarbij verschillende spreadsheets worden omgezet in georganiseerde, filterbare tabellen.',
                'project.foodstall.description': 'Een model oorspronkelijk gemaakt voor een schoolproject in Blender dat een voedselkraam toont geïnspireerd door de Japanse cultuur en keuken, dat gedetailleerde modellering en dynamische verlichting toont.',
                
                // Project statuses
                'status.school': 'Schoolproject',
                'status.workplace': 'Werkproject',
                'status.3d': '3D Modelleringsproject',
                
                // Buttons
                'btn.learn-more': 'Meer Over Mij ➔',
                'btn.view-project': 'Bekijk Project',
                
                // Section titles
                'section.featured-projects': 'Featured Projecten',
                
                // Project 2 specific content
                'project2.intro1': 'Dit project was oorspronkelijk een taak die ik kreeg van het bedrijf GB Foods Puurs die door onvoorziene omstandigheden nooit heeft kunnen lanceren. De preview hieronder is een recreatie van de oorspronkelijke taak met een volledige uitleg van het project, of je kan ook ',
                'project2.intro2': 'direct vooruit springen',
                'project2.intro3': 'naar de demonstratie',
                'project2.intro4': 'Ik werd niet aangenomen als developer, maar eerder als studentassistent van een van de langetermijnmedewerkers. Na het mededelen van mijn opleiding, vroeg hij me toen om het volgende project te maken tijdens de uren dat ik vermeld stond om hem te assisteren.',
                'project2.vision': 'De Oorspronkelijke Visie',
                'project2.vision1': 'De exportafdeling van het bedrijf ontvangt driemaandelijkse tot jaarlijkse rapporten van de verkopen van hun distributeurs. Elk van deze heeft hun eigen stijl om de informatie in een spreadsheet te noteren en dus was het krijgen van een volledig overzicht van de totale gemaakte verkopen onhandig. Om deze reden zocht mijn supervisor naar een oplossing en vroeg uiteindelijk aan mij of ik een manier wist om dit proces te stroomlijnen.',
                'project2.vision2': 'Mijn voorgestelde oplossing was om een webpagina te maken met PHP en SQL die deze Excel-bestanden (geëxporteerd als CSV-bestanden) zou nemen en automatisch toevoegen aan de grote overkoepelende database. Eenmaal daar, konden de gegevens handig worden gesorteerd, gefilterd en doorzocht.',
                
                // About page additional content
                'about.education': 'Onderwijs',
                'about.university': 'Thomas More Hogeschool',
                'about.degree': 'Bachelor in Digital Experience Design',
                'about.year': '2023 - Heden',
                'about.degree-description': 'Een driejarig, praktijkgericht programma gericht op het ontwerpen en bouwen van echte digitale producten en meeslepende ervaringen. Studenten ontwikkelen praktische vaardigheden door projectgestuurd leren, waarbij ze hun werk presenteren aan professionele jury\'s voor feedback. Afgestudeerden krijgen ervaring in UX/UI-design, webdevelopment en digitale strategie, waarbij ze oplossingen creëren die zowel maatschappelijk relevant als commercieel levensvatbaar zijn.',
                'about.get-in-touch': 'Neem Contact Op',
                'about.location': 'Locatie',
                'about.technical-skills': 'Technische Vaardigheden',
                'about.frontend': 'Front-end Development',
                'about.backend': 'Back-end Development',
                'about.tools': 'Tools & Technologieën',
                'about.work-examples': 'Voor enkele voorbeelden van mijn werk, bekijk',
                'about.past-projects': 'enkele van mijn vorige projecten',
                'about.languages': 'Talen',
                'about.dutch': 'Nederlands',
                'about.english': 'Engels',
                'about.french': 'Frans',
                'about.level.native': 'Moedertaal',
                'about.level.fluent': 'Vloeiend',
                'about.level.intermediate': 'Gemiddeld',
                'about.employers': 'Vorige Werkgevers Beschreven Mij Als',
                
                // Skill tags for employers section
                'skill.efficient': 'Efficiënt',
                'skill.clever': 'Slim',
                'skill.insightful': 'Inzichtelijk',
                'skill.professional': 'Professioneel',
                'skill.reliable': 'Betrouwbaar',
                'skill.creative': 'Creatief',
                'skill.detail-oriented': 'Detailgericht',
                'skill.helpful': 'Behulpzaam',
                'skill.adaptable': 'Aanpasbaar',
                'skill.problem-solver': 'Probleemoplosser',
                'skill.dedicated': 'Toegewijd',
                'skill.quick-learner': 'Snelle leerling',
                
                'nav.back-to-projects': '← Terug naar Projecten',
                
                // Project 2 specific content
                'project2.went-wrong': 'Wat ging er mis?',
                'project2.went-wrong-text': 'Door een onvoorziene en onaangekondigde versterking van beveiligingsmaatregelen door de Spaanse branch van het bedrijf (zijnde het hoofd van alle afdelingen wereldwijd), ontstonden verschillende problemen: De kernfunctionaliteit van het uploaden van bestanden naar deze website werd geblokkeerd op alle werkapparaten vanwege privacy- en gevoelige gegevensproblemen, samen met de firewall die de server blokkeerde die ik gebruikte voor mijn developmentproces. Vanwege deze factoren werd overeengekomen dat de development niet langer zou doorgaan, maar mijn supervisor had geen bezwaar tegen het opnemen van deze recreatie in mijn portfoliowebsite met verwijzing naar hem.',
                'project2.development': 'Het Developmentproces',
                'project2.development-text1': 'Vanaf de eerste briefing was functionaliteit aangegeven als de kernzorg betreffende het project, met weinig tot geen aandacht voor de esthetiek. Dit betekende dat ik geen paginaontwerp opstelde voordat ik in de programmeerfase sprong, en besloot om me te houden aan de bedrijfskleuren en een zeer minimale styling. Vanwege de manier waarop mijn werkgelegenheid werd geregeld, had ik beperkte tijd om aan het project te werken, dus besloot ik al mijn uren zorgvuldig te verdelen, en dus besloot ik geen ontwerpfase te hebben.',
                'project2.development-text2': 'Mijn klant had al bepaalde stappen voor me geschetst omdat hij wist hoe krap mijn tijdsvenster was, en bood me dus de kernfunctionaliteiten aan die hij wilde zien in volgorde van belangrijkheid. Hij vroeg me om de verwerking van gegevens van de grootste distributeur prioriteit te geven, een bestand dat bestond uit meer dan 22.000 regels. Hierdoor moest de code aanzienlijk geoptimaliseerd worden om wachttijden redelijk te houden. Helaas, toen ik het punt had bereikt waar na het uploaden van het bestand een doorzoekbare tabel werd gemaakt, gebeurde de eerder genoemde beveiligingsupdate en kon ik niet langer doorgaan.',
                'project2.development-text3': 'Hoe ik uiteindelijk de code schreef is als volgt: Omdat elke dataset naar het bedrijf zou worden verzonden via een Excel-bestand, onderzocht ik hoe deze te verwerken en ontdekte dat ze konden worden geëxporteerd als een CSV (Comma Separated Values) bestand. Deze zouden dan worden geüpload naar de pagina en verwerkt in het juiste formaat om aan de database toe te voegen. Door de redenering dat hetzelfde bedrijf hun gegevens elke keer op dezelfde manier zou formatteren, voegde ik de vereiste toe om de gegevensbron te controleren voor upload zodat het correct kon worden verwerkt. Van daaruit kon ik de verwerkte gegevens weergeven in een tabel met zoek- en filterfuncties, zoals gevraagd.',
                'project2.final-result': 'Het Eindresultaat',
                'project2.final-result-text': 'Het oorspronkelijke project ging verloren, omdat ik het niet naar mijn persoonlijke laptop kon sturen, maar omdat ik de code recent had geschreven en nog alle logica erachter herinnerde, kostte de reconstructie relatief weinig tijd.',
                'project2.disclaimer': 'De code hieronder is geen 1 op 1 reconstructie van het oorspronkelijke project, het meest prominente verschil is dat ik binnen dit portfolio niet met een database werk. Alle invoeren worden lokaal opgeslagen en zullen vergeten worden bij het herladen van de pagina.',
                'project2.test-data-text': 'Het bestand hieronder is een zip-bestand met 3 verschillende bronnen van dummy verkoopgegevens in CSV-formaat die gebruikt kunnen worden om het prototype te testen. Als je liever dit bestand niet downloadt, is er ook een opname van mezelf die dit programma gebruikt.',
                'project2.download-data': 'Download Voorbeeldgegevens Voor Testen',
                'project2.watch-video': 'Bekijk De Video In Plaats Daarvan',
                
                // Project 1 specific content
                'project1.overview': 'Project Overzicht',
                'project1.overview-text': 'Dit project werd gemaakt als eindopdracht voor de Back-end Development cursus die ik volgde. Het gebruikt voornamelijk PHP en MySQL voor alle functionaliteiten, evenals wat JavaScript (AJAX) voor dynamische content loading. Dit project dient ook als eerste ervaring met server hosting via GitHub en Azure.',
                'project1.assignment': 'De Opdracht',
                'project1.assignment-text': 'De vereisten voor het project waren zeer specifiek opgesomd in de opdrachtbeschrijving, evenals een stap-voor-stap overzicht van hoe het developmentproces zou moeten verlopen. Hierdoor waren er relatief weinig problemen tijdens de development en verliep het maken van de website vlot. Vanaf het begin was duidelijk dat de focus op functionaliteit moest liggen in plaats van esthetiek omdat dat de focus van de cursus was, maar een minimum aan aantrekkelijkheid werd nog steeds verwacht.',
                'project1.process': 'Het Proces',
                'project1.process-text': 'Door de manier waarop de opdracht was opgezet, waren we gedwongen om het schema van onze leraar te volgen in plaats van onze eigen voorkeuren. Dit betekende dat we elke stap in de gespecificeerde volgorde moesten voltooien, zonder af te wijken van het plan, en wekelijks de voortgang moesten tonen die we hadden gemaakt. De stappen waren als volgt verdeeld:',
                'project1.step1': 'Stap 1: De server en database opzetten',
                'project1.step2': 'Stap 2: Een basis registratie- en inlogsysteem maken',
                'project1.step3': 'Stap 3: De website-shell en basisfunctionaliteiten maken',
                'project1.step4': 'Stap 4: CRUD-functionaliteiten toevoegen',
                'project1.step5': 'Stap 5: Het project afronden met extra functies',
                'project1.challenges': 'Uitdagingen & Oplossingen',
                'project1.challenges-text': 'Zoals eerder vermeld waren er niet zo veel problemen die opdoken tijdens de development, maar degene die wel opdoken vielen over het algemeen onder twee categorieën:',
                'project1.problem1': '1. Problemen met de server en hosting',
                'project1.problem1-text': 'Aanvankelijk moesten we onze schoolserver gebruiken om onze projecten te hosten, maar er waren problemen met de toegang tot deze server voor externe verbindingen. Hierdoor moesten we snel naar een andere oplossing overstappen. Omdat we al met GitHub werkten om versiebeheer over onze projecten te onderhouden, besloten we GitHub Pages te gebruiken voor onze frontend en Azure voor onze backend-logica.',
                'project1.problem2': '2. Gebrek aan CSS- en designkennis',
                'project1.problem2-text': 'Omdat dit een backend-gericht project was, hadden de meesten van ons op dat moment nog niet veel CSS-kennis, dus besloten we Bootstrap te gebruiken om ons leven gemakkelijker te maken bij het creëren van een basis responsieve layout. Dit betekende wel dat veel van de projecten die tijdens deze opdracht werden gemaakt er erg op elkaar leken, maar omdat esthetiek niet de hoofdfocus was, was dit niet echt een groot probleem.',
                'project1.outcome': 'Resultaat',
                'project1.outcome-text': 'Aan het einde van het project had ik een volledig functionele receptenwebsite die alle vereisten bevatte die in de opdracht werden gevraagd, evenals enkele extra functies die ik zelf had toegevoegd. De website stelde gebruikers in staat om te registreren en in te loggen, evenals hun eigen recepten toe te voegen, te bewerken en te verwijderen. Gebruikers konden ook alle recepten bekijken die door andere gebruikers waren gepubliceerd en door ze zoeken met verschillende filters.',
                'project1.step1-title': 'Stap 1: Een Niche Kiezen',
                'project1.step1-text': 'Iedereen in onze klas moest een winkel maken, maar we moesten eerst aan de leraar laten weten wat voor soort producten we wilden verkopen. Twee mensen konden niet dezelfde niche kiezen, dus moesten we unieke ideeën bedenken. Dit was om zowel plagiaat als directe concurrentie of vergelijking tussen degenen die exact dezelfde productlijst zouden hebben te voorkomen. Het kiezen van de niche kon op twee manieren: ofwel noemden we een merkproducttype dat we wilden verkopen, of we konden ervoor kiezen om een bestaande online winkel na te maken en dezelfde catalogus aan te bieden die zij deden.',
                'project1.step1-choice-prefix': 'Wat ik koos was om de catalogus van',
                'project1.step1-choice-suffix': ' te lenen, die gespecialiseerd is in anime merchandise maar genoeg bestaande categorieën had om te voldoen aan de minimumvereiste van 4 categorieën voor de filterfuncties die later zouden worden opgenomen.',
                'project1.step2-title': 'Stap 2: Producten Kiezen',
                'project1.step2-text': 'Zoals eerder vermeld, moesten we producten kiezen die in ten minste 4 categorieën pasten. Elke categorie moest ten minste 10 producten bevatten, en elk product had een naam, prijs, beschrijving, afbeelding en een toegewezen categorie nodig. Al deze gegevens werden van de eerder genoemde Ichiban-website gehaald en in een SQL-database gezet.',
                'project1.step3-title': 'Stap 3: Een Database Maken',
                'project1.step3-text': 'Na het maken van de tabel met alle producten, moest ik nog de rest van de database in kaart brengen. Door vooruit te kijken in de opdracht, kon ik al zien dat ik extra tabellen nodig zou hebben voor gebruikers, bestellingen en reviews, evenals enkele verbindingen tussen hen. Hoewel ik wel een oorspronkelijk plan maakte, moesten er nog enkele kleine wijzigingen worden aangebracht naarmate het project verder evolueerde om de volledige gewenste functionaliteit te garanderen.',
                'project1.step4-title': 'Stap 4: Functionaliteiten Bouwen',
                'project1.step4-text1': 'Met de databasestructuur op zijn plaats, kon ik beginnen met het implementeren van de kernfunctionaliteiten van de website. Dit omvatte gebruikersregistratie en inloggen, productbrowsing en het winkelwagensysteem, en er werden ook adminaccounts met extra machtigingen gemaakt om de productlijsten te beheren. Ik gebruikte PHP voor de backend-logica en integreerde het met de SQL-database om alles te laten werken.',
                'project1.step4-text2': 'Door het aandringen dat "uiterlijk er niet toe deed", besteedde ik niet veel tijd aan het overwegen van het visuele ontwerp van het eindresultaat. Hierdoor kon ik me volledig concentreren op ervoor zorgen dat alles werkte zoals bedoeld, zonder me zorgen te hoeven maken over CSS in de gegeven tijd om dit project af te maken. Helaas maakt dat het eindresultaat er ook vrij vlak uitzien, en als ik opnieuw zou beginnen zou ik toch meer tijd besteden aan het overwegen ervan, zodat ik volledig trots kan zijn op het eindresultaat.',
                'project1.step5-title': 'Stap 5: De Website Deployen',
                'project1.step5-text': 'Voor de deployment van de website werd Azure aan ons aanbevolen als hostingplatform. Het was gratis voor een beperkte tijd en onze leraar kon een tutorial geven over hoe het op te zetten voor ons project. Ondanks deze voordelen zou ik het niet opnieuw gebruiken, omdat het ongelooflijk contra-intuïtief was om te gebruiken en veel meer stappen en informatie vereiste vergeleken met andere platforms die dezelfde gratis service aanboden. Deze portfoliowebsite bijvoorbeeld wordt gehost via een .tech domein, wat me ongeveer 15 minuten kostte om op te zetten vergeleken met de dag die ik besteedde aan het uitzoeken van Azure (inclusief deployment-tijd, wat behoorlijk veel was).',
                'project1.final-result': 'Het Eindresultaat',
                'project1.final-result-text-prefix': 'De gehoste website is niet langer toegankelijk omdat het domein waarop het werd gehost is afgesloten nadat de opdracht werd beoordeeld. Er is echter een videodemonstratie van de primaire functionaliteiten van de website beschikbaar hieronder, en hier is de',
                'project1.github-link': 'link naar de GitHub repository',
                'project1.final-result-text-suffix': 'die de broncode bevat.',
                
                // Project 3 specific content
                'project3.overview': 'Project Overzicht',
                'project3.overview-text1': 'Dit 3D-model was een schoolopdracht voor de cursus 3D Design. De opdracht was om een willekeurig soort voedselverkoper stalletje te maken in Blender, met vrije keuze wat betreft het type voedsel, welke stilering en hoe gedetailleerd we het project wilden maken. Alleen een basiscomplexiteit werd gegeven als referentiepunt, wat veel creatieve vrijheid toestond.',
                'project3.overview-text2': 'Gedurende het semester waren er verschillende check-ins en toevoegingen om aan onze eerste iteratie toe te voegen om onze beheersing van het programma verder te laten zien, maar sommige daarvan zijn weggelaten uit de preview hieronder. Persoonlijk vond ik enkele van deze toevoegingen een esthetische achteruitgang of misplaatst, daarom heb ik ze weggelaten uit dit eindresultaat zodat ik een model kon tonen waar ik trots op ben.',
                'project3.idea': 'Het Idee En Inspiraties',
                'project3.idea-text': 'Het kiezen van een voedselitem om mijn stalletje rond te thematiseren was geen moeilijke taak, omdat ik onmiddellijk uitkwam op sushi en onigiri, beide traditionele Japanse rijstgerechten. Ik koos deze omdat ze vrij eenvoudige maar toch onderscheidende vormen hebben waarvan ik vond dat ze goed zouden vertalen naar een 3D-model. Daarnaast maakte het het kiezen van een visueel thema vrij eenvoudig omdat ik meer kon leunen naar oosterse esthetiek, die ik visueel aantrekkelijk vind.',
                'project3.mascot-text': 'Als een soort mascotte koos ik de Kitsune, een vossengeest uit de Japanse folklore die zich leende voor het thema van het project evenals de rode, witte en gouden kleuren die vaak geassocieerd worden met het land. Ik heb ook een torii-poort opgenomen in de menustandaard, samen met het geven van het hoofdlichaam van de standaard een meer traditionele dakstijl om alles samen te brengen.',
                'project3.final-result': 'Het Eindresultaat',
                'project3.final-result-text': 'Hieronder is het eindresultaat van mijn 3D voedsel stalletje model. Het bevat dynamische verlichting evenals windanimaties. Over het algemeen stelde dit project me in staat om zowel technische als artistieke aspecten van 3D-modellering te verkennen en was het een goede conclusie van de cursus. Ik ben trots op het eindresultaat en de vaardigheden die ik tijdens het proces heb ontwikkeld.',
                'project3.download-text': 'Het model is beschikbaar voor download in .blend formaat als je het verder wilt verkennen in Blender zelf.',
                'project3.download-btn': 'Download Blender Bestand',
                'project3.disclaimer': 'Dit model wordt alleen gedeeld voor portfolio demonstratiedoeleinden. Gebruik het alsjeblieft niet voor commerciële projecten of distribueer het anderszins.',
                'project3.favorite-text': 'Mijn favoriete onderdelen van het model zijn enkele van de details die ik achteraf heb toegevoegd omdat het resultaat dat ik op dat moment had tegenviel. Dit voedsel stalletje model ging door vele iteraties voordat ik er volledig tevreden mee was, en ik ben blij dat ik deze veranderingen bleef aanbrengen.',
                'project3.detail1-caption': 'De verschillende voedselatypes die ik modelleerde, met de dango-zakjes tegen de achtermuur',
                'project3.detail2-caption': 'Het eetgedeelte, met 2 stoelen, borden en paren eetstokjes, evenals het menu tegen de muur',
                'project3.lighting-text': 'Het model wordt gepresenteerd in weinig licht omdat Kitsune ondeugende geesten zijn, dus wilde ik dit voedsel stalletje op een enigszins spookachtige manier presenteren. De lantaarns zijn ook geanimeerd om te flikkeren om dit idee te ondersteunen. Het uitzoeken van de verlichtingsdynamiek was misschien wel het moeilijkste deel van de hele opdracht.',
                'project3.blender-text': 'Blender is een programma dat ik heel prettig vind om te gebruiken, hoewel ik wel de neiging heb om een beetje verdwaald te raken in de details. De vele mogelijkheden en de creatieve aard van het werk liggen mijn specifiek goed.',
                
                // Project 3 carousel captions
                'project3.carousel.kitsune': 'Een Kitsune, afgebeeld met rood, wit en goud zoals ze vaak zijn in folklore',
                'project3.carousel.onigiri': 'Onigiri, een Japanse rijstbal vaak gewikkeld in zeewier',
                'project3.carousel.torii': 'Een Torii-poort, een herkenbaar stuk Japanse architectuur',
                'project3.carousel.sushi': 'Sushi, specifiek nigiri en uramaki, nog een herkenbaar voedsel',
                'project3.carousel.palette': 'Het rood, wit en gouden kleurenpalet dat ik voor mijn model koos',
                'project3.carousel.dango': 'Dango, een snack die ik achteraf besloot toe te voegen omdat de muur te kaal aanvoelde',
            }
        };
    }

    switchLanguage(newLang) {
        if (!['en', 'nl'].includes(newLang)) return;
        
        this.currentLanguage = newLang;
        localStorage.setItem('preferredLanguage', newLang);
        
        // Update URL and reload to apply changes
        const url = new URL(window.location);
        url.searchParams.set('lang', newLang);
        window.location.href = url.toString();
    }

    updateLanguageDisplay() {
        // Update the dropdown toggle text
        const dropdownToggles = document.querySelectorAll('.language-dropdown .dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.textContent = this.currentLanguage.toUpperCase();
        });

        // Update active state in dropdown
        const languageLinks = document.querySelectorAll('.language-dropdown .dropdown-content a');
        languageLinks.forEach(link => {
            const lang = link.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
            if (lang === this.currentLanguage) {
                link.style.fontWeight = 'bold';
                link.style.color = '#a5b4fc';
            } else {
                link.style.fontWeight = 'normal';
                link.style.color = '';
            }
        });
    }

    updateAllLinks() {
        // Update all navigation links to preserve language parameter
        const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript:"]):not([onclick*="switchLanguage"])');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http')) {
                // Parse the current href
                let newHref = href;
                
                // Remove existing lang parameter if present
                if (newHref.includes('?')) {
                    const [path, queryString] = newHref.split('?');
                    const params = new URLSearchParams(queryString);
                    params.delete('lang');
                    params.set('lang', this.currentLanguage);
                    newHref = path + '?' + params.toString();
                } else {
                    newHref = href + '?lang=' + this.currentLanguage;
                }
                
                link.setAttribute('href', newHref);
            }
        });
    }

    applyTranslations() {
        // Apply translations to elements with data-translate attributes
        const translatableElements = document.querySelectorAll('[data-translate]');
        
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    // Helper method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Global language manager instance
window.languageManager = new LanguageManager();

// Global function for onclick handlers (backward compatibility)
function switchLanguage(lang) {
    window.languageManager.switchLanguage(lang);
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
