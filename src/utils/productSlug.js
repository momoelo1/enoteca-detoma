// id del prodotto nell'URL: le schede remote (vini, birre, alimentari)
// hanno un id Mongo vero, quelle statiche non ancora popolate no —
// fallback sul nome. Sta qui e non in Enoteca.jsx perché la usa anche la
// pagina Alimentari, e un file di componenti che esporta anche funzioni
// rompe il Fast Refresh (regola react-refresh/only-export-components).
export const productSlug = (item) => item.id ?? encodeURIComponent(item.name);
