// CRUD distillati verso il backend — stessa forma di services/wines.js,
// anche per il token mandato come header Authorization (vedi services/auth.js).
import { authHeaders, unauthorizedMessage } from "./auth";

// senza VITE_API_URL si va sul backend di produzione (il perché sta in auth.js)
const API_URL =
  import.meta.env.VITE_API_URL || "https://detoma-backend.vercel.app";

async function parse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error(unauthorizedMessage());
  if (!res.ok) throw new Error(data.error || "Errore di rete");
  return data;
}

// `limit`: vedi getWines in services/wines.js
export const getDistillati = async (category, limit) => {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (limit) q.set("limit", limit);
  const query = q.toString() ? `?${q}` : "";
  const res = await fetch(`${API_URL}/api/distillati${query}`);
  return parse(res);
};

// solo la selezione della casa — vedi getWinesConsigliati in services/wines.js
export const getDistillatiConsigliati = async () => {
  const res = await fetch(`${API_URL}/api/distillati?consigliato=true`);
  return parse(res);
};

export const createDistillato = async (distillato) => {
  const res = await fetch(`${API_URL}/api/distillati`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(distillato),
  });
  return parse(res);
};

export const updateDistillato = async (id, distillato) => {
  const res = await fetch(`${API_URL}/api/distillati/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(distillato),
  });
  return parse(res);
};

export const deleteDistillato = async (id) => {
  const res = await fetch(`${API_URL}/api/distillati/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};

// Rimuove le foto (da Cloudinary e dal documento), non il distillato.
// `indice`: quale togliere; omesso, le toglie tutte.
export const deleteDistillatoImage = async (id, indice) => {
  const query = indice === undefined ? "" : `?indice=${indice}`;
  const res = await fetch(`${API_URL}/api/distillati/${id}/image${query}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  return parse(res);
};
