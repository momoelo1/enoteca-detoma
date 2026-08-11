// CRUD birre verso il backend — stesso pattern di services/wines.js
// (endpoint separato, stessa forma di richieste/auth).
import { authHeaders, unauthorizedMessage } from "./auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

async function parse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  // 401 = sessione scaduta: il token morto va buttato e l'app riportata
  // al login, vedi `unauthorizedMessage` in auth.js
  if (res.status === 401) throw new Error(unauthorizedMessage());
  if (!res.ok) throw new Error(data.error || "Errore di rete");
  return data;
}

export const getBeers = async (producer) => {
  const query = producer ? `?producer=${encodeURIComponent(producer)}` : "";
  const res = await fetch(`${API_URL}/api/beers${query}`);
  return parse(res);
};

export const createBeer = async (beer) => {
  const res = await fetch(`${API_URL}/api/beers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(beer),
  });
  return parse(res);
};

export const updateBeer = async (id, beer) => {
  const res = await fetch(`${API_URL}/api/beers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(beer),
  });
  return parse(res);
};

export const deleteBeer = async (id) => {
  const res = await fetch(`${API_URL}/api/beers/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};

// rimuove solo la foto (Cloudinary + riferimento), non la birra
export const deleteBeerImage = async (id) => {
  const res = await fetch(`${API_URL}/api/beers/${id}/image`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};
