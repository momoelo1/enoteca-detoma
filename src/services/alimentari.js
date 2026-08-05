// CRUD alimentari (gastronomia + dolceria) verso il backend — stesso
// pattern di services/beers.js e services/wines.js.
import { authHeaders } from "./auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

async function parse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Errore di rete");
  return data;
}

export const getAlimentari = async (category) => {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_URL}/api/alimentari${query}`);
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
