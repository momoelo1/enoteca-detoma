import vinoRosso from "../images/vini/vino-rosso.png";
import vinoBianco from "../images/vini/vino-bianco.png";
import vinoRosato from "../images/vini/vino-rosato.png";
import spumantiImg from "../images/vini/spumanti.png";
import champagneImg from "../images/vini/champagne.png";
import liquorosiImg from "../images/vini/liquorosi.png";
import birrai32Img from "../images/birre/32viadeibirrai.png";
import brasserie from "../images/birre/brasserieMontBlanc.png";
import ribadi from "../images/birre/ribadi-logo.png";
import gjulia from "../images/birre/gjulia.png"
import forte from "../images/birre/forte.png"
import calabrau from "../images/birre/calabrau.png";
import salento from "../images/birre/salento.png";
import grappa from "../images/distillati/Grappa.png";
import whisky from "../images/distillati/whisky.png";
import rhum from "../images/distillati/Rhum.png";
import liquori from "../images/distillati/Liquori.png";
import cognac from "../images/distillati/Cognac.png";
import calvados from "../images/distillati/Calvados.png";

export const WHATSAPP_NUMBER = "393342306019";

// paesi esteri: nella barra filtri stanno tutti dietro il bottone
// "Mondo", che apre i paesi nella stessa barra
export const COUNTRY_GROUPS = {
  Francia: "mondo",
  Austria: "mondo",
  Portogallo: "mondo",
  Spagna: "mondo",
  Ungheria: "mondo",
  Canada: "mondo",
  Germania: "mondo",
  Croazia: "mondo",
  Argentina: "mondo",
  Sudafrica: "mondo",
  Slovenia: "mondo",
};



export const SECTIONS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "enoteca", label: "Enoteca", icon: "🍷" },
  { id: "alimentari", label: "Alimentari", icon: "🥖" },
  { id: "confezioni", label: "Confezioni Regalo", short: "Regali", icon: "🎁" },
  { id: "dove siamo", label: "Dove Siamo", icon: "📍"},
];





// birre: dati ora sull'API (/api/beers), non più array statici qui —
// vedi backend/scripts/importBirre.js per la migrazione una tantum

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
    items: [],
    remote: true,
  },
  {
    id: "ribaldi",
    label: "Ribaldi",
    description: "Birrificio artigianale piacentino",
    img: ribadi,
    accent: "#a8712c",
    items: [],
    remote: true,
  },
  {
    id: "gjulia",
    label: "Gjulia",
    description: "Birre artigianali piemontesi",
    img: gjulia,
    accent: "#8f5a1e",
    items: [],
    remote: true,
  },
  {
    id: "mont-blanc",
    label: "Brasserie du Mont-Blanc",
    short: "Mont-Blanc",
    description: "Birre alpine francesi",
    img: brasserie,
    accent: "#5b7fa4",
    items: [],
    remote: true,
  },
  {
    id: "forte",
    label: "Forte",
    description: "Birre artigianali italiane",
    img: forte,
    accent: "#d19a3d",
    items: [],
    remote: true,
  },
  {
    id: "calabrau",
    label: "Calabrau",
    description: "Birrificio artigianale italiano",
    img: calabrau,
    accent: "#6e4419",
    items: [],
    remote: true,
  },
  {
    id: "salento",
    label: "Salento",
    description: "Birrificio artigianale italiano",
    img: salento,
    accent: "#6e4419",
    items: [],
    remote: true,
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
    remote: true, // niente array statico: i vini arrivano dall'API (/api/wines)
    items: [],
  },
  {
    id: "bianchi",
    label: "Vini Bianchi",
    short: "Bianchi",
    description: "Freschezza e profumi dei nostri bianchi",
    img: vinoBianco,
    accent: "#d4a72c",
    filterBy: "regione",
    remote: true,
    items: [],
  },
  {
    id: "rosati",
    label: "Vini Rosati",
    short: "Rosati",
    description: "Le sfumature dei nostri rosati",
    img: vinoRosato,
    accent: "#d6798f",
    filterBy: "regione",
    remote: true,
    items: [],
  },
  {
    id: "spumanti",
    label: "Spumanti",
    description: "Bollicine per ogni occasione",
    img: spumantiImg,
    accent: "#c2a878",
    filterBy: "regione",
    remote: true,
    items: [],
  },
  {
    id: "champagne",
    label: "Champagne",
    description: "Le bollicine francesi",
    img: champagneImg,
    accent: "#b08d57",
    filterBy: "regione",
    remote: true,
    items: [],
  },
  {
    id: "liquorosi",
    label: "Dolci e Passiti",
    short: "Dolci e Passiti",
    description: "Dolci e assiti",
    img: liquorosiImg,
    accent: "#8a5a2b",
    filterBy: "regione",
    remote: true,
    items: [],
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
