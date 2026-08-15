---
name: run-enoteca-detoma-frontend
description: Build, run and drive the Enoteca de Toma frontend. Use when asked to start the site, run the dev server, build it, preview the production build, take a screenshot of a page or card, or verify a change works in the real running app (Enoteca, Alimentari, product sheet, admin login).
---

Vite + React SPA, mobile-first. An agent drives it headless with
`.claude/skills/run-enoteca-detoma-frontend/driver.mjs` — a small Playwright/Chromium
harness that reads commands from stdin (`nav`, `wait-for`, `click`, `screenshot`, …).

All paths below are relative to `frontend/` (this repo's root). Commands are PowerShell —
the shell on this machine. **Never `git push`: pushing to `main` deploys to GitHub Pages.**

## Prerequisites

Node 22 (verified with v22.13.0). One-time install of the harness — it has its **own**
`package.json`, deliberately separate from the app's so Playwright never lands in the
site's dependency tree:

```powershell
Set-Location .claude/skills/run-enoteca-detoma-frontend
npm install playwright --no-audit --no-fund
npx playwright install chromium         # ~300 MB, only once per Playwright version
Set-Location ../../..
```

## Setup

Install app deps if `node_modules/` is missing:

```powershell
npm install
```

**There is no `.env` in this checkout and it is gitignored.** Since 2026-08-15 that is
fine for read-only work: with `VITE_API_URL` unset the services fall back to the
**production** backend (`https://detoma-backend.vercel.app`, Atlas + Cloudinary), so the
catalogue loads with nothing configured. Reading it is fine; **do not run admin mutations
against it** — and note that an unconfigured dev server now *can*, which the old
`hostname:3001` fallback made impossible.

Setting it explicitly still works and is what you want when driving the admin panel
against the disposable backend (see below):

```powershell
$env:VITE_API_URL = 'http://localhost:3011'
```

## Run (agent path)

Start the dev server **detached**, then poll — don't sleep. `Start-Process` is not a
stylistic choice: a `Start-Job` (or a plain backgrounded `npm run dev`) dies with the shell
call that created it, so the next tool call finds nothing on 5173. A `Start-Process`
survives, as does the backend below. Verified: ready in ~4 s, listening two poll cycles
later.

```powershell
$env:VITE_API_URL = 'https://detoma-backend.vercel.app'
$p = Start-Process npm.cmd -ArgumentList 'run','dev' -RedirectStandardOutput "$env:TEMP\vite.log" -PassThru -WindowStyle Hidden
for($i=0;$i -lt 60;$i++){ try { Invoke-WebRequest 'http://localhost:5173/' -UseBasicParsing -TimeoutSec 2 | Out-Null; break } catch { Start-Sleep -Milliseconds 700 } }
```

Then run the committed end-to-end script — home → Enoteca → list → product sheet → region
bar → Alimentari → admin login:

```powershell
Get-Content .claude/skills/run-enoteca-detoma-frontend/smoke.txt | node .claude/skills/run-enoteca-detoma-frontend/driver.mjs
```

Verified output: `COUNT .mini-cell = 6`, `COUNT .product-list > * = 207`,
`ERRORS none`, exit code 0.

For a one-off check, pipe a here-string instead:

```powershell
@'
nav /enoteca/vini/rossi
wait-for .product-list
screenshot rossi
console
'@ | node .claude/skills/run-enoteca-detoma-frontend/driver.mjs
```

Screenshots land in `.claude/skills/run-enoteca-detoma-frontend/shots/`, numbered in
order (`01-rossi.png`). **Read the PNG** — a green gradient with no cards means the API
call failed, not that the page is fine. The dir is gitignored; delete it between runs so
the numbering restarts.

Stop the server:

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Prima di fidarti del server: due controlli che valgono mezz'ora

`vite.config.js` **fissa la porta a 5173** (`server.port`), quindi non serve `--port`. Ma
un dev server avviato con `Start-Process` **sopravvive alla chiamata che lo ha creato e
anche alla sessione**: se ne trova già uno vivo, o Vite scivola su un'altra porta, oppure —
con `--strictPort` — il nuovo muore in silenzio e **continui a pilotare quello vecchio**.
Successo entrambi i giorni di lavoro su questa cartella. Due misure, non congetture:

```powershell
# 1. chi ascolta, e da QUANDO. Se StartTime è di ieri, non è il tuo.
Get-NetTCPConnection -LocalPort 5173 -State Listen | ForEach-Object {
  $p = Get-Process -Id $_.OwningProcess; "PID $($_.OwningProcess) avviato $($p.StartTime)"
}

# 2. a quale API è legato davvero: il modulo servito ha l'URL dentro.
#    Vuoto = VITE_API_URL non è arrivato e userà il fallback localhost:3001.
$c = (Invoke-WebRequest "http://localhost:5173/src/services/wines.js" -UseBasicParsing).Content
(([regex]::Matches($c,'https?://[^"'' ]+')) | ForEach-Object { $_.Value } | Select-Object -Unique)
# Da quando il fallback è la produzione, qui c'è SEMPRE un URL: se leggi
# detoma-backend.vercel.app non sai ancora se è VITE_API_URL o il fallback —
# sai solo che NON stai parlando con un backend locale.
```

Verificato il 2026-08-14: il controllo 1 ha smascherato un server delle 19:34 del giorno
prima che rispondeva ancora, e il controllo 2 ha mostrato che era legato alla produzione
mentre credevo di stare sul backend usa e getta.

### `$env:VITE_API_URL` NON arriva a un `Start-Process npm.cmd`

Questa costa un'ora se non la sai. Impostare la variabile e lanciare il server nella stessa
chiamata **non funziona**: il modulo servito esce senza URL e le liste sono vuote.

```powershell
# NON funziona: il figlio non vede la variabile
$env:VITE_API_URL = 'http://localhost:3011'
Start-Process npm.cmd -ArgumentList 'run','dev' -WindowStyle Hidden

# Funziona: la variabile è impostata DENTRO il processo figlio
Start-Process cmd.exe -ArgumentList '/c','set "VITE_API_URL=http://localhost:3011" && npm run dev' `
  -RedirectStandardOutput "$env:TEMP\vite.log" -WindowStyle Hidden
```

Il sintomo non somiglia a un problema di ambiente: il sito si disegna tutto, ma ogni lista
di prodotti è vuota e la fascia dei consigli in home non compare. Dopo il lancio fai
sempre il controllo 2 qui sopra.

### Ripulire gli orfani (non basta uccidere la porta)

Uccidere chi ascolta la porta lascia vivo il **padre**: i driver `--hold` del backend e i
loro guardiani `mongo_killer.js` si accumulano di sessione in sessione, tenendo su mongod
effimeri. Il 2026-08-14 ne ho trovati sei di due giorni diversi. Guarda le righe di comando,
non i nomi — sono tutti `node`:

```powershell
Get-Process node | Select-Object Id, StartTime, @{n='cmd';e={
  (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)").CommandLine }} | Format-Table -Wrap -AutoSize
```

**Non uccidere alla cieca.** In quell'elenco convivono il backend locale dello sviluppatore
(`nodemon.js server.js` su 3001, che parla con Atlas di produzione) e i tuoi usa e getta
(`driver.mjs --hold`). Uccidi per PID solo quelli che hai avviato tu.

### Driver flags

| flag | effect |
|---|---|
| *(none)* | iPhone 13 viewport (390×844, touch, DPR 3) — **the default**, the site is mobile-first |
| `--desktop` | 1440×900, no touch — the nav becomes a pill row and the bottom tab bar disappears |
| `--headed` | opens a real window (useless for an agent, handy when a human is watching) |
| `--base <url>` | target something other than `http://localhost:5173` |
| `--shots <dir>` | screenshot output directory |

### Driver commands

Non-zero exit if any command failed. Selectors are Playwright selectors, so
`text=Regioni`, `.mini-cell >> nth=0` and plain CSS all work.

| command | what it does |
|---|---|
| `nav <path\|url>` | goto; bare paths are joined onto the base |
| `wait-for <sel>` | wait until visible (20 s) |
| `click <sel>` / `fill <sel> <val>` / `press <key>` / `back` | interact |
| `count <sel>` | print how many match |
| `text [sel]` | print innerText (default `body`), truncated to 2000 chars |
| `eval <js>` | evaluate in the page, print the JSON result |
| `url` | print the current URL — how you check routing |
| `body-classes` | print `document.body.className` — the layout mechanism (see CLAUDE.md) |
| `triplelogo` | three fast clicks on `.site-logo` → `/admin` |
| `screenshot [name]` | PNG into the shots dir |
| `dump-html [name]` | full HTML into the shots dir |
| `console` | print console errors, page errors, HTTP ≥ 400 **and failed requests with their URL** |
| `sleep <ms>`, `# comment`, `quit` | |

### Landmarks worth knowing

- `/enoteca` and `/alimentari` both open a **`.mini-cell` grid**, not `.cat-card` — the
  mini-cards are the current entry grid.
- Product list rows are `.product-list > *`; the bottom sheet is `.sheet-name`,
  `.sheet-close`, `.sheet-cta`.
- Deep links work: `nav /enoteca/vini/rossi/<id>` opens straight into the sheet.
- Body classes observed: `home-no-scroll` (home), `home-no-scroll page-pinned`
  (`/enoteca`, `/alimentari` grids), `home-no-scroll category-open` (a category list),
  `+ region-bar-open` after `click text=Regioni`.
- **La vetrina in home.** Sotto il racconto ci sono **due** `.consigli-strip` (prima era
  una sola, sotto le foto di famiglia, che adesso stanno su `/info`): "I nostri consigli"
  con 20 vini e "Dalla dispensa" con 20 alimentari. Schede `.consiglio-card`,
  `.consiglio-name`, link `.consigli-strip-all`. **`wait-for .consiglio-name` aspetta solo
  la prima fascia**: per la seconda serve `wait-for .consigli-strip >> nth=1`, altrimenti
  `querySelectorAll(".consigli-strip")[1]` è `undefined` (presa per un bug una volta).
  I venti prodotti sono SEGNAPOSTO scelti da `src/data/vetrina.js`, non consigliati veri:
  in produzione i prodotti marcati `consigliato` sono zero.
- **Selezione della casa.** Tab Consigliati dell'Enoteca:
  `/enoteca/consigliati`, contenitore `.consigliati-scroll`, un `.consigliati-gruppo` per
  categoria non vuota. Contrassegno sulle card del catalogo: `.product-consigliato`.
  Blocco nella scheda: `.sheet-consiglio-block`. La scheda di un consigliato è
  raggiungibile in diretta: `nav /enoteca/consigliati/<id>`.
- **La home ora SCORRE** (niente `home-no-scroll`), a differenza di Enoteca, Gastronomia e
  Login che lo usano ancora. `body-classes` su `/` deve stampare una riga vuota: se stampa
  `home-no-scroll` stai guardando una versione vecchia.
- Le illustrazioni incise sono `.mini-icon-watermark--img`. `count` su quella classe
  contro `count .mini-cell` dice al volo quanti gruppi hanno l'immagine e quanti no —
  è il controllo più veloce dopo aver aggiunto un'illustrazione.

## Testing the admin panel without touching production

The section above points `VITE_API_URL` at the **live** backend, so anything you do in the
admin panel edits the shop's real catalogue. To exercise it for real — login, create,
edit, delete — start the sibling repo's disposable backend instead. It boots an in-memory
Mongo, so nothing survives and nothing is production. See
`backend/.claude/skills/run-enoteca-detoma-backend/`.

From `backend/`, with a seeded catalogue (4 wines, 1 beer, 2 alimentari — di cui **tre
marcati "consigliato", uno per tipo**, che è il minimo per far comparire la tab Consigliati
e la fascia in home) and the API held open on port 3011:

```powershell
Start-Process node -ArgumentList '.claude/skills/run-enoteca-detoma-backend/driver.mjs','--hold' -RedirectStandardOutput "$env:TEMP\hold.log" -RedirectStandardInput '.claude/skills/run-enoteca-detoma-backend/seed-locale.txt' -WindowStyle Hidden
```

Then start this repo's dev server against it and drive the panel — the account is
`admin` / `Password1!`. La variabile va impostata **dentro** il processo figlio (vedi
"`$env:VITE_API_URL` NON arriva a un `Start-Process npm.cmd`" più sopra):

```powershell
Start-Process cmd.exe -ArgumentList '/c','set "VITE_API_URL=http://localhost:3011" && npm run dev' `
  -RedirectStandardOutput "$env:TEMP\vite.log" -WindowStyle Hidden
```

```powershell
@'
nav /admin
wait-for #login-username
fill #login-username admin
fill #login-password Password1!
press Enter
wait-for .admin-product-grid
count .admin-product-grid > *
text .admin-content-count
click .admin-topbar-link >> text=Alimentari
wait-for .admin-product-grid
screenshot admin-alimentari
console
'@ | node .claude/skills/run-enoteca-detoma-frontend/driver.mjs --desktop
```

Verified 2026-08-14: logs in, `2 vini` (Vini Rossi, la categoria di apertura) / `1 prodotto`,
un `.admin-consigliato-tag` in griglia, `ERRORS none`, exit 0. The public side reads the
same data (`/enoteca/vini/bianchi` → `Gavi di prova · Piemonte · € 14,00`).

Il campo "consigliato" si prova da qui: matita su un prodotto → la spunta **Consigliato
dall'enoteca** sotto Descrizione → appare la nota → Salva. La griglia mostra subito il
contrassegno `.admin-consigliato-tag`, e `/` e `/enoteca/consigliati` si aggiornano.

Admin landmarks: `#login-username`, `#login-password`, `.admin-topbar`,
`.admin-topbar-user`, `.admin-topbar-link` (Vini / Birre / Alimentari / Account),
`.admin-product-grid`, `.admin-content-count`, `.admin-loading`.

## Build and preview

```powershell
$env:VITE_API_URL = 'https://detoma-backend.vercel.app'; npm run build
```

**~2.5 min on a cold `.vite` cache, ~22 s warm** (`vite:asset` 66% + the Babel/React
Compiler preset 21% of plugin time). Warns about `famiglia_3-*.png` at 3.6 MB and a
458 kB JS bundle — both pre-existing, not a failure.

`npm run preview` alone serves a **blank page**: `vite.config.js` only sets
`base: '/enoteca-detoma/'` when `command === 'build'`, so preview serves at `/` while
`dist/index.html` asks for `/enoteca-detoma/assets/*.js` → 404. Pass the base explicitly:

```powershell
npx vite preview --base /enoteca-detoma/
```

```powershell
@'
nav /enoteca-detoma/enoteca
wait-for .mini-cell
screenshot preview
console
'@ | node .claude/skills/run-enoteca-detoma-frontend/driver.mjs --base http://localhost:4173 --desktop
```

Stop it the same way as the dev server, on port **4173**.

## Preparare le illustrazioni di categoria

`scontorna-illustrazioni.mjs` (stessa cartella) trasforma le illustrazioni incise
consegnate dal cliente in asset usabili: scontorna, ritaglia sul contenuto e riduce a
256px webp lossy.

**Controlla SEMPRE l'alpha prima di decidere cosa fare** — vedi Gotchas: l'occhio non
distingue "trasparente" da "scacchiera dipinta". Finora sono arrivati due casi diversi:

- **vini** (`.webp`) e **distillati** (`.png`): nessun alpha, la "trasparenza" era una
  scacchiera dipinta nei pixel in due grigi (~254 e ~244) più un alone tinto attorno al
  disegno. Su una card verdina si vedeva un quadrato bianco. 1,8 MB → 158 KB per sei.
- **gastronomia** (`.webp`): alpha vero già a posto, serviva solo ritaglio e riduzione da
  512px. 313 KB → 98 KB per cinque.

Lo script fa flood fill dai bordi (solo lo sfondo *connesso* al bordo sparisce, così le
etichette color crema dentro il disegno restano) e toglie l'alone bianco sui bordi
antialiasati. Su un file già scontornato il flood fill non trova niente da togliere e
resta solo ritaglio + riduzione: passarci un set pulito è innocuo.

```powershell
node .claude/skills/run-enoteca-detoma-frontend/scontorna-illustrazioni.mjs             # tutti i set
node .claude/skills/run-enoteca-detoma-frontend/scontorna-illustrazioni.mjs distillati  # solo uno
```

Un file già a ≤256px viene **saltato** (stampa "già a <=256px, saltato"): i set che leggono
e scrivono nella stessa cartella vengono rilanciati quando il cliente consegna *un* file
nuovo, e gli altri non devono pagare una generazione di webp lossy in più.

I set (`vini`, `distillati`, `gastronomia`, `dolceria`) e la mappa nome-sorgente → nome-destinazione
stanno in cima al file: per una serie nuova si aggiunge una voce lì. Di default legge da
`%USERPROFILE%\Downloads\`; con `from` legge da una cartella del progetto e può riscrivere
sul posto (è quello che fa `gastronomia`). Accetta `.png` e `.webp` in ingresso.

**`FULL` deve restare sotto il tono più scuro della scacchiera (~243)**: se sta sopra, i
quadretti scuri restano opachi al 25% e la scacchiera riappare sbiadita.

Le immagini poi vanno collegate in `src/data/data.js`, non in un modulo a parte:
`illustrazione:` sulle categorie di vini e distillati, e la mappa `illustrazioni` dentro
`ALIMENTARI_CATEGORIES` per i gruppi alimentari (chiave = `sottocategoria`
normalizzata — minuscola e senza accenti, ma spazi e apostrofi restano).

Per controllare il risultato senza fidarsi dell'occhio — il visualizzatore di immagini
disegna *lui* una scacchiera per l'alpha, quindi non distingue "trasparente" da "scacchiera
dipinta":

```powershell
@'
nav /enoteca
wait-for .mini-cell
sleep 2000
screenshot vini
'@ | node .claude/skills/run-enoteca-detoma-frontend/driver.mjs
```

## Convertire foto e logo (`converti-foto.mjs`)

Stessa cartella, stesso Chromium: ridimensiona a webp le immagini che non sono
illustrazioni incise. Il criterio è sempre lo stesso — **misura CSS a cui l'immagine è
disegnata × il DPR massimo che vuoi servire (3)**; oltre quella soglia stai spedendo pixel
che nessuno vedrà.

```powershell
node .claude/skills/run-enoteca-detoma-frontend/converti-foto.mjs        # tutti
node .claude/skills/run-enoteca-detoma-frontend/converti-foto.mjs logo   # solo uno
```

Fatto il 2026-08-11, misurato sul `dist/` servito: **home 4211 KB → 444 KB**, alimentari
642 KB → 138 KB. I tre job già lanciati: `famiglia_3` 3512→151 KB (era un PNG 1918×1080
disegnato a 342×152), `famiglia_2` 295→33 KB, `logo` 205→62 KB.

- **Lo script NON cancella il `.png` sorgente.** Per le foto di famiglia cancellarlo è
  **obbligatorio**: `import.meta.glob` in `Home.jsx` prende `.png` *e* `.webp`, quindi
  finché ci sono entrambi la stessa foto compare due volte nello slideshow. Verifica con
  `eval [...document.querySelectorAll('.family-photo')].map(i=>i.currentSrc)` — devono
  essere 3.
- Il logo è un import diretto (`App.jsx`), quindi lì la riga va cambiata a mano.
- Rilanciarlo dopo aver cancellato i png stampa "sorgente assente, già convertito" e non è
  un errore.
- **Sul logo l'alpha non si perde mai**: Chrome codifica il canale alpha senza perdita, a
  qualunque qualità (misurato: errore 0 su tutte). Degrada solo l'RGB, che qui è nero
  pieno. Per questo `q: 0.8` (62 KB, errore 3.8/255) invece di 0.92 (75 KB, errore 2.5):
  13 KB per una differenza invisibile.

### Convertire un sorgente che NON è png/jpeg (es. un `.webp` dal client)

`converti-foto.mjs` ha `JOBS` scritti a mano e ricava il nome di uscita con
`replace(/\.(png|jpe?g)$/i, '.webp')`: con un sorgente **già** `.webp` la destinazione
coinciderebbe col sorgente e lo riscriverebbe in perdita a ogni rilancio. Per una conversione
una-tantum da un file fuori dal repo conviene NON toccare lo script e riusare solo il suo
metodo (stesso canvas, stesso Chromium), lanciandolo **dalla cartella della skill** — è lì
che sta `playwright`, non fra le dipendenze dell'app:

```powershell
cd .claude/skills/run-enoteca-detoma-frontend
node -e "import('playwright').then(async ({chromium})=>{ /* leggi, drawImage su canvas alla
larghezza voluta, toDataURL('image/webp', q), scrivi nel src/images dell'app */ })"
```

Fatto il 2026-08-12 per `detoma-frame.webp` (illustrazione della facciata, da Downloads):
1440×1080 → 720×540, **392 KB → 93 KB** a `q: 0.82`. 720 scelto per lasciare margine: la
scheda "Dove siamo" poteva ancora crescere, e infatti è poi passata a tutta larghezza.

## Misurare il layout invece di guardarlo

Per le domande di spaziatura ("quanto dista X da Y?", "da dove vengono questi 72px?") il
driver headless dà numeri in un colpo solo, e sono numeri che a occhio non si ricavano.
Ricetta usata il 2026-08-12, che ha trovato **56px di `padding-bottom` su `.shop-section`**
che nessuno cercava lì:

```js
// risali la catena dei box dal nodo fino a body: dove finisce lo spazio si vede subito
let el = document.querySelector('.info-piva'); const out = [];
while (el && el !== document.documentElement) {
  const cs = getComputedStyle(el), r = el.getBoundingClientRect();
  const pr = el.parentElement?.getBoundingClientRect();
  out.push({ el: el.tagName + '.' + (el.className || '').split(' ')[0],
             padB: cs.paddingBottom, spaceToParentBottom: pr ? Math.round(pr.bottom - r.bottom) : null });
  el = el.parentElement;
}
return out;   // poi console.table() lato node
```

**`getBoundingClientRect()` include le trasformazioni**, e su questo sito è una trappola
vera: `.site-nav` entra con la @keyframes `site-nav-in` (`translateY(140%)` → 0, App.css),
quindi misurata al montaggio la tab bar risultava **85px sotto il fondo dello schermo**. Per
le misure di layout usa `offsetHeight` e il `bottom` di `getComputedStyle`, che sono valori
di layout e ignorano l'animazione. Stesso genere di errore: `ResizeObserver` →
`contentRect.height` **esclude il padding** (sull'header sono 39px): se ti serve il box
intero, `offsetHeight`.

Controlla sempre le due sponde del breakpoint: a 390×844 la tab bar è `fixed`, da 641px in
su diventa `static` dentro l'header e le misure devono azzerarsi da sole.

## Lint

```powershell
npm run lint
```

Clean, no output. **There is no test suite** — this smoke run is the verification.

## Human path

`npm run dev`, open `http://localhost:5173/`, Ctrl-C to stop. `server.host` is `true`, so
the printed Network URL works from a phone on the same LAN — the only way to check the
real touch layout.

## Gotchas

- **Empty lists + `ERR_CONNECTION_REFUSED` ×26** — the classic symptom of an unset
  `VITE_API_URL`, and **obsolete since 2026-08-15**: the fallback is the production
  backend, so an unconfigured server now loads fine. If you still see this, you pointed
  `VITE_API_URL` at a local backend that is not running. `console` in the driver is what
  surfaces it.
- **Non fidarti dell'anteprima immagini per l'alpha.** Il visualizzatore disegna *lui* una
  scacchiera dove c'è trasparenza, quindi "trasparente" e "scacchiera dipinta nei pixel"
  sono identici a vedersi. Vanno contati i pixel: carica il file in Chromium e misura il
  canale alpha (`d[i+3] < 8`). È così che si è scoperto che i sorgenti erano opachi al
  100%, e poi che una soglia sbagliata lasciava i quadretti scuri opachi al 25%.
- **Uno screenshot subito dopo un hot-reload CSS o un cambio tab può mentire.** Due volte
  è tornata una griglia vuota o senza immagini mentre l'app era a posto: HMR ripaint a
  metà, oppure `count`/`eval` eseguiti mentre React stava rimontando la lista. Prima di
  dichiarare un bug, ricontrolla con un `nav` pulito e ispeziona gli elementi
  (`naturalWidth`, `getComputedStyle`) invece di credere al primo PNG.
- **`.claude` was fully gitignored.** It is now `.claude/*` + `!.claude/skills/`, so this
  skill is committed while local settings stay out. Don't revert that line.
- **`vite preview` needs `--base /enoteca-detoma/`** — see above. Same class of bug as a
  404 on GitHub Pages.
- **Default viewport is mobile on purpose.** The bottom tab bar and the bottom sheet only
  exist below the mobile breakpoint; `--desktop` gives you a different component layout,
  not the same page wider.
- **Playwright version ≠ browser build.** A cached `chromium-1228` did not satisfy
  Playwright's `1234`; the error tells you to run `npx playwright install`. Rerun it in
  the skill dir after any `npm update` there.
- **`Set-Location` persists across PowerShell tool calls.** After `cd`-ing into the skill
  dir to install, `Set-Location` back to `frontend/` or the driver path resolves twice.
- **`.filter-back`** exists in the source but is not clickable while the region bar is
  open — close the bar by other means, or just `nav` away.
- **`click .sheet-close` si pianta per 15s: chiudi la scheda con `press Escape`.** La ✕ è
  `position:absolute` ma il suo punto centrale è coperto da `.sheet-thumb`, che quindi si
  prende il click. Misurato il 2026-08-14 a scheda ferma (dopo `sleep 1200`): ✕ nel box
  `y 666–696`, `.sheet-thumb` che parte a `y 682` — `document.elementFromPoint()` sul
  centro della ✕ restituisce `DIV.sheet-thumb`, non il bottone. Succede su tutte le
  categorie, non solo sui consigliati, ed è **indipendente** dalla feature: capita anche in
  `/enoteca/vini/rossi`. È al limite di un pixel e dipende dall'altezza del contenuto, per
  cui a volte passa e a volte no — il caso peggiore è proprio quello: uno smoke che passa
  oggi e domani resta appeso. `smoke.txt` usa `press Escape` per questo.
  **Vale anche per il dito vero:** su telefono un tocco basso sulla ✕ può non registrarsi.
- **`count` non aspetta, `wait-for`/`text` sì.** `count .consigliati-gruppo` subito dopo un
  `nav` restituisce 0 mentre la fetch è ancora in volo, e sembra una lista vuota. Preso per
  un bug due volte. Metti sempre un `wait-for` su un elemento che esiste solo a dati
  arrivati (`.consiglio-name`, `.product-list`) prima di contare.
- **La fascia dei consigli in home non c'è finché non ci sono consigli.** `Home.jsx` rende
  `null` se l'elenco è vuoto o non ancora arrivato: contro un catalogo senza nessun
  prodotto marcato "consigliato" la home è identica a prima. Non è un bug di layout — è il
  database. Il seed usa e getta (`seed-locale.txt` nella skill del backend) ne marca tre,
  uno per tipo, apposta.
- **`text=<parola>` is ambiguous once you're in the admin panel.** The site's own nav pills
  sit above it, so `click text=Alimentari` hits the *site* nav (Playwright takes the first
  match) and silently leaves the panel. Scope it:
  `click .admin-topbar-link >> text=Alimentari`.
- **`.admin-product-grid` always has one child more than there are products** — the first
  cell is the "new product" card (`WineManager.jsx:122`). Read `.admin-content-count`
  ("1 vino") instead of counting DOM nodes.
- **`wait-for .admin-topbar` is not enough to screenshot the panel.** The topbar renders
  immediately while the list is still `Caricamento…`; the first attempt here produced
  exactly that screenshot. Wait for `.admin-product-grid`.

## Troubleshooting

- **`Cannot find module '…\run-enoteca-detoma-frontend\.claude\skills\…\driver.mjs'`** —
  the shell's cwd is still the skill directory. `Set-Location` to `frontend/`.
- **`browserType.launch: Executable doesn't exist at …chromium_headless_shell-1234…`** —
  `npx playwright install chromium` inside the skill dir.
- **`SHOT …fail-<cmd>.png`** — the driver screenshots every failed command before
  continuing. Read that PNG first; it usually shows the page never got past a loading state.
- **Dev server won't bind 5173** — an old one is still listening. Kill it with the
  `Get-NetTCPConnection` line above; `Ctrl-C` on a backgrounded `npm run dev` doesn't
  reach the Vite child.
- **`net::ERR_CONNECTION_REFUSED` on `http://localhost:5173/…` in a run that worked a
  minute ago** — the dev server was started with `Start-Job` and died when that shell call
  ended. Restart it with `Start-Process` (see Run). `Get-Job` returning nothing is the
  confirmation.
