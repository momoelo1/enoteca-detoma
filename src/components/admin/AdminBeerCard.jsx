import { useEffect, useState } from "react";
import { createBeer, updateBeer, deleteBeer, deleteBeerImage } from "../../services/beers";

// niente annate/vintage qui: le birre hanno un prezzo unico, non un
// array anno×prezzo come i vini (schema Beer non ha `annate`)
const toForm = (beer) => ({
  name: beer?.name || "",
  stile: beer?.stile || "",
  gradazione: beer?.gradazione || "",
  formato: beer?.formato ?? "",
  prezzo: beer?.prezzo ?? "",
  img: beer?.img || "",
});

const EMPTY_FORM = {
  name: "",
  stile: "",
  gradazione: "",
  formato: "",
  prezzo: "",
  img: "",
};

function AdminBeerCard({ beer, producerId, onCreated, onUpdated, onDeleted }) {
  const isNew = !beer;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(beer));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // stesso pattern del form vini: FileReader -> data URL, il backend
  // si occupa di caricarla su Cloudinary al salvataggio
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, img: reader.result }));
    reader.readAsDataURL(file);
  };

  const startEdit = () => {
    setForm(toForm(beer));
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(toForm(beer));
    setError("");
    setEditing(false);
  };

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

    const payload = Object.fromEntries(
      Object.entries({
        name: form.name,
        stile: form.stile,
        gradazione: form.gradazione,
        img: form.img,
      }).filter(([, v]) => v !== ""),
    );
    if (form.formato !== "") payload.formato = Number(form.formato);
    if (form.prezzo !== "") payload.prezzo = Number(form.prezzo);

    try {
      if (isNew) {
        const created = await createBeer({ ...payload, producer: producerId });
        onCreated(created);
        setForm(EMPTY_FORM);
        setEditing(false);
      } else {
        const updated = await updateBeer(beer.id, payload);
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
    if (!window.confirm(`Eliminare "${beer.name}"?`)) return;
    setError("");
    try {
      await deleteBeer(beer.id);
      onDeleted(beer.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // rimuove la foto: se è già caricata su Cloudinary (birra salvata) la
  // cancella davvero anche lato storage, non solo il riferimento; se è
  // solo un'anteprima locale non ancora salvata basta svuotare il form
  const handleDeleteImage = async () => {
    const isUnsavedPreview = form.img.startsWith("data:");
    if (isNew || isUnsavedPreview || !beer?.img) {
      setForm((f) => ({ ...f, img: "" }));
      return;
    }
    if (!window.confirm("Eliminare l'immagine in modo permanente?")) return;
    setError("");
    try {
      const updated = await deleteBeerImage(beer.id);
      onUpdated(updated);
      setForm((f) => ({ ...f, img: "" }));
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
          {isNew ? "Aggiungi birra" : `Modifica "${beer.name}"`}
        </h3>

        <div className="admin-field">
          <label>Nome</label>
          <input type="text" value={form.name} onChange={handleChange("name")} required autoFocus />
        </div>
        <div className="admin-field">
          <label>Stile</label>
          <input type="text" value={form.stile} onChange={handleChange("stile")} />
        </div>
        <div className="admin-field">
          <label>Gradazione</label>
          <input
            type="text"
            value={form.gradazione}
            onChange={handleChange("gradazione")}
          />
        </div>
        <div className="admin-field">
          <label>Formato (cl)</label>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="33"
            value={form.formato}
            onChange={handleChange("formato")}
          />
        </div>
        <div className="admin-field">
          <label>Prezzo</label>
          <input
            type="number"
            step="0.01"
            value={form.prezzo}
            onChange={handleChange("prezzo")}
          />
        </div>
        <div className="admin-field">
          <label>Immagine</label>
          <input type="file" accept="image/*" onChange={handleImageFile} />
          {form.img && (
            <div className="admin-image-preview-wrap">
              <img src={form.img} alt="" className="admin-image-preview" />
              <button
                type="button"
                className="admin-image-remove"
                onClick={handleDeleteImage}
                aria-label="Rimuovi immagine"
                title="Rimuovi immagine"
              >
                🗑
              </button>
            </div>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="admin-save-btn" disabled={saving}>
            {saving ? "Salvo…" : isNew ? "Aggiungi" : "Salva"}
          </button>
          <button type="button" className="admin-cancel" onClick={cancelEdit}>
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  if (isNew) {
    return (
      <li className="admin-product-cell">
        <button
          type="button"
          className="admin-product-card admin-product-card--add"
          onClick={startEdit}
        >
          <span className="admin-product-add-icon" aria-hidden="true">
            +
          </span>
          <span>Aggiungi birra</span>
        </button>
        {editModal}
      </li>
    );
  }

  const meta = [beer.stile, beer.gradazione, beer.formato != null ? `${beer.formato} cl` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="admin-product-cell">
      <div className="admin-product-card">
        <span className="admin-product-name">{beer.name}</span>
        {meta && <span className="admin-product-meta">{meta}</span>}
        {beer.prezzo != null && <span className="admin-product-price">€ {beer.prezzo}</span>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-product-icon-actions">
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

export default AdminBeerCard;
