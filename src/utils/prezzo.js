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
