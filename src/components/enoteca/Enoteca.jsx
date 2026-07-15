import { useEffect, useState } from "react";
import { SHOP_GROUPS, REGION_GROUPS, WHATSAPP_NUMBER } from "../../data/data";
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

// TEMP: prezzi/annate finti solo per resa visiva finché non arrivano
// quelli veri — RIMUOVERE (le descrizioni ormai sono tutte reali)
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
  const desc = w.description || w.descrizione;
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
  const [barView, setBarView] = useState("regioni"); // vista barra: regioni | mondo
  const [filtersOn, setFiltersOn] = useState(false); // barra aperta dal bottone "Regioni"
  const [hiding, setHiding] = useState(false); // spegnimento: rientra, poi si smonta
  const [closing, setClosing] = useState(false); // animazione di rientro barra (uscita pagina)
  const [sheetWine, setSheetWine] = useState(null); // prodotto aperto nel bottom sheet
  const [tabGroup, setTabGroup] = useState(SHOP_GROUPS[0].id); // tab attiva (Vini/Birre/Distillati)

  const activeGroup = SHOP_GROUPS.find((g) => g.id === group);
  const activeCategory = activeGroup?.categories.find(
    (c) => c.id === category
  );

  const openCategory = (id) => {
    setCategory(id);
    setRegionFilter(null);
    setBarView("regioni");
    setFiltersOn(false);
    setHiding(false);
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

  // prima vista: solo regioni italiane; i paesi esteri stanno tutti
  // nel gruppo "Mondo", aperto nella stessa barra
  const regioniItaliane = filterValues.filter((v) => !REGION_GROUPS[v]);
  const paesiMondo = filterValues.filter((v) => REGION_GROUPS[v]);
  const barValues = barView === "mondo" ? paesiMondo : regioniItaliane;

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
  // la tab bar sotto è sfocata solo quando la barra è su (non posata)
  const hasRegionBar = Boolean(activeCategory) && filterValues.length >= 2;
  useEffect(() => {
    if (!activeCategory) return;
    document.body.classList.add("home-no-scroll");
    if (hasRegionBar && filtersOn && !closing && !hiding)
      document.body.classList.add("region-bar-open");
    else document.body.classList.remove("region-bar-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("region-bar-open");
    };
  }, [activeCategory, hasRegionBar, filtersOn, closing, hiding]);

  // chiusura lista prodotti: si torna alla pagina Enoteca (nei nuovi
  // layout i livelli intermedi non esistono più)
  const closeCategory = () => {
    openCategory(null);
    setGroup(null);
  };

  // back: su telefono, se c'è la barra regioni, prima la fa rientrare
  // (poi esce). Su desktop la barra è una riga statica senza animazione
  // di chiusura: uscita diretta (aspettare onAnimationEnd bloccherebbe).
  // Barra già posata: niente animazione da aspettare, uscita diretta.
  const handleBack = () => {
    const phoneBar = window.matchMedia("(max-width: 640px)").matches;
    if (hasRegionBar && filtersOn && phoneBar) setClosing(true);
    else closeCategory();
  };
  const onBarAnimEnd = () => {
    if (hiding) {
      // spegnimento da bottone: barra rientrata, ora si smonta
      setHiding(false);
      setFiltersOn(false);
      return;
    }
    if (!closing) return;
    setClosing(false);
    closeCategory();
  };

  // bottone "Regioni" accanto al titolo: decide il cliente quando la
  // barra entra ed esce — sempre con la coreografia meccanica completa
  const toggleFilters = () => {
    if (!filtersOn) {
      setBarView("regioni");
      setFiltersOn(true);
    } else if (!hiding) {
      setHiding(true); // rientra con l'animazione, poi si spegne
    }
  };

  if (activeCategory) {
    return (
      <section
        className={
          "shop-section" +
          (hasRegionBar && filtersOn ? " has-filter-bar" : "")
        }
      >
        <button className="back-btn" onClick={handleBack}>
          ← Enoteca
        </button>
        <div className="section-head">
          <h2 className="section-title">{activeCategory.label}</h2>
          {hasRegionBar && (
            <button
              type="button"
              className={
                "filter-toggle" +
                (filtersOn || regionFilter ? " is-active" : "")
              }
              onClick={toggleFilters}
              aria-expanded={filtersOn}
              aria-label="Filtra per regione"
            >
              <svg
                className="filter-toggle-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
              </svg>
              <span>{regionFilter || "Regioni"}</span>
            </button>
          )}
        </div>
        {hasRegionBar && filtersOn && (
          <nav
            className={
              "filter-bar" +
              (closing || hiding ? " filter-bar--closing" : "")
            }
            aria-label="Filtra per regione"
            onAnimationEnd={onBarAnimEnd}
          >
            {barView === "regioni" ? (
              <button
                className={"filter-btn" + (!regionFilter ? " is-active" : "")}
                onClick={() => setRegionFilter(null)}
              >
                <span className="filter-label">Tutti</span>
              </button>
            ) : (
              <>
                <button
                  className="filter-back"
                  onClick={() => setBarView("regioni")}
                  aria-label="Torna alle regioni"
                >
                  ←
                </button>
                <span className="filter-divider" aria-hidden="true" />
              </>
            )}
            {barView === "regioni" && paesiMondo.length > 0 && (
              <button
                className={
                  "filter-btn" +
                  (REGION_GROUPS[regionFilter] ? " is-active" : "")
                }
                onClick={() => setBarView("mondo")}
              >
                <span className="filter-icon" aria-hidden="true">
                  🌍
                </span>
                <span className="filter-label">Mondo</span>
              </button>
            )}
            {barValues.map((v) => (
              <button
                key={v}
                className={
                  "filter-btn" + (regionFilter === v ? " is-active" : "")
                }
                onClick={() => setRegionFilter(v)}
              >
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
