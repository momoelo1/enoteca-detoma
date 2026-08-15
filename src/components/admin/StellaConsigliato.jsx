// La stella della selezione della casa, in alto a destra sulla tessera di
// ogni prodotto in griglia. È lo stesso segno che il cliente vede sul sito
// (.product-consigliato nell'Enoteca, .consiglio-star in home): qui però si
// tocca, e il tocco salva subito.
//
// Sta in un componente a sé perché la usano i tre pannelli (vini, birre,
// alimentari) e deve restare identica: stessa posizione, stesso oro, stesse
// parole lette dallo screen reader. La chiamata al backend invece è di chi
// la usa — ogni pannello ha il suo servizio.
//
// Perché un tocco solo e non una spunta dentro il form: marcare i consigliati
// è un lavoro che si fa a raffica, scorrendo il catalogo e scegliendo. Aprire
// la modifica, spuntare, salvare e chiudere per ogni prodotto era il triplo
// dei gesti per un valore che è solo sì o no.
function StellaConsigliato({ attivo, inCorso, onToggle }) {
  const etichetta = attivo
    ? "Togli dai consigliati"
    : "Segna come consigliato";
  return (
    <button
      type="button"
      className={"admin-stella" + (attivo ? " admin-stella--attiva" : "")}
      onClick={onToggle}
      disabled={inCorso}
      // `aria-pressed` e non un checkbox: è un interruttore acceso/spento,
      // e allo screen reader va detto proprio così
      aria-pressed={attivo}
      aria-label={etichetta}
      title={etichetta}
    >
      ★
    </button>
  );
}

export default StellaConsigliato;
