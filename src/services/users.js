// aggiornamento dell'unico account admin (username/email/password).
// Autenticato via header Authorization (vedi services/auth.js) — il
// cookie httpOnly da solo non basta cross-site tra GitHub Pages e il backend.
import { authHeaders, unauthorizedMessage, setToken } from "./auth";

// senza VITE_API_URL si va sul backend di produzione (il perché sta in auth.js)
const API_URL =
  import.meta.env.VITE_API_URL || "https://detoma-backend.vercel.app";

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  // 401 = sessione scaduta: il token morto va buttato e l'app riportata
  // al login, vedi `unauthorizedMessage` in auth.js
  if (res.status === 401) throw new Error(unauthorizedMessage());
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
  const data = await parse(res);

  // se la password è cambiata il backend ha revocato tutte le sessioni,
  // compresa questa, e allega un token nuovo. Va messo via subito al posto
  // di quello ormai morto: senza, il primo salvataggio dopo il cambio
  // password risponderebbe 401 e riporterebbe al login. Stesso schema di
  // `login()`: il token non fa parte dei dati dell'utente e non esce di qui.
  const { token, ...user } = data;
  if (token) setToken(token);
  return user;
};
