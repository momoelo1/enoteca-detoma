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
