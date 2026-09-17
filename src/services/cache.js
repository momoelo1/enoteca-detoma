// ============================================================================
// Memoria di sessione delle chiamate al catalogo.
//
// Il problema che risolve: Home, Enoteca e Alimentari scaricavano di nuovo
// tutto ogni volta che si tornava sopra con la barra in basso. Andare
// Enoteca → Home → Enoteca voleva dire riscaricare 534 vini, e in mezzo si
// rivedevano le schede vuote. I dati non cambiano mentre il cliente guarda
// il sito: una volta scaricati restano buoni.
//
// Vive in memoria e basta: niente localStorage, niente scadenze. Si svuota
// quando si RICARICA la pagina (F5, un link da fuori, riaprire il sito) —
// che è anche il modo in cui il negoziante vede le sue modifiche, oltre
// all'uscita dal pannello (vedi `dimentica` più sotto).
//
// A memoria si tiene la PROMESSA, non solo il risultato: due pagine che
// chiedono la stessa cosa insieme — la Home e l'Enoteca vogliono tutt'e due
// i vini consigliati — si attaccano alla stessa richiesta invece di farne
// due. Il valore risolto si tiene a parte perché serve leggerlo SUBITO, al
// primo render, senza passare da un `await`: è quello che evita il lampo di
// schede vuote al ritorno su una pagina già vista.
//
// NON lo usano i servizi (services/wines.js e compagnia restano chiamate
// nude) ma le tre pagine pubbliche, una per una. Così il pannello admin, che
// usa le stesse funzioni, continua a parlare col server a ogni giro e non
// rischia di modificare un catalogo vecchio.
// ============================================================================

const memoria = new Map();

// le chiavi stanno qui e non nelle pagine: la Home e l'Enoteca devono
// scrivere la STESSA per ritrovarsi in memoria a vicenda
export const CHIAVI = {
  viniConsigliati: "vini:consigliati",
  birreConsigliate: "birre:consigliate",
  alimentariConsigliati: "alimentari:consigliati",
  categoria: (id) => `categoria:${id}`, // una categoria dell'Enoteca (rossi, birre…)
  reparto: (id) => `reparto:${id}`, // un reparto degli Alimentari (gastronomia, dolceria)
};

// ricorda(chiave, prendi): la promessa di quel dato. La prima volta chiama
// `prendi`, dopo restituisce quella di prima senza toccare la rete.
export function ricorda(chiave, prendi) {
  const gia = memoria.get(chiave);
  if (gia) return gia.promessa;

  const voce = {};
  voce.promessa = prendi().then(
    (valore) => {
      voce.valore = valore;
      return valore;
    },
    (errore) => {
      // una richiesta fallita non si tiene: con la rete giù per un attimo
      // il catalogo resterebbe vuoto per tutta la sessione, e l'unico modo
      // di riprovare sarebbe ricaricare
      memoria.delete(chiave);
      throw errore;
    },
  );
  memoria.set(chiave, voce);
  return voce.promessa;
}

// gia(chiave): il dato se è già arrivato, `undefined` altrimenti. Sincrona,
// da usare per lo stato iniziale di un componente.
export const gia = (chiave) => memoria.get(chiave)?.valore;

// Butta tutto. La chiama il pannello admin quando lo si chiude (Login.jsx):
// lì dentro il catalogo si modifica, e senza questa riga il negoziante
// tornerebbe sul sito e vedrebbe ancora i prezzi di prima, convinto di non
// aver salvato.
export function dimentica() {
  memoria.clear();
}
