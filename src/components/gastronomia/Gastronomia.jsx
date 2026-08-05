import { useEffect, useState } from "react";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import { ProductCard, ProductSheet } from "../enoteca/Enoteca";
import { getAlimentari } from "../../services/alimentari";
import { CategoryIcon } from "../icons/CategoryIcon";
import "./gastronomia.css";

// raggruppa per `sottocategoria`; i prodotti che non ne hanno finiscono
// tutti insieme in coda sotto "Altro"
function groupBySub(items) {
  const map = new Map();
  for (const item of items) {
    const key = item.sottocategoria?.trim() || "";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map.entries()]
    .map(([id, list]) => ({ id, label: id || "Altro", items: list }))
    .sort((a, b) => {
      if (!a.id) return 1; // "Altro" sempre per ultimo
      if (!b.id) return -1;
      return a.label.localeCompare(b.label, "it");
    });
}

// Due livelli: tab dei reparti (Gastronomia | Dolceria) → griglia delle
// sottocategorie → lista prodotti del gruppo scelto. Card e bottom sheet
// sono gli stessi dell'Enoteca.
function Gastronomia() {
  const [tab, setTab] = useState(ALIMENTARI_CATEGORIES[0].id);
  const [sheetItem, setSheetItem] = useState(null); // prodotto aperto nel bottom sheet
  const [openGroup, setOpenGroup] = useState(null); // sottocategoria aperta
  const [items, setItems] = useState([]);
  // reparto per cui `items` è già stato caricato: finché non combacia con
  // la tab attiva siamo in caricamento. Ricavarlo così (invece di un
  // setLoading(true) dentro l'effetto) evita il render a cascata che il
  // React Compiler segnala — stesso schema usato in AdminWineCard
  const [loadedFor, setLoadedFor] = useState(null);
  const loading = loadedFor !== tab;

  const activeCategory = ALIMENTARI_CATEGORIES.find((c) => c.id === tab);

  // un fetch per reparto, al cambio tab
  useEffect(() => {
    let annullato = false;
    getAlimentari(tab)
      .then((data) => {
        if (annullato) return;
        setItems(data || []);
        setLoadedFor(tab);
      })
      .catch(() => {
        if (annullato) return;
        setItems([]);
        setLoadedFor(tab);
      });
    return () => {
      annullato = true;
    };
  }, [tab]);

  // testata ferma (titolo + tab): la pagina non scorre, scorre solo il
  // contenitore .page-scroll — stesso meccanismo della pagina Enoteca.
  // Niente category-open: la tab bar in basso deve restare visibile.
  useEffect(() => {
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, []);

  const gruppi = groupBySub(items);
  const gruppoAperto = gruppi.find((g) => g.id === openGroup);

  return (
    <section className="shop-section">
      {/* titolo, tab e (dentro un gruppo) ritorno + nome del gruppo
          restano fermi in cima: scorre solo il contenuto sotto */}
      <div className="section-sticky">
        <h2 className="section-title">Alimentari</h2>

        {/* tab dei reparti: Gastronomia | Dolceria */}
        <nav className="group-tabs" aria-label="Reparti">
          {ALIMENTARI_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={"group-tab" + (tab === c.id ? " is-active" : "")}
              style={{ "--accent": c.accent }}
              onClick={() => {
                setTab(c.id);
                setSheetItem(null); // cambio reparto: chiude la scheda aperta
                setOpenGroup(null);
              }}
            >
              {c.label}
            </button>
          ))}
        </nav>

        {gruppoAperto && (
          <>
            <button
              type="button"
              className="back-btn"
              onClick={() => setOpenGroup(null)}
            >
              ← {activeCategory.label}
            </button>
            <h3 className="sub-title">{gruppoAperto.label}</h3>
          </>
        )}
      </div>

      {loading ? (
        <p className="product-empty">Caricamento…</p>
      ) : items.length === 0 ? (
        <p className="product-empty">
          Il catalogo è in arrivo — torna a trovarci presto.
        </p>
      ) : gruppoAperto ? (
        <ul className="product-list page-scroll">
          {gruppoAperto.items.map((p, i) => (
            <ProductCard
              key={p.id || p.name + i}
              w={p}
              accent={activeCategory.accent}
              onOpen={setSheetItem}
              type="alimentari"
            />
          ))}
        </ul>
      ) : (
        <ul className="mini-grid page-scroll">
          {gruppi.map((g) => (
            <li className="mini-cell" key={g.id || "altro"}>
              <button
                type="button"
                className="mini-card mini-card--filigrana"
                style={{ "--accent": activeCategory.accent }}
                onClick={() => setOpenGroup(g.id)}
              >
                <CategoryIcon
                  label={g.label}
                  className="mini-icon-watermark"
                  weight="fill"
                />
                <span className="mini-name">{g.label}</span>
                <span className="mini-count">{g.items.length} prodotti</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {sheetItem && (
        <ProductSheet
          w={sheetItem}
          category={activeCategory}
          onClose={() => setSheetItem(null)}
          type="alimentari"
        />
      )}
    </section>
  );
}

export default Gastronomia;
