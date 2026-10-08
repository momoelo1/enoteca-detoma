import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductPlaceholder } from "../enoteca/Enoteca";
import Immagine from "../immagine/Immagine";
import { fotoProdotto } from "../../utils/cloudinary";
import { getWinesConsigliati } from "../../services/wines";
import { getAlimentariConsigliati } from "../../services/alimentari";
import { ricorda, gia, CHIAVI } from "../../services/cache";
import { productSlug } from "../../utils/productSlug";
import "./home.css";

// Il titolo si scrive da sé all'apertura, parola per parola, come se una
// mano lo stesse tracciando: è in corsivo (Snell Roundhand) e una comparsa
// da sinistra a destra si legge esattamente come una scrittura.
// Sta scritto qui e non nel JSX perché va spezzato in parole; lo spazio fra
// una e l'altra resta un nodo di testo vero (vedi il Fragment sotto), non un
// margine, altrimenti il titolo non andrebbe più a capo dove deve.
const TITOLO = "Tre Generazioni, Una Passione per il Vino";

// Il racconto di famiglia sotto il titolo. Parla in prima persona come parla
// il resto del sito ("Le bottiglie che scegliamo noi", "torna a trovarci"):
// prima era l'unico punto che raccontava la famiglia in terza persona, come
// una targa. E dice subito la cosa che la versione vecchia lasciava cadere —
// che il nipote porta il nome del nonno che ha aperto l'enoteca.
const RACCONTO =
  "Siamo Nicola e Sabrina, terza generazione dietro a questo banco. L'enoteca l'ha aperta nostro nonno Nicola, arrivato a Lodi da Trani agli inizi del '900, e dopo di lui Domenica e Bartolomeo. Il vino, in casa, non ha mai smesso di essere una cosa di famiglia.";

// Dove porta una scheda della vetrina: nella SELEZIONE DELLA CASA della sua
// sezione, con la scheda prodotto già aperta. Un consiglio della home si apre
// dove stanno gli altri consigli, non in mezzo alla sua categoria: chi chiude
// la scheda si ritrova fra i consigliati e continua a guardare quelli.
// (Prima portava al posto del prodotto nel catalogo — `/enoteca/vini/<cat>/…`
// e `/alimentari/<reparto>/<gruppo>/…`.)
const stradaProdotto = (item, type) =>
  type === "alimentari"
    ? `/alimentari/consigliati/${productSlug(item)}`
    : `/enoteca/consigliati/${productSlug(item)}`;

// `i`: la posizione nella fascia, che il CSS usa come ritardo — le schede
// non compaiono tutte insieme ma una dopo l'altra. A freddo su Vercel la
// prima risposta può tardare più di dieci secondi: quando finalmente
// arrivano, così l'attesa si chiude con una comparsa invece che con uno
// scatto (il ritardo è tosato a poche schede, vedi home.css).
function VetrinaCard({ item, type, onOpen, i }) {
  return (
    <li className="consiglio-cell" style={{ "--i": i }}>
      {/* Solo la foto: niente nome, niente prezzo, niente stella. La fascia
          si guarda, non si legge — il nome e il prezzo stanno nella scheda
          che si apre toccando, a un dito di distanza.
          Il nome resta però l'ETICHETTA del bottone (aria-label): senza, chi
          naviga con lo screen reader si troverebbe una fila di bottoni muti. */}
      <button
        type="button"
        className="consiglio-card"
        onClick={() => onOpen(item, type)}
        aria-label={item.name}
      >
        <span className="consiglio-thumb">
          {/* si controlla l'URL e non `item.img`: sui vini quello è un array,
              e un array vuoto in JS è truthy (vedi elencoFoto in
              utils/cloudinary.js) */}
          {fotoProdotto(item, type) ? (
            <Immagine
              src={fotoProdotto(item, type)}
              alt=""
              className={"consiglio-img consiglio-img--" + type}
              loading="lazy"
            />
          ) : (
            <ProductPlaceholder
              item={item}
              type={type}
              className="consiglio-svg"
            />
          )}
        </span>
      </button>
    </li>
  );
}

// Quante schede vuote mostrare mentre i prodotti arrivano. Sei e non tre:
// devono ECCEDERE la riga visibile (su un telefono da 390px ce ne stanno
// meno di tre), altrimenti la fascia sembra corta e finita, invece che una
// riga che scorre e si sta ancora riempiendo.
const QUANTI_FANTASMI = 6;

// La scheda vuota: stessa scatola della VetrinaCard, con dentro i blocchi al
// posto di foto, nome e prezzo. Un riflesso ci passa sopra a ripetizione.
// Sta fuori da FasciaVetrina perché il React Compiler non vuole componenti
// definiti dentro altri componenti (vedi CLAUDE.md).
function FantasmaCard({ i }) {
  return (
    <li
      className="consiglio-cell consiglio-cell--fantasma"
      style={{ "--i": i }}
    >
      <div className="consiglio-card consiglio-card--fantasma">
        <span className="fantasma-blocco fantasma-thumb" />
        <span className="fantasma-blocco fantasma-nome" />
        <span className="fantasma-blocco fantasma-prezzo" />
      </div>
    </li>
  );
}

function FasciaVetrina({ titolo, items, type, tutti, etichettaTutti, onOpen }) {
  const inArrivo = items === null;
  if (!inArrivo && !items.length) return null;
  return (
    <section
      className="consigli-strip"
      aria-label={titolo}
      aria-busy={inArrivo}
    >
      <div className="consigli-strip-head">
        <h2 className="consigli-strip-title">{titolo}</h2>
        <Link className="consigli-strip-all" to={tutti}>
          {etichettaTutti} →
        </Link>
      </div>
      {/* mentre carica la riga non si scorre: non c'è niente da raggiungere
          e un trascinamento a vuoto sembra un blocco */}
      <ul
        className={"consigli-row" + (inArrivo ? " consigli-row--fantasma" : "")}
        aria-hidden={inArrivo}
      >
        {inArrivo
          ? Array.from({ length: QUANTI_FANTASMI }, (_, i) => (
              <FantasmaCard key={i} i={i} />
            ))
          : items.map((item, i) => (
              <VetrinaCard
                key={item.id || item.name + i}
                item={item}
                type={type}
                onOpen={onOpen}
                i={i}
              />
            ))}
      </ul>
    </section>
  );
}

// I vini consigliati in ordine casuale, ma MESCOLATI: due vini della stessa
// categoria (rossi, bianchi, bollicine…) non stanno mai uno accanto all'altro,
// finché i numeri lo permettono. Un rimescolamento puro lascerebbe spesso
// tre rossi in fila, e la fascia sembrerebbe una categoria sola.
//
// A ogni passo si pesca una categoria diversa dall'ultima, con probabilità
// proporzionale a quanti vini le restano. Se però una categoria ne ha ancora
// almeno metà del totale rimasto, tocca a lei per forza: rimandarla vorrebbe
// dire ritrovarsela in fila in fondo alla riga.
const rimescola = (lista) => {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
};

function mescolaVini(vini) {
  const gruppi = new Map();
  for (const vino of vini) {
    const k = vino.category || "";
    if (!gruppi.has(k)) gruppi.set(k, []);
    gruppi.get(k).push(vino);
  }
  for (const g of gruppi.values()) rimescola(g);

  const fuori = [];
  let ultima = null;
  while (fuori.length < vini.length) {
    const restano = vini.length - fuori.length;
    const piene = [...gruppi].filter(([, g]) => g.length);
    const altre = piene.filter(([k]) => k !== ultima);
    // solo l'ultima categoria ha ancora vini: la fila è inevitabile
    const scelte = altre.length ? altre : piene;
    const piuGrande = scelte.reduce((a, b) => (b[1].length > a[1].length ? b : a));
    let scelta = piuGrande;
    if (piuGrande[1].length * 2 < restano) {
      let r = Math.random() * scelte.reduce((s, [, g]) => s + g.length, 0);
      scelta = scelte.find(([, g]) => (r -= g.length) < 0) ?? piuGrande;
    }
    fuori.push(scelta[1].pop());
    ultima = scelta[0];
  }
  return fuori;
}

// Quanti vini mostra la fascia: dieci, pescati ogni giorno fra tutti i
// consigliati. Gli altri restano a un tocco, in "Tutta l'enoteca".
const VINI_DEL_GIORNO = 10;

// La data di oggi a Lodi ("2026-10-08"), non quella del telefono: il giorno
// cambia a mezzanotte italiana per tutti (vedi utils/orari.js).
const oggiARoma = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(
    new Date(),
  );

// FNV-1a a 32 bit: un numero fisso per ogni stringa, sempre lo stesso.
const impronta = (testo) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < testo.length; i++) {
    h ^= testo.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

// I dieci vini di oggi. La scelta è casuale ma uguale per tutta la giornata
// e per tutti i clienti: ogni vino riceve un numero da data + id, si tengono
// i dieci col numero più basso. Non dipende dall'ordine in cui il server
// manda l'elenco, e domani i numeri sono altri, quindi altri dieci vini.
// Se il negozio marca o smarca un vino, cambia solo quel posto.
function sceltiDiOggi(vini) {
  if (vini.length <= VINI_DEL_GIORNO) return vini;
  const giorno = oggiARoma();
  const numero = (vino) =>
    impronta(giorno + "|" + (vino.id ?? vino._id ?? vino.name));
  return vini
    .map((vino) => [numero(vino), vino])
    .sort((a, b) => a[0] - b[0])
    .slice(0, VINI_DEL_GIORNO)
    .map(([, vino]) => vino);
}

// Un ordine per visita: l'elenco scaricato resta in memoria (services/cache.js)
// e lo si rimescola una volta sola. Altrimenti tornando in home la fascia
// cambierebbe ordine sotto gli occhi — prima con il dato in memoria, un
// istante dopo con la stessa risposta rimescolata di nuovo. Ricaricando la
// pagina, ordine nuovo (i dieci vini restano quelli del giorno).
const giaMescolati = new WeakMap();
function viniMescolati(vini) {
  if (!vini) return vini;
  if (!giaMescolati.has(vini))
    giaMescolati.set(vini, mescolaVini(sceltiDiOggi(vini)));
  return giaMescolati.get(vini);
}

// Le due fasce sotto il racconto. Hanno preso il posto delle foto di
// famiglia, che sono passate alla pagina Info (Info.jsx, HERO_IMAGES).
//
// Qui ci sono i consigliati VERI: i prodotti che il negozio marca con la
// stella dal pannello admin. Prima c'erano venti segnaposto pescati dal
// catalogo (data/vetrina.js, cancellato) perché nessun prodotto era ancora
// marcato — una vetrina finta, che diceva "consigliati" di roba scelta da un
// algoritmo. Adesso sceglie il negozio, e finché non sceglie non c'è fascia:
// meglio una home più corta che un consiglio che non è di nessuno.
//
// Le due chiamate non hanno limite: i consigliati sono pochi per definizione.
// Dei vini però la fascia ne mostra solo dieci al giorno (sceltiDiOggi); gli
// alimentari li mostra tutti.
function Vetrina() {
  const navigate = useNavigate();
  // Tornando in home nella stessa visita le due fasce sono già piene: quel
  // che era stato scaricato è rimasto in memoria (services/cache.js) e si
  // legge SUBITO, al primo render, senza ripassare dalle schede vuote.
  // `undefined` = mai chiesto → si resta su `null`, che è "in arrivo".
  const [vini, setVini] = useState(
    () => viniMescolati(gia(CHIAVI.viniConsigliati)) ?? null,
  );
  const [alimentari, setAlimentari] = useState(
    () => gia(CHIAVI.alimentariConsigliati) ?? null,
  );

  useEffect(() => {
    let annullato = false;
    const metti = (set) => (dati) => {
      if (!annullato) set(dati || []);
    };
    // rete giù: elenco vuoto, la fascia sparisce e la home resta in piedi
    const vuoto = (set) => () => {
      if (!annullato) set([]);
    };
    // `ricorda` non richiama il server se il dato c'è già, e se la stessa
    // richiesta è ancora in volo (l'Enoteca vuole gli stessi vini
    // consigliati) ci si attacca invece di farne una seconda
    ricorda(CHIAVI.viniConsigliati, getWinesConsigliati)
      .then(metti((dati) => setVini(viniMescolati(dati))))
      .catch(vuoto(setVini));
    ricorda(CHIAVI.alimentariConsigliati, getAlimentariConsigliati)
      .then(metti(setAlimentari))
      .catch(vuoto(setAlimentari));
    return () => {
      annullato = true;
    };
  }, []);

  const apri = (item, type) => navigate(stradaProdotto(item, type));

  return (
    <div className="vetrina">
      {/* `tutti` porta alla tab "Consigliati" della pagina, non al suo indice:
          la fascia mostra i consigli del negozio, e il link è il seguito
          naturale di quella riga — gli altri consigli, non i gruppi del
          catalogo. */}
      <FasciaVetrina
        titolo="I nostri consigli"
        items={vini}
        type="vini"
        tutti="/enoteca/consigliati"
        etichettaTutti="Tutta l'enoteca"
        onOpen={apri}
      />
      <FasciaVetrina
        titolo="Dalla dispensa"
        items={alimentari}
        type="alimentari"
        tutti="/alimentari/consigliati"
        etichettaTutti="Tutti gli alimentari"
        onOpen={apri}
      />
    </div>
  );
}

// Il benvenuto si fa una volta sola per visita.
//
// Il titolo che si scrive parola per parola e le schede dei consigli che
// entrano in fila sono un'APERTURA: la prima volta raccontano qualcosa, ma
// alla home con la barra in basso ci si torna di continuo, e rivedere lo
// stesso numero a ogni giro lo trasforma in un tic — la pagina sembra
// ricaricarsi invece che tornare dov'era.
//
// Una variabile di modulo e non uno state: deve sopravvivere allo
// smontaggio della pagina (che è proprio quello che succede cambiando
// sezione) e morire al ricaricamento, esattamente come la memoria delle
// chiamate al server (services/cache.js). Le due cose vanno insieme: da
// quando i dati non si riscaricano, al ritorno le schede sarebbero lì
// istantanee E rianimate, che è il caso peggiore.
let giaEntrata = false;

function Home() {
  // Si legge PRIMA di segnare, e dentro l'inizializzatore di useState: al
  // primo montaggio vale `true` e resta quello per tutta la vita della
  // pagina, dal secondo in poi vale `false`. Leggerla nel corpo del render
  // sarebbe impuro (il React Compiler può riusare un render già fatto).
  const [anima] = useState(() => !giaEntrata);
  useEffect(() => {
    giaEntrata = true;
  }, []);

  // Stesso meccanismo delle pagine negozio (vedi enoteca.css, "testata
  // ferma"): la PAGINA non scorre, scorre un contenitore interno che finisce
  // sopra la tab bar. Prima scorreva il documento intero, e le schede della
  // dispensa passavano sotto la barra fissa e si vedevano tagliate nei 12px
  // fra la barra e il bordo dello schermo.
  useEffect(() => {
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, []);

  return (
    <section className={"hero" + (anima ? "" : " hero--ferma")}>
      {/* tutto dentro il contenitore che scorre: in home non c'è una testata
          da tenere ferma — il logo ce l'ha già l'header del sito */}
      <div className="page-scroll hero-scroll">
        <h1 className="hero-title">
          {TITOLO.split(" ").map((parola, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className="hero-parola" style={{ "--i": i }}>
                {parola}
              </span>
            </Fragment>
          ))}
        </h1>
        <div className="hero-stories">
          <p className="hero-story">{RACCONTO}</p>
          <span className="hero-divider" aria-hidden="true" />
        </div>
        <Vetrina />
      </div>
    </section>
  );
}

export default Home;
