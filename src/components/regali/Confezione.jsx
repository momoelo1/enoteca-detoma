import { useId } from "react";

// ---- TEMP / RIMUOVERE se la pagina Regali sceglie le foto vere ----
//
// Il disegno di una confezione regalo: un contenitore (cassetta, cesto o
// scatola) con dentro i pezzi scelti. Fa da segnaposto finché il negozio non
// manda le foto delle sue confezioni, e nella variante "Componi" è il disegno
// che si riempie mentre il cliente sceglie.
//
// Tre strati, in quest'ordine: il fondo del contenitore, i pezzi, il davanti.
// Il davanti copre la parte bassa dei pezzi: è questo a farli sembrare DENTRO
// la confezione invece che appoggiati sopra.

// la riga dove poggiano i pezzi: sta dietro al davanti di ogni contenitore
const BASE = 118;

// I pezzi sono disegnati con la base in (0,0) e crescono verso l'alto (y
// negativa), centrati sull'asse: così la loro posizione è un solo numero.
function Bottiglia({ vetro, capsula, etichetta, capsulaLunga }) {
  return (
    <>
      <path
        d="M-11 0V-56Q-11-64-4-70V-90H4V-70Q11-64 11-56V0Z"
        fill={vetro}
      />
      <rect
        x="-4.6"
        y="-93"
        width="9.2"
        height={capsulaLunga ? 26 : 13}
        rx="1.5"
        fill={capsula}
      />
      <rect x="-9" y="-42" width="18" height="17" rx="1.5" fill={etichetta} />
      <rect x="-7.5" y="-60" width="2.5" height="54" rx="1.2" fill="#fff" opacity="0.2" />
    </>
  );
}

const PEZZI = {
  rosso: () => <Bottiglia vetro="#3b1a20" capsula="#7b2d3b" etichetta="#f3ead8" />,
  bianco: () => <Bottiglia vetro="#7d8a3e" capsula="#d4a72c" etichetta="#f3ead8" />,
  bollicine: () => (
    <Bottiglia vetro="#23402f" capsula="#c9a24a" etichetta="#f3ead8" capsulaLunga />
  ),
  distillato: () => (
    <>
      <path d="M-14 0V-38Q-14-46-6-48V-62H6V-48Q14-46 14-38V0Z" fill="#c58a3e" />
      <rect x="-6.5" y="-70" width="13" height="10" rx="2" fill="#6b4424" />
      <rect x="-10" y="-30" width="20" height="13" rx="1.5" fill="#f3ead8" />
      <rect x="-10.5" y="-42" width="2.5" height="36" rx="1.2" fill="#fff" opacity="0.25" />
    </>
  ),
  birra: () => (
    <>
      <path d="M-9 0V-40Q-9-48-3.5-54V-70H3.5V-54Q9-48 9-40V0Z" fill="#5a3519" />
      <rect x="-4.5" y="-73" width="9" height="5" rx="1" fill="#c78a2b" />
      <rect x="-7.5" y="-32" width="15" height="14" rx="1.5" fill="#f0d9a0" />
      <rect x="-6" y="-44" width="2" height="38" rx="1" fill="#fff" opacity="0.2" />
    </>
  ),
  dolce: () => (
    <>
      <rect x="-13" y="-46" width="26" height="46" rx="4" fill="#d9a03a" />
      <rect x="-14" y="-53" width="28" height="9" rx="2" fill="#7b2d3b" />
      <rect x="-9" y="-30" width="18" height="12" rx="1.5" fill="#f3ead8" />
      <rect x="-10" y="-42" width="2.5" height="36" rx="1.2" fill="#fff" opacity="0.3" />
    </>
  ),
  salato: () => (
    <>
      <rect x="-13" y="-46" width="26" height="46" rx="4" fill="#6f8f3a" />
      <rect x="-14" y="-53" width="28" height="9" rx="2" fill="#c9a24a" />
      <rect x="-9" y="-30" width="18" height="12" rx="1.5" fill="#f3ead8" />
      <rect x="-10" y="-42" width="2.5" height="36" rx="1.2" fill="#fff" opacity="0.3" />
    </>
  ),
};

// i pezzi si dividono l'interno del contenitore: larghi quando sono pochi,
// più stretti (fino a toccarsi) quando sono tanti
function posizioni(n) {
  if (n <= 1) return [130];
  const passo = Math.min(34, 150 / (n - 1));
  const inizio = 130 - (passo * (n - 1)) / 2;
  return Array.from({ length: n }, (_, i) => inizio + i * passo);
}

function Fondo({ tipo }) {
  if (tipo === "cesto") {
    return (
      <>
        {/* il manico passa DIETRO ai pezzi: le bottiglie alte lo coprono */}
        <path
          d="M48 96C48-20 212-20 212 96"
          fill="none"
          stroke="#9a7140"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <ellipse cx="130" cy="95" rx="100" ry="10" fill="#7d5a30" />
      </>
    );
  }
  if (tipo === "scatola") {
    return <path d="M38 92L50 82H210L222 92Z" fill="#1f4433" />;
  }
  return <path d="M34 95L46 84H214L226 95Z" fill="#7a4e2c" />;
}

function Davanti({ tipo, trama, nastroAnimato }) {
  if (tipo === "cesto") {
    return (
      <>
        <path
          d="M30 95Q130 115 230 95Q228 150 200 154H60Q32 150 30 95Z"
          fill={`url(#${trama})`}
        />
        <path
          d="M30 95Q130 115 230 95"
          fill="none"
          stroke="#8c6533"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </>
    );
  }
  if (tipo === "scatola") {
    const classe = nastroAnimato ? " regali-nastro--anima" : "";
    return (
      <>
        <rect x="34" y="92" width="192" height="62" rx="2" fill="#2e5e46" />
        <path d="M35 93H225" stroke="#4d7d63" strokeWidth="1.5" />
        {/* il nastro: due strisce dorate che si incrociano, poi il fiocco.
            `pathLength` = 1 rende la lunghezza uguale per tutte e due, così
            l'animazione che le "stende" usa gli stessi numeri */}
        <path
          className={"regali-nastro" + classe}
          d="M130 92V154"
          pathLength="1"
          stroke="#c9a24a"
          strokeWidth="13"
        />
        <path
          className={"regali-nastro regali-nastro--2" + classe}
          d="M34 123H226"
          pathLength="1"
          stroke="#c9a24a"
          strokeWidth="11"
        />
        <g className={"regali-fiocco" + (nastroAnimato ? " regali-fiocco--anima" : "")}>
          <ellipse cx="117" cy="88" rx="13" ry="7" transform="rotate(-18 117 88)" fill="#d8b45c" />
          <ellipse cx="143" cy="88" rx="13" ry="7" transform="rotate(18 143 88)" fill="#d8b45c" />
          <path d="M127 92L119 108M133 92L141 108" stroke="#c9a24a" strokeWidth="5" strokeLinecap="round" />
          <circle cx="130" cy="90" r="5.5" fill="#b58f3c" />
        </g>
      </>
    );
  }
  return (
    <>
      <rect x="30" y="95" width="200" height="58" rx="3" fill="#b37b47" />
      <path d="M42 114.5H218M42 133.5H218" stroke="#8a5a34" strokeWidth="1.5" />
      <rect x="30" y="95" width="12" height="58" rx="2" fill="#9b6738" />
      <rect x="218" y="95" width="12" height="58" rx="2" fill="#9b6738" />
      <path d="M31 96H229" stroke="#cf9a66" strokeWidth="1.5" />
      {/* il marchio "a fuoco" sull'asse di mezzo, come sulle cassette vere */}
      <text
        x="130"
        y="128.5"
        textAnchor="middle"
        fontFamily='"Cormorant Garamond", Georgia, serif'
        fontSize="13"
        fontWeight="600"
        letterSpacing="3"
        fill="#5e3a1e"
        opacity="0.75"
      >
        DE TOMA
      </text>
    </>
  );
}

// `pezzi`: elenco di id di PEZZI. `ritardo`: secondi fra un pezzo e l'altro
// quando arrivano tutti insieme (vetrina); 0 quando arrivano uno alla volta
// perché li sceglie il cliente.
function Confezione({ contenitore = "cassetta", pezzi = [], ritardo = 0, nastroAnimato = false }) {
  // id della trama del cesto: unico per disegno, perché in vetrina ce ne sono
  // più d'uno nella stessa pagina. Ripulito dai due punti di useId, che
  // dentro `url(#…)` non tutti i browser digeriscono.
  const trama = "trama" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const xs = posizioni(pezzi.length);

  return (
    <svg className="regali-disegno" viewBox="0 0 260 170" aria-hidden="true">
      <defs>
        <pattern id={trama} width="12" height="8" patternUnits="userSpaceOnUse">
          <rect width="12" height="8" fill="#b8894e" />
          <path d="M0 4Q3 1 6 4T12 4" fill="none" stroke="#94703e" strokeWidth="1.3" />
          <path d="M6 0V8" stroke="#a37a44" strokeWidth="0.8" />
        </pattern>
      </defs>

      <ellipse cx="130" cy="158" rx="106" ry="7" fill="#000" opacity="0.13" />
      <Fondo tipo={contenitore} />

      {pezzi.map((id, i) => {
        // chiamata come funzione e non come <Pezzo/>: sono disegni senza
        // stato, e un componente scelto durante il render il React Compiler
        // non lo accetta
        const disegna = PEZZI[id];
        if (!disegna) return null;
        return (
          // il posto è uno stile CSS e non l'attributo `transform`: così,
          // quando un pezzo entra, gli altri scivolano di lato invece di
          // saltare. La caduta sta sul <g> interno, perché una transform CSS
          // sul primo prenderebbe il posto di quella di posizione.
          <g
            key={id}
            className="regali-posto"
            style={{ transform: `translate(${xs[i]}px, ${BASE}px)` }}
          >
            <g className="regali-pezzo" style={{ animationDelay: `${i * ritardo}s` }}>
              {disegna()}
            </g>
          </g>
        );
      })}

      <Davanti tipo={contenitore} trama={trama} nastroAnimato={nastroAnimato} />
    </svg>
  );
}

export default Confezione;
