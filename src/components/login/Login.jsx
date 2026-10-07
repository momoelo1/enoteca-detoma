import { useEffect, useState } from "react";
import {
  isBackendConfigured,
  login,
  getSession,
  logout,
  utenteSalvato,
  SESSION_EXPIRED_EVENT,
} from "../../services/auth";
import { dimentica } from "../../services/cache";
import { useRicordato, dimenticaAdmin } from "../../utils/memoriaAdmin";
import WineManager from "../admin/WineManager";
import BeerManager from "../admin/BeerManager";
import DistillatiManager from "../admin/DistillatiManager";
import AlimentariManager from "../admin/AlimentariManager";
import ArchivioManager from "../admin/ArchivioManager";
import ConsigliatiManager from "../admin/ConsigliatiManager";
import UserSettings from "../admin/UserSettings";
import "./login.css";

const VISTE_ADMIN = ["wines", "distillati", "beers", "alimentari", "consigliati", "archivio", "account"];

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
  // con un accesso recente ricordato il pannello si mostra subito, e la
  // sessione si conferma dietro le quinte (effect più sotto); senza, si
  // aspetta il backend come sempre. Vedi `utenteSalvato` in services/auth.js
  const [session, setSession] = useState(utenteSalvato);
  const [checkingSession, setCheckingSession] = useState(
    () => isBackendConfigured && !utenteSalvato(),
  );
  // la sezione aperta sopravvive al ricaricamento (utils/memoriaAdmin.js)
  const [adminView, setAdminView] = useRicordato("vista", "wines", (v) =>
    VISTE_ADMIN.includes(v),
  );

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

  // Uscendo dal pannello si butta quel che le pagine pubbliche tengono in
  // memoria (services/cache.js). Senza, il negoziante che cambia un prezzo e
  // torna sul sito senza ricaricare rivedrebbe il catalogo di prima e
  // penserebbe di non aver salvato. Non costa niente: al primo ingresso in
  // una pagina si riscarica, come faceva sempre prima di questa memoria.
  useEffect(() => {
    if (!session) return;
    return () => dimentica();
  }, [session]);

  useEffect(() => {
    if (!isBackendConfigured) return;
    // la conferma della sessione: col pannello già mostrato da `utenteSalvato`
    // gira dietro le quinte, e se il token non vale più riporta al modulo di
    // accesso. Se invece è la RETE a mancare (si rientra con la connessione
    // ancora assente), il pannello resta: un salvataggio con un token davvero
    // scaduto lo direbbe comunque, con il suo 401
    getSession()
      .then(setSession)
      .catch(() => {})
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
    // uscendo di proposito si riparte puliti: niente sezione né bozze
    // ricordate per il prossimo accesso
    dimenticaAdmin();
    setAdminView("wines");
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
          {/* due gruppi: a sinistra i prodotti in negozio, a destra le viste
              che li attraversano tutti — consigliati, archivio — più
              l'account e l'uscita */}
          <div className="admin-topbar-actions">
            <div className="admin-topbar-gruppo">
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
                  "admin-topbar-link" + (adminView === "distillati" ? " admin-topbar-link--active" : "")
                }
                onClick={() => setAdminView("distillati")}
              >
                Distillati
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
            </div>
            <div className="admin-topbar-gruppo admin-topbar-gruppo--servizio">
              <button
                type="button"
                className={
                  "admin-topbar-link" + (adminView === "consigliati" ? " admin-topbar-link--active" : "")
                }
                onClick={() => setAdminView("consigliati")}
              >
                Consigliati
              </button>
              <button
                type="button"
                className={
                  "admin-topbar-link" + (adminView === "archivio" ? " admin-topbar-link--active" : "")
                }
                onClick={() => setAdminView("archivio")}
              >
                Archivio
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
              {/* niente "Torna al sito" qui: l'intestazione del sito, con il
                  logo e la voce Home, è renderizzata fuori dalle Routes
                  (App.jsx) e resta visibile anche dentro il pannello */}
              <button type="button" className="admin-logout-btn" onClick={handleLogout}>
                Esci
              </button>
            </div>
          </div>
        </header>
        {adminView === "account" ? (
          <UserSettings session={session} onUpdated={setSession} />
        ) : adminView === "consigliati" ? (
          <ConsigliatiManager />
        ) : adminView === "archivio" ? (
          <ArchivioManager />
        ) : adminView === "alimentari" ? (
          <AlimentariManager />
        ) : adminView === "beers" ? (
          <BeerManager />
        ) : adminView === "distillati" ? (
          <DistillatiManager />
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
