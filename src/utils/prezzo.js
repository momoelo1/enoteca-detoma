// Prezzo in formato italiano: "€ 32,00" — virgola, non punto.
// Sta qui e non in Enoteca.jsx perché lo usano sia le card del catalogo
// sia la fascia dei consigli in home, e un file che esporta componenti
// non può esportare anche funzioni (regola react-refresh: il Fast Refresh
// smetterebbe di funzionare su tutto il file).
export const formatPrezzo = (n) =>
  `€ ${n.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Il prezzo da mostrare per un prodotto: il suo, oppure — per i vini —
// quello della prima annata.
//
// Lo ZERO conta come assente e torna null. In catalogo è il valore che hanno
// le schede non ancora prezzate (misurato in produzione: 269 vini su 534), e
// "€ 0,00" dice una cosa falsa — meglio niente prezzo che un prezzo sbagliato.
// Gli alimentari spesso il campo non ce l'hanno proprio.
//
// Veniva da data/vetrina.js, il file dei segnaposto della home, cancellato
// quando la vetrina è passata ai consigliati veri: il conto del prezzo però
// serve ancora, e non aveva niente a che fare con i segnaposto.
export const prezzoProdotto = (item) => {
  const p = item.prezzo != null ? item.prezzo : item.annate?.[0]?.prezzo;
  return p > 0 ? p : null;
};
