import { useEffect, useState } from "react";
import { DISTILLATI_CATEGORIES } from "../../data/data";
import { getDistillati } from "../../services/distillati";
import { normalize } from "../../utils/normalize";
import CategoryPicker from "./CategoryPicker";
import AdminFilterBar from "./AdminFilterBar";
import AdminDistillatoCard from "./AdminDistillatoCard";
import "./admin.css";

// Costruito sul pannello dei vini (WineManager.jsx): stesse categorie del sito
// pubblico (DISTILLATI_CATEGORIES in data.js), stessa griglia, stessa ricerca.
// L'unica differenza è il filtro, che va per PAESE e non per regione: un
// whisky si cerca per Scozia o Irlanda, non per regione italiana.
const DISTILLATI_CATEGORY_OPTIONS = DISTILLATI_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
  accent: c.accent,
}));

// il paese ripulito dagli spazi ai lati, come la regione in WineManager.jsx:
// "Scozia " e "Scozia" sarebbero due bottoni identici a vista
const paeseDi = (d) => d.paese?.trim();

function DistillatiManager() {
  const [categoryId, setCategoryId] = useState(DISTILLATI_CATEGORY_OPTIONS[0].id);
  const [distillati, setDistillati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [paeseFilter, setPaeseFilter] = useState(null);

  // reset "durante il render" al cambio di categoria (vedi WineManager.jsx)
  const [loadedFor, setLoadedFor] = useState(null);
  if (categoryId !== loadedFor) {
    setLoadedFor(categoryId);
    setDistillati([]);
    setLoading(true);
    setError("");
    setSearchText("");
    setPaeseFilter(null);
  }

  // guardia contro risposte in ordine sbagliato (vedi WineManager.jsx)
  useEffect(() => {
    let cancelled = false;
    getDistillati(categoryId)
      .then((data) => {
        if (!cancelled) setDistillati(data);
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

  const category = DISTILLATI_CATEGORY_OPTIONS.find((c) => c.id === categoryId);

  const handleCreated = (d) => setDistillati((ds) => [d, ...ds]);
  const handleUpdated = (d) =>
    setDistillati((ds) => ds.map((x) => (x.id === d.id ? d : x)));
  const handleDeleted = (id) => setDistillati((ds) => ds.filter((x) => x.id !== id));

  const paeseValues = [...new Set(distillati.map(paeseDi).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "it"),
  );

  const query = normalize(searchText.trim());
  const visibleDistillati = distillati
    .filter((d) => (paeseFilter ? paeseDi(d) === paeseFilter : true))
    .filter((d) => {
      if (!query) return true;
      const hay = normalize(
        [d.name, d.regione, d.paese].filter(Boolean).join(" ")
      );
      return hay.includes(query);
    });

  return (
    <div className="admin-layout">
      <CategoryPicker
        categories={DISTILLATI_CATEGORY_OPTIONS}
        activeId={categoryId}
        onSelect={setCategoryId}
      />

      <div className="admin-content">
        <div className="admin-content-header" style={{ "--accent": category?.accent }}>
          <h2 className="admin-content-title">{category?.label}</h2>
          {!loading && (
            <span className="admin-content-count">
              {visibleDistillati.length}{" "}
              {visibleDistillati.length === 1 ? "prodotto" : "prodotti"}
            </span>
          )}
          {!loading && distillati.length > 0 && (
            <AdminFilterBar
              query={searchText}
              onQueryChange={setSearchText}
              searchPlaceholder="Cerca per nome o paese…"
              canSearch={distillati.length >= 6}
              filterValues={paeseValues}
              filterLabel="Paesi"
              activeFilter={paeseFilter}
              onFilterChange={setPaeseFilter}
            />
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <p className="admin-loading">Caricamento…</p>
        ) : (
          <>
            <ul className="admin-product-grid">
              <AdminDistillatoCard
                categoryId={categoryId}
                paesiNoti={paeseValues}
                onCreated={handleCreated}
              />
              {visibleDistillati.map((d) => (
                <AdminDistillatoCard
                  key={d.id}
                  categoryId={categoryId}
                  paesiNoti={paeseValues}
                  distillato={d}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </ul>
            {visibleDistillati.length === 0 && distillati.length > 0 && (
              <p className="admin-loading">Nessun risultato. Prova a cambiare ricerca o paese.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DistillatiManager;
