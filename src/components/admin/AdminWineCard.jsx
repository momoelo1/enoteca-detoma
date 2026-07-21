import { useEffect, useState } from "react";
import { createWine, updateWine, deleteWine } from "../../services/wines";
import { REGION_GROUPS } from "../../data/data";

// stessi paesi esteri già riconosciuti dalla barra filtri pubblica
// (REGION_GROUPS li smista sotto "Mondo"): riusarli qui evita di
// scrivere un paese che poi il sito non sa raggruppare correttamente.
const FOREIGN_COUNTRIES = Object.keys(REGION_GROUPS);

// annate = righe ripetibili anno+prezzo (un vino può avere più annate,
// ognuna con il proprio prezzo). Se il vino non ha ancora un array
// `annate` ma ha i vecchi campi singoli anno/prezzo, si parte da lì.
const toAnnate = (wine) => {
  if (wine?.annate?.length) {
    return wine.annate.map((a) => ({ anno: a.anno || "", prezzo: a.prezzo ?? "" }));
  }
  if (wine?.anno || wine?.prezzo != null) {
    return [{ anno: wine.anno || "", prezzo: wine.prezzo ?? "" }];
  }
  return [{ anno: "", prezzo: "" }];
};

const toForm = (wine) => ({
  name: wine?.name || "",
  regione: wine?.regione || "",
  paese: wine?.paese || "",
  img: wine?.img || "",
  description: wine?.description || "",
  annate: toAnnate(wine),
});

const EMPTY_FORM = {
  name: "",
  regione: "",
  paese: "",
  img: "",
  description: "",
  annate: [{ anno: "", prezzo: "" }],
};

// Card autonoma: da sola sa mostrarsi, entrare in modifica, salvare
// (create o update a seconda che `wine` esista) ed eliminarsi. Ogni
// card è indipendente dalle altre — non c'è un form condiviso.
// La modifica avviene in un dialogo sopra la griglia, non trasformando
// la card sul posto: la griglia non si muove mai sotto le dita.
// lo champagne non ha un'annata da mostrare al cliente (niente vendemmia
// in etichetta come per gli altri vini): niente regione, niente anno —
// solo il prezzo, che può comunque avere più righe (es. formati diversi).
function AdminWineCard({ wine, categoryId, onCreated, onUpdated, onDeleted }) {
  const isNew = !wine;
  const isChampagne = categoryId === "champagne";
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(wine));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // "" = Italia (la regione ha senso solo per i vini italiani); un
  // paese estero riconosciuto mostra solo se stesso, senza regione
  const countrySelection = !form.paese
    ? "Italia"
    : FOREIGN_COUNTRIES.includes(form.paese)
      ? form.paese
      : "Altro";

  const handleCountrySelect = (e) => {
    const value = e.target.value;
    if (value === "Italia") {
      setForm((f) => ({ ...f, paese: "", regione: f.regione }));
    } else if (value === "Altro") {
      setForm((f) => ({
        ...f,
        paese: FOREIGN_COUNTRIES.includes(f.paese) ? "" : f.paese,
        regione: "",
      }));
    } else {
      setForm((f) => ({ ...f, paese: value, regione: "" }));
    }
  };

  const updateAnnata = (index, field, value) => {
    setForm((f) => ({
      ...f,
      annate: f.annate.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
  };
  const addAnnata = () =>
    setForm((f) => ({ ...f, annate: [...f.annate, { anno: "", prezzo: "" }] }));
  const removeAnnata = (index) =>
    setForm((f) => ({ ...f, annate: f.annate.filter((_, i) => i !== index) }));

  // legge il file scelto e lo tiene come data URL: nessun upload separato
  // da gestire, ma i documenti diventano più pesanti — va bene per ora,
  // un hosting immagini vero resta un passo futuro
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, img: reader.result }));
    reader.readAsDataURL(file);
  };

  const startEdit = () => {
    setForm(toForm(wine));
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(toForm(wine));
    setError("");
    setEditing(false);
  };

  // chiudi il dialogo con Esc, come il bottom sheet del sito pubblico
  useEffect(() => {
    if (!editing) return;
    const onKey = (e) => {
      if (e.key === "Escape") cancelEdit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const annate = form.annate
      .filter((a) => a.anno !== "" || a.prezzo !== "")
      .map((a) => ({ anno: a.anno, prezzo: Number(a.prezzo) || 0 }));

    const payload = Object.fromEntries(
      Object.entries({
        name: form.name,
        regione: form.regione,
        paese: form.paese,
        img: form.img,
        description: form.description,
      }).filter(([, v]) => v !== ""),
    );
    if (annate.length > 0) payload.annate = annate;

    try {
      if (isNew) {
        const created = await createWine({ ...payload, category: categoryId });
        onCreated(created);
        setForm(EMPTY_FORM);
        setEditing(false);
      } else {
        const updated = await updateWine(wine.id, payload);
        onUpdated(updated);
        setEditing(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Eliminare "${wine.name}"?`)) return;
    setError("");
    try {
      await deleteWine(wine.id);
      onDeleted(wine.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const editModal = editing && (
    <div className="admin-modal-backdrop" onClick={cancelEdit}>
      <form
        className="admin-modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="admin-modal-title">
          {isNew ? "Aggiungi vino" : `Modifica "${wine.name}"`}
        </h3>

        <div className="wine-admin-field">
          <label>Nome</label>
          <input type="text" value={form.name} onChange={handleChange("name")} required autoFocus />
        </div>
        {!isChampagne && (
          <div className="wine-admin-field">
            <label>Paese</label>
            <select value={countrySelection} onChange={handleCountrySelect}>
              <option value="Italia">Italia</option>
              {FOREIGN_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
              <option value="Altro">Altro (estero)</option>
            </select>
          </div>
        )}
        {!isChampagne && countrySelection === "Italia" && (
          <div className="wine-admin-field">
            <label>Regione</label>
            <input type="text" value={form.regione} onChange={handleChange("regione")} />
          </div>
        )}
        {!isChampagne && countrySelection === "Altro" && (
          <div className="wine-admin-field">
            <label>Nome del paese</label>
            <input
              type="text"
              placeholder="es. Belgio, Grecia..."
              value={form.paese}
              onChange={handleChange("paese")}
              autoFocus
            />
          </div>
        )}

        <div className="wine-admin-field">
          <label>{isChampagne ? "Prezzi" : "Annate e prezzi"}</label>
          <div className="admin-annate-list">
            {form.annate.map((row, i) => (
              <div className="admin-annata-row" key={i}>
                {!isChampagne && (
                  <div className="wine-admin-field">
                    <input
                      type="text"
                      placeholder="Anno"
                      value={row.anno}
                      onChange={(e) => updateAnnata(i, "anno", e.target.value)}
                    />
                  </div>
                )}
                <div className="wine-admin-field">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Prezzo €"
                    value={row.prezzo}
                    onChange={(e) => updateAnnata(i, "prezzo", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="admin-annata-remove"
                  onClick={() => removeAnnata(i)}
                  aria-label="Rimuovi riga"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="admin-annata-add" onClick={addAnnata}>
            {isChampagne ? "+ Aggiungi prezzo" : "+ Aggiungi annata"}
          </button>
        </div>

        <div className="wine-admin-field">
          <label>Immagine</label>
          <input type="file" accept="image/*" onChange={handleImageFile} />
          {form.img && <img src={form.img} alt="" className="admin-image-preview" />}
        </div>
        <div className="wine-admin-field">
          <label>Descrizione</label>
          <textarea rows={3} value={form.description} onChange={handleChange("description")} />
        </div>

        {error && <p className="wine-admin-error">{error}</p>}

        <div className="wine-admin-actions">
          <button type="submit" className="admin-save-btn" disabled={saving}>
            {saving ? "Salvo…" : isNew ? "Aggiungi" : "Salva"}
          </button>
          <button type="button" className="wine-admin-cancel" onClick={cancelEdit}>
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  // tessera "+ Aggiungi vino": tocco solo per aprire il dialogo vuoto
  if (isNew) {
    return (
      <li className="admin-wine-cell">
        <button
          type="button"
          className="admin-wine-card admin-wine-card--add"
          onClick={startEdit}
        >
          <span className="admin-wine-add-icon" aria-hidden="true">
            +
          </span>
          <span>Aggiungi vino</span>
        </button>
        {editModal}
      </li>
    );
  }

  // vista compatta: nome (mai compresso), meta, prezzo, azioni in fondo
  const meta = [wine.regione, wine.paese].filter(Boolean).join(" · ");
  const annate = wine.annate?.length
    ? wine.annate
    : wine.prezzo != null || wine.anno
      ? [{ anno: wine.anno, prezzo: wine.prezzo }]
      : [];
  const primary = annate[0];

  return (
    <li className="admin-wine-cell">
      <div className="admin-wine-card">
        <span className="admin-wine-name">{wine.name}</span>
        {meta && <span className="admin-wine-meta">{meta}</span>}
        {primary?.prezzo != null && (
          <span className="admin-wine-price">
            {primary.anno && <span className="admin-wine-price-year">{primary.anno} · </span>}
            € {primary.prezzo}
            {annate.length > 1 && (
              <span className="admin-wine-price-extra">+{annate.length - 1} annate</span>
            )}
          </span>
        )}
        {error && <p className="wine-admin-error">{error}</p>}
        <div className="admin-wine-icon-actions">
          <button
            type="button"
            className="admin-icon-btn"
            onClick={startEdit}
            aria-label="Modifica"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3z" />
            </svg>
          </button>
          <button
            type="button"
            className="admin-icon-btn admin-icon-btn--danger"
            onClick={handleDelete}
            aria-label="Elimina"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" />
            </svg>
          </button>
        </div>
      </div>
      {editModal}
    </li>
  );
}

export default AdminWineCard;
