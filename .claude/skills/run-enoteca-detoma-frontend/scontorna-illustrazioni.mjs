// Prepara le illustrazioni incise per le mini-card:
//  1. scontorna lo sfondo (i file sorgente NON hanno alpha: la "trasparenza"
//     e' una scacchiera dipinta in due grigi chiarissimi, ~254 e ~244)
//  2. toglie l'alone bianco sui bordi antialiasati
//  3. ritaglia sul contenuto e riduce a 256px, webp lossy
// Usa il Chromium gia' installato per driver.mjs: niente sharp da aggiungere.
//
//   node .claude/skills/run-enoteca-detoma-frontend/scontorna-illustrazioni.mjs [set...]
//
// senza argomenti rifa' tutti i set. Le chiavi sono i file in Downloads, i
// valori i nomi di destinazione (di solito = id della categoria in data.js).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = process.env.USERPROFILE + '\\Downloads\\';

const SET = {
  vini: {
    out: 'src/images/vini',
    map: {
      'rossi.webp': 'rossi.webp',
      'bianchi.webp': 'bianchi.webp',
      'rosati.webp': 'rosati.webp',
      'spumanti.webp': 'spumanti.webp',
      'champagne.webp': 'champagne.webp',
      'passiti.webp': 'liquorosi.webp', // la categoria si chiama "liquorosi"
    },
  },
  distillati: {
    out: 'src/images/distillati',
    map: {
      'grappa.png': 'grappa.webp',
      'whisky.png': 'whisky.webp',
      'rhum.png': 'rhum.webp',
      'liquori.png': 'liquori.webp',
      'armagnac-cognac.png': 'armagnac-cognac.webp',
      'calvados.png': 'calvados.webp',
    },
  },
};

const sets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SET);

const browser = await chromium.launch();
const page = await browser.newPage();

for (const name of sets) {
  const { out: outDir, map: MAP } = SET[name] || {};
  if (!MAP) { console.error(`set sconosciuto: ${name}`); process.exitCode = 1; continue; }
  const OUT = resolve(outDir);
  console.log(`\n[${name}] -> ${outDir}`);

for (const [src, dst] of Object.entries(MAP)) {
  const mime = src.endsWith('.png') ? 'png' : 'webp';
  const b64 = readFileSync(SRC + src).toString('base64');
  const out = await page.evaluate(async ([b64, size, mime]) => {
    const img = new Image();
    img.src = `data:image/${mime};base64,` + b64;
    await img.decode();

    const W = img.width, H = img.height;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, W, H);
    const d = id.data;

    // sfondo = chiaro e neutro. FULL: sicuramente scacchiera; SOFT: bordo
    // antialiasato, diventa semitrasparente invece che sparire di netto.
    // FULL deve stare SOTTO il tono piu' scuro della scacchiera (~243):
    // sopra, i quadretti scuri restano opachi al 25% e la scacchiera si vede.
    const FULL = 240, SOFT = 196;
    const lum = (i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const neutral = (i) => {
      const mx = Math.max(d[i], d[i + 1], d[i + 2]);
      const mn = Math.min(d[i], d[i + 1], d[i + 2]);
      return mx - mn <= 20; // la scacchiera e' leggermente tinta vicino al disegno
    };

    // flood fill dai bordi: solo lo sfondo *connesso* al bordo viene tolto,
    // cosi' le etichette color crema dentro il disegno restano intatte
    const bg = new Uint8Array(W * H);
    const stack = [];
    for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
    for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }
    while (stack.length) {
      const p = stack.pop();
      if (bg[p]) continue;
      const i = p * 4;
      if (!neutral(i) || lum(i) < SOFT) continue;
      bg[p] = 1;
      const x = p % W, y = (p / W) | 0;
      if (x > 0) stack.push(p - 1);
      if (x < W - 1) stack.push(p + 1);
      if (y > 0) stack.push(p - W);
      if (y < H - 1) stack.push(p + W);
    }

    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let p = 0; p < W * H; p++) {
      const i = p * 4;
      if (bg[p]) {
        const l = lum(i);
        // matte morbido: opaco sotto SOFT, trasparente sopra FULL
        const a = l >= FULL ? 0 : Math.round(255 * (FULL - l) / (FULL - SOFT));
        d[i + 3] = a;
        if (a > 0) {
          // il pixel e' il disegno composto su bianco: lo scompongo
          const f = a / 255;
          for (let k = 0; k < 3; k++) {
            d[i + k] = Math.max(0, Math.min(255, (d[i + k] - 255 * (1 - f)) / f));
          }
        }
      }
      if (d[i + 3] > 8) {
        const x = p % W, y = (p / W) | 0;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    ctx.putImageData(id, 0, 0);

    // ritaglio sul contenuto con un filo di margine, poi riduzione
    const pad = 4;
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
    x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad);
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

    const o = document.createElement('canvas');
    o.width = Math.round(cw >= ch ? size : size * (cw / ch));
    o.height = Math.round(cw >= ch ? size * (ch / cw) : size);
    const octx = o.getContext('2d');
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(c, x0, y0, cw, ch, 0, 0, o.width, o.height);

    return { url: o.toDataURL('image/webp', 0.85), w: o.width, h: o.height };
  }, [b64, 256, mime]);

  const buf = Buffer.from(out.url.split(',')[1], 'base64');
  writeFileSync(resolve(OUT, dst), buf);
  console.log(`  ${dst.padEnd(22)} ${out.w}x${out.h}  ${Math.round(buf.length / 1024)} KB`);
}
}

await browser.close();
