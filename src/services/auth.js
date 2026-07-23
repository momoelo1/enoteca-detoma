// chiamate al backend Express di autenticazione.
// VITE_API_URL è pensata per il deploy (backend su un altro host).
// In locale, se non impostata, si deduce dall'indirizzo con cui si è
// raggiunto il sito: così funziona sia da desktop (localhost) sia dal
// telefono in LAN (l'IP), senza dover cambiare .env per ognuno.
const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

// il cookie httpOnly basta in locale (stesso dominio), ma tra GitHub
// Pages e il backend è un cookie cross-site: Safari (ITP) e altri browser
// possono scartarlo anche con SameSite=None. Per questo il login
// restituisce anche il token in chiaro, che teniamo qui e mandiamo
// come header Authorization su ogni richiesta autenticata.
const TOKEN_KEY = "detoma_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
  const data = await parse(res);
  const { token, ...user } = data;
  if (token) setToken(token);
  return user;
};

export const getSession = async () => {
  if (!getToken()) return null;
  const res = await fetch(`${API_URL}/api/login`, {
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  return res.json();
};

export const logout = async () => {
  await fetch(`${API_URL}/api/login/logout`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
  });
  clearToken();
};
