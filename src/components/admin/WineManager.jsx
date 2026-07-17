import { useEffect, useState } from "react";
import { WINE_CATEGORIES } from "../../data/data";
import { getWines } from "../../services/wines";
import CategoryPicker from "./CategoryPicker";
import AdminWineCard from "./AdminWineCard";
import "./admin.css";

// riusa le stesse categorie/etichette/accenti già definiti per il sito
// pubblico (WINE_CATEGORIES in data.js) — nessuna lista duplicata
const WINE_CATEGORY_OPTIONS = WINE_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
  accent: c.accent,
}));

function WineManager() {
  const [categoryId, setCategoryId] = useState(WINE_CATEGORY_OPTIONS[0].id);
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // reset "durante il render" quando cambia categoria (pattern consigliato
  // da React per azzerare stato al cambio di prop, senza un giro di effect)
  const [loadedFor, setLoadedFor] = useState(null);
  if (categoryId !== loadedFor) {
    setLoadedFor(categoryId);
    setWines([]);
    setLoading(true);
    setError("");
  }

  useEffect(() => {
    getWines(categoryId)
      .then(setWines)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const category = WINE_CATEGORY_OPTIONS.find((c) => c.id === categoryId);

  const handleCreated = (wine) => setWines((ws) => [wine, ...ws]);
  const handleUpdated = (wine) =>
    setWines((ws) => ws.map((w) => (w.id === wine.id ? wine : w)));
  const handleDeleted = (id) => setWines((ws) => ws.filter((w) => w.id !== id));

  return (
    <div className="admin-layout">
      <CategoryPicker
        categories={WINE_CATEGORY_OPTIONS}
        activeId={categoryId}
        onSelect={setCategoryId}
      />

      <div className="admin-content">
        <div className="admin-content-header" style={{ "--accent": category?.accent }}>
          <h2 className="admin-content-title">{category?.label}</h2>
          {!loading && (
            <span className="admin-content-count">
              {wines.length} {wines.length === 1 ? "vino" : "vini"}
            </span>
          )}
        </div>

        {error && <p className="wine-admin-error">{error}</p>}

        {loading ? (
          <p className="admin-loading">Caricamento…</p>
        ) : (
          <ul className="admin-wine-grid">
            <AdminWineCard categoryId={categoryId} onCreated={handleCreated} />
            {wines.map((w) => (
              <AdminWineCard
                key={w.id}
                wine={w}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WineManager;
