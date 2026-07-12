import { useEffect, useState } from "react";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import { WineCard, WineSheet } from "../enoteca/Enoteca";
import "./gastronomia.css";

// Stessa impostazione della pagina Enoteca: tab dei reparti in alto
// (Gastronomia | Dolceria) e sotto la lista prodotti con card + bottom
// sheet condivisi. Niente livelli intermedi: un tocco sulla tab basta.
function Gastronomia() {
  const [tab, setTab] = useState(ALIMENTARI_CATEGORIES[0].id);
  const [sheetItem, setSheetItem] = useState(null); // prodotto aperto nel bottom sheet

  const activeCategory = ALIMENTARI_CATEGORIES.find((c) => c.id === tab);

  // cambio reparto: si riparte dall'inizio e si chiude l'eventuale scheda
  useEffect(() => {
    window.scrollTo(0, 0);
    setSheetItem(null);
  }, [tab]);

  return (
    <section className="shop-section">
      <h2 className="section-title">Alimentari</h2>

      {/* tab dei reparti: Gastronomia | Dolceria */}
      <nav className="group-tabs" aria-label="Reparti">
        {ALIMENTARI_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={"group-tab" + (tab === c.id ? " is-active" : "")}
            style={{ "--accent": c.accent }}
            onClick={() => setTab(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      {activeCategory.items.length === 0 ? (
        <p className="wine-empty">
          Il catalogo è in arrivo — torna a trovarci presto.
        </p>
      ) : (
        <ul className="wine-list">
          {activeCategory.items.map((p, i) => (
            <WineCard
              key={p.name + i}
              w={p}
              accent={activeCategory.accent}
              onOpen={setSheetItem}
            />
          ))}
        </ul>
      )}

      {sheetItem && (
        <WineSheet
          w={sheetItem}
          category={activeCategory}
          onClose={() => setSheetItem(null)}
        />
      )}
    </section>
  );
}

export default Gastronomia;
