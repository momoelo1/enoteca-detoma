// aggiornamento dell'unico account admin (username/email/password).
// Autenticato via header Authorization (vedi services/auth.js) — il
// cookie httpOnly da solo non basta cross-site tra GitHub Pages e Render.
import { authHeaders } from "./auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Errore di rete");
  return data;
}

export const updateUser = async (id, fields) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(fields),
  });
  return parse(res);
};
