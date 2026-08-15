// CRUD vini verso il backend. Le mutazioni viaggiano con il token JWT
// come header Authorization (vedi services/auth.js) — il cookie httpOnly
// da solo non basta perché tra GitHub Pages e il backend è cross-site e
// alcuni browser lo scartano.
import { authHeaders, unauthorizedMessage } from "./auth";

// senza VITE_API_URL si va sul backend di produzione (il perché sta in auth.js)
const API_URL =
  import.meta.env.VITE_API_URL || "https://detoma-backend.vercel.app";

async function parse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  // 401 = sessione scaduta: il token morto va buttato e l'app riportata
  // al login, vedi `unauthorizedMessage` in auth.js
  if (res.status === 401) throw new Error(unauthorizedMessage());
  if (!res.ok) throw new Error(data.error || "Errore di rete");
  return data;
}

// `limit`: quanti vini al massimo. Lo usa la vetrina della home, che ne mostra
// venti e non ha motivo di scaricare tutto il catalogo (534 vini, 153 KB) per
// buttarne il 96%. Le pagine che il catalogo intero ce l'hanno da mostrare —
// l'Enoteca, l'admin — lo chiamano senza e ricevono tutto come prima.
export const getWines = async (category, limit) => {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (limit) q.set("limit", limit);
  const query = q.toString() ? `?${q}` : "";
  const res = await fetch(`${API_URL}/api/wines${query}`);
  return parse(res);
};

// solo la selezione della casa (tab "Consigliati" dell'Enoteca). Una
// chiamata a sé invece di filtrare i vini già scaricati dalla pagina: così
// la tab non dipende dal precaricamento delle altre e resta riusabile
// altrove. Stessa funzione anche in services/beers.js e alimentari.js.
export const getWinesConsigliati = async () => {
  const res = await fetch(`${API_URL}/api/wines?consigliato=true`);
  return parse(res);
};

export const createWine = async (wine) => {
  const res = await fetch(`${API_URL}/api/wines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(wine),
  });
  return parse(res);
};

export const updateWine = async (id, wine) => {
  const res = await fetch(`${API_URL}/api/wines/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(wine),
  });
  return parse(res);
};

export const deleteWine = async (id) => {
  const res = await fetch(`${API_URL}/api/wines/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};

// rimuove solo la foto (Cloudinary + riferimento), non il vino
export const deleteWineImage = async (id) => {
  const res = await fetch(`${API_URL}/api/wines/${id}/image`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};
