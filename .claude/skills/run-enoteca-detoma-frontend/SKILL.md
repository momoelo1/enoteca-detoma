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

**There is no `.env` in this checkout and it is gitignored.** Without `VITE_API_URL` the
services fall back to `window.location.hostname:3001`, nothing is listening there, and
every product list comes up empty with a wall of `ERR_CONNECTION_REFUSED`. Set it in the
shell that starts the server — no file to create, nothing to clean up:

```powershell
$env:VITE_API_URL = 'https://detoma-backend.vercel.app'
```

That is the **production** backend (Atlas + Cloudinary). Reading it is fine; do not run
admin mutations against it.

## Run (agent path)

Start the dev server in the background, then poll — don't sleep. First boot re-optimizes
deps and takes ~8 s.

```powershell
$env:VITE_API_URL = 'https://detoma-backend.vercel.app'; npm run dev
```

```powershell
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
| `console` | print collected console errors, page errors and HTTP ≥ 400 |
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

## Build and preview

```powershell
$env:VITE_API_URL = 'https://detoma-backend.vercel.app'; npm run build
```

Takes ~2.5 min (Babel + the React Compiler preset dominate). Warns about
`famiglia_3-*.png` at 3.6 MB and a 495 kB JS bundle — both pre-existing, not a failure.

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
consegnate dal cliente in asset usabili. Serve perché **i file sorgente non hanno alpha**:
la "trasparenza" è una scacchiera dipinta nei pixel, in due grigi (254 e 244) più un alone
tinto attorno al disegno. Messi così su una card verdina si vede un quadrato bianco.

Lo script fa flood fill dai bordi (solo lo sfondo *connesso* al bordo sparisce, così le
etichette color crema dentro il disegno restano), toglie l'alone bianco sui bordi
antialiasati, ritaglia sul contenuto e riduce a 256px webp lossy — 1,8 MB → 158 KB per sei.

```powershell
node .claude/skills/run-enoteca-detoma-frontend/scontorna-illustrazioni.mjs           # tutti i set
node .claude/skills/run-enoteca-detoma-frontend/scontorna-illustrazioni.mjs distillati # solo uno
```

Legge da `%USERPROFILE%\Downloads\`, scrive in `src/images/<set>/`. I set (`vini`,
`distillati`) e la mappa nome-sorgente → nome-destinazione stanno in cima al file: per una
serie nuova si aggiunge una voce lì. Accetta sia `.png` che `.webp` in ingresso — il
problema della scacchiera è lo stesso in entrambi i formati.

**`FULL` deve restare sotto il tono più scuro della scacchiera (~243)**: se sta sopra, i
quadretti scuri restano opachi al 25% e la scacchiera riappare sbiadita.

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

- **Empty lists + `ERR_CONNECTION_REFUSED` ×26** — you started the server without
  `VITE_API_URL`. The page still renders its shell, so it looks like a CSS bug. Restart
  the server with the env var; `console` in the driver is what surfaces it.
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
