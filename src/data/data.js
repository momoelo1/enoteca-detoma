import rossiIll from "../images/vini/rossi.webp";
import bianchiIll from "../images/vini/bianchi.webp";
import rosatiIll from "../images/vini/rosati.webp";
import spumantiIll from "../images/vini/spumanti.webp";
import champagneIll from "../images/vini/champagne.webp";
import liquorosiIll from "../images/vini/liquorosi.webp";
import birrai32Img from "../images/birre/32viadeibirrai.webp";
import brasserie from "../images/birre/brasserieMontBlanc.webp";
import ribadi from "../images/birre/ribadi-logo.webp";
import gjulia from "../images/birre/gjulia.webp"
import forte from "../images/birre/forte.webp"
import calabrau from "../images/birre/calabrau.webp";
import salento from "../images/birre/salento.webp";
import grappaIll from "../images/distillati/grappa.webp";
import whiskyIll from "../images/distillati/whisky.webp";
import rhumIll from "../images/distillati/rhum.webp";
import liquoriIll from "../images/distillati/liquori.webp";
import cognacIll from "../images/distillati/armagnac-cognac.webp";
import calvadosIll from "../images/distillati/calvados.webp";
import conserveItticheIll from "../images/gastronomia/conserve-ittiche.webp";
import panificatiIll from "../images/gastronomia/panificati-snack-salati.webp";
import pateCremeSalateIll from "../images/gastronomia/pate-creme-salate.webp";
import pestoIll from "../images/gastronomia/pesto.webp";
import sughiCondimentiIll from "../images/gastronomia/sughi-condimenti.webp";
import verdureSottolioIll from "../images/gastronomia/verdure-sottolio.webp";

export const WHATSAPP_NUMBER = "393342306019";

export const SHOP_INFO = {
  indirizzo: {
    via: "C.so Vittorio Emanuele, 32 - Lodi, 26900",
  },
  mappaLabel: "Aprilo in Google Maps",
  orari: [
    { giorni: "Lunedì", ore: "Chiuso" },
    { giorni: "Martedì – Sabato", ore: "09:00 – 13:00 / 15:30 – 19:30" },
    { giorni: "Domenica", ore: "09:00 – 13:00" },
  ],
  // ogni campo vuoto ("") sparisce dalla scheda contatti, non lascia buchi
  telefono: "0371-420786",
  email: "detoma@enotecadetoma.it",
  piva: "01682650153",
  // `id` sceglie l'icona (vedi SOCIAL_ICONS in Info.jsx); url vuoto = nascosto
  social: [
    { id: "instagram", label: "Instagram", url: "" },
    { id: "facebook", label: "Facebook", url: "" },
  ],
};

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



// l'icona della tab bar non sta più qui: components/icons/NavIcons.jsx
// disegna un SVG per ogni `id` di questo elenco
export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "enoteca", label: "Enoteca" },
  { id: "alimentari", label: "Alimentari" },
  { id: "confezioni", label: "Confezioni Regalo", short: "Regali" },
  { id: "info", label: "Info" },
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
    illustrazione: grappaIll,
    accent: "#a5924f",
    items: GRAPPA,
  },
  {
    id: "whisky",
    label: "Whisky",
    description: "Whisky e whiskey",
    illustrazione: whiskyIll,
    accent: "#b07a29",
    items: WHISKY,
  },
  {
    id: "rhum",
    label: "Rhum",
    description: "Rhum sudamericani e da meditazione",
    illustrazione: rhumIll,
    accent: "#7a4a26",
    items: RHUM,
  },
  {
    id: "liquori",
    label: "Liquori",
    description: "Liquori e amari",
    illustrazione: liquoriIll,
    accent: "#5e7d54",
    items: LIQUORI,
  },
  {
    id: "armagnac-cognac",
    label: "Armagnac e Cognac",
    description: "Le acquaviti francesi",
    illustrazione: cognacIll,
    accent: "#8c4a2a",
    items: ARMAGNAC_COGNAC,
  },
  {
    id: "calvados",
    label: "Calvados",
    description: "Acquavite di mele della Normandia",
    illustrazione: calvadosIll,
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
    illustrazione: rossiIll,
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
    illustrazione: bianchiIll,
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
    illustrazione: rosatiIll,
    accent: "#d6798f",
    filterBy: "regione",
    remote: true,
    items: [],
  },
  {
    id: "spumanti",
    label: "Spumanti",
    description: "Bollicine per ogni occasione",
    illustrazione: spumantiIll,
    accent: "#c2a878",
    filterBy: "regione",
    remote: true,
    items: [],
  },
  {
    id: "champagne",
    label: "Champagne",
    description: "Le bollicine francesi",
    illustrazione: champagneIll,
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
    illustrazione: liquorosiIll,
    accent: "#8a5a2b",
    filterBy: "regione",
    remote: true,
    items: [],
  },
];

// ---- alimentari: un array per reparto ----
export const GASTRONOMIA = [];
export const DOLCERIA = [];


const ILLUSTRAZIONI_GASTRONOMIA = {
  "conserve ittiche": conserveItticheIll,
  "panificati e snack da forno": panificatiIll,
  "pate e creme salate": pateCremeSalateIll,
  pesto: pestoIll,
  "sughi e condimenti": sughiCondimentiIll,
  "verdure sott'olio": verdureSottolioIll,
  // "panificati e snack da forno": in attesa dell'immagine
};

export const ALIMENTARI_CATEGORIES = [
  {
    id: "gastronomia",
    label: "Gastronomia",
    description: "Specialità enogastronomiche",
    icon: "🧀",
    accent: "#c98f2e",
    items: GASTRONOMIA,
    illustrazioni: ILLUSTRAZIONI_GASTRONOMIA,
  },
  {
    id: "dolceria",
    label: "Dolceria",
    description: "Dolci e pasticceria artigianale",
    icon: "🍰",
    accent: "#b56576",
    items: DOLCERIA,
    illustrazioni: {}, // in attesa delle immagini
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
