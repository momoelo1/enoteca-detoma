import vinoRosso from "../images/vini/vino-rosso.png";
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
