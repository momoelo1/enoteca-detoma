import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductPlaceholder } from "../enoteca/Enoteca";
import { formatPrezzo } from "../../utils/prezzo";
import { getWines } from "../../services/wines";
import { getAlimentari } from "../../services/alimentari";
import { productSlug } from "../../utils/productSlug";
import { normalize } from "../../utils/normalize";
import { trimBorder } from "../../utils/cloudinary";
import { BACINO_VETRINA, prezzoVetrina, scegliMisti } from "../../data/vetrina";
import "./home.css";

// Il titolo si scrive da sé all'apertura, parola per parola, come se una
// mano lo stesse tracciando: è in corsivo (Snell Roundhand) e una comparsa
// da sinistra a destra si legge esattamente come una scrittura.
// Sta scritto qui e non nel JSX perché va spezzato in parole; lo spazio fra
// una e l'altra resta un nodo di testo vero (vedi il Fragment sotto), non un
// margine, altrimenti il titolo non andrebbe più a capo dove deve.
const TITOLO = "Tre Generazioni, Una Passione per il Vino";

// Dove porta una scheda della vetrina: al SUO posto nel catalogo, con la
// scheda prodotto già aperta. Non alla tab Consigliati — un segnaposto non è
// un consiglio, e l'indirizzo che si vede nella barra deve dire la verità su
// dove sta quel prodotto.
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
  // "€ 0,00" (vedi prezzoVetrina in data/vetrina.js). Gli alimentari non
  // hanno proprio il campo prezzo, quindi per loro non compare mai.
  const prezzo = prezzoVetrina(item);
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

// Una fascia della vetrina: titolo, link "vedi tutti" e la riga di schede che
// scorre di lato. Ce ne sono due identiche (vini e alimentari) — quello che
// cambia è solo cosa ci finisce dentro.
// `items` a null = ancora in arrivo: la fascia non esiste proprio, niente
// schede segnaposto vuote. La home scorre, quindi una fascia che compare
// dopo si aggiunge SOTTO quello che si sta leggendo e non sposta niente.
function FasciaVetrina({ titolo, items, type, tutti, etichettaTutti, onOpen }) {
  if (!items?.length) return null;
  return (
    <section className="consigli-strip" aria-label={titolo}>
      <div className="consigli-strip-head">
        <h2 className="consigli-strip-title">{titolo}</h2>
        <Link className="consigli-strip-all" to={tutti}>
          {etichettaTutti} →
        </Link>
      </div>
      <ul className="consigli-row">
        {items.map((item, i) => (
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
// Due chiamate sole, tagliate a BACINO_VETRINA prodotti l'una: è da lì che
// scegliMisti() pesca i venti segnaposto — vedi data/vetrina.js per come,
// perché proprio ottanta e quando toglierli.
function Vetrina() {
  const navigate = useNavigate();
  const [vini, setVini] = useState(null);
  const [alimentari, setAlimentari] = useState(null);

  useEffect(() => {
    let annullato = false;
    const metti = (set, chiave) => (dati) => {
      if (!annullato) set(scegliMisti(dati || [], chiave));
    };
    // rete giù: elenco vuoto, la fascia sparisce e la home resta in piedi
    const vuoto = (set) => () => {
      if (!annullato) set([]);
    };
    getWines(null, BACINO_VETRINA)
      .then(metti(setVini, "category"))
      .catch(vuoto(setVini));
    getAlimentari(null, BACINO_VETRINA)
      .then(metti(setAlimentari, "sottocategoria"))
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
