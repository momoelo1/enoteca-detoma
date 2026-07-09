import { useEffect, useState } from "react";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import { CatCard } from "../enoteca/Enoteca";
import "./alimentari.css";

function Alimentari() {
  const [category, setCategory] = useState(null); // "gastronomia" | "dolceria"

  const activeCategory = ALIMENTARI_CATEGORIES.find((c) => c.id === category);

  // ogni cambio di livello riparte dall'inizio della pagina
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  if (activeCategory) {
    return (
      <section className="shop-section">
        <button className="back-btn" onClick={() => setCategory(null)}>
          ← Alimentari
        </button>
        <h2 className="section-title">{activeCategory.label}</h2>
        {activeCategory.items.length === 0 ? (
          <p className="wine-empty">
            Il catalogo è in arrivo — torna a trovarci presto.
          </p>
        ) : (
          <ul className="wine-list">
            {activeCategory.items.map((p) => (
              <li key={p.name} className="wine-card">
                <div className="wine-main">
                  <span className="wine-name">{p.name}</span>
                  <span className="wine-meta">
                    {[p.tipo, p.descrizione, p.provenienza]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                {p.prezzo != null && (
                  <span className="wine-price">€ {p.prezzo.toFixed(2)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <section className="shop-section">
      <h2 className="section-title">Alimentari</h2>
      <div className="cat-grid cat-grid--center">
        {ALIMENTARI_CATEGORIES.map((c) => (
          <CatCard key={c.id} item={c} onClick={() => setCategory(c.id)} />
        ))}
      </div>
    </section>
  );
}

export default Alimentari;
