import { useEffect, useState } from "react";
import {
  isBackendConfigured,
  login,
  getSession,
  logout,
  SESSION_EXPIRED_EVENT,
} from "../../services/auth";
import WineManager from "../admin/WineManager";
import BeerManager from "../admin/BeerManager";
import AlimentariManager from "../admin/AlimentariManager";
import UserSettings from "../admin/UserSettings";
import "./login.css";

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
  const [adminView, setAdminView] = useState("wines"); // "wines" | "beers" | "alimentari" | "account"

  useEffect(() => {
    if (session) {
      document.body.classList.remove("home-no-scroll");
      return;
    }
    document.body.classList.add("home-no-scroll");
    return () => document.body.classList.remove("home-no-scroll");
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(() => setCardReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isBackendConfigured) return;
    getSession()
      .then(setSession)
      .finally(() => setCheckingSession(false));
  }, []);


  useEffect(() => {
    const onExpired = () => {
      setSession(null);
      setError("Sessione scaduta, accedi di nuovo.");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
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
    setUsername("");
    setPassword("");
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
              className={
                "admin-topbar-link" + (adminView === "wines" ? " admin-topbar-link--active" : "")
              }
              onClick={() => setAdminView("wines")}
            >
              Vini
            </button>
            <button
              type="button"
              className={
                "admin-topbar-link" + (adminView === "beers" ? " admin-topbar-link--active" : "")
              }
              onClick={() => setAdminView("beers")}
            >
              Birre
            </button>
            <button
              type="button"
              className={
                "admin-topbar-link" + (adminView === "alimentari" ? " admin-topbar-link--active" : "")
              }
              onClick={() => setAdminView("alimentari")}
            >
              Alimentari
            </button>
            <button
              type="button"
              className={
                "admin-topbar-link" + (adminView === "account" ? " admin-topbar-link--active" : "")
              }
              onClick={() => setAdminView("account")}
            >
              Account
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
        ) : adminView === "alimentari" ? (
          <AlimentariManager />
        ) : adminView === "beers" ? (
          <BeerManager />
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
