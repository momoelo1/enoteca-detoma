import { useEffect, useState } from "react";
import { BEER_CATEGORIES } from "../../data/data";
import { getBeers } from "../../services/beers";
import CategoryPicker from "./CategoryPicker";
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

  // reset "durante il render" quando cambia categoria (stesso pattern di
  // WineManager, evita un giro di effect in più)
  const [loadedFor, setLoadedFor] = useState(null);
  if (producerId !== loadedFor) {
    setLoadedFor(producerId);
    setBeers([]);
    setLoading(true);
    setError("");
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
              {beers.length} {beers.length === 1 ? "birra" : "birre"}
            </span>
          )}
        </div>

        {error && <p className="wine-admin-error">{error}</p>}

        {loading ? (
          <p className="admin-loading">Caricamento…</p>
        ) : (
          <ul className="admin-wine-grid">
            <AdminBeerCard producerId={producerId} onCreated={handleCreated} />
            {beers.map((b) => (
              <AdminBeerCard
                key={b.id}
                beer={b}
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

export default BeerManager;
