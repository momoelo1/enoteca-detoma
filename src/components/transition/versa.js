// Il comando della versata, separato dal componente che la disegna
// (Versata.jsx): un file che esporta un componente E una funzione rompe il
// fast refresh di Vite.

// Durate: stanno qui e non nel CSS perché servono a tutt'e due (il CSS le
// riceve come variabili). Il tempo di salita è anche il ritardo che il
// cliente percepisce prima di vedere la pagina nuova, quindi resta corto:
// si copre lo schermo, si cambia rotta al coperto, si scopre.
export const SALITA = 260;
export const USCITA = 340;

// Un solo pannello per tutta l'app: lo registra <Versata /> al montaggio.
let apri = null;

export function registraVersata(fn) {
  apri = fn;
  return () => {
    if (apri === fn) apri = null;
  };
}

// versa(colore, vai): l'onda del colore della categoria sale a coprire lo
// schermo, `vai` (il cambio di rotta) parte a schermo coperto, poi l'onda
// esce verso l'alto scoprendo la pagina nuova già pronta.
// Senza pannello montato, senza colore o con le animazioni disattivate dal
// sistema si va e basta: la navigazione non deve MAI dipendere dall'effetto.
export function versa(colore, vai) {
  const fermo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!apri || !colore || fermo) return vai();
  apri(colore, vai);
}
