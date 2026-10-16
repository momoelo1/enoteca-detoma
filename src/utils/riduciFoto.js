// Rimpicciolisce una foto nel browser PRIMA di spedirla al backend.
//
// Le foto partono dal pannello come data URL dentro il JSON del salvataggio
// (vedi i quattro form in components/admin). Una foto da fotocamera arriva a
// 2224x4000 e 3-6 MB, in base64 un terzo in più: Vercel rifiuta ogni richiesta
// oltre i 4,5 MB, e la risposta arriva senza intestazioni CORS, quindi nel
// pannello si leggeva solo "Failed to fetch" (misurato il 2026-10-05). Due foto
// insieme bastavano.
//
// Il sito non mostra mai una bottiglia più alta di 700 pixel (ALTEZZA_MAX in
// utils/cloudinary.js): 1600 sul lato lungo sono più del doppio, quindi qui
// non si perde niente che poi si veda, e allo scontorno restano pixel in
// abbondanza. Una foto da 4 MB esce intorno ai 300 KB.
//
// Tre regole, tutte per non fare danni:
//
// - una foto già piccola (lato lungo entro `LATO_MAX`) parte COM'È, senza
//   passare dal canvas: le bottiglie scontornate a mano dal negozio sono webp
//   da pochi KB, e ricodificarle le peggiorerebbe soltanto;
// - una foto con della trasparenza resta trasparente: esce in webp, mai in
//   JPEG. Il JPEG non ha il canale alpha, e una bottiglia già scontornata
//   tornerebbe su fondo nero — con il backend che la manderebbe a scontornare
//   di nuovo, spendendo un credito di Cloudinary (utils/cloudinary.js lato
//   backend). Dove il browser non sa scrivere webp il canvas ripiega da solo
//   sul PNG: più pesante, ma con la trasparenza intatta;
// - se il risultato non è più leggero dell'originale, o se il browser non
//   riesce a leggere il file, si manda l'originale: come si è sempre fatto.
const LATO_MAX = 1600;
const QUALITA_JPEG = 0.85;
const QUALITA_WEBP = 0.9;

const comeDataUrl = (blob) =>
  new Promise((risolvi, rifiuta) => {
    const reader = new FileReader();
    reader.onload = () => risolvi(reader.result);
    reader.onerror = () => rifiuta(reader.error);
    reader.readAsDataURL(blob);
  });

// un <img> e non createImageBitmap: è l'<img> che raddrizza da solo le foto
// del telefono scattate in verticale (l'orientamento sta nei dati EXIF)
const carica = (file) =>
  new Promise((risolvi, rifiuta) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      risolvi(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rifiuta(new Error("immagine non leggibile"));
    };
    img.src = url;
  });

const haTrasparenza = (ctx, w, h) => {
  const { data } = ctx.getImageData(0, 0, w, h);
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
  return false;
};

const comeBlob = (canvas, tipo, qualita) =>
  new Promise((risolvi) => canvas.toBlob(risolvi, tipo, qualita));

// leggiFoto(file): la data URL da mettere nel form, rimpicciolita se serve.
export async function leggiFoto(file) {
  try {
    const img = await carica(file);
    const lato = Math.max(img.naturalWidth, img.naturalHeight);
    if (lato <= LATO_MAX) return await comeDataUrl(file);

    const scala = LATO_MAX / lato;
    const w = Math.round(img.naturalWidth * scala);
    const h = Math.round(img.naturalHeight * scala);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    const blob = haTrasparenza(ctx, w, h)
      ? await comeBlob(canvas, "image/webp", QUALITA_WEBP)
      : await comeBlob(canvas, "image/jpeg", QUALITA_JPEG);
    if (!blob || blob.size >= file.size) return await comeDataUrl(file);
    return await comeDataUrl(blob);
  } catch {
    return comeDataUrl(file);
  }
}
