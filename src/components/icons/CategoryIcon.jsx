// Icona per le mini-card di categoria (Enoteca) e di gruppo (Alimentari).
// Stessa libreria della tab bar (Phosphor, MIT), tinta con l'accento della
// categoria: la forma dice COSA è, il colore dice QUALE.
import { createElement } from "react";
import {
  Wine,
  Champagne,
  Brandy,
  Martini,
  BeerBottle,
  Jar,
  JarLabel,
  Fish,
  Bread,
  Leaf,
  Drop,
  Carrot,
  CookingPot,
  Cherries,
} from "@phosphor-icons/react";
import "./mini-switcher.css";

// Enoteca: chiave = id della categoria in data.js. Le tre categorie di vino
// fermo condividono il calice — a distinguerle è l'accento (bordeaux, oro,
// rosa), che è esattamente il criterio con cui le riconosce un cliente.
const CATEGORY_ICONS = {
  rossi: Wine,
  bianchi: Wine,
  rosati: Wine,
  spumanti: Champagne,
  champagne: Champagne,
  liquorosi: Brandy,
  grappa: Brandy,
  whisky: Brandy,
  rhum: Brandy,
  liquori: Martini,
  "armagnac-cognac": Brandy,
  calvados: Brandy,
};

// Alimentari: i gruppi non sono un elenco fisso (l'admin può inventarli),
// quindi si sceglie dalle parole, come per i segnaposto dei prodotti
const FOOD_RULES = [
  [/pesc|tonno|ittic|acciug|sgombr|salmon/, Fish],
  [/pane|forno|biscott|tarall|grissin|snack|scaldatell|bastoncin|spaghett|pasta/, Bread],
  [/pesto|basilic/, Leaf],
  [/miele|alveare|propoli|polline/, Drop],
  [/verdur|carciof|peperon|sott.olio|oliva|olive/, Carrot],
  [/sugo|sughi|ragu|salsa|passata|condiment|mostard|senap|tartufo/, CookingPot],
  [/confettur|composta|marmellat|frutta|sciroppat|amaren|gelso|ciliegi/, Cherries],
  [/crema|creme|pate|bruschett|cioccolat|pistacch|caramell/, JarLabel],
];

const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// `id` per le categorie note (vini/birre/distillati), `label` come ripiego
// per i gruppi alimentari, che un id fisso non ce l'hanno
const categoryIcon = ({ id, label }) => {
  if (id && CATEGORY_ICONS[id]) return CATEGORY_ICONS[id];
  if (id && /^(birre|birra)/.test(id)) return BeerBottle;
  const hay = normalize(`${label || ""} ${id || ""}`);
  const rule = FOOD_RULES.find(([re]) => re.test(hay));
  if (rule) return rule[1];
  return /birr/.test(hay) ? BeerBottle : Jar;
};

export function CategoryIcon({ id, label, className, weight = "thin" }) {
  // createElement e non <Icon />: l'icona è scelta a runtime e il React
  // Compiler leggerebbe un componente "creato durante il render"
  return createElement(categoryIcon({ id, label }), {
    className,
    weight,
    color: "currentColor",
    "aria-hidden": true,
  });
}

