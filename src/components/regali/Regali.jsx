import { useEffect, useState } from "react";
import {
  WhatsappLogo,
  DeviceMobile,
  At,
  Gift,
  TreeEvergreen,
  Briefcase,
  Cake,
  HandHeart,
} from "@phosphor-icons/react";
import { SHOP_INFO, WHATSAPP_NUMBER } from "../../data/data";
import Grainient from "../background/Grainient";
import { TINTA_BASE } from "../background/tinta";
import Confezione from "./Confezione";
import "./regali.css";

// ==========================================================================
// TEMP / RIMUOVERE — pagina Regali in prova (2026-10-20)
//
// Tre proposte diverse per la stessa pagina, scelte dal selettore tratteggiato
// in alto a destra: "Componi" (il cliente compone la confezione e la manda su
// WhatsApp), "Vetrina" (confezioni già pronte, con prezzo) e "Racconto" (come
// funziona, occasioni, regali aziendali). Quando se ne sceglie una, si tolgono
// le altre due, il selettore e i dati di prova marcati TEMP.
//
// Tutti i testi, le confezioni e i prezzi qui sotto sono SEGNAPOSTO: il
// negozio non ci ha ancora detto cosa prepara né a che prezzo.
// ==========================================================================

const wa = (testo) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(testo)}`;

// ---- TEMP: selettore delle varianti ----

const VARIANTI = [
  { id: "componi", label: "1 Componi" },
  { id: "vetrina", label: "2 Vetrina" },
  { id: "racconto", label: "3 Racconto" },
];
const CHIAVE_TEMP = "TEMP_regali_variante";

function leggiVariante() {
  try {
    const v = localStorage.getItem(CHIAVE_TEMP);
    return VARIANTI.some((x) => x.id === v) ? v : "componi";
  } catch {
    return "componi";
  }
}

function SelettoreTemp({ valore, onCambia }) {
  return (
    <div className="regali-temp" role="group" aria-label="TEMP: variante pagina Regali">
      <span className="regali-temp-etichetta">TEMP</span>
      {VARIANTI.map((v) => (
        <button
          key={v.id}
          type="button"
          className="regali-temp-btn"
          aria-pressed={valore === v.id}
          onClick={() => onCambia(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

// ---- la finestra sullo sfondo ----
// COPIA di quella di Info.jsx (lì è spiegata riga per riga): anche questa
// pagina scorre il documento, quindi il contenuto passerebbe sotto al logo e
// dietro alla tab bar. Se la pagina Regali resta, va tolta la copia e fatto un
// componente solo per le due pagine.
function useFinestra() {
  const [hHeader, setHHeader] = useState(0);
  const [barra, setBarra] = useState(null);

  useEffect(() => {
    const el = document.querySelector(".site-header");
    if (!el) return;
    const ro = new ResizeObserver(() => setHHeader(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;
    const misura = () => {
      const cs = getComputedStyle(nav);
      if (cs.position !== "fixed") return setBarra(null);
      setBarra({ sopra: nav.offsetHeight + (parseFloat(cs.bottom) || 0) });
    };
    const ro = new ResizeObserver(misura);
    ro.observe(nav);
    window.addEventListener("resize", misura);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", misura);
    };
  }, []);

  useEffect(() => {
    if (!barra) return;
    const prima = document.body.style.paddingBottom;
    document.body.style.paddingBottom = `${barra.sopra + 10}px`;
    return () => {
      document.body.style.paddingBottom = prima;
    };
  }, [barra]);

  return { hHeader, barra };
}

function Finestra({ hHeader, barra }) {
  return (
    <div
      className="pagina-finestra"
      aria-hidden="true"
      style={{
        "--h-alto": `${hHeader}px`,
        "--h-basso": `${barra ? barra.sopra : 0}px`,
      }}
    >
      <div className="pagina-finestra-sfondo">
        <Grainient
          color1={TINTA_BASE[0]}
          color2={TINTA_BASE[1]}
          color3={TINTA_BASE[2]}
          tintaCondivisa
          timeSpeed={0.9}
          grainAmount={0.09}
          contrast={1.15}
          saturation={0.95}
        />
      </div>
    </div>
  );
}

// ==========================================================================
// Variante 1 — Componi la tua confezione
// ==========================================================================

// TEMP: contenitori, pezzi e fasce di prezzo da confermare col negozio
const CONTENITORI = [
  { id: "cassetta", label: "Cassetta di legno" },
  { id: "cesto", label: "Cesto" },
  { id: "scatola", label: "Scatola regalo" },
];

const PEZZI = [
  { id: "rosso", label: "Vino rosso" },
  { id: "bianco", label: "Vino bianco" },
  { id: "bollicine", label: "Bollicine" },
  { id: "distillato", label: "Un distillato" },
  { id: "birra", label: "Birra artigianale" },
  { id: "dolce", label: "Qualcosa di dolce" },
  { id: "salato", label: "Qualcosa di salato" },
];

const OCCASIONI = ["Natale", "Regalo aziendale", "Compleanno", "Per dire grazie", "Altro"];
const BUDGET = ["Fino a 30 €", "30 – 60 €", "60 – 100 €", "Oltre 100 €"];

const etichetta = (elenco, id) => elenco.find((x) => x.id === id)?.label ?? id;

function Chip({ attivo, onClick, children }) {
  return (
    <button type="button" className="regali-chip" aria-pressed={attivo} onClick={onClick}>
      {children}
    </button>
  );
}

function Passo({ numero, titolo, children }) {
  return (
    <section className="regali-blocco">
      <h3 className="regali-blocco-titolo">
        <span className="regali-blocco-numero">{numero}</span>
        {titolo}
      </h3>
      {children}
    </section>
  );
}

function Componi() {
  const [contenitore, setContenitore] = useState("cassetta");
  // in ordine di catalogo, non di tocco: così nel disegno i pezzi non cambiano
  // posto a seconda di cosa si è scelto prima
  const [scelti, setScelti] = useState(["rosso"]);
  const [occasione, setOccasione] = useState(null);
  const [budget, setBudget] = useState(null);
  const [biglietto, setBiglietto] = useState("");

  const togglePezzo = (id) =>
    setScelti((s) =>
      s.includes(id)
        ? s.filter((x) => x !== id)
        : PEZZI.map((p) => p.id).filter((x) => x === id || s.includes(x)),
    );

  const righe = ["Buongiorno, vorrei preparare una confezione regalo."];
  if (occasione) righe.push(`Occasione: ${occasione}`);
  righe.push(`Confezione: ${etichetta(CONTENITORI, contenitore)}`);
  if (scelti.length) righe.push(`Dentro: ${scelti.map((id) => etichetta(PEZZI, id)).join(", ")}`);
  if (budget) righe.push(`Budget: ${budget}`);
  if (biglietto.trim()) righe.push(`Biglietto: "${biglietto.trim()}"`);

  return (
    <>
      <p className="regali-intro">
        Scegli cosa metterci, al resto pensiamo noi. Ti rispondiamo su WhatsApp
        con una proposta.
      </p>

      {/* il disegno sta subito sopra ai due passi che lo cambiano: chi tocca
          "Bollicine" vede la bottiglia cadere nella cassetta senza scorrere */}
      <figure className="regali-scena">
        <Confezione contenitore={contenitore} pezzi={scelti} />
        <figcaption className="regali-scena-didascalia">
          {etichetta(CONTENITORI, contenitore)}
          {scelti.length > 0 &&
            ` · ${scelti.length} ${scelti.length === 1 ? "pezzo" : "pezzi"}`}
        </figcaption>
      </figure>

      <Passo numero="1" titolo="Cosa ci mettiamo?">
        <div className="regali-chips">
          {PEZZI.map((p) => (
            <Chip key={p.id} attivo={scelti.includes(p.id)} onClick={() => togglePezzo(p.id)}>
              {p.label}
            </Chip>
          ))}
        </div>
      </Passo>

      <Passo numero="2" titolo="In cosa lo confezioniamo?">
        <div className="regali-chips">
          {CONTENITORI.map((c) => (
            <Chip key={c.id} attivo={contenitore === c.id} onClick={() => setContenitore(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </Passo>

      <Passo numero="3" titolo="Per quale occasione?">
        <div className="regali-chips">
          {OCCASIONI.map((o) => (
            <Chip
              key={o}
              attivo={occasione === o}
              onClick={() => setOccasione((x) => (x === o ? null : o))}
            >
              {o}
            </Chip>
          ))}
        </div>
      </Passo>

      <Passo numero="4" titolo="Quanto vuoi spendere?">
        <div className="regali-chips">
          {BUDGET.map((b) => (
            <Chip key={b} attivo={budget === b} onClick={() => setBudget((x) => (x === b ? null : b))}>
              {b}
            </Chip>
          ))}
        </div>
      </Passo>

      <Passo numero="5" titolo="Un biglietto?">
        <textarea
          className="regali-biglietto"
          rows={3}
          maxLength={200}
          placeholder="Scrivi qui il messaggio, lo scriviamo a mano noi (facoltativo)"
          value={biglietto}
          onChange={(e) => setBiglietto(e.target.value)}
        />
      </Passo>

      {/* il riepilogo è un cartellino da pacco regalo: il cliente rilegge
          quello che manderà prima di aprire WhatsApp */}
      <section className="regali-cartellino" aria-label="Il tuo regalo">
        <h3 className="regali-cartellino-titolo">Il tuo regalo</h3>
        <dl className="regali-cartellino-righe">
          <dt>Confezione</dt>
          <dd>{etichetta(CONTENITORI, contenitore)}</dd>
          <dt>Dentro</dt>
          <dd>
            {scelti.length
              ? scelti.map((id) => etichetta(PEZZI, id)).join(", ")
              : "Lo scegliamo insieme"}
          </dd>
          {occasione && (
            <>
              <dt>Occasione</dt>
              <dd>{occasione}</dd>
            </>
          )}
          {budget && (
            <>
              <dt>Budget</dt>
              <dd>{budget}</dd>
            </>
          )}
        </dl>
        <a className="regali-cta" href={wa(righe.join("\n"))} target="_blank" rel="noopener noreferrer">
          <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
          Invia la richiesta su WhatsApp
        </a>
      </section>
    </>
  );
}

// ==========================================================================
// Variante 2 — Vetrina di confezioni pronte
// ==========================================================================

// TEMP: confezioni, contenuti e prezzi INVENTATI, da sostituire con quelli
// del negozio (e con le foto vere al posto del disegno)
const VETRINA_TEMP = [
  {
    id: "classico",
    nome: "Il Classico",
    contenitore: "cassetta",
    pezzi: ["rosso", "bianco"],
    prezzo: "35",
    righe: ["Un rosso e un bianco scelti da noi", "Cassetta di legno col nostro marchio"],
  },
  {
    id: "bollicine",
    nome: "Bollicine e Dolcezze",
    contenitore: "scatola",
    pezzi: ["bollicine", "dolce"],
    prezzo: "40",
    righe: ["Uno spumante italiano", "Miele o confettura artigianale"],
  },
  {
    id: "dopocena",
    nome: "Dopo Cena",
    contenitore: "scatola",
    pezzi: ["distillato", "dolce"],
    prezzo: "50",
    righe: ["Una grappa o un rhum da meditazione", "Un dolce da accompagnare"],
  },
  {
    id: "gran-cesto",
    nome: "Il Gran Cesto",
    contenitore: "cesto",
    pezzi: ["rosso", "bianco", "bollicine", "salato", "dolce"],
    prezzo: "90",
    righe: ["Rosso, bianco e bollicine", "Specialità salate e dolci", "Per le feste e per le aziende"],
  },
];

function Vetrina() {
  return (
    <>
      <p className="regali-intro">
        Le nostre confezioni pronte da regalare. Ogni bottiglia si può cambiare:
        chiedici pure.
      </p>

      <ul className="regali-vetrina">
        {VETRINA_TEMP.map((c) => (
          <li key={c.id} className="regali-box">
            <div className={`regali-box-scena regali-box-scena--${c.contenitore}`}>
              <Confezione contenitore={c.contenitore} pezzi={c.pezzi} ritardo={0.12} />
            </div>
            <div className="regali-box-corpo">
              <div className="regali-box-testa">
                <h3 className="regali-box-nome">{c.nome}</h3>
                <p className="regali-box-prezzo">
                  <span>da</span> € {c.prezzo}
                </p>
              </div>
              <ul className="regali-box-righe">
                {c.righe.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <a
                className="regali-cta regali-cta--piccola"
                href={wa(`Buongiorno, vorrei la confezione "${c.nome}" (da € ${c.prezzo}).`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
                Chiedi questa confezione
              </a>
            </div>
          </li>
        ))}

        {/* l'ultima card non è un prodotto: è la porta per tutto quello che
            in vetrina non c'è */}
        <li className="regali-box regali-box--su-misura">
          <Gift size={40} weight="thin" aria-hidden="true" />
          <h3 className="regali-box-nome">Su misura</h3>
          <p className="regali-box-testo">
            Hai in mente qualcos'altro? Componiamo insieme la tua confezione.
          </p>
          <a
            className="regali-cta regali-cta--piccola regali-cta--vuota"
            href={wa("Buongiorno, vorrei una confezione regalo su misura.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
            Scrivici
          </a>
        </li>
      </ul>
    </>
  );
}

// ==========================================================================
// Variante 3 — Racconto: come funziona, occasioni, aziende
// ==========================================================================

// TEMP: testi da far rileggere al negozio (il ritiro in negozio, il biglietto
// scritto a mano e le quantità per le aziende sono MIE supposizioni)
const PASSI_TEMP = [
  {
    titolo: "Raccontaci il regalo",
    testo: "Per chi è, l'occasione, quanto vuoi spendere. In negozio o su WhatsApp.",
  },
  {
    titolo: "Lo prepariamo noi",
    testo: "Scegliamo bottiglie e specialità e le confezioniamo con carta, nastro e biglietto.",
  },
  {
    titolo: "Passi a ritirarlo",
    testo: "Ti avvisiamo quando è pronto.",
  },
];

const OCCASIONI_RACCONTO = [
  { id: "natale", label: "Natale", Icona: TreeEvergreen, testo: "per Natale" },
  { id: "aziende", label: "Aziende", Icona: Briefcase, testo: "aziendale" },
  { id: "compleanni", label: "Compleanni", Icona: Cake, testo: "per un compleanno" },
  { id: "grazie", label: "Per dire grazie", Icona: HandHeart, testo: "per ringraziare qualcuno" },
];

function Racconto() {
  const { telefono, email } = SHOP_INFO;
  return (
    <>
      <figure className="regali-hero">
        <div className="regali-hero-scena">
          <Confezione contenitore="scatola" pezzi={["rosso", "bollicine", "dolce"]} nastroAnimato />
        </div>
        <figcaption className="regali-hero-testo">
          <span className="regali-hero-titolo">Un regalo pensato da noi</span>
          <span className="regali-hero-sotto">
            Scegli tu cosa regalare: alla confezione pensiamo noi.
          </span>
        </figcaption>
      </figure>

      <section className="regali-blocco">
        <h3 className="regali-blocco-titolo">Come funziona</h3>
        <ol className="regali-passi">
          {PASSI_TEMP.map((p, i) => (
            <li key={p.titolo} className="regali-passo">
              <span className="regali-passo-numero" aria-hidden="true">
                {i + 1}
              </span>
              <span className="regali-passo-testo">
                <strong>{p.titolo}</strong>
                {p.testo}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ogni occasione è già un messaggio: un tocco e la conversazione
          parte con l'occasione scritta */}
      <nav className="regali-occasioni" aria-label="Occasioni">
        {OCCASIONI_RACCONTO.map(({ id, label, Icona, testo }) => (
          <a
            key={id}
            className="regali-occasione"
            href={wa(`Buongiorno, vorrei una confezione regalo ${testo}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icona size={30} weight="thin" aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <section className="regali-blocco">
        <h3 className="regali-blocco-titolo">
          <Briefcase size={20} weight="thin" aria-hidden="true" />
          Regali aziendali
        </h3>
        <p className="regali-blocco-testo">
          Per clienti, collaboratori e fornitori prepariamo confezioni anche in
          quantità, con il vostro biglietto. Chiedeteci un preventivo.
        </p>
        <a
          className="regali-cta regali-cta--piccola"
          href={
            email
              ? `mailto:${email}?subject=${encodeURIComponent("Preventivo regali aziendali")}`
              : wa("Buongiorno, vorrei un preventivo per dei regali aziendali.")
          }
        >
          Chiedi un preventivo
        </a>
      </section>

      {/* stessa riga di azioni della pagina Info (classi di info.css) */}
      <nav className="info-azioni" aria-label="Contatti">
        {telefono && (
          <a className="info-azione" href={`tel:${telefono.replace(/\s/g, "")}`}>
            <DeviceMobile size={22} weight="thin" aria-hidden="true" />
            Chiama
          </a>
        )}
        <a
          className="info-azione"
          href={wa("Buongiorno, vorrei un'informazione sulle confezioni regalo.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappLogo size={22} weight="thin" aria-hidden="true" />
          WhatsApp
        </a>
        {email && (
          <a className="info-azione" href={`mailto:${email}`}>
            <At size={22} weight="thin" aria-hidden="true" />
            Email
          </a>
        )}
      </nav>
    </>
  );
}

// ==========================================================================

function Regali() {
  const finestra = useFinestra();
  // TEMP: la variante scelta resta anche cambiando pagina o ricaricando
  const [variante, setVariante] = useState(leggiVariante);
  const cambia = (v) => {
    setVariante(v);
    try {
      localStorage.setItem(CHIAVE_TEMP, v);
    } catch {
      // senza localStorage la scelta vale solo finché la pagina è aperta
    }
  };

  return (
    <section className="shop-section shop-section--regali">
      <Finestra {...finestra} />
      <SelettoreTemp valore={variante} onCambia={cambia} />

      <h2 className="section-title">Confezioni Regalo</h2>
      {/* `key`: cambiando variante si riparte da zero, animazioni comprese */}
      <div className="regali-pagina" key={variante}>
        {variante === "componi" && <Componi />}
        {variante === "vetrina" && <Vetrina />}
        {variante === "racconto" && <Racconto />}
      </div>
    </section>
  );
}

export default Regali;
