import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductPlaceholder } from "../enoteca/Enoteca";
import { formatPrezzo, prezzoProdotto } from "../../utils/prezzo";
import { getWinesConsigliati } from "../../services/wines";
import { getAlimentariConsigliati } from "../../services/alimentari";
import { productSlug } from "../../utils/productSlug";
import { normalize } from "../../utils/normalize";
import { trimBorder } from "../../utils/cloudinary";
import "./home.css";

// Il titolo si scrive da sé all'apertura, parola per parola, come se una
// mano lo stesse tracciando: è in corsivo (Snell Roundhand) e una comparsa
// da sinistra a destra si legge esattamente come una scrittura.
// Sta scritto qui e non nel JSX perché va spezzato in parole; lo spazio fra
// una e l'altra resta un nodo di testo vero (vedi il Fragment sotto), non un
// margine, altrimenti il titolo non andrebbe più a capo dove deve.
const TITOLO = "Tre Generazioni, Una Passione per il Vino";

// Dove porta una scheda della vetrina: al SUO posto nel catalogo, con la
// scheda prodotto già aperta. Non alla tab Consigliati: l'indirizzo che si
// vede nella barra deve dire la verità su dove sta quel prodotto.
const stradaProdotto = (item, type) =>
  type === "alimentari"
    ? `/alimentari/${item.category}/${encodeURIComponent(
        normalize((item.sottocategoria || "").trim())
      )}/${productSlug(item)}`
    : `/enoteca/vini/${item.category}/${productSlug(item)}`;

// `i`: la posizione nella fascia, che il CSS usa come ritardo — le schede
// non compaiono tutte insieme ma una dopo l'altra. A freddo su Vercel la
// prima risposta può tardare più di dieci secondi: quando finalmente
// arrivano, così l'attesa si chiude con una comparsa invece che con uno
// scatto (il ritardo è tosato a poche schede, vedi home.css).
function VetrinaCard({ item, type, onOpen, i }) {
  // null anche quando il prezzo è 0: la riga sparisce invece di annunciare
  // "€ 0,00" (vedi prezzoProdotto in utils/prezzo.js). Gli alimentari spesso
  // il campo non ce l'hanno proprio, quindi per loro non compare mai.
  const prezzo = prezzoProdotto(item);
  return (
    <li className="consiglio-cell" style={{ "--i": i }}>
      <button
        type="button"
        className="consiglio-card"
        onClick={() => onOpen(item, type)}
      >
        {item.consigliato && (
          <span className="consiglio-star" aria-hidden="true">
            ★
          </span>
        )}
        <span className="consiglio-thumb">
          {item.img ? (
            <img
              src={type === "alimentari" ? trimBorder(item.img) : item.img}
              alt=""
              className="consiglio-img"
              loading="lazy"
            />
          ) : (
            <ProductPlaceholder item={item} type={type} className="consiglio-svg" />
          )}
        </span>
        <span className="consiglio-name">{item.name}</span>
        {prezzo != null && (
          <span className="consiglio-price">{formatPrezzo(prezzo)}</span>
        )}
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
    <li className="consiglio-cell consiglio-cell--fantasma" style={{ "--i": i }}>
      <div className="consiglio-card consiglio-card--fantasma">
        <span className="fantasma-blocco fantasma-thumb" />
        <span className="fantasma-blocco fantasma-nome" />
        <span className="fantasma-blocco fantasma-prezzo" />
      </div>
    </li>
  );
}

// Una fascia della vetrina: titolo, link "vedi tutti" e la riga di schede che
// scorre di lato. Ce ne sono due identiche (vini e alimentari) — quello che
// cambia è solo cosa ci finisce dentro.
//
// Tre stati, e la differenza fra i primi due è tutta in `items`:
// - `null`  = ancora in arrivo → la fascia c'è già, con le schede vuote. Il
//   telaio (titolo, link, altezza della riga) è quello definitivo, così
//   quando i prodotti arrivano non si sposta niente e l'attesa sembra voluta
//   invece che un pezzo di pagina mancante.
// - `[]`    = arrivata e vuota (rete giù, o nessun prodotto) → niente fascia:
//   meglio una home più corta che un telaio che non si riempirà mai.
// - piena   = le schede vere.
function FasciaVetrina({ titolo, items, type, tutti, etichettaTutti, onOpen }) {
  const inArrivo = items === null;
  if (!inArrivo && !items.length) return null;
  return (
    <section className="consigli-strip" aria-label={titolo} aria-busy={inArrivo}>
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
// Le due chiamate non hanno limite: i consigliati sono pochi per definizione,
// e quanti mostrarne lo decide il negozio marcandoli.
function Vetrina() {
  const navigate = useNavigate();
  const [vini, setVini] = useState(null);
  const [alimentari, setAlimentari] = useState(null);

  useEffect(() => {
    let annullato = false;
    const metti = (set) => (dati) => {
      if (!annullato) set(dati || []);
    };
    // rete giù: elenco vuoto, la fascia sparisce e la home resta in piedi
    const vuoto = (set) => () => {
      if (!annullato) set([]);
    };
    getWinesConsigliati().then(metti(setVini)).catch(vuoto(setVini));
    getAlimentariConsigliati()
      .then(metti(setAlimentari))
      .catch(vuoto(setAlimentari));
    return () => {
      annullato = true;
    };
  }, []);

  const apri = (item, type) => navigate(stradaProdotto(item, type));

  return (
    <div className="vetrina">
      <FasciaVetrina
        titolo="I nostri consigli"
        items={vini}
        type="vini"
        tutti="/enoteca"
        etichettaTutti="Tutta l'enoteca"
        onOpen={apri}
      />
      <FasciaVetrina
        titolo="Dalla dispensa"
        items={alimentari}
        type="alimentari"
        tutti="/alimentari"
        etichettaTutti="Tutti gli alimentari"
        onOpen={apri}
      />
    </div>
  );
}

function Home() {
  // La home SCORRE (niente `home-no-scroll`, che invece usano ancora
  // Enoteca, Gastronomia e Login): il racconto più due fasce di schede non
  // stanno in una schermata sola, e a comprimerli si perderebbe l'uno o le
  // altre.
  return (
    <section className="hero">
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
        <p className="hero-story">
          L&apos;amore della famiglia De Toma per il vino nasce agli inizi del
          &apos;900, quando Nicola De Toma lascia Trani per approdare a Lodi e
          aprire un emporio vinicolo. Da lui, attraverso Domenica e Bartolomeo
          (Nino), l&apos;attività arriva oggi a Nicola e Sabrina, che guidano
          l&apos;enoteca.
        </p>
        <span className="hero-divider" aria-hidden="true" />
      </div>
      <Vetrina />
    </section>
  );
}

export default Home;
