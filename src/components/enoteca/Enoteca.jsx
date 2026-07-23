import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SHOP_GROUPS, COUNTRY_GROUPS, WHATSAPP_NUMBER } from "../../data/data";
import { getWines } from "../../services/wines";
import { getBeers } from "../../services/beers";
import "./enoteca.css";

// prezzo in formato italiano: "€ 32,00" (virgola, non punto)
const formatPrezzo = (n) =>
  `€ ${n.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// normalizza per la ricerca: minuscolo e senza accenti ("Cà"→"ca")
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

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

// una fetch per gruppo (vini → getWines, birre → getBeers): ogni gruppo
// "remote" ha il suo endpoint, non tutti i prodotti sono vini
const REMOTE_FETCHERS = {
  vini: getWines,
  birre: getBeers,
};

// categorie "remote: true" (es. rossi, tutte le birre): calcolate una
// volta sola, non cambiano mai a runtime (dipendono solo da SHOP_GROUPS,
// statico). Ogni voce porta con sé il fetcher del proprio gruppo.
const REMOTE_CATEGORIES = SHOP_GROUPS.flatMap((g) =>
  (g.categories || [])
    .filter((c) => c.remote)
    .map((c) => ({ ...c, fetcher: REMOTE_FETCHERS[g.id] }))
);

// Card essenziale (vini, birre, alimentari): foto, nome, sottotitolo, prezzo.
// Tutto il resto vive nel bottom sheet: si apre toccando la card.
export function WineCard({ w, accent, regionFilter, onOpen }) {
  const annate = w.annate;
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
  const annate = w.annate;
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
  const [regionFilter, setRegionFilter] = useState(null); // regione/paese selezionato
  const [barView, setBarView] = useState("regioni"); // vista barra: regioni | mondo
  const [barMode, setBarMode] = useState(null); // barra regioni aperta: null | "regioni"
  const [searchOpen, setSearchOpen] = useState(false); // campo di ricerca in-place
  const [searchText, setSearchText] = useState(""); // testo del filtro di ricerca
  const [hiding, setHiding] = useState(false); // spegnimento: rientra, poi si smonta
  const [closing, setClosing] = useState(false); // animazione di rientro barra (uscita pagina)
  const [sheetWine, setSheetWine] = useState(null); // prodotto aperto nel bottom sheet
  const [tabGroup, setTabGroup] = useState(SHOP_GROUPS[0].id); // tab attiva (Vini/Birre/Distillati)
  const searchRef = useRef(null); // input di ricerca, per il focus all'apertura
  const listRef = useRef(null); // lista prodotti, per riportarla in cima sui filtri
  const savedScrollRef = useRef(0); // scroll salvato prima di aprire la ricerca

  // niente array statico per le categorie "remote": i vini arrivano
  // dall'API. Si scaricano una volta sola all'ingresso in Enoteca e si
  // riusano sia per il conteggio totale sia per la lista
  const [remoteByCategory, setRemoteByCategory] = useState({});
  const [remoteLoading, setRemoteLoading] = useState(
    REMOTE_CATEGORIES.length > 0
  );
  useEffect(() => {
    if (REMOTE_CATEGORIES.length === 0) return;
    Promise.all(
      REMOTE_CATEGORIES.map((c) => c.fetcher(c.id).then((items) => [c.id, items]))
    )
      .then((entries) => setRemoteByCategory(Object.fromEntries(entries)))
      .catch(() => {})
      .finally(() => setRemoteLoading(false));
  }, []);

  const activeGroup = SHOP_GROUPS.find((g) => g.id === group);
  const activeCategory = activeGroup?.categories.find(
    (c) => c.id === category
  );

  const openCategory = (id) => {
    setCategory(id);
    setRegionFilter(null);
    setBarView("regioni");
    setBarMode(null);
    setSearchOpen(false);
    setSearchText("");
    setHiding(false);
    setSheetWine(null);
  };


  
  // fonte dei prodotti: dall'API se la categoria è "remote", altrimenti
  // il vecchio array statico — il resto della pagina non nota differenza
  const sourceItems = activeCategory?.remote
    ? remoteByCategory[activeCategory.id] ?? []
    : activeCategory?.items ?? [];

  const filterValues = activeCategory?.filterBy
    ? [
        ...new Set(
          sourceItems
            .map((i) => i[activeCategory.filterBy])
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b, "it"))
    : [];


  const regioniItaliane = filterValues.filter((v) => !COUNTRY_GROUPS[v]);
  const paesiMondo = filterValues.filter((v) => COUNTRY_GROUPS[v]);
  const barValues = barView === "mondo" ? paesiMondo : regioniItaliane;

  // regione e ricerca si sommano: la ricerca affina dentro la regione.
  // La ricerca guarda nome + regione/paese + denominazione/uvaggio/stile.
  const query = normalize(searchText.trim());
  const visibleItems = sourceItems
    .filter((i) =>
      regionFilter ? i[activeCategory.filterBy] === regionFilter : true
    )
    .filter((i) => {
      if (!query) return true;
      const hay = normalize(
        [i.name, i.regione, i.denominazione, i.uvaggio, i.stile, i.tipo, i.colore]
          .filter(Boolean)
          .join(" ")
      );
      return hay.includes(query);
    });

  // ogni cambio di livello riparte dall'inizio della pagina
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [group, category]);

  const hasRegionBar = Boolean(activeCategory) && filterValues.length >= 2;
  const canSearch = Boolean(activeCategory) && sourceItems.length >= 10;
  const barOpen = Boolean(barMode);
  useEffect(() => {
    if (!activeCategory) return;
    document.body.classList.add("home-no-scroll");
    if (barOpen && !closing && !hiding)
      document.body.classList.add("region-bar-open");
    else document.body.classList.remove("region-bar-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("region-bar-open");
    };
  }, [activeCategory, barOpen, closing, hiding]);

  // apertura della ricerca: porta subito il focus sull'input
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // mentre si filtra la lista riparte dall'alto, così i risultati sono
  // subito visibili: quando si digita una ricerca o si cambia regione
  useEffect(() => {
    if (query && listRef.current) listRef.current.scrollTop = 0;
  }, [query]);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [regionFilter]);


  const closeCategory = () => {
    openCategory(null);
    setGroup(null);
  };


  const handleBack = () => {
    const phoneBar = window.matchMedia("(max-width: 640px)").matches;
    if (barOpen && phoneBar) setClosing(true);
    else closeCategory();
  };
  const onBarAnimEnd = () => {
    if (hiding) {
      // spegnimento da bottone: barra rientrata, ora si smonta
      setHiding(false);
      setBarMode(null);
      return;
    }
    if (!closing) return;
    setClosing(false);
    closeCategory();
  };


  const closeBar = () => {
    const phoneBar = window.matchMedia("(max-width: 640px)").matches;
    if (phoneBar) {
      if (!hiding) setHiding(true);
    } else setBarMode(null);
  };
  const toggleRegioni = () => {
    if (barMode === "regioni") closeBar();
    else {
      setHiding(false);
      setBarView("regioni");
      setBarMode("regioni");
    }
  };
  // bottone "Cerca": all'apertura salva lo scroll della lista; alla
  // chiusura svuota la ricerca e la lista torna dov'era prima di cercare
  const openSearch = () => {
    savedScrollRef.current = listRef.current?.scrollTop ?? 0;
    setSearchOpen(true);
  };
  const closeSearch = () => {
    setSearchText("");
    setSearchOpen(false);
  };
  const toggleSearch = () => (searchOpen ? closeSearch() : openSearch());

  // alla chiusura ripristina la posizione salvata (prima del paint)
  useLayoutEffect(() => {
    if (!searchOpen && listRef.current)
      listRef.current.scrollTop = savedScrollRef.current;
  }, [searchOpen]);

  if (activeCategory) {
    return (
      <section
        className={"shop-section" + (barOpen ? " has-filter-bar" : "")}
      >
        <button className="back-btn" onClick={handleBack}>
          ← Enoteca
        </button>
        <div className="section-head">
          <h2 className="section-title">{activeCategory.label}</h2>
          <div className="section-actions">
            {canSearch && (
              <button
                type="button"
                className={
                  "filter-toggle" + (searchOpen ? " is-active" : "")
                }
                onClick={toggleSearch}
                aria-expanded={searchOpen}
                aria-label="Cerca un vino"
              >
                <svg
                  className="filter-toggle-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M10 3a7 7 0 015.29 11.6l4.55 4.56-1.42 1.41-4.55-4.55A7 7 0 1110 3zm0 2a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
                <span className="filter-toggle-text">
                  {searchText || "Cerca"}
                </span>
              </button>
            )}
            {hasRegionBar && (
              <button
                type="button"
                className={
                  "filter-toggle" + (barMode === "regioni" ? " is-active" : "")
                }
                onClick={toggleRegioni}
                aria-expanded={barMode === "regioni"}
                aria-label="Filtra per regione"
              >
                <svg
                  className="filter-toggle-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
                </svg>
                <span className="filter-toggle-text">
                  Regioni
                </span>
              </button>
            )}
          </div>
        </div>
        {searchOpen && (
          <div className="search-field">
            <svg
              className="search-field-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M10 3a7 7 0 015.29 11.6l4.55 4.56-1.42 1.41-4.55-4.55A7 7 0 1110 3zm0 2a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              className="search-field-input"
              placeholder="Cerca per nome o regione…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              type="button"
              className="search-field-close"
              onClick={closeSearch}
              aria-label="Chiudi la ricerca"
            >
              ✕
            </button>
          </div>
        )}
        {barOpen && (
          <nav
            className={
              "filter-bar" + (closing || hiding ? " filter-bar--closing" : "")
            }
            aria-label="Filtra per regione"
            onAnimationEnd={onBarAnimEnd}
          >
            {barView === "regioni" ? (
              <>
                <button
                  className={"filter-btn" + (!regionFilter ? " is-active" : "")}
                  onClick={() => setRegionFilter(null)}
                >
                  <span className="filter-label">Tutti</span>
                </button>
                {paesiMondo.length > 0 && (
                  <button
                    className={
                      "filter-btn" +
                      (COUNTRY_GROUPS[regionFilter] ? " is-active" : "")
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
              </>
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
              </>
            )}
          </nav>
        )}
        {activeCategory.remote && remoteLoading ? (
          <p className="wine-empty">Caricamento…</p>
        ) : sourceItems.length === 0 ? (
          <p className="wine-empty">
            Il catalogo è in arrivo — torna a trovarci presto.
          </p>
        ) : visibleItems.length === 0 ? (
          <p className="wine-empty">
            Nessun risultato. Prova a cambiare ricerca o regione.
          </p>
        ) : (
          <ul className="wine-list" key={regionFilter || "tutti"} ref={listRef}>
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
    (s, g) =>
      s +
      g.categories.reduce(
        (t, c) =>
          t + (c.remote ? remoteByCategory[c.id]?.length ?? 0 : c.items?.length || 0),
        0
      ),
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

      {/* tab dei gruppi: Vini | Birre | Distillati | Consigliati */}
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
        <button
          type="button"
          className={
            "group-tab" + (tabGroup === "consigliati" ? " is-active" : "")
          }
          style={{ "--accent": "#c9a227" }}
          onClick={() => setTabGroup("consigliati")}
        >
          Consigliati
        </button>
      </nav>
      {tabG ? (
        <ul className="mini-grid">
          {tabG.categories.map((c) => (
            <MiniCard
              key={c.id}
              c={c}
              onClick={() => openDirect(tabG.id, c.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="wine-empty">
          I consigli della casa arrivano presto — torna a trovarci.
        </p>
      )}
    </section>
  );
}

export default Enoteca;
