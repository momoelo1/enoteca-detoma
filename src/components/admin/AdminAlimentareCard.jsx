import { useEffect, useState } from "react";
import {
  createAlimentare,
  updateAlimentare,
  deleteAlimentare,
  deleteAlimentareImage,
} from "../../services/alimentari";

// niente annate qui: il cibo ha un prezzo unico, come le birre.
// `formato` è un numero di grammi come per le birre lo è di centilitri
// (?? e non ||: uno 0 non deve diventare campo vuoto)
const toForm = (item) => ({
  name: item?.name || "",
  sottocategoria: item?.sottocategoria || "",
  tipo: item?.tipo || "",
  formato: item?.formato ?? "",
  prezzo: item?.prezzo ?? "",
  description: item?.description || "",
  img: item?.img || "",
});

const EMPTY_FORM = {
  name: "",
  sottocategoria: "",
  tipo: "",
  formato: "",
  prezzo: "",
  description: "",
  img: "",
};

function AdminAlimentareCard({
  item,
  categoryId,
  sottocategorie = [],
  onCreated,
  onUpdated,
  onDeleted,
}) {
  const isNew = !item;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(item));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // stesso pattern dei form vini/birre: FileReader -> data URL, il
  // backend la carica su Cloudinary al salvataggio
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, img: reader.result }));
    reader.readAsDataURL(file);
  };

  const startEdit = () => {
    setForm(toForm(item));
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(toForm(item));
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
        sottocategoria: form.sottocategoria.trim(),
        tipo: form.tipo,
        description: form.description,
        img: form.img,
      }).filter(([, v]) => v !== ""),
    );
    if (form.formato !== "") payload.formato = Number(form.formato);
    if (form.prezzo !== "") payload.prezzo = Number(form.prezzo);

    try {
      if (isNew) {
        const created = await createAlimentare({
          ...payload,
          category: categoryId,
        });
        onCreated(created);
        setForm(EMPTY_FORM);
        setEditing(false);
      } else {
        const updated = await updateAlimentare(item.id, payload);
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
    if (!window.confirm(`Eliminare "${item.name}"?`)) return;
    setError("");
    try {
      await deleteAlimentare(item.id);
      onDeleted(item.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // se la foto è già su Cloudinary la cancella davvero anche lato
  // storage; se è solo un'anteprima locale basta svuotare il form
  const handleDeleteImage = async () => {
    const isUnsavedPreview = form.img.startsWith("data:");
    if (isNew || isUnsavedPreview || !item?.img) {
      setForm((f) => ({ ...f, img: "" }));
      return;
    }
    if (!window.confirm("Eliminare l'immagine in modo permanente?")) return;
    setError("");
    try {
      const updated = await deleteAlimentareImage(item.id);
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
          {isNew ? "Aggiungi prodotto" : `Modifica "${item.name}"`}
        </h3>

        <div className="admin-field">
          <label>Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            required
            autoFocus
          />
        </div>
        <div className="admin-field">
          <label>Sottocategoria</label>
          {/* elenco aperto: si può scegliere un gruppo esistente o
              scriverne uno nuovo, che comparirà da solo nella pagina */}
          <input
            type="text"
            list="sottocategorie-esistenti"
            placeholder="es. Formaggi, Salumi, Biscotti"
            value={form.sottocategoria}
            onChange={handleChange("sottocategoria")}
          />
          <datalist id="sottocategorie-esistenti">
            {sottocategorie.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div className="admin-field">
          <label>Tipo</label>
          <input
            type="text"
            placeholder="es. Formaggio, Salume, Conserva"
            value={form.tipo}
            onChange={handleChange("tipo")}
          />
        </div>
        <div className="admin-field">
          <label>Formato (g)</label>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="250"
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
          <label>Descrizione</label>
          <textarea
            rows="3"
            value={form.description}
            onChange={handleChange("description")}
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
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" />
                </svg>
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
          <span>Aggiungi prodotto</span>
        </button>
        {editModal}
      </li>
    );
  }

  const meta = [
    item.sottocategoria,
    item.tipo,
    item.formato != null ? `${item.formato} g` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="admin-product-cell">
      <div className="admin-product-card">
        <span className="admin-product-name">{item.name}</span>
        {meta && <span className="admin-product-meta">{meta}</span>}
        {item.prezzo != null && (
          <span className="admin-product-price">€ {item.prezzo}</span>
        )}
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

export default AdminAlimentareCard;
