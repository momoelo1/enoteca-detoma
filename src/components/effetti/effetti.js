import "./effetti.css";

// ============================================================================
// L'effetto al tocco delle mini-card: quale tocca a chi, e come si accende.
// Il disegno e i tempi delle animazioni stanno in effetti.css; il filtro SVG
// che serve alla macchia è FiltroMacchia.jsx, montato una volta in App.jsx.
// Tre pezzi nella stessa cartella, e vivono o muoiono insieme: senza il
// filtro la macchia resta un cerchio perfetto, e il difetto non somiglia per
// niente a un import dimenticato.
//
// Perché non sono un file solo: `react-refresh/only-export-components` non
// lascia esportare una funzione e un componente dallo stesso file.
// ============================================================================

// Il colore delle bollicine: sempre lo stesso per tutte le birre, qualunque
// sia il birrificio. È l'ambra di "32 Via dei Birrai" — con l'accento di
// ciascuno le bollicine uscivano azzurre sulla Brasserie du Mont Blanc, e una
// birra azzurra non esiste. Si legge da data.js invece di essere scritto a
// mano qui, così resta davvero "il colore di 32" se un giorno lo cambiano dal
// pannello; se quella categoria sparisse si ripiega sull'accento del gruppo
// Birre, che oggi è lo stesso identico valore (#c78a2b).
const COLORE_BIRRA =   "#c78a2b";


// La goccia dei distillati: ambra, una sola per tutti e sei — come le
// bollicine delle birre. I loro accenti in data.js sono già bruni, ma vanno
// dal #6e4419 al #8a5a2b e una goccia quasi nera non si legge come distillato.
// Per farla diversa per ogni distillato (grappa chiara, whisky ambrato…)
// basterebbe una tabella qui, sulle parole del nome.
const COLORE_DISTILLATO = "#a8661f";

// La colatura della Dolceria: miele, per tutte le card del reparto. NON
// l'accento della card, che è quello del reparto — la Dolceria è rosa
// (#b56576) e il miele colava rosa confetto. Oro caldo, un filo più dorato e
// meno bruno dell'ambra delle birre, così le due non si confondono.
const COLORE_MIELE = "#c8901c";

// Gli strati della Gastronomia: il gesto è uno per tutto il reparto, ma il
// colore è di quel che c'è nel barattolo — con l'accento del reparto il pesto
// e le acciughe uscivano dello stesso arancione. Parole e non nomi esatti,
// come FOOD_ICON_RULES in Enoteca.jsx: i gruppi li inventa il negozio dal
// pannello. Vince la prima riga che corrisponde; se nessuna corrisponde resta
// l'accento della card.
const COLORI_STRATI = [
  [/sott.olio|oliva|olive|verdur|carciof|peperon/, "#8f8f2b"], // olio e verdura
  [/ittic|pesc|tonno|acciug|sgombr|salmon/, "#5d7f8a"], // mare
  [/pesto|basilic/, "#4f7a2e"], // basilico
  [/pate|crem.*salat|bruschett/, "#9a6b3f"], // paté
  [/sugo|sughi|ragu|salsa|passata|condiment|mostard|senap|pomodor/, "#a8331f"], // pomodoro
  [/tartufo|fungh/, "#6b5637"],
];

const coloreStrati = (card) => {
  const parole = (card.dataset.gruppo || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  return COLORI_STRATI.find(([re]) => re.test(parole))?.[1];
};

// Quando parte la navigazione vera, in ms dal tocco. Sempre PRIMA della fine
// dell'animazione: quando il colore ha coperto la card non c'è più niente da
// guardare, e aspettare la fine farebbe sembrare lento il sito invece che
// curato.
const ATTESE = {
  macchia: 900,
  bollicine: 700,
  goccia: 800,
  strati: 780,
  colatura: 760,
};

// Rete di sicurezza, non il tempo normale dell'effetto: di regola l'effetto se
// ne va con la card, che si smonta quando la pagina nuova entra. Questo timer
// serve solo al caso in cui la card resti dov'è (una rotta che non cambia
// niente), perché non le rimanga addosso per sempre.
//
// Perché è così lungo: la lista prodotti che sta per arrivare è pesante da
// disegnare, e prima era 1400ms, cioè PRIMA che la pagina nuova comparisse.
// Misurato sulla build di produzione a catalogo già in memoria: la rotta
// cambiava a 997ms, l'effetto spariva a 1556ms e la lista arrivava a 2159ms —
// 600ms in cui la card tornava pulita, la griglia era ancora lì e sembrava
// che il tocco non avesse fatto niente. Coprire quell'attesa è proprio il
// mestiere di questi effetti: finché la lista non c'è, il colore resta.
const PULIZIA = 3000;

// un effetto per volta: un secondo tocco mentre il primo è in corso aprirebbe
// due navigazioni, e la seconda vincerebbe a caso
let inCorso = false;

const fermo = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// effettoPer(famiglia): quale effetto tocca a questa card, o `null` se non
// ne ha uno.
// `famiglia`: vini | birre | distillati | gastronomia | dolceria.
//
// Uno per REPARTO e non uno per gruppo: si era arrivati a un gesto diverso
// per gruppo (colatura sul miele, briciole sui panificati) e il 2026-09-15 si
// è tornati indietro apposta — quattordici gesti diversi erano una
// collezione, non un sito.
export function effettoPer(famiglia) {
  if (famiglia === "vini") return "macchia";
  if (famiglia === "birre") return "bollicine";
  if (famiglia === "distillati") return "goccia";
  if (famiglia === "gastronomia") return "strati";
  if (famiglia === "dolceria") return "colatura";
  return null;
}

// il colore di ciascuno, dove non è quello della card
const COLORI = {
  bollicine: () => COLORE_BIRRA,
  goccia: () => COLORE_DISTILLATO,
  colatura: () => COLORE_MIELE,
  strati: coloreStrati,
};

const caso = (a, b) => a + Math.random() * (b - a);

// Uno strato fisso sopra al rettangolo della card, per ciò che deve uscirne
// (le bolle, le briciole, la goccia che cade da fuori). Sta in fondo al body
// e non dentro la card, che ritaglia: perciò il colore dell'effetto va
// ricopiato qui a mano, o le briciole nascerebbero del colore di ripiego.
function stratoSu(rect, card) {
  const s = document.createElement("div");
  s.className = "effetto-strato";
  Object.assign(s.style, {
    position: "fixed",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: 30,
    pointerEvents: "none",
  });
  if (card) {
    s.style.setProperty("--fx-colore", card.style.getPropertyValue("--fx-colore"));
    s.style.setProperty("--accent", card.style.getPropertyValue("--accent"));
  }
  document.body.appendChild(s);
  return s;
}

// I pezzi che l'animazione da sola non sa fare. Ognuno riceve la card già
// accesa e restituisce come ripulire (o niente).
const PEZZI = {
  // le bolle salgono dentro la velatura e scoppiano poco sopra il bordo alto:
  // devono uscire dalla card, quindi stanno nello strato sopra di lei
  bollicine(card, rect) {
    const strato = stratoSu(rect, card);
    for (let i = 0; i < 16; i++) {
      const b = document.createElement("div");
      b.className = "effetto-bolla";
      const d = caso(4, 10);
      Object.assign(b.style, {
        width: `${d}px`,
        height: `${d}px`,
        left: `${caso(10, 90)}%`,
        bottom: `-${caso(0, 12)}px`,
      });
      strato.appendChild(b);
      b.animate(
        [
          { transform: "translateY(0) scale(0.7)", opacity: 0 },
          { opacity: 1, offset: 0.2 },
          { opacity: 1, offset: 0.75 },
          {
            transform: `translate(${caso(-12, 12)}px, -${caso(70, 130)}px) scale(1.15)`,
            opacity: 0,
          },
        ],
        {
          duration: caso(520, 880),
          easing: "cubic-bezier(0.3, 0.6, 0.4, 1)",
          delay: caso(40, 300),
          fill: "forwards",
        },
      );
    }
    return () => strato.remove();
  },

  // la goccia cade da SOPRA la card, quindi sta nello strato; la pozza che
  // si allarga è invece il ::after della card, che la ritaglia
  goccia(card, rect, e) {
    const strato = stratoSu(rect, card);
    const x = e ? e.clientX - rect.left : rect.width / 2;
    const yPozza = rect.height * 0.58;
    const g = document.createElement("div");
    g.className = "effetto-goccia-corpo";
    Object.assign(g.style, { left: `${x}px`, top: "0px" });
    strato.appendChild(g);
    // cade accelerando (la curva è tutta in coda), poi si schiaccia
    g.animate(
      [
        { transform: `translateY(-${rect.height * 0.55}px) scaleY(1)`, opacity: 0 },
        { opacity: 1, offset: 0.15 },
        {
          transform: `translateY(${yPozza - 10}px) scaleY(1.25)`,
          opacity: 1,
          offset: 0.85,
        },
        { transform: `translateY(${yPozza}px) scale(1.5, 0.4)`, opacity: 0 },
      ],
      {
        duration: 340,
        easing: "cubic-bezier(0.55, 0, 0.85, 0.6)",
        fill: "forwards",
      },
    );
    const spruzzo = document.createElement("div");
    spruzzo.className = "effetto-spruzzo";
    Object.assign(spruzzo.style, { left: `${x}px`, top: `${yPozza}px` });
    strato.appendChild(spruzzo);
    return () => strato.remove();
  },

  // quattro fasce, dal basso in su, come un barattolo invasato a strati:
  // ognuna un filo più chiara della precedente, perché a tinta unita
  // sembrerebbe un riempimento solo fatto a scatti. Stanno dentro la card.
  strati(card) {
    const nodi = [];
    for (let i = 0; i < 4; i++) {
      const f = document.createElement("span");
      f.className = "effetto-fascia";
      f.style.bottom = `${i * 25}%`;
      f.style.filter = `brightness(${(0.86 + i * 0.09).toFixed(2)})`;
      f.style.transform = "translateY(120%)";
      card.appendChild(f);
      f.animate([{ transform: "translateY(120%)" }, { transform: "translateY(0)" }], {
        duration: 420,
        easing: "cubic-bezier(0.3, 0.8, 0.35, 1)",
        delay: i * 110,
        fill: "forwards",
      });
      nodi.push(f);
    }
    return () => nodi.forEach((n) => n.remove());
  },

  // le tre colate stanno DENTRO la card, che le ritaglia sul bordo basso.
  // Larghezze e altezze diverse: tre colate identiche sembrano una grata.
  colatura(card) {
    const misure = [
      { left: 8, larga: 30, alta: 130, ritardo: 0 },
      { left: 44, larga: 38, alta: 150, ritardo: 90 },
      { left: 78, larga: 26, alta: 120, ritardo: 180 },
    ];
    const nodi = misure.map((m) => {
      const el = document.createElement("span");
      el.className = "effetto-colata";
      Object.assign(el.style, { left: `${m.left}%`, width: `${m.larga}%` });
      card.appendChild(el);
      el.animate([{ height: "0%" }, { height: `${m.alta}%` }], {
        duration: 620,
        easing: "cubic-bezier(0.45, 0.05, 0.3, 1)",
        delay: m.ritardo,
        fill: "forwards",
      });
      return el;
    });
    return () => nodi.forEach((n) => n.remove());
  },
};

// effettoTocco(evento, vai, famiglia): accende l'effetto che tocca a questa
// card e chiama `vai` (il cambio di rotta) a effetto quasi finito.
// Dove l'effetto non c'è o non si deve fare, chiama `vai` e basta — la
// navigazione non dipende mai dall'animazione.
export function effettoTocco(e, vai, famiglia) {
  const quale = effettoPer(famiglia);
  const card = e.currentTarget;
  if (!quale || !card || fermo()) return vai();
  if (inCorso) return;
  inCorso = true;

  const rect = card.getBoundingClientRect();

  // La macchia parte dal dito. Da tastiera (Invio sul bottone) non c'è un
  // punto: clientX e clientY valgono 0 e partirebbe dall'angolo in alto a
  // sinistra della finestra, cioè fuori dalla card. Lì si parte dal centro.
  // Si guardano le coordinate e non `e.detail`, che su alcuni browser vale 0
  // anche per un tocco vero.
  const daTastiera = e.clientX === 0 && e.clientY === 0;
  const px = daTastiera ? 50 : ((e.clientX - rect.left) / rect.width) * 100;
  const py = daTastiera ? 50 : ((e.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty("--px", `${px.toFixed(1)}%`);
  card.style.setProperty("--py", `${py.toFixed(1)}%`);
  // il colore dell'effetto, dove non è quello della card (vedi COLORI)
  const colore = COLORI[quale]?.(card);
  if (colore) card.style.setProperty("--fx-colore", colore);

  // Una classe messa a mano su un nodo di React: si può perché il className
  // delle mini-card non cambia mai da sé (React riscrive l'attributo solo
  // quando il valore della prop cambia), ed è lo stesso modo in cui
  // GroupTabs posa `group-tabs--pronta`.
  card.classList.add("effetto-attivo", `effetto-${quale}`);
  const pulisciPezzi = PEZZI[quale]?.(card, rect, e);

  setTimeout(() => {
    inCorso = false;
    vai();
  }, ATTESE[quale]);

  setTimeout(() => {
    card.classList.remove("effetto-attivo", `effetto-${quale}`);
    card.style.removeProperty("--px");
    card.style.removeProperty("--py");
    card.style.removeProperty("--fx-colore");
    pulisciPezzi?.();
  }, PULIZIA);
}
