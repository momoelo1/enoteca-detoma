import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SHOP_GROUPS, COUNTRY_GROUPS, WHATSAPP_NUMBER } from "../../data/data";
import { getWines, getWinesConsigliati } from "../../services/wines";
import { getBeers, getBeersConsigliate } from "../../services/beers";
import { getDistillati } from "../../services/distillati";
import { ricorda, gia, CHIAVI } from "../../services/cache";
import { CategoryIcon } from "../icons/CategoryIcon";
import { productSlug, vicini } from "../../utils/productSlug";
import {
  formatPrezzo,
  prezzoProdotto,
  formatiAnnata,
  comboFormati,
  etichettaFormato,
} from "../../utils/prezzo";
import { fotoProdotto, fotoProdotti } from "../../utils/cloudinary";
import { coloreVersata } from "../../utils/coloreCategoria";
import { useAccentoSfondo, ctaDaAccento } from "../background/tinta";
import Immagine from "../immagine/Immagine";
import { effettoTocco } from "../effetti/effetti";
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
  CaretLeft,
  CaretRight,
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

// Nome del formato sulle pastiglie della scheda: la 0,75 L è "Standard".
// Solo qui — card, tabella "Annate e prezzi" e messaggio WhatsApp continuano
// a usare etichettaFormato. `ml` vuoto (annata non migrata) vale come 0,75.
const nomeFormatoScheda = (ml) =>
  ml == null || ml === "" || ml === 750
    ? "Standard"
    : etichettaFormato(ml, { sempre: true });

// normalizza per la ricerca: minuscolo e senza accenti ("Cà"→"ca")
const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

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
  [
    /pane|forno|biscott|tarall|grissin|snack|scaldatell|bastoncin|spaghett|pasta/,
    Bread,
  ],
  [/pesto|basilic/, Leaf],
  [/miele|alveare|propoli|polline/, Drop],
  [/verdur|carciof|peperon|sott.olio|oliva|olive/, Carrot],
  [/sugo|sughi|ragu|salsa|passata|condiment|mostard|senap|tartufo/, CookingPot],
  [
    /confettur|composta|marmellat|frutta|sciroppat|amaren|gelso|ciliegi/,
    Cherries,
  ],
  [/crema|creme|pate|bruschett|cioccolat|pistacch|caramell/, JarLabel],
];

// normalize() toglie gli accenti: le regole sopra sono senza ("ragù"→"ragu")
const foodIcon = (item) => {
  const hay = normalize(`${item.sottocategoria || ""} ${item.tipo || ""}`);
  const rule = FOOD_ICON_RULES.find(([re]) => re.test(hay));
  return rule ? rule[1] : Jar; // il vasetto è il contenitore più comune qui
};

// sceglie il segnaposto giusto per il tipo di prodotto: bottiglia per
// vini/birre/distillati, icona alimentare per gastronomia e dolceria.
// Esportato: lo usa anche la fascia dei consigli in home (Home.jsx)
export function ProductPlaceholder({ item, type, className }) {
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
// `i`: la posizione nella griglia, che il CSS usa come ritardo d'entrata
// (le card compaiono una dopo l'altra — vedi .mini-cell in enoteca.css).
// `famiglia`: il gruppo a cui la card appartiene (vini, birre, distillati…).
// Finisce in una classe — `mini-card--birre` — e decide l'effetto al tocco:
// la macchia di vino ai vini, le bollicine alle birre, niente ai distillati
// finché non si sceglie (vedi `effettoPer` in components/effetti/effetti.js).
// La rotta cambia a effetto quasi finito, e ci pensa `effettoTocco`: chi usa
// questa card passa il suo onClick di sempre.
export function MiniCard({ c, onClick, filigrana = false, i, famiglia }) {
  const icon = { id: c.id, label: c.short || c.label };
  const sfondo = c.illustrazione || c.img;
  return (
    <li className="mini-cell" style={{ "--i": i }}>
      <button
        type="button"
        className={
          "mini-card" +
          (filigrana ? " mini-card--filigrana" : "") +
          (famiglia ? ` mini-card--${famiglia}` : "")
        }
        style={{ "--accent": c.accent }}
        onClick={(e) => effettoTocco(e, onClick, famiglia)}
      >
        {filigrana ? (
          sfondo ? (
            <Immagine
              src={sfondo}
              alt=""
              className="mini-icon-watermark mini-icon-watermark--img"
              loading="lazy"
            />
          ) : (
            <CategoryIcon
              {...icon}
              className="mini-icon-watermark"
              weight="fill"
            />
          )
        ) : sfondo ? (
          <Immagine src={sfondo} alt="" className="mini-img" loading="lazy" />
        ) : (
          <CategoryIcon {...icon} className="mini-icon-svg" />
        )}
        <span className="mini-name">{c.short || c.label}</span>
      </button>
    </li>
  );
}

// L'oro della selezione della casa: la tab "Consigliati" (qui e negli
// Alimentari) e la stella sulle card. È l'unico colore del sito che non
// arriva da un --accent di categoria — un consiglio vale uguale ovunque.
export const ORO_CASA = "#c9a227";

// Le tab dei gruppi: Vini | Birre | Distillati | Consigliati qui,
// Gastronomia | Dolceria | Consigliati negli Alimentari. Stesso markup di
// prima, con una differenza: la riga d'accento sotto la tab attiva è UN
// elemento solo (.group-tabs-riga) che SCORRE da una voce all'altra, invece di
// spegnersi su una tab e accendersi sull'altra. Una pseudo-classe su ogni
// tab non può animarsi verso un'altra tab, quindi la riga va posata a mano:
// si misura dov'è la tab attiva e lo si scrive in tre variabili CSS sul nav.
// Niente stato React per questo — la misura finisce dritta nello stile del
// nodo, come fanno già le card col marquee (--marquee-shift).
//
// `voci`: [{ id, label, accent }]. `attiva`: l'id della tab accesa.
export function GroupTabs({ voci, attiva, onScegli, label }) {
  const navRef = useRef(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let vivo = true;
    const misura = () => {
      const el = nav.querySelector(".group-tab.is-active");
      if (!vivo || !el) return;
      nav.style.setProperty("--riga-x", `${el.offsetLeft}px`);
      nav.style.setProperty("--riga-w", `${el.offsetWidth}px`);
      nav.style.setProperty(
        "--riga-colore",
        el.style.getPropertyValue("--accent"),
      );
    };
    misura();
    // le tab sono in Cormorant: al primo layout il ripiego (Georgia) è più
    // largo e la riga uscirebbe più lunga della tab — si rimisura a font
    // arrivato, come Home.jsx fa per i nomi
    document.fonts?.ready.then(misura);
    // La prima misura POSA la riga, non la fa arrivare da sinistra: la
    // transizione si accende al giro dopo, a riga già disegnata al suo posto.
    // Una classe messa a mano sul nodo: React non la tocca, perché il
    // className del nav non cambia mai.
    const pronta = requestAnimationFrame(() => {
      if (vivo) nav.classList.add("group-tabs--pronta");
    });
    window.addEventListener("resize", misura);
    return () => {
      vivo = false;
      cancelAnimationFrame(pronta);
      window.removeEventListener("resize", misura);
    };
  }, [attiva]);

  return (
    <nav className="group-tabs" aria-label={label} ref={navRef}>
      {voci.map((v) => (
        <button
          key={v.id}
          type="button"
          className={"group-tab" + (attiva === v.id ? " is-active" : "")}
          style={{ "--accent": v.accent }}
          onClick={() => onScegli(v.id)}
        >
          {v.label}
        </button>
      ))}
      <span className="group-tabs-riga" aria-hidden="true" />
    </nav>
  );
}

// ---- schede vuote: il catalogo mentre i prodotti arrivano ----
// Stessa idea delle schede fantasma della fascia in home (Home.jsx): la
// scatola è quella delle card vere — stessa misura, stesso vetro — così
// quando i prodotti arrivano cambia il contenuto e non il telaio. Al posto
// del "Caricamento…" in Cormorant, che era una riga di testo in mezzo a una
// pagina vuota. Le due misure (thumb, righe) stanno in enoteca.css accanto
// alle card che imitano.
export function FantasmaProdotto({ i, type }) {
  return (
    <li className="product-card product-card--fantasma" style={{ "--i": i }}>
      <div
        className={
          "product-card-btn product-card-btn--fantasma" +
          (type ? ` product-card-btn--${type}` : "")
        }
      >
        <span className="fantasma-blocco fantasma-prodotto-thumb" />
        <span className="fantasma-blocco fantasma-prodotto-riga" />
        <span className="fantasma-blocco fantasma-prodotto-riga fantasma-prodotto-riga--corta" />
        <span className="fantasma-blocco fantasma-prodotto-prezzo" />
        <span className="fantasma-riflesso" aria-hidden="true" />
      </div>
    </li>
  );
}

// Sei e non tre: devono ECCEDERE la prima schermata (due colonne sul
// telefono, tre righe da 260px), altrimenti la lista sembra corta e finita
// invece che una griglia che si sta riempiendo. Stesso ragionamento di
// QUANTI_FANTASMI in Home.jsx.
const QUANTI_FANTASMI = 6;

export function ListaFantasma({ type, className = "" }) {
  return (
    <ul
      className={
        "product-list product-list--fantasma" +
        (className ? ` ${className}` : "")
      }
      aria-busy="true"
      aria-label="Caricamento in corso"
    >
      {Array.from({ length: QUANTI_FANTASMI }, (_, i) => (
        <FantasmaProdotto key={i} i={i} type={type} />
      ))}
    </ul>
  );
}

// la stessa cosa per la griglia dei gruppi (Alimentari: i gruppi arrivano
// dall'API, quindi anche quella griglia aspetta)
export function FantasmaMiniCard({ i }) {
  return (
    <li className="mini-cell" style={{ "--i": i }}>
      <div className="mini-card mini-card--fantasma">
        <span className="fantasma-blocco fantasma-mini-nome" />
        <span className="fantasma-riflesso" aria-hidden="true" />
      </div>
    </li>
  );
}

export function GrigliaFantasma() {
  return (
    <ul
      className="mini-grid page-scroll"
      aria-busy="true"
      aria-label="Caricamento in corso"
    >
      {Array.from({ length: QUANTI_FANTASMI }, (_, i) => (
        <FantasmaMiniCard key={i} i={i} />
      ))}
    </ul>
  );
}

// una fetch per gruppo (vini → getWines, birre → getBeers, distillati →
// getDistillati): ogni gruppo "remote" ha il suo endpoint, non tutti i
// prodotti sono vini
const REMOTE_FETCHERS = {
  vini: getWines,
  birre: getBeers,
  distillati: getDistillati,
};

// categorie "remote: true" (es. rossi, tutte le birre): calcolate una
// volta sola, non cambiano mai a runtime (dipendono solo da SHOP_GROUPS,
// statico). Ogni voce porta con sé il fetcher del proprio gruppo.
const REMOTE_CATEGORIES = SHOP_GROUPS.flatMap((g) =>
  (g.categories || [])
    .filter((c) => c.remote)
    .map((c) => ({ ...c, fetcher: REMOTE_FETCHERS[g.id] })),
);

// Quel che di queste categorie è già stato scaricato in questa visita
// (services/cache.js). Serve come stato INIZIALE della pagina: rientrando in
// Enoteca la lista è già lì, invece di ricomparire dopo un giro di schede
// vuote. Le categorie mai chieste non entrano nell'oggetto — `undefined` e
// "elenco vuoto" devono restare due cose diverse.
const categorieInMemoria = () =>
  Object.fromEntries(
    REMOTE_CATEGORIES.map((c) => [c.id, gia(CHIAVI.categoria(c.id))]).filter(
      ([, items]) => items !== undefined,
    ),
  );

// ---- selezione della casa (tab "Consigliati") ----

const VINI_GROUP = SHOP_GROUPS.find((g) => g.id === "vini");
const BIRRE_GROUP = SHOP_GROUPS.find((g) => g.id === "birre");

// la selezione della casa già in memoria, nella forma che vuole lo stato:
// servono tutt'e due gli elenchi, con uno solo si aspetta comunque
const consigliatiInMemoria = () => {
  const vini = gia(CHIAVI.viniConsigliati);
  const birre = gia(CHIAVI.birreConsigliate);
  return vini && birre ? { vini, birre } : null;
};

// I consigli dell'Enoteca arrivano da due endpoint e qui tornano un elenco
// solo, diviso per categoria: delle bottiglie scelte si leggono come una
// selezione solo se restano ordinate (i rossi con i rossi), altrimenti sono
// un mucchio. L'ordine è quello di data.js, non quello di arrivo dall'API.
// Le birre non si dividono per birrificio: sarebbero gruppi da un pezzo.
// I gruppi vuoti spariscono: nessun titolo senza niente sotto.
//
// Gli ALIMENTARI non stanno più qui: hanno la loro tab "Consigliati" dentro
// la pagina Alimentari (Gastronomia.jsx). Stavano insieme quando i consigli
// erano una vetrina sola; adesso che li sceglie il negozio, un miele in fondo
// alla selezione dell'enoteca era solo fuori posto.
const buildConsigliatiGroups = ({ vini, birre }) =>
  [
    ...VINI_GROUP.categories.map((c) => ({
      key: `vini-${c.id}`,
      label: c.label,
      accent: c.accent,
      type: "vini",
      items: vini.filter((w) => w.category === c.id),
    })),
    {
      key: "birre",
      label: BIRRE_GROUP.label,
      accent: BIRRE_GROUP.accent,
      type: "birre",
      items: birre,
    },
  ].filter((g) => g.items.length > 0);

// `i`: la posizione nella lista, che il CSS usa come ritardo d'entrata (le
// card compaiono una dopo l'altra — vedi .product-card in enoteca.css)
export function ProductCard({
  w,
  accent,
  regionFilter,
  onOpen,
  type,
  scrollSelector = ".product-list",
  i,
}) {
  const annate = w.annate;
  const prezzo = prezzoProdotto(w); // vini: primo formato prezzato
  // regione già selezionata nel filtro: non ripeterla su ogni card
  // (trim: nel database alcune regioni hanno uno spazio finale spurio)
  const regione = w.regione?.trim() !== regionFilter ? w.regione : null;
  const sub = regione || w.stile || w.colore || w.tipo;

  // Badge del formato. Birre e alimentari ce l'hanno sul prodotto (`formato`,
  // numero puro); i vini dentro l'annata, dove ce ne può essere più d'uno.
  // Per i vini si mostra SOLO quando il formato è unico e fuori misura — le
  // mezze bottiglie dei passiti, che oggi il negozio scrive nel nome. Con
  // due formati un badge solo mentirebbe: quella storia la racconta la scheda.
  const formatiVino = formatiAnnata(annate?.[0]);
  const formatoLabel =
    w.formato != null
      ? `${w.formato}${FORMATO_UNIT[type] || ""}`
      : formatiVino.length === 1
        ? etichettaFormato(formatiVino[0].ml)
        : null;

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
    // "window": a scorrere è il documento (tab Consigliati), non un
    // contenitore — il box visibile è allora quello della finestra
    const perFinestra = scrollSelector === "window";
    const list = perFinestra ? null : el.closest(scrollSelector);
    if (!list && !perFinestra) {
      setNameInView(true); // nessun contenitore che scorre: anima e basta
      return;
    }
    const scroller = list ?? window;
    // niente IntersectionObserver (due tentativi, su telefono vero
    // continuava a far partire la riga "che sbircia"): misura diretta
    // dei rettangoli. La card è "in vista" solo se il suo box sta per
    // intero dentro il box visibile della lista. Il controllo gira a
    // scroll fermo (120ms dopo l'ultimo evento, quando lo snap si è
    // assestato su una riga piena): mentre si scorre l'animazione è
    // spenta, appena la riga si posa completa parte da zero
    let timer = 0;
    const check = () => {
      const lr = list
        ? list.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
      const cr = el.getBoundingClientRect();
      setNameInView(cr.top >= lr.top - 2 && cr.bottom <= lr.bottom + 2);
    };
    const onScroll = () => {
      setNameInView(false);
      clearTimeout(timer);
      timer = setTimeout(check, 120);
    };
    check();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(timer);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [nameScroll, scrollSelector]);

  const typeSuffix = type ? ` product-card--${type}` : "";

  // Qui la miniatura volava fino al riquadro del pannello (`vola`,
  // utils/volo.js, con la View Transitions API). Tolto: la scheda ora sale
  // dal basso e basta — è il gesto che i pannelli di questo tipo hanno
  // dappertutto, e il volo lo contraddiceva tenendo il pannello fermo al suo
  // posto mentre la foto lo raggiungeva.
  // Con il volo se ne va anche la sua @keyframes `sheet-up`, che `volo.js`
  // spegneva apposta a fine transizione: adesso parte sempre.

  return (
    <li className={"product-card" + typeSuffix} style={{ "--i": i }}>
      <button
        type="button"
        className={
          "product-card-btn" + (type ? ` product-card-btn--${type}` : "")
        }
        style={{ "--accent": accent }}
        onClick={() => onOpen(w)}
        ref={cardRef}
      >
        {/* contrassegno della selezione della casa: si vede anche mentre si
            scorre il catalogo intero, non solo nella tab Consigliati */}
        {w.consigliato && (
          <span
            className="product-consigliato"
            role="img"
            aria-label="Consigliato dall'enoteca"
            title="Consigliato dall'enoteca"
          >
            ★
          </span>
        )}
        <div
          className={"product-thumb" + (type ? ` product-thumb--${type}` : "")}
        >
          {/* la card mostra SEMPRE la prima foto, anche quando il prodotto ne
              ha diverse: a farle scorrere è la scheda. E si controlla l'URL,
              non `w.img` — quello è un array e un array vuoto è truthy (vedi
              elencoFoto in utils/cloudinary.js) */}
          {fotoProdotto(w, type) ? (
            <Immagine
              src={fotoProdotto(w, type)}
              alt=""
              className={
                "product-thumb-img" +
                (type ? ` product-thumb-img--${type}` : "")
              }
              loading="lazy"
            />
          ) : (
            <ProductPlaceholder
              item={w}
              type={type}
              className={
                "product-thumb-svg" +
                (type ? ` product-thumb-svg--${type}` : "")
              }
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
            className={
              "product-meta-wrap" +
              (metaScroll ? " product-meta-wrap--scroll" : "")
            }
          >
            <span
              className={
                "product-meta" + (metaScroll ? " product-meta--scroll" : "")
              }
              ref={metaRef}
            >
              {sub}
            </span>
          </span>
        )}
        {(w.gradazione || formatoLabel) && (
          <span className="product-spec-row">
            {w.gradazione && (
              <span className="product-spec-badge">{w.gradazione}</span>
            )}
            {formatoLabel && (
              <span className="product-spec-badge">{formatoLabel}</span>
            )}
          </span>
        )}
        {prezzo != null && (
          <span className="product-price">{formatPrezzo(prezzo)}</span>
        )}
      </button>
    </li>
  );
}

// Sotto questo corpo il nome smette di leggersi come il titolo della scheda e
// comincia a somigliare a una didascalia: lì si preferisce mandarlo a capo.
// A 15px stanno su una riga 386 vini su 547; a 13 sarebbero 449, ma accanto a
// un prezzo di 29px un nome di 13 non è più la cosa più importante del
// pannello.
const CORPO_NOME_MIN = 15;

// Bottom sheet: pannello che sale dal basso (pattern familiare tipo social /
// delivery) con foto grande, descrizione completa e tabella annate/prezzi.
// Si chiude con ✕, tocco sullo sfondo, Esc o trascinandolo giù — e in tutti
// e quattro i casi scivola via prima di smontarsi (vedi `chiudi` più sotto).
//
// `prec` / `succ`: i prodotti accanto a questo nella lista da cui è stato
// aperto (null ai capi), e `onVai(prodotto)` porta la scheda su uno di loro.
// Sul telefono ci si passa scorrendo di lato, sul desktop con le due frecce
// ai fianchi del pannello.
export function ProductSheet({
  w,
  category,
  onClose,
  type,
  prec = null,
  succ = null,
  onVai,
}) {
  const desc = w.description || w.descrizione;
  const annate = w.annate;
  // La scheda dei VINI ha un'impaginazione sua (bottiglia grande, regione come
  // occhiello, prezzo accanto al nome), e cambia pure forma con lo schermo:
  // incolonnata sul telefono, a copertina nella finestra desktop. Il markup è
  // lo stesso per tutti i tipi — a impaginarlo è il CSS, blocco "SCHEDA
  // PRODOTTO — VINI" in fondo a enoteca.css. Qui si decide solo COSA esiste.
  const vini = type === "vini";
  // "Rosso" dentro "Vini Rossi" è ovvio: stessa radice (ross-) → non ripeterlo
  const coloreRidondante =
    w.colore &&
    category?.label?.toLowerCase().includes(w.colore.slice(0, 4).toLowerCase());
  // la provenienza come occhiello sopra il nome: è quello che il cliente
  // guarda per primo, e lassù non costa la riga di chip che costa qui sotto —
  // in catalogo è quasi sempre l'unica chip che esiste (misurato il
  // 2026-09-09: 356 vini su 383 hanno `regione`, e nessuno ha denominazione,
  // uvaggio, stile, tipo, colore o gradazione).
  const luogo = vini ? w.regione || w.provenienza : null;
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
  // il posto dov'è finito `luogo`: la chip corrispondente porta un
  // modificatore, così una variante che mostra l'occhiello può spegnere il
  // doppione senza che il JSX debba sapere quale variante è attiva
  const chipLuogo = (m) => luogo && (m === w.regione || m === w.provenienza);
  // ---- la bottiglia scelta ----
  // Annate e formati appiattiti in un elenco solo (utils/prezzo.js): il
  // cliente ne sceglie uno, e il prezzo grande accanto al nome è il suo. Prima
  // il numero là in cima era sempre il primo formato prezzato e gli altri
  // vivevano solo nella tabella in fondo alla scheda — sotto la piega su un
  // telefono, cioè invisibili a chi non scorre una scheda che sembra finita.
  //
  // Solo i vini: sono gli unici ad avere il prezzo in testata, e senza quello
  // il selettore non avrebbe niente da muovere.
  const combo = vini ? comboFormati(annate) : [];
  const [iSceltaGrezza, setIScelta] = useState(0);
  // aprire un altro prodotto riparte dalla prima bottiglia (stesso modo in cui
  // più sotto si rimette a posto l'indice delle foto)
  const [idScelta, setIdScelta] = useState(w.id);
  if (w.id !== idScelta) {
    setIdScelta(w.id);
    setIScelta(0);
  }
  const iScelta = combo.length ? Math.min(iSceltaGrezza, combo.length - 1) : 0;
  const scelta = combo[iScelta] ?? null;
  // gli anni sono la riga di chip a destra del prezzo, i formati quella sotto.
  // `filter(Boolean)`: gli spumanti non hanno annata (models/Wine.js la rende
  // facoltativa proprio per loro) e lì la riga degli anni non esiste.
  const anni = [...new Set(combo.map((c) => c.anno).filter(Boolean))];
  const formatiScelta = anni.length
    ? combo.filter((c) => c.anno === scelta?.anno)
    : combo;
  // con una bottiglia sola non c'è niente da scegliere: la pastiglia del
  // formato si vede lo stesso (accesa), ma il prezzo e il messaggio WhatsApp
  // restano quelli di sempre
  const sceglibile = combo.length > 1;

  const prezzo = vini
    ? sceglibile
      ? scelta?.prezzo
      : prezzoProdotto(w)
    : null;
  // la tabella "Annate e prezzi" in fondo non dice altro che quel prezzo una
  // seconda volta quando c'è una riga sola con un formato solo — e quando
  // invece ce n'è più d'una lo dice adesso il selettore, sopra la piega.
  // Resta viva per i tipi che il selettore non tocca (birre, alimentari).
  const annateRidondanti = vini && (prezzo != null || sceglibile);
  // il formato scelto finisce nel messaggio: chi scrive al negozio chiede il
  // magnum del 2022, non "quel vino lì"
  const dettaglio =
    sceglibile && scelta
      ? ` (${[scelta.anno, etichettaFormato(scelta.ml, { sempre: true })]
          .filter(Boolean)
          .join(" ")})`
      : "";
  // Il bottone WhatsApp dei vini, più chiaro dei bottoni della pagina (vedi
  // ctaDaAccento in background/tinta.js). I Rossi restano com'erano: il loro
  // bordeaux è quello giusto. `category.id` c'è solo aprendo la scheda dalla
  // pagina di una categoria: i gruppi dei Consigliati non ne hanno uno, e lì il
  // bottone resta del verde di casa come tutta la pagina.
  const ctaTinta =
    vini && category?.id && category.id !== "rossi"
      ? ctaDaAccento(coloreVersata(category))
      : null;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Buongiorno, vorrei informazioni su: ${w.name}${dettaglio}`,
  )}`;

  // ---- il nome su una riga sola ----
  // Il nome è il pezzo più variabile della scheda, ed è quello che la fa
  // scorrere. Misurati i 547 vini in catalogo su un telefono da 390px, con
  // Marcellus vero: a 19,5px ne stanno su una riga 225, gli altri 322 vanno a
  // due righe (296), tre (21) o quattro (5).
  //
  // Nessun corpo UNICO li mette tutti su una riga — a 12px, illeggibile per un
  // titolo, 67 andrebbero ancora a capo ("Valdobbiadene Prosecco Superiore DOCG
  // Cuvé…" non ci sta a nessuna misura sensata). Quindi il corpo lo decide il
  // nome: si scende di mezzo punto per volta finché sta su una riga, e ci si
  // ferma a CORPO_MIN. Sotto quella soglia il nome va a capo come prima — due
  // righe sono meglio di un titolo illeggibile, e tagliarlo non si può: la
  // scheda è aperta proprio per leggere quel nome per intero.
  //
  // Si rimisura dopo `document.fonts.ready`: prima che Marcellus arrivi il
  // browser impagina in Georgia, che è più stretta, e il corpo scelto sarebbe
  // troppo grande. È lo stesso errore che in ProductCard accendeva il marquee
  // a sproposito.
  const nomeRef = useRef(null);
  useLayoutEffect(() => {
    if (!vini) return;
    let vivo = true;
    const adatta = () => {
      const n = nomeRef.current;
      if (!vivo || !n) return;
      n.style.fontSize = ""; // si riparte sempre dal corpo del CSS
      const righe = () => {
        const s = getComputedStyle(n);
        const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2;
        return Math.round(n.getBoundingClientRect().height / lh);
      };
      let corpo = parseFloat(getComputedStyle(n).fontSize);
      while (corpo > CORPO_NOME_MIN && righe() > 1) {
        corpo = Math.max(CORPO_NOME_MIN, corpo - 0.5);
        n.style.fontSize = `${corpo}px`;
      }
    };
    adatta();
    document.fonts?.ready.then(adatta);
    return () => {
      vivo = false;
    };
  }, [vini, w.id, w.name]);

  // ---- le foto del prodotto ----
  // Sulla card se ne vede una sola, la prima. Qui si vedono tutte, a turno.
  const foto = fotoProdotti(w, type);
  const [iFoto, setIFoto] = useState(0);
  // la rotazione si spegne al primo tocco su un puntino: chi ha scelto una
  // foto la sta guardando, e vedersela cambiare sotto gli occhi è una piccola
  // sconfitta. Non si riaccende più finché la scheda resta aperta.
  const [autoFoto, setAutoFoto] = useState(true);

  // Aprire un altro prodotto senza smontare il pannello (oggi non capita —
  // tutti e quattro i punti che montano ProductSheet lo tolgono per chiudere —
  // ma è una garanzia che costa poco): l'indice tornerebbe puntato sulla terza
  // foto di un vino che ne ha una. È il modo che React documenta per correggere
  // uno stato quando cambia una prop, senza passare da un effect.
  const [idMostrato, setIdMostrato] = useState(w.id);
  if (w.id !== idMostrato) {
    setIdMostrato(w.id);
    setIFoto(0);
    setAutoFoto(true);
  }

  // sei secondi: abbastanza per guardare una bottiglia senza che la scheda
  // sembri un carosello pubblicitario
  const ATTESA_FOTO = 6000;
  useEffect(() => {
    if (foto.length < 2 || !autoFoto) return;
    // chi ha chiesto meno animazioni al sistema operativo si sfoglia le foto
    // da sé con i puntini
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setIFoto((i) => (i + 1) % foto.length),
      ATTESA_FOTO,
    );
    return () => clearInterval(t);
  }, [foto.length, autoFoto]);

  // ---- la chiusura ----
  // Passa SEMPRE di qui, da qualunque gesto arrivi (✕, sfondo, Esc,
  // trascinamento): il pannello scivola giù (transform in linea più sotto,
  // con la transition di .product-sheet) e lo sfondo si schiarisce, e solo a
  // fine corsa si smonta davvero — `onClose` cambia rotta e il pannello
  // sparisce dall'albero. Prima solo il trascinamento faceva così: ✕, sfondo
  // ed Esc smontavano di colpo, e la scheda aveva un'entrata animata e
  // un'uscita a scatto.
  const [closing, setClosing] = useState(false);
  const chiudi = () => setClosing(true);
  // `onClose` una volta sola: arriva da transitionend, o dalla rete di
  // sicurezza qui sotto se transitionend non arriva (scheda in una tab in
  // secondo piano, transizione interrotta). Cambiare rotta due volte
  // metterebbe due voci uguali nella cronologia.
  const chiusoRef = useRef(false);
  useEffect(() => {
    if (!closing) return;
    // poco più della corsa (0.28s in enoteca.css)
    const t = setTimeout(() => {
      if (chiusoRef.current) return;
      chiusoRef.current = true;
      onClose();
    }, 450);
    return () => clearTimeout(t);
  }, [closing, onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setClosing(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Finché il pannello è aperto, quello che scorre sotto sta fermo: vedi
  // body.sheet-open in enoteca.css. Serve al trascinamento — il dito parte
  // quasi sempre da `.sheet-scroll`, che ha `touch-action: pan-y` perché la
  // descrizione lunga si deve poter scorrere; quando invece non c'è niente da
  // scorrere lì dentro, il browser considera il gesto uno scorrimento e lo
  // passa al primo contenitore che può scorrere, cioè la lista dietro. Così
  // la lista scivolava via mentre si cercava di chiudere la scheda.
  // Sta qui dentro, sul componente condiviso, perché vale per OGNI scheda:
  // vini, birre, alimentari, reparti e Consigliati si comportano uguale senza
  // che nessuna pagina debba ricordarsene.
  useEffect(() => {
    document.body.classList.add("sheet-open");
    return () => document.body.classList.remove("sheet-open");
  }, []);

  // ---- il passaggio al prodotto accanto ----
  // Il pannello esce da un lato (fase "esce"), la rotta cambia sul vicino,
  // e il pannello — lo stesso, non smontato — rientra dall'altro lato (fase
  // "entra": messo di là senza transizione, poi lasciato tornare al centro).
  // `corto` sono le frecce del desktop: lì la finestra sta in mezzo allo
  // schermo e attraversarlo tutto sarebbe un viaggio, quindi si sposta di
  // poco e sfuma. Lo scorrimento del telefono invece porta il pannello fuori
  // per intero, come una carta spinta via dal dito.
  const scrollRef = useRef(null);
  const gestoRef = useRef(null); // il gesto del dito in corso (vedi più sotto)
  const [dragY, setDragY] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [passo, setPasso] = useState(null); // null | { dir, fase, corto }
  const destRef = useRef(null);
  const uscitaFattaRef = useRef(false);

  const vai = (dir, corto) => {
    const dest = dir > 0 ? succ : prec;
    if (!dest || !onVai || passo || closing) return;
    // Chi ha chiesto meno movimento cambia scheda e basta. Niente attese di
    // transitionend: è lo stesso tranello per cui la barra delle regioni non
    // si chiude più con "riduci movimento" (aspetta un animationend che quella
    // regola sopprime).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDragX(0);
      onVai(dest);
      return;
    }
    destRef.current = dest;
    uscitaFattaRef.current = false;
    setPasso({ dir, fase: "esce", corto });
  };
  // `onVai` una volta sola, come `onClose`: dal transitionend del pannello o
  // dalla rete di sicurezza qui sotto
  const fineUscita = () => {
    if (uscitaFattaRef.current) return;
    uscitaFattaRef.current = true;
    onVai(destRef.current);
  };
  useEffect(() => {
    if (passo?.fase !== "esce") return;
    // poco più della corsa d'uscita (0.22s in enoteca.css)
    const t = setTimeout(() => {
      if (uscitaFattaRef.current) return;
      uscitaFattaRef.current = true;
      onVai(destRef.current);
    }, 400);
    return () => clearTimeout(t);
  }, [passo, onVai]);
  // Il vicino è arrivato: di qui il pannello si rimette in piedi. Il resto
  // della scheda (foto, bottiglia scelta, corpo del nome) si riallinea da sé
  // nei blocchi più sopra, che già guardavano il cambio di prodotto. Lo slug e
  // non `w.id`: i prodotti statici un id non ce l'hanno.
  const slug = productSlug(w);
  const [slugMostrato, setSlugMostrato] = useState(slug);
  if (slug !== slugMostrato) {
    setSlugMostrato(slug);
    setDragX(0);
    setDragY(0);
    if (passo) setPasso({ ...passo, fase: "entra" });
  }
  // due fotogrammi: il primo dipinge il pannello di là, fermo; solo dal
  // secondo la transizione ha un punto di partenza da cui muoversi
  useEffect(() => {
    if (passo?.fase !== "entra") return;
    let r2;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setPasso(null));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [passo]);
  // la scheda nuova si legge dall'inizio, non dal punto in cui si era
  // arrivati scorrendo la descrizione di quella prima
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [slug]);
  // La prima foto dei due vicini si scarica già adesso: quando il pannello
  // rientra la bottiglia c'è, invece di comparire a metà corsa.
  useEffect(() => {
    for (const x of [prec, succ]) {
      const src = x && fotoProdotti(x, type)[0];
      if (src) new Image().src = src;
    }
  }, [prec, succ, type]);

  // ---- i gesti del dito ----
  // Un gesto solo, deciso nei primi 6px: di lato è il passaggio al vicino,
  // in giù è la chiusura.
  //
  // In giù (come i pannelli commenti di Instagram): segue il dito 1:1 mentre
  // si trascina, poi scatta via se si supera la soglia oppure torna su
  // elastica altrimenti. Parte solo dal bordo/contenuto non interattivo e solo
  // quando il contenuto interno è già in cima — così non ruba lo scroll della
  // descrizione.
  //
  // Di lato: solo col dito (o la penna). Col mouse trascinare di lato vuol
  // dire selezionare il testo, e sul desktop ci sono le frecce. Può partire
  // anche da una pastiglia o dal bottone WhatsApp: il pannello si prende il
  // puntatore appena il gesto è deciso, e da lì il tocco non arriva più al
  // bottone sotto il dito. Verso un lato senza vicino il pannello si muove lo
  // stesso, frenato, e torna indietro: dice "qui finisce" senza parole.
  const onDragStart = (e) => {
    if (closing || passo) return;
    gestoRef.current = {
      x: e.clientX,
      y: e.clientY,
      t: e.timeStamp,
      dy0: dragY,
      asse: null,
      verticale:
        !e.target.closest("a, button") && // pulsanti/link intatti
        (scrollRef.current?.scrollTop ?? 0) <= 0, // sta scorrendo il contenuto
      laterale: e.pointerType !== "mouse" && Boolean(onVai && (prec || succ)),
    };
  };
  const onDragMove = (e) => {
    const g = gestoRef.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (!g.asse) {
      if (Math.hypot(dx, dy) < 6) return;
      if (g.laterale && Math.abs(dx) > Math.abs(dy)) g.asse = "x";
      else if (g.verticale) g.asse = "y";
      else {
        gestoRef.current = null;
        return;
      }
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (g.asse === "x") setDragX((dx < 0 ? succ : prec) ? dx : dx * 0.3);
    else setDragY(Math.max(0, g.dy0 + dy));
  };
  const onDragEnd = (e) => {
    const g = gestoRef.current;
    gestoRef.current = null;
    if (!g?.asse) return;
    setDragging(false);
    if (g.asse === "y") {
      const sheetHeight = e.currentTarget.offsetHeight || 400;
      if (dragY > sheetHeight * 0.28) {
        chiudi(); // scivola via, poi onClose al termine (vedi onTransitionEnd)
      } else {
        setDragY(0); // sotto soglia: torna su
      }
      return;
    }
    // di lato: basta un quarto di pannello, oppure un colpo secco anche
    // corto — chi sfoglia in fretta non trascina fino a metà schermo.
    // Interrotto dal browser (pointercancel) si torna sempre al centro.
    const larghezza = e.currentTarget.offsetWidth || 360;
    const velocita = Math.abs(dragX) / Math.max(1, e.timeStamp - g.t);
    const dir = dragX < 0 ? 1 : -1;
    const deciso =
      e.type !== "pointercancel" &&
      (dir > 0 ? succ : prec) &&
      (Math.abs(dragX) > larghezza * 0.25 ||
        (Math.abs(dragX) > 40 && velocita > 0.5));
    if (deciso) vai(dir, false);
    else setDragX(0);
  };

  // la posizione del pannello: la chiusura vince su tutto, poi il passaggio
  // al vicino, poi il dito
  const spostamento = (() => {
    if (closing) return "translateY(100%)";
    if (passo) {
      // "esce" va dal lato opposto al vicino, "entra" arriva dal suo
      const verso = passo.fase === "esce" ? -passo.dir : passo.dir;
      return `translateX(${verso * (passo.corto ? 48 : 110)}${passo.corto ? "px" : "%"})`;
    }
    if (dragX) return `translateX(${dragX}px)`;
    if (dragY) return `translateY(${dragY}px)`;
    return undefined;
  })();

  return (
    <div
      className={"sheet-backdrop" + (closing ? " sheet-backdrop--chiude" : "")}
      onClick={chiudi}
    >
      <div
        className={
          "product-sheet" +
          (type ? ` product-sheet--${type}` : "") +
          // "entra" è il pannello messo di là da fermo: niente transizione,
          // come mentre lo tiene il dito
          (dragging || passo?.fase === "entra"
            ? " product-sheet--dragging"
            : "") +
          (passo?.fase === "esce" ? " product-sheet--esce" : "")
        }
        style={{
          "--accent": category?.accent,
          "--cta-tinta": ctaTinta ?? undefined,
          transform: spostamento,
          opacity: passo?.corto ? 0 : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={w.name}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={(e) => {
          // solo la corsa del pannello stesso: transitionend risale anche
          // dai figli (i puntini delle foto, il bottone WhatsApp) e pure
          // quelli transitano `transform`
          if (e.target !== e.currentTarget) return;
          if (e.propertyName !== "transform") return;
          if (passo?.fase === "esce") return fineUscita();
          if (!closing || chiusoRef.current) return;
          chiusoRef.current = true;
          onClose();
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
          onClick={chiudi}
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
          {/* .sheet-hero e .sheet-ident sono `display: contents` per tutti i
              tipi tranne i vini: senza di loro riquadro e nome tornano a
              essere figli diretti della colonna, impilati come sempre */}
          <div className="sheet-hero">
            <div
              className={"sheet-thumb" + (type ? ` sheet-thumb--${type}` : "")}
            >
              {/* le foto stanno tutte nel DOM, sovrapposte, e a turno una sola
                  è opaca: così il cambio è una dissolvenza fra le due e non uno
                  scatto su un riquadro vuoto mentre la prossima si scarica.
                  Con una foto sola il ciclo gira a vuoto e si vede quella. */}
              {foto.length > 0 ? (
                foto.map((src, i) => (
                  <span
                    key={src}
                    className={
                      "sheet-foto" + (i === iFoto ? " sheet-foto--attiva" : "")
                    }
                    aria-hidden={i === iFoto ? undefined : true}
                  >
                    <img
                      src={src}
                      alt=""
                      className={
                        "sheet-img" + (type ? ` sheet-img--${type}` : "")
                      }
                    />
                  </span>
                ))
              ) : (
                <ProductPlaceholder
                  item={w}
                  type={type}
                  className={"sheet-svg" + (type ? ` sheet-svg--${type}` : "")}
                />
              )}
            </div>
            {/* i puntini compaiono solo se c'è davvero qualcosa da sfogliare */}
            {foto.length > 1 && (
              <div
                className="sheet-punti"
                role="tablist"
                aria-label="Foto del prodotto"
              >
                {foto.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    role="tab"
                    aria-selected={i === iFoto}
                    aria-label={`Foto ${i + 1} di ${foto.length}`}
                    className={
                      "sheet-punto" +
                      (i === iFoto ? " sheet-punto--attivo" : "")
                    }
                    onClick={() => {
                      setIFoto(i);
                      setAutoFoto(false);
                    }}
                  />
                ))}
              </div>
            )}
            <div className="sheet-ident">
              {luogo && <span className="sheet-eyebrow">{luogo}</span>}
              <h3 className="sheet-name" ref={nomeRef}>
                {w.name}
              </h3>
              {/* La riga resta anche quando la bottiglia scelta non ha prezzo
                  (un magnum lasciato a zero nel pannello): al posto del
                  prezzo un trattino, come nella tabella delle annate, e
                  accanto le annate, che prima sparivano insieme al prezzo. */}
              {vini && (
                <p className="sheet-prezzo">
                  <span className="sheet-prezzo-val">
                    {prezzo != null ? formatPrezzo(prezzo) : "—"}
                  </span>
                  {/* Le annate, a destra del prezzo — dove fino a ieri c'era
                      la scritta "Annata 2024". Sono pastiglie SEMPRE, anche
                      quando l'annata è una sola (oggi tutti e 547 i vini in
                      catalogo): quella resta accesa e non si spegne, ed è il
                      modo di dire "questa è l'annata che vendiamo" con la
                      stessa forma che avrà quando ce ne sarà più d'una. Gli
                      spumanti senza anno non hanno niente: `anni` è vuoto.
                      Il gruppo si annuncia comunque come scelta dell'annata,
                      così chi legge con lo screen reader sente "Annata, 2024
                      selezionato" invece di un anno sospeso. */}
                  {anni.length > 0 && (
                    <span
                      className="sheet-anni"
                      role="group"
                      aria-label="Annata"
                    >
                      {anni.map((a) => (
                        <button
                          key={a}
                          type="button"
                          className={
                            "sheet-anno-chip" +
                            (a === scelta?.anno ? " sheet-anno-chip--on" : "")
                          }
                          aria-pressed={a === scelta?.anno}
                          onClick={() =>
                            setIScelta(combo.findIndex((c) => c.anno === a))
                          }
                        >
                          {a}
                        </button>
                      ))}
                    </span>
                  )}
                </p>
              )}
              {/* I formati dell'annata scelta: solo il nome, il prezzo è
                  quello grande qui sopra e cambia col tocco. La riga c'è SEMPRE, anche con
                  una bottiglia sola in tutta la scheda: come la pastiglia
                  dell'annata unica, resta accesa e dice in che formato si
                  vende. E c'è per tutta la durata della scheda anche quando
                  l'annata scelta ha un formato solo, altrimenti cambiando
                  annata il pannello si accorcerebbe sotto le dita. */}
              {formatiScelta.length > 0 && (
                <div className="sheet-formati" role="group" aria-label="Formato">
                  {formatiScelta.map((c) => {
                    const i = combo.indexOf(c);
                    return (
                      <button
                        key={c.chiave}
                        type="button"
                        className={
                          "sheet-formato" +
                          (i === iScelta ? " sheet-formato--on" : "")
                        }
                        aria-pressed={i === iScelta}
                        onClick={() => setIScelta(i)}
                      >
                        <span className="sheet-formato-nome">
                          {nomeFormatoScheda(c.ml)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {metaItems.length > 0 && (
            <ul className="sheet-meta-chips">
              {metaItems.map((m, i) => (
                <li
                  key={i}
                  className={
                    "sheet-meta-chip" +
                    (chipLuogo(m) ? " sheet-meta-chip--luogo" : "")
                  }
                >
                  {m}
                </li>
              ))}
            </ul>
          )}
          {/* qui c'era il blocco "perché lo consigliamo", con una nota scritta
              a mano dal negozio. Tolto: la selezione della casa si dice con la
              stella sulla card e basta — una nota per prodotto era un lavoro
              di scrittura che nessuno avrebbe tenuto aggiornato. */}
          {desc && (
            <div className="sheet-desc-block">
              <span className="sheet-desc-label">Note di degustazione</span>
              <span className="sheet-divider" aria-hidden="true" />
              <p className="sheet-desc">{desc}</p>
            </div>
          )}
          {annate?.length > 0 && (
            <div
              className={
                "sheet-annate" +
                (annateRidondanti ? " sheet-annate--ridondante" : "")
              }
            >
              <span className="sheet-label">Annate e prezzi</span>
              {/* la chiave è l'indice e non `a.anno`: lo stesso anno può
                  ripetersi e su champagne l'anno è sempre vuoto, quindi
                  come chiave si ripeteva già oggi */}
              <ul className="product-annate-list">
                {annate.map((a, i) => {
                  const formati = formatiAnnata(a);
                  // più formati nello stesso anno: si nomina anche la
                  // bottiglia standard, altrimenti una riga resterebbe muta
                  // accanto a "Magnum" e sembrerebbe un errore
                  const nominaTutti = formati.length > 1;
                  return (
                    <li
                      key={i}
                      className={
                        "product-annate-row" +
                        (i === 0 ? " product-annate-row--current" : "")
                      }
                    >
                      <span className="product-annate-year">{a.anno}</span>
                      {formati.length === 0 ? (
                        <span className="product-annate-price">—</span>
                      ) : (
                        <span className="product-annate-formati">
                          {formati.map((f, j) => {
                            const nome = etichettaFormato(f.ml, {
                              sempre: nominaTutti,
                            });
                            return (
                              <span className="product-annate-formato" key={j}>
                                {nome && (
                                  <span className="product-annate-ml">
                                    {nome}
                                  </span>
                                )}
                                {/* un formato può valere zero: nel pannello è
                                    il prezzo lasciato in bianco, e in archivio
                                    sono le schede mai prezzate (56 vini su 533
                                    al 2026-08-26) */}
                                <span className="product-annate-price">
                                  {f.prezzo > 0 ? formatPrezzo(f.prezzo) : "—"}
                                </span>
                              </span>
                            );
                          })}
                        </span>
                      )}
                    </li>
                  );
                })}
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
            <svg
              className="sheet-cta-icon"
              viewBox="0 0 448 512"
              aria-hidden="true"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            Chiedi disponibilità
          </a>
        )}
      </div>
      {/* Le frecce per il vicino, solo sul desktop (sul telefono le spegne il
          CSS: lì si scorre di lato). Stanno fuori dal pannello, ai suoi
          fianchi, e non si muovono con lui: il pannello va e viene, le
          frecce restano dove il mouse le ha trovate — si può cliccare di
          seguito senza inseguirle. Ai capi della lista la freccia non c'è.
          `title` col nome del vicino: passandoci sopra si sa dove si va. */}
      {onVai && prec && (
        <button
          type="button"
          className="sheet-passo sheet-passo--prec"
          onClick={(e) => {
            e.stopPropagation(); // lo sfondo chiuderebbe la scheda
            vai(-1, true);
          }}
          aria-label={`Prodotto precedente: ${prec.name}`}
          title={prec.name}
        >
          <CaretLeft weight="bold" aria-hidden="true" />
        </button>
      )}
      {onVai && succ && (
        <button
          type="button"
          className="sheet-passo sheet-passo--succ"
          onClick={(e) => {
            e.stopPropagation();
            vai(1, true);
          }}
          aria-label={`Prodotto successivo: ${succ.name}`}
          title={succ.name}
        >
          <CaretRight weight="bold" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// `consigliati`: la pagina è aperta sulla tab della selezione della casa.
// Arriva dalla rotta (App.jsx) e non dallo stato locale come le altre tab,
// perché è l'unica che ha senso condividere per link.
function Enoteca({ consigliati: consigliatiRoute = false }) {
  const navigate = useNavigate();
  // gruppo/categoria/prodotto vivono nell'URL, non in uno state locale:
  // un refresh (o un link diretto) rilegge semplicemente gli stessi
  // parametri e riapre esattamente nello stesso punto, scheda inclusa
  const { groupId, categoryId, productId } = useParams();
  const [regionFilter, setRegionFilter] = useState(null); // regione/paese selezionato
  const [barView, setBarView] = useState("regioni"); // vista barra: regioni | mondo
  const [barMode, setBarMode] = useState(null); // barra regioni aperta: null | "regioni"
  const [searchOpen, setSearchOpen] = useState(false); // campo di ricerca in-place
  const [searchChiude, setSearchChiude] = useState(false); // il campo sta uscendo di scena
  const [searchText, setSearchText] = useState(""); // testo del filtro di ricerca
  const [hiding, setHiding] = useState(false); // spegnimento: rientra, poi si smonta
  const [closing, setClosing] = useState(false); // animazione di rientro barra (uscita pagina)
  const [tabGroup, setTabGroup] = useState(SHOP_GROUPS[0].id); // tab attiva (Vini/Birre/Distillati)
  const searchRef = useRef(null); // input di ricerca, per il focus all'apertura
  const listRef = useRef(null); // lista prodotti, per riportarla in cima sui filtri
  const savedScrollRef = useRef(0); // scroll salvato prima di aprire la ricerca

  // niente array statico per le categorie "remote": i vini arrivano
  // dall'API. Si scaricano una volta sola per VISITA (services/cache.js, non
  // più a ogni ingresso in Enoteca) e si riusano sia per il conteggio totale
  // sia per la lista. Quel che è già in memoria è lì dal primo render: chi
  // torna in Enoteca dalla Home ritrova la sua categoria piena.
  const [remoteByCategory, setRemoteByCategory] = useState(categorieInMemoria);
  const [remoteLoading, setRemoteLoading] = useState(() =>
    REMOTE_CATEGORIES.some((c) => gia(CHIAVI.categoria(c.id)) === undefined),
  );
  useEffect(() => {
    // si chiedono solo quelle che mancano: al secondo ingresso non ne manca
    // nessuna e non parte niente, nemmeno un render in più
    const mancanti = REMOTE_CATEGORIES.filter(
      (c) => gia(CHIAVI.categoria(c.id)) === undefined,
    );
    if (mancanti.length === 0) return;
    Promise.all(
      mancanti.map((c) =>
        ricorda(CHIAVI.categoria(c.id), () => c.fetcher(c.id)).then((items) => [
          c.id,
          items,
        ]),
      ),
    )
      // si aggiunge a quel che c'era: le categorie già in memoria stanno
      // nello stato iniziale e non devono sparire
      .then((entries) =>
        setRemoteByCategory((prima) => ({
          ...prima,
          ...Object.fromEntries(entries),
        })),
      )
      .catch(() => {})
      .finally(() => setRemoteLoading(false));
  }, []);

  // selezione della casa: si scarica solo entrando nella tab, e una volta
  // sola. `null` = mai chiesta, ed è da lì che si deriva "sto caricando"
  // (niente setState dentro un effect per segnalarlo).
  // I vini consigliati sono gli STESSI della fascia in home: passando di lì
  // sono già in memoria e questa tab apre piena, chiedendo solo le birre.
  const [consigliati, setConsigliati] = useState(consigliatiInMemoria);
  useEffect(() => {
    if (!consigliatiRoute || consigliati) return;
    Promise.all([
      ricorda(CHIAVI.viniConsigliati, getWinesConsigliati),
      ricorda(CHIAVI.birreConsigliate, getBeersConsigliate),
    ])
      .then(([vini, birre]) => setConsigliati({ vini, birre }))
      // rete giù: elenco vuoto, che la pagina già sa raccontare — meglio
      // di una tab bloccata per sempre su "Caricamento…"
      .catch(() => setConsigliati({ vini: [], birre: [] }));
  }, [consigliatiRoute, consigliati]);

  const consigliatiGroups = consigliati
    ? buildConsigliatiGroups(consigliati)
    : [];

  // scheda di un consigliato: cercata in tutti e tre gli elenchi, così un
  // link diretto riapre il prodotto giusto qualunque sia la sua categoria.
  // Sta quassù, e non accanto al JSX che la mostra, perché serve anche
  // all'effect che blocca la pagina (più sotto) — e gli hook devono stare
  // tutti prima del `return` della lista di categoria.
  const consigliatoAperto =
    productId && consigliati
      ? (consigliatiGroups
          .flatMap((g) => g.items.map((item) => ({ item, group: g })))
          .find(({ item }) => productSlug(item) === productId) ?? null)
      : null;

  const activeGroup = SHOP_GROUPS.find((g) => g.id === groupId);
  const activeCategory = activeGroup?.categories.find(
    (c) => c.id === categoryId,
  );

  useAccentoSfondo(activeCategory ? coloreVersata(activeCategory) : null);

  const [resetFor, setResetFor] = useState(categoryId);
  if (categoryId !== resetFor) {
    setResetFor(categoryId);
    setRegionFilter(null);
    setBarView("regioni");
    setBarMode(null);
    setSearchOpen(false);
    setSearchChiude(false);
    setSearchText("");
    setHiding(false);
  }

  // fonte dei prodotti: dall'API se la categoria è "remote", altrimenti
  // il vecchio array statico — il resto della pagina non nota differenza
  const sourceItems = activeCategory?.remote
    ? (remoteByCategory[activeCategory.id] ?? [])
    : (activeCategory?.items ?? []);

  const filterValue = (i) =>
    i.paese?.trim() || i[activeCategory?.filterBy]?.trim();

  const filterValues = activeCategory?.filterBy
    ? [...new Set(sourceItems.map(filterValue).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "it"),
      )
    : [];

  const regioniItaliane = filterValues.filter((v) => !COUNTRY_GROUPS[v]);
  const paesiMondo = filterValues.filter((v) => COUNTRY_GROUPS[v]);
  const barValues = barView === "mondo" ? paesiMondo : regioniItaliane;

  // regione e ricerca si sommano: la ricerca affina dentro la regione.
  // La ricerca guarda nome + regione/paese + denominazione/uvaggio/stile.
  const query = normalize(searchText.trim());
  const visibleItems = sourceItems
    .filter((i) => (regionFilter ? filterValue(i) === regionFilter : true))
    .filter((i) => {
      if (!query) return true;
      const hay = normalize(
        [
          i.name,
          i.regione,
          i.paese,
          i.denominazione,
          i.uvaggio,
          i.stile,
          i.tipo,
          i.colore,
        ]
          .filter(Boolean)
          .join(" "),
      );
      return hay.includes(query);
    });

  // prodotto aperto nel bottom sheet: derivato dall'URL, cercato tra
  // TUTTI gli articoli della categoria (non solo quelli filtrati) così un
  // link diretto funziona anche se un filtro lo escluderebbe
  const sheetWine = productId
    ? (sourceItems.find((i) => productSlug(i) === productId) ?? null)
    : null;

  const categoryPath =
    groupId && categoryId ? `/enoteca/${groupId}/${categoryId}` : "/enoteca";
  const openProduct = (w) => navigate(`${categoryPath}/${productSlug(w)}`);
  const closeProduct = () => navigate(categoryPath);
  // i vicini della scheda aperta sono quelli della lista a video, filtri
  // compresi. `replace`: passare da un vino all'altro non riempie la
  // cronologia — il tasto indietro chiude la scheda, non ripercorre i
  // quindici vini sfogliati.
  const viciniScheda = vicini(visibleItems, productId);
  const vaiAlProdotto = (w) =>
    navigate(`${categoryPath}/${productSlug(w)}`, { replace: true });

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

  // La pagina indice (le mini-card dei gruppi) resta una pagina indice:
  // testata ferma e griglia che scorre.
  useEffect(() => {
    if (activeCategory || consigliatiRoute) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, [activeCategory, consigliatiRoute]);

  // La tab Consigliati è una LISTA DI PRODOTTI e scorre come una categoria:
  // pagina immobile (`consigliati-open` toglie anche i ~60px trascinabili,
  // vedi html:has in home.css) e a scorrere è `.consigliati-scroll`, con la
  // stessa identica regola delle liste di categoria (enoteca.css).
  //
  // Non è `category-open` per una ragione sola: quella nasconde la tab bar.
  // Da una categoria si esce col "← Enoteca" in cima, da qui no — la barra è
  // il modo di cambiare pagina, e resta. Il prezzo è la fascia in fondo:
  // `.shop-section` tiene i suoi 56px di riserva (più i 96 del body) così i
  // prodotti si fermano sopra la barra invece di passarle dietro.
  useEffect(() => {
    if (!consigliatiRoute) return;
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("consigliati-open");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("consigliati-open");
    };
  }, [consigliatiRoute]);

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
    // Dalla vista Mondo si torna PRIMA alle regioni: la freccia in cima fa
    // quello che fa la ← dentro la barra, e non chiude niente. Chi sta
    // scegliendo un paese è sceso di un livello dentro il filtro, e la
    // freccia deve risalire quel livello — non saltare fuori da tutto.
    // Un secondo tocco, ormai sulle regioni, fa quel che ha sempre fatto:
    // sul telefono la barra rientra e poi si esce dalla categoria
    // (`closing` → onBarAnimEnd → closeCategory), sul desktop si esce
    // e basta. Quel pezzo non è cambiato.
    if (barOpen && barView === "mondo") {
      setBarView("regioni");
      return;
    }
    if (barOpen && phoneBar) setClosing(true);
    else closeCategory();
  };
  const onBarAnimEnd = (e) => {
    // solo le animazioni della barra stessa: animationend risale anche dalle
    // voci dentro, che hanno la loro comparsa (filter-voce-entra), e una
    // voce che finisce di comparire non deve chiudere la barra
    if (e.target !== e.currentTarget) return;
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

  const openSearch = () => {
    savedScrollRef.current = listRef.current?.scrollTop ?? 0;
    setSearchOpen(true);
  };
  const closeSearch = () => {
    setSearchText("");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setSearchOpen(false);
    else setSearchChiude(true);
  };
  const onSearchAnimEnd = (e) => {
    if (!searchChiude || e.target !== e.currentTarget) return;
    setSearchChiude(false);
    setSearchOpen(false);
  };
  const toggleSearch = () => {
    if (searchChiude) return; // sta già uscendo
    if (searchOpen) closeSearch();
    else openSearch();
  };

  // alla chiusura ripristina la posizione salvata (prima del paint)
  useLayoutEffect(() => {
    if (!searchOpen && listRef.current)
      listRef.current.scrollTop = savedScrollRef.current;
  }, [searchOpen]);

  if (activeCategory) {
    return (
      <section
        className={
          "shop-section shop-section--enoteca" +
          (barOpen ? " has-filter-bar" : "")
        }
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
                  "filter-toggle" +
                  (searchOpen && !searchChiude ? " is-active" : "")
                }
                onClick={toggleSearch}
                aria-expanded={searchOpen && !searchChiude}
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
                <span className="filter-toggle-text">Regioni</span>
              </button>
            )}
          </div>
        </div>
        {searchOpen && (
          <div
            className={
              "search-field" + (searchChiude ? " search-field--chiude" : "")
            }
            onAnimationEnd={onSearchAnimEnd}
          >
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
                  key="r-tutti"
                  className={"filter-btn" + (!regionFilter ? " is-active" : "")}
                  onClick={() => setRegionFilter(null)}
                >
                  <span className="filter-label">Tutti</span>
                </button>
                {paesiMondo.length > 0 && (
                  <button
                    key="r-mondo"
                    className={
                      "filter-btn" +
                      (COUNTRY_GROUPS[regionFilter] ? " is-active" : "")
                    }
                    onClick={() => setBarView("mondo")}
                  >
                    <span className="filter-label">Mondo</span>
                  </button>
                )}
                {barValues.map((v) => (
                  <button
                    key={"r-" + v}
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
                  key="m-indietro"
                  className="filter-back"
                  onClick={() => setBarView("regioni")}
                  aria-label="Torna alle regioni"
                >
                  ←
                </button>
                <span
                  key="m-divisorio"
                  className="filter-divider"
                  aria-hidden="true"
                />
                {barValues.map((v) => (
                  <button
                    key={"m-" + v}
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
          <ListaFantasma type={activeGroup.id} />
        ) : sourceItems.length === 0 ? (
          <p className="product-empty">
            Il catalogo è in arrivo — torna a trovarci presto.
          </p>
        ) : visibleItems.length === 0 ? (
          <p className="product-empty">
            Nessun risultato. Prova a cambiare ricerca o regione.
          </p>
        ) : (
          /* La chiave della LISTA cambia con la regione: la griglia si
             rimonta e le card rifanno la comparsa in fila. Le chiavi delle
             CARD invece sono stabili (l'id, e il nome solo per i pochi senza
             id): con la posizione dentro — com'era, `w.name + i` — ogni
             lettera digitata nella ricerca spostava gli indici e rimontava
             quasi tutte le card, cioè le faceva ricomparire a ogni tasto. */
          <ul
            className="product-list"
            key={regionFilter || "tutti"}
            ref={listRef}
          >
            {visibleItems.map((w, i) => (
              <ProductCard
                key={w.id || w.name + i}
                w={w}
                accent={activeCategory.accent}
                regionFilter={regionFilter}
                onOpen={openProduct}
                type={activeGroup.id}
                i={i}
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
            prec={viciniScheda.prec}
            succ={viciniScheda.succ}
            onVai={vaiAlProdotto}
          />
        )}
      </section>
    );
  }

  // un tocco solo: dalla pagina Enoteca dritti alla lista prodotti.
  // Si cambia rotta e basta: la versata (l'onda del colore della categoria
  // che copriva lo schermo) è stata tolta. Il colore però serve ancora, allo
  // sfondo — vedi useAccentoSfondo più sopra.
  const openDirect = (gId, c) => navigate(`/enoteca/${gId}/${c.id}`);

  // la tab attiva: Consigliati la decide la rotta, le altre tre lo stato
  // locale (restano com'erano — nessuna di loro finisce nell'URL)
  const activeTab = consigliatiRoute ? "consigliati" : tabGroup;
  const tabG = SHOP_GROUPS.find((g) => g.id === activeTab);

  const openTab = (id) => {
    if (id === "consigliati") return navigate("/enoteca/consigliati");
    setTabGroup(id);
    if (consigliatiRoute) navigate("/enoteca"); // si esce dalla rotta dei consigli
  };
  // le voci delle tab: i tre gruppi di data.js più la selezione della casa
  const vociTab = [
    ...SHOP_GROUPS.map((g) => ({ id: g.id, label: g.label, accent: g.accent })),
    { id: "consigliati", label: "Consigliati", accent: ORO_CASA },
  ];

  const openConsigliato = (item) =>
    navigate(`/enoteca/consigliati/${productSlug(item)}`);
  const closeConsigliato = () => navigate("/enoteca/consigliati");
  // i vicini di un consigliato: la fila intera, un gruppo dopo l'altro, come
  // la si legge scorrendo — dall'ultimo dei Rossi si passa al primo dei
  // Bianchi. `replace` per la stessa ragione della lista di categoria.
  const viciniConsigliato = vicini(
    consigliatiGroups.flatMap((g) => g.items),
    productId,
  );
  const vaiAlConsigliato = (item) =>
    navigate(`/enoteca/consigliati/${productSlug(item)}`, { replace: true });

  return (
    <section className="shop-section shop-section--enoteca">
      <div className="section-sticky">
        <h2 className="section-title">Enoteca</h2>
        <GroupTabs
          voci={vociTab}
          attiva={activeTab}
          onScegli={openTab}
          label="Gruppi"
        />
      </div>

      {tabG ? (
        <ul className="mini-grid page-scroll">
          {tabG.categories.map((c, i) => (
            <MiniCard
              key={c.id}
              c={c}
              i={i}
              famiglia={tabG.id}
              filigrana={tabG.id !== "birre"}
              onClick={() => openDirect(tabG.id, c)}
            />
          ))}
        </ul>
      ) : !consigliati ? (
        <ListaFantasma type="vini" />
      ) : consigliatiGroups.length === 0 ? (
        <p className="product-empty">
          I consigli della casa arrivano presto — torna a trovarci.
        </p>
      ) : (
        <div className="consigliati-scroll">
          <p className="consigliati-intro">Le bottiglie che scegliamo noi.</p>
          {consigliatiGroups.map((g) => (
            <section className="consigliati-gruppo" key={g.key}>
              <h3
                className="consigliati-titolo"
                style={{ "--accent": g.accent }}
              >
                {g.label}
              </h3>
              <ul className="product-list">
                {g.items.map((item, i) => (
                  <ProductCard
                    key={item.id}
                    w={item}
                    accent={g.accent}
                    onOpen={openConsigliato}
                    type={g.type}
                    scrollSelector=".consigliati-scroll"
                    i={i}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      {consigliatoAperto && (
        <ProductSheet
          w={consigliatoAperto.item}
          category={consigliatoAperto.group}
          onClose={closeConsigliato}
          type={consigliatoAperto.group.type}
          prec={viciniConsigliato.prec}
          succ={viciniConsigliato.succ}
          onVai={vaiAlConsigliato}
        />
      )}
    </section>
  );
}

export default Enoteca;
