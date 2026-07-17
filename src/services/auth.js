// chiamate al backend Express di autenticazione. `credentials: "include"`
// è indispensabile: è quello che fa viaggiare/accettare il cookie
// httpOnly con il JWT tra frontend e backend (domini diversi).
// VITE_API_URL è pensata per il deploy (backend su un altro host).
// In locale, se non impostata, si deduce dall'indirizzo con cui si è
// raggiunto il sito: così funziona sia da desktop (localhost) sia dal
// telefono in LAN (l'IP), senza dover cambiare .env per ognuno.
const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Errore di rete");
  return data;
}

export const isBackendConfigured = Boolean(API_URL);

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  return parse(res);
};

export const getSession = async () => {
  const res = await fetch(`${API_URL}/api/login`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
};

export const logout = async () => {
  await fetch(`${API_URL}/api/login/logout`, {
    method: "POST",
    credentials: "include",
  });
};
