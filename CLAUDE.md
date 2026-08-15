# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is the **frontend** of the Enoteca de Toma site. The project is two independent git
repos with separate remotes and separate deploy pipelines:

- `frontend/` (this repo) → `momoelo1/enoteca-detoma`, deployed to **GitHub Pages**
- `backend/` (sibling folder) → `momoelo1/detoma-backend`, deployed to **Vercel**

A change is never "committed" project-wide — check `git status` in each repo separately.

**Pushing is deploying.** `.github/workflows/deploy.yml` builds and publishes to Pages on
every push to `main`. There is no staging environment and the backend it talks to is
production (Atlas + Cloudinary). Never push without an explicit go-ahead.

The site is for a real shop; the client is the owner, who uses the admin panel.

## Commands

```bash
npm run dev        # Vite dev server, host:true (reachable from a phone on the LAN)
npm run build      # production build; sets base to /enoteca-detoma/
npm run preview    # serve the built dist/
npm run lint       # eslint
```

**There is no test suite** — no test runner is installed and no test files exist.
Verification is done by running the app (desktop and a real phone) and by probing the live
API. Don't claim a change is "tested"; say what you actually ran.

### Talking to the backend locally

`VITE_API_URL` (see `.env.example`) points at the backend. **If it is unset, the services
fall back to the production backend** (`https://detoma-backend.vercel.app`), so a dev
server with nothing configured shows the real catalogue — from `localhost` and from a
phone on the LAN alike.

Two consequences worth holding onto:

- **The admin panel in a local dev server writes to the real shop** unless you point
  `VITE_API_URL` somewhere else. To exercise admin mutations safely, use the sibling
  repo's disposable in-memory backend (`backend/.claude/skills/run-enoteca-detoma-backend/`)
  and set `VITE_API_URL=http://localhost:3011`.
- **To develop against the local backend you must now set `VITE_API_URL` explicitly**
  (`http://localhost:3001`). It is no longer picked up automatically. The backend's
  `config.js` defaults `PORT` to **3002** while its local `.env` sets `PORT=3001`; if
  local API calls 404, check that first.

The fallback lives in five copies, one per file in `src/services/` — change them together.

## Architecture

### `components/enoteca/Enoteca.jsx` is a shared component library, not just a page

It exports `CatCard`, `MiniCard`, `ProductCard` and `ProductSheet`, which
`Gastronomia.jsx` imports and reuses. **A change to a card or the bottom sheet affects
every section of the site.** The shared components branch on a `type` prop
(`"vini" | "birre" | "distillati" | "alimentari"`) — e.g. `FORMATO_UNIT` renders `cl` for
beer and `g` for food off the same `formato` field, and `ProductPlaceholder` picks a
bottle or a food icon.

Food icons are chosen by **regex on words** in `sottocategoria`/`tipo`
(`FOOD_ICON_RULES`), not a fixed list of groups, so groups the admin invents still resolve.
The same word-matching is duplicated in `components/icons/CategoryIcon.jsx` for group cards
— change both.

### Two sources of data, deliberately split

- `src/data/data.js` holds the **taxonomy**: `SECTIONS` (nav), `SHOP_GROUPS` (Vini / Birre /
  Distillati and their sub-categories), `ALIMENTARI_CATEGORIES`, `COUNTRY_GROUPS`, accent
  colours, images. Static, in the bundle.
- The API holds the **products**, fetched through `src/services/*.js`.

The empty exported arrays still in `data.js` (`GRAPPA`, `WHISKY`, `GASTRONOMIA`, …) are
leftovers from the static era. Product data no longer comes from there.

### Services

`src/services/*.js` all share one shape: an `API_URL` from `VITE_API_URL` with the LAN
fallback above, a `parse()` helper that throws `data.error`, and mutations that send both
`credentials: "include"` **and** an `Authorization: Bearer` header.

The header is **not** redundant. The httpOnly cookie is cross-site between GitHub Pages and
Vercel, and Safari's ITP drops it even with `SameSite=None`. The login response therefore
also returns the raw token, mirrored into `localStorage` under `detoma_admin_token`
(`services/auth.js`). Don't "clean up" one of the two mechanisms.

Product images are sent to the API as **base64 data URIs inside the JSON body**; the
backend uploads them to Cloudinary and stores the URL. `DELETE /:id/image` removes only
the photo, not the product.

### Layout is driven by classes on `<body>`

Pages add/remove body classes in an effect and clean up on unmount. These are a **shared**
mechanism — check who else uses one before changing its CSS:

- `home-no-scroll` — the flex chain that stops the page itself from scrolling. Used by
  Home, Login, Enoteca **and** Gastronomia.
- `page-pinned` — pins a page header; pairs with `.section-sticky` on the header and
  `.page-scroll` on the scrolling container. Deliberately **not** `position: sticky`: the
  site header is as tall as the 180px logo, so a sticky child would slide under it and need
  a hand-maintained offset.
- `category-open` — hides the bottom tab bar. **Enoteca only.** Do not reach for it when you
  just want a pinned header; Gastronomia must keep the tab bar visible.
- `region-bar-open` — the wine region filter bar.

### Routing and GitHub Pages

`vite.config.js` sets `base: '/enoteca-detoma/'` **on build only**, and `BrowserRouter`
reads it via `basename={import.meta.env.BASE_URL}`.

`SECTION_PATHS` in `App.jsx` maps each `SECTIONS` id to a URL. Enoteca is mounted on three
routes (`/enoteca`, `/enoteca/:groupId/:categoryId`, `.../:productId`) so a refresh or a
shared link reopens the exact category and even the open product sheet. Alimentari is a
single flat route and does not have this yet.

`/confezioni` and `/dove-siamo` render `null` — the nav entries exist, the pages don't.

`public/404.html` is the standard spa-github-pages redirect shim, since Pages does no
server-side rewrite. `pathSegmentsToKeep = 1` encodes the `/enoteca-detoma` prefix; if the
repo name changes, that constant changes too.

The admin panel has no nav entry: **triple-tap the logo** within 600ms to reach `/admin`.

### React Compiler

Enabled via `@rolldown/plugin-babel` + `reactCompilerPreset()`. Two rules that have bitten
this codebase:

- Don't `setState` inside an effect to signal loading — derive it. The codebase uses
  `const loading = loadedFor !== tab` (`Gastronomia.jsx`, `AdminWineCard.jsx`).
- Don't define components inside other components.

### CSS

Plain CSS, one file per component folder, imported from the JSX. Because those imports
determine cascade order, **a modifier class can silently lose to a base rule depending on
which component imported first** — this has caused real bugs twice. When a rule doesn't
apply and looks like it should, check the *built* CSS in `dist/assets/`, not the source.

Icons are `@phosphor-icons/react` (MIT). `GlobeIcon` (the Mondo filter button) stays
hand-drawn, and the admin trash icon reuses an existing SVG.

## Language

UI text, user-facing error messages and code comments are all in **Italian**. Match it —
new comments in Italian, new strings in Italian, and keep domain terms as the shop uses
them (`annate`, `sottocategoria`, `formato`, `prezzo`).
