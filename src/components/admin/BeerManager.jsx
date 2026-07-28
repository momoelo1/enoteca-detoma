import { useEffect, useState } from "react";
import { BEER_CATEGORIES } from "../../data/data";
import { getBeers } from "../../services/beers";
import { normalize } from "../../utils/normalize";
import CategoryPicker from "./CategoryPicker";
import AdminFilterBar from "./AdminFilterBar";
import AdminBeerCard from "./AdminBeerCard";
import "./admin.css";

// riusa le stesse categorie/etichette/accenti già definiti per il sito
// pubblico (BEER_CATEGORIES in data.js) — nessuna lista duplicata
const BEER_CATEGORY_OPTIONS = BEER_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.short || c.label,
  accent: c.accent,
}));

function BeerManager() {
  const [producerId, setProducerId] = useState(BEER_CATEGORY_OPTIONS[0].id);
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  // reset "durante il render" quando cambia categoria (stesso pattern di
  // WineManager, evita un giro di effect in più)
  const [loadedFor, setLoadedFor] = useState(null);
  if (producerId !== loadedFor) {
    setLoadedFor(producerId);
    setBeers([]);
    setLoading(true);
    setError("");
    setSearchText("");
  }

  // guardia contro risposte in ordine sbagliato: se si cambia produttore
  // prima che la fetch precedente risponda (probabile su Vercel, dove i
  // tempi di risposta variano per i cold start), quella vecchia risposta
  // non deve sovrascrivere i dati del produttore corrente già arrivati
  useEffect(() => {
    let cancelled = false;
    getBeers(producerId)
      .then((data) => {
        if (!cancelled) setBeers(data);
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
  }, [producerId]);

  const category = BEER_CATEGORY_OPTIONS.find((c) => c.id === producerId);

  const handleCreated = (beer) => setBeers((bs) => [beer, ...bs]);
  const handleUpdated = (beer) =>
    setBeers((bs) => bs.map((b) => (b.id === beer.id ? beer : b)));
  const handleDeleted = (id) => setBeers((bs) => bs.filter((b) => b.id !== id));

  const query = normalize(searchText.trim());
  const visibleBeers = beers.filter((b) => {
    if (!query) return true;
    const hay = normalize([b.name, b.stile].filter(Boolean).join(" "));
    return hay.includes(query);
  });

  return (
    <div className="admin-layout">
      <CategoryPicker
        categories={BEER_CATEGORY_OPTIONS}
        activeId={producerId}
        onSelect={setProducerId}
      />

      <div className="admin-content">
        <div className="admin-content-header" style={{ "--accent": category?.accent }}>
          <h2 className="admin-content-title">{category?.label}</h2>
          {!loading && (
            <span className="admin-content-count">
              {visibleBeers.length} {visibleBeers.length === 1 ? "birra" : "birre"}
            </span>
          )}
          {!loading && beers.length > 0 && (
            <AdminFilterBar
              query={searchText}
              onQueryChange={setSearchText}
              searchPlaceholder="Cerca per nome o stile…"
              canSearch={beers.length >= 6}
              filterValues={null}
            />
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <p className="admin-loading">Caricamento…</p>
        ) : (
          <>
            <ul className="admin-product-grid">
              <AdminBeerCard producerId={producerId} onCreated={handleCreated} />
              {visibleBeers.map((b) => (
                <AdminBeerCard
                  key={b.id}
                  beer={b}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </ul>
            {visibleBeers.length === 0 && beers.length > 0 && (
              <p className="admin-loading">Nessun risultato. Prova a cambiare ricerca.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BeerManager;
