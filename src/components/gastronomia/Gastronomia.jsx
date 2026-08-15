import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import { ProductCard, ProductSheet } from "../enoteca/Enoteca";
import {
  getAlimentari,
  getAlimentariConsigliati,
} from "../../services/alimentari";
import { normalize } from "../../utils/normalize";
import { productSlug } from "../../utils/productSlug";
import { coloreGruppoAlimentari } from "../../utils/coloreCategoria";
import { versa } from "../transition/versa";
import { useAccentoSfondo } from "../background/tinta";
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

// ---- selezione della casa (tab "Consigliati" degli Alimentari) ----
//
// Divisi per REPARTO (Gastronomia, Dolceria) e non per sottogruppo: i
// consigliati sono pochi per definizione, e spezzarli per sottogruppo darebbe
// una fila di titoli con un vasetto sotto ciascuno. Due titoli si leggono,
// dodici sono un elenco puntato.
// L'ordine è quello di data.js, non quello di arrivo dall'API. I reparti
// vuoti spariscono: nessun titolo senza niente sotto.
const buildConsigliatiAlimentari = (items) =>
  ALIMENTARI_CATEGORIES.map((c) => ({
    key: c.id,
    label: c.label,
    accent: c.accent,
    items: items.filter((a) => a.category === c.id),
  })).filter((g) => g.items.length > 0);

// `consigliati`: la pagina è aperta sulla tab della selezione della casa.
// Stessa forma della tab Consigliati dell'Enoteca (Enoteca.jsx) — lì stanno
// bottiglie e birre, qui il cibo.
function Gastronomia({ consigliati: consigliatiRoute = false }) {
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
    // sulla tab Consigliati il catalogo del reparto non serve a nessuno
    if (consigliatiRoute) return;
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
  }, [tab, consigliatiRoute]);

  // selezione della casa: si scarica solo entrando nella tab, e una volta
  // sola. `null` = mai chiesta, ed è da lì che si deriva "sto caricando"
  // (niente setState dentro un effect per segnalarlo — vedi CLAUDE.md)
  const [consigliati, setConsigliati] = useState(null);
  useEffect(() => {
    if (!consigliatiRoute || consigliati) return;
    getAlimentariConsigliati()
      .then((d) => setConsigliati(d || []))
      // rete giù: elenco vuoto, che la pagina già sa raccontare — meglio
      // di una tab bloccata per sempre su "Caricamento…"
      .catch(() => setConsigliati([]));
  }, [consigliatiRoute, consigliati]);

  const consigliatiGroups = consigliati
    ? buildConsigliatiAlimentari(consigliati)
    : [];

  // scheda di un consigliato: cercata in tutti i reparti, così un link
  // diretto riapre il prodotto giusto qualunque sia il suo reparto
  const consigliatoAperto =
    productId && consigliati
      ? consigliatiGroups
          .flatMap((g) => g.items.map((item) => ({ item, group: g })))
          .find(({ item }) => productSlug(item) === productId) ?? null
      : null;
  const openConsigliato = (item) =>
    navigate(`/alimentari/consigliati/${productSlug(item)}`);
  const closeConsigliato = () => navigate("/alimentari/consigliati");

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

  // La tab Consigliati fa eccezione, come in Enoteca: è una pila di reparti,
  // non una griglia che sta in una schermata, quindi deve scorrere il
  // documento intero — niente page-pinned, niente home-no-scroll.
  useEffect(() => {
    if (groupOpen || consigliatiRoute) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, [groupOpen, consigliatiRoute]);

  // I gruppi non hanno un accento proprio in data.js (ce l'ha il reparto) e li
  // inventa l'admin dal pannello: il colore si ricava dalla posizione nella
  // lista, così Pesto e Miele non versano la stessa identica tinta.
  const coloreGruppo = (g) =>
    coloreGruppoAlimentari(tab, gruppi.indexOf(g), gruppi.length);

  // lo sfondo tiene il colore del gruppo aperto, come in Enoteca
  useAccentoSfondo(gruppoAperto ? coloreGruppo(gruppoAperto) : null);

  // la tab attiva: Consigliati la decide la rotta, i due reparti lo stato
  // locale (restano com'erano — non finiscono nell'URL da soli)
  const activeTab = consigliatiRoute ? "consigliati" : tab;

  const openTab = (id) => {
    setTabState(id);
    if (consigliatiRoute) navigate("/alimentari"); // si esce dai consigli
  };

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

        {/* tab dei reparti: Gastronomia | Dolceria | Consigliati */}
        <nav className="group-tabs" aria-label="Reparti">
          {ALIMENTARI_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={"group-tab" + (activeTab === c.id ? " is-active" : "")}
              style={{ "--accent": c.accent }}
              onClick={() => openTab(c.id)}
            >
              {c.label}
            </button>
          ))}
          {/* stesso oro della tab Consigliati dell'Enoteca: la selezione
              della casa vale uguale nei due reparti del negozio */}
          <button
            type="button"
            className={
              "group-tab" + (activeTab === "consigliati" ? " is-active" : "")
            }
            style={{ "--accent": "#c9a227" }}
            onClick={() => navigate("/alimentari/consigliati")}
          >
            Consigliati
          </button>
        </nav>
      </div>

      {consigliatiRoute ? (
        !consigliati ? (
          <p className="product-empty">Caricamento…</p>
        ) : consigliatiGroups.length === 0 ? (
          <p className="product-empty">
            I consigli della casa arrivano presto — torna a trovarci.
          </p>
        ) : (
          /* qui scorre il documento (nessun page-pinned, vedi l'effect
             sopra): da cui `scrollSelector="window"` sulle card, che
             altrimenti cercherebbero lo scroll in una lista che non scorre */
          <div className="consigliati-scroll">
            <p className="consigliati-intro">
              Quello che scegliamo noi dalla dispensa.
            </p>
            {consigliatiGroups.map((g) => (
              <section className="consigliati-gruppo" key={g.key}>
                <h3
                  className="consigliati-titolo"
                  style={{ "--accent": g.accent }}
                >
                  {g.label}
                </h3>
                <ul className="product-list product-list--alimentari">
                  {g.items.map((item) => (
                    <ProductCard
                      key={item.id}
                      w={item}
                      accent={g.accent}
                      onOpen={openConsigliato}
                      type="alimentari"
                      scrollSelector="window"
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )
      ) : loading ? (
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
                  onClick={() =>
                    versa(coloreGruppo(g), () =>
                      navigate(`/alimentari/${tab}/${groupHref(g)}`)
                    )
                  }
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
      {consigliatoAperto && (
        <ProductSheet
          w={consigliatoAperto.item}
          category={consigliatoAperto.group}
          onClose={closeConsigliato}
          type="alimentari"
        />
      )}
    </section>
  );
}

export default Gastronomia;
