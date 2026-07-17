import { useState } from "react";
import { updateUser } from "../../services/users";
import "./admin.css";

// Pagina account dell'unico admin: cambia username, email e/o password.
// Vengono inviati solo i campi effettivamente modificati; il backend
// (PUT /api/users/:id) aggiorna solo ciò che riceve.
function UserSettings({ session, onUpdated }) {
  const [username, setUsername] = useState(session.username);
  const [email, setEmail] = useState(session.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {};
    if (username && username !== session.username) payload.username = username;
    if (email && email !== session.email) payload.email = email;
    if (password) payload.password = password;

    if (Object.keys(payload).length === 0) {
      setError("Nessuna modifica da salvare.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUser(session.id, payload);
      onUpdated(updated); // aggiorna subito il nome nella barra superiore
      setPassword("");
      setSuccess("Dati aggiornati.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-account">
      <form className="admin-account-form" onSubmit={handleSubmit}>
        <div className="wine-admin-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="wine-admin-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="wine-admin-field">
          <label>Nuova password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Lascia vuoto per non cambiarla"
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
          <p className="admin-account-hint">
            Minimo 8 caratteri, con maiuscola, minuscola, numero e carattere
            speciale.
          </p>
        </div>

        {error && <p className="wine-admin-error">{error}</p>}
        {success && <p className="wine-admin-success">{success}</p>}

        <div className="wine-admin-actions">
          <button type="submit" className="admin-save-btn" disabled={saving}>
            {saving ? "Salvo…" : "Salva modifiche"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserSettings;
