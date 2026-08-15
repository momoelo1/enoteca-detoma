// CRUD alimentari (gastronomia + dolceria) verso il backend — stesso
// pattern di services/beers.js e services/wines.js.
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

// `limit`: vedi getWines in services/wines.js
export const getAlimentari = async (category, limit) => {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (limit) q.set("limit", limit);
  const query = q.toString() ? `?${q}` : "";
  const res = await fetch(`${API_URL}/api/alimentari${query}`);
  return parse(res);
};

// solo la selezione della casa — vedi getWinesConsigliati in services/wines.js
export const getAlimentariConsigliati = async () => {
  const res = await fetch(`${API_URL}/api/alimentari?consigliato=true`);
  return parse(res);
};

export const createAlimentare = async (item) => {
  const res = await fetch(`${API_URL}/api/alimentari`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(item),
  });
  return parse(res);
};

export const updateAlimentare = async (id, item) => {
  const res = await fetch(`${API_URL}/api/alimentari/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(item),
  });
  return parse(res);
};

export const deleteAlimentare = async (id) => {
  const res = await fetch(`${API_URL}/api/alimentari/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};

// rimuove solo la foto (Cloudinary + riferimento), non il prodotto
export const deleteAlimentareImage = async (id) => {
  const res = await fetch(`${API_URL}/api/alimentari/${id}/image`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};
