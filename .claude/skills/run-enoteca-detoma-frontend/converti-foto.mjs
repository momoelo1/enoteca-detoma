// Converte in webp le foto e il logo, ridimensionandoli alla misura che
// servono DAVVERO a schermo. Compagno di scontorna-illustrazioni.mjs, che fa
// la stessa cosa per le illustrazioni incise: stesso Chromium di driver.mjs,
// niente sharp da installare.
//
//   node .claude/skills/run-enoteca-detoma-frontend/converti-foto.mjs [nome...]
//
// NON cancella i sorgenti: scrive il .webp accanto al .png e stampa il
// risparmio. La cancellazione del png la fai tu dopo aver guardato il
// risultato (per le foto di famiglia e' obbligatoria: import.meta.glob in
// Home.jsx prende sia .png sia .webp e altrimenti la stessa foto compare due
// volte nello slideshow).
//
// `w` = larghezza di uscita in pixel. Si ricava dalla misura CSS a cui
// l'immagine e' disegnata moltiplicata per il DPR massimo che vuoi servire
// (3 = telefoni retina). Oltre quella soglia stai spedendo pixel che nessuno
// vedra' mai. `w: null` tiene la dimensione nativa (gia' giusta o gia'
// troppo piccola per crescere).

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const JOBS = {
  // slideshow home: cornice max 520px, foto in `contain`, quindi al massimo
  // ~342px CSS su telefono (x3 = 1026) e ~500px CSS su desktop (x2 = 1000)
  'famiglia_3': { src: 'src/images/famiglia/famiglia_3.png', w: 1024, q: 0.82 },
  // 424x471 nativo: gia' sotto quello che servirebbe, non ha senso ridurlo
  'famiglia_2': { src: 'src/images/famiglia/famiglia_2.png', w: null, q: 0.82 },
  // logo: 180px CSS di altezza x3 = 540, il nativo 620x402 e' gia' la misura
  // giusta. q 0.8 misurato contro il png: l'alpha (cioe' la SAGOMA, tratto e
  // bordi antialiasati) esce identico a qualunque qualita' - Chrome codifica
  // il canale alpha senza perdita - e sul solo RGB, che qui e' nero pieno,
  // l'errore medio e' 3.8/255. Salire a 0.92 costa 13 KB per un errore di
  // 2.5: si paga la differenza e non si vede.
  'logo': { src: 'src/images/enoteca-detoma-logo.png', w: null, q: 0.8 },
  // hero della pagina Info: la fascia e' larga al massimo 620px CSS (x2 su
  // desktop) e 390 su telefono (x3), quindi 1200 e' il tetto utile
  'interno': { src: 'src/images/detoma-interno.jpg', w: 1200, q: 0.78 },
};

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(JOBS);

const browser = await chromium.launch();
const page = await browser.newPage();

let prima = 0, dopo = 0;
for (const name of names) {
  const job = JOBS[name];
  if (!job) { console.error(`job sconosciuto: ${name}`); process.exitCode = 1; continue; }

  const dst = job.src.replace(/\.(png|jpe?g)$/i, '.webp');
  if (!existsSync(resolve(job.src))) {
    // caso normale dopo la prima conversione: il png e' stato cancellato
    // (per le foto di famiglia e' obbligatorio, vedi sopra). Non e' un errore.
    console.log(`  ${name.padEnd(12)} sorgente assente, gia' convertito -> ${dst}`);
    continue;
  }
  const mime = /\.png$/i.test(job.src) ? 'png' : 'jpeg';
  const b64 = readFileSync(resolve(job.src)).toString('base64');

  const out = await page.evaluate(async ([b64, mime, w, q]) => {
    const img = new Image();
    img.src = `data:image/${mime};base64,` + b64;
    await img.decode();

    // mai ingrandire: se il sorgente e' piu' piccolo del target si tiene com'e'
    const outW = w && w < img.width ? w : img.width;
    const outH = Math.round(img.height * (outW / img.width));

    const c = document.createElement('canvas');
    c.width = outW; c.height = outH;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, outW, outH);
    return { url: c.toDataURL('image/webp', q), w: outW, h: outH, srcW: img.width, srcH: img.height };
  }, [b64, mime, job.w, job.q]);

  const buf = Buffer.from(out.url.split(',')[1], 'base64');
  const kbPrima = statSync(resolve(job.src)).size / 1024;
  writeFileSync(resolve(dst), buf);
  prima += kbPrima; dopo += buf.length / 1024;

  console.log(
    `  ${name.padEnd(12)} ${out.srcW}x${out.srcH} -> ${out.w}x${out.h}   ` +
    `${Math.round(kbPrima)} KB -> ${Math.round(buf.length / 1024)} KB   (${dst})`
  );
}

console.log(`\ntotale ${Math.round(prima)} KB -> ${Math.round(dopo)} KB`);
console.log('i .png sorgente NON sono stati toccati: cancellali tu quando il risultato ti convince.');

await browser.close();
