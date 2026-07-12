import { useEffect, useState } from "react";
import { SHOP_GROUPS, REGION_FLAGS, WHATSAPP_NUMBER } from "../../data/data";
import "./enoteca.css";

// prezzo in formato italiano: "€ 32,00" (virgola, non punto)
const formatPrezzo = (n) =>
  `€ ${n.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// bottiglia stilizzata: segnaposto elegante (tinta con l'accento della
// categoria) finché non arrivano le foto vere delle bottiglie
function BottleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 64" aria-hidden="true">
      <path d="M10 2h4v10c0 4 5 5.5 5 12v34a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V24c0-6.5 5-8 5-12V2z" />
    </svg>
  );
}

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

// card categoria compatta: foto + nome, un tocco → lista prodotti
function MiniCard({ c, onClick }) {
  return (
    <li className="mini-cell">
      <button
        type="button"
        className="mini-card"
        style={{ "--accent": c.accent }}
        onClick={onClick}
      >
        {c.img ? (
          <img src={c.img} alt="" className="mini-img" loading="lazy" />
        ) : (
          <span className="mini-icon" aria-hidden="true">
            {c.icon || "🍷"}
          </span>
        )}
        <span className="mini-name">{c.short || c.label}</span>
      </button>
    </li>
  );
}

// TEMP: segnaposto per vedere le card complete finché non arrivano i dati
// reali — RIMUOVERE (descrizione, annate/prezzi, miniatura)
const LOREM_TEMP =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const ANNATE_TEMP = [
  { anno: "2018", prezzo: 30 },
  { anno: "2019", prezzo: 32 },
  { anno: "2020", prezzo: 34 },
];

// Card essenziale (vini, birre, alimentari): foto, nome, sottotitolo, prezzo.
// Tutto il resto vive nel bottom sheet: si apre toccando la card.
export function WineCard({ w, accent, regionFilter, onOpen }) {
  const annate = w.annate || ANNATE_TEMP; // TEMP: || ANNATE_TEMP
  const prezzo = w.prezzo != null ? w.prezzo : annate?.[0]?.prezzo; // default: 1ª annata
  // regione già selezionata nel filtro: non ripeterla su ogni card
  const regione = w.regione !== regionFilter ? w.regione : null;
  const sub = regione || w.stile || w.colore || w.tipo;

  return (
    <li className="wine-card">
      <button
        type="button"
        className="wine-card-btn"
        style={{ "--accent": accent }}
        onClick={() => onOpen(w)}
      >
        <div className="wine-thumb">
          {w.img ? (
            <img src={w.img} alt="" className="wine-thumb-img" loading="lazy" />
          ) : (
            <BottleIcon className="wine-thumb-svg" />
          )}
        </div>
        <span className="wine-name">{w.name}</span>
        {sub && <span className="wine-meta">{sub}</span>}
        {prezzo != null && (
          <span className="wine-price">{formatPrezzo(prezzo)}</span>
        )}
      </button>
    </li>
  );
}

// Bottom sheet: pannello che sale dal basso (pattern familiare tipo social /
// delivery) con foto grande, descrizione completa e tabella annate/prezzi.
// Si chiude con ✕, tocco sullo sfondo o Esc.
export function WineSheet({ w, category, onClose }) {
  const desc = w.description || w.descrizione || LOREM_TEMP; // TEMP: || LOREM_TEMP
  const annate = w.annate || ANNATE_TEMP; // TEMP: || ANNATE_TEMP
  // "Rosso" dentro "Vini Rossi" è ovvio: stessa radice (ross-) → non ripeterlo
  const coloreRidondante =
    w.colore &&
    category?.label?.toLowerCase().includes(w.colore.slice(0, 4).toLowerCase());
  const meta = [
    w.denominazione,
    w.uvaggio,
    w.stile,
    w.tipo,
    coloreRidondante ? null : w.colore,
    w.gradazione,
    w.regione,
    w.provenienza,
  ]
    .filter(Boolean)
    .join(" · ");
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Buongiorno, vorrei informazioni su: ${w.name}`
  )}`;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="wine-sheet"
        style={{ "--accent": category?.accent }}
        role="dialog"
        aria-modal="true"
        aria-label={w.name}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="sheet-handle" aria-hidden="true" />
        <button
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Chiudi"
          autoFocus
        >
          ✕
        </button>
        {w.img ? (
          <img src={w.img} alt="" className="sheet-img" />
        ) : (
          <BottleIcon className="sheet-svg" />
        )}
        <h3 className="sheet-name">{w.name}</h3>
        {meta && <p className="sheet-meta">{meta}</p>}
        {desc && <p className="sheet-desc">{desc}</p>}
        {annate?.length > 0 && (
          <div className="sheet-annate">
            <span className="sheet-label">Annate e prezzi</span>
            <ul className="wine-annate-list">
              {annate.map((a) => (
                <li key={a.anno} className="wine-annate-row">
                  <span className="wine-annate-year">{a.anno}</span>
                  <span className="wine-annate-price">
                    {formatPrezzo(a.prezzo)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {WHATSAPP_NUMBER && (
          <a
            className="sheet-cta"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Chiedi disponibilità
          </a>
        )}
      </div>
    </div>
  );
}

function Enoteca() {
  const [group, setGroup] = useState(null);
  const [category, setCategory] = useState(null);
  const [regionFilter, setRegionFilter] = useState(null); // barra regioni mobile
  const [closing, setClosing] = useState(false); // animazione di rientro barra
  const [sheetWine, setSheetWine] = useState(null); // prodotto aperto nel bottom sheet
  const [tabGroup, setTabGroup] = useState(SHOP_GROUPS[0].id); // tab attiva (Vini/Birre/Distillati)

  const activeGroup = SHOP_GROUPS.find((g) => g.id === group);
  const activeCategory = activeGroup?.categories.find(
    (c) => c.id === category
  );

  const openCategory = (id) => {
    setCategory(id);
    setRegionFilter(null);
    setSheetWine(null);
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

  // chiusura lista prodotti: si torna alla pagina Enoteca (nei nuovi
  // layout i livelli intermedi non esistono più)
  const closeCategory = () => {
    openCategory(null);
    setGroup(null);
  };

  // back: su telefono, se c'è la barra regioni, prima la fa rientrare
  // (poi esce). Su desktop la barra è una riga statica senza animazione
  // di chiusura: uscita diretta (aspettare onAnimationEnd bloccherebbe).
  const handleBack = () => {
    const phoneBar = window.matchMedia("(max-width: 640px)").matches;
    if (hasRegionBar && phoneBar) setClosing(true);
    else closeCategory();
  };
  const onBarClosed = () => {
    if (!closing) return;
    setClosing(false);
    closeCategory();
  };

  if (activeCategory) {
    return (
      <section
        className={
          "shop-section" + (filterValues.length >= 2 ? " has-filter-bar" : "")
        }
      >
        <button className="back-btn" onClick={handleBack}>
          ← Enoteca
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
                {REGION_FLAGS[v] ? (
                  <img
                    src={REGION_FLAGS[v]}
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
              <WineCard
                key={w.name + i}
                w={w}
                accent={activeCategory.accent}
                regionFilter={regionFilter}
                onOpen={setSheetWine}
              />
            ))}
          </ul>
        )}
        {sheetWine && (
          <WineSheet
            w={sheetWine}
            category={activeCategory}
            onClose={() => setSheetWine(null)}
          />
        )}
      </section>
    );
  }

  // totale etichette in tutta l'enoteca, arrotondato per difetto alla decina
  const totalItems = SHOP_GROUPS.reduce(
    (s, g) => s + g.categories.reduce((t, c) => t + (c.items?.length || 0), 0),
    0
  );
  const totalRounded = Math.floor(totalItems / 10) * 10;

  // un tocco solo: dalla pagina Enoteca dritti alla lista prodotti
  const openDirect = (gId, cId) => {
    setGroup(gId);
    openCategory(cId);
  };

  const tabG = SHOP_GROUPS.find((g) => g.id === tabGroup);

  return (
    <section className="shop-section">
      <h2 className="section-title">La nostra Enoteca</h2>
      {totalRounded > 0 && (
        <p className="section-sub">
          Oltre {totalRounded} etichette selezionate nel cuore di Lodi.
        </p>
      )}

      {/* tab dei gruppi: Vini | Birre | Distillati */}
      {tabG && (
        <>
          <nav className="group-tabs" aria-label="Gruppi">
            {SHOP_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={"group-tab" + (tabGroup === g.id ? " is-active" : "")}
                style={{ "--accent": g.accent }}
                onClick={() => setTabGroup(g.id)}
              >
                {g.label}
              </button>
            ))}
          </nav>
          <ul className="mini-grid">
            {tabG.categories.map((c) => (
              <MiniCard
                key={c.id}
                c={c}
                onClick={() => openDirect(tabG.id, c.id)}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default Enoteca;
