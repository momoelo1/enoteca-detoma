// CRUD vini verso il backend. Le mutazioni viaggiano con il token JWT
// come header Authorization (vedi services/auth.js) — il cookie httpOnly
// da solo non basta perché tra GitHub Pages e il backend è cross-site e
// alcuni browser lo scartano.
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

export const getWines = async (category) => {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_URL}/api/wines${query}`);
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
