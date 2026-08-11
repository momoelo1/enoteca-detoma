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
