// Blocco "selezione della casa" condiviso dai tre form admin (vini, birre,
// alimentari): la spunta e, solo quando è attiva, la nota personale.
//
// Sta in un componente a sé perché il senso del campo è lo stesso ovunque:
// l'etichetta e il segnaposto sono il modo in cui si spiega al negoziante
// cosa scrivere, e devono restare identici nei tre form invece di divergere
// a ogni ritocco.
function ConsigliatoField({ consigliato, consiglio, onChange }) {
  return (
    <div className="admin-field">
      <label className="admin-check">
        <input
          type="checkbox"
          checked={consigliato}
          onChange={(e) => onChange("consigliato", e.target.checked)}
        />
        <span className="admin-check-text">Consigliato dall&apos;enoteca</span>
      </label>
      {consigliato && (
        <div className="admin-field admin-field--enter admin-field--consiglio">
          <label>Perché lo consigliamo</label>
          <textarea
            rows={3}
            value={consiglio}
            onChange={(e) => onChange("consiglio", e.target.value)}
            placeholder="Due righe con parole tue: perché l'hai scelto, con cosa si beve o si mangia…"
          />
          <span className="admin-field-hint">
            È la parte che il cliente legge per prima nella scheda: vale più di
            una descrizione tecnica.
          </span>
        </div>
      )}
    </div>
  );
}

export default ConsigliatoField;
