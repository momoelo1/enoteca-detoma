import { esaDaHsl } from "./colore";

// Il colore della "versata": l'onda che copre lo schermo quando si entra in
// una categoria (vedi components/transition/Versata.jsx).
//
// Regola: DEVE essere diverso per ogni categoria del sito. È l'unica cosa che
// distingue una transizione dall'altra — due categorie che versano lo stesso
// colore fanno sembrare l'effetto un caricamento generico invece del colore
// di quello che si sta per guardare.

// Di norma è l'accento della categoria, quello già usato dai bordi e dalle
// card: così l'onda è del colore della scheda che si è appena toccata.
// Le eccezioni sono i casi in cui due categorie condividevano un accento in
// data.js — lì l'accento resta com'era (le card non cambiano) e a cambiare è
// solo il colore dell'onda.
const VERSATA_UNICA = {
  // Salento e Calabrau hanno tutt'e due accent #6e4419 in data.js
  salento: "#9c5f2a",
};

export const coloreVersata = (categoria) =>
  (categoria && (VERSATA_UNICA[categoria.id] || categoria.accent)) || null;

// I gruppi degli alimentari non hanno un accento proprio: in data.js il colore
// ce l'ha il reparto (Gastronomia, Dolceria), quindi tutti i suoi gruppi
// verserebbero la stessa identica tinta. Qui il colore si ricava dalla
// POSIZIONE del gruppo nell'elenco, spalmando la famiglia di tinte del reparto
// su quanti gruppi ci sono: ambre e olive per la gastronomia, rosa e prugna
// per la dolceria. Nessun gruppo ripete il colore di un altro, e restano tutti
// riconoscibili come "quel reparto lì".
// Nota: l'elenco dei gruppi lo costruisce l'admin dal pannello, quindi
// aggiungendone uno le tinte si ridistribuiscono. È voluto — l'alternativa
// (una tinta fissa per nome del gruppo) tornerebbe a ripetersi appena due
// nomi diversi finiscono sulla stessa casella.
const FAMIGLIE = {
  gastronomia: { da: 18, a: 58, s: 0.55, l: 0.45 },
  dolceria: { da: 322, a: 382, s: 0.38, l: 0.52 },
};

export function coloreGruppoAlimentari(repartoId, i, quanti) {
  const f = FAMIGLIE[repartoId];
  if (!f) return null;
  const k = quanti > 1 ? i / (quanti - 1) : 0.5;
  return esaDaHsl((f.da + (f.a - f.da) * k) % 360, f.s, f.l);
}
