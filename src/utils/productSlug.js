// id del prodotto nell'URL: le schede remote (vini, birre, alimentari)
// hanno un id Mongo vero, quelle statiche non ancora popolate no —
// fallback sul nome. Sta qui e non in Enoteca.jsx perché la usa anche la
// pagina Alimentari, e un file di componenti che esporta anche funzioni
// rompe il Fast Refresh (regola react-refresh/only-export-components).
export const productSlug = (item) => item.id ?? encodeURIComponent(item.name);

// Il prodotto prima e quello dopo `slug` in `lista`: servono alla scheda
// aperta per passare al vicino (scorrimento sul telefono, frecce sul
// desktop). `lista` è quella che il cliente ha davanti — filtrata per regione
// e ricerca, se c'è un filtro — così "il prossimo" è la card che vede sotto.
// Ai due capi il vicino manca (null): la fila non ricomincia dall'inizio.
export const vicini = (lista, slug) => {
  const i = lista.findIndex((x) => productSlug(x) === slug);
  if (i < 0) return { prec: null, succ: null };
  return { prec: lista[i - 1] ?? null, succ: lista[i + 1] ?? null };
};
