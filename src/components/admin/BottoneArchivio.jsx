// Il bottone "Archivia" delle tessere: toglie il prodotto dal negozio senza
// cancellarlo, e lo si ripristina dalla sezione Archivio (ArchivioManager).
// Uno solo per le quattro tessere, come StellaConsigliato.
function BottoneArchivio({ inCorso, onClick }) {
  const etichetta = "Archivia: toglilo dal negozio senza perderlo";
  return (
    <button
      type="button"
      className="admin-icon-btn"
      onClick={onClick}
      disabled={inCorso}
      aria-label={etichetta}
      title={etichetta}
    >
      {/* scatola d'archivio: coperchio, cassa e maniglia */}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 4h18v4H3zM5 8v12h14V8M10 12h4" />
      </svg>
    </button>
  );
}

export default BottoneArchivio;
