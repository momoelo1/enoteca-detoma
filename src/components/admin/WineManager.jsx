import { useEffect, useState } from "react";
import { WINE_CATEGORIES } from "../../data/data";
import { getWines } from "../../services/wines";
import { normalize } from "../../utils/normalize";
import CategoryPicker from "./CategoryPicker";
import AdminFilterBar from "./AdminFilterBar";
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
  const [searchText, setSearchText] = useState("");
  const [regionFilter, setRegionFilter] = useState(null);

  // reset "durante il render" quando cambia categoria (pattern consigliato
  // da React per azzerare stato al cambio di prop, senza un giro di effect)
  const [loadedFor, setLoadedFor] = useState(null);
  if (categoryId !== loadedFor) {
    setLoadedFor(categoryId);
    setWines([]);
    setLoading(true);
    setError("");
    setSearchText("");
    setRegionFilter(null);
  }

  // guardia contro risposte in ordine sbagliato: se si cambia categoria
  // prima che la fetch precedente risponda (probabile su Vercel, dove i
  // tempi di risposta variano per i cold start), quella vecchia risposta
  // non deve sovrascrivere i dati della categoria corrente già arrivati
  useEffect(() => {
    let cancelled = false;
    getWines(categoryId)
      .then((data) => {
        if (!cancelled) setWines(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const category = WINE_CATEGORY_OPTIONS.find((c) => c.id === categoryId);

  const handleCreated = (wine) => setWines((ws) => [wine, ...ws]);
  const handleUpdated = (wine) =>
    setWines((ws) => ws.map((w) => (w.id === wine.id ? wine : w)));
  const handleDeleted = (id) => setWines((ws) => ws.filter((w) => w.id !== id));

  // stessa logica di filtro della pagina Enoteca pubblica: regione e
  // ricerca si sommano, la ricerca affina dentro la regione scelta
  const regionValues = [
    ...new Set(wines.map((w) => w.regione).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "it"));

  const query = normalize(searchText.trim());
  const visibleWines = wines
    .filter((w) => (regionFilter ? w.regione === regionFilter : true))
    .filter((w) => {
      if (!query) return true;
      const hay = normalize(
        [w.name, w.regione, w.paese, w.denominazione, w.uvaggio]
          .filter(Boolean)
          .join(" ")
      );
      return hay.includes(query);
    });

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
              {visibleWines.length} {visibleWines.length === 1 ? "vino" : "vini"}
            </span>
          )}
          {!loading && wines.length > 0 && (
            <AdminFilterBar
              query={searchText}
              onQueryChange={setSearchText}
              searchPlaceholder="Cerca per nome o regione…"
              canSearch={wines.length >= 6}
              filterValues={regionValues}
              filterLabel="Regioni"
              activeFilter={regionFilter}
              onFilterChange={setRegionFilter}
            />
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <p className="admin-loading">Caricamento…</p>
        ) : (
          <>
            <ul className="admin-product-grid">
              <AdminWineCard categoryId={categoryId} onCreated={handleCreated} />
              {visibleWines.map((w) => (
                <AdminWineCard
                  key={w.id}
                  wine={w}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </ul>
            {visibleWines.length === 0 && wines.length > 0 && (
              <p className="admin-loading">Nessun risultato. Prova a cambiare ricerca o regione.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default WineManager;
