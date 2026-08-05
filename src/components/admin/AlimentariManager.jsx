import { useEffect, useState } from "react";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import { getAlimentari } from "../../services/alimentari";
import { normalize } from "../../utils/normalize";
import CategoryPicker from "./CategoryPicker";
import AdminFilterBar from "./AdminFilterBar";
import AdminAlimentareCard from "./AdminAlimentareCard";
import "./admin.css";

// riusa reparti/etichette/accenti già definiti per il sito pubblico
const ALIMENTARI_OPTIONS = ALIMENTARI_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.short || c.label,
  accent: c.accent,
}));

function AlimentariManager() {
  const [categoryId, setCategoryId] = useState(ALIMENTARI_OPTIONS[0].id);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [subFilter, setSubFilter] = useState(null);

  // reset "durante il render" quando cambia reparto (stesso pattern di
  // WineManager/BeerManager, evita un giro di effect in più)
  const [loadedFor, setLoadedFor] = useState(null);
  if (categoryId !== loadedFor) {
    setLoadedFor(categoryId);
    setItems([]);
    setLoading(true);
    setError("");
    setSearchText("");
    setSubFilter(null);
  }

  // stessa guardia contro risposte fuori ordine del pannello birre: su
  // Vercel i cold start rendono i tempi di risposta imprevedibili
  useEffect(() => {
    let cancelled = false;
    getAlimentari(categoryId)
      .then((data) => {
        if (!cancelled) setItems(data);
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

  const category = ALIMENTARI_OPTIONS.find((c) => c.id === categoryId);

  const handleCreated = (item) => setItems((xs) => [item, ...xs]);
  const handleUpdated = (item) =>
    setItems((xs) => xs.map((x) => (x.id === item.id ? item : x)));
  const handleDeleted = (id) => setItems((xs) => xs.filter((x) => x.id !== id));

  // sottocategorie esistenti: alimentano sia il filtro sia il datalist
  // del form, così i gruppi restano coerenti senza una lista fissa
  const sottocategorie = [
    ...new Set(items.map((i) => i.sottocategoria?.trim()).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "it"));

  const query = normalize(searchText.trim());
  const visibleItems = items.filter((i) => {
    if (subFilter && i.sottocategoria?.trim() !== subFilter) return false;
    if (!query) return true;
    const hay = normalize(
      [i.name, i.tipo, i.sottocategoria].filter(Boolean).join(" "),
    );
    return hay.includes(query);
  });

  return (
    <div className="admin-layout">
      <CategoryPicker
        categories={ALIMENTARI_OPTIONS}
        activeId={categoryId}
        onSelect={setCategoryId}
      />

      <div className="admin-content">
        <div
          className="admin-content-header"
          style={{ "--accent": category?.accent }}
        >
          <h2 className="admin-content-title">{category?.label}</h2>
          {!loading && (
            <span className="admin-content-count">
              {visibleItems.length}{" "}
              {visibleItems.length === 1 ? "prodotto" : "prodotti"}
            </span>
          )}
          {!loading && items.length > 0 && (
            <AdminFilterBar
              query={searchText}
              onQueryChange={setSearchText}
              searchPlaceholder="Cerca per nome, tipo o gruppo…"
              canSearch={items.length >= 6}
              filterValues={sottocategorie.length > 1 ? sottocategorie : null}
              filterLabel="Gruppi"
              activeFilter={subFilter}
              onFilterChange={setSubFilter}
            />
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <p className="admin-loading">Caricamento…</p>
        ) : (
          <>
            <ul className="admin-product-grid">
              <AdminAlimentareCard
                categoryId={categoryId}
                sottocategorie={sottocategorie}
                onCreated={handleCreated}
              />
              {visibleItems.map((i) => (
                <AdminAlimentareCard
                  key={i.id}
                  item={i}
                  sottocategorie={sottocategorie}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </ul>
            {visibleItems.length === 0 && items.length > 0 && (
              <p className="admin-loading">
                Nessun risultato. Prova a cambiare ricerca.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AlimentariManager;
