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
import lombardia from "../images/regioni/lombardia.jpg";
import piemonte from "../images/regioni/piemonte.jpg";
import aosta from "../images/regioni/aosta.jpg";
import sicilia from "../images/regioni/sicilia.jpg";
import abruzzo from "../images/regioni/abruzzo.jpg";
import campania from "../images/regioni/campania.jpg";
import emilia from "../images/regioni/emilia-romagna.jpg";
import friuli from "../images/regioni/friuli.jpg";
import marche from "../images/regioni/marche.jpg";
import sardegna from "../images/regioni/sardegna.jpg";
import trentino from "../images/regioni/trentino.jpg";
import molise from "../images/regioni/molise.jpg";
import puglia from "../images/regioni/puglia.jpg";
import toscana from "../images/regioni/toscana.jpg";
import umbria from "../images/regioni/umbria.jpg";
import veneto from "../images/regioni/veneto.jpg";



export const REGION_FLAGS = {
  Lombardia: lombardia,
  Piemonte: piemonte,
  "Valle d'Aosta": aosta,
  Sicilia: sicilia,
  Abruzzo: abruzzo,
  Campania: campania,
  "Emilia Romagna": emilia,
  Friuli: friuli,
  Marche: marche,
  Sardegna: sardegna,
  Trentino: trentino,
  Molise: molise,
  Puglia: puglia,
  Toscana: toscana,
  Umbria: umbria,
  Veneto: veneto,
};



export const SECTIONS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "enoteca", label: "Enoteca", icon: "🍷" },
  { id: "alimentari", label: "Alimentari", icon: "🥖" },
  { id: "confezioni", label: "Confezioni Regalo", short: "Regali", icon: "🎁" },
];


export const VINI_ROSSI = [
  // Abruzzo
  { name: "Montepulciano d'Abruzzo Marina Cvetic Masciarelli", regione: "Abruzzo", colore: "Rosso", anno: "2012", img: montepulcianoCvetic, description: "Vino rosso strutturato, affinato in legno, con note di frutta scura matura, spezie e tannini morbidi ma decisi — ottimo con carni rosse e piatti abruzzesi robusti." },
  { name: "Montepulciano d'Abruzzo Villa Gemma Masciarelli", regione: "Abruzzo", colore: "Rosso", anno: "2012", description: "Vino rosso elegante, con profumi di frutti rossi e note floreali, tannini setosi e finale persistente — ideale con arrosti e formaggi stagionati." },
  // Alto Adige
  { name: "Blauburgunder Mazzon Gottardi", regione: "Alto Adige" },
  { name: "Blauburgunder Falkestein", regione: "Alto Adige" },
  { name: "Lago di Caldaro San Michele Appiano", regione: "Alto Adige" },
  { name: "Lagrein Cantina Termeno", regione: "Alto Adige" },
  { name: "Lagrein Carlotto", regione: "Alto Adige" },
  { name: "Lagrein San Michele Appiano", regione: "Alto Adige" },
  { name: "Merlo Sanct Valentin San Michele Appiano", regione: "Alto Adige" },
  { name: "Pinot Nero Cantina Termeno", regione: "Alto Adige" },
  { name: "Pinot Nero Carlotto", regione: "Alto Adige" },
  { name: "Pinot Nero San Michele Appiano", regione: "Alto Adige" },
  { name: "Pinot Nero Hofstatter", regione: "Alto Adige" },
  { name: "Pinot Nero Nals Margreid", regione: "Alto Adige" },
  { name: "Pinot Nero Abbazia di Novacella", regione: "Alto Adige" },
  { name: "Pinot Nero Maso Cantaghel", regione: "Alto Adige" },
  { name: "Pinot nero Krafuss Lageder", regione: "Alto Adige" },
  { name: "Pinot Nero Riserva Hofstatter", regione: "Alto Adige" },
  { name: "Pinot Nero Riserva San Michele Appiano", regione: "Alto Adige" },
  { name: "Pinot Nero Sanct Valentin San Michele Appiano", regione: "Alto Adige" },
  { name: "Pinot nero Vigna Sant'Urbano Hofstatter", regione: "Alto Adige" },
  { name: "Santa Maddalena San Michele Appiano", regione: "Alto Adige" },
  { name: "Santa Maddalena Abbazia di Novacella", regione: "Alto Adige" },
  { name: "Schiava Hofstatter", regione: "Alto Adige" },
  { name: "Schiava Nals Margreid", regione: "Alto Adige" },
  // Campania
  { name: "Taurasi Terredora", regione: "Campania" },
  { name: "Taurasi Radici Mastroberardino", regione: "Campania" },
  // Emilia Romagna
  { name: "Gutturnio Costa dei Salina Perinelli", regione: "Emilia Romagna" },
  { name: "Gutturnio Vivace Perinelli", regione: "Emilia Romagna" },
  { name: "Lambrusco dell'Emilia Nivolae Chiarli", regione: "Emilia Romagna" },
  { name: "Lanbrusco Vigna Cà del Fiore Manicardi", regione: "Emilia Romagna" },
  { name: "Marzieno Fattoria Zerbina", regione: "Emilia Romagna" },
  // Friuli
  { name: "Cabernet Franc Russiz Superiore", regione: "Friuli" },
  { name: "Cabernet Sauvignon Marco Felluga", regione: "Friuli" },
  { name: "Cabernet Sauvignon Crearo Pradio", regione: "Friuli" },
  { name: "Merlot Russiz Superiore", regione: "Friuli" },
  { name: "Merlot Roncomoro Pradio", regione: "Friuli" },
  { name: "Pignacolusse Jermann", regione: "Friuli" },
  { name: "Pinot Nero Jermann", regione: "Friuli" },
  { name: "Refosco Pradio", regione: "Friuli" },
  { name: "Refosco Dario Cos", regione: "Friuli" },
  { name: "Refosco Vigna Petrussa", regione: "Friuli" },
  { name: "Rosso Riserva degli Orzoni Russiz Superiore", regione: "Friuli" },
  { name: "Schioppettino Vigna Petrussa", regione: "Friuli" },
  // Lombardia
  { name: "Barbera Oltrepò Pavese Quaquarini", regione: "Lombardia" },
  { name: "Bonarda Oltrepò Pavese Quaquarini", regione: "Lombardia" },
  { name: "Bonarda Oltrepò Pavese Giorgi", regione: "Lombardia" },
  { name: "Bonarda Oltrepò Pavese Albani", regione: "Lombardia" },
  { name: "Buttafuoco Oltrepò Pavese Quaquarini", regione: "Lombardia" },
  { name: "Curtefranca Rosso Cà del Bosco", regione: "Lombardia" },
  { name: "Curtefranca Rosso Cavalleri", regione: "Lombardia" },
  { name: "Grumello Sassorosso Nino Negri", regione: "Lombardia" },
  { name: "Inferno Nino Negri", regione: "Lombardia" },
  { name: "Roverone Nettare dei Santi", regione: "Lombardia" },
  { name: "San Colombano DOC Nettare dei Santi", regione: "Lombardia" },
  { name: "San Rocco Secco Nettare dei Santi", regione: "Lombardia" },
  { name: "Sangue di Giuda Oltrepò Pavese Quaquarini", regione: "Lombardia" },
  { name: "Sforato di Valtellina 5 stelle Nino Negri", regione: "Lombardia" },
  { name: "Sforzato di Valtellina Canua Conti Sertoli Salis", regione: "Lombardia" },
  { name: "Tajardino Cavalleri", regione: "Lombardia" },
  { name: "Valtellina Superiore Corte Meridiana Conti Sertoli Salis", regione: "Lombardia" },
  { name: "Valtellina Superiore Mazer Nino Negri", regione: "Lombardia" },
  // Marche
  { name: "Montepulciano d'Abruzzo Jorio Umani Ronchi", regione: "Marche" },
  { name: "Pelago Umani Ronchi", regione: "Marche" },
  // Molise
  { name: "Aglianico del Molise Contaldo Di Majo Norante", regione: "Molise" },
  // Piemonte
  { name: "Albarossa Montald Michele Chiarlo", regione: "Piemonte" },
  { name: "Barbaresco Produttori del Barbaresco", regione: "Piemonte" },
  { name: "Barbaresco Pio Cesare", regione: "Piemonte" },
  { name: "Barbaresco Gaja", regione: "Piemonte" },
  { name: "Barbaresco Asili Michele Chiarlo", regione: "Piemonte" },
  { name: "Barbaresco Bernardot Ceretto", regione: "Piemonte" },
  { name: "Barbaresco Montefico Riserva Produttori del Barbaresco", regione: "Piemonte" },
  { name: "Barbaresco Reyna Michele Chiarlo", regione: "Piemonte" },
  { name: "Barbarina Poderi Migliorini", regione: "Piemonte" },
  { name: "Barbera d'Alba Ceretto", regione: "Piemonte" },
  { name: "Barbera d'Alba Pio Cesare", regione: "Piemonte" },
  { name: "Barbera d'Alba Vignota Conterno Fantino", regione: "Piemonte" },
  { name: "Barbera d'Asti Bricco Bigotta Braida", regione: "Piemonte" },
  { name: "Barbera d'Asti Bricco Uccellone Braida", regione: "Piemonte" },
  { name: "Barbera d'Asti La Court Michele Chiarlo", regione: "Piemonte" },
  { name: "Barbera d'Asti Le Orme Michele Chiarlo", regione: "Piemonte" },
  { name: "Barbera d'Asti Mon Ross Forteto della Luja", regione: "Piemonte" },
  { name: "Barbera del Monferrato La Monella Braida", regione: "Piemonte" },
  { name: "Barolo Pio Cesare", regione: "Piemonte" },
  { name: "Barolo Brunate Bricco Rocche Ceretto", regione: "Piemonte" },
  { name: "Barolo Cerequio Voerzio Roberto", regione: "Piemonte" },
  { name: "Barolo Madonna Assunta Podere Rocche Manzoni", regione: "Piemonte" },
  { name: "Barolo Prapò Bricco Rocche Ceretto", regione: "Piemonte" },
  { name: "Barolo Sorì Ginestra Conterno Fantino", regione: "Piemonte" },
  { name: "Barolo Tortionano Michele Chiarlo", regione: "Piemonte" },
  { name: "Barolo Zonchera Ceretto", regione: "Piemonte" },
  { name: "Dolcetto d'Alba Traversa", regione: "Piemonte" },
  { name: "Dolcetto d'Alba Priavino Voerzio Roberto", regione: "Piemonte" },
  { name: "Dolcetto d'Alba Rossana Ceretto", regione: "Piemonte" },
  { name: "Dolcetto d'Alba Savincato Tenuta L'Illuminata", regione: "Piemonte" },
  { name: "Dolcetto di Dogliani Gillardi", regione: "Piemonte" },
  { name: "Freisa Pio Cesare", regione: "Piemonte" },
  { name: "Grignolino Michele Chiarlo", regione: "Piemonte" },
  { name: "Grignolino d'Asti Braida", regione: "Piemonte" },
  { name: "Grignolino del Monferrato Pio Cesare", regione: "Piemonte" },
  { name: "Il Bacialè Braida", regione: "Piemonte" },
  { name: "Langhe Rosso Monprà Conterno Fantino", regione: "Piemonte" },
  { name: "Le Grive Forteto della Luja", regione: "Piemonte" },
  { name: "Nebbiolo Pio Cesare", regione: "Piemonte" },
  { name: "Nebbiolo Produttori del Barbaresco", regione: "Piemonte" },
  { name: "Nebbiolo Michele Chiarlo", regione: "Piemonte" },
  { name: "Nebbiolo d'Alba Ceretto", regione: "Piemonte" },
  { name: "Nebbiolo Dancestro Tenuta L'Illuminata", regione: "Piemonte" },
  { name: "Nebbiolo Il Ciabot Traversa", regione: "Piemonte" },
  { name: "Pinot Nero Saracco", regione: "Piemonte" },
  { name: "Sichivei Barbera d'Asti Bel Sit", regione: "Piemonte" },
  // Puglia
  { name: "Gratticciaia Agricola Vallone", regione: "Puglia" },
  { name: "Primitivo Punta Aquila Tenute Rubino", regione: "Puglia" },
  { name: "Primitivo Torcidoca Tormaresca", regione: "Puglia" },
  { name: "Spano Calò", regione: "Puglia" },
  // Sardegna
  { name: "Cannonau Pala", regione: "Sardegna" },
  { name: "Siray Pala", regione: "Sardegna" },
  { name: "Turriga Argiolas", regione: "Sardegna" },
  // Sicilia
  { name: "Camelot Donnafugata", regione: "Sicilia" },
  { name: "Cerasuolo di Vittoria Planeta", regione: "Sicilia" },
  { name: "Chiaramonte rosso Firriato", regione: "Sicilia" },
  { name: "Faro Palari Palari", regione: "Sicilia" },
  { name: "Harmonium Firriato", regione: "Sicilia" },
  { name: "Hierà Hauner", regione: "Sicilia" },
  { name: "Merlot Planeta", regione: "Sicilia" },
  { name: "Mille e una notte Donnafugata", regione: "Sicilia" },
  { name: "Quater rosso Firriato", regione: "Sicilia" },
  { name: "Ribeca Firriato", regione: "Sicilia" },
  { name: "Rosso del Soprano Palari", regione: "Sicilia" },
  { name: "Santa Cecilia Planeta", regione: "Sicilia" },
  { name: "Santagostino rosso Firriato", regione: "Sicilia" },
  { name: "Tancredi Donnafugata", regione: "Sicilia" },
  { name: "Tripudium Rosso Pellegrino", regione: "Sicilia" },
  { name: "Triskelè Planeta", regione: "Sicilia" },
  // Toscana
  { name: "Borgeri Meletti Cavallari", regione: "Toscana" },
  { name: "Brunello di Montalcino Castelgiocondo Marchesi dè Frescobaldi", regione: "Toscana" },
  { name: "Brunello di Montalcino Il Quercione Agricola San Felice", regione: "Toscana" },
  { name: "Brunello di Montalcino Madonna Piano Valdicava", regione: "Toscana" },
  { name: "Brunello di Montalcino Pian delle Bigne Antinori", regione: "Toscana" },
  { name: "Brunello di Montalcino Poggio all'Oro Castello Banfi", regione: "Toscana" },
  { name: "Brunello di Montalcino Poggio alle Mura Castello Banfi", regione: "Toscana" },
  { name: "Brunello di Montalcino Valdicava", regione: "Toscana" },
  { name: "Brunello di Montalcino Mastroianni", regione: "Toscana" },
  { name: "Brunello di Montalcino Siro Pacenti", regione: "Toscana" },
  { name: "Brunello di Montalcino Agricola San Felice", regione: "Toscana" },
  { name: "Brunello di Montalcino San Giorgio", regione: "Toscana" },
  { name: "Brunello di Montalcino Col d'Orcia", regione: "Toscana" },
  { name: "Brunello di Montalcino Fanti", regione: "Toscana" },
  { name: "Brunello di Montalcino Castello Banfi", regione: "Toscana" },
  { name: "Brunello di Montalcino Biondi e Santi", regione: "Toscana" },
  { name: "Brunello di Montalcino Riserva Col d'Orcia", regione: "Toscana" },
  { name: "Cacciacone San Giorgio", regione: "Toscana" },
  { name: "Casalferro Barone Ricasoli", regione: "Toscana" },
  { name: "Cepparello Isole Olena", regione: "Toscana" },
  { name: "Chianti Classico Castello Brolio Barone Ricasoli", regione: "Toscana" },
  { name: "Chianti Classico Castello Fonterutoli Mazzei", regione: "Toscana" },
  { name: "Chianti Classico Querciabella Agricola Querciabella", regione: "Toscana" },
  { name: "Chianti Classico Riserva Agricola San Felice", regione: "Toscana" },
  { name: "Chianti Classico Riserva Rancia Felsina", regione: "Toscana" },
  { name: "Chianti Classico Rocca Guicciarda Barone Ricasoli", regione: "Toscana" },
  { name: "Chianti Classico Isole Olena", regione: "Toscana" },
  { name: "Chianti Classico Felsina", regione: "Toscana" },
  { name: "Chianti Classico Brolio Barone Ricasoli", regione: "Toscana" },
  { name: "Chianti Classico Fonterutoli Mazzei", regione: "Toscana" },
  { name: "Chianti Classico Peppoli Antinori", regione: "Toscana" },
  { name: "Chianti Classico Poggio ai Frati Rocca di Castagnoli", regione: "Toscana" },
  { name: "Chianti Rufina Marchesi dè Frescobaldi", regione: "Toscana" },
  { name: "Cortaccio Villa Cafaggio", regione: "Toscana" },
  { name: "Excelsus Castello Banfi", regione: "Toscana" },
  { name: "Fontalloro Felsina", regione: "Toscana" },
  { name: "Guado al Tasso Antinori", regione: "Toscana" },
  { name: "Guidalberto Tenuta San Guido", regione: "Toscana" },
  { name: "Le Difese Tenuta San Guido", regione: "Toscana" },
  { name: "Le Serre Nuove Ornellaia", regione: "Toscana" },
  { name: "Le Volte Ornellaia", regione: "Toscana" },
  { name: "Morellino di Scansano Poggio Valente Fattorie le Pupille", regione: "Toscana" },
  { name: "Morellino di Scansano Bronzone Mazzei", regione: "Toscana" },
  { name: "Morellino di Scansano Biondi e Santi", regione: "Toscana" },
  { name: "Morellino di Scansano Val delle Rose", regione: "Toscana" },
  { name: "Morellino di Scansano Fattoria Le Pupille", regione: "Toscana" },
  { name: "Morellino di Scansano 414 Podere 414", regione: "Toscana" },
  { name: "Morellino di Scansano Capatosta Poggio Argentiera", regione: "Toscana" },
  { name: "Morellino di Scansano Riserva Val delle Rose", regione: "Toscana" },
  { name: "Morellino di Scansano Santa Maria Marchesi dè Frescobaldi", regione: "Toscana" },
  { name: "Nobile Montepulciano La Braccesca", regione: "Toscana" },
  { name: "Poggio alla Badiola Mazzei", regione: "Toscana" },
  { name: "Pomino Rosso Marchesi dè Frescobaldi", regione: "Toscana" },
  { name: "Rosso di Montalcino Siro Pacenti", regione: "Toscana" },
  { name: "Rosso di Montalcino Castello Banfi", regione: "Toscana" },
  { name: "Rosso di Montalcino Biondi e Santi", regione: "Toscana" },
  { name: "Rosso di Montalcino Mastroianni", regione: "Toscana" },
  { name: "Rosso di Montalcino Campogiovanni Agricola San Felice", regione: "Toscana" },
  { name: "Rosso di Montalcino Ciampoleto San Giorgio", regione: "Toscana" },
  { name: "Ruit Hora Caccia al Piano", regione: "Toscana" },
  { name: "Sassicaia Tenuta San Guido", regione: "Toscana" },
  { name: "Sassicaia Tenuta San Guido", regione: "Toscana" },
  { name: "Sassoalloro Biondi e Santi", regione: "Toscana" },
  { name: "Serrata Belguardo Mazzei", regione: "Toscana" },
  { name: "Solaia Antinori", regione: "Toscana" },
  { name: "Summus Castello Banfi", regione: "Toscana" },
  { name: "Tignanello Antinori", regione: "Toscana" },
  // Trentino
  { name: "Brentino Maculan", regione: "Trentino" },
  { name: "Cabernet Maculan", regione: "Trentino" },
  { name: "Granato Foradori", regione: "Trentino" },
  { name: "Marzemino Bossi Fedrigotti", regione: "Trentino" },
  { name: "Teroldego Foradori", regione: "Trentino" },
  { name: "Teroldego Bossi Fedrigotti", regione: "Trentino" },
  // Umbria
  { name: "Campoleone Lamborghini", regione: "Umbria" },
  { name: "Pinot Nero Antinori", regione: "Umbria" },
  { name: "Rosso Conero Serrano Umani Ronchi", regione: "Umbria" },
  { name: "Rosso di Montefalco Tenuta Alzatura", regione: "Umbria" },
  { name: "Sagrantino di Montefalco Caprai", regione: "Umbria" },
  { name: "Sagrantino di Montefalco Adanti", regione: "Umbria" },
  { name: "Sagrantino di Montefalco Tenuta Alzatura", regione: "Umbria" },
  { name: "San Giorgio Lungarotti", regione: "Umbria" },
  // Valle d'Aosta
  { name: "Fumin Vigne la Tour Les Cretes", regione: "Valle d'Aosta" },
  { name: "Pinot Nero Les Cretes", regione: "Valle d'Aosta" },
  { name: "Rouge de Vigne Les Cretes", regione: "Valle d'Aosta" },
  // Veneto
  { name: "Amaraone Valpolicella Valpantena Bertani", regione: "Veneto" },
  // TEMP: immagine generica "amarone classico" messa sul primo Amarone per
  // vedere la card con una foto vera — spostarla sul produttore giusto
  { name: "Amarone Cl. Serego Alighieri Masi", regione: "Veneto", img: amaroneClassico },
  { name: "Amarone Cl. Valpolicella Allegrini", regione: "Veneto" },
  { name: "Amarone Cl. Valpolicella Costasera Masi", regione: "Veneto" },
  { name: "Amarone Classico Valpolicella Dal Forno", regione: "Veneto" },
  { name: "Amarone Classico Valpolicella Bertani", regione: "Veneto" },
  { name: "Amarone Classico Valpolicella Zenato", regione: "Veneto" },
  { name: "Amarone Classico Valpolicella Speri", regione: "Veneto" },
  { name: "Amarone Classico Valpolicella Bertani", regione: "Veneto" },
  { name: "Amarone Classico Valpolicella Bertani", regione: "Veneto" },
  { name: "Amarone della Valpolicella Cecilia Beretta", regione: "Veneto" },
  { name: "Bardolino Le Fraghe", regione: "Veneto" },
  { name: "Brolo di Campofiorin Masi", regione: "Veneto" },
  { name: "Fojaneghe Bossi Fedrigotti", regione: "Veneto" },
  { name: "Marzemino Costaripa", regione: "Veneto" },
  { name: "Ripassa Zenato", regione: "Veneto" },
  { name: "Ripasso Campofiorin Masi", regione: "Veneto" },
  { name: "Secco Bertani Vintage Bertani", regione: "Veneto" },
];
export const VINI_BIANCHI = [];
export const VINI_ROSATI = [];
export const SPUMANTI = [];
export const CHAMPAGNE = [];
export const VINI_DOLCI = []; 



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
export const WHATSAPP_NUMBER = "390000000000";

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
