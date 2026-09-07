// Inserisce una trasformazione in un URL Cloudinary già salvato sul prodotto.
// Su URL di altra provenienza (o valori vuoti) torna l'originale intatto.
const MARKER = "/image/upload/";

const withTransform = (url, transform) => {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com")) return url;
  const i = url.indexOf(MARKER);
  if (i === -1) return url;
  const at = i + MARKER.length;
  return url.slice(0, at) + transform + "/" + url.slice(at);
};

// Ritaglia il bordo uniforme intorno al prodotto.
//
// Serve agli alimentari: le foto arrivano dai fornitori con quantità di bianco
// intorno al prodotto molto diverse tra loro (stessa tela, soggetto grande
// metà), quindi dentro lo stesso riquadro un barattolo sembrava il doppio
// dell'altro. Tolto il bordo, il riquadro contiene il prodotto e basta: con
// `object-fit: contain` dentro una cornice quadrata tutte le foto risultano
// della stessa dimensione, qualunque sia la loro proporzione.
export const trimBorder = (url) => withTransform(url, "e_trim");

// Normalizza le foto delle bottiglie a una cornice unica.
//
// Stesso problema degli alimentari, con una tara in più: le foto dei vini
// arrivano su tele quadrate con quantità di vuoto molto diverse (misurato in
// produzione: una bottiglia occupava 89px su 500 di tela, un'altra 245 su
// 447), quindi dentro il riquadro una bottiglia si vedeva minuscola e
// un'altra piena. `e_trim` toglie il vuoto e porta tutte le bottiglie alla
// stessa altezza; `c_pad` le rimette poi dentro una tela SEMPRE 2:3, così
// anche il riquadro è identico per tutte, non solo il soggetto.
//
// Perché 2:3 e non 1:2. Il padding deve restare LATERALE: se il soggetto è
// più largo della proporzione scelta, `c_pad` aggiunge spazio sopra e sotto
// e la bottiglia si rimpicciolisce. Con 1:2 (0,50) succedeva davvero — la
// foto della bottiglia con la cassetta di legno (245×399, cioè 0,61) veniva
// impaginata 245×490 e rimpiccioliva. 2:3 (0,667) sta sopra a quel caso e la
// lascia a 266×399, piena in altezza. Se un giorno servisse una foto ancora
// più larga (più bottiglie affiancate), il numero da alzare è questo.
//
// `b_transparent` perché i PNG del negozio sono scontornati davvero
// (misurato: angoli ad alpha 0): riempire di bianco rimetterebbe il
// rettangolo bianco sulle card di vetro.
//
// Lo SCONTORNO non sta qui. Per un giorno (2026-09-07) questa catena ha
// avuto `e_background_removal` davanti, e funzionava sul grosso — ma l'AI di
// Cloudinary lascia una maschera morbida (una fascia larga ad alpha 201-254
// intorno alla bottiglia, più un alone bianco quasi trasparente) che sulle
// card si vedeva come un bordo chiaro, peggio su telefono e schermi grandi.
// Da allora le foto dei vini vengono scontornate E indurite al caricamento,
// nel backend (`utils/scontorno.js`), e quel che sta su Cloudinary è già
// pulito, in webp. Rimetterlo qui non farebbe niente sulle foto — misurato:
// su una foto già trasparente è un non-fare-niente al pixel — e brucerebbe
// un credito dell'add-on per ogni derivata.
export const bottleFrame = (url) =>
  withTransform(url, "e_trim/c_pad,ar_2:3,b_transparent");

// L'unico posto che sceglie la ricetta in base al tipo di prodotto: le due
// qui sopra dicono COME si trasforma una foto, questa dice QUALE serve.
// Birre e distillati restano intatti — le loro foto non sono state misurate.
//
// Lo chiamano le tre viste che mostrano una foto di prodotto (la card e la
// scheda in Enoteca.jsx, la fascia dei consigli in Home.jsx), e sta qui e non
// lì perché un file che esporta componenti non può esportare anche funzioni:
// il Fast Refresh smetterebbe di funzionare su tutto il file (regola
// react-refresh). Stessa ragione per cui formatPrezzo vive in utils/prezzo.js.
export const fotoProdotto = (item, type) => {
  if (!item.img) return item.img;
  if (type === "alimentari") return trimBorder(item.img);
  if (type === "vini") return bottleFrame(item.img);
  return item.img;
};
