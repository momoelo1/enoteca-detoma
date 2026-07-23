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





export const BIRRE_32 = [
  { name: "CURMI", stile: "birra bianca", gradazione: "5,80%" },
  { name: "AUDACE", stile: "birra bionda forte", gradazione: "8,40%" },
  { name: "OPPALE", stile: "birra luppolata", gradazione: "5,50%" },
  { name: "ATRA", stile: "birra bruna", gradazione: "7,30%" },
  { name: "ADMIRAL", stile: "birra rossa", gradazione: "6,30%" },
  { name: "NEBRA", stile: "birra ambrata", gradazione: "8,00%" },
];

export const BIRRE_RIBALDI = [
  { name: "Bianca", stile: "birra bianca", gradazione: "6,00%", prezzo: 10.5 },
  { name: "Sicilian Pils", stile: "birra bionda", gradazione: "5,00%", prezzo: 10.5 },
  { name: "India Pale Ale", stile: "birra bionda", gradazione: "6,50%", prezzo: 10.5 },
  { name: "Sicilian Pale Ale", stile: "birra ambrata", gradazione: "6,00%", prezzo: 10.5 },
  { name: "Special Ale", stile: "birra rossa", gradazione: "7,00%", prezzo: 10.5 },
  { name: "Tripel", stile: "birra bionda", gradazione: "9,00%", prezzo: 10.5 },
];

export const BIRRE_GJULIA = [
  { name: "Est", stile: "birra weizen", gradazione: "6,00%", prezzo: 10.5 },
  { name: "Nord", stile: "birra bionda", gradazione: "5,50%", prezzo: 10.5},
  { name: "Ovest", stile: "birra ambrata", gradazione: "7,00%", prezzo: 10.5},
  { name: "Sud", stile: "birra bionda", gradazione: "8,00%", prezzo: 10.5 },
  { name: "Hellas Joy", stile: "birra bionda Helles", gradazione: "5,20%", prezzo: 9.5},
  { name: "Nostrana", stile: "birra chiara Bio", gradazione: "5,00%", prezzo: 12.0 },
  { name: "Ipa", stile: "birra chiara Pale Ale", gradazione: "5,80%", prezzo: 11.9 },
  { name: "Ribò", stile: "birra chiara Grape Ale", gradazione: "6,50%", prezzo: 12.5 },
  { name: "Grecale", stile: "birra bionda Grape Ale", gradazione: "10,00%", prezzo: 13.5 },
  { name: "Kristall Cuvée", stile: "birra chiara Grape Ale", gradazione: "6,50%", prezzo: 12.5 },
];

export const BIRRE_MONT_BLANC = [
  { name: "LA BLONDE", stile: "bionda", gradazione: "5,80%" },
  { name: "LA BLANCHE", stile: "bianca", gradazione: "4,70%" },
  { name: "LA ROUSSE", stile: "rossa", gradazione: "6,50%" },
];

export const BIRRE_DEL_FORTE = [
  { name: "Cento Volte Forte", colore: "Chiara Blanche", gradazione: "4,00%", prezzo: 11 },
  { name: "Gassa D'Amante", colore: "Chiara Golden Ale (senza glutine)", gradazione: "4,50%", prezzo: 10.5 },
  { name: "La Mancina", colore: "Dorata Belgian Strong Ale", gradazione: "7,50%", prezzo: 11 },
  { name: "2 Cilindri", colore: "Nera Porter", gradazione: "5,00%", prezzo: 11.5 },
  { name: "Meridiano 0", colore: "Ambrata Extra Special Bitter (senza glutine)", gradazione: "5,00%", prezzo: 11.5 },
];

export const BIRRE_CALABRAU = [
  { name: "Birra del Monaco", stile: "dorata weizen", gradazione: "5,00%", prezzo: 8.5 },
  { name: "MountLion", stile: "bionda dorata helles", gradazione: "5,00%", prezzo: 8.5 },
  { name: "MountLion cl.33", stile: "ambrata doppie Ipa", gradazione: "7,00%", prezzo: 4.9 },
];

export const BIRRE_SALENTO = [
  { name: "Beggia", stile: "Belgian Ale Ambrata", gradazione: "7,00%", prezzo: 9 },
  { name: "Taranta", stile: "Belgian Ale Ambrata Speziata", gradazione: "6,00%", prezzo: 9 },
  { name: "Pizzica", stile: "Belgian Ale Dorata", gradazione: "5,00%", prezzo: 9 },
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
    id: "ribaldi",
    label: "Ribaldi",
    description: "Birrificio artigianale piacentino",
    img: ribadi,
    accent: "#a8712c",
    items: BIRRE_RIBALDI,
  },
  {
    id: "gjulia",
    label: "Gjulia",
    description: "Birre artigianali piemontesi",
    img: gjulia,
    accent: "#8f5a1e",
    items: BIRRE_GJULIA,
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
    id: "forte",
    label: "Forte",
    description: "Birre artigianali italiane",
    img: forte,
    accent: "#d19a3d",
    items: BIRRE_DEL_FORTE,
  },
  {
    id: "calabrau",
    label: "Calabrau",
    description: "Birrificio artigianale italiano",
    img: calabrau,
    accent: "#6e4419",
    items: BIRRE_CALABRAU,
  },
  {
    id: "salento",
    label: "Salento",
    description: "Birrificio artigianale italiano",
    img: salento,
    accent: "#6e4419",
    items: BIRRE_SALENTO,
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
