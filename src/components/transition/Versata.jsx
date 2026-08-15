import { useEffect, useState } from "react";
import { SALITA, USCITA, registraVersata } from "./versa";
import "./versata.css";

// Il pannello dell'onda. Non decide nulla da solo: lo comandano le pagine
// chiamando versa() (vedi versa.js), che è l'unica cosa che importano.
function Versata() {
  const [stato, setStato] = useState(null);

  useEffect(
    () =>
      registraVersata((colore, vai) =>
        setStato({ colore, vai, fase: "sale" })
      ),
    []
  );

  // La macchina a stati va avanti a tempo e non con onAnimationEnd: se
  // l'animazione non partisse (scheda in secondo piano, pannello fuori
  // schermo) l'evento non arriverebbe mai e la navigazione resterebbe
  // appesa a metà. Con i timer il cambio di rotta avviene comunque.
  useEffect(() => {
    if (!stato) return;
    if (stato.fase === "sale") {
      const t = setTimeout(() => {
        stato.vai();
        setStato((s) => (s ? { ...s, fase: "esce" } : null));
      }, SALITA);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStato(null), USCITA);
    return () => clearTimeout(t);
  }, [stato]);

  if (!stato) return null;

  return (
    <div className="versata" aria-hidden="true">
      <div
        // `key` sulla fase: le due animazioni stanno su classi diverse ma
        // sullo stesso elemento, e senza un rimontaggio il browser può non
        // far ripartire la seconda
        key={stato.fase}
        className={`versata-onda versata-onda--${stato.fase}`}
        style={{
          "--versata": stato.colore,
          "--salita": `${SALITA}ms`,
          "--uscita": `${USCITA}ms`,
        }}
      />
    </div>
  );
}

export default Versata;
