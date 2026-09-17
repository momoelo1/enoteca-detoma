import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALIMENTARI_CATEGORIES } from "../../data/data";
import {
  ProductCard,
  ProductSheet,
  GroupTabs,
  ListaFantasma,
  GrigliaFantasma,
  ORO_CASA,
} from "../enoteca/Enoteca";
import Immagine from "../immagine/Immagine";
import { effettoTocco } from "../effetti/effetti";
import {
  getAlimentari,
  getAlimentariConsigliati,
} from "../../services/alimentari";
import { ricorda, gia, CHIAVI } from "../../services/cache";
import { normalize } from "../../utils/normalize";
import { productSlug } from "../../utils/productSlug";
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

  // quel che di questo reparto è già stato scaricato in questa visita
  // (services/cache.js): rientrando negli Alimentari la griglia è già lì
  const [items, setItems] = useState(() => gia(CHIAVI.reparto(tab)) ?? []);
  const [loadedFor, setLoadedFor] = useState(() =>
    gia(CHIAVI.reparto(tab)) ? tab : null,
  );

  // Cambio di reparto con il catalogo già in memoria: si mostra subito,
  // senza passare dalle schede vuote. È il "correggere lo stato durante il
  // render" che React documenta per reagire a un cambio di prop — lo stesso
  // modo con cui l'Enoteca azzera i filtri al cambio di categoria — e non un
  // setState dentro un effect, che il React Compiler non vuole (CLAUDE.md).
  const repartoInMemoria = gia(CHIAVI.reparto(tab));
  if (loadedFor !== tab && repartoInMemoria) {
    setItems(repartoInMemoria);
    setLoadedFor(tab);
  }

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
    ricorda(CHIAVI.reparto(tab), () => getAlimentari(tab))
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
  // sono gli STESSI della fascia "Dalla dispensa" in home: passando di lì
  // sono già in memoria e questa tab apre piena
  const [consigliati, setConsigliati] = useState(
    () => gia(CHIAVI.alimentariConsigliati) ?? null,
  );
  useEffect(() => {
    if (!consigliatiRoute || consigliati) return;
    ricorda(CHIAVI.alimentariConsigliati, getAlimentariConsigliati)
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

  // la griglia dei gruppi è una pagina indice: testata ferma e basta
  useEffect(() => {
    if (groupOpen || consigliatiRoute) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, [groupOpen, consigliatiRoute]);

  // La tab Consigliati è una lista di prodotti e scorre come un reparto, ma
  // tiene la tab bar: vedi il commento gemello in Enoteca.jsx.
  useEffect(() => {
    if (groupOpen || !consigliatiRoute) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("consigliati-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("consigliati-open");
    };
  }, [groupOpen, consigliatiRoute]);

  // Gli alimentari NON tingono lo sfondo: qui si resta sui colori di casa
  // anche a gruppo aperto. È una scelta, non una dimenticanza — tingere resta
  // dell'Enoteca. Il `null` è esplicito apposta: tiene la casa finché la
  // pagina è montata, senza dipendere dal fatto che chi arrivava prima abbia
  // ripulito la sua tinta.
  //
  // Per rimettere la tinta serve anche il colore del gruppo, che non esiste
  // più: i gruppi non hanno un accento proprio in data.js (ce l'ha il
  // reparto) e li inventa l'admin dal pannello, quindi si ricavava dalla
  // posizione nella lista con `coloreGruppoAlimentari(tab, gruppi.indexOf(g),
  // gruppi.length)` (utils/coloreCategoria.js, ancora lì).
  useAccentoSfondo(null);

  // la tab attiva: Consigliati la decide la rotta, i due reparti lo stato
  // locale (restano com'erano — non finiscono nell'URL da soli)
  const activeTab = consigliatiRoute ? "consigliati" : tab;

  const openTab = (id) => {
    if (id === "consigliati") return navigate("/alimentari/consigliati");
    setTabState(id);
    if (consigliatiRoute) navigate("/alimentari"); // si esce dai consigli
  };
  // le voci delle tab: i due reparti di data.js più la selezione della casa,
  // nello stesso oro della tab Consigliati dell'Enoteca — vale uguale nei
  // due reparti del negozio
  const vociTab = [
    ...ALIMENTARI_CATEGORIES.map((c) => ({ id: c.id, label: c.label, accent: c.accent })),
    { id: "consigliati", label: "Consigliati", accent: ORO_CASA },
  ];

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
          <ListaFantasma type="alimentari" className="product-list--alimentari" />
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
                i={i}
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

        {/* tab dei reparti: Gastronomia | Dolceria | Consigliati (stesso
            componente dell'Enoteca, con la riga che scorre fra le voci) */}
        <GroupTabs
          voci={vociTab}
          attiva={activeTab}
          onScegli={openTab}
          label="Reparti"
        />
      </div>

      {consigliatiRoute ? (
        !consigliati ? (
          <ListaFantasma type="alimentari" className="product-list--alimentari" />
        ) : consigliatiGroups.length === 0 ? (
          <p className="product-empty">
            I consigli della casa arrivano presto — torna a trovarci.
          </p>
        ) : (
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
                  {g.items.map((item, i) => (
                    <ProductCard
                      key={item.id}
                      w={item}
                      accent={g.accent}
                      onOpen={openConsigliato}
                      type="alimentari"
                      scrollSelector=".consigliati-scroll"
                      i={i}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )
      ) : loading ? (
        <GrigliaFantasma />
      ) : items.length === 0 ? (
        <p className="product-empty">
          Il catalogo è in arrivo — torna a trovarci presto.
        </p>
      ) : (
        <ul className="mini-grid page-scroll">
          {gruppi.map((g, i) => {
            const illustrazione = activeCategory.illustrazioni?.[g.id];
            return (
              /* `--i`: la posizione, per la comparsa in fila (enoteca.css) */
              <li className="mini-cell" key={g.id || SENZA_GRUPPO} style={{ "--i": i }}>
                <button
                  type="button"
                  /* `mini-card--gastronomia` / `--dolceria`: la famiglia,
                     come sulle mini-card dell'Enoteca (vedi <MiniCard>).
                     Il markup resta a mano e non passa da <MiniCard>, che
                     metterebbe un'icona in filigrana ai gruppi che
                     l'illustrazione non ce l'hanno */
                  className={`mini-card mini-card--filigrana mini-card--${tab}`}
                  /* il gruppo NON sceglie l'effetto (uno per reparto), ma
                     effetti.js lo legge per tingere gli strati del colore
                     di quel che c'è nel barattolo */
                  data-gruppo={g.id}
                  style={{ "--accent": activeCategory.accent }}
                  onClick={(e) =>
                    effettoTocco(
                      e,
                      () => navigate(`/alimentari/${tab}/${groupHref(g)}`),
                      tab,
                    )
                  }
                >
                  {illustrazione && (
                    <Immagine
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
