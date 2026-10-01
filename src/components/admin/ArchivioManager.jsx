import { useEffect, useState } from "react";
import {
  WINE_CATEGORIES,
  DISTILLATI_CATEGORIES,
  BEER_CATEGORIES,
  ALIMENTARI_CATEGORIES,
  SHOP_GROUPS,
  COUNTRY_GROUPS,
} from "../../data/data";
import { getWinesArchiviati, updateWine } from "../../services/wines";
import { getDistillatiArchiviati, updateDistillato } from "../../services/distillati";
import { getBeersArchiviate, updateBeer } from "../../services/beers";
import { getAlimentariArchiviati, updateAlimentare } from "../../services/alimentari";
import { normalize } from "../../utils/normalize";
import CategoryPicker from "./CategoryPicker";
import AdminFilterBar from "./AdminFilterBar";
import "./admin.css";

// id della categoria → nome breve da mostrare sulla tessera ("Rossi", "Grappa")
const nomiCategorie = (categorie) =>
  Object.fromEntries(categorie.map((c) => [c.id, c.short || c.label]));

const accentoGruppo = (id) => SHOP_GROUPS.find((g) => g.id === id)?.accent;

// I quattro tipi di prodotto, nell'ordine delle tab del pannello. Per ognuno:
// come si caricano gli archiviati, come se ne ripristina uno (lo stesso PUT
// della stella, con il solo campo `archiviato`), cosa scrivere sotto il nome
// e — copiati dal pannello di quel tipo, perché il negozio ritrovi gli stessi
// bottoni — la ricerca e il filtro.
// Le birre non hanno `category` ma `producer`: è il loro raggruppamento.
const TIPI = [
  {
    id: "vini",
    titolo: "Vini",
    accent: accentoGruppo("vini"),
    carica: getWinesArchiviati,
    ripristina: (id) => updateWine(id, { archiviato: false }),
    categorie: nomiCategorie(WINE_CATEGORIES),
    categoriaDi: (p) => p.category,
    dettagli: (p) => [p.regione, p.paese],
    // come WineManager: il paese prima della regione, gli esteri dietro "Mondo"
    filtroDi: (p) => p.paese?.trim() || p.regione?.trim(),
    filtroLabel: "Regioni",
    isMondo: (v) => Boolean(COUNTRY_GROUPS[v]),
    cercaIn: (p) => [p.name, p.regione, p.paese, p.denominazione, p.uvaggio],
    cercaPlaceholder: "Cerca per nome o regione…",
  },
  {
    id: "distillati",
    titolo: "Distillati",
    accent: accentoGruppo("distillati"),
    carica: getDistillatiArchiviati,
    ripristina: (id) => updateDistillato(id, { archiviato: false }),
    categorie: nomiCategorie(DISTILLATI_CATEGORIES),
    categoriaDi: (p) => p.category,
    dettagli: (p) => [p.regione, p.paese],
    filtroDi: (p) => p.paese?.trim(),
    filtroLabel: "Paesi",
    cercaIn: (p) => [p.name, p.regione, p.paese],
    cercaPlaceholder: "Cerca per nome o paese…",
  },
  {
    id: "birre",
    titolo: "Birre",
    accent: accentoGruppo("birre"),
    carica: getBeersArchiviate,
    ripristina: (id) => updateBeer(id, { archiviato: false }),
    categorie: nomiCategorie(BEER_CATEGORIES),
    categoriaDi: (p) => p.producer,
    dettagli: (p) => [p.stile],
    // come BeerManager: solo la ricerca, nessun filtro
    filtroDi: null,
    cercaIn: (p) => [p.name, p.stile],
    cercaPlaceholder: "Cerca per nome o stile…",
  },
  {
    id: "alimentari",
    titolo: "Alimentari",
    accent: ALIMENTARI_CATEGORIES[0]?.accent,
    carica: getAlimentariArchiviati,
    ripristina: (id) => updateAlimentare(id, { archiviato: false }),
    categorie: nomiCategorie(ALIMENTARI_CATEGORIES),
    categoriaDi: (p) => p.category,
    dettagli: (p) => [p.sottocategoria],
    filtroDi: (p) => p.sottocategoria?.trim(),
    filtroLabel: "Gruppi",
    cercaIn: (p) => [p.name, p.tipo, p.sottocategoria],
    cercaPlaceholder: "Cerca per nome, tipo o gruppo…",
  },
];

// La tessera di un prodotto archiviato: nome, da dove viene e un solo
// bottone. "Ripristina" è scritto per intero e non è un'icona sola come
// nelle griglie: qui è l'unica azione, e su telefono il `title` non si vede.
function ArchivioCard({ prodotto, meta, onRipristina }) {
  const [inCorso, setInCorso] = useState(false);
  const [error, setError] = useState("");

  const handleRipristina = async () => {
    setInCorso(true);
    setError("");
    try {
      // a buon fine la tessera sparisce (la toglie il genitore), quindi
      // `inCorso` si rimette a posto solo se qualcosa va storto
      await onRipristina();
    } catch (err) {
      setError(err.message);
      setInCorso(false);
    }
  };

  return (
    <li className="admin-product-cell">
      <div className="admin-product-card admin-product-card--archiviato">
        <span className="admin-product-name">{prodotto.name}</span>
        {meta && <span className="admin-product-meta">{meta}</span>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-product-icon-actions">
          <button
            type="button"
            className="admin-ripristina-btn"
            onClick={handleRipristina}
            disabled={inCorso}
            title="Rimetti il prodotto in negozio"
          >
            {/* freccia che esce dal cassetto: il verso opposto di Archivia */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 14v5h16v-5M12 15V4m-4 4 4-4 4 4" />
            </svg>
            {inCorso ? "Ripristino…" : "Ripristina"}
          </button>
        </div>
      </div>
    </li>
  );
}

function ArchivioManager() {
  // { vini: [...], distillati: [...], ... } — null finché non è arrivato tutto
  const [archivio, setArchivio] = useState(null);
  const [error, setError] = useState("");
  // null = nessuna scelta ancora: si apre sul primo tipo che ha qualcosa
  const [sceltaTipo, setSceltaTipo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filtro, setFiltro] = useState(null);

  // Tutti e quattro in parallelo, una volta: così cambiare tipo è immediato
  // e il selettore sa già quanti archiviati ha ciascuno.
  useEffect(() => {
    let cancelled = false;
    Promise.all(TIPI.map((t) => t.carica()))
      .then((elenchi) => {
        if (cancelled) return;
        setArchivio(Object.fromEntries(TIPI.map((t, i) => [t.id, elenchi[i]])));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tipo =
    TIPI.find((t) => t.id === sceltaTipo) ??
    TIPI.find((t) => archivio?.[t.id].length > 0) ??
    TIPI[0];

  // cambiando tipo, ricerca e filtro ripartono da zero (reset "durante il
  // render", come nei pannelli dei prodotti — vedi WineManager.jsx)
  const [filtriPer, setFiltriPer] = useState(tipo.id);
  if (tipo.id !== filtriPer) {
    setFiltriPer(tipo.id);
    setSearchText("");
    setFiltro(null);
  }

  // ripristinato: torna nella sua griglia (e sul sito) e qui non c'è più
  const ripristina = (prodotto) => async () => {
    await tipo.ripristina(prodotto.id);
    setArchivio((a) => ({
      ...a,
      [tipo.id]: a[tipo.id].filter((p) => p.id !== prodotto.id),
    }));
  };

  // l'etichetta porta quanti ce ne sono: si vede dove cercare senza aprire
  const opzioniTipo = TIPI.map((t) => ({
    id: t.id,
    label: archivio?.[t.id].length ? `${t.titolo} · ${archivio[t.id].length}` : t.titolo,
    accent: t.accent,
  }));

  const prodotti = archivio?.[tipo.id] ?? [];
  const valoriFiltro = tipo.filtroDi
    ? [...new Set(prodotti.map(tipo.filtroDi).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "it"),
      )
    : null;

  const query = normalize(searchText.trim());
  const visibili = prodotti
    .filter((p) => (filtro ? tipo.filtroDi?.(p) === filtro : true))
    .filter((p) => {
      if (!query) return true;
      return normalize(tipo.cercaIn(p).filter(Boolean).join(" ")).includes(query);
    });

  return (
    <div className="admin-layout">
      <CategoryPicker categories={opzioniTipo} activeId={tipo.id} onSelect={setSceltaTipo} />

      <div className="admin-content">
        <div className="admin-content-header" style={{ "--accent": tipo.accent }}>
          <h2 className="admin-content-title">Archivio</h2>
          {archivio && (
            <span className="admin-content-count">
              {visibili.length} {visibili.length === 1 ? "prodotto" : "prodotti"}
            </span>
          )}
          {prodotti.length > 0 && (
            <AdminFilterBar
              query={searchText}
              onQueryChange={setSearchText}
              searchPlaceholder={tipo.cercaPlaceholder}
              canSearch={prodotti.length >= 6}
              filterValues={valoriFiltro}
              filterLabel={tipo.filtroLabel}
              activeFilter={filtro}
              onFilterChange={setFiltro}
              isMondo={tipo.isMondo}
            />
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        {!archivio ? (
          !error && <p className="admin-loading">Caricamento…</p>
        ) : prodotti.length === 0 ? (
          <p className="admin-loading">
            Nessun prodotto archiviato qui. Per archiviarne uno usa il bottone con
            la scatola sulla sua tessera.
          </p>
        ) : (
          <>
            <ul className="admin-product-grid">
              {visibili.map((p) => {
                const meta = [tipo.categorie[tipo.categoriaDi(p)], ...tipo.dettagli(p)]
                  .map((v) => v?.trim())
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <ArchivioCard
                    key={p.id}
                    prodotto={p}
                    meta={meta}
                    onRipristina={ripristina(p)}
                  />
                );
              })}
            </ul>
            {visibili.length === 0 && (
              <p className="admin-loading">Nessun risultato. Prova a cambiare ricerca o filtro.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ArchivioManager;
