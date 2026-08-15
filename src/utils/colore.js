// Conti sui colori, condivisi da chi tinge lo sfondo (background/tinta.js) e
// da chi sceglie il colore delle versate (utils/coloreCategoria.js). Stavano
// scritti due volte, una per file, con due nomi diversi per la stessa cosa.

export const aByte = (esa) => [
  parseInt(esa.slice(1, 3), 16),
  parseInt(esa.slice(3, 5), 16),
  parseInt(esa.slice(5, 7), 16),
];

const dueCifre = (v) => Math.round(v).toString(16).padStart(2, "0");

export const aEsa = (rgb) => "#" + rgb.map(dueCifre).join("");

// mescola due colori: k=0 è tutto `a`, k=1 è tutto `b`
export const mescola = (a, b, k) => {
  const ra = aByte(a);
  const rb = aByte(b);
  return aEsa(ra.map((v, i) => v + (rb[i] - v) * k));
};

export const esaDaHsl = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((((h / 60) % 2) + 2) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];
  return aEsa([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
};

// solo la tinta (0-360) di un colore: serve a ricavarne una versione più
// scura o più chiara restando nella stessa famiglia
export const tonoDiEsa = (esa) => {
  const [r, g, b] = aByte(esa).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0; // grigio: nessuna tinta, vale quanto qualunque altra
  const h =
    max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return ((h * 60) % 360 + 360) % 360;
};
