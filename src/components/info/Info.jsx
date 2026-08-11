import { useEffect, useRef, useState } from "react";
import {
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  WhatsappLogo,
  MapPin,
  Clock,
  DeviceMobile,
  At,
} from "@phosphor-icons/react";
import { SHOP_INFO, WHATSAPP_NUMBER } from "../../data/data";
import { statoApertura, giornoDiRoma } from "../../utils/orari";
import Grainient from "../background/Grainient";
import interno from "../../images/detoma-interno.webp";
import facciata from "../../images/detoma-frame.webp";
import "./info.css";

// Le foto della fascia in cima. Per aggiungerne una: importala qui sopra e
// mettila in fondo all'elenco con la sua `alt` — la fascia diventa da sola
// una galleria che si scorre col dito, con i pallini sotto. Con una foto
// sola resta esattamente la fascia ferma di prima.
const HERO_IMAGES = [
  {
    src: interno,
    alt: "L'interno dell'enoteca de Toma: le pareti di bottiglie e il banco",
  },
];

const SOCIAL_ICONS = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  tiktok: TiktokLogo,
};

// l'indirizzo diventa una ricerca sul provider mappe: nessun link salvato
// a mano che col tempo smette di funzionare
const mapsHref = (a) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [a.via, a.cap, a.citta, a.provincia].filter(Boolean).join(" ")
  )}`;

const rigaIndirizzo = (a) =>
  [a.via, [a.cap, a.citta].filter(Boolean).join(" "), a.provincia && `(${a.provincia})`]
    .filter(Boolean)
    .join(" ");

function Info() {
  // NIENTE `home-no-scroll` / `page-pinned` qui, a differenza di Enoteca e
  // Gastronomia: quel meccanismo blocca la pagina e fa scorrere solo un
  // riquadro interno, e su un telefono da 844px di altezza al riquadro ne
  // restavano 294 (misurati) contro 690 di contenuto — si leggeva la pagina
  // da una feritoia. Lì serve perché la testata porta tab e filtri che devono
  // restare fermi; qui non c'è niente da tenere fermo, quindi scorre la
  // pagina intera e il logo esce di scena come in un sito normale.
  // `body` ha già `padding-bottom: 96px` su telefono per la tab bar (App.css).

  // il pallino aperto/chiuso deve restare vero mentre la pagina è aperta:
  // alle 13:00 in punto deve girare da solo, senza ricaricare
  const [adesso, setAdesso] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setAdesso(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  // La pagina Info scorre il documento (niente `page-pinned`), quindi il
  // contenuto le passa DIETRO: sopra all'header, che è `sticky` e solo
  // sfocato, e sotto alla tab bar, che galleggia a 12px dal fondo. In
  // mezzo a quelle due fasce non deve restare visibile niente.
  // Le misure NON sono numeri scritti a mano: l'header è alto quanto il
  // logo e la tab bar quanto le sue icone più la safe area del telefono.
  const [hHeader, setHHeader] = useState(0);
  // `sopra` = da dove comincia la tab bar, `sotto` = quanto resta scoperto
  // sotto di lei. null = tab bar non fissa (da 641px in su sta nell'header)
  const [barra, setBarra] = useState(null);

  useEffect(() => {
    const el = document.querySelector(".site-header");
    if (!el) return;
    // `offsetHeight` e non `contentRect.height`: la fascia deve coprire tutta
    // la testata, e il contentRect esclude i 39px di padding verticale.
    // `observe()` fa scattare subito la callback con la misura di partenza,
    // quindi non serve (né si deve) chiamare setState qui nel corpo.
    const ro = new ResizeObserver(() => setHHeader(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;
    const misura = () => {
      const cs = getComputedStyle(nav);
      // da 641px in su la barra non è più fissa in fondo ma una riga dentro
      // l'header: lì non c'è nessuna fascia da coprire
      if (cs.position !== "fixed") return setBarra(null);
      // NIENTE getBoundingClientRect qui: la tab bar entra con una
      // @keyframes che la traduce da translateY(140%) a 0 (App.css), e il
      // rect risente della trasformazione — misurata al montaggio la
      // davamo per 85px SOTTO il fondo dello schermo. `offsetHeight` e il
      // `bottom` calcolato sono di layout, quindi immuni all'animazione.
      const sotto = parseFloat(cs.bottom) || 0;
      setBarra({ sopra: nav.offsetHeight + sotto, sotto });
    };
    const ro = new ResizeObserver(misura);
    ro.observe(nav);
    window.addEventListener("resize", misura);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", misura);
    };
  }, []);

  // il fondo pagina si ferma appena sopra la tab bar invece dei 96px fissi
  // di App.css, che lasciavano la P.IVA sospesa lontano dalla barra
  useEffect(() => {
    if (!barra) return;
    const prima = document.body.style.paddingBottom;
    document.body.style.paddingBottom = `${barra.sopra + 10}px`;
    return () => {
      document.body.style.paddingBottom = prima;
    };
  }, [barra]);

  // quale foto della fascia è in vista. Non lo tengo io il conto: lo leggo
  // dallo scorrimento, così resta giusto anche quando il dito si ferma a
  // metà e lo scroll-snap decide da solo dove agganciare.
  const [fotoInVista, setFotoInVista] = useState(0);
  const pellicola = useRef(null);

  const onScrollFoto = (e) => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== fotoInVista) setFotoInVista(i);
  };

  const vaiAllaFoto = (i) => {
    const el = pellicola.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const { indirizzo, orari, telefono, email, piva, social, mappaLabel } = SHOP_INFO;
  const stato = statoApertura(orari, new Date(adesso));
  const oggi = giornoDiRoma(new Date(adesso));
  const socialAttivi = social.filter((s) => s.url);
  const mappa = mappaLabel ? mapsHref(indirizzo) : null;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Buongiorno, vorrei un'informazione."
  )}`;

  return (
    <section className="shop-section shop-section--info">
      {/* Le due finestre sullo sfondo: NON una tinta che gli assomiglia, ma
          lo sfondo stesso. È una seconda istanza dello shader di App.jsx,
          ancorata al viewport come quella vera; siccome condividono
          l'origine dei tempi (T0 in Grainient.jsx) mostrano lo stesso
          istante dell'animazione e combaciano pixel per pixel. Il contenuto
          ci passa dietro e sparisce invece di sbavare sotto al logo o di
          spuntare sotto alla tab bar.
          Una maschera sola ritaglia entrambe le fasce (vedi info.css), così
          serve UN solo shader in più e non due. Non c'è niente da accendere
          o spegnere allo scorrimento: dove non c'è contenuto dietro, la
          finestra mostra esattamente ciò che si vedrebbe comunque.
          Sta qui e non in App.jsx perché Info è l'unica pagina che scorre il
          documento: altrove header e tab bar stanno fuori dal riquadro che
          scorre e niente ci passa sotto — montarlo lì sarebbe uno shader a
          schermo intero acceso su tutto il sito per niente. */}
      <div
        className="pagina-finestra"
        aria-hidden="true"
        style={{
          "--h-alto": `${hHeader}px`,
          "--h-basso": `${barra ? barra.sotto : 0}px`,
        }}
      >
        <div className="pagina-finestra-sfondo">
          <Grainient
            color1="#f6f1e7"
            color2="#bcd9c3"
            color3="#5d8a6f"
            timeSpeed={0.9}
            grainAmount={0.09}
            contrast={1.15}
            saturation={0.95}
          />
        </div>
      </div>

      <h2 className="section-title">Info</h2>
      <div className="info-scroll">
        <div className="info-blocks">
          <figure className="info-hero">
            <div
              className="info-hero-track"
              ref={pellicola}
              onScroll={HERO_IMAGES.length > 1 ? onScrollFoto : undefined}
            >
              {HERO_IMAGES.map((f) => (
                <img key={f.src} className="info-hero-img" src={f.src} alt={f.alt} />
              ))}
            </div>

            {HERO_IMAGES.length > 1 && (
              <div className="info-hero-dots">
                {HERO_IMAGES.map((f, i) => (
                  <button
                    key={f.src}
                    type="button"
                    className={
                      "info-hero-dot" + (i === fotoInVista ? " info-hero-dot--on" : "")
                    }
                    aria-label={`Foto ${i + 1} di ${HERO_IMAGES.length}`}
                    aria-current={i === fotoInVista}
                    onClick={() => vaiAllaFoto(i)}
                  />
                ))}
              </div>
            )}

            <figcaption className="info-hero-cap">
              <span className="info-hero-title">Vieni a trovarci</span>
              {stato && (
                <span
                  className={"info-stato" + (stato.aperto ? " info-stato--aperto" : "")}
                >
                  {/* il pallino è decorativo: il senso lo porta il testo,
                      così non dipende dal colore per chi non lo distingue */}
                  <span className="info-stato-dot" aria-hidden="true" />
                  {stato.testo}
                </span>
              )}
            </figcaption>
          </figure>

          {/* un tocco = un'azione, con le icone che la gente riconosce già
              dalle schede attività del telefono. Tutte e tre hanno lo stesso
              tratto e lo stesso vetro, WhatsApp compresa: nessuna è "quella
              giusta", scelga il cliente come preferisce essere contattato. */}
          <nav className="info-azioni" aria-label="Contatti">
            {telefono && (
              <a className="info-azione" href={`tel:${telefono.replace(/\s/g, "")}`}>
                <DeviceMobile size={22} weight="thin" aria-hidden="true" />
                Chiama
              </a>
            )}
            {WHATSAPP_NUMBER && (
              <a
                className="info-azione"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo size={22} weight="thin" aria-hidden="true" />
                WhatsApp
              </a>
            )}
            {email && (
              <a className="info-azione" href={`mailto:${email}`}>
                <At size={22} weight="thin" aria-hidden="true" />
                Email
              </a>
            )}
          </nav>

         

          {/* "dove siamo" con la facciata disegnata, non con una mappa: la
              geometria delle strade non la inventiamo, il tocco apre le
              mappe vere. L'illustrazione serve a far riconoscere il negozio
              da fuori, che è quello che poi si cerca per strada. */}
          {mappa ? (
            <a
              className="info-vetrina"
              href={mappa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={mappaLabel}
            >
              <img className="info-vetrina-segno" src={facciata} alt="" />
              <span className="info-vetrina-testo">
                <span className="info-vetrina-eyebrow">Dove siamo</span>
                <span className="info-vetrina-via">{rigaIndirizzo(indirizzo)}</span>
                <span className="info-vetrina-cta">
                  <MapPin size={16} weight="fill" aria-hidden="true" />
                  Aprilo in mappa
                </span>
              </span>
            </a>
          ) : (
            <div className="info-vetrina info-vetrina--muta">
              <img className="info-vetrina-segno" src={facciata} alt="" />
              <span className="info-vetrina-testo">
                <span className="info-vetrina-eyebrow">Dove siamo</span>
                <span className="info-vetrina-via">{rigaIndirizzo(indirizzo)}</span>
              </span>
            </div>
          )}

          {orari.length > 0 && (
            <section className="info-block">
              <h3 className="info-block-title">
                <Clock size={20} weight="thin" aria-hidden="true" />
                Orari
              </h3>
              <ul className="info-hours">
                {orari.map((o) => (
                  <li
                    className={
                      "info-hours-row" +
                      (Array.isArray(o.dow) && o.dow.includes(oggi)
                        ? " info-hours-row--oggi"
                        : "")
                    }
                    key={o.giorni}
                  >
                    <span className="info-hours-days">{o.giorni}</span>
                    <span className="info-hours-time">{o.ore}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="info-footer">
            {socialAttivi.length > 0 && (
              <div className="info-socials">
                {socialAttivi.map((s) => {
                  const Logo = SOCIAL_ICONS[s.id];
                  return (
                    <a
                      key={s.id}
                      className="info-social"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                    >
                      {Logo && <Logo size={22} weight="regular" aria-hidden="true" />}
                    </a>
                  );
                })}
              </div>
            )}
            {piva && <p className="info-piva">P.IVA {piva}</p>}
          </footer>
        </div>
      </div>
    </section>
  );
}

export default Info;
