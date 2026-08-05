import { useEffect } from "react";
import {
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  WhatsappLogo,
  MapPin,
  Clock,
  Phone,
  EnvelopeSimple,
  Receipt,
} from "@phosphor-icons/react";
import { SHOP_INFO, WHATSAPP_NUMBER } from "../../data/data";
import "./info.css";

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

// una scheda di vetro: stesso materiale delle .cat-card dell'Enoteca
function Block({ title, children }) {
  return (
    <section className="info-block">
      <h3 className="info-block-title">
        {title}
      </h3>
      <div className="info-block-body">{children}</div>
    </section>
  );
}

function Info() {
  useEffect(() => {
    document.body.classList.add("home-no-scroll");
    document.body.classList.add("page-pinned");
    return () => {
      document.body.classList.remove("home-no-scroll");
      document.body.classList.remove("page-pinned");
    };
  }, []);

  const { indirizzo, orari, telefono, email, piva, social, mappaLabel } =
    SHOP_INFO;
  const iconProps = { size: 20, weight: "thin" };
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Buongiorno, vorrei un'informazione."
  )}`;
  const socialAttivi = social.filter((s) => s.url);

  return (
    <section className="shop-section">
      <div className="section-sticky">
        <h2 className="section-title">Info</h2>
      </div>

      <div className="info-scroll page-scroll">
        <div className="info-blocks">
          {/* indirizzo e orari insieme: è l'informazione "vieni a trovarci" */}
          <Block title="Dove siamo">
            {/* è l'indirizzo stesso ad aprire le mappe: nessuna frase in
                mezzo tra indirizzo e orari, e il tocco sta dove guarda già
                l'occhio. Il segnaposto in fondo è l'unico segnale che sia
                un link; `mappaLabel` non si legge più a schermo ma resta
                come etichetta per chi usa uno screen reader (e svuotarlo
                continua a togliere il link). */}
            <address className="info-address">
              {mappaLabel ? (
                <a
                  className="info-address-link"
                  href={mapsHref(indirizzo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={mappaLabel}
                >
                  <span>
                    {indirizzo.via}
                    <br />
                    {[indirizzo.cap, indirizzo.citta].filter(Boolean).join(" ")}
                    {indirizzo.provincia ? ` (${indirizzo.provincia})` : ""}
                  </span>
                  <MapPin
                    size={18}
                    weight="fill"
                    className="info-address-pin"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <>
                  {indirizzo.via}
                  <br />
                  {[indirizzo.cap, indirizzo.citta].filter(Boolean).join(" ")}
                  {indirizzo.provincia ? ` (${indirizzo.provincia})` : ""}
                </>
              )}
            </address>

            {orari.length > 0 && (
              <ul className="info-hours">
                {orari.map((o) => (
                  <li className="info-hours-row" key={o.giorni}>
                    <span className="info-hours-days">
                      <Clock {...iconProps} size={16} aria-hidden="true" />
                      {o.giorni}
                    </span>
                    <span className="info-hours-time">{o.ore}</span>
                  </li>
                ))}
              </ul>
            )}
          </Block>

          {/* una sola scheda contatti: telefono, email, P.IVA e WhatsApp */}
          <Block title="Contatti" icon={<WhatsappLogo {...iconProps} />}>
            {telefono && (
              <a className="info-link" href={`tel:${telefono.replace(/\s/g, "")}`}>
                <Phone {...iconProps} size={16} aria-hidden="true" />
                {telefono}
              </a>
            )}
            {email && (
              <a className="info-link" href={`mailto:${email}`}>
                <EnvelopeSimple {...iconProps} size={16} aria-hidden="true" />
                {email}
              </a>
            )}
            {piva && (
              <p className="info-piva">
                <Receipt {...iconProps} size={16} aria-hidden="true" />
                P.IVA {piva}
              </p>
            )}
            {WHATSAPP_NUMBER && (
              <a
                className="info-cta"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
                Scrivici su WhatsApp
              </a>
            )}
          </Block>

          {socialAttivi.length > 0 && (
            <Block title="Seguici" icon={<InstagramLogo {...iconProps} />}>
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
                    >
                      {Logo && <Logo size={22} weight="thin" aria-hidden="true" />}
                      {s.label}
                    </a>
                  );
                })}
              </div>
            </Block>
          )}
        </div>
      </div>
    </section>
  );
}

export default Info;
