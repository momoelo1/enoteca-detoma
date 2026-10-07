// ============================================================================
// Memoria del pannello admin, per sopravvivere a un ricaricamento.
//
// Su iPhone Safari chiude da solo una scheda rimasta in background qualche
// secondo (per liberare memoria) e quando ci si torna la RICARICA da capo.
// Senza questo file il negoziante ritrovava il pannello sui Vini Rossi, con
// il modulo che stava compilando sparito.
//
// Due cose sole:
// - dove si era: la sezione (Vini, Consigliati…) e la categoria aperta in
//   ognuna — `useRicordato`;
// - il modulo di modifica aperto, con quello che c'era scritto — le bozze.
//
// localStorage e non sessionStorage: è l'unico che di sicuro sopravvive a
// Safari che chiude la scheda. Ogni accesso sta in un try/catch: in
// navigazione privata o con la memoria piena il pannello deve funzionare lo
// stesso, solo senza ricordare.
// ============================================================================

import { useEffect, useState } from "react";

const PREFISSO = "detoma_admin_";
const CHIAVE_BOZZA = `${PREFISSO}bozza`;

// una bozza più vecchia di così non si riapre: a distanza di mezza giornata
// un modulo che salta fuori da solo sorprende più di quanto aiuti
const VALIDITA_BOZZA = 12 * 60 * 60 * 1000;

const leggi = (chiave) => {
  try {
    return JSON.parse(localStorage.getItem(chiave));
  } catch {
    return null;
  }
};

const scrivi = (chiave, valore) => {
  try {
    localStorage.setItem(chiave, JSON.stringify(valore));
  } catch {
    /* memoria piena o negata: si va avanti senza ricordare */
  }
};

// Come useState, ma il valore sopravvive al ricaricamento. `valido` scarta
// ciò che non ha più senso — una categoria tolta da data.js, per dire —
// e in quel caso si riparte da `iniziale`.
export function useRicordato(nome, iniziale, valido = () => true) {
  const chiave = PREFISSO + nome;
  const [valore, setValore] = useState(() => {
    const salvato = leggi(chiave);
    return salvato != null && valido(salvato) ? salvato : iniziale;
  });
  useEffect(() => {
    scrivi(chiave, valore);
  }, [chiave, valore]);
  return [valore, setValore];
}

// Le foto appena scelte non entrano nella bozza: sono data URL da megabyte,
// che a ogni tasto premuto andrebbero riscritti tutti, e che riempirebbero i
// 5 MB della memoria con una foto o due. Restano quelle già caricate (gli
// URL di Cloudinary); quelle nuove, dopo un ricaricamento, vanno riscelte.
const senzaFotoNuove = (form) => {
  if (!form || !("img" in form)) return form;
  const nuova = (src) => typeof src === "string" && src.startsWith("data:");
  return {
    ...form,
    img: Array.isArray(form.img)
      ? form.img.filter((src) => !nuova(src))
      : nuova(form.img)
        ? ""
        : form.img,
  };
};

// Una bozza sola alla volta: il pannello ha un solo modulo aperto per volta.
// `tipo` è il tipo di prodotto ("vino", "birra"…), `chiave` l'id del
// prodotto o "nuovo:<categoria>" per la tessera "Aggiungi".
export const leggiBozza = (tipo, chiave) => {
  const b = leggi(CHIAVE_BOZZA);
  if (!b || b.tipo !== tipo || b.chiave !== chiave) return null;
  if (Date.now() - b.quando > VALIDITA_BOZZA) return null;
  return b.dati;
};

export const salvaBozza = (tipo, chiave, dati) =>
  scrivi(CHIAVE_BOZZA, {
    tipo,
    chiave,
    quando: Date.now(),
    dati: { ...dati, form: senzaFotoNuove(dati.form) },
  });

// butta la bozza solo se è proprio quella: chiudere un modulo non deve
// cancellare la bozza di un altro
export const buttaBozza = (tipo, chiave) => {
  const b = leggi(CHIAVE_BOZZA);
  if (b?.tipo !== tipo || b?.chiave !== chiave) return;
  try {
    localStorage.removeItem(CHIAVE_BOZZA);
  } catch {
    /* niente da fare */
  }
};

// All'uscita (bottone Esci) si dimentica tutto: il prossimo accesso riparte
// pulito. NON alla sessione scaduta: lì si rientra e si ritrova il modulo.
export const dimenticaAdmin = () => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFISSO) && k !== `${PREFISSO}token` && k !== `${PREFISSO}utente`)
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* niente da fare */
  }
};
