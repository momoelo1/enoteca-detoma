import { useEffect } from "react";
import { aByte, esaDaHsl, mescola, tonoDiEsa } from "../../utils/colore";

// ---- il colore dello sfondo ----
//
// Stesso ragionamento del T0 di Grainient.jsx: il colore NON può vivere nelle
// props di ogni istanza dello shader. La pagina Info ne monta una seconda che
// deve combaciare pixel per pixel con quella di App (la "finestra"), e se una
// stesse sfumando verso il colore di una categoria e l'altra no, la giuntura
// si vedrebbe. Qui c'è un solo stato, che tutte le istanze con
// `tintaCondivisa` leggono a ogni frame.
//
// Sta in un file a parte e non dentro Grainient.jsx perché quello esporta un
// componente, e un file che esporta tutt'e due le cose rompe il fast refresh
// di Vite.

// I tre colori di casa: la crema, il verde chiaro e il verde dell'insegna.
// Stavano scritti a mano in App.jsx E in Info.jsx, che devono mostrare lo
// STESSO sfondo: da qui in poi il posto in cui sono scritti è uno solo.
export const TINTA_BASE = ["#f6f1e7", "#bcd9c3", "#5d8a6f"];

// il verde dell'insegna: il colore di bordi, testi e riempimenti dei bottoni
// quando non c'è nessuna categoria aperta
export const LINEA_BASE = "#2e5e46";

// lo shader vuole 0..1, non 0..255
const aShader = (esa) => aByte(esa).map((v) => v / 255);

// `da`/`a` sono terne di terne RGB 0..1
const TINTA = { da: null, a: null, t0: 0, durata: 0 };

// buffer riusato: tintaOra() gira a ogni frame, allocare tre array al frame
// sarebbe spazzatura gratuita per il garbage collector
const TINTA_ORA = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];

// il colore di questo istante, o null se nessuno ha ancora chiamato impostaTinta
export function tintaOra() {
  if (!TINTA.a) return null;
  const k =
    TINTA.durata > 0
      ? Math.min(1, (performance.now() - TINTA.t0) / TINTA.durata)
      : 1;
  const e = k * k * (3 - 2 * k); // smoothstep: parte e arriva morbida
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      TINTA_ORA[i][j] = TINTA.da[i][j] + (TINTA.a[i][j] - TINTA.da[i][j]) * e;
    }
  }
  return TINTA_ORA;
}

// Cambia il colore dello sfondo, per tutte le istanze insieme.
// `durata` a 0 = immediato.
export function impostaTinta(colori, durata = 700) {
  const a = colori.map(aShader);
  // prima chiamata: non c'è un "da" da cui partire, il colore si insedia e basta
  const primo = !TINTA.a;
  TINTA.da = primo ? a : tintaOra().map((c) => [c[0], c[1], c[2]]);
  TINTA.a = a;
  TINTA.t0 = performance.now();
  TINTA.durata = primo ? 0 : durata;
}

// Lo sfondo parte dai colori di casa: senza questa riga la prima categoria
// aperta ci sfumerebbe dentro partendo dal nero.
impostaTinta(TINTA_BASE, 0);

// Lo sfondo prende il colore della categoria che si sta guardando, ma non lo
// diventa: il testo delle schede è scuro e sopra un fondo pieno di "Vini
// Rossi" (#7b2d3b) non si leggerebbe più. Quindi l'accento si schiarisce
// prima, e poi entra in dosi crescenti nei tre strati dello shader — appena
// accennato in quello chiaro, quasi pieno in quello scuro. Il risultato è
// che la stanza cambia luce, non che cambia colore.
export const tintaDaAccento = (accento) => {
  if (!accento) return TINTA_BASE;
  const a = mescola(accento, "#ffffff", 0.3);
  return [
    mescola(TINTA_BASE[0], a, 0.12),
    mescola(TINTA_BASE[1], a, 0.5),
    mescola(TINTA_BASE[2], a, 0.78),
  ];
};

// Il colore dei bottoni quando lo sfondo è tinto.
//
// NON è l'accento così com'è: su un fondo paglierino (Vini Bianchi) un bordo
// paglierino sparisce. Si tiene la TINTA dell'accento e si impongono
// saturazione e luminosità basse, cioè la versione profonda dello stesso
// colore — un bordo bordeaux sul rosa dei rossi, bronzo sull'oro dei bianchi.
// Stessa famiglia dello sfondo, ma abbastanza scuro da leggersi sopra.
// I valori (45% e 27%) sono quelli del verde di casa #2e5e46, così un bottone
// tinto pesa esattamente quanto pesava prima.
export const lineaDaAccento = (accento) =>
  accento ? esaDaHsl(tonoDiEsa(accento), 0.45, 0.27) : LINEA_BASE;

// Da usare nelle pagine: finché il componente è montato lo sfondo tiene
// l'accento, quando si esce torna ai colori di casa. `accento` a null va
// benissimo (= sfondo di casa).
export function useAccentoSfondo(accento) {
  useEffect(() => {
    const applica = (a) => {
      impostaTinta(tintaDaAccento(a));
      // i bottoni li tinge il CSS leggendo questa variabile: è registrata con
      // @property (index.css), quindi passa da un colore all'altro con una
      // transizione invece che di scatto — alla stessa velocità dello sfondo
      document.documentElement.style.setProperty(
        "--tinta-linea",
        lineaDaAccento(a)
      );
    };
    applica(accento);
    return () => applica(null);
  }, [accento]);
}
