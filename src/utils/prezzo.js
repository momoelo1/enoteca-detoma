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

// Lo ZERO conta ovunque qui come prezzo ASSENTE, e torna null. In catalogo è
// il valore che hanno le schede non ancora prezzate (misurato in produzione
// il 2026-08-26: 56 vini su 533 — erano 269 ad agosto, il negozio ne ha
// prezzati parecchi da allora), e "€ 0,00" dice una cosa falsa: meglio niente
// prezzo che un prezzo sbagliato. Gli alimentari spesso il campo non ce
// l'hanno proprio.
//
// Questo conto veniva da data/vetrina.js, il file dei segnaposto della home,
// cancellato quando la vetrina è passata ai consigliati veri: serviva ancora,
// e non aveva niente a che fare con i segnaposto.

// I formati di un'annata: la bottiglia in cui quell'anno si vende, ognuna
// col suo prezzo (models/Wine.js). Un'annata vecchia, non ancora migrata,
// non ha `formati` ma il vecchio `prezzo` piatto: la si legge come un unico
// formato standard, così il sito continua a mostrare i prezzi già salvati
// anche prima che giri scripts/migraPrezziInFormati.js.
export const formatiAnnata = (annata) => {
  if (!annata) return [];
  if (annata.formati?.length) return annata.formati;
  return annata.prezzo != null ? [{ prezzo: annata.prezzo }] : [];
};

// Prezzo di riferimento di un'annata: il primo formato che ne ha uno.
// Non il minore: l'ordine delle righe lo decide il negozio nel pannello,
// e la prima è quella che vuole far vedere.
export const prezzoAnnata = (annata) => {
  const conPrezzo = formatiAnnata(annata).find((f) => f.prezzo > 0);
  return conPrezzo ? conPrezzo.prezzo : null;
};

// Il prezzo da mostrare per un prodotto intero: il suo, oppure — per i
// vini — quello della prima annata che ne ha uno. Si scorrono le annate
// perché la prima può essere del tutto senza prezzo (tutti i suoi formati
// slegati) e in quel caso mostrare "niente" mentre la seconda ha un prezzo
// sarebbe solo una mezza verità.
export const prezzoProdotto = (item) => {
  if (item.prezzo > 0) return item.prezzo;
  for (const annata of item.annate ?? []) {
    const p = prezzoAnnata(annata);
    if (p != null) return p;
  }
  return null;
};

// Annate e formati appiattiti in un elenco solo: ogni voce è una bottiglia
// che il cliente può scegliere nella scheda. Serve al selettore del bottom
// sheet, che tiene UN indice solo invece di una coppia (annata, formato) da
// mandare avanti allineata.
export const comboFormati = (annate) =>
  (annate ?? []).flatMap((a) =>
    formatiAnnata(a).map((f, iF) => ({
      chiave: `${a.anno ?? ""}-${iF}-${f.ml ?? ""}`,
      anno: a.anno,
      ml: f.ml,
      prezzo: f.prezzo > 0 ? f.prezzo : null, // lo zero è "prezzo assente"
    })),
  );

// Nomi commerciali: il negozio dice "Magnum", non "1500 ml" — nei nomi dei
// vini in produzione la parola compare 25 volte, il numero mai.
const NOMI_FORMATO = {
  375: "Mezza bottiglia",
  500: "Mezzo litro",
  750: "Bottiglia",
  1500: "Magnum",
  3000: "Jeroboam",
};

// I formati offerti dai menù del PANNELLO, in ml come nel database. Il sito
// pubblico continua a usare i nomi qui sopra (etichettaFormato): questi
// elenchi e l'etichetta in litri valgono solo per i dialoghi admin.
// Vino: bottiglia standard, magnum, jéroboam (doppio magnum)
export const FORMATI_VINO = [750, 1500, 3000];
export const FORMATI_DISTILLATI = [350, 500, 700, 1500];

// 750 → "0,75 L", 1500 → "1,5 L", 3000 → "3,0 L": almeno un decimale, come
// si legge in etichetta
export const etichettaLitri = (ml) =>
  `${(Number(ml) / 1000).toLocaleString("it-IT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  })} L`;

// Etichetta di un formato. `ml` vuoto vale come bottiglia standard.
// `sempre` forza l'etichetta anche sullo standard: serve quando l'annata ha
// più formati, dove lasciarne uno senza nome renderebbe la lista illeggibile.
export const etichettaFormato = (ml, { sempre = false } = {}) => {
  if (ml == null || ml === "") return sempre ? NOMI_FORMATO[750] : null;
  if (ml === 750 && !sempre) return null;
  return NOMI_FORMATO[ml] || `${ml} ml`;
};
