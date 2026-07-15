import vinoRosso from "../images/vini/vino-rosso.png";
import montepulcianoCvetic from "../images/vini/montepulciano-d-abruzzo-marina-cvetic.jpg";
import amaroneClassico from "../images/vini/amarone-della-valpolicella-classico.png";
import vinoBianco from "../images/vini/vino-bianco.png";
import vinoRosato from "../images/vini/vino-rosato.png";
import spumantiImg from "../images/vini/spumanti.png";
import champagneImg from "../images/vini/champagne.png";
import liquorosiImg from "../images/vini/liquorosi.png";
import birrai32Img from "../images/birre/32viadeibirrai.png";
import laButtiga from "../images/birre/laButtiga.png";
import baladin from "../images/birre/baladin.png";
import brasserie from "../images/birre/brasserieMontBlanc.png";
import theBrave from "../images/birre/theBrave.png";
import farnese from "../images/birre/farnese.png";
import grappa from "../images/distillati/Grappa.png";
import whisky from "../images/distillati/whisky.png";
import rhum from "../images/distillati/Rhum.png";
import liquori from "../images/distillati/Liquori.png";
import cognac from "../images/distillati/Cognac.png";
import calvados from "../images/distillati/Calvados.png";

export const WHATSAPP_NUMBER = "393342306019";

// paesi esteri: nella barra filtri stanno tutti dietro il bottone
// "Mondo", che apre i paesi nella stessa barra
export const REGION_GROUPS = {
  Francia: "mondo",
  Austria: "mondo",
  Portogallo: "mondo",
  Spagna: "mondo",
  Ungheria: "mondo",
  Canada: "mondo",
};



export const SECTIONS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "enoteca", label: "Enoteca", icon: "🍷" },
  { id: "alimentari", label: "Alimentari", icon: "🥖" },
  { id: "confezioni", label: "Confezioni Regalo", short: "Regali", icon: "🎁" },
  { id: "dove siamo", label: "Dove Siamo", icon: "📍"},
];


export const VINI_ROSSI = [
  // Abruzzo
  { name: "Montepulciano d'Abruzzo Marina Cvetic Masciarelli", regione: "Abruzzo", colore: "Rosso", anno: "2012", img: montepulcianoCvetic, description: "Vino rosso strutturato, affinato in legno, con note di frutta scura matura, spezie e tannini morbidi ma decisi — ottimo con carni rosse e piatti abruzzesi robusti." },
  { name: "Montepulciano d'Abruzzo Villa Gemma Masciarelli", regione: "Abruzzo", colore: "Rosso", anno: "2012", description: "Vino rosso elegante, con profumi di frutti rossi e note floreali, tannini setosi e finale persistente — ideale con arrosti e formaggi stagionati." },
  // Alto Adige
  { name: "Blauburgunder Mazzon Gottardi", regione: "Alto Adige", description: "Pinot Nero dalla storica collina di Mazzon: ciliegia, sottobosco e sorso fine e teso — elegante con salumi e piatti di funghi." },
  { name: "Blauburgunder Falkenstein", regione: "Alto Adige", description: "Pinot Nero in stile altoatesino, fragrante di piccoli frutti rossi, con freschezza alpina e tannino delicato — versatile a tutto pasto." },
  { name: "Lago di Caldaro San Michele Appiano", regione: "Alto Adige", description: "Rosso leggero e beverino da uva Schiava: fragolina, mandorla e sorso morbido — perfetto servito fresco con taglieri e cucina di montagna." },
  { name: "Lagrein Cantina Termeno", regione: "Alto Adige", description: "Rosso scuro e vellutato, con frutti neri, viola e una nota di cacao — abbinamento naturale con carni alla griglia e speck." },
  { name: "Lagrein Carlotto", regione: "Alto Adige", description: "Lagrein intenso dal frutto croccante, morbido al palato con finale leggermente ammandorlato — ottimo con arrosti e formaggi di malga." },
  { name: "Lagrein San Michele Appiano", regione: "Alto Adige", description: "Interpretazione elegante del Lagrein: mora, prugna e cacao su tannini fitti ma gentili — da carni rosse e cucina tirolese." },
  { name: "Merlot Sanct Valentin San Michele Appiano", regione: "Alto Adige", description: "Merlot della linea Sanct Valentin: ricco, avvolgente, con frutto maturo e legno dolce — al meglio con brasati e formaggi stagionati." },
  { name: "Pinot Nero Cantina Termeno", regione: "Alto Adige", description: "Pinot Nero fragrante e succoso, tra ciliegia e spezie dolci, dal sorso agile — compagno ideale di primi saporiti e carni bianche." },
  { name: "Pinot Nero Carlotto", regione: "Alto Adige", description: "Pinot Nero artigianale dal profilo fine: piccoli frutti rossi, freschezza e beva scorrevole — ottimo anche leggermente fresco." },
  { name: "Pinot Nero San Michele Appiano", regione: "Alto Adige", description: "Un classico dell'Alto Adige: ciliegia, lampone e note terrose, con eleganza e freschezza — versatile dalla pasta al pollame." },
  { name: "Pinot Nero Hofstatter", regione: "Alto Adige", description: "Firma storica del Pinot Nero altoatesino: profumato, setoso, di grande equilibrio — perfetto con carni bianche e funghi porcini." },
  { name: "Pinot Nero Nals Margreid", regione: "Alto Adige", description: "Pinot Nero di montagna, fragrante e minerale, con tannino sottile — da provare con piatti autunnali e salmerino affumicato." },
  { name: "Pinot Nero Abbazia di Novacella", regione: "Alto Adige", description: "Dai vigneti più a nord d'Italia, un Pinot Nero fresco e speziato dalla beva slanciata — ideale con canederli e salumi." },
  { name: "Pinot Nero Maso Cantaghel", regione: "Alto Adige", description: "Pinot Nero di piccolo maso: frutto rosso croccante, note di sottobosco e sorso fine — per chi cerca autenticità di montagna." },
  { name: "Pinot nero Krafuss Lageder", regione: "Alto Adige", description: "Cru di Pinot Nero coltivato in biodinamica: elegante, profondo, con frutto puro e spezie — da carni delicate e piatti ai funghi." },
  { name: "Pinot Nero Riserva Hofstatter", regione: "Alto Adige", description: "Riserva di grande stoffa: frutto maturo, spezie e legno ben dosato, tannino di seta — da stappare con arrosti importanti." },
  { name: "Pinot Nero Riserva San Michele Appiano", regione: "Alto Adige", description: "Affinamento paziente per un Pinot Nero profondo ed elegante, tra amarena, spezie e sottobosco — per le occasioni che contano." },
  { name: "Pinot Nero Sanct Valentin San Michele Appiano", regione: "Alto Adige", description: "Il vertice del Pinot Nero di San Michele Appiano: complesso, setoso, di lunga persistenza — grande vino da selvaggina e meditazione." },
  { name: "Pinot nero Vigna Sant'Urbano Hofstatter", regione: "Alto Adige", description: "Leggendario cru di Mazzon: profondità quasi borgognona, frutto nobile e spezie fini — uno dei grandi Pinot Nero italiani." },
  { name: "Santa Maddalena San Michele Appiano", regione: "Alto Adige", description: "Il rosso quotidiano di Bolzano: Schiava succosa con viola e mandorla, beva irresistibile — perfetto con speck e canederli." },
  { name: "Santa Maddalena Abbazia di Novacella", regione: "Alto Adige", description: "Santa Maddalena fragrante e gentile, tra frutti rossi e mandorla dolce — un classico altoatesino da tutto pasto." },
  { name: "Schiava Hofstatter", regione: "Alto Adige", description: "Schiava tipica: leggera, profumata di fragola e viola, deliziosa servita fresca — da aperitivi e taglieri." },
  { name: "Schiava Nals Margreid", regione: "Alto Adige", description: "La beva facile della tradizione altoatesina: frutto rosso croccante e sorso snello — ottima con pizza e cucina informale." },
  // Campania
  { name: "Taurasi Terredora", regione: "Campania", description: "Aglianico d'Irpinia austero e profondo: amarena, tabacco e spezie su tannino importante — da grandi arrosti e lunghi invecchiamenti." },
  { name: "Taurasi Radici Mastroberardino", regione: "Campania", description: "Il Taurasi per antonomasia: struttura, frutta scura, cuoio e liquirizia — un patriarca del Sud da carni importanti." },
  // Emilia Romagna
  { name: "Gutturnio Costa dei Salina Perinelli", regione: "Emilia Romagna", description: "Gutturnio fermo dei colli piacentini, Barbera e Croatina: frutto pieno e sorso caldo — con i salumi piacentini è di casa." },
  { name: "Gutturnio Vivace Perinelli", regione: "Emilia Romagna", description: "La versione vivace del Gutturnio: brioso, fruttato, di beva golosa — nato per coppa, salame e tortelli." },
  { name: "Lambrusco dell'Emilia Nivolae Chiarli", regione: "Emilia Romagna", description: "Lambrusco dalla spuma vivace e dal frutto fragrante — l'allegria della tavola emiliana, perfetto con salumi e gnocco fritto." },
  { name: "Lambrusco Vigna Cà del Fiore Manicardi", regione: "Emilia Romagna", description: "Lambrusco di vigna singola: profumi di ciliegia e viola, spuma fine e sorso asciutto — da provare con tigelle e parmigiano." },
  { name: "Marzieno Fattoria Zerbina", regione: "Emilia Romagna", description: "Rosso di Romagna di carattere, Sangiovese con uve internazionali: frutto scuro, spezie e struttura — da carni alla brace." },
  // Friuli
  { name: "Cabernet Franc Russiz Superiore", regione: "Friuli", description: "Cabernet Franc del Collio: elegante nota erbacea, piccoli frutti neri e sorso saporito — con le carni alla griglia dà il meglio." },
  { name: "Cabernet Sauvignon Marco Felluga", regione: "Friuli", description: "Cabernet Sauvignon friulano dal frutto netto e dai tannini levigati — versatile con secondi di carne e formaggi di media stagionatura." },
  { name: "Cabernet Sauvignon Crearo Pradio", regione: "Friuli", description: "Cabernet dal carattere morbido e speziato, con frutto maturo e legno discreto — piacevole da subito con le grigliate." },
  { name: "Merlot Russiz Superiore", regione: "Friuli", description: "Merlot di collina: prugna, ciliegia e velluto al palato, finale lungo — un classico friulano da carni e formaggi." },
  { name: "Merlot Roncomoro Pradio", regione: "Friuli", description: "Merlot succoso e diretto, dal frutto polposo e beva morbida — accompagna con disinvoltura la cucina di ogni giorno." },
  { name: "Pignacolusse Jermann", regione: "Friuli", description: "Rarità da uva Pignolo firmata Jermann: rosso profondo, speziato, di grande materia — bottiglia da intenditori con i brasati." },
  { name: "Pinot Nero Jermann", regione: "Friuli", description: "Pinot Nero secondo Jermann: eleganza, frutto fine e freschezza — perfetto con anatra e piatti di funghi." },
  { name: "Refosco Pradio", regione: "Friuli", description: "Refosco dal peduncolo rosso: frutti di bosco, vena acida vivace e finale ammandorlato — il rosso identitario del Friuli." },
  { name: "Refosco Dario Cos", regione: "Friuli", description: "Refosco artigianale, ruvido il giusto e ricco di frutti selvatici — chiama salumi friulani e piatti robusti." },
  { name: "Refosco Vigna Petrussa", regione: "Friuli", description: "Refosco di vigna dal frutto scuro e profondo, tannino vivo e bella freschezza — da provare con la selvaggina da penna." },
  { name: "Rosso Riserva degli Orzoni Russiz Superiore", regione: "Friuli", description: "Riserva di taglio bordolese del Collio: complessa, elegante, con frutto maturo e spezie — per le cene importanti." },
  { name: "Schioppettino Vigna Petrussa", regione: "Friuli", description: "Schioppettino di Prepotto: pepe nero, frutti di bosco e sorso slanciato — un autoctono raffinato da riscoprire." },
  // Lombardia
  { name: "Barbera Oltrepò Pavese Quaquarini", regione: "Lombardia", description: "Barbera dell'Oltrepò genuina e succosa, dal frutto vivo e acidità golosa — con risotti e salumi non tradisce mai." },
  { name: "Bonarda Oltrepò Pavese Quaquarini", regione: "Lombardia", description: "Bonarda vivace da uva Croatina: frutto scuro, morbidezza e spuma allegra — la regina della tavola oltrepadana." },
  { name: "Bonarda Oltrepò Pavese Giorgi", regione: "Lombardia", description: "Bonarda dal sorso pieno e vellutato, profumata di prugna e viola — perfetta con salame di Varzi e primi al ragù." },
  { name: "Bonarda Oltrepò Pavese Albani", regione: "Lombardia", description: "Interpretazione classica della Bonarda: fruttata, avvolgente, di beva immediata — da condividere con taglieri generosi." },
  { name: "Buttafuoco Oltrepò Pavese Quaquarini", regione: "Lombardia", description: "Il rosso fiero dell'Oltrepò: strutturato, caldo, dal frutto intenso — nato per brasati e formaggi saporiti." },
  { name: "Curtefranca Rosso Cà del Bosco", regione: "Lombardia", description: "Taglio bordolese di Franciacorta: frutto elegante, spezie e tannino fine — una firma prestigiosa anche fuori dalle bollicine." },
  { name: "Curtefranca Rosso Cavalleri", regione: "Lombardia", description: "Rosso franciacortino armonioso, tra frutti rossi e gentili note erbacee — piacevole con carni bianche e paste ripiene." },
  { name: "Grumello Sassorosso Nino Negri", regione: "Lombardia", description: "Nebbiolo di Valtellina dal cru Grumello: profumi alpini, tannino elegante e sapidità di montagna — con pizzoccheri e bresaola." },
  { name: "Inferno Nino Negri", regione: "Lombardia", description: "Dal vigneto più impervio della Valtellina: Nebbiolo teso, minerale, dal frutto asciutto — un rosso di roccia e carattere." },
  { name: "Roverone Nettare dei Santi", regione: "Lombardia", description: "Rosso importante delle colline di San Colombano, morbido e maturo — l'orgoglio della produzione locale con gli arrosti." },
  { name: "San Colombano DOC Nettare dei Santi", regione: "Lombardia", description: "La DOC di casa nostra: rosso fruttato e schietto delle colline di San Colombano — chilometro zero da bere con i salumi nostrani." },
  { name: "San Rocco Secco Nettare dei Santi", regione: "Lombardia", description: "Rosso fermo e asciutto della tradizione di San Colombano, dal frutto franco — quotidiano, sincero, a chilometro zero." },
  { name: "Sangue di Giuda Oltrepò Pavese Quaquarini", regione: "Lombardia", description: "Dolce e vivace, dal frutto rosso goloso: il rosso amabile dell'Oltrepò — da provare con crostate e pasticceria secca." },
  { name: "Sforzato di Valtellina 5 stelle Nino Negri", regione: "Lombardia", description: "Lo Sforzato simbolo della Valtellina: uve appassite, potenza vellutata e note di frutta sotto spirito — grande vino da meditazione." },
  { name: "Sforzato di Valtellina Canua Conti Sertoli Salis", regione: "Lombardia", description: "Sforzato profondo e caldo, tra prugna secca, spezie e cacao — da abbinare a brasati e formaggi d'alpeggio stagionati." },
  { name: "Tajardino Cavalleri", regione: "Lombardia", description: "Rosso franciacortino di carattere, frutto maturo e trama fitta ma elegante — con carni rosse e cacciagione gentile." },
  { name: "Valtellina Superiore Corte Meridiana Conti Sertoli Salis", regione: "Lombardia", description: "Nebbiolo delle Alpi elegante e sapido, dal tannino sottile — la montagna nel bicchiere, ideale con bresaola e formaggi di grotta." },
  { name: "Valtellina Superiore Mazer Nino Negri", regione: "Lombardia", description: "Valtellina Superiore di stoffa: rosa appassita, frutti rossi e mineralità — accompagna casseruole e piatti valtellinesi." },
  // Marche
  { name: "Montepulciano d'Abruzzo Jorio Umani Ronchi", regione: "Marche", description: "Montepulciano generoso e succoso: mora, ciliegia e spezie dolci su tannino morbido — un rapporto qualità prezzo da applausi." },
  { name: "Pelago Umani Ronchi", regione: "Marche", description: "Blend di Montepulciano e uve bordolesi: profondo, moderno, vellutato — bottiglia importante per carni rosse e occasioni speciali." },
  // Molise
  { name: "Aglianico del Molise Contaldo Di Majo Norante", regione: "Molise", description: "Aglianico molisano caldo e speziato, dal frutto scuro e tannino deciso — con agnello e cucina rustica del Sud." },
  // Piemonte
  { name: "Albarossa Montald Michele Chiarlo", regione: "Piemonte", description: "Da un incrocio tra Nebbiolo e Barbera: colore fitto, frutto ricco e freschezza — un piemontese moderno e avvolgente." },
  { name: "Barbaresco Produttori del Barbaresco", regione: "Piemonte", description: "Dalla cooperativa più celebre d'Italia: Nebbiolo autentico, rosa, ciliegia e tannino nobile — classe langarola a prezzo onesto." },
  { name: "Barbaresco Pio Cesare", regione: "Piemonte", description: "Barbaresco di scuola classica: elegante, speziato, di lunga persistenza — con tajarin al ragù e carni al vino." },
  { name: "Barbaresco Gaja", regione: "Piemonte", description: "La firma che ha portato il Barbaresco nel mondo: profondità, finezza e prestigio assoluto — un'icona per i grandi momenti." },
  { name: "Barbaresco Asili Michele Chiarlo", regione: "Piemonte", description: "Dal grande cru Asili: Nebbiolo aristocratico, floreale e setoso — eleganza pura per piatti al tartufo." },
  { name: "Barbaresco Bernardot Ceretto", regione: "Piemonte", description: "Cru di Treiso dal profilo teso e raffinato: frutto rosso, liquirizia e tannino fine — da carni brasate e formaggi DOP." },
  { name: "Barbaresco Montefico Riserva Produttori del Barbaresco", regione: "Piemonte", description: "Riserva di vigna storica: la potenza austera del Nebbiolo con anni di cantina alle spalle — per intenditori pazienti." },
  { name: "Barbaresco Reyna Michele Chiarlo", regione: "Piemonte", description: "Barbaresco armonico e accessibile, tra ciliegia, rosa e spezie dolci — introduce con grazia al mondo del Nebbiolo." },
  { name: "Barbarina Poderi Migliorini", regione: "Piemonte", description: "Rosso piemontese di piccola cantina, schietto e fruttato — la Langa di ogni giorno, senza pretese e senza delusioni." },
  { name: "Barbera d'Alba Ceretto", regione: "Piemonte", description: "Barbera d'Alba succosa e vibrante: ciliegia matura e acidità fresca — la compagna ideale di tajarin e agnolotti." },
  { name: "Barbera d'Alba Pio Cesare", regione: "Piemonte", description: "Barbera di stampo classico, piena e calorosa, con legno misurato — a tavola non sbaglia mai." },
  { name: "Barbera d'Alba Vignota Conterno Fantino", regione: "Piemonte", description: "Barbera di vigna in stile moderno: frutto lucido, morbidezza e slancio — golosa con carni e formaggi di media stagionatura." },
  { name: "Barbera d'Asti Bricco Bigotta Braida", regione: "Piemonte", description: "Barbera importante affinata in legno: concentrata, speziata, di lunga vita — dalla cantina che ha nobilitato la Barbera." },
  { name: "Barbera d'Asti Bricco Uccellone Braida", regione: "Piemonte", description: "La Barbera che ha fatto storia: opulenta, vellutata, con frutto profondo e legno nobile — bottiglia da grandi occasioni." },
  { name: "Barbera d'Asti La Court Michele Chiarlo", regione: "Piemonte", description: "Cru di Barbera elegante e moderno: mora, spezie e sorso pieno — con brasati e bagna caoda." },
  { name: "Barbera d'Asti Le Orme Michele Chiarlo", regione: "Piemonte", description: "Barbera quotidiana ben fatta: fragrante, succosa, dal sorso facile — il rosso da tavola piemontese per eccellenza." },
  { name: "Barbera d'Asti Mon Ross Forteto della Luja", regione: "Piemonte", description: "Barbera artigianale di collina: frutto vivo e freschezza contagiosa — da una piccola cantina di grande cuore." },
  { name: "Barbera del Monferrato La Monella Braida", regione: "Piemonte", description: "La Barbera vivace di Braida: brio, frutto croccante e allegria — nata per merende e salumi." },
  { name: "Barolo Pio Cesare", regione: "Piemonte", description: "Barolo classico e austero: rosa, catrame e liquirizia su tannino solenne — il re dei vini per bolliti e brasati." },
  { name: "Barolo Brunate Bricco Rocche Ceretto", regione: "Piemonte", description: "Dal cru Brunate: Barolo profondo e vellutato, di grande complessità — aristocrazia della Langa." },
  { name: "Barolo Cerequio Voerzio Roberto", regione: "Piemonte", description: "Barolo di culto da uno dei cru più ambiti: concentrazione, eleganza e rarità — per collezionisti e grandi ricorrenze." },
  { name: "Barolo Madonna Assunta Podere Rocche Manzoni", regione: "Piemonte", description: "Barolo generoso e moderno, dal frutto ricco e legno accarezzato — il carattere di Monforte in una bottiglia importante." },
  { name: "Barolo Prapò Bricco Rocche Ceretto", regione: "Piemonte", description: "Cru di Serralunga: struttura fitta, spezie ed energia minerale — un Barolo di lunga memoria." },
  { name: "Barolo Sorì Ginestra Conterno Fantino", regione: "Piemonte", description: "Dalla Ginestra di Monforte: Barolo profondo, balsamico, di trama finissima — il vertice della cantina." },
  { name: "Barolo Tortionano Michele Chiarlo", regione: "Piemonte", description: "Barolo dai suoli tortoniani: morbidezza, frutto rosso maturo e tannino gentile — classicità accessibile." },
  { name: "Barolo Zonchera Ceretto", regione: "Piemonte", description: "Il Barolo d'ingresso di Ceretto: fragrante, equilibrato, subito godibile — per innamorarsi del Nebbiolo senza aspettare decenni." },
  { name: "Dolcetto d'Alba Traversa", regione: "Piemonte", description: "Dolcetto genuino: frutto nero croccante, mandorla e beva quotidiana — il rosso feriale delle Langhe." },
  { name: "Dolcetto d'Alba Priavino Voerzio Roberto", regione: "Piemonte", description: "Dolcetto d'autore: succoso, pulito, dal frutto luminoso — la semplicità nelle mani di un grande produttore." },
  { name: "Dolcetto d'Alba Rossana Ceretto", regione: "Piemonte", description: "Dolcetto morbido e profumato dal vigneto Rossana — con paste al ragù e taglieri è sempre la risposta giusta." },
  { name: "Dolcetto d'Alba Savincato Tenuta L'Illuminata", regione: "Piemonte", description: "Dolcetto di La Morra fragrante e disinvolto, dal tipico finale ammandorlato — una beva compagnona per tutti i giorni." },
  { name: "Dolcetto di Dogliani Gillardi", regione: "Piemonte", description: "Dal territorio più vocato al Dolcetto: più struttura e profondità del solito — sorprende con primi ricchi e carni bianche." },
  { name: "Freisa Pio Cesare", regione: "Piemonte", description: "Autoctono ritrovato: Freisa fragrante di lampone e rosa, con vena vivace — una curiosità piemontese da salumi." },
  { name: "Grignolino Michele Chiarlo", regione: "Piemonte", description: "Grignolino scattante, dal colore chiaro e tannino pepato — leggero solo in apparenza, grande con fritture e antipasti." },
  { name: "Grignolino d'Asti Braida", regione: "Piemonte", description: "Il Grignolino secondo Braida: profumato, speziato, di beva golosa — anticonformista come chi lo sceglie." },
  { name: "Grignolino del Monferrato Pio Cesare", regione: "Piemonte", description: "Un gentiluomo di campagna: fine, secco, lievemente tannico — da provare con il vitello tonnato." },
  { name: "Il Bacialè Braida", regione: "Piemonte", description: "Blend giocoso di Barbera e vitigni internazionali: morbido, fruttato, conviviale — il vino che mette d'accordo tutta la tavola." },
  { name: "Langhe Rosso Monprà Conterno Fantino", regione: "Piemonte", description: "Nebbiolo, Barbera e Cabernet in equilibrio: struttura moderna e frutto ricco — un langarolo cosmopolita." },
  { name: "Le Grive Forteto della Luja", regione: "Piemonte", description: "Barbera e Pinot Nero in un blend originale: profumato, morbido, di personalità — accompagna salumi e primi piatti." },
  { name: "Nebbiolo Pio Cesare", regione: "Piemonte", description: "Nebbiolo Langhe di razza: rosa, ciliegia e tannino già armonico — l'anticamera nobile del Barolo." },
  { name: "Nebbiolo Produttori del Barbaresco", regione: "Piemonte", description: "Nebbiolo schietto dalla grande cooperativa: fragrante, teso, autentico — qualità langarola a prezzo gentile." },
  { name: "Nebbiolo Michele Chiarlo", regione: "Piemonte", description: "Nebbiolo immediato e curato: frutto rosso, viola e sorso elegante — per la cena piemontese di ogni settimana." },
  { name: "Nebbiolo d'Alba Ceretto", regione: "Piemonte", description: "Nebbiolo d'Alba fine e profumato, dal tannino levigato — con carni rosse e risotto al vino." },
  { name: "Nebbiolo Dancestro Tenuta L'Illuminata", regione: "Piemonte", description: "Nebbiolo di piccola tenuta a La Morra: floreale, sincero, ben fatto — piemontese nell'anima." },
  { name: "Nebbiolo Il Ciabot Traversa", regione: "Piemonte", description: "Nebbiolo rustico ed espressivo, dal cuore langarolo — da osteria, nel senso più bello del termine." },
  { name: "Pinot Nero Saracco", regione: "Piemonte", description: "Pinot Nero piemontese fine e fragrante, dal sorso fresco — inaspettato e riuscito, da provare con salumi crudi." },
  { name: "Sichivei Barbera d'Asti Bel Sit", regione: "Piemonte", description: "Barbera d'Asti di piccola cantina: franca, succosa, dal frutto pieno — la quotidianità fatta bene." },
  // Puglia
  { name: "Gratticciaia Agricola Vallone", regione: "Puglia", description: "Negroamaro da uve appassite: ricco, caldo, tra confettura e spezie — l'Amarone del Salento, da formaggi e meditazione." },
  { name: "Primitivo Punta Aquila Tenute Rubino", regione: "Puglia", description: "Primitivo intenso e mediterraneo: prugna, ciliegia sotto spirito e sorso caldo — con grigliate e cucina saporita." },
  { name: "Primitivo Torcidoca Tormaresca", regione: "Puglia", description: "Primitivo polposo e speziato, dal tannino dolce — il Sud generoso di casa Antinori." },
  { name: "Spano Calò", regione: "Puglia", description: "Rosso salentino di tradizione, morbido e profondo, con frutto maturo — da carni al forno e formaggi stagionati." },
  // Sardegna
  { name: "Cannonau Pala", regione: "Sardegna", description: "Cannonau autentico: frutti rossi maturi, macchia mediterranea e calore isolano — con arrosti e pecorino è casa." },
  { name: "Siray Pala", regione: "Sardegna", description: "Syrah sardo speziato e scuro, dal sorso avvolgente — pepe e frutto per grigliate e piatti saporiti." },
  { name: "Turriga Argiolas", regione: "Sardegna", description: "L'icona rossa della Sardegna: Cannonau e uve isolane, potenza vellutata e complessità — una bottiglia da collezione." },
  // Sicilia
  { name: "Camelot Donnafugata", regione: "Sicilia", description: "Taglio bordolese maturato al sole di Sicilia: morbido, profondo, avvolgente — internazionale con cuore isolano." },
  { name: "Cerasuolo di Vittoria Planeta", regione: "Sicilia", description: "L'unica DOCG siciliana: Nero d'Avola e Frappato, ciliegia succosa e beva fresca — ottimo anche leggermente fresco." },
  { name: "Chiaramonte rosso Firriato", regione: "Sicilia", description: "Nero d'Avola fruttato e solare, dal sorso morbido — la Sicilia di ogni giorno nel bicchiere." },
  { name: "Faro Palari Palari", regione: "Sicilia", description: "Rarità dello Stretto da uve Nerello: eleganza quasi borgognona, spezie e mineralità — un mito per intenditori." },
  { name: "Harmonium Firriato", regione: "Sicilia", description: "Nero d'Avola in versione importante: concentrato, vellutato, con frutto nero e cacao — da carni importanti." },
  { name: "Hierà Hauner", regione: "Sicilia", description: "Rosso vulcanico delle Eolie: frutto scuro, erbe e salsedine — un'isola intera nel bicchiere." },
  { name: "Merlot Planeta", regione: "Sicilia", description: "Merlot mediterraneo: polposo, caldo, di grande morbidezza — coccola formaggi e secondi di carne." },
  { name: "Mille e una notte Donnafugata", regione: "Sicilia", description: "L'etichetta simbolo di Donnafugata: Nero d'Avola profondo, elegante, di lunga persistenza — una favola per le grandi occasioni." },
  { name: "Quater rosso Firriato", regione: "Sicilia", description: "Quattro autoctoni siciliani in blend: frutto ricco, spezie e carattere isolano — originale e conviviale." },
  { name: "Ribeca Firriato", regione: "Sicilia", description: "Perricone, antico vitigno siciliano: tannino fiero, frutto scuro e personalità — per chi ama le strade meno battute." },
  { name: "Rosso del Soprano Palari", regione: "Sicilia", description: "Fratello del Faro: Nerello fragrante, speziato, di beva raffinata — Messina d'autore." },
  { name: "Santa Cecilia Planeta", regione: "Sicilia", description: "Nero d'Avola di Noto elegante e profondo: more, carruba e spezie dolci — il sud-est della Sicilia al suo meglio." },
  { name: "Santagostino rosso Firriato", regione: "Sicilia", description: "Nero d'Avola e Syrah: frutto pieno, pepe e morbidezza solare — con arrosti e caciocavallo." },
  { name: "Tancredi Donnafugata", regione: "Sicilia", description: "Nero d'Avola e Cabernet dal fascino gattopardiano: frutto scuro, struttura ed eleganza — storico rosso da cene importanti." },
  { name: "Tripudium Rosso Pellegrino", regione: "Sicilia", description: "Rosso siciliano generoso e vellutato, dal frutto maturo — una festa per arrosti e formaggi saporiti." },
  { name: "Triskelè Planeta", regione: "Sicilia", description: "Blend siciliano armonioso tra autoctoni e internazionali: caldo, speziato, accogliente — il simbolo dell'isola già nel nome." },
  // Toscana
  { name: "Borgeri Meletti Cavallari", regione: "Toscana", description: "Rosso di Bolgheri schietto e mediterraneo: frutto scuro, macchia e sorso pieno — il territorio bolgherese in versione quotidiana." },
  { name: "Brunello di Montalcino Castelgiocondo Marchesi dè Frescobaldi", regione: "Toscana", description: "Brunello di grande tenuta: Sangiovese profondo, tra amarena, cuoio e spezie — solidità aristocratica per gli arrosti." },
  { name: "Brunello di Montalcino Il Quercione Agricola San Felice", regione: "Toscana", description: "Brunello di selezione: frutto maturo, terra e tannino fitto — Montalcino in una bottiglia importante." },
  { name: "Brunello di Montalcino Madonna Piano Valdicava", regione: "Toscana", description: "Selezione celebre di Valdicava: opulenza, precisione e lunghissima vita — un Brunello da collezione." },
  { name: "Brunello di Montalcino Pian delle Bigne Antinori", regione: "Toscana", description: "Il Brunello di casa Antinori: elegante, armonico, dal frutto luminoso — un classico contemporaneo." },
  { name: "Brunello di Montalcino Poggio all'Oro Castello Banfi", regione: "Toscana", description: "La riserva di punta di Banfi: ricca, vellutata, con lunghi anni di affinamento — per le grandi celebrazioni." },
  { name: "Brunello di Montalcino Poggio alle Mura Castello Banfi", regione: "Toscana", description: "Il Brunello del castello: frutto profondo, spezie e trama levigata — moderno e maestoso." },
  { name: "Brunello di Montalcino Valdicava", regione: "Toscana", description: "Valdicava: Brunello di culto, materia ricca ed eleganza rigorosa — tra i più ricercati di Montalcino." },
  { name: "Brunello di Montalcino Mastroianni", regione: "Toscana", description: "Brunello di versante: teso, minerale, di grande classicità — per palati pazienti." },
  { name: "Brunello di Montalcino Siro Pacenti", regione: "Toscana", description: "Brunello di stile moderno: frutto lucido, legno raffinato e morbidezza — Montalcino contemporaneo." },
  { name: "Brunello di Montalcino Agricola San Felice", regione: "Toscana", description: "Brunello equilibrato e sincero: amarena, viola e tannino elegante — l'essenza del Sangiovese Grosso." },
  { name: "Brunello di Montalcino San Giorgio", regione: "Toscana", description: "Brunello dal carattere schietto: terra, frutto e sapore — Montalcino senza fronzoli." },
  { name: "Brunello di Montalcino Col d'Orcia", regione: "Toscana", description: "Dalla storica tenuta biologica: Brunello classico, austero il giusto, di lunga persistenza — vero Sangiovese." },
  { name: "Brunello di Montalcino Fanti", regione: "Toscana", description: "Brunello generoso di Castelnuovo dell'Abate: frutto caldo e trama vellutata — accogliente e profondo." },
  { name: "Brunello di Montalcino Castello Banfi", regione: "Toscana", description: "Il Brunello che ha aperto Montalcino al mondo: pieno, moderno, affidabile — sempre una certezza." },
  { name: "Brunello di Montalcino Biondi e Santi", regione: "Toscana", description: "La leggenda: qui è nato il Brunello. Austero, longevo, monumentale — una pagina di storia italiana nel calice." },
  { name: "Brunello di Montalcino Riserva Col d'Orcia", regione: "Toscana", description: "Riserva severa e nobile, fatta per lunghi invecchiamenti: spezie, cuoio e frutto asciutto — patrimonio da cantina." },
  { name: "Cacciacone San Giorgio", regione: "Toscana", description: "Rosso toscano di tenuta: Sangiovese schietto, fruttato, di beva franca — la Toscana quotidiana." },
  { name: "Casalferro Barone Ricasoli", regione: "Toscana", description: "Merlot in purezza dal Chianti storico: morbido, profondo, moderno — il lato internazionale del Barone." },
  { name: "Cepparello Isole Olena", regione: "Toscana", description: "Sangiovese in purezza divenuto mito: eleganza, energia e profondità — tra i più grandi rossi toscani." },
  { name: "Chianti Classico Castello Brolio Barone Ricasoli", regione: "Toscana", description: "Dal castello dove nacque la formula del Chianti: selezione importante, frutto nobile e spezie — storia viva." },
  { name: "Chianti Classico Castello Fonterutoli Mazzei", regione: "Toscana", description: "Chianti Classico di punta dei Mazzei: fitto, elegante, di lunga persistenza — sei secoli di famiglia nel bicchiere." },
  { name: "Chianti Classico Querciabella Agricola Querciabella", regione: "Toscana", description: "Chianti Classico in biodinamica: purezza di frutto, finezza e slancio — gallo nero d'autore." },
  { name: "Chianti Classico Riserva Agricola San Felice", regione: "Toscana", description: "Riserva armoniosa: ciliegia matura, spezie e tannino levigato — il Chianti della domenica." },
  { name: "Chianti Classico Riserva Rancia Felsina", regione: "Toscana", description: "Cru leggendario da vigna Rancia: austero, minerale, longevo — Sangiovese di rango." },
  { name: "Chianti Classico Rocca Guicciarda Barone Ricasoli", regione: "Toscana", description: "Riserva accogliente e speziata, dal frutto caldo — gallo nero affidabile per arrosti e pici al ragù." },
  { name: "Chianti Classico Isole Olena", regione: "Toscana", description: "Chianti Classico luminoso e succoso, di beva elegante — la mano di un maestro del Sangiovese." },
  { name: "Chianti Classico Felsina", regione: "Toscana", description: "Chianti Classico di Castelnuovo Berardenga: terroso, sincero, di carattere — con la bistecca è un matrimonio." },
  { name: "Chianti Classico Brolio Barone Ricasoli", regione: "Toscana", description: "Il gallo nero del Barone: fragrante, equilibrato, immediato — un classico della tavola toscana." },
  { name: "Chianti Classico Fonterutoli Mazzei", regione: "Toscana", description: "Chianti Classico vivo e moderno: ciliegia croccante e spezie fini — la firma Mazzei di ogni giorno." },
  { name: "Chianti Classico Peppoli Antinori", regione: "Toscana", description: "Chianti Classico morbido e fruttato, subito piacevole — il volto gentile del gallo nero." },
  { name: "Chianti Classico Poggio ai Frati Rocca di Castagnoli", regione: "Toscana", description: "Riserva di stampo tradizionale: ciliegia sotto spirito, cuoio e tannino asciutto — chiantigiano verace." },
  { name: "Chianti Rufina Marchesi dè Frescobaldi", regione: "Toscana", description: "Chianti di Rufina fresco ed elegante, di alta collina — con salumi toscani e pappardelle." },
  { name: "Cortaccio Villa Cafaggio", regione: "Toscana", description: "Cabernet in purezza dal cuore del Chianti: struttura, frutto scuro ed eleganza internazionale — da carni rosse." },
  { name: "Excelsus Castello Banfi", regione: "Toscana", description: "Cabernet e Merlot di Montalcino: opulento, vellutato, cosmopolita — il volto bordolese di Banfi." },
  { name: "Fontalloro Felsina", regione: "Toscana", description: "Sangiovese in purezza tra Chianti e crete senesi: profondo, luminoso, di grande futuro — un fuoriclasse." },
  { name: "Guado al Tasso Antinori", regione: "Toscana", description: "Bolgheri Superiore di casa Antinori: taglio bordolese di grande respiro — eleganza marittima e prestigio." },
  { name: "Guidalberto Tenuta San Guido", regione: "Toscana", description: "Il secondo vino della tenuta del Sassicaia: Cabernet e Merlot già armonici, eleganti — la porta d'ingresso alla leggenda." },
  { name: "Le Difese Tenuta San Guido", regione: "Toscana", description: "Cabernet e Sangiovese dalla tenuta del Sassicaia: fragrante, succoso, immediato — nobiltà accessibile." },
  { name: "Le Serre Nuove Ornellaia", regione: "Toscana", description: "Il secondo vino di Ornellaia: ricco, avvolgente, bordolese nell'anima — grande stile da subito." },
  { name: "Le Volte Ornellaia", regione: "Toscana", description: "L'ingresso nel mondo Ornellaia: morbido, mediterraneo, ben ritmato — eleganza quotidiana." },
  { name: "Morellino di Scansano Poggio Valente Fattorie le Pupille", regione: "Toscana", description: "Cru di Morellino: Sangiovese maremmano profondo e succoso — il mare dentro un rosso di razza." },
  { name: "Morellino di Scansano Bronzone Mazzei", regione: "Toscana", description: "Morellino di tenuta: caldo, fruttato, dal tannino gentile — la Maremma golosa." },
  { name: "Morellino di Scansano Biondi e Santi", regione: "Toscana", description: "Morellino firmato da un nome storico: frutto vivo e sorso elegante — Sangiovese di mare." },
  { name: "Morellino di Scansano Val delle Rose", regione: "Toscana", description: "Morellino fragrante e immediato: ciliegia, macchia e beva facile — con i salumi di cinta senese è perfetto." },
  { name: "Morellino di Scansano Fattoria Le Pupille", regione: "Toscana", description: "Il Morellino di riferimento: succoso, schietto, sempre in forma — l'allegria della Maremma." },
  { name: "Morellino di Scansano 414 Podere 414", regione: "Toscana", description: "Morellino artigianale del podere 414: materia, freschezza e carattere — maremmano doc." },
  { name: "Morellino di Scansano Capatosta Poggio Argentiera", regione: "Toscana", description: "Morellino di vecchie vigne, testardo di nome e generoso di fatto — frutto pieno e sapore." },
  { name: "Morellino di Scansano Riserva Val delle Rose", regione: "Toscana", description: "Riserva maremmana: più struttura, spezie e legno ben dosato — il Morellino vestito a festa." },
  { name: "Morellino di Scansano Santa Maria Marchesi dè Frescobaldi", regione: "Toscana", description: "Morellino luminoso e morbido, di frutto rosso maturo — la Maremma secondo Frescobaldi." },
  { name: "Nobile Montepulciano La Braccesca", regione: "Toscana", description: "Vino Nobile elegante: Sangiovese di Montepulciano con frutto scuro e spezie — nobiltà autentica a tavola." },
  { name: "Poggio alla Badiola Mazzei", regione: "Toscana", description: "Toscana IGT fragrante e conviviale, Sangiovese con un tocco di Merlot — la scorciatoia intelligente per il buon bere." },
  { name: "Pomino Rosso Marchesi dè Frescobaldi", regione: "Toscana", description: "Pinot Nero e Sangiovese d'alta collina: fine, boschivo, raro — una piccola Borgogna toscana." },
  { name: "Rosso di Montalcino Siro Pacenti", regione: "Toscana", description: "Rosso di Montalcino moderno e lucido: il fratello giovane del Brunello, subito godibile." },
  { name: "Rosso di Montalcino Castello Banfi", regione: "Toscana", description: "Sangiovese di Montalcino fragrante e rotondo — l'anteprima accessibile del Brunello di casa." },
  { name: "Rosso di Montalcino Biondi e Santi", regione: "Toscana", description: "Il Rosso della tenuta più storica di Montalcino: austero, puro, di scuola — il Brunello in gioventù." },
  { name: "Rosso di Montalcino Mastroianni", regione: "Toscana", description: "Rosso teso e minerale, di scuola classica — piccolo solo di nome." },
  { name: "Rosso di Montalcino Campogiovanni Agricola San Felice", regione: "Toscana", description: "Rosso di Montalcino solare e armonico — la quotidianità del Sangiovese Grosso." },
  { name: "Rosso di Montalcino Ciampoleto San Giorgio", regione: "Toscana", description: "Rosso schietto di Montalcino, fruttato e diretto — trattoria d'eccellenza." },
  { name: "Ruit Hora Caccia al Piano", regione: "Toscana", description: "Bolgheri DOC dal frutto ricco e dalla morbidezza mediterranea — bordolese di costa, elegante e godibile." },
  { name: "Sassicaia Tenuta San Guido", regione: "Toscana", description: "Il vino italiano più celebre al mondo: Cabernet di Bolgheri, eleganza assoluta e mito — non ha bisogno di presentazioni." },
  { name: "Sassicaia Tenuta San Guido", regione: "Toscana", description: "Il vino italiano più celebre al mondo: Cabernet di Bolgheri, eleganza assoluta e mito — non ha bisogno di presentazioni." },
  { name: "Sassoalloro Biondi e Santi", regione: "Toscana", description: "Sangiovese moderno e succoso firmato Biondi Santi: frutto pieno, morbidezza e classe — quotidiano di lusso." },
  { name: "Serrata Belguardo Mazzei", regione: "Toscana", description: "Rosso maremmano fragrante, con frutto vivo e spezie leggere — mediterraneo e disinvolto." },
  { name: "Solaia Antinori", regione: "Toscana", description: "Cabernet e Sangiovese da un solo vigneto assolato: potenza, eleganza e fama mondiale — un monumento del vino italiano." },
  { name: "Summus Castello Banfi", regione: "Toscana", description: "Sangiovese, Cabernet e Syrah in armonia: ricco, speziato, internazionale — la sintesi moderna di Montalcino." },
  { name: "Tignanello Antinori", regione: "Toscana", description: "Il supertuscan che ha cambiato la storia: Sangiovese e Cabernet, eleganza fiorentina e profondità — sempre desiderato." },
  // Trentino
  { name: "Brentino Maculan", regione: "Trentino", description: "Merlot e Cabernet di Breganze: morbido, fruttato, di beva generosa — il rosso quotidiano di casa Maculan." },
  { name: "Cabernet Maculan", regione: "Trentino", description: "Cabernet dal profilo pulito: frutto nero, lieve nota erbacea e sorso armonico — con carni e formaggi." },
  { name: "Granato Foradori", regione: "Trentino", description: "Teroldego in purezza divenuto icona: profondo, minerale, biodinamico — un grande rosso alpino." },
  { name: "Marzemino Bossi Fedrigotti", regione: "Trentino", description: "Il Marzemino celebrato nel Don Giovanni di Mozart: fragrante, fruttato, di beva gentile — tradizione trentina." },
  { name: "Teroldego Foradori", regione: "Trentino", description: "Teroldego rotaliano vivo e succoso: mora, viola ed energia — la firma di Elisabetta Foradori." },
  { name: "Teroldego Bossi Fedrigotti", regione: "Trentino", description: "Teroldego classico: colore fitto, frutti neri e tannino morbido — con polenta e carni salate." },
  // Umbria
  { name: "Campoleone Lamborghini", regione: "Umbria", description: "Sangiovese e Merlot umbri in versione potente: frutto denso e legno elegante — un fuoriserie, come da cognome." },
  { name: "Pinot Nero Antinori", regione: "Umbria", description: "Pinot Nero della Sala: fine, fragrante, con frutto rosso e sottobosco — eleganza borgognona in Umbria." },
  { name: "Rosso Conero Serrano Umani Ronchi", regione: "Umbria", description: "Montepulciano del Conero: frutto scuro, macchia e sorso robusto — verace e generoso." },
  { name: "Rosso di Montefalco Tenuta Alzatura", regione: "Umbria", description: "Sangiovese e Sagrantino in equilibrio: caldo, speziato, accogliente — l'Umbria a tavola." },
  { name: "Sagrantino di Montefalco Caprai", regione: "Umbria", description: "Il Sagrantino che ha conquistato il mondo: tannino monumentale, frutto scuro e lunga vita — da brasati e grandi formaggi." },
  { name: "Sagrantino di Montefalco Adanti", regione: "Umbria", description: "Sagrantino di scuola tradizionale: austero, profondo, sincero — Montefalco d'altri tempi." },
  { name: "Sagrantino di Montefalco Tenuta Alzatura", regione: "Umbria", description: "Sagrantino intenso e vellutato, tra mora, spezie e cacao — potenza umbra ben educata." },
  { name: "San Giorgio Lungarotti", regione: "Umbria", description: "Storico blend umbro di Sangiovese e Cabernet: complesso, maturo, di lunga tradizione — Torgiano nel calice." },
  // Valle d'Aosta
  { name: "Fumin Vigne la Tour Les Cretes", regione: "Valle d'Aosta", description: "Autoctono valdostano di montagna: speziato, scuro, dal tannino vivo — carattere alpino con carni e fontina." },
  { name: "Pinot Nero Les Cretes", regione: "Valle d'Aosta", description: "Pinot Nero d'alta quota: fragrante, teso, con frutti rossi croccanti — freschezza di montagna." },
  { name: "Rouge de Vigne Les Cretes", regione: "Valle d'Aosta", description: "Blend rosso valdostano agile e profumato — il quotidiano delle Alpi, da merende e taglieri." },
  // Veneto
  { name: "Amarone Valpolicella Valpantena Bertani", regione: "Veneto", description: "Amarone della Valpantena: appassimento più snello, frutto elegante e spezie — Bertani in versione contemporanea." },
  // TEMP: immagine generica "amarone classico" messa sul primo Amarone per
  // vedere la card con una foto vera — spostarla sul produttore giusto
  { name: "Amarone Cl. Serego Alighieri Masi", regione: "Veneto", img: amaroneClassico, description: "Dall'antica tenuta della famiglia di Dante: Amarone nobile, vellutato, con ciliegia matura e spezie — seicento anni di storia." },
  { name: "Amarone Cl. Valpolicella Allegrini", regione: "Veneto", description: "Amarone moderno e magnetico: frutto lussureggiante, morbidezza e potenza misurata — tra i più amati." },
  { name: "Amarone Cl. Valpolicella Costasera Masi", regione: "Veneto", description: "Il classico che guarda il lago: ricco, avvolgente, con frutta appassita e cacao — l'Amarone per antonomasia." },
  { name: "Amarone Classico Valpolicella Dal Forno", regione: "Veneto", description: "Culto assoluto: concentrazione monumentale, precisione e profondità — uno dei rossi più ricercati d'Italia." },
  { name: "Amarone Classico Valpolicella Bertani", regione: "Veneto", description: "L'Amarone della tradizione: austero, speziato, di longevità proverbiale — invecchia per decenni con grazia." },
  { name: "Amarone Classico Valpolicella Zenato", regione: "Veneto", description: "Amarone generoso e vellutato: amarena, prugna e spezie dolci — un abbraccio veronese per l'inverno." },
  { name: "Amarone Classico Valpolicella Speri", regione: "Veneto", description: "Amarone di famiglia, artigianale e classico: frutto profondo e mano tradizionale — Valpolicella autentica." },
  { name: "Amarone Classico Valpolicella Bertani", regione: "Veneto", description: "L'Amarone della tradizione: austero, speziato, di longevità proverbiale — invecchia per decenni con grazia." },
  { name: "Amarone Classico Valpolicella Bertani", regione: "Veneto", description: "L'Amarone della tradizione: austero, speziato, di longevità proverbiale — invecchia per decenni con grazia." },
  { name: "Amarone della Valpolicella Cecilia Beretta", regione: "Veneto", description: "Amarone armonioso e accessibile: frutta sotto spirito, cioccolato e rotondità — per iniziare ad amarlo." },
  { name: "Bardolino Le Fraghe", regione: "Veneto", description: "Bardolino fresco e succoso: ciliegia croccante e beva gioiosa — provalo fresco con pizza e pesce di lago." },
  { name: "Brolo di Campofiorin Masi", regione: "Veneto", description: "Ripasso evoluto e ricco, da uve selezionate: frutto denso e spezie — a metà strada tra Campofiorin e Amarone." },
  { name: "Fojaneghe Bossi Fedrigotti", regione: "Veneto", description: "Storico taglio bordolese, tra i primi in Italia: elegante e maturo — una pagina di storia enologica." },
  { name: "Marzemino Costaripa", regione: "Veneto", description: "Marzemino gardesano fragrante e gentile: frutto rosso e mandorla — con primi e salumi leggeri." },
  { name: "Ripassa Zenato", regione: "Veneto", description: "Il Ripasso più famoso: pieno, vellutato, con ciliegia matura e spezie — la via di mezzo perfetta verso l'Amarone." },
  { name: "Ripasso Campofiorin Masi", regione: "Veneto", description: "Il capostipite della tecnica del ripasso: corpo, morbidezza e frutto generoso — un classico intramontabile." },
  { name: "Secco Bertani Vintage Bertani", regione: "Veneto", description: "Rosso veronese in stile ottocentesco: speziato, asciutto, di grande fascino retrò — con risotto all'amarone." },
];
export const VINI_BIANCHI = [
  // Abruzzo
  { name: "Trebbiano d'Abruzzo Marina Cvetic Masciarelli", regione: "Abruzzo", description: "Trebbiano d'altra dimensione: affinato in legno, cremoso, con agrumi maturi e nocciola — bianco di struttura per pesce importante." },
  // Alto Adige
  { name: "Chardonnay Nals Margreid", regione: "Alto Adige", description: "Chardonnay alpino fresco e agrumato, dal finale sapido — con aperitivi e antipasti di lago." },
  { name: "Chardonnay Merol San Michele Appiano", regione: "Alto Adige", description: "Chardonnay affinato con cura: frutta gialla, lieve nota burrosa e freschezza — elegante con carni bianche." },
  { name: "Chardonnay Pinot Grigio Lageder", regione: "Alto Adige", description: "Blend bianco pulito e luminoso: mela, pera e slancio minerale — un quotidiano di qualità." },
  { name: "Chardonnay Sanct Valentin San Michele Appiano", regione: "Alto Adige", description: "Chardonnay di punta: ricco, cremoso, con legno raffinato e lunga scia — bianco da grandi tavole." },
  { name: "Dies Abbazia di Novacella", regione: "Alto Adige", description: "Bianco fresco di montagna dall'abbazia millenaria: fiori bianchi e mela croccante — pulizia di valle Isarco." },
  { name: "Gewurztraminer Hofstatter", regione: "Alto Adige", description: "Gewürztraminer aromatico: rosa, litchi e spezie dolci su sorso morbido — con cucina speziata e formaggi erborinati." },
  { name: "Gewurztraminer San Michele Appiano", regione: "Alto Adige", description: "Aromatico ed elegante: petali, frutta esotica e finale asciutto — l'esotismo altoatesino." },
  { name: "Gewurztraminer Lageder", regione: "Alto Adige", description: "Gewürztraminer in equilibrio: profumi intensi ma sorso sobrio e fresco — mai stucchevole." },
  { name: "Gewurztraminer Falkenstein", regione: "Alto Adige", description: "Interpretazione secca e verticale del Gewürztraminer: aromi fini e sapidità — per chi lo ama asciutto." },
  { name: "Gewurztraminer Abbazia di Novacella", regione: "Alto Adige", description: "Aromatico dell'abbazia: rosa e spezie su sorso pieno e fresco — con speck e formaggi di malga." },
  { name: "Gewurztraminer Kolbenhof Hofstatter", regione: "Alto Adige", description: "Il cru di Termeno di casa Hofstätter: opulento, speziato, profondo — un riferimento della tipologia." },
  { name: "Gewurztraminer Nussbaumer Cantina Termeno", regione: "Alto Adige", description: "Dal paese che dà il nome al vitigno: intenso, maestoso, celebre — il Gewürztraminer per eccellenza." },
  { name: "Gewurztraminer Sanct Valentin San Michele Appiano", regione: "Alto Adige", description: "Selezione aromatica di vertice: litchi, zenzero e stoffa ricca — grande con formaggi stagionati e cucina orientale." },
  { name: "Kerner Abbazia di Novacella", regione: "Alto Adige", description: "Kerner di valle Isarco: agrumi, erbe alpine e acidità croccante — montagna pura nel bicchiere." },
  { name: "Muller Thurgau Hofstatter", regione: "Alto Adige", description: "Müller Thurgau leggero e profumato: fiori bianchi e mela verde — l'aperitivo di quota." },
  { name: "Muller Thurgau Lageder", regione: "Alto Adige", description: "Fragrante e scattante, con erbe di prato e agrumi — semplicità alpina ben vestita." },
  { name: "Muller Thurgau San Michele Appiano", regione: "Alto Adige", description: "Bianco snello e aromatico dal sorso dissetante — con antipasti leggeri e verdure." },
  { name: "Muller Thurgau Abbazia di Novacella", regione: "Alto Adige", description: "Müller di montagna teso e floreale — l'altitudine in un sorso." },
  { name: "Pinot Bianco San Michele Appiano", regione: "Alto Adige", description: "Il vitigno simbolo della casa: mela golden, fiori e sapidità elegante — bianco gastronomico per eccellenza." },
  { name: "Pinot Bianco Hofstatter", regione: "Alto Adige", description: "Pinot Bianco preciso e cristallino, di beva signorile — con antipasti e pesce d'acqua dolce." },
  { name: "Pinot Bianco Lageder", regione: "Alto Adige", description: "Fresco, essenziale, luminoso — la quotidianità del Pinot Bianco fatta bene." },
  { name: "Pinot Bianco Nals Margreid", regione: "Alto Adige", description: "Pinot Bianco di collina: frutta bianca croccante e finale salato — versatile e gastronomico." },
  { name: "Pinot Bianco Barthenau Hofstatter", regione: "Alto Adige", description: "Cru storico di Pinot Bianco: profondità, cremosità e tensione — dimostra quanto in alto arrivi questo vitigno." },
  { name: "Pinot Bianco Moriz Cantina Termeno", regione: "Alto Adige", description: "Pinot Bianco fragrante dal sorso morbido e pulito — compagno quotidiano di verdure e pesce." },
  { name: "Pinot Grigio Sanct Valentin San Michele Appiano", regione: "Alto Adige", description: "Pinot Grigio di selezione: ricco, speziato, lontano dalle versioni anonime — con risotti e crostacei." },
  { name: "Riesling Falkenstein", regione: "Alto Adige", description: "Riesling di culto della Val Venosta: teso, minerale, agrumato — un bianco di roccia per intenditori." },
  { name: "Riesling Nals Margreid", regione: "Alto Adige", description: "Riesling alpino nervoso e pulito, tra lime e pietra — freschezza tagliente." },
  { name: "Riesling Praepositus Abbazia di Novacella", regione: "Alto Adige", description: "Il Riesling di punta dell'abbazia: profondo, minerale, di lunga evoluzione — il vertice della valle Isarco." },
  { name: "Riesling Rain Lageder", regione: "Alto Adige", description: "Riesling del vigneto Rain: agrumi, erbe e mineralità in un sorso slanciato — precisione biodinamica." },
  { name: "Sauvignon Lahn San Michele Appiano", regione: "Alto Adige", description: "Sauvignon fragrante: sambuco, pompelmo e finale sapido — da aperitivo e piatti di asparagi." },
  { name: "Sauvignon Sanct Valentin San Michele Appiano", regione: "Alto Adige", description: "Tra i Sauvignon italiani più premiati: esplosivo nei profumi, ricco nel sorso — un fuoriclasse." },
  { name: "Sauvignon Voglar Peter Dipoli", regione: "Alto Adige", description: "Sauvignon di montagna serio e longevo: minerale, teso, senza mode — artigianato puro." },
  { name: "Schulthauser San Michele Appiano", regione: "Alto Adige", description: "Pinot Bianco storico di San Michele: cremoso e fresco insieme — un piccolo classico altoatesino." },
  { name: "Sylvaner Abbazia di Novacella", regione: "Alto Adige", description: "Sylvaner di valle Isarco: erbe alpine, mela verde e sale — il bianco dei masi di montagna." },
  // Campania
  { name: "Falanghina Terredora", regione: "Campania", description: "Falanghina fresca e solare: fiori bianchi, pera e agrumi — con la cucina di mare campana è di casa." },
  { name: "Fiano di Avellino Campanaro Feudi San Gregorio", regione: "Campania", description: "Fiano affinato in legno: nocciola, miele e frutta gialla su sorso ricco — un bianco meridionale importante." },
  { name: "Fiano di Avellino Terredora", regione: "Campania", description: "Fiano di Avellino elegante: nocciola, pera e freschezza collinare — tra i grandi bianchi del Sud." },
  { name: "Greco di Tufo Terredora", regione: "Campania", description: "Greco minerale e deciso, con agrumi e pietra focaia — carattere vulcanico da crostacei." },
  // Emilia Romagna
  { name: "Malvasia Secca Perinelli", regione: "Emilia Romagna", description: "Malvasia aromatica in versione secca: fiori, salvia e beva asciutta — con i salumi piacentini è tradizione." },
  { name: "Ortrugo Perinelli", regione: "Emilia Romagna", description: "L'autoctono bianco piacentino: leggero, fragrante, dissetante — l'aperitivo dei colli." },
  // Francia
  { name: "Gewurztraminer d'Alsace Pierre Frick", regione: "Francia", description: "Gewürztraminer alsaziano in biodinamica: rosa, spezie e frutto candito su sorso avvolgente — con formaggi e cucina speziata." },
  { name: "Chablis Saint Pierre Albert Pic", regione: "Francia", description: "Chablis classico: Chardonnay su suoli di gesso, minerale e teso — ostriche e crostacei lo reclamano." },
  { name: "Pinot Gris Zind Humbrecht", regione: "Francia", description: "Pinot Gris di grande firma alsaziana: ricco, fumé, profondo — bianco da gastronomia importante." },
  { name: "Pouilly Fumé Chateau De Tracy", regione: "Francia", description: "Sauvignon della Loira dal castello storico: pietra focaia, agrumi e finezza — il fumé originale." },
  { name: "Pouilly Fumé De Ladoucette", regione: "Francia", description: "Pouilly Fumé celebre ed elegante: note affumicate, frutto bianco e classe — con pesce in punta di forchetta." },
  { name: "Riesling d'Alsace Pierre Frick", regione: "Francia", description: "Riesling alsaziano naturale: secco, minerale, senza trucco — puro terroir in bottiglia." },
  { name: "Sancerre Comte Lafond De Ladoucette", regione: "Francia", description: "Sancerre aristocratico: Sauvignon floreale e minerale dal sorso cristallino — Loira da manuale." },
  { name: "Sylvaner d'Alsace Pierre Frick", regione: "Francia", description: "Sylvaner artigianale e schietto: fiori bianchi, erbe e beva golosa — semplicità biodinamica." },
  // Friuli
  { name: "Capo Martino Jermann", regione: "Friuli", description: "Blend di autoctoni affinato in legno: complesso, cremoso, profondo — uno dei grandi bianchi di Jermann." },
  { name: "Friulano Le Vigne di Zamò", regione: "Friuli", description: "Friulano dei Colli Orientali: mandorla, fiori di campo e sapidità — l'identità bianca del Friuli." },
  { name: "Friulano Russiz Superiore", regione: "Friuli", description: "Friulano di Collio elegante e maturo, dal finale ammandorlato — con il prosciutto di San Daniele è un rito." },
  { name: "Friulano Marco Felluga", regione: "Friuli", description: "Friulano armonico e fresco: pera, mandorla e sorso disteso — quotidiano di classe." },
  { name: "Friulano Livio Felluga", regione: "Friuli", description: "Il Friulano di una casa leggendaria: preciso, sapido, luminoso — eleganza collinare." },
  { name: "Pinot Grigio Le Vigne di Zamò", regione: "Friuli", description: "Pinot Grigio serio: frutta bianca matura, struttura e pulizia — altro che versioni anonime." },
  { name: "Pinot Grigio Marco Felluga", regione: "Friuli", description: "Pinot Grigio di Collio: rotondo, fine, dal sorso pieno — con antipasti e primi di pesce." },
  { name: "Pinot Grigio Dessimis Le Vie di Romans", regione: "Friuli", description: "Cru di Pinot Grigio in stile ramato: ricco, speziato, di grande personalità — un riferimento italiano." },
  { name: "Ribolla Gialla Marco Felluga", regione: "Friuli", description: "Ribolla agile e agrumata, dalla beva scattante — l'aperitivo friulano per eccellenza." },
  { name: "Ronco di Corte Le Vigne di Zamò", regione: "Friuli", description: "Bianco di ronco dei Colli Orientali: struttura, frutto maturo e sapidità — la collina si sente." },
  { name: "Sauvignon Vigna Petrussa", regione: "Friuli", description: "Sauvignon artigianale: sambuco, frutto esotico e freschezza — piccola vigna, grande carattere." },
  { name: "Sauvignon Marco Felluga", regione: "Friuli", description: "Sauvignon di Collio espressivo e ordinato: aromi nitidi, sorso saporito — con asparagi e caprini." },
  { name: "Sauvignon Livio Felluga", regione: "Friuli", description: "Sauvignon elegante, mai sopra le righe: frutto esotico misurato e mineralità — stile Felluga." },
  { name: "Vintage Tunina Jermann", regione: "Friuli", description: "Il grande bianco italiano per antonomasia: blend di vigne vecchie, ricco, floreale, leggendario — un capolavoro friulano." },
  // Liguria
  { name: "Pigato Costadevigne", regione: "Liguria", description: "Pigato ligure: macchia mediterranea, pesca e sale — nato per trofie al pesto e pesce alla ligure." },
  { name: "Vermentino Costadevigne", regione: "Liguria", description: "Vermentino di riviera fresco e salino — il mare della Liguria nel bicchiere." },
  // Lombardia
  { name: "Bianco Convento Annunziata Bellavista", regione: "Lombardia", description: "Chardonnay fermo di Franciacorta dal convento in collina: cremoso, elegante, raro — un bianco di prestigio." },
  { name: "Bianco Rinè Cantrina", regione: "Lombardia", description: "Bianco gardesano di piccola cantina: aromatico, morbido, originale — una chicca del territorio." },
  { name: "Curtefranca bianco Bellavista", regione: "Lombardia", description: "Chardonnay e Pinot Bianco di Franciacorta: fine, fresco, signorile — l'eleganza anche senza bollicine." },
  { name: "Curtefranca bianco Cà del Bosco", regione: "Lombardia", description: "Bianco fermo di una casa mitica: agrumi, fiori e precisione — la Franciacorta in versione tranquilla." },
  { name: "Curtefranca bianco Cavalleri", regione: "Lombardia", description: "Curtefranca luminoso e sapido, di beva armoniosa — con pesce di lago e risotti." },
  { name: "Verdea Nettare dei Santi", regione: "Lombardia", description: "L'autoctono bianco di San Colombano: fragrante, schietto, a chilometro zero — la nostra collina nel calice." },
  { name: "Verdea I.G.T. Nettare dei Santi", regione: "Lombardia", description: "Verdea in versione selezionata: frutto pieno e beva generosa — tradizione lodigiana da riscoprire." },
  // Marche
  { name: "Verdicchio di Jesi Casal di Serra Umani Ronchi", regione: "Marche", description: "Verdicchio di vigna alta: mandorla, anice e sapidità — tra i bianchi italiani che invecchiano meglio." },
  // Molise
  { name: "Falanghina Di Majo Norante", regione: "Molise", description: "Falanghina fragrante e mediterranea: fiori, agrumi e beva facile — con la frittura di paranza." },
  { name: "Greco Di Majo Norante", regione: "Molise", description: "Greco molisano: frutta gialla, mineralità e carattere antico — da una famiglia storica del Sud." },
  // Piemonte
  { name: "Arneis Michele Chiarlo", regione: "Piemonte", description: "Arneis di Langa: pera, fiori bianchi e mandorla fresca — il bianco gentile del Piemonte." },
  { name: "Blangè Ceretto", regione: "Piemonte", description: "Il bianco piemontese più famoso: Arneis vivace con lievissimo perlage, fresco e immediato — aperitivo irrinunciabile." },
  { name: "Chardonnay Prasuè Saracco", regione: "Piemonte", description: "Chardonnay piemontese fine e fragrante, dal frutto pulito — quotidiano elegante." },
  { name: "Gavi Pio Cesare", regione: "Piemonte", description: "Cortese di Gavi: agrumi, mandorla e sorso teso — il bianco storico delle tavole di pesce piemontesi." },
  { name: "L'altro Chardonnay Pio Cesare", regione: "Piemonte", description: "Chardonnay in acciaio, fresco e diretto: frutta bianca croccante — l'alternativa quotidiana firmata Pio Cesare." },
  // Puglia
  { name: "Chardonnay Tormaresca", regione: "Puglia", description: "Chardonnay pugliese fresco e solare: frutta gialla e sorso morbido — con orecchiette e cucina di mare." },
  // Sardegna
  { name: "Stellato Pala", regione: "Sardegna", description: "Vermentino di vigne affacciate sul mare: salino, agrumato, luminoso — una stella con crudi e bottarga." },
  { name: "Vermentino Capichera", regione: "Sardegna", description: "Il Vermentino di Gallura per eccellenza: ricco, profondo, mediterraneo — un bianco importante di culto." },
  { name: "Vermentino Pala", regione: "Sardegna", description: "Vermentino sardo fragrante: macchia, cedro e freschezza — con fregola e frutti di mare." },
  // Sicilia
  { name: "Chardonnay Planeta", regione: "Sicilia", description: "Lo Chardonnay che rese celebre Planeta: cremoso, avvolgente, con legno dolce — un classico mediterraneo." },
  { name: "Charme bianco Firriato", regione: "Sicilia", description: "Bianco siciliano morbido e profumato, pensato per piacere — aperitivi al tramonto." },
  { name: "Chiaramonte bianco Firriato", regione: "Sicilia", description: "Bianco solare da uve siciliane: frutta gialla e freschezza — il quotidiano isolano." },
  { name: "Chiarandà Donnafugata", regione: "Sicilia", description: "Chardonnay siciliano di punta: ricco, elegante, con legno ben integrato — per pesce strutturato." },
  { name: "La Segreta Planeta", regione: "Sicilia", description: "Blend fresco e immediato: agrumi, fiori e beva spensierata — il bianco di ogni giorno di Planeta." },
  { name: "Lighea Donnafugata", regione: "Sicilia", description: "Zibibbo secco: zagara e albicocca su sorso asciutto e salino — una sirena mediterranea." },
  { name: "Quater bianco Firriato", regione: "Sicilia", description: "Quattro autoctoni bianchi siciliani in blend: aromatico, sapido, originale — l'isola intera nel calice." },
  { name: "Santagostino bianco Firriato", regione: "Sicilia", description: "Catarratto e Chardonnay: struttura e sole, frutto maturo e freschezza — bianco gastronomico siciliano." },
  { name: "Tripudium Bianco Pellegrino", regione: "Sicilia", description: "Bianco siciliano generoso, morbido e fruttato — una festa quotidiana a tavola." },
  { name: "Vigna di Gabri Donnafugata", regione: "Sicilia", description: "Ansonica elegante: fiori, mandorla e sapidità — dedicato a Gabriella, fondatrice della cantina." },
  { name: "Zibibbo Gibelè Pellegrino", regione: "Sicilia", description: "Zibibbo secco e aromatico: uva moscata, agrumi e sale — profumi di Pantelleria nel bicchiere." },
  // Toscana
  { name: "Vermentino Sada", regione: "Toscana", description: "Vermentino della costa toscana: fresco, salmastro, immediato — con cacciucco e crostacei." },
  // Umbria
  { name: "Orvieto San Giovanni Antinori", regione: "Umbria", description: "Orvieto classico: fiori bianchi, mela e mandorla su beva fresca — il bianco storico dell'Italia centrale." },
  { name: "Cadetto bianco Lungarotti", regione: "Umbria", description: "Bianco umbro quotidiano di casa Lungarotti: fragrante, semplice, ben fatto — a tutto pasto." },
  { name: "Cervaro della Sala Antinori", regione: "Umbria", description: "Chardonnay e Grechetto affinati in barrique: cremoso, minerale, longevo — il grande bianco italiano per definizione." },
  // Valle d'Aosta
  { name: "Chardonnay Les Cretes", regione: "Valle d'Aosta", description: "Chardonnay di montagna fresco e nitido: mela, agrumi e tensione alpina — purezza valdostana." },
  { name: "Chardonnay Cuvée Bois Les Cretes", regione: "Valle d'Aosta", description: "Il bianco alpino più celebrato: Chardonnay affinato in legno, cremoso e minerale — una vetta delle Alpi." },
  // Veneto
  { name: "Bidibi Maculan", regione: "Veneto", description: "Bianco fragrante e originale di casa Maculan: frutto vivace e beva allegra — spensierato per l'aperitivo." },
  { name: "Garganega Camporengo Le Fraghe", regione: "Veneto", description: "Garganega in purezza: fiori bianchi, mela e sapidità gentile — artigianato gardesano." },
  { name: "Le Lave Bertani", regione: "Veneto", description: "Bianco veronese di struttura da suoli vulcanici: morbido, minerale, profondo — con risotti e pesce al forno." },
  { name: "Lugana Pievecroce Costaripa", regione: "Veneto", description: "Lugana del Garda: Turbiana morbida con agrumi, pesca e sale — un bianco amatissimo con il pesce di lago." },
  { name: "Masianco Masi", regione: "Veneto", description: "Pinot Grigio con Verduzzo appassito: più ricco del solito, morbido e fruttato — il bianco in stile Masi." },
  { name: "Soave Capitel Foscarino Anselmi", regione: "Veneto", description: "Cru storico di Garganega: floreale, cremoso, di grande finezza — il Soave che non ti aspetti." },
  { name: "Soave San Vincenzo Anselmi", regione: "Veneto", description: "Garganega fragrante e gentile: fiori, pera e freschezza — un quotidiano d'autore." },
  { name: "Soave Sereole Bertani", regione: "Veneto", description: "Soave classico di collina: mandorla, agrumi e beva elegante — con risotto e verdure di stagione." },
];
export const VINI_ROSATI = [
  // Lombardia
  { name: "Rosamara Costaripa", regione: "Lombardia", description: "Chiaretto del Garda color petalo di rosa: fragolina, agrumi e sorso fresco — l'eleganza dell'estate sul lago." },
  // Puglia
  { name: "Mière Rosato Salento Calò", regione: "Puglia", description: "Rosato salentino da Negroamaro: ciliegia, melograno e sorso sapido — la grande tradizione pugliese del rosa." },
  // Sicilia
  { name: "Charme Rosè Firriato", regione: "Sicilia", description: "Rosato siciliano luminoso e profumato: piccoli frutti rossi e freschezza — pensato per l'aperitivo al tramonto." },
  // Toscana
  { name: "Rosato Perolla Agricola San Felice", regione: "Toscana", description: "Rosato maremmano di Sangiovese: fragrante, asciutto, versatile — da tutto pasto estivo." },
  { name: "Scalabrone Rosato Antinori", regione: "Toscana", description: "Il rosato di Bolgheri di casa Antinori: frutti rossi croccanti e sale marino — porta il nome del brigante della zona." },
];
export const SPUMANTI = [
  // Alto Adige
  { name: "Blanc de Blanc extra Brut Arunda", regione: "Alto Adige", description: "Metodo classico d'alta quota: Chardonnay teso, perlage fine e dosaggio minimo — bollicine dalla cantina più alta d'Europa." },
  { name: "Brut Rosè Excellor Arunda", regione: "Alto Adige", description: "Rosé di montagna elegante: piccoli frutti, crosta di pane e freschezza alpina — per brindisi fuori dal coro." },
  // Lombardia
  { name: "Brut Metodo Classico Domm Riccardi", regione: "Lombardia", description: "Metodo classico lombardo: perlage fine, crosta di pane e agrumi — un brindisi dal nome meneghino." },
  { name: "Brut Metodo Classico Domm Magnum Riccardi", regione: "Lombardia", description: "Il Domm in formato magnum: doppia bottiglia, doppia festa — ideale per le tavolate." },
  { name: "Brut Riserva Costaripa", regione: "Lombardia", description: "Riserva spumante gardesana: perlage cremoso e frutto maturo — la mano di Costaripa nelle bollicine." },
  { name: "Brut Rosè Costaripa", regione: "Lombardia", description: "Rosé gardesano raffinato: buccia di cipolla, fragolina e freschezza — bollicine rosa del lago." },
  { name: "Brut Rosè Riccardi", regione: "Lombardia", description: "Rosé brut fragrante: frutti rossi e perlage vivace — aperitivo in rosa senza pensieri." },
  { name: "Brut Spumante Costaripa", regione: "Lombardia", description: "Brut fresco e diretto del Garda: mela, fiori e bollicina pulita — quotidiano da brindisi." },
  { name: "Brut Spumante Magnum Costaripa", regione: "Lombardia", description: "Il brut del Garda in magnum: più grande la bottiglia, più lunga la festa." },
  { name: "Chardonnay Brut Riccardi", regione: "Lombardia", description: "Chardonnay spumantizzato: frutta bianca e perlage cremoso — semplice e ben fatto." },
  { name: "Cuvée Prestige Cà del Bosco", regione: "Lombardia", description: "La Franciacorta più famosa d'Italia: cremosa, precisa, immancabile — il brindisi che non delude mai." },
  { name: "Cuvée Prestige conf. 2 bottiglie Cà del Bosco", regione: "Lombardia", description: "Cuvée Prestige in confezione da due: il regalo che fa sempre bella figura." },
  { name: "Cuvée Prestige conf. 3 bottiglie Cà del Bosco", regione: "Lombardia", description: "Confezione da tre bottiglie: per chi ama regalare, o farsi trovare pronto." },
  { name: "Cuvée Prestige Jeroboam legno Cà del Bosco", regione: "Lombardia", description: "Jeroboam in cassa di legno: tre litri di Franciacorta per le grandi occasioni — un regalo monumentale." },
  { name: "Cuvée Prestige magnum Cà del Bosco", regione: "Lombardia", description: "Il Prestige in magnum: perlage ancora più fine, presenza scenica assicurata." },
  { name: "Franciacorta Blanc de Blancs Conti Ducco", regione: "Lombardia", description: "Franciacorta da solo Chardonnay: fiori bianchi, agrumi e finezza." },
  { name: "Franciacorta Brut Conti Ducco", regione: "Lombardia", description: "Franciacorta brut classica: pane tostato, mela e bollicina ordinata." },
  { name: "Franciacorta Brut Montenisa", regione: "Lombardia", description: "La Franciacorta di casa Antinori: elegante, fresca, signorile." },
  { name: "Franciacorta Brut 61 Berlucchi", regione: "Lombardia", description: "Il 61 celebra l'anno in cui nacque la Franciacorta: fragrante e agrumato — da Berlucchi, il pioniere." },
  { name: "Franciacorta Brut 1996 Cà del Bosco", regione: "Lombardia", description: "Millesimato storico di Cà del Bosco: evoluzione nobile e perlage sottile — per intenditori." },
  { name: "Franciacorta Brut Cà del Bosco", regione: "Lombardia", description: "Il brut di Cà del Bosco: rigore, cremosità e classe — Franciacorta di riferimento." },
  { name: "Franciacorta Brut 61 Berlucchi", regione: "Lombardia", description: "Il 61 celebra l'anno in cui nacque la Franciacorta: fragrante e agrumato — da Berlucchi, il pioniere." },
  { name: "Franciacorta Brut Blanc de Blancs Cavalleri", regione: "Lombardia", description: "Chardonnay in purezza di Cavalleri: teso, gessoso, elegante — Franciacorta d'autore." },
  { name: "Franciacorta Brut Magnum legno Montenisa", regione: "Lombardia", description: "Montenisa in magnum con cassa di legno: il regalo di rappresentanza." },
  { name: "Franciacorta Brut magnum Cavalleri", regione: "Lombardia", description: "Cavalleri in magnum: la finezza raddoppia — per tavolate importanti." },
  { name: "Franciacorta Brut magnum Conti Ducco", regione: "Lombardia", description: "Il brut Conti Ducco in formato magnum — festa per molti." },
  { name: "Franciacorta Brut millesimato Conti Ducco", regione: "Lombardia", description: "Millesimato di annata singola: più profondità e carattere." },
  { name: "Franciacorta Brut pas dosè Cavalleri", regione: "Lombardia", description: "Pas dosé: zero zuccheri aggiunti, tutto terroir — asciutto e verticale, per palati precisi." },
  { name: "Franciacorta Brut Rosè 61 Berlucchi", regione: "Lombardia", description: "Il 61 in rosa: Pinot Nero, fragolina e brio — brindisi con carattere." },
  { name: "Franciacorta Brut Rosè 61 Conti Ducco", regione: "Lombardia", description: "Rosé brut di Franciacorta: frutti rossi e perlage sottile." },
  { name: "Franciacorta Brut Satèn Cavalleri", regione: "Lombardia", description: "Satèn: la Franciacorta di seta, morbida e cremosa — solo Chardonnay e carezze." },
  { name: "Franciacorta Collezione Rosè Cavalleri", regione: "Lombardia", description: "Selezione rosé di Cavalleri: elegante, complessa, rara." },
  { name: "Franciacorta Cremant Conti Ducco", regione: "Lombardia", description: "Stile crémant: pressione più dolce, sorso vellutato — bollicina gentile." },
  { name: "Franciacorta Dosage Zero Cà del Bosco", regione: "Lombardia", description: "Dosage Zéro: la Franciacorta nuda, senza dosaggio — pura, tesa, autentica." },
  { name: "Franciacorta Gran Cuvée Bellavista", regione: "Lombardia", description: "La Gran Cuvée di Bellavista: aristocratica, cremosa, festosa — sinonimo di brindisi elegante." },
  { name: "Franciacorta Gran Cuvée magnum Bellavista", regione: "Lombardia", description: "Bellavista in magnum: eleganza in grande formato." },
  { name: "Franciacorta Gran Cuvée saten Bellavista", regione: "Lombardia", description: "Il Satèn di Bellavista: morbidezza serica e perlage cremoso." },
  { name: "Franciacorta Gran Cuvée Rosè Bellavista", regione: "Lombardia", description: "La Gran Cuvée in rosa: Pinot Nero, grazia e piccoli frutti." },
  { name: "Franciacorta Grandi cru Cavalleri", regione: "Lombardia", description: "Dalle vigne migliori di Cavalleri: profondità, gesso e lunga scia." },
  { name: "Franciacorta Pas dosè Conti Ducco", regione: "Lombardia", description: "Pas dosé asciutto e minerale: per chi ama le bollicine senza trucco." },
  { name: "Franciacorta Pas Operè Bellavista", regione: "Lombardia", description: "Pas Operé: il Bellavista più puro, millesimato e non dosato — da collezionisti." },
  { name: "Franciacorta Saten Cà del Bosco", regione: "Lombardia", description: "Il Satèn di Cà del Bosco: crema, fiori bianchi e seta — dolcezza di tatto, non di zucchero." },
  { name: "Palazzo Lana Brut Saten Berlucchi", regione: "Lombardia", description: "Palazzo Lana: la riserva di Berlucchi, profonda e raffinata — il vertice della casa." },
  { name: "Spumante Rosè Nettare dei Santi", regione: "Lombardia", description: "Bollicine rosa di San Colombano: fragranti e genuine — il brindisi a chilometro zero." },
  { name: "Franciacorta Cuvée Bellavista", regione: "Lombardia", description: "La cuvée d'ingresso di Bellavista: fresca, floreale, subito felice." },
  // Piemonte
  { name: "Brut Blanc de Blanc Chiarlo", regione: "Piemonte", description: "Blanc de blancs piemontese: agrumi, fiori e perlage vivace — aperitivo di classe." },
  { name: "Brut Pinot Spumante Banfi", regione: "Piemonte", description: "Pinot spumantizzato: fragrante, secco, conviviale." },
  // Trentino
  { name: "Ferrari Brut Jeroboam Ferrari", regione: "Trentino", description: "Il Ferrari Brut in jeroboam: tre litri di Trentodoc per fare colpo." },
  { name: "Ferrari Maximum Brut Ferrari", regione: "Trentino", description: "Il Maximum: Chardonnay di montagna, crosta di pane e freschezza — il brindisi italiano per definizione." },
  { name: "Ferrari Maximum Brut magnum Ferrari", regione: "Trentino", description: "Maximum in magnum: perlage più fine, festa più lunga." },
  { name: "Ferrari Maximum Rosè Ferrari", regione: "Trentino", description: "Rosé di Pinot Nero: fragolina, eleganza e brio — il lato rosa di casa Ferrari." },
  { name: "Ferrari Perlè Ferrari", regione: "Trentino", description: "Perlé: millesimato di solo Chardonnay, cremoso e profondo — Trentodoc d'autore." },
  { name: "Ferrari Perlè 2006 magnum Ferrari", regione: "Trentino", description: "Perlé millesimato 2006 in magnum: evoluzione nobile per grandi occasioni." },
  { name: "Ferrari Perlè Nero Ferrari", regione: "Trentino", description: "Perlé Nero: Pinot Nero in purezza, struttura e finezza — il blanc de noirs di Ferrari." },
  { name: "Ferrari Riserva Lunelli 2003 Ferrari", regione: "Trentino", description: "Riserva di famiglia affinata in legno: complessa, ampia, rara." },
  { name: "Ferrari Riserva Lunelli 2004 Ferrari", regione: "Trentino", description: "Riserva Lunelli 2004: profondità, miele e crosta di pane — bollicine da meditazione." },
  { name: "Giulio Ferrari riserva 2001 Ferrari", regione: "Trentino", description: "Il Giulio Ferrari: la riserva italiana più celebrata, oltre dieci anni sui lieviti — leggenda del Trentodoc." },
  // Veneto
  { name: "Brut Metodo Classico n. 10 Valdo", regione: "Veneto", description: "Metodo classico Numero 10 di Valdo: perlage fine e sorso asciutto — il lato serio della casa." },
  { name: "Cartizze Superiore Ruggeri", regione: "Veneto", description: "Cartizze: la collina più preziosa di Valdobbiadene — morbido, floreale, festoso." },
  { name: "Cartizze Superiore Foss Marai", regione: "Veneto", description: "Il Cartizze di Foss Marai: cremoso ed elegante — il prosecco vestito da sera." },
  { name: "Cuvée Brut Foss Marai", regione: "Veneto", description: "Cuvée brut fragrante e pulita: pera, fiori e bollicina gentile." },
  { name: "Cuvée brut Magnum Foss Marai", regione: "Veneto", description: "La cuvée Foss Marai in magnum: brindisi generoso." },
  { name: "Origine Brut Valdo", regione: "Veneto", description: "Prosecco brut di casa Valdo: fresco, immediato, affidabile." },
  { name: "Prosecco DOC Ruggeri", regione: "Veneto", description: "Prosecco di scuola Ruggeri: Glera fragrante, mela e fiori — l'aperitivo per antonomasia." },
  { name: "Riserva del Fondatore Valdo", regione: "Veneto", description: "La riserva storica di Valdo: più struttura e finezza del prosecco di ogni giorno." },
  { name: "Riserva del Fondatore Magnum Valdo", regione: "Veneto", description: "La Riserva del Fondatore in magnum: per brindare in tanti." },
];
export const CHAMPAGNE = [
  // Francia
  { name: "Belle Epoque Perrier Jouet", regione: "Francia", description: "La bottiglia con gli anemoni dipinti: Champagne floreale e setoso — icona di eleganza dal 1902." },
  { name: "Blanc de Blancs Roederer", regione: "Francia", description: "Blanc de blancs di Roederer: Chardonnay puro, gesso e agrumi — la precisione della grande maison." },
  { name: "Blanc de Blancs Ruinart", regione: "Francia", description: "Il blanc de blancs per antonomasia, dalla maison più antica della Champagne: luminoso e agrumato." },
  { name: "Blanc de Blancs d'Ay Gaston Chiquet", regione: "Francia", description: "Rarità da vigneron: Chardonnay coltivato ad Aÿ, patria del Pinot — carattere unico per intenditori." },
  { name: "Brut Pierre Gimonnet", regione: "Francia", description: "Récoltant della Côte des Blancs: Chardonnay teso e gessoso — Champagne di vigneron, qualità vera." },
  { name: "Brut Laurent Perrier", regione: "Francia", description: "Lo stile Laurent-Perrier: freschezza, agrumi e leggerezza — aperitivo di classe." },
  { name: "Brut Ruinart", regione: "Francia", description: "Ruinart brut: rotondo, luminoso, aristocratico — trecento anni di savoir-faire." },
  { name: "Brut Classic Deutz", regione: "Francia", description: "Deutz Classic: equilibrio, crosta di pane e finezza — la maison discreta amata dai sommelier." },
  { name: "Brut Premier Roederer", regione: "Francia", description: "Il brut storico di Roederer: completo, armonico, profondo — scuola di grande maison." },
  { name: "Brut Prestige Boutillez Vignon", regione: "Francia", description: "Piccolo vigneron della Montagne de Reims: Champagne autentico fuori dai circuiti — una chicca da scoprire." },
  { name: "Brut Reserve Billecart Salmon", regione: "Francia", description: "Billecart-Salmon: finezza proverbiale e perlage sottilissimo — lo Champagne degli intenditori discreti." },
  { name: "Brut Reserve Charles Heidsieck", regione: "Francia", description: "Charles Heidsieck: lunghe riserve in cantina e profondità — tra i brut più premiati al mondo." },
  { name: "Brut Rosè Ruinart", regione: "Francia", description: "Il rosé di Ruinart: frutti di bosco, rotondità e charme — il regalo che non sbaglia." },
  { name: "Brut Traditional Boutillez Vignon", regione: "Francia", description: "Cuvée tradizionale di vigneron: schietta, fragrante, conviviale." },
  { name: "Clos de Goisses Philipponat", regione: "Francia", description: "Il leggendario clos in ripida pendenza sulla Marna: potenza, mineralità e rarità — monumento della Champagne." },
  { name: "Cofanetto Magnum legno Cristal", regione: "Francia", description: "Cristal in magnum, cofanetto di legno: il re degli Champagne in veste da cerimonia." },
  { name: "Cuvée 1522 Philipponat", regione: "Francia", description: "1522, l'anno d'origine della famiglia: cuvée profonda da grandi cru." },
  { name: "Cuvée Prestige Taittinger", regione: "Francia", description: "Taittinger: Chardonnay in evidenza, grazia e fiori bianchi — brindisi di seta." },
  { name: "Cuvée Rosè Brut Laurent Perrier", regione: "Francia", description: "Il rosé più famoso di Francia: macerazione vera e frutti rossi vividi — un classico assoluto." },
  { name: "Dom Ruinart Ruinart", regione: "Francia", description: "La cuvée de prestige di Ruinart: blanc de blancs profondo e cesellato — per momenti irripetibili." },
  { name: "Oenothèque 1996 Dom Perignon", regione: "Francia", description: "Dom Pérignon Oenothèque 1996: sboccatura tardiva di un'annata mitica — collezionismo puro." },
  { name: "Extra Brut Billecart Salmon", regione: "Francia", description: "Extra brut: dosaggio minimo, finezza massima — Billecart in versione tesa." },
  { name: "Grand Blanc 2004 Philipponat", regione: "Francia", description: "Millesimato di Chardonnay: gesso, agrumi canditi e profondità." },
  { name: "Grand Brut Perrier Jouet", regione: "Francia", description: "Il brut di Perrier-Jouët: floreale, arioso, gioioso." },
  { name: "Initial Jacques Selosse", regione: "Francia", description: "Selosse, il vigneron più influente della Champagne: Initial, blanc de blancs magnetico — culto assoluto." },
  { name: "Cuvée Royal Joseph Perrier", regione: "Francia", description: "Joseph Perrier, maison storica di Châlons: morbida e fruttata — fu lo Champagne della regina Vittoria." },
  { name: "La Grande Dame Veuve Clicquot Ponsardin", regione: "Francia", description: "La cuvée dedicata a Madame Clicquot: potenza vellutata dai grandi cru di Pinot Nero." },
  { name: "Cristal Millesimato 2004 Roederer", regione: "Francia", description: "Cristal 2004: nato per uno zar, preciso come un diamante — il mito di Roederer." },
  { name: "Millésime 2002 Laurent Perrier", regione: "Francia", description: "Millesimato 2002: un'annata di riferimento, evoluzione elegante." },
  { name: "Riserva San Pietroburgo Veuve Clicquot Ponsardin", regione: "Francia", description: "Riserva che omaggia la corte russa innamorata della Veuve: ricca e cerimoniale." },
  { name: "Rosè Veuve Clicquot Ponsardin", regione: "Francia", description: "Il rosé della Veuve: fragole, brio e riconoscibilità assoluta." },
  { name: "Rosè 2006 Roederer", regione: "Francia", description: "Rosé millesimato di Roederer: raffinato, vinoso, di lunga scia." },
  { name: "Rosè Reserve Charles Heidsieck", regione: "Francia", description: "Rosé di casa Heidsieck: cremoso e fruttato, con la profondità delle lunghe riserve." },
  { name: "Royale Reserve Philipponat", regione: "Francia", description: "La riserva di casa Philipponnat: Pinot Nero in evidenza, corpo e nerbo." },
  { name: "Special Cuvée Bollinger", regione: "Francia", description: "Bollinger: vinificazione in legno, ampiezza e carattere — lo Champagne di James Bond." },
  { name: "Substance Jacques Selosse", regione: "Francia", description: "Substance: la solera perpetua di Selosse, profondità vertiginosa — tra le bottiglie più ricercate al mondo." },
  { name: "Tradition Gaston Chiquet", regione: "Francia", description: "Vigneron di Dizy: cuvée tradizionale armoniosa — Champagne vero a prezzo umano." },
  { name: "Vintage 2002 Dom Perignon", regione: "Francia", description: "Dom Pérignon 2002: annata celebrata, equilibrio assoluto — il mito nella sua veste migliore." },
  { name: "Vintage 2002 Veuve Clicquot Ponsardin", regione: "Francia", description: "Millesimato 2002 della Veuve: struttura e maturità nobile." },
  { name: "Vintage 2004 Billecart Salmon", regione: "Francia", description: "Millesimato 2004: la finezza Billecart con la profondità dell'annata." },
  { name: "Vintage 2004 Roederer", regione: "Francia", description: "Vintage 2004 di Roederer: preciso, minerale, costruito per durare." },
  { name: "Vintage rosè Dom Perignon", regione: "Francia", description: "Il rosé di Dom Pérignon: raro, profondo, sontuoso — vertice assoluto del rosa." },
];
export const VINI_DOLCI = [
  // Alto Adige
  { name: "Comtess Passito San Michele Appiano", regione: "Alto Adige", description: "Passito aromatico della linea Sanct Valentin: albicocca, miele e spezie — fine pasto elegante." },
  { name: "Moscato Giallo Gaierhof", regione: "Alto Adige", description: "Moscato giallo dolce e profumato: salvia, agrumi e miele leggero — con la pasticceria secca." },
  { name: "Moscato Rosa Franz Haas", regione: "Alto Adige", description: "Rarità alpina: Moscato Rosa profumato di rose e piccoli frutti — dolcezza aristocratica." },
  { name: "Terminum Vendemmia Tardiva Cantina Termeno", regione: "Alto Adige", description: "Vendemmia tardiva di Gewürztraminer: opulenta, esotica, pluripremiata — un gioiello dolce." },
  // Austria
  { name: "Auslese Cuvée Kracher", regione: "Austria", description: "Kracher, il maestro austriaco dei vini dolci: Auslese armoniosa tra miele e frutta gialla." },
  { name: "Beerenauslese cuvèe Kracher", regione: "Austria", description: "Beerenauslese: acini scelti a mano, dolcezza densa retta da grande acidità — scuola austriaca." },
  { name: "Eiswein cuvèe Kracher", regione: "Austria", description: "Vino di ghiaccio: uve gelate in vigna, purezza cristallina e dolcezza tesa." },
  // Canada
  { name: "Icewine Cabernet Franc Inniskillin", regione: "Canada", description: "Icewine rosso dal Canada: fragola candita e sciroppo d'acero nel calice — rarità che stupisce." },
  { name: "Icewine Riesling Inniskillin", regione: "Canada", description: "Il celebre vino di ghiaccio canadese: pesca, miele e freschezza glaciale — dolcezza nordica." },
  // Francia
  { name: "Banyuls L'Etoile", regione: "Francia", description: "Vino dolce naturale del Roussillon: Grenache, frutta cotta e cacao — l'abbinamento giusto col cioccolato." },
  { name: "Banyuls Gran cru 98 L'Etoile", regione: "Francia", anno: "1998", description: "Banyuls grand cru affinato a lungo: noci, spezie e nobile ossidazione — da meditazione." },
  { name: "Sauternes Grand Cru Classè Chateau de Malle", regione: "Francia", description: "Sauternes di castello classificato: botrytis, miele e zafferano — dolcezza nobile bordolese." },
  { name: "Sauternes Les Justices Chateau Les Justices", regione: "Francia", description: "Sauternes generoso e fine: albicocca, miele e freschezza — con foie gras e formaggi blu." },
  { name: "Sauternes 1er cru classè Chateau Rayne Vigneau", regione: "Francia", description: "Premier cru di Sauternes: opulenza, agrumi canditi e lunga scia." },
  { name: "Sauternes 1er cru classè Chateau Guiraud", regione: "Francia", description: "Guiraud, premier cru in biologico: botrytis pura, miele e zenzero." },
  { name: "Sauternes Chateau d'Yquem 94", regione: "Francia", anno: "1994", description: "Yquem: il vino dolce più leggendario del mondo — annata 1994, oro liquido da tramandare." },
  { name: "Sauternes Chateau d'Yquem 96", regione: "Francia", anno: "1996", description: "Yquem 1996: grande annata del mito assoluto di Sauternes — patrimonio da cantina." },
  { name: "Sauternes Chateau Simon", regione: "Francia", description: "Sauternes classico di famiglia: miele, fiori e dolcezza equilibrata." },
  { name: "Sauternes ml.375 Chateau Guiraud", regione: "Francia", description: "Guiraud in mezza bottiglia: la misura giusta per il fine pasto." },
  { name: "Sauternes ml.375 Chateau Simon", regione: "Francia", description: "Mezza bottiglia di Sauternes: dolcezza giusta per due." },
  { name: "Sauternes ml.375 Chateau de S.te Helene", regione: "Francia", description: "Sauternes in formato piccolo: il dessert liquido a portata di cena." },
  { name: "Sauternes Mouton Cadet Philippe de Rothschild", regione: "Francia", description: "Il Sauternes della casa Rothschild: accessibile e ben fatto." },
  { name: "Sauternes Premier Cru Classe Chateau Coutet", regione: "Francia", description: "Coutet, premier cru di Barsac: più fresco e slanciato — la finezza tra i Sauternes." },
  { name: "Sauternes Sainte-Helene Chateau de Malle", regione: "Francia", description: "Seconda etichetta di de Malle: botrytis gentile, prezzo gentile." },
  { name: "Vieux Pineau des Charentes Jean Fillioux", regione: "Francia", description: "Mosto e Cognac invecchiati insieme: il Pineau, aperitivo-dessert delle Charentes." },
  // Friuli
  { name: "Picolit Vigna Petrussa", regione: "Friuli", description: "Il Picolit: leggendario dolce friulano da rese minuscole — miele, fiori e nobiltà contadina." },
  { name: "Picolit Jermann", regione: "Friuli", description: "Il Picolit secondo Jermann: raro, elegante, prezioso." },
  { name: "Ramandolo Il longhino Cos", regione: "Friuli", description: "Ramandolo da Verduzzo di collina: albicocca, castagna e dolcezza asciutta — DOCG di nicchia." },
  { name: "Verduzzo Russiz Superiore", regione: "Friuli", description: "Verduzzo dolce del Collio: mela cotogna e miele su tannino gentile — dolcezza friulana." },
  // Lombardia
  { name: "La Tonsa Dolce Riccardi", regione: "Lombardia", description: "Dolce lombardo di casa Riccardi: morbido e fragrante — con la pasticceria della domenica." },
  { name: "Moscato Spumante dolce Quaquarini", regione: "Lombardia", description: "Moscato spumante dell'Oltrepò: uva aromatica e spuma dolce — festa semplice e sincera." },
  { name: "Passito di Verdea Riccardi", regione: "Lombardia", description: "Passito dall'autoctona Verdea di San Colombano: uva appassita a chilometro zero — rarità di casa nostra." },
  { name: "Passito Sulif Il Mosnel", regione: "Lombardia", description: "Passito franciacortino: frutta candita e miele, sorso elegante." },
  // Piemonte
  { name: "Barolo Chinato Cappellano", regione: "Piemonte", description: "Il Barolo Chinato originale, dalla ricetta storica di Cappellano: china e spezie — digestivo nobile e mito piemontese." },
  { name: "Barolo Chinato Michele Chiarlo", regione: "Piemonte", description: "Barolo aromatizzato alla china: dolce-amaro e speziato — perfetto col cioccolato fondente." },
  { name: "Brachetto d'Acqui Traversa", regione: "Piemonte", description: "Brachetto dolce e aromatico: rosa, fragola e spuma leggera — con la torta di nocciole." },
  { name: "Brachetto d'Acqui Banfi", regione: "Piemonte", description: "Brachetto fragrante: piccoli frutti rossi e dolcezza ariosa." },
  { name: "Brachetto d'Acqui Bologna", regione: "Piemonte", description: "Il Brachetto di Giacomo Bologna: aromatico, gioioso, di razza." },
  { name: "Moscato d'Asti Saracco", regione: "Piemonte", description: "Il Moscato d'Asti di riferimento: zagara, pesca e dolcezza viva — Saracco è una garanzia." },
  { name: "Moscato d'Asti Forteto della Luja", regione: "Piemonte", description: "Moscato artigianale dei calanchi: aromatico e fine — piccola cantina, grande grazia." },
  { name: "Moscato d'Asti Ceretto", regione: "Piemonte", description: "Moscato di casa Ceretto: fragrante, dolce il giusto, profumatissimo." },
  { name: "Moscato d'Asti Traversa", regione: "Piemonte", description: "Moscato genuino: uva, fiori e allegria — il dolce della merenda piemontese." },
  { name: "Moscato d'Asti magnum Saracco", regione: "Piemonte", description: "Il Saracco in magnum: il panettone ringrazia." },
  { name: "Moscato d'Asti Nivole Chiarlo", regione: "Piemonte", description: "Nivole: il Moscato tra le nuvole di Chiarlo — dolcezza leggera come il nome." },
  { name: "Moscato d'Asti Rocca Uccellette Chiarlo", regione: "Piemonte", description: "Moscato di vigna: aromatico, cremoso, delicato." },
  { name: "Vendemmia Tardiva Moscato Forteto della Luja", regione: "Piemonte", description: "Moscato da vendemmia tardiva: miele, albicocca e complessità — oltre la semplice dolcezza." },
  // Portogallo
  { name: "Finest Reserve Graham's", regione: "Portogallo", description: "Porto riserva di Graham's: frutti neri, spezie e calore — l'introduzione perfetta al Porto." },
  { name: "Madeira 5 anni Cossart Gordon", regione: "Portogallo", description: "Madeira invecchiato cinque anni: caramello salato, noci e acidità infinita — l'isola nel bicchiere." },
  { name: "Porto 10 anni Graham's", regione: "Portogallo", description: "Tawny dieci anni: nocciola, caramello e legno dolce — con dolci secchi e formaggi." },
  { name: "Porto 20 anni Graham's", regione: "Portogallo", description: "Tawny vent'anni: complessità setosa tra arancia candita e frutta secca — meditazione lusitana." },
  { name: "Porto 30 anni Graham's", regione: "Portogallo", description: "Trent'anni di botte: profondità rara, spezie e velluto — Porto per le grandi occasioni." },
  { name: "Porto Ruby Ramos Pinto", regione: "Portogallo", description: "Ruby giovane e fruttato: mora, prugna e dolcezza diretta — il Porto quotidiano." },
  { name: "Vintage 1995 Noval", regione: "Portogallo", anno: "1995", description: "Porto Vintage di Quinta do Noval, annata 1995: potenza e frutto nero — da decantare e celebrare." },
  { name: "Vintage 2006 Graham's", regione: "Portogallo", anno: "2006", description: "Vintage 2006: la categoria regina del Porto — struttura e lunghissima vita." },
  // Puglia
  { name: "Moscato di Trani Kaloro Tormaresca", regione: "Puglia", description: "Moscato di Trani dolce e solare: miele, zagara e Mediterraneo." },
  // Sardegna
  { name: "Angelu Ruju Sella e Mosca", regione: "Sardegna", description: "Cannonau passito: il rosso dolce di Alghero, spezie e confettura — storico fine pasto isolano." },
  { name: "Vendemmia Tardiva Capichera", regione: "Sardegna", description: "Vermentino tardivo di Capichera: opulento, mediterraneo, raro." },
  // Sicilia
  { name: "Baglio Florio Florio", regione: "Sicilia", description: "Marsala Vergine di lungo invecchiamento: nocciola, tabacco e mare — l'aristocrazia del Marsala." },
  { name: "Malvasia delle Lipari Hauner", regione: "Sicilia", description: "La Malvasia di Salina secondo Hauner: albicocca, cappero e vulcano — il dolce delle Eolie." },
  { name: "Malvasia delle Lipari ml.375 Hauner", regione: "Sicilia", description: "La Malvasia eoliana in mezza bottiglia: dolcezza d'isola nel formato giusto." },
  { name: "Marsala fine rubino Pellegrino", regione: "Sicilia", description: "Marsala rubino giovane: dolce, caldo, da pasticceria." },
  { name: "Marsala Superiore secco Pellegrino", regione: "Sicilia", description: "Marsala Superiore secco: mandorla e legno — aperitivo d'altri tempi o cucina nobile." },
  { name: "Marsala Vergine Ambra Pellegrino", regione: "Sicilia", description: "Vergine ambrato: solo invecchiamento, nessuna concia — il Marsala dei puristi." },
  { name: "Marsala Vergine Solera Pellegrino", regione: "Sicilia", description: "Metodo solera: annate che si fondono in botte — profondità ossidativa affascinante." },
  { name: "Marsala Vergine Superiore oro Pellegrino", regione: "Sicilia", description: "Vergine oro superiore: elegante, asciutto, lungo." },
  { name: "Marsala Vergine Terre Arse Florio", regione: "Sicilia", description: "Terre Arse: il Marsala Vergine di Florio, asciutto e fumé — con i formaggi erborinati." },
  { name: "Passito Firriato", regione: "Sicilia", description: "Passito siciliano generoso: uva appassita al sole, miele e albicocca." },
  { name: "Passito di Pantelleria Bukkuram De Bartoli", regione: "Sicilia", description: "Bukkuram, il padre dei passiti di Pantelleria: Zibibbo monumentale di Marco De Bartoli — culto." },
  { name: "Passito Pantelleria Ben Ryè Donnafugata", regione: "Sicilia", description: "Ben Ryé, figlio del vento: il passito più celebrato d'Italia — albicocca, scorza candita e mare." },
  { name: "Passito Pantelleria Ben Ryè ml.375 Donnafugata", regione: "Sicilia", description: "Ben Ryé in mezza bottiglia: il gran finale in formato dessert." },
  { name: "Passito Pantelleria Kamma Murana", regione: "Sicilia", description: "Passito artigianale di Salvatore Murana, contrada Kamma: dolcezza contadina d'autore." },
  { name: "Passito Pantelleria liquoroso Pellegrino", regione: "Sicilia", description: "La versione liquorosa del passito: calda, dolce, generosa." },
  { name: "Passito Pantelleria Martingana Murana", regione: "Sicilia", description: "Martingana: il cru leggendario di Murana — tra i più grandi dolci italiani." },
  { name: "Passito Pantelleria Nes Pellegrino", regione: "Sicilia", description: "Nes: passito moderno e profumato — Pantelleria accessibile." },
  // Spagna
  { name: "Moscatel Emilìn Lustau", regione: "Spagna", description: "Moscatel di Jerez: uva passa, fiori e dolcezza vellutata — merenda andalusa." },
  { name: "Pedro Ximenes Murillo Lustau", regione: "Spagna", description: "PX: tra i vini più dolci del mondo — melassa, fichi e caffè, da colare sul gelato." },
  { name: "Sherry Solera Lustau", regione: "Spagna", description: "Sherry di solera: secco, salino, mandorlato — l'aperitivo di Jerez." },
  // Toscana
  { name: "Aleatico Sovana Antinori", regione: "Toscana", description: "Aleatico dolce della Maremma: rosa, ciliegia e morbidezza — un rosso da dessert." },
  { name: "Muffato della Sala Antinori", regione: "Toscana", description: "Il Muffato della Sala: la botrytis all'italiana — zafferano, miele e albicocca, celebre con gli erborinati." },
  { name: "Vin Santo del Chianti Classico San Felice", regione: "Toscana", description: "Vin Santo tradizionale: caratello, noci e miele — coi cantucci è liturgia toscana." },
  { name: "Vin Santo del Chianti Classico Felsina", regione: "Toscana", description: "Il Vin Santo di Felsina: ossidativo nobile, lunghissimo — tra i migliori di Toscana." },
  { name: "Moscadello di Montalcino Florus Banfi", regione: "Toscana", description: "Moscadello dolce di Montalcino: miele e pesca — la tradizione dolce accanto al Brunello." },
  // Ungheria
  { name: "Tokaji 1993 Puttonyos 6 Baron Bornemisza", regione: "Ungheria", anno: "1993", description: "Tokaji aszú 6 puttonyos 1993: il vino dei re — albicocca candita, tè e acidità immortale." },
  // Veneto
  { name: "I Capitelli Anselmi", regione: "Veneto", description: "I Capitelli: passito d'autore da Garganega — miele d'acacia e frutta candita, celebre nel mondo." },
  { name: "Moscato Dindarello Maculan", regione: "Veneto", description: "Dindarello: Moscato fresco e profumatissimo — la dolcezza leggera di Maculan." },
  { name: "Rosso Passito Madoro Maculan", regione: "Veneto", description: "Passito rosso di Breganze: confettura e spezie — con cioccolato e formaggi stagionati." },
  { name: "Torcolato Maculan", regione: "Veneto", description: "Il Torcolato: Vespaiola appassita al torchio che gli dà il nome — miele, zafferano e fama internazionale." },
];



export const BIRRE_32 = [
  { name: "CURMI", stile: "birra bianca", gradazione: "5,80%" },
  { name: "AUDACE", stile: "birra bionda forte", gradazione: "8,40%" },
  { name: "OPPALE", stile: "birra luppolata", gradazione: "5,50%" },
  { name: "ATRA", stile: "birra bruna", gradazione: "7,30%" },
  { name: "ADMIRAL", stile: "birra rossa", gradazione: "6,30%" },
  { name: "NEBRA", stile: "birra ambrata", gradazione: "8,00%" },
];

export const BIRRE_LA_BUTTIGA = [
  { name: "ALWAYS", stile: "blanche", colore: "giallo opalescente", gradazione: "4,20%" },
  { name: "POLKA", stile: "blonde ale", colore: "giallo carico", gradazione: "5,50%" },
  { name: "BORGATA", stile: "bitter ale", colore: "ambrato", gradazione: "4,20%" },
  { name: "SOPHIA", stile: "stout", colore: "scuro ebano", gradazione: "4,50%" },
  { name: "SOGNO", stile: "american pale ale", colore: "dorato", gradazione: "5,00%" },
  { name: "RYE", stile: "american ipa", colore: "dorato", gradazione: "6,20%" },
  { name: "PSYCHO", stile: "double ipa", colore: "rubino", gradazione: "7,10%" },
];

export const BIRRE_BALADIN = [
  { name: "ISAAC", stile: "birra bianca", gradazione: "5,00%" },
  { name: "WAYAN", stile: "birra saison", gradazione: "5,80%" },
  { name: "NORA", stile: "birra egizia", gradazione: "6,80%" },
  { name: "SUPER", stile: "birra ambrata", gradazione: "8,00%" },
  { name: "LEON", stile: "birra scura", gradazione: "9,00%" },
  { name: "NAZIONALE", stile: "birra italiana", gradazione: "6,50%" },
  { name: "ROCK'N'ROLL", stile: "birra apa", gradazione: "7,50%" },
];

export const BIRRE_MONT_BLANC = [
  { name: "LA BLONDE", stile: "bionda", gradazione: "5,80%" },
  { name: "LA BLANCHE", stile: "bianca", gradazione: "4,70%" },
  { name: "LA ROUSSE", stile: "rossa", gradazione: "6,50%" },
];

export const BIRRE_THE_BRAVE = [
  { name: "COLOMBINA", colore: "giallo paglierino", gradazione: "4,30%" },
  { name: "ARLECCHINO", colore: "ambrato chiaro", gradazione: "7,00%" },
  { name: "CAPITAN FRACASSA", colore: "giallo carico", gradazione: "8,40%" },
  { name: "SCARAMUCCIA", colore: "giallo paglierino", gradazione: "6,00%" },
  { name: "DOTTOR BALANZONE", colore: "ambrato scuro", gradazione: "7,00%" },
];

export const BIRRE_FARNESE = [
  { name: "BIANCASPINA", stile: "blanche", colore: "chiaro opalescente", gradazione: "4,40%" },
  { name: "PASHA'", stile: "indian pale ale", colore: "dorato intenso", gradazione: "6,30%" },
  { name: "DEA", stile: "imperial pils", colore: "giallo paglierino", gradazione: "6,50%" },
  { name: "GREEN DEW", stile: "saison", colore: "dorato intenso", gradazione: "6,60%" },
];

// ---- distillati: un array per tipologia ----
export const GRAPPA = [];
export const WHISKY = [];
export const RHUM = [];
export const LIQUORI = [];
export const ARMAGNAC_COGNAC = [];
export const CALVADOS = [];

// ---- sotto-sezioni distillati (sub-card della card "Distillati") ----
export const DISTILLATI_CATEGORIES = [
  {
    id: "grappa",
    label: "Grappa",
    description: "Grappe e acquaviti",
    img: grappa,
    accent: "#a5924f",
    items: GRAPPA,
  },
  {
    id: "whisky",
    label: "Whisky",
    description: "Whisky e whiskey",
    img: whisky,
    accent: "#b07a29",
    items: WHISKY,
  },
  {
    id: "rhum",
    label: "Rhum",
    description: "Rhum sudamericani e da meditazione",
    img: rhum,
    accent: "#7a4a26",
    items: RHUM,
  },
  {
    id: "liquori",
    label: "Liquori",
    description: "Liquori e amari",
    img: liquori,
    accent: "#5e7d54",
    items: LIQUORI,
  },
  {
    id: "armagnac-cognac",
    label: "Armagnac e Cognac",
    description: "Le acquaviti francesi",
    img: cognac,
    accent: "#8c4a2a",
    items: ARMAGNAC_COGNAC,
  },
  {
    id: "calvados",
    label: "Calvados",
    description: "Acquavite di mele della Normandia",
    img: calvados,
    accent: "#c26b32",
    items: CALVADOS,
  },
];

// ---- sotto-sezioni birre (sub-card della card "Birre") ----
export const BEER_CATEGORIES = [
  {
    id: "32-via-dei-birrai",
    label: "32 Via dei Birrai",
    description: "Birre artigianali venete",
    img: birrai32Img,
    accent: "#c78a2b",
    items: BIRRE_32,
  },
  {
    id: "la-buttiga",
    label: "La Buttiga",
    description: "Birrificio artigianale piacentino",
    img: laButtiga,
    accent: "#a8712c",
    items: BIRRE_LA_BUTTIGA,
  },
  {
    id: "baladin",
    label: "Baladin",
    description: "Birre artigianali piemontesi",
    img: baladin,
    accent: "#8f5a1e",
    items: BIRRE_BALADIN,
  },
  {
    id: "mont-blanc",
    label: "Brasserie du Mont-Blanc",
    short: "Mont-Blanc",
    description: "Birre alpine francesi",
    img: brasserie,
    accent: "#5b7fa4",
    items: BIRRE_MONT_BLANC,
  },
  {
    id: "the-brave",
    label: "The Brave",
    description: "Birre artigianali italiane",
    img: theBrave,
    accent: "#d19a3d",
    items: BIRRE_THE_BRAVE,
  },
  {
    id: "farnese",
    label: "Birrificio Farnese",
    short: "Farnese",
    description: "Birrificio artigianale italiano",
    img: farnese,
    accent: "#6e4419",
    items: BIRRE_FARNESE,
  },
];

// ---- categorie vini (sub-card della card "Vini") ----
export const WINE_CATEGORIES = [
  {
    id: "rossi",
    label: "Vini Rossi",
    short: "Rossi", // link rapido sulla card "Vini" della pagina Enoteca
    description: "Scopri tutti i nostri vini rossi",
    img: vinoRosso,
    accent: "#7b2d3b",
    filterBy: "regione",
    items: VINI_ROSSI,
  },
  {
    id: "bianchi",
    label: "Vini Bianchi",
    short: "Bianchi",
    description: "Freschezza e profumi dei nostri bianchi",
    img: vinoBianco,
    accent: "#d4a72c",
    filterBy: "regione",
    items: VINI_BIANCHI,
  },
  {
    id: "rosati",
    label: "Vini Rosati",
    short: "Rosati",
    description: "Le sfumature dei nostri rosati",
    img: vinoRosato,
    accent: "#d6798f",
    filterBy: "regione",
    items: VINI_ROSATI,
  },
  {
    id: "spumanti",
    label: "Spumanti",
    description: "Bollicine per ogni occasione",
    img: spumantiImg,
    accent: "#c2a878",
    filterBy: "regione",
    items: SPUMANTI,
  },
  {
    id: "champagne",
    label: "Champagne",
    description: "Le bollicine francesi",
    img: champagneImg,
    accent: "#b08d57",
    filterBy: "regione",
    items: CHAMPAGNE,
  },
  {
    id: "liquorosi",
    label: "Dolci, Passiti e Liquorosi",
    short: "Dolci e Passiti",
    description: "Dolci, Passiti e Liquorosi",
    img: liquorosiImg,
    accent: "#8a5a2b",
    filterBy: "regione",
    items: VINI_DOLCI,
  },
];

// ---- alimentari: un array per reparto ----
export const GASTRONOMIA = [];
export const DOLCERIA = [];

// ---- card della pagina Alimentari ----
export const ALIMENTARI_CATEGORIES = [
  {
    id: "gastronomia",
    label: "Gastronomia",
    description: "Specialità enogastronomiche",
    icon: "🧀",
    accent: "#c98f2e",
    items: GASTRONOMIA,
  },
  {
    id: "dolceria",
    label: "Dolceria",
    description: "Dolci e pasticceria artigianale",
    icon: "🍰",
    accent: "#b56576",
    items: DOLCERIA,
  },
];

// ---- macro-categorie del negozio: ogni card generale contiene le sue sub-card ----
// numero WhatsApp del negozio per "Chiedi disponibilità": solo cifre col
// prefisso internazionale, es. "393331234567".
// TEMP: numero finto per vedere il pulsante — SOSTITUIRE con quello vero

export const SHOP_GROUPS = [
  {
    id: "vini",
    label: "Vini",
    description: "Rossi, bianchi, rosati e bollicine",
    icon: "🍷",
    accent: "#2e5e46",
    columns: 3, // sub-card in file da 3 su schermi grandi
    categories: WINE_CATEGORIES,
  },
  {
    id: "birre",
    label: "Birre",
    description: "La nostra selezione di birre",
    icon: "🍺",
    accent: "#c78a2b",
    columns: 3, // sub-card in file da 3 su schermi grandi
    catNoun: "birrifici", // per la riga assortimento ("6 birrifici · …")
    categories: BEER_CATEGORIES,
  },
  {
    id: "distillati",
    label: "Distillati",
    description: "Grappe, whisky, rhum e acquaviti",
    icon: "🥃",
    accent: "#8a5a2b",
    catNoun: "tipologie", // per la riga assortimento ("6 tipologie · …")
    categories: DISTILLATI_CATEGORIES,
  },
];
