import { useEffect, useState } from "react";
import { SHOP_GROUPS } from "../../data/data";
import "./enoteca.css";

// stemmi/bandiere delle regioni: appena metti i file in src/images/regioni/
// (es. piemonte.png, valle-daosta.png) la barra li usa da sola
const regionImgs = import.meta.glob(
  "../../images/regioni/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
);
const regionSlug = (name) =>
  name.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-");
const regionImg = (name) => {
  const base = `../../images/regioni/${regionSlug(name)}`;
  return (
    regionImgs[`${base}.png`] ||
    regionImgs[`${base}.svg`] ||
    regionImgs[`${base}.jpg`] ||
    regionImgs[`${base}.jpeg`] ||
    regionImgs[`${base}.webp`]
  );
};

export function CatCard({ item, onClick }) {
  return (
    <button
      className="cat-card"
      style={{ "--accent": item.accent }}
      onClick={onClick}
    >
      {item.img ? (
        <img src={item.img} alt="" className="cat-img" loading="lazy" />
      ) : (
        <span className="cat-icon" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="cat-name">{item.label}</span>
      <span className="cat-desc">{item.description}</span>
      <span className="cat-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

function Enoteca() {
  const [group, setGroup] = useState(null);
  const [category, setCategory] = useState(null);
  const [regionFilter, setRegionFilter] = useState(null); // barra regioni mobile
  const [closing, setClosing] = useState(false); // animazione di rientro barra

  const activeGroup = SHOP_GROUPS.find((g) => g.id === group);
  const activeCategory = activeGroup?.categories.find(
    (c) => c.id === category
  );

  const openCategory = (id) => {
    setCategory(id);
    setRegionFilter(null);
  };


  
  const filterValues = activeCategory?.filterBy
    ? [
        ...new Set(
          activeCategory.items
            .map((i) => i[activeCategory.filterBy])
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b, "it"))
    : [];

  const visibleItems =
    activeCategory && regionFilter
      ? activeCategory.items.filter(
          (i) => i[activeCategory.filterBy] === regionFilter
        )
      : activeCategory?.items;

  // ogni cambio di livello riparte dall'inizio della pagina
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [group, category]);

  // nella lista prodotti: pagina bloccata, scorrono solo i prodotti;
  // se c'è la barra regioni, la tab bar sotto viene sfocata
  const hasRegionBar = Boolean(activeCategory) && filterValues.length >= 2;
  useEffect(() => {
    if (!activeCategory) return;
    document.body.classList.add("home-no-scroll");
    if (hasRegionBar && !closing) document.body.classList.add("region-bar-open");
    else document.body.classList.remove("region-bar-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("region-bar-open");
    };
  }, [activeCategory, hasRegionBar, closing]);

  // back: se c'è la barra regioni, prima la fa rientrare (poi esce)
  const handleBack = () => {
    if (hasRegionBar) setClosing(true);
    else openCategory(null);
  };
  const onBarClosed = () => {
    if (!closing) return;
    setClosing(false);
    openCategory(null);
  };

  if (activeCategory) {
    return (
      <section
        className={
          "shop-section" + (filterValues.length >= 2 ? " has-filter-bar" : "")
        }
      >
        <button className="back-btn" onClick={handleBack}>
          ← {activeGroup.label}
        </button>
        <h2 className="section-title">{activeCategory.label}</h2>
        {filterValues.length >= 2 && (
          <nav
            className={"filter-bar" + (closing ? " filter-bar--closing" : "")}
            aria-label="Filtra per regione"
            onAnimationEnd={onBarClosed}
          >
            <button
              className={"filter-btn" + (!regionFilter ? " is-active" : "")}
              onClick={() => setRegionFilter(null)}
            >
              <span className="filter-icon" aria-hidden="true">
                🇮🇹
              </span>
              <span className="filter-label">Tutti</span>
            </button>
            {filterValues.map((v) => (
              <button
                key={v}
                className={
                  "filter-btn" + (regionFilter === v ? " is-active" : "")
                }
                onClick={() => setRegionFilter(v)}
              >
                {regionImg(v) ? (
                  <img
                    src={regionImg(v)}
                    alt=""
                    className="filter-img"
                    loading="lazy"
                  />
                ) : (
                  <span className="filter-icon" aria-hidden="true">
                    🏔️
                  </span>
                )}
                <span className="filter-label">{v}</span>
              </button>
            ))}
          </nav>
        )}
        {activeCategory.items.length === 0 ? (
          <p className="wine-empty">
            Il catalogo è in arrivo — torna a trovarci presto.
          </p>
        ) : (
          <ul className="wine-list" key={regionFilter || "tutti"}>
            {visibleItems.map((w, i) => (
              <li key={w.name + i} className="wine-card">
                <div className="wine-main">
                  <span className="wine-name">{w.name}</span>
                  <span className="wine-meta">
                    {[
                      w.denominazione,
                      w.uvaggio,
                      w.stile,
                      w.colore,
                      w.gradazione,
                      w.anno,
                      w.regione,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                {w.prezzo != null && (
                  <span className="wine-price">€ {w.prezzo.toFixed(2)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  if (activeGroup) {
    return (
      <section className="shop-section">
        <button className="back-btn" onClick={() => setGroup(null)}>
          ← Enoteca
        </button>
        <h2 className="section-title">{activeGroup.label}</h2>
        {activeGroup.categories.length === 0 ? (
          <p className="wine-empty">
            Le categorie sono in arrivo — torna a trovarci presto.
          </p>
        ) : (
          <div
            className={
              "cat-grid" + (activeGroup.columns === 3 ? " cat-grid--three" : "")
            }
          >
            {activeGroup.categories.map((c) => (
              <CatCard key={c.id} item={c} onClick={() => openCategory(c.id)} />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="shop-section">
      <h2 className="section-title">La nostra Enoteca</h2>
      <div className="cat-grid cat-grid--center">
        {SHOP_GROUPS.map((g) => (
          <CatCard key={g.id} item={g} onClick={() => setGroup(g.id)} />
        ))}
      </div>
    </section>
  );
}

export default Enoteca;
