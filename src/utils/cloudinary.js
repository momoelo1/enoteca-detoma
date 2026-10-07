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

// Formato e qualità li sceglie Cloudinary alla consegna, in coda a ogni ricetta.
//
// Senza, la catena non tocca né il formato né la qualità: quel che è stato
// caricato è quel che scarica il visitatore, a piena risoluzione. Le foto dei
// vini passano dallo scontorno e tornano in webp da sole (backend,
// utils/scontorno.js), ma quelle che arrivano GIÀ scontornate saltano il
// motore e restano com'erano — un PNG resta un PNG (8 su 144 in produzione il
// 2026-09-18). Birre e alimentari non convertono mai: `scontorna: true` è solo
// sui vini.
//
// Misurato il 2026-09-18 sulle foto vere del negozio, confrontando pixel per
// pixel la consegna di oggi con questa:
//  - i 135 webp già in archivio tornano IDENTICI, byte per byte (RMSE 0,00,
//    zero pixel diversi, differenza di alpha 0): Cloudinary vede che il
//    formato è già quello e restituisce il file com'è. Sulla stragrande
//    maggioranza del catalogo questa riga non fa niente, ed è la ragione per
//    cui si può mettere senza rischiare le foto che ci sono;
//  - gli 8 PNG scendono da 159 KB a 19,7 KB (-88%) con la MASCHERA INTATTA
//    (differenza di alpha: 0, nessun alone nuovo). Il colore si sposta di 1,69
//    su 255, sotto il visibile in un riquadro alto 90px.
//
// Il tetto alle dimensioni NON sta qui ma nella ricetta delle bottiglie
// (`ALTEZZA_MAX` più sotto): qui niente `w_`, perché gli alimentari non sono
// stati misurati.
const CONSEGNA = "f_auto,q_auto";

// Altezza massima delle foto dei vini consegnate al sito.
//
// Le foto in archivio sono cresciute: misurato il 2026-10-05 su rossi e
// bianchi, 285 foto su 349 superavano i 700px e le più grandi arrivavano a
// 3555px (foto da fotocamera, 2224x4000). Su iPhone la card le mostra alte
// 108 punti (324px a DPR 3) e la scheda 208 punti (624px); sul desktop
// 1440x900 la scheda 268 punti (536px a DPR 2). 700 copre tutte e tre.
//
// Il peso che conta qui non è tanto quello scaricato quanto la MEMORIA: per
// disegnarla il telefono decomprime la foto alla sua misura piena, e una
// bottiglia alta 3555px occupa ~32 MB anche se il file ne pesa 30 KB. Scorrere
// tutti i rossi ne decomprimeva fino a ~710 MB (stima), ~240 col tetto — ed è
// la memoria che spinge Safari a chiudere e ricaricare la scheda.
// Scaricato: le 20 foto più pesanti da 2814 KB a 429 KB.
//
// `c_limit` e non `h_` da solo: non INGRANDISCE mai le foto già più basse (64
// su 349), che restano identiche a prima. Gli originali su Cloudinary non si
// toccano: cambia solo la copia consegnata.
const ALTEZZA_MAX = 700;

// Ritaglia il bordo uniforme intorno al prodotto.
//
// Serve agli alimentari: le foto arrivano dai fornitori con quantità di bianco
// intorno al prodotto molto diverse tra loro (stessa tela, soggetto grande
// metà), quindi dentro lo stesso riquadro un barattolo sembrava il doppio
// dell'altro. Tolto il bordo, il riquadro contiene il prodotto e basta: con
// `object-fit: contain` dentro una cornice quadrata tutte le foto risultano
// della stessa dimensione, qualunque sia la loro proporzione.
export const trimBorder = (url) => withTransform(url, `e_trim/${CONSEGNA}`);

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
//
// Il tetto di altezza va DOPO `c_pad`: limita la tela 2:3 finita, quindi la
// proporzione della cornice resta quella e tutte le bottiglie restano alla
// stessa altezza dentro il riquadro.
export const bottleFrame = (url) =>
  withTransform(
    url,
    `e_trim/c_pad,ar_2:3,b_transparent/c_limit,h_${ALTEZZA_MAX}/${CONSEGNA}`,
  );

// Le foto di un prodotto, come elenco pulito.
//
// `img` sui vini è un array dal 2026-09-09 (backend: models/Wine.js), ma
// l'archivio non è stato migrato e non ha bisogno di esserlo: Mongoose avvolge
// da sé la vecchia stringa singola, quindi dall'API può arrivare l'una o
// l'altra forma. Birre e alimentari hanno ancora la stringa e basta.
//
// Il `filter(Boolean)` NON è prudenza generica, serve a un caso reale: una
// foto cancellata lasciava in archivio la stringa vuota, che riletta da un
// campo array torna [""] — lungo 1, e in JS pure truthy. Senza il filtro quei
// prodotti (2 in produzione al 2026-09-09) mostrerebbero una <img> rotta
// invece del segnaposto disegnato.
export const elencoFoto = (item) =>
  (Array.isArray(item?.img) ? item.img : [item?.img]).filter(Boolean);

// L'unico posto che sceglie la ricetta in base al tipo di prodotto: le due
// qui sopra dicono COME si trasforma una foto, questa dice QUALE serve.
// Birre e distillati restano intatti — le loro foto non sono state misurate.
const ricetta = (url, type) => {
  if (type === "alimentari") return trimBorder(url);
  if (type === "vini") return bottleFrame(url);
  return url;
};

// Tutte le foto già trasformate. La usa la scheda prodotto, che le fa scorrere.
//
// Sta qui e non in Enoteca.jsx perché un file che esporta componenti non può
// esportare anche funzioni: il Fast Refresh smetterebbe di funzionare su tutto
// il file (regola react-refresh). Stessa ragione per cui formatPrezzo vive in
// utils/prezzo.js.
export const fotoProdotti = (item, type) =>
  elencoFoto(item).map((url) => ricetta(url, type));

// La PRIMA foto: quella che rappresenta il prodotto dove ce n'è posto per una
// sola — la card del catalogo e la fascia dei consigli in home.
// Torna `undefined` se non ce ne sono: chi chiama disegna il segnaposto.
export const fotoProdotto = (item, type) => fotoProdotti(item, type)[0];
