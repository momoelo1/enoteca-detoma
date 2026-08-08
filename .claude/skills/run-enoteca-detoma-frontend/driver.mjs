#!/usr/bin/env node
// Driver headless per il sito Enoteca de Toma.
// Legge comandi da stdin (uno per riga) e li esegue su Chromium via Playwright.
//
//   node .claude/skills/run-enoteca-detoma-frontend/driver.mjs [--desktop] [--headed] [--base URL]
//
// Default: viewport iPhone-like (390x844, touch, DPR 3) — il sito e mobile-first
// e la tab bar / il bottom sheet esistono solo sotto i breakpoint mobile.

import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const BASE = (opt('--base', process.env.APP_URL || 'http://localhost:5173')).replace(/\/$/, '');
const SHOTS = resolve(process.env.SHOTS_DIR || opt('--shots', resolve(HERE, 'shots')));
mkdirSync(SHOTS, { recursive: true });

const log = (...a) => console.log(...a);
const errors = [];   // errori console + pageerror + risposte HTTP >=400
let shotN = 0;

const ctxOpts = flag('--desktop')
  ? { viewport: { width: 1440, height: 900 } }
  : { ...devices['iPhone 13'] };

const browser = await chromium.launch({ headless: !flag('--headed') });
const context = await browser.newContext(ctxOpts);
const page = await context.newPage();

page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('response', (r) => {
  if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
});

// "text=Vini" / "role=button[name=X]" passano dritti a Playwright; il resto e un CSS selector.
const loc = (sel) => page.locator(sel);

async function shot(name) {
  const file = resolve(SHOTS, `${String(++shotN).padStart(2, '0')}-${name || 'shot'}.png`);
  await page.screenshot({ path: file, fullPage: false });
  log(`SHOT ${file}`);
}

const COMMANDS = {
  async nav(rest) {
    const url = rest.startsWith('http') ? rest : BASE + (rest.startsWith('/') ? rest : '/' + rest);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    log(`OK nav ${url}`);
  },
  async 'wait-for'(rest) {
    await loc(rest).first().waitFor({ state: 'visible', timeout: 20000 });
    log(`OK wait-for ${rest}`);
  },
  async click(rest) {
    await loc(rest).first().click({ timeout: 15000 });
    log(`OK click ${rest}`);
  },
  async fill(rest) {
    const i = rest.indexOf(' ');
    await loc(rest.slice(0, i)).first().fill(rest.slice(i + 1), { timeout: 15000 });
    log(`OK fill ${rest}`);
  },
  async press(rest) {
    await page.keyboard.press(rest);
    log(`OK press ${rest}`);
  },
  async back() {
    await page.goBack();
    log('OK back');
  },
  async count(rest) {
    log(`COUNT ${rest} = ${await loc(rest).count()}`);
  },
  async text(rest) {
    const t = await loc(rest || 'body').first().innerText();
    log(`TEXT ${t.replace(/\n{2,}/g, '\n').slice(0, 2000)}`);
  },
  async eval(rest) {
    log(`EVAL ${JSON.stringify(await page.evaluate(rest))}`);
  },
  async url() {
    log(`URL ${page.url()}`);
  },
  async 'body-classes'() {
    // le pagine pilotano il layout con classi su <body> — vedi CLAUDE.md
    log(`BODY ${await page.evaluate('document.body.className')}`);
  },
  async triplelogo() {
    // il pannello admin non ha voce di nav: tripla tap sul logo entro 600ms
    const l = loc('.site-logo').first();
    await l.click({ delay: 0 });
    await l.click({ delay: 0 });
    await l.click({ delay: 0 });
    log('OK triplelogo');
  },
  async screenshot(rest) {
    await shot(rest.trim().replace(/\s+/g, '-'));
  },
  async console() {
    log(errors.length ? `ERRORS (${errors.length}):\n` + errors.join('\n') : 'ERRORS none');
  },
  async 'dump-html'(rest) {
    const f = resolve(SHOTS, (rest.trim() || 'page') + '.html');
    writeFileSync(f, await page.content());
    log(`HTML ${f}`);
  },
  async sleep(rest) {
    await page.waitForTimeout(Number(rest) || 500);
    log(`OK sleep ${rest}`);
  },
};

let failed = false;
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const raw of rl) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  if (line === 'quit') break;
  const i = line.indexOf(' ');
  const cmd = i < 0 ? line : line.slice(0, i);
  const rest = i < 0 ? '' : line.slice(i + 1).trim();
  const fn = COMMANDS[cmd];
  if (!fn) { log(`FAIL comando sconosciuto: ${cmd}`); failed = true; continue; }
  try {
    await fn(rest);
  } catch (e) {
    failed = true;
    log(`FAIL ${cmd} ${rest} -> ${e.message.split('\n')[0]}`);
    await shot(`fail-${cmd}`);
  }
}

await browser.close();
if (errors.length) log(`\n(${errors.length} errori console/HTTP — usa 'console' per vederli)`);
process.exit(failed ? 1 : 0);
