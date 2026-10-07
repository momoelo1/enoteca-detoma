import { useEffect, useState } from "react";
import {
  WINE_CATEGORIES,
  DISTILLATI_CATEGORIES,
  BEER_CATEGORIES,
  ALIMENTARI_CATEGORIES,
  SHOP_GROUPS,
} from "../../data/data";
import { getWinesConsigliati } from "../../services/wines";
import { getDistillatiConsigliati } from "../../services/distillati";
import { getBeersConsigliate } from "../../services/beers";
import { getAlimentariConsigliati } from "../../services/alimentari";
import { normalize } from "../../utils/normalize";
import { useRicordato } from "../../utils/memoriaAdmin";
import CategoryPicker from "./CategoryPicker";
import AdminFilterBar from "./AdminFilterBar";
import AdminWineCard from "./AdminWineCard";
import AdminDistillatoCard from "./AdminDistillatoCard";
import AdminBeerCard from "./AdminBeerCard";
import AdminAlimentareCard from "./AdminAlimentareCard";
import "./admin.css";

const accentoGruppo = (id) => SHOP_GROUPS.find((g) => g.id === id)?.accent;

// valori distinti e ripuliti, per i suggerimenti dei form (paesi, gruppi)
const unici = (valori) =>
  [...new Set(valori.map((v) => v?.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "it"),
  );

// I quattro tipi, nell'ordine delle tab del pannello. Le tessere sono QUELLE
// dei pannelli di ogni tipo, non una copia: da qui si modifica, si archivia e
// si toglie la stella esattamente come nella griglia del tipo.
// `tessera` riceve anche l'elenco intero del tipo, da cui i form ricavano i
// suggerimenti (paesi dei distillati, gruppi degli alimentari).
// Le birre non hanno `category` ma `producer`: è il loro raggruppamento.
const TIPI = [
  {
    id: "vini",
    titolo: "Vini",
    accent: accentoGruppo("vini"),
    carica: getWinesConsigliati,
    categorie: WINE_CATEGORIES,
    categoriaDi: (p) => p.category,
    cercaIn: (p) => [p.name, p.regione, p.paese, p.denominazione, p.uvaggio],
    cercaPlaceholder: "Cerca per nome o regione…",
    // `categoryId` dal vino stesso: è da lì che il form sa se è champagne
    tessera: (p, gestori) => (
      <AdminWineCard key={p.id} wine={p} categoryId={p.category} {...gestori} />
    ),
  },
  {
    id: "distillati",
    titolo: "Distillati",
    accent: accentoGruppo("distillati"),
    carica: getDistillatiConsigliati,
    categorie: DISTILLATI_CATEGORIES,
    categoriaDi: (p) => p.category,
    cercaIn: (p) => [p.name, p.regione, p.paese],
    cercaPlaceholder: "Cerca per nome o paese…",
    tessera: (p, gestori, elenco) => (
      <AdminDistillatoCard
        key={p.id}
        distillato={p}
        categoryId={p.category}
        paesiNoti={unici(elenco.map((d) => d.paese))}
        {...gestori}
      />
    ),
  },
  {
    id: "birre",
    titolo: "Birre",
    accent: accentoGruppo("birre"),
    carica: getBeersConsigliate,
    categorie: BEER_CATEGORIES,
    categoriaDi: (p) => p.producer,
    cercaIn: (p) => [p.name, p.stile],
    cercaPlaceholder: "Cerca per nome o stile…",
    tessera: (p, gestori) => (
      <AdminBeerCard key={p.id} beer={p} producerId={p.producer} {...gestori} />
    ),
  },
  {
    id: "alimentari",
    titolo: "Alimentari",
    accent: ALIMENTARI_CATEGORIES[0]?.accent,
    carica: getAlimentariConsigliati,
    categorie: ALIMENTARI_CATEGORIES,
    categoriaDi: (p) => p.category,
    cercaIn: (p) => [p.name, p.tipo, p.sottocategoria],
    cercaPlaceholder: "Cerca per nome, tipo o gruppo…",
    tessera: (p, gestori, elenco) => (
      <AdminAlimentareCard
        key={p.id}
        item={p}
        categoryId={p.category}
        sottocategorie={unici(elenco.map((a) => a.sottocategoria))}
        {...gestori}
      />
    ),
  },
];

// La selezione della casa, tutta in un posto: i prodotti con la stella, di
// ogni tipo, divisi per categoria. È lo stesso elenco che il sito mostra
// nelle tab Consigliati e nelle fasce della home.
function ConsigliatiManager() {
  // { vini: [...], distillati: [...], ... } — null finché non è arrivato tutto
  const [consigliati, setConsigliati] = useState(null);
  const [error, setError] = useState("");
  // null = nessuna scelta ancora: si apre sul primo tipo che ha qualcosa
  // ricordata dopo un ricaricamento (utils/memoriaAdmin.js)
  const [sceltaTipo, setSceltaTipo] = useRicordato(
    "tipo-consigliati",
    null,
    (id) => TIPI.some((t) => t.id === id),
  );
  const [searchText, setSearchText] = useState("");

  // Tutti e quattro in parallelo, una volta: così cambiare tipo è immediato
  // e il selettore sa già quanti consigliati ha ciascuno (come l'Archivio).
  useEffect(() => {
    let cancelled = false;
    Promise.all(TIPI.map((t) => t.carica()))
      .then((elenchi) => {
        if (cancelled) return;
        setConsigliati(Object.fromEntries(TIPI.map((t, i) => [t.id, elenchi[i]])));
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
    TIPI.find((t) => consigliati?.[t.id].length > 0) ??
    TIPI[0];

  // cambiando tipo la ricerca riparte da zero (reset "durante il render",
  // come nei pannelli dei prodotti — vedi WineManager.jsx)
  const [cercaPer, setCercaPer] = useState(tipo.id);
  if (tipo.id !== cercaPer) {
    setCercaPer(tipo.id);
    setSearchText("");
  }

  const aggiorna = (fn) =>
    setConsigliati((c) => ({ ...c, [tipo.id]: fn(c[tipo.id]) }));

  // Tolta la stella, il prodotto non è più un consigliato e da qui sparisce
  // (resta nella sua griglia e sul sito). Una modifica qualunque, invece, lo
  // aggiorna sul posto. Archiviato o eliminato: sparisce anche lui.
  const gestori = {
    onUpdated: (p) =>
      aggiorna((elenco) =>
        p.consigliato
          ? elenco.map((x) => (x.id === p.id ? p : x))
          : elenco.filter((x) => x.id !== p.id),
      ),
    onDeleted: (id) => aggiorna((elenco) => elenco.filter((x) => x.id !== id)),
  };

  // l'etichetta porta quanti ce ne sono: si vede dove cercare senza aprire
  const opzioniTipo = TIPI.map((t) => ({
    id: t.id,
    label: consigliati?.[t.id].length
      ? `${t.titolo} · ${consigliati[t.id].length}`
      : t.titolo,
    accent: t.accent,
  }));

  const prodotti = consigliati?.[tipo.id] ?? [];
  const query = normalize(searchText.trim());
  const visibili = prodotti.filter((p) => {
    if (!query) return true;
    return normalize(tipo.cercaIn(p).filter(Boolean).join(" ")).includes(query);
  });

  // Divisi per categoria, nell'ordine delle categorie del sito. Un prodotto
  // con una categoria che l'elenco non conosce finisce in "Altro" invece di
  // sparire: qui si deve vedere TUTTA la selezione.
  const note = new Set(tipo.categorie.map((c) => c.id));
  const gruppi = [
    ...tipo.categorie.map((c) => ({
      id: c.id,
      label: c.label,
      prodotti: visibili.filter((p) => tipo.categoriaDi(p) === c.id),
    })),
    {
      id: "altro",
      label: "Altro",
      prodotti: visibili.filter((p) => !note.has(tipo.categoriaDi(p))),
    },
  ].filter((g) => g.prodotti.length > 0);

  return (
    <div className="admin-layout">
      <CategoryPicker categories={opzioniTipo} activeId={tipo.id} onSelect={setSceltaTipo} />

      <div className="admin-content">
        <div className="admin-content-header" style={{ "--accent": tipo.accent }}>
          <h2 className="admin-content-title">Consigliati</h2>
          {consigliati && (
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
              filterValues={null}
            />
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        {!consigliati ? (
          !error && <p className="admin-loading">Caricamento…</p>
        ) : prodotti.length === 0 ? (
          <p className="admin-loading">
            Nessun prodotto consigliato qui. Per consigliarne uno tocca la stella
            sulla sua tessera.
          </p>
        ) : (
          <>
            {gruppi.map((g) => (
              <section className="admin-consigliati-gruppo" key={g.id}>
                <h3 className="admin-consigliati-titolo">{g.label}</h3>
                <ul className="admin-product-grid">
                  {g.prodotti.map((p) => tipo.tessera(p, gestori, prodotti))}
                </ul>
              </section>
            ))}
            {visibili.length === 0 && (
              <p className="admin-loading">Nessun risultato. Prova a cambiare ricerca.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ConsigliatiManager;
