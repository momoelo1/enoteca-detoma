import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import { ProductCard, ProductSheet } from "../enoteca/Enoteca";
import { getAlimentari } from "../../services/alimentari";
import { CategoryIcon } from "../icons/CategoryIcon";
import { normalize } from "../../utils/normalize";
import { productSlug } from "../../utils/productSlug";
import "./gastronomia.css";

// gruppo dei prodotti senza sottocategoria: serve un id non vuoto per
// poterlo mettere nell'URL come tutti gli altri
const SENZA_GRUPPO = "senza-gruppo";

// raggruppa per `sottocategoria`. La chiave è normalizzata (senza spazi
// ai bordi, minuscola, senza accenti) perché è testo libero scritto a
// mano dal pannello admin: "Formaggi", "formaggi " e "Formaggì" sono lo
// stesso reparto e devono finire in una mini-card sola. Stessa logica dei
// filtri regione dell'Enoteca, dove lo spazio finale sporco nel database
// creava due filtri identici a vista. L'etichetta mostrata è la prima
// grafia incontrata, così a schermo resta quella scritta dal negozio.
function groupBySub(items) {
  const map = new Map();
  for (const item of items) {
    const label = item.sottocategoria?.trim() || "";
    const id = label ? normalize(label) : "";
    if (!map.has(id)) {
      map.set(id, { id, label: label || "Altro", items: [] });
    }
    map.get(id).items.push(item);
  }
  return [...map.values()].sort((a, b) => {
    if (!a.id) return 1; // "Altro" sempre per ultimo
    if (!b.id) return -1;
    return a.label.localeCompare(b.label, "it");
  });
}

// chiave del gruppo così com'è nell'URL UNA VOLTA DECODIFICATO: useParams
// restituisce già il valore decodificato ("sughi e condimenti"), quindi il
// confronto va fatto sul valore vero, non su quello percent-encoded —
// altrimenti non combacia mai e nessun gruppo viene trovato.
const groupKey = (g) => g.id || SENZA_GRUPPO;
// la codifica serve solo quando l'indirizzo viene scritto
const groupHref = (g) => encodeURIComponent(groupKey(g));

// Due livelli: tab dei reparti (Gastronomia | Dolceria) → griglia delle
// sottocategorie → lista prodotti del gruppo scelto. Card e bottom sheet
// sono gli stessi dell'Enoteca.
function Gastronomia() {
  const navigate = useNavigate();
  // gruppo e prodotto aperti stanno nell'URL, non nello stato: al refresh
  // o su un link diretto si resta dov'era. Il reparto invece è una tab
  // locale finché non si entra in un gruppo — come tabGroup nell'Enoteca —
  // e compare nell'URL solo da lì in giù, perché serve a ritrovare il
  // gruppo dopo il refresh.
  const { reparto, groupId, productId } = useParams();
  const [tabState, setTabState] = useState(ALIMENTARI_CATEGORIES[0].id);
  const repartoValido = ALIMENTARI_CATEGORIES.some((c) => c.id === reparto);
  const tab = repartoValido ? reparto : tabState;

  const [items, setItems] = useState([]);
  // reparto per cui `items` è già stato caricato: finché non combacia con
  // la tab attiva siamo in caricamento. Ricavarlo così (invece di un
  // setLoading(true) dentro l'effetto) evita il render a cascata che il
  // React Compiler segnala — stesso schema usato in AdminWineCard
  const [loadedFor, setLoadedFor] = useState(null);
  const loading = loadedFor !== tab;

  const activeCategory = ALIMENTARI_CATEGORIES.find((c) => c.id === tab);

  const gruppi = groupBySub(items);
  const gruppoAperto = gruppi.find((g) => groupKey(g) === groupId);
  // il livello dipende dall'URL, non dai dati: appena c'è un groupId siamo
  // dentro un gruppo, anche mentre i prodotti stanno ancora arrivando —
  // altrimenti un link diretto mostrerebbe per un attimo la griglia
  const groupOpen = Boolean(groupId);

  // prodotto aperto nel bottom sheet: cercato tra TUTTI i prodotti del
  // reparto, non solo quelli del gruppo, così un link diretto funziona
  // anche se il gruppo nell'URL non combacia più
  const sheetItem = productId
    ? items.find((i) => productSlug(i) === productId) ?? null
    : null;

  // groupId qui è già decodificato: va ri-codificato per rientrare in un URL
  const groupPath = groupId
    ? `/alimentari/${tab}/${encodeURIComponent(groupId)}`
    : "/alimentari";

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

  // ogni cambio di livello riparte dall'inizio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [groupId]);

  // dentro un gruppo la testata sparisce del tutto (niente .section-sticky):
  // stessa logica dell'Enoteca dentro una categoria. category-open nasconde
  // anche la tab bar, così la lista prodotti ha tutto lo schermo.
  useEffect(() => {
    if (!groupOpen) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("category-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("category-open");
    };
  }, [groupOpen]);

  // pagina Alimentari (nessun gruppo aperto): testata ferma (titolo + tab),
  // la pagina non scorre, scorre solo la griglia — stesso meccanismo della
  // pagina Enoteca. Niente category-open: qui la tab bar deve restare.
  useEffect(() => {
    if (groupOpen) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, [groupOpen]);

  const closeGroup = () => {
    // tornando indietro l'URL perde il reparto: va ricordato nella tab
    // locale, altrimenti la griglia riparte da Gastronomia
    setTabState(tab);
    navigate("/alimentari");
  };
  const openProduct = (p) => navigate(`${groupPath}/${productSlug(p)}`);
  const closeProduct = () => navigate(groupPath);

  // dentro un gruppo: solo ritorno e nome del gruppo in cima, esattamente
  // come una categoria dell'Enoteca
  if (groupOpen) {
    return (
      <section className="shop-section">
        <button type="button" className="back-btn" onClick={closeGroup}>
          ← {activeCategory.label}
        </button>
        <div className="section-head">
          <h2 className="section-title">
            {gruppoAperto?.label ?? groupId}
          </h2>
        </div>

        {loading ? (
          <p className="product-empty">Caricamento…</p>
        ) : !gruppoAperto ? (
          <p className="product-empty">
            Questo gruppo non c'è più — torna agli Alimentari.
          </p>
        ) : (
          <ul className="product-list product-list--alimentari">
            {gruppoAperto.items.map((p, i) => (
              <ProductCard
                key={p.id || p.name + i}
                w={p}
                accent={activeCategory.accent}
                onOpen={openProduct}
                type="alimentari"
              />
            ))}
          </ul>
        )}

        {sheetItem && (
          <ProductSheet
            w={sheetItem}
            category={activeCategory}
            onClose={closeProduct}
            type="alimentari"
          />
        )}
      </section>
    );
  }

  return (
    <section className="shop-section">
      {/* titolo e tab restano fermi in cima: scorre solo la griglia */}
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
              onClick={() => setTabState(c.id)}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <p className="product-empty">Caricamento…</p>
      ) : items.length === 0 ? (
        <p className="product-empty">
          Il catalogo è in arrivo — torna a trovarci presto.
        </p>
      ) : (
        <ul className="mini-grid page-scroll">
          {gruppi.map((g) => (
            <li className="mini-cell" key={g.id || SENZA_GRUPPO}>
              <button
                type="button"
                className="mini-card mini-card--filigrana"
                style={{ "--accent": activeCategory.accent }}
                onClick={() => navigate(`/alimentari/${tab}/${groupHref(g)}`)}
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
    </section>
  );
}

export default Gastronomia;
