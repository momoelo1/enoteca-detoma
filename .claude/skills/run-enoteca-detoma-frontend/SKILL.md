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
survives, as does the backend below. Ready in **4–15 s** a seconda della cache di Vite e di
quanto è occupata la macchina (misurato `ready in 15147 ms` con due server in parallelo) —
per questo si fa polling e non `sleep`.

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

Verified output: `COUNT .mini-cell = 6` (statico, viene da `data.js`), `ERRORS none`,
exit code 0. **`COUNT .product-list > *` dipende da quale backend hai puntato**: 207
contro la produzione, 2 contro il backend usa e getta con `seed-locale.txt`. Non è un
numero da controllare, è un numero da leggere.

Durata: **~70 s** a server caldo (2026-08-25). **Il primo giro dopo aver avviato il dev
server può fallire** su `click .mini-cell >> nth=0` con `Timeout 15000ms` — Vite sta
ancora compilando la rotta al primo accesso e il click ha 15 s di pazienza. Successo il
2026-08-25 con un secondo server che partiva in parallelo; lo stesso click, isolato e a
caldo, passa. **Rilancia prima di indagare.**

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

**`vite.config.js` NON fissa la porta.** Qui c'era scritto il contrario (`server.port`):
è falso, l'unica chiave sotto `server` è `host: true`. Verificato il 2026-08-25 leggendo il
file e lanciando due server di fila. Conseguenze, tutt'e due utili:

- niente `strictPort`, quindi il secondo server **non muore**: Vite stampa
  `Port 5173 is in use, trying another one...` e si prende la **5174**;
- un dev server avviato con `Start-Process` sopravvive alla chiamata che lo ha creato e
  anche alla sessione, quindi quello che trovi sulla 5173 può non essere tuo.

Due misure, non congetture:

```powershell
# 1. chi ascolta, e da QUANDO. Se StartTime è di ieri, non è il tuo.
Get-NetTCPConnection -LocalPort 5173 -State Listen | ForEach-Object {
  $p = Get-Process -Id $_.OwningProcess; "PID $($_.OwningProcess) avviato $($p.StartTime)"
}

# 2. a quale API è legato davvero: il modulo servito ha l'URL dentro.
$c = (Invoke-WebRequest "http://localhost:5173/src/services/wines.js" -UseBasicParsing).Content
(([regex]::Matches($c,'https?://[^"'' ]+')) | ForEach-Object { $_.Value } | Select-Object -Unique)
```

**Attenzione a come si legge il controllo 2.** Da quando il fallback è la produzione, quel
comando stampa **sempre** almeno un URL, perché la stringa di fallback sta nel sorgente:
`detoma-backend.vercel.app` da solo non distingue "VITE_API_URL impostata" da "sto usando
il fallback". Dice solo che **non** stai parlando con un backend locale. Se ti aspettavi
`http://localhost:3011` e non lo vedi, la variabile non è arrivata.

### Un secondo dev server, senza toccare quello dello sviluppatore

Sulla 5173 gira spesso il server dello sviluppatore, e ammazzarlo è scortese. Siccome non
c'è `strictPort`, ne lanci un altro e basta: finisce sulla **5174**, con la sua
`VITE_API_URL`, e lo piloti con `--base`.

```powershell
Start-Process cmd.exe -ArgumentList '/c','set "VITE_API_URL=https://detoma-backend.vercel.app" && npm run dev' `
  -RedirectStandardOutput "$env:TEMP\vite2.log" -WindowStyle Hidden
for($i=0;$i -lt 60;$i++){ try { Invoke-WebRequest 'http://localhost:5174/' -UseBasicParsing -TimeoutSec 2 | Out-Null; break } catch { Start-Sleep -Milliseconds 700 } }
```

```powershell
... | node .claude/skills/run-enoteca-detoma-frontend/driver.mjs --base http://localhost:5174
```

Alla fine spegni **solo la 5174**. Verificato il 2026-08-25: `Local: http://localhost:5174/`
nel log del secondo, tutt'e due i server vivi insieme, `ERRORS none` sul secondo.

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

### E nemmeno la cartella: `Start-Process` parte dalla RADICE del progetto

Stessa famiglia di trappola, altri dieci minuti (2026-08-31). La cartella di lavoro
dell'agente è `enoteca-detoma/`, **non** `enoteca-detoma/frontend/`: lì `npm run dev` non
trova nessun `package.json` e il figlio muore subito. `Start-Process` non eredita un `cd`
fatto in una chiamata precedente, quindi la cartella va detta ogni volta con
`-WorkingDirectory`, in assoluto.

```powershell
$fe = "c:\Users\ACER\Desktop\PERSONALE\enoteca-detoma\frontend"
Start-Process cmd.exe -ArgumentList '/c','set "VITE_API_URL=https://detoma-backend.vercel.app" && npm run dev' `
  -WorkingDirectory $fe -RedirectStandardOutput "$env:TEMP\vite2.log" -WindowStyle Hidden
```

**Il sintomo è il silenzio**: il log di redirect resta **vuoto** (zero byte, non un
messaggio d'errore — quello finisce su stderr, che non stai registrando) e il polling
scade senza che niente ascolti la porta. Se il log è vuoto non indagare su Vite: hai
sbagliato cartella. Registrando anche `-RedirectStandardError` si vedrebbe il vero
`ENOENT`; vuoto contro pieno è comunque il modo più veloce per distinguerlo.

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

**`fill` spezza sullo SPAZIO: il selettore non può contenerne.** L'argomento
viene diviso al primo spazio, quindi `fill .admin-annata-row input[type=number] 55`
manda `.admin-annata-row` come selettore e `input[type=number] 55` come valore,
e Playwright risponde `Element is not an <input>` — che sembra un problema del
DOM e non è. Usa un selettore senza spazi (`input[type=number]`,
`.admin-formato-row:nth-child(2)>.admin-field>input`) oppure riempi con `eval`.
Vale solo per `fill`: `click` e `wait-for` prendono tutta la riga, per quello
`click .admin-product-cell:has-text("Barolo") .admin-icon-btn >> nth=0` funziona.

**`nav file:///…` non funziona.** Il percorso viene incollato sulla base e la
pagina resta bianca — lo screenshot che ne esce è un rettangolo vuoto, non un
errore. Per provare una pagina HTML scritta al volo (isolare una regola CSS,
confrontare due varianti di un'immagine) servila su una porta libera:

```powershell
# server-prova.mjs: risponde lo stesso file a qualunque richiesta
Start-Process node -ArgumentList 'server-prova.mjs','pagina.html' -WindowStyle Hidden
```

```powershell
... | node .claude/skills/run-enoteca-detoma-frontend/driver.mjs --base http://localhost:4599
```

Usato il 2026-08-28 per dimostrare `font-variant: small-caps` sulle descrizioni
e per confrontare quattro trasformazioni Cloudinary sulle foto delle bottiglie
fianco a fianco. Isolare la regola in una pagina di due righe è molto più
rapido che cercarla dentro il sito vero.

### Landmarks worth knowing

- `/enoteca` and `/alimentari` both open a **`.mini-cell` grid**, not `.cat-card` — the
  mini-cards are the current entry grid.
- Product list rows are `.product-list > *`; the bottom sheet is `.sheet-name`,
  `.sheet-close`, `.sheet-cta`. Per aprire una scheda usa il `click` del driver
  (`click .product-list > * >> nth=0`): un `.click()` sull'`<li>` dentro un `eval`
  **non apre niente**, perché a ricevere l'evento dev'essere il bottone dentro la riga.
- Deep links work: `nav /enoteca/vini/rossi/<id>` opens straight into the sheet.
- Body classes observed: `home-no-scroll` (home), `home-no-scroll page-pinned`
  (`/enoteca`, `/alimentari` grids), `home-no-scroll category-open` (a category list),
  `+ region-bar-open` after `click text=Regioni`.
- **La vetrina in home — e la trappola delle schede fantasma.** Sotto il racconto ci sono
  **due** `.consigli-strip`: "I nostri consigli" (vini) e "Dalla dispensa" (alimentari).
  Sono i consigliati **veri**, presi da `?consigliato=true`: i venti segnaposto di
  `src/data/vetrina.js` non esistono più, il file è stato cancellato il 2026-08-15.

  Mentre i dati arrivano ogni fascia disegna **sei schede vuote** che portano la stessa
  classe delle vere. Da cui tre regole, tutte misurate il 2026-08-25:

  | vuoi sapere… | usa | NON usare |
  |---|---|---|
  | quante schede vere ci sono | `count .consiglio-name` | `count .consiglio-card` — conta anche i fantasmi |
  | se i dati sono arrivati | `wait-for .consiglio-name` | `wait-for .consigli-strip` — il telaio c'è **subito** |
  | se ha finito di caricare **tutto** | `count .consiglio-card--fantasma` = 0 | un `sleep` a caso |

  Numeri veri di una corsa: appena `.consigli-strip >> nth=1` esiste →
  `.consiglio-card = 12`, di cui `.consiglio-card--fantasma = 12` e `.consiglio-name = 0`.
  Cioè: la vecchia attesa consigliata qui sopra ora ritorna **prima che esista un solo
  prodotto**. Le due fasce caricano indipendentemente, quindi a metà strada si vedono
  `7 = 1 vera + 6 fantasma`; a regime `2 / 0 / 2`.
- **Selezione della casa: DUE tab, una per sezione.** Il segno è sempre una stella in alto
  a destra sulla card (`.product-consigliato` nel catalogo, `.consiglio-star` in home).
  - Enoteca → `/enoteca/consigliati`: solo **vini e birre**.
  - Alimentari → `/alimentari/consigliati`: solo il **cibo**. Aggiunta il 2026-08-15
    insieme alla terza `.group-tab` (Gastronomia | Dolceria | Consigliati); prima gli
    alimentari comparivano in fondo alla tab dell'Enoteca.

  Le due condividono il markup: `.consigliati-scroll`, `.consigliati-intro`, un
  `.consigliati-gruppo` per gruppo non vuoto. Deep link diretto in tutt'e due:
  `nav /alimentari/consigliati/<id>` apre la scheda. Su queste rotte `body-classes`
  stampa **vuoto** (scorre il documento, niente `page-pinned`).

  **Nella scheda prodotto non c'è nulla di consigliato**: il blocco
  `.sheet-consiglio-block` con la nota scritta a mano è stato tolto il 2026-08-15 insieme
  al campo `consiglio`. Il flag è solo sì/no.
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

Verificato il 2026-08-25: entra, `2 vini` (Vini Rossi, la categoria di apertura),
`.admin-product-grid > * = 3`, `.admin-stella = 2`, `ERRORS none`. Screenshot letto: la
stella piena e dorata sul Barolo con il bordo dorato sulla tessera, quella spenta e grigia
sul Chianti.

Il campo "consigliato" si prova **senza aprire la modifica**: la stella in alto a destra
(`.admin-stella`, più `.admin-stella--attiva` quando è accesa) è un bottone e salva da sola
con un PUT del solo campo `consigliato`. Il vecchio `.admin-consigliato-tag` (la pillola
"★ Consigliato") **non esiste più**.

**Non giudicare l'esito dalla UI subito dopo il click.** Contro il backend usa e getta il
PUT dal browser impiega **secondi** e la tessera si aggiorna quando risponde, quindi un
`eval` a 3 s dal click legge ancora lo stato vecchio e sembra che il click non abbia fatto
niente. Misurato: UI `Chianti=true` mentre il database diceva già `False`. Chiedi al
database, non alla pagina:

```powershell
((Invoke-WebRequest 'http://localhost:3011/api/wines?category=rossi' -UseBasicParsing).Content | ConvertFrom-Json) |
  ForEach-Object { "$($_.name)=$($_.consigliato)" }
```

E **non leggere il database da dentro la pagina** con un `fetch` nell'`eval`: quella
risposta arriva dalla cache HTTP e mente. Serve `{cache:"no-store"}`, o meglio leggilo da
PowerShell come qui sopra. Mezz'ora persa così il 2026-08-15.

Admin landmarks: `#login-username`, `#login-password`, `.admin-topbar`,
`.admin-topbar-user`, `.admin-topbar-link` (Vini / Birre / Alimentari / Account),
`.admin-product-grid`, `.admin-content-count`, `.admin-loading`.

Sulla barra dei filtri (`AdminFilterBar`), due cose che costano una corsa buttata:

- **i `.filter-toggle` non sono sempre due.** La lente compare solo da **6 prodotti in
  su** (`canSearch={wines.length >= 6}`), quindi su un catalogo usa e getta ce n'è **uno
  solo**, ed è "Regioni": `>> nth=1` va in timeout. Prendilo per testo —
  `click .admin-filter-actions .filter-toggle >> text=Regioni`.
- **dopo il login, aspetta `.admin-filter-actions`, non `.admin-product-grid`.** Con i 40 s
  del login a freddo la griglia a volte arriva oltre il tetto di 20 s del `wait-for`,
  mentre il conteggio e i nomi ci sono già: sembra rotta e non lo è.

Le voci del filtro si leggono con `eval [...document.querySelectorAll(".admin-filter-bar
.filter-label")].map(e=>JSON.stringify(e.textContent))` — **con `JSON.stringify`**, o uno
spazio in coda ("Piemonte " contro "Piemonte") resta invisibile ed è esattamente il difetto
che stai cercando.

## Build and preview

```powershell
$env:VITE_API_URL = 'https://detoma-backend.vercel.app'; npm run build
```

Timing is **very variable**, measured on this machine: 9,7 s / 15 s / 1 m 19 s / 2 m 30 s
per corse diverse dello stesso identico albero (`vite:asset` 66% + il preset Babel/React
Compiler 21% del tempo dei plugin). Non allarmarti per una corsa lenta: non è un errore.

Asset di uscita al 2026-08-25: `index-*.js` **461 kB**, immagine più pesante
`famiglia_3-*.webp` **151 kB**, e l'unico `.png` rimasto è `famiglia_1` a 55 kB.
Il vecchio warning su `famiglia_3-*.png` a 3,6 MB **non esiste più** — quella foto è stata
convertita in webp (vedi `converti-foto.mjs`).

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

**Il nome del prodotto è l'altra trappola, e morde più della tab bar.** Un nome
troppo lungo prende la classe `product-name--scroll` e scorre in verticale
(@keyframes `product-name-marquee`, 15s) dentro `.product-name-wrap`, che è alto
42px con `overflow: hidden`. Misurato col rect, quindi, il nome **si muove nel
tempo**: campionato ogni 600ms il 2026-08-28 andava da `translateY(-8)` a
`translateY(-26)` e ritorno, mentre `offsetTop` restava fisso a 137.

Costo di non saperlo: due misure prese in istanti diversi sembravano dire che
una modifica al CSS delle immagini aveva peggiorato una sovrapposizione da 6px a
11px. Non era vero — erano due fotogrammi della stessa animazione, e la
sovrapposizione non esiste proprio, perché il wrap ritaglia il testo. **Se stai
misurando qualcosa vicino a `.product-name`, campiona più volte prima di
concludere, e confronta `offsetTop` (layout) con `rect.top` (visivo): se
divergono, stai guardando l'animazione.** La prima riga tagliata a metà glifo
negli screenshot è il marquee che fa il suo lavoro, non un bug.

Dal 2026-08-31 lo stesso meccanismo sta anche in home, su `.consiglio-name` dentro
`.consiglio-name-wrap` (tre righe invece di due, @keyframes `consiglio-name-marquee`).
Lì però il marquee parte **solo a scorrimento fermo e a scheda intera in vista**, quindi
in uno screenshot preso durante uno scroll i nomi sono tutti immobili: è il gate, non una
regola che non si applica.

### Far scegliere fra più varianti: l'interruttore TEMP in pagina

Quando la domanda è "quale di queste ti piace" (un font, un colore, una
spaziatura), la risposta non è uno screenshot per volta: è **un pannello di
prova montato nel sito vero**, che le cambia dal vivo sui dati veri. È la
forma che l'utente chiede esplicitamente ("try them all"), e si smonta in due
mosse quando la scelta è fatta. Fatto il 2026-09-03 per il font dei nomi
prodotto (`src/components/temp/FontNomeTEMP.jsx`, poi cancellato).

La ricetta che ha funzionato:

- il componente scrive una **variabile CSS su `document.documentElement`**
  (`--font-nome`, `--peso-nome`); le regole interessate la leggono con il
  valore di oggi come **fallback** — `font-family: var(--font-nome, "Cormorant
  Garamond", …)`. Così, tolto il pannello, il sito resta esattamente com'era e
  non c'è niente da srotolare;
- **tutto lo stile in linea** nel componente: nessun `.css` da ricordarsi di
  cancellare insieme;
- la scelta in `localStorage`, o cambiare pagina la azzera e non si riesce a
  guardare;
- si chiude scegliendo: a 390px il pannello copre proprio le schede da
  giudicare;
- una sola cartella `src/components/temp/` + due righe marcate TEMP in
  `App.jsx`, elencate in testa al file. Cancellare deve costare dieci secondi.

**La trappola vera: caricare i candidati distrugge il termine di paragone.**
Mettendo tutti i font in `index.html` si carica anche il peso che oggi NON
c'è (lì: Cormorant 700), e la voce "com'è adesso" smette di mostrare com'è
adesso. Il font va caricato **solo quando si sceglie quella voce**, iniettando
il `<link>` da JS; e quando si apre l'elenco si caricano tutti tranne quello
sensibile, che altrimenti falsa il confronto appena si guarda.

### Misurare un font che la pagina non sta ancora usando: non si può

Un `<span>` nascosto con `font-family` di un webfont **non ancora usato**
torna le metriche del ripiego, non del font: i webfont si caricano a richiesta
e `document.fonts` li elenca `unloaded` finché qualcosa non li disegna. Il
2026-09-03 la prova "il 700 mancante viene ingrassato dal browser?" è uscita
inconcludente proprio così — EB Garamond a 600 e a 700 misuravano *identico*
(255,94px tutti e due) semplicemente perché nessuno dei due era caricato.

Prima di misurare: usarlo davvero in pagina, poi `await document.fonts.load(
"600 17px 'EB Garamond'")` e solo dopo misurare. Se il numero di due famiglie
diverse coincide alla seconda cifra decimale, non è una coincidenza: **stai
misurando il ripiego**.

### Prima di misurare del testo: aspetta il font

Costo di non saperlo: un pomeriggio a inseguire un difetto che non c'era, e poi lo stesso
difetto vero nel codice appena scritto. Al primo layout i nomi sono ancora disegnati col
ripiego (Georgia), **più largo** di Cormorant Garamond: qualunque misura di quante righe
occupa un testo, o di quanto sborda, esce sbagliata per eccesso. In pagina, sui dodici
consigli della home: col ripiego dodici nomi su dodici "sbordavano", col font vero solo
tre.

```
eval document.fonts.status                      # "loading" | "loaded"
eval document.fonts.ready.then(()=>document.fonts.status)
```

**`sleep 6000` non basta e non è deterministico**: sul dev server ho visto `loading` dopo
sei secondi e `loaded` dopo sette. Aspetta `document.fonts.ready` e misura dopo, sempre.
Vale per il driver **e per il codice del sito**: chi misura del testo in un
`useLayoutEffect` deve rimisurare su `document.fonts.ready`, altrimenti si porta dietro
il numero preso col ripiego (è la ragione della seconda misura in `Home.jsx`).

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

- **Il login dal browser contro il backend usa e getta impiega 20–40 s, e
  `wait-for` si arrende a 20.** Il sintomo è identico a un login rotto: la pagina
  resta con il bottone su "Accesso…", `wait-for .admin-product-grid` va in
  timeout e `console` stampa `ERRORS none` — perché la richiesta è ancora *in
  volo*, non fallita. Misurato il 2026-08-27 con una fetch dentro la pagina:
  **25,7 s, status 200**. È il costo a freddo di `bcrypt.compare` più il Mongo
  in memoria; le GET normali stanno sui 3–5 s. Nel driver:

  ```
  press Enter
  sleep 34000        # NON wait-for: il suo tetto di 20 s è troppo basso
  ```

  Prima di dare la colpa al codice, prova il login da PowerShell (`/api/login`
  risponde in meno di un secondo) e poi dentro la pagina: se il secondo è lento
  e il primo no, è questo e non una regressione. `127.0.0.1` al posto di
  `localhost` guadagna poco (3,2 s contro 5,2 su una GET), non è la causa.
- **`Uncaught SyntaxError: Invalid or unexpected token` su una scheda già
  aperta = cache delle dipendenze di Vite, non il tuo codice.** Quando Vite
  ri-ottimizza le dipendenze a metà sessione riscrive `node_modules/.vite/deps`
  e invalida i chunk che la pagina aperta ha già importato; ri-chiederli torna
  una risposta parziale e il browser la riporta come errore di sintassi.
  Successo il 2026-08-28: server avviato 14:43, sorgenti toccati 14:54–14:57,
  `.vite/deps` riscritto 15:02, errore su una scheda aperta da prima.
  **Come si riconosce in un minuto**: apri le stesse rotte con il driver (che
  parte sempre da un contesto pulito). Se lì è `ERRORS none` su tutte, il
  sorgente è sano e il problema è la scheda. Conferma servita: `Invoke-WebRequest`
  su `/src/…` e cerca una modifica recente, per essere sicuro che quel server
  serva davvero l'albero corrente. Rimedio: ricarica forzata; se resiste, ferma
  il server, cancella `node_modules/.vite`, riparti.
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
- **"Si renderizza due volte" in dev è StrictMode, non un bug.** `main.jsx` avvolge l'app
  in `<StrictMode>`, che in sviluppo invoca due volte il render e rifà partire gli effect:
  in DevTools e nel pannello Network vedi il doppio (`/api/wines?...` due volte, il
  componente contato due volte). Misurato sul bottom sheet il 2026-08-15: **dev 2 render /
  1 nodo nel DOM, build di produzione 1 render / 1 nodo**, uguale su tutte le vie
  d'ingresso. Prima di chiamarlo bug, riproducilo con `npm run build` +
  `npx vite preview --base /enoteca-detoma/`. **Non togliere `StrictMode`.**
- **Un `click` di Playwright può non arrivare su un elemento che si solleva in hover.**
  `.admin-product-card` e `.consiglio-card` hanno `transform: translateY(-2px)` in hover
  con una transizione di 0,15–0,18 s: il puntatore sintetico arriva e clicca a metà del
  movimento, e il click a volte si perde — senza errore, sembra solo che non succeda
  niente. Un dito vero si posa prima di premere, quindi **non è un bug del sito**. Nel
  driver: fai stabilizzare (un `click` che stabilisce l'hover, poi il vero click; oppure
  `sleep` prima), o verifica l'effetto sul database invece che sulla UI. Se devi isolare
  se è questo, spegni le trasformazioni e riprova:
  ```
  eval (()=>{const s=document.createElement("style");s.textContent=".admin-product-card{transition:none!important} .admin-product-card:hover{transform:none!important}";document.head.appendChild(s);return "hover off"})()
  ```
- **Per vedere uno stato di caricamento serve rallentare l'API, non indovinare.** Le fasce
  in home caricano in ~0,7 s: i fantasmi non si fotografano a mano. Un proxy usa e getta
  che inoltra alla produzione con un ritardo fisso rende lo stato deterministico — **solo
  GET**, così non può scrivere sul catalogo vero:
  ```js
  // %TEMP%\proxy-lento.mjs — node proxy-lento.mjs 4000 3012, poi VITE_API_URL=http://localhost:3012
  import http from "node:http"; import https from "node:https";
  const RITARDO=+process.argv[2]||4000, PORTA=+process.argv[3]||3012, O="detoma-backend.vercel.app";
  http.createServer((req,res)=>{ res.setHeader("Access-Control-Allow-Origin","*");
    if(req.method==="OPTIONS")return res.writeHead(204).end();
    if(req.method!=="GET")return res.writeHead(405).end("solo GET");
    https.get({host:O,path:req.url,headers:{host:O}},up=>{const p=[];up.on("data",c=>p.push(c));
      up.on("end",()=>setTimeout(()=>{res.writeHead(up.statusCode,{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"});
        res.end(Buffer.concat(p))},RITARDO))});
  }).listen(PORTA);
  ```
  Usato il 2026-08-15 per fotografare le schede fantasma e misurare che il telaio vuoto e
  quello pieno hanno la **stessa** altezza (138×190 e riga 223 px, telefono).

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
