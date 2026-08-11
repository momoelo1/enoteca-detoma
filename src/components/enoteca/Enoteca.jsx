import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SHOP_GROUPS, COUNTRY_GROUPS, WHATSAPP_NUMBER } from "../../data/data";
import { getWines } from "../../services/wines";
import { getBeers } from "../../services/beers";
import { GlobeIcon } from "../icons/NavIcons";
import { CategoryIcon } from "../icons/CategoryIcon";
import { productSlug } from "../../utils/productSlug";
import { trimBorder } from "../../utils/cloudinary";
import {
  Jar,
  JarLabel,
  Fish,
  Bread,
  Leaf,
  Drop,
  Carrot,
  CookingPot,
  Cherries,
} from "@phosphor-icons/react";
import "./enoteca.css";

// id nell'URL: vedi utils/productSlug.js (condiviso con la pagina Alimentari)

// `formato` è un numero puro nel database: l'unità è implicita e dipende
// dal tipo di prodotto (le birre si misurano in centilitri, gli alimentari
// in grammi). Un tipo non elencato mostra il numero senza unità.
const FORMATO_UNIT = {
  birre: "cl",
  alimentari: "g",
};

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

// Segnaposto per gli alimentari: una bottiglia di vino non rappresenta un
// vasetto di miele o un pacco di taralli. L'icona si sceglie dalle PAROLE
// di sottocategoria e tipo, non da un elenco fisso di gruppi: così regge
// anche i gruppi nuovi che l'admin può inventare dal pannello.
// Ordine significativo: vince la prima regola che corrisponde.
const FOOD_ICON_RULES = [
  [/pesc|tonno|ittic|acciug|sgombr|salmon/, Fish],
  [/pane|forno|biscott|tarall|grissin|snack|scaldatell|bastoncin|spaghett|pasta/, Bread],
  [/pesto|basilic/, Leaf],
  [/miele|alveare|propoli|polline/, Drop],
  [/verdur|carciof|peperon|sott.olio|oliva|olive/, Carrot],
  [/sugo|sughi|ragu|salsa|passata|condiment|mostard|senap|tartufo/, CookingPot],
  [/confettur|composta|marmellat|frutta|sciroppat|amaren|gelso|ciliegi/, Cherries],
  [/crema|creme|pate|bruschett|cioccolat|pistacch|caramell/, JarLabel],
];

// normalize() toglie gli accenti: le regole sopra sono senza ("ragù"→"ragu")
const foodIcon = (item) => {
  const hay = normalize(`${item.sottocategoria || ""} ${item.tipo || ""}`);
  const rule = FOOD_ICON_RULES.find(([re]) => re.test(hay));
  return rule ? rule[1] : Jar; // il vasetto è il contenitore più comune qui
};

// sceglie il segnaposto giusto per il tipo di prodotto: bottiglia per
// vini/birre/distillati, icona alimentare per gastronomia e dolceria
function ProductPlaceholder({ item, type, className }) {
  if (type !== "alimentari") return <BottleIcon className={className} />;
  // createElement e non <Icon />: l'icona è scelta a runtime e il React
  // Compiler leggerebbe un componente "creato durante il render"
  return createElement(foodIcon(item), {
    className: `${className} product-food-svg`,
    weight: "thin",
    color: "currentColor",
    "aria-hidden": true,
  });
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

// card categoria compatta: un tocco → lista prodotti.
// `filigrana`: l'immagine diventa lo sfondo della card, ancorata in basso a
// destra e sfumata, con il nome davanti — è la scelta di vini e distillati,
// che hanno le illustrazioni incise, e degli alimentari.
// Senza, l'immagine resta al centro a piena opacità: è la scelta delle birre,
// che i loghi dei birrifici ce l'hanno e vanno mostrati per intero.
// Senza né immagine né illustrazione resta l'icona monocroma.
export function MiniCard({ c, onClick, filigrana = false }) {
  const icon = { id: c.id, label: c.short || c.label };
  const sfondo = c.illustrazione || c.img;
  return (
    <li className="mini-cell">
      <button
        type="button"
        className={"mini-card" + (filigrana ? " mini-card--filigrana" : "")}
        style={{ "--accent": c.accent }}
        onClick={onClick}
      >
        {filigrana ? (
          sfondo ? (
            <img
              src={sfondo}
              alt=""
              className="mini-icon-watermark mini-icon-watermark--img"
              loading="lazy"
            />
          ) : (
            <CategoryIcon {...icon} className="mini-icon-watermark" weight="fill" />
          )
        ) : sfondo ? (
          <img src={sfondo} alt="" className="mini-img" loading="lazy" />
        ) : (
          <CategoryIcon {...icon} className="mini-icon-svg" />
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

// Card essenziale (vini, birre, alimentari): foto, nome, sottotitolo,
// badge di specifiche (gradazione/formato quando presenti), prezzo.
// Tutto il resto vive nel bottom sheet: si apre toccando la card.
// `type` (es. "vini"/"birre"/"distillati"/"alimentari", da SHOP_GROUPS.id):
// aggiunge una classe modificatore per-tipo su card e immagine, così si può
// dare uno stile diverso a un tipo di prodotto senza toccare quelle condivise
export function ProductCard({ w, accent, regionFilter, onOpen, type }) {
  const annate = w.annate;
  const prezzo = w.prezzo != null ? w.prezzo : annate?.[0]?.prezzo; // default: 1ª annata
  // regione già selezionata nel filtro: non ripeterla su ogni card
  // (trim: nel database alcune regioni hanno uno spazio finale spurio)
  const regione = w.regione?.trim() !== regionFilter ? w.regione : null;
  const sub = regione || w.stile || w.colore || w.tipo;
  const formatoLabel =
    w.formato != null ? `${w.formato}${FORMATO_UNIT[type] || ""}` : null;

  // il sottotitolo può essere lungo quanto vuole (stile birra, regione...):
  // stessa dimensione testo su ogni card, mai a capo, mai tagliato — se non
  // ci sta su una riga scorre avanti e indietro (marquee) invece di rimpicciolire
  const metaRef = useRef(null);
  const [metaScroll, setMetaScroll] = useState(false);
  useLayoutEffect(() => {
    const el = metaRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.parentElement.clientWidth;
    if (overflow > 0) {
      el.style.setProperty("--marquee-shift", `-${overflow + 6}px`);
      setMetaScroll(true);
    } else {
      setMetaScroll(false);
    }
  }, [sub]);


  const nameRef = useRef(null);
  const [nameScroll, setNameScroll] = useState(false);
  useLayoutEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    const overflow = el.scrollHeight - el.parentElement.clientHeight;
    if (overflow > 0) {
      el.style.setProperty("--marquee-shift-y", `-${overflow + 4}px`);
      setNameScroll(true);
    } else {
      setNameScroll(false);
    }
  }, [w.name]);

  
  const cardRef = useRef(null);
  const [nameInView, setNameInView] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !nameScroll) return;
    const list = el.closest(".product-list");
    if (!list) {
      setNameInView(true); // nessun contenitore che scorre: anima e basta
      return;
    }
    // niente IntersectionObserver (due tentativi, su telefono vero
    // continuava a far partire la riga "che sbircia"): misura diretta
    // dei rettangoli. La card è "in vista" solo se il suo box sta per
    // intero dentro il box visibile della lista. Il controllo gira a
    // scroll fermo (120ms dopo l'ultimo evento, quando lo snap si è
    // assestato su una riga piena): mentre si scorre l'animazione è
    // spenta, appena la riga si posa completa parte da zero
    let timer = 0;
    const check = () => {
      const lr = list.getBoundingClientRect();
      const cr = el.getBoundingClientRect();
      setNameInView(cr.top >= lr.top - 2 && cr.bottom <= lr.bottom + 2);
    };
    const onScroll = () => {
      setNameInView(false);
      clearTimeout(timer);
      timer = setTimeout(check, 120);
    };
    check();
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(timer);
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [nameScroll]);

  const typeSuffix = type ? ` product-card--${type}` : "";

  return (
    <li className={"product-card" + typeSuffix}>
      <button
        type="button"
        className={"product-card-btn" + (type ? ` product-card-btn--${type}` : "")}
        style={{ "--accent": accent }}
        onClick={() => onOpen(w)}
        ref={cardRef}
      >
        <div className={"product-thumb" + (type ? ` product-thumb--${type}` : "")}>
          {w.img ? (
            <img
              src={type === "alimentari" ? trimBorder(w.img) : w.img}
              alt=""
              className={"product-thumb-img" + (type ? ` product-thumb-img--${type}` : "")}
              loading="lazy"
            />
          ) : (
            <ProductPlaceholder
              item={w}
              type={type}
              className={"product-thumb-svg" + (type ? ` product-thumb-svg--${type}` : "")}
            />
          )}
        </div>
        <span className="product-name-wrap">
          <span
            className={
              "product-name" +
              (nameScroll && nameInView ? " product-name--scroll" : "")
            }
            ref={nameRef}
          >
            {w.name}
          </span>
        </span>
        {sub && (
          <span
            className={"product-meta-wrap" + (metaScroll ? " product-meta-wrap--scroll" : "")}
          >
            <span
              className={"product-meta" + (metaScroll ? " product-meta--scroll" : "")}
              ref={metaRef}
            >
              {sub}
            </span>
          </span>
        )}
        {(w.gradazione || formatoLabel) && (
          <span className="product-spec-row">
            {w.gradazione && <span className="product-spec-badge">{w.gradazione}</span>}
            {formatoLabel && <span className="product-spec-badge">{formatoLabel}</span>}
          </span>
        )}
        {prezzo != null && (
          <span className="product-price">{formatPrezzo(prezzo)}</span>
        )}
      </button>
    </li>
  );
}

// Bottom sheet: pannello che sale dal basso (pattern familiare tipo social /
// delivery) con foto grande, descrizione completa e tabella annate/prezzi.
// Si chiude con ✕, tocco sullo sfondo o Esc.
export function ProductSheet({ w, category, onClose, type }) {
  const desc = w.description || w.descrizione;
  const annate = w.annate;
  // "Rosso" dentro "Vini Rossi" è ovvio: stessa radice (ross-) → non ripeterlo
  const coloreRidondante =
    w.colore &&
    category?.label?.toLowerCase().includes(w.colore.slice(0, 4).toLowerCase());
  // ogni voce diventa una chip a sé (si legge a colpo d'occhio, invece
  // di un'unica riga grigia separata da puntini)
  const metaItems = [
    w.denominazione,
    w.uvaggio,
    w.stile,
    w.tipo,
    coloreRidondante ? null : w.colore,
    w.gradazione,
    w.regione,
    w.provenienza,
  ].filter(Boolean);
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

  // trascinamento verso il basso per chiudere (come i pannelli commenti
  // di Instagram): segue il dito 1:1 mentre si trascina, poi scatta via
  // se si supera la soglia oppure torna su elastica altrimenti. Parte
  // solo dal bordo/contenuto non interattivo e solo quando il contenuto
  // interno è già in cima — così non ruba lo scroll della descrizione.
  const scrollRef = useRef(null);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startDragYRef = useRef(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);

  const onDragStart = (e) => {
    if (closing) return;
    if (e.target.closest("a, button")) return; // pulsanti/link intatti
    if ((scrollRef.current?.scrollTop ?? 0) > 0) return; // sta scorrendo il contenuto
    draggingRef.current = true;
    startYRef.current = e.clientY;
    startDragYRef.current = dragY;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onDragMove = (e) => {
    if (!draggingRef.current) return;
    const next = Math.max(0, startDragYRef.current + (e.clientY - startYRef.current));
    setDragY(next);
  };
  const onDragEnd = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const sheetHeight = e.currentTarget.offsetHeight || 400;
    if (dragY > sheetHeight * 0.28) {
      setClosing(true); // scivola via, poi onClose al termine (vedi onTransitionEnd)
    } else {
      setDragY(0); // sotto soglia: torna su
    }
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className={
          "product-sheet" +
          (type ? ` product-sheet--${type}` : "") +
          (dragging ? " product-sheet--dragging" : "")
        }
        style={{
          "--accent": category?.accent,
          transform: closing
            ? "translateY(100%)"
            : dragY
            ? `translateY(${dragY}px)`
            : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={w.name}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={(e) => {
          if (closing && e.propertyName === "transform") onClose();
        }}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
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
        {/* contenuto scrollabile: qualunque sia la lunghezza della
            descrizione, resta confinato qui dentro invece di spingere
            in giro il resto del pannello — il bottone WhatsApp sotto
            sta sempre fermo nello stesso punto */}
        <div className="sheet-scroll" ref={scrollRef}>
          <div className={"sheet-thumb" + (type ? ` sheet-thumb--${type}` : "")}>
            {w.img ? (
              <img
                src={type === "alimentari" ? trimBorder(w.img) : w.img}
                alt=""
                className={"sheet-img" + (type ? ` sheet-img--${type}` : "")}
              />
            ) : (
              <ProductPlaceholder
                item={w}
                type={type}
                className={"sheet-svg" + (type ? ` sheet-svg--${type}` : "")}
              />
            )}
          </div>
          <h3 className="sheet-name">{w.name}</h3>
          {metaItems.length > 0 && (
            <ul className="sheet-meta-chips">
              {metaItems.map((m, i) => (
                <li key={i} className="sheet-meta-chip">
                  {m}
                </li>
              ))}
            </ul>
          )}
          {desc && (
            <div className="sheet-desc-block">
              <span className="sheet-desc-label">Note di degustazione</span>
              <span className="sheet-divider" aria-hidden="true" />
              <p className="sheet-desc">{desc}</p>
            </div>
          )}
          {annate?.length > 0 && (
            <div className="sheet-annate">
              <span className="sheet-label">Annate e prezzi</span>
              <ul className="product-annate-list">
                {annate.map((a, i) => (
                  <li
                    key={a.anno}
                    className={
                      "product-annate-row" +
                      (i === 0 ? " product-annate-row--current" : "")
                    }
                  >
                    <span className="product-annate-year">{a.anno}</span>
                    <span className="product-annate-price">
                      {formatPrezzo(a.prezzo)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {WHATSAPP_NUMBER && (
          <a
            className="sheet-cta"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="sheet-cta-icon" viewBox="0 0 448 512" aria-hidden="true">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            Chiedi disponibilità
          </a>
        )}
      </div>
    </div>
  );
}

function Enoteca() {
  const navigate = useNavigate();
  // gruppo/categoria/prodotto vivono nell'URL, non in uno state locale:
  // un refresh (o un link diretto) rilegge semplicemente gli stessi
  // parametri e riapre esattamente nello stesso punto, scheda inclusa
  const { groupId, categoryId, productId } = useParams();
  const [regionFilter, setRegionFilter] = useState(null); // regione/paese selezionato
  const [barView, setBarView] = useState("regioni"); // vista barra: regioni | mondo
  const [barMode, setBarMode] = useState(null); // barra regioni aperta: null | "regioni"
  const [searchOpen, setSearchOpen] = useState(false); // campo di ricerca in-place
  const [searchText, setSearchText] = useState(""); // testo del filtro di ricerca
  const [hiding, setHiding] = useState(false); // spegnimento: rientra, poi si smonta
  const [closing, setClosing] = useState(false); // animazione di rientro barra (uscita pagina)
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

  const activeGroup = SHOP_GROUPS.find((g) => g.id === groupId);
  const activeCategory = activeGroup?.categories.find(
    (c) => c.id === categoryId
  );

  // ogni volta che cambia la categoria (anche al primo caricamento di un
  // link diretto) i filtri ripartono puliti: reset "durante il render"
  // (pattern consigliato da React per azzerare stato al cambio di prop,
  // stesso usato in WineManager/BeerManager) invece di un giro di effect
  const [resetFor, setResetFor] = useState(categoryId);
  if (categoryId !== resetFor) {
    setResetFor(categoryId);
    setRegionFilter(null);
    setBarView("regioni");
    setBarMode(null);
    setSearchOpen(false);
    setSearchText("");
    setHiding(false);
  }

  // fonte dei prodotti: dall'API se la categoria è "remote", altrimenti
  // il vecchio array statico — il resto della pagina non nota differenza
  const sourceItems = activeCategory?.remote
    ? remoteByCategory[activeCategory.id] ?? []
    : activeCategory?.items ?? [];

  // lo spazio finale (es. "Piemonte ") che a volte sporca il dato nel
  // database creerebbe un secondo filtro identico a vista ma diverso in
  // realtà: tolto qui, alla fonte, prima di costruire il Set
  const filterValues = activeCategory?.filterBy
    ? [
        ...new Set(
          sourceItems
            .map((i) => i[activeCategory.filterBy]?.trim())
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
      regionFilter
        ? i[activeCategory.filterBy]?.trim() === regionFilter
        : true
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

  // prodotto aperto nel bottom sheet: derivato dall'URL, cercato tra
  // TUTTI gli articoli della categoria (non solo quelli filtrati) così un
  // link diretto funziona anche se un filtro lo escluderebbe
  const sheetWine = productId
    ? sourceItems.find((i) => productSlug(i) === productId) ?? null
    : null;

  const categoryPath = groupId && categoryId ? `/enoteca/${groupId}/${categoryId}` : "/enoteca";
  const openProduct = (w) => navigate(`${categoryPath}/${productSlug(w)}`);
  const closeProduct = () => navigate(categoryPath);

  // ogni cambio di livello riparte dall'inizio della pagina
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [groupId, categoryId]);

  const hasRegionBar = Boolean(activeCategory) && filterValues.length >= 2;
  const canSearch = Boolean(activeCategory) && sourceItems.length >= 10;
  const barOpen = Boolean(barMode);
  useEffect(() => {
    if (!activeCategory) return;
    document.body.classList.add("home-no-scroll");
    // distinta da home-no-scroll (che la Home usa già per sé): serve solo
    // a nascondere la tab bar quando si è dentro una categoria (vini/rossi
    // ecc.), non ogni volta che home-no-scroll è attivo
    document.body.classList.add("category-open");
    if (barOpen && !closing && !hiding)
      document.body.classList.add("region-bar-open");
    else document.body.classList.remove("region-bar-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("category-open");
      document.body.classList.remove("region-bar-open");
    };
  }, [activeCategory, barOpen, closing, hiding]);

  // pagina Enoteca (nessuna categoria aperta): la pagina non scorre, scorre
  // solo la griglia delle categorie, così titolo e tab restano fermi.
  // Riusa home-no-scroll (la stessa catena flex di home.css) SENZA
  // category-open, che nasconderebbe la tab bar — qui deve restare.
  useEffect(() => {
    if (activeCategory) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, [activeCategory]);

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


  const closeCategory = () => navigate("/enoteca");

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
                      <GlobeIcon />
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
          <p className="product-empty">Caricamento…</p>
        ) : sourceItems.length === 0 ? (
          <p className="product-empty">
            Il catalogo è in arrivo — torna a trovarci presto.
          </p>
        ) : visibleItems.length === 0 ? (
          <p className="product-empty">
            Nessun risultato. Prova a cambiare ricerca o regione.
          </p>
        ) : (
          <ul className="product-list" key={regionFilter || "tutti"} ref={listRef}>
            {visibleItems.map((w, i) => (
              <ProductCard
                key={w.name + i}
                w={w}
                accent={activeCategory.accent}
                regionFilter={regionFilter}
                onOpen={openProduct}
                type={activeGroup.id}
              />
            ))}
          </ul>
        )}
        {sheetWine && (
          <ProductSheet
            w={sheetWine}
            category={activeCategory}
            onClose={closeProduct}
            type={activeGroup.id}
          />
        )}
      </section>
    );
  }

  // un tocco solo: dalla pagina Enoteca dritti alla lista prodotti
  const openDirect = (gId, cId) => navigate(`/enoteca/${gId}/${cId}`);

  const tabG = SHOP_GROUPS.find((g) => g.id === tabGroup);

  return (
    <section className="shop-section">
      <div className="section-sticky">
        <h2 className="section-title">Enoteca</h2>
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
      </div>

      {tabG ? (
        <ul className="mini-grid page-scroll">
          {tabG.categories.map((c) => (
            <MiniCard
              key={c.id}
              c={c}
              /* filigrana ovunque tranne che nelle birre: i loghi dei
                 birrifici restano al centro, a piena opacità */
              filigrana={tabG.id !== "birre"}
              onClick={() => openDirect(tabG.id, c.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="product-empty">
          I consigli della casa arrivano presto — torna a trovarci.
        </p>
      )}
    </section>
  );
}

export default Enoteca;
