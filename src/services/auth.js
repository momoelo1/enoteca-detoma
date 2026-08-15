// chiamate al backend Express di autenticazione.
// VITE_API_URL la imposta il deploy (vedi .github/workflows/deploy.yml) e la
// si può impostare a mano per puntare a un backend locale.
// Senza, si va sul backend di PRODUZIONE su Vercel: è quello che serve nel
// caso più frequente — aprire il sito in locale, da desktop o dal telefono in
// LAN, e vedere il catalogo vero senza avere niente acceso.
// Prima qui si deduceva `hostname:3001` dall'indirizzo di navigazione: comodo
// per il backend locale, ma senza quel backend acceso ogni elenco restava
// vuoto con un muro di ERR_CONNECTION_REFUSED.
// ATTENZIONE: così anche il pannello admin, in locale, scrive sul catalogo
// vero del negozio. Per lavorare sul backend locale metti VITE_API_URL in
// .env (vedi .env.example).
const API_URL =
  import.meta.env.VITE_API_URL || "https://detoma-backend.vercel.app";

// il cookie httpOnly basta in locale (stesso dominio), ma tra GitHub
// Pages e il backend è un cookie cross-site: Safari (ITP) e altri browser
// possono scartarlo anche con SameSite=None. Per questo il login
// restituisce anche il token in chiaro, che teniamo qui e mandiamo
// come header Authorization su ogni richiesta autenticata.
const TOKEN_KEY = "detoma_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
// esportata perché anche il cambio password riemette un token (il backend
// revoca le sessioni precedenti): vedi services/users.js
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// il token dura 8h e il backend non lo rinnova: prima o poi scade mentre
// il pannello admin è ancora aperto. Senza questo, il token morto restava
// in localStorage e ogni salvataggio falliva con un messaggio tecnico,
// senza che nessuno dicesse all'admin di riaccedere. Chi riceve un 401 su
// una richiesta autenticata chiama questa: butta il token, avvisa l'app
// (Login.jsx si mette in ascolto e torna al modulo di accesso) e
// restituisce la frase da mostrare.
export const SESSION_EXPIRED_EVENT = "detoma:sessione-scaduta";

export const unauthorizedMessage = () => {
  const hadToken = Boolean(getToken());
  clearToken();
  if (hadToken) window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  return hadToken
    ? "Sessione scaduta, accedi di nuovo."
    : "Devi accedere per continuare.";
};

// NB: qui il 401 NON passa da `unauthorizedMessage`. Questa parse serve
// solo a login/logout, dove un 401 vuol dire "credenziali sbagliate", non
// "sessione scaduta".
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
  await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
  });
  clearToken();
};
