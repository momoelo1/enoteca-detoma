import { flushSync } from "react-dom";

// Il "volo" della miniatura: toccando una card, la foto del prodotto si
// sposta e cresce fino al posto che occupa nel bottom sheet, invece di
// vedere il pannello coprire la lista. È la View Transitions API del
// browser — nessuna libreria.
//
// Il nome è lo stesso sui due estremi (miniatura della card e riquadro del
// pannello): è così che il browser capisce che sono la stessa cosa.
export const NOME_VOLO = "prodotto-volo";

// Il nome sta sul RIQUADRO (.product-thumb / .sheet-thumb), non sull'immagine
// dentro: il riquadro ha `overflow: hidden` e le foto sono ingrandite di
// scala per riempirlo, quindi una miniatura fotografata da sola volerebbe
// senza il suo ritaglio e si vedrebbe "scoppiare" alla partenza.

const disponibile = () =>
  typeof document !== "undefined" &&
  typeof document.startViewTransition === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// vola(riquadro, aggiorna): esegue `aggiorna` (il cambio di rotta che apre la
// scheda) dentro una transizione, facendo volare `riquadro` fino al suo
// gemello nel pannello. Dove la API non c'è, si apre e basta.
export function vola(riquadro, aggiorna) {
  if (!disponibile() || !riquadro) return aggiorna();

  riquadro.style.viewTransitionName = NOME_VOLO;
  // il pannello ha una sua animazione di salita (@keyframes sheet-up): mentre
  // vola la miniatura deve stare già al suo posto definitivo, altrimenti il
  // browser misura l'arrivo mentre il pannello è ancora fuori schermo e la
  // foto vola verso il basso, fuori dalla vista
  document.documentElement.classList.add("vt-attiva");

  const vt = document.startViewTransition(() => {
    // qui lo scatto "prima" è già stato preso: da adesso in poi il nome deve
    // stare SOLO sul pannello, o il browser trova due elementi con lo stesso
    // nome e rinuncia alla transizione
    riquadro.style.viewTransitionName = "";
    flushSync(aggiorna);
  });

  const pulisci = () => {
    riquadro.style.viewTransitionName = "";
    document.documentElement.classList.remove("vt-attiva");
  };
  // `finished` viene rifiutata se la transizione viene interrotta (due tocchi
  // ravvicinati): in tutt'e due i casi si ripulisce
  vt.finished.then(pulisci, pulisci);
}
