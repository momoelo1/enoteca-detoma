import { useEffect, useState } from "react";
import { isBackendConfigured, login, getSession, logout } from "../../services/auth";
import WineManager from "../admin/WineManager";
import UserSettings from "../admin/UserSettings";
import "./login.css";

// chiudendo la tastiera mobile Safari a volte lascia la pagina scrollata
// (per tenere il campo visibile sopra la tastiera) e lo zoom "incollato"
// anche con font-size 16px. Alla perdita del focus: si riporta la card
// al suo posto e si forza un reset dello zoom riscrivendo il meta
// viewport (il pizzico per zoomare resta disponibile ovunque sul sito).
const restoreLayout = () => {
  window.scrollTo(0, 0);

  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;
  const content = meta.getAttribute("content");
  meta.setAttribute("content", `${content}, maximum-scale=1`);
  requestAnimationFrame(() => meta.setAttribute("content", content));
};

function Login({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(isBackendConfigured);
  const [adminView, setAdminView] = useState("wines"); // "wines" | "account"

  // niente scroll di sfondo SOLO per il modulo di accesso (corto); una
  // volta dentro, il pannello vini può crescere e la pagina scorre normale
  useEffect(() => {
    if (session) {
      document.body.classList.remove("home-no-scroll");
      return;
    }
    document.body.classList.add("home-no-scroll");
    return () => document.body.classList.remove("home-no-scroll");
  }, [session]);

  // piccola animazione di comparsa della card, come nel riferimento
  useEffect(() => {
    const timer = setTimeout(() => setCardReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // resta collegato tra un refresh e l'altro
  useEffect(() => {
    if (!isBackendConfigured) return;
    getSession()
      .then(setSession)
      .finally(() => setCheckingSession(false));
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(username, password);
      setSession(user);
    } catch (err) {
      setError(err.message || "Credenziali non valide.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setSession(null);
  };

  if (checkingSession) return null;

  if (session) {
    return (
      <section className="admin-page">
        <header className="admin-topbar">
          <div className="admin-topbar-info">
            <span className="admin-topbar-eyebrow">Pannello di gestione</span>
            <span className="admin-topbar-user">{session.username}</span>
          </div>
          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-topbar-link"
              onClick={() =>
                setAdminView(adminView === "account" ? "wines" : "account")
              }
            >
              {adminView === "account" ? "← Gestione vini" : "Account"}
            </button>
            <button type="button" className="admin-topbar-link" onClick={onBack}>
              ← Torna al sito
            </button>
            <button type="button" className="admin-logout-btn" onClick={handleLogout}>
              Esci
            </button>
          </div>
        </header>
        {adminView === "account" ? (
          <UserSettings session={session} onUpdated={setSession} />
        ) : (
          <WineManager />
        )}
      </section>
    );
  }

  return (
    <section className="auth-view">
      <div className={`login-card${cardReady ? " card-ready" : ""}`}>
        <div className="login-header">
          <h1 className="login-heading">Accesso riservato</h1>
          <p className="login-sub">Area di gestione dell'enoteca</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              onBlur={restoreLayout}
              autoFocus
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                onBlur={restoreLayout}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              >
                {showPassword ? "nascondi" : "mostra"}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Accesso…" : "Accedi"}
          </button>
        </form>

        <p className="login-register">
          <button type="button" className="login-register-link" onClick={onBack}>
            ← Torna al sito
          </button>
        </p>
      </div>
    </section>
  );
}

export default Login;
