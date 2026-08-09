import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import { ProductCard, ProductSheet } from "../enoteca/Enoteca";
import { getAlimentari } from "../../services/alimentari";
import { normalize } from "../../utils/normalize";
import { productSlug } from "../../utils/productSlug";
import "./gastronomia.css";


const SENZA_GRUPPO = "senza-gruppo";

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


const groupKey = (g) => g.id || SENZA_GRUPPO;
const groupHref = (g) => encodeURIComponent(groupKey(g));

function Gastronomia() {
  const navigate = useNavigate();
  const { reparto, groupId, productId } = useParams();
  const [tabState, setTabState] = useState(ALIMENTARI_CATEGORIES[0].id);
  const repartoValido = ALIMENTARI_CATEGORIES.some((c) => c.id === reparto);
  const tab = repartoValido ? reparto : tabState;

  const [items, setItems] = useState([]);

  const [loadedFor, setLoadedFor] = useState(null);
  const loading = loadedFor !== tab;

  const activeCategory = ALIMENTARI_CATEGORIES.find((c) => c.id === tab);

  const gruppi = groupBySub(items);
  const gruppoAperto = gruppi.find((g) => groupKey(g) === groupId);

  const groupOpen = Boolean(groupId);


  const sheetItem = productId
    ? items.find((i) => productSlug(i) === productId) ?? null
    : null;

  // groupId qui è già decodificato: va ri-codificato per rientrare in un URL
  const groupPath = groupId
    ? `/alimentari/${tab}/${encodeURIComponent(groupId)}`
    : "/alimentari";

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


  useEffect(() => {
    if (!groupOpen) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("category-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("category-open");
    };
  }, [groupOpen]);

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
          {gruppi.map((g) => {
            const illustrazione = activeCategory.illustrazioni?.[g.id];
            return (
              <li className="mini-cell" key={g.id || SENZA_GRUPPO}>
                <button
                  type="button"
                  className="mini-card mini-card--filigrana"
                  style={{ "--accent": activeCategory.accent }}
                  onClick={() => navigate(`/alimentari/${tab}/${groupHref(g)}`)}
                >
                  {illustrazione && (
                    <img
                      src={illustrazione}
                      alt=""
                      className="mini-icon-watermark mini-icon-watermark--img"
                      loading="lazy"
                    />
                  )}
                  <span className="mini-name">{g.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Gastronomia;
