// ---- SEGNAPOSTO della vetrina in home ----
//
// TEMPORANEO. Le due fasce della home dovrebbero mostrare la selezione della
// casa, cioè i prodotti che il negozio marca "Consigliato dall'enoteca" dal
// pannello admin. Oggi in produzione **non ce n'è nemmeno uno** (verificato
// sull'API il 2026-08-15: 0 vini e 0 alimentari con `consigliato: true`),
// quindi la fascia sarebbe vuota e la home non avrebbe niente da mostrare al
// posto delle foto di famiglia.
//
// Finché il negozio non fa la sua scelta, la vetrina si riempie da sola con
// venti prodotti veri presi dal catalogo. Non sono "i primi venti": sono
// scelti a giro fra le categorie, così la fascia dei vini non è venti rossi
// di fila e quella degli alimentari tocca tutti i reparti.
//
// PER TOGLIERE I SEGNAPOSTO: in Home.jsx sostituire getWines()/getAlimentari()
// con getWinesConsigliati()/getAlimentariConsigliati() e togliere la chiamata
// a scegliMisti(). Il resto della vetrina resta identico.
export const QUANTI_VETRINA = 20;

// Quanti prodotti CHIEDERE al backend per poi sceglierne QUANTI_VETRINA.
// Non tutto il catalogo: erano 153 KB per mostrarne venti, ed era l'attesa
// più lunga del sito (misurata il 2026-08-15: ~1s a caldo da desktop,
// oltre dieci a freddo su Vercel). Con ?limit=80 sono 25 KB.
//
// Ottanta e non venti perché scegliMisti() ha bisogno di PESCARE da più
// categorie: l'elenco arriva ordinato per nome, quindi più se ne chiedono e
// più categorie compaiono. Misurato sul catalogo vero: i primi 20 toccano 4
// categorie su 6, i primi 80 ne toccano 5. La sesta (champagne, pochi
// prodotti e tutti a fine alfabeto) resta fuori dai segnaposto — è il prezzo
// di non scaricare tutto, e sparisce da solo quando il negozio marcherà i
// suoi consigliati veri e questo file andrà in pensione.
export const BACINO_VETRINA = 80;

// il prezzo da mostrare: quello del prodotto o, per i vini, quello della
// prima annata. Zero conta come assente — in catalogo è il valore che hanno
// le schede non ancora prezzate, e "€ 0,00" in vetrina è peggio di niente
export const prezzoVetrina = (item) => {
  const p = item.prezzo != null ? item.prezzo : item.annate?.[0]?.prezzo;
  return p > 0 ? p : null;
};

// Quanto vale un prodotto in vetrina. Una foto conta più di un prezzo: le
// schede senza foto hanno comunque il segnaposto disegnato, quelle senza
// prezzo hanno un buco. Ma in catalogo le foto sono pochissime (3 vini su
// 534, 5 alimentari su 46) mentre senza prezzo sono la metà dei vini
// (269 su 534), quindi è il prezzo a fare la differenza sulla maggior parte
// delle schede.
const peso = (item) => (item.img ? 2 : 0) + (prezzoVetrina(item) ? 1 : 0);

// Prende `quanti` prodotti girando a turno fra i gruppi: uno per gruppo, poi
// il secondo di ognuno, e così via — così la fascia dei vini non è venti
// rossi di fila. Dentro ogni gruppo passano davanti i prodotti più completi.
export function scegliMisti(items, chiave, quanti = QUANTI_VETRINA) {
  const gruppi = new Map();
  for (const item of items) {
    const k = (item[chiave] || "").trim().toLowerCase();
    if (!gruppi.has(k)) gruppi.set(k, []);
    gruppi.get(k).push(item);
  }

  // `sort` è stabile: a parità di peso l'ordine resta quello del catalogo,
  // quindi la vetrina è sempre la stessa e non balla a ogni caricamento
  const code = [...gruppi.values()].map((g) =>
    [...g].sort((a, b) => peso(b) - peso(a))
  );

  const scelti = [];
  for (let giro = 0; scelti.length < quanti; giro++) {
    let presi = 0;
    for (const coda of code) {
      if (scelti.length >= quanti) break;
      if (coda[giro]) {
        scelti.push(coda[giro]);
        presi++;
      }
    }
    if (presi === 0) break; // catalogo finito prima di arrivare a `quanti`
  }
  return scelti;
}
