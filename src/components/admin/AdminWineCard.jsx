import { useEffect, useState } from "react";
import { createWine, updateWine, deleteWine, deleteWineImage } from "../../services/wines";
import { COUNTRY_GROUPS } from "../../data/data";
import { ML_NOTI, etichettaFormato, prezzoProdotto } from "../../utils/prezzo";
import StellaConsigliato from "./StellaConsigliato";


const FOREIGN_COUNTRIES = Object.keys(COUNTRY_GROUPS);


// Il form rispecchia la forma del database (models/Wine.js): un'annata
// contiene i suoi formati, e il prezzo sta sul formato — lo stesso anno può
// vendersi in bottiglia e in magnum a due prezzi diversi.
//
// `conPrezzo` è la spunta del formato: legato, porta il suo prezzo; slegato,
// il formato si salva senza. Non sta nel database — si ricava dal prezzo che
// c'è, e ridiventa un prezzo quando si salva. È il caso di "disponibile anche
// Magnum": il formato esiste, il prezzo si chiede in negozio.
//
// Lo ZERO vale come "slegato", non come "gratis": sono le schede mai prezzate
// (56 vini su 533 in produzione al 2026-08-26), che il sito già tratta come
// senza prezzo (prezzoProdotto in utils/prezzo.js). Aprendole in modifica la
// spunta è quindi spenta, che è la verità, e salvando lo zero sparisce davvero.
const toFormato = (ml, prezzo) => ({
  ml: ml ?? "",
  prezzo: prezzo > 0 ? prezzo : "",
  conPrezzo: prezzo > 0,
});

// nuovi vuoti: spunta accesa, perché il caso normale è mettere un prezzo.
// Sono funzioni e non costanti condivise: due righe vuote nello stesso form
// devono essere due oggetti distinti.
const formatoVuoto = () => ({ ml: "", prezzo: "", conPrezzo: true });
const annataVuota = () => ({ anno: "", formati: [formatoVuoto()] });

// un'annata non ancora migrata non ha `formati` ma il vecchio `prezzo`
// piatto: si legge come un formato unico standard, così aprire in modifica
// un vino di oggi mostra il suo prezzo invece di una riga vuota
const toAnnata = (a) => ({
  anno: a.anno || "",
  formati: a.formati?.length
    ? a.formati.map((f) => toFormato(f.ml, f.prezzo))
    : [toFormato("", a.prezzo)],
});

const toAnnate = (wine) => {
  if (wine?.annate?.length) return wine.annate.map(toAnnata);
  if (wine?.anno || wine?.prezzo != null) {
    return [toAnnata({ anno: wine.anno, prezzo: wine.prezzo })];
  }
  return [annataVuota()];
};

const toForm = (wine) => ({
  name: wine?.name || "",
  regione: wine?.regione || "",
  paese: wine?.paese || "",
  img: wine?.img || "",
  description: wine?.description || "",
  annate: toAnnate(wine),
});

const EMPTY_FORM = {
  name: "",
  regione: "",
  paese: "",
  img: "",
  description: "",
  annate: [annataVuota()],
};

// stato del selettore Paese, separato dal form: un vino nuovo parte
// senza scelta (niente Regione finché non si sceglie esplicitamente),
// mentre un vino già esistente la deduce dai dati che ha già —
// altrimenti ogni apertura in modifica costringerebbe a riscegliere.
const deriveCountrySelection = (wine) => {
  if (!wine) return "";
  if (wine.paese && FOREIGN_COUNTRIES.includes(wine.paese)) return wine.paese;
  if (wine.regione) return "Italia";
  return "";
};


function AdminWineCard({ wine, categoryId, onCreated, onUpdated, onDeleted }) {
  const isNew = !wine;
  const isChampagne = categoryId === "champagne";
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(wine));
  const [countrySelection, setCountrySelection] = useState(() => deriveCountrySelection(wine));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [removingIndex, setRemovingIndex] = useState(null);
  const [flagging, setFlagging] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // La stella salva da sola, senza passare dal form: si manda SOLO
  // `consigliato`, e il PUT del backend fa `set(req.body)`, quindi il resto
  // del prodotto non viene toccato. Stessa funzione in AdminBeerCard e
  // AdminAlimentareCard, con il servizio della loro risorsa.
  const toggleConsigliato = async () => {
    setFlagging(true);
    setError("");
    try {
      onUpdated(await updateWine(wine.id, { consigliato: !wine.consigliato }));
    } catch (err) {
      setError(err.message);
    } finally {
      setFlagging(false);
    }
  };

  const handleCountrySelect = (e) => {
    const value = e.target.value;
    setCountrySelection(value);
    if (value === "Italia") {
      setForm((f) => ({ ...f, paese: "" }));
    } else {
      setForm((f) => ({ ...f, paese: value, regione: "" }));
    }
  };

  const updateAnnata = (index, field, value) => {
    setForm((f) => ({
      ...f,
      annate: f.annate.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
  };
  // scorciatoia per riscrivere i formati di una sola annata, lasciando
  // intatte le altre: la usano tutti gli handler del livello sotto
  const mapFormati = (index, fn) =>
    setForm((f) => ({
      ...f,
      annate: f.annate.map((a, i) =>
        i === index ? { ...a, formati: fn(a.formati) } : a,
      ),
    }));

  const updateFormato = (index, fIndex, field, value) =>
    mapFormati(index, (formati) =>
      formati.map((row, j) => (j === fIndex ? { ...row, [field]: value } : row)),
    );

  // slegando il formato il prezzo si svuota subito: lasciarlo scritto sotto
  // un campo disabilitato farebbe credere che venga salvato lo stesso
  const togglePrezzo = (index, fIndex) =>
    mapFormati(index, (formati) =>
      formati.map((row, j) =>
        j === fIndex
          ? { ...row, conPrezzo: !row.conPrezzo, prezzo: row.conPrezzo ? "" : row.prezzo }
          : row,
      ),
    );

  const addFormato = (index) =>
    mapFormati(index, (formati) => [...formati, formatoVuoto()]);

  // l'ultimo formato non si toglie: un'annata senza formati non avrebbe
  // dove tenere il prezzo. Si svuota, e resta una riga da riempire
  const removeFormato = (index, fIndex) =>
    mapFormati(index, (formati) =>
      formati.length === 1
        ? [formatoVuoto()]
        : formati.filter((_, j) => j !== fIndex),
    );

  const addAnnata = () =>
    setForm((f) => ({ ...f, annate: [...f.annate, annataVuota()] }));
  const removeAnnata = (index) => {
    if (removingIndex !== null) return;
    setRemovingIndex(index);
    setTimeout(() => {
      setForm((f) => ({ ...f, annate: f.annate.filter((_, i) => i !== index) }));
      setRemovingIndex(null);
    }, 200);
  };

  // legge il file scelto e lo tiene come data URL: nessun upload separato
  // da gestire, ma i documenti diventano più pesanti — va bene per ora,
  // un hosting immagini vero resta un passo futuro
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, img: reader.result }));
    reader.readAsDataURL(file);
  };

  const startEdit = () => {
    setForm(toForm(wine));
    setCountrySelection(deriveCountrySelection(wine));
    setRemovingIndex(null);
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(toForm(wine));
    setCountrySelection(deriveCountrySelection(wine));
    setRemovingIndex(null);
    setError("");
    setEditing(false);
  };

  // chiudi il dialogo con Esc, come il bottom sheet del sito pubblico
  useEffect(() => {
    if (!editing) return;
    const onKey = (e) => {
      if (e.key === "Escape") cancelEdit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Chiavi assenti, non zeri: un formato slegato (o col prezzo lasciato in
    // bianco) parte SENZA `prezzo`, e uno standard SENZA `ml`. Non `null`,
    // che Mongoose rifiuterebbe come non numerico — la chiave proprio non c'è.
    const numero = (v) => {
      const n = Number(v);
      return v !== "" && Number.isFinite(n) ? n : null;
    };

    const annate = form.annate
      .map((a) => {
        const formati = a.formati
          // una riga vuota e ancora spuntata è solo una riga mai compilata:
          // si scarta. Una riga vuota ma SLEGATA invece dice qualcosa —
          // "bottiglia standard, prezzo da chiedere" — e va tenuta
          .filter((f) => f.ml !== "" || f.prezzo !== "" || !f.conPrezzo)
          .map((f) => {
            const ml = numero(f.ml);
            const prezzo = f.conPrezzo ? numero(f.prezzo) : null;
            return {
              ...(ml != null && { ml }),
              ...(prezzo != null && { prezzo }),
            };
          });
        return { anno: a.anno, ...(formati.length > 0 && { formati }) };
      })
      // si scarta solo ciò che non dice niente. Il filtro sta DOPO la mappa
      // perché su champagne l'anno è sempre "": un'annata tutta slegata
      // resterebbe vuota del tutto, e prima passava perché aveva un prezzo
      .filter((a) => a.anno !== "" || a.formati?.length > 0);

    const payload = Object.fromEntries(
      Object.entries({
        name: form.name,
        regione: form.regione,
        paese: form.paese,
        img: form.img,
        description: form.description,
      }).filter(([, v]) => v !== ""),
    );
    if (annate.length > 0) payload.annate = annate;
    // `consigliato` non passa di qui: lo governa solo la stella in griglia
    // (StellaConsigliato). Se il form lo rimandasse, salvare una modifica
    // qualunque riscriverebbe il flag col valore che aveva all'apertura,
    // annullando una stella toccata nel frattempo.

    try {
      if (isNew) {
        const created = await createWine({ ...payload, category: categoryId });
        onCreated(created);
        setForm(EMPTY_FORM);
        setCountrySelection("");
        setEditing(false);
      } else {
        const updated = await updateWine(wine.id, payload);
        onUpdated(updated);
        setEditing(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Eliminare "${wine.name}"?`)) return;
    setError("");
    try {
      await deleteWine(wine.id);
      onDeleted(wine.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // rimuove la foto: se è già caricata su Cloudinary (vino salvato) la
  // cancella davvero anche lato storage, non solo il riferimento; se è
  // solo un'anteprima locale non ancora salvata basta svuotare il form
  const handleDeleteImage = async () => {
    const isUnsavedPreview = form.img.startsWith("data:");
    if (isNew || isUnsavedPreview || !wine?.img) {
      setForm((f) => ({ ...f, img: "" }));
      return;
    }
    if (!window.confirm("Eliminare l'immagine in modo permanente?")) return;
    setError("");
    try {
      const updated = await deleteWineImage(wine.id);
      onUpdated(updated);
      setForm((f) => ({ ...f, img: "" }));
    } catch (err) {
      setError(err.message);
    }
  };

  const editModal = editing && (
    <div className="admin-modal-backdrop" onClick={cancelEdit}>
      <form
        className="admin-modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="admin-modal-title">
          {isNew ? "Aggiungi vino" : `Modifica "${wine.name}"`}
        </h3>

        <div className="admin-field">
          <label>Nome</label>
          <input type="text" value={form.name} onChange={handleChange("name")} required autoFocus />
        </div>
        {!isChampagne && (
          <div className="admin-field">
            <label>Paese</label>
            <select value={countrySelection} onChange={handleCountrySelect} required>
              <option value="" disabled>
                Seleziona un Paese
              </option>
              <option value="Italia">Italia</option>
              {FOREIGN_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        )}
        {!isChampagne && countrySelection === "Italia" && (
          <div className="admin-field admin-field--enter">
            <label>Regione</label>
            <input type="text" value={form.regione} onChange={handleChange("regione")} />
          </div>
        )}

        <div className="admin-field">
          <label>{isChampagne ? "Prezzi" : "Annate e prezzi"}</label>
          {/* il campo ml è stretto e il segnaposto non ci sta: la regola
              importante ("vuoto = bottiglia") va detta una volta qui */}
          <p className="admin-hint">
            Un formato per riga. Lascia <strong>ml</strong> vuoto per la
            bottiglia normale; compilalo solo per mezze bottiglie e magnum.
            Togli la spunta <strong>Prezzo</strong> se il formato si vende ma
            il prezzo si chiede in negozio.
          </p>
          {/* elenco dei formati suggeriti: il negozio ragiona per nome
              ("Magnum"), non per numero, ma nel database va il numero.
              Il campo resta libero — un formato fuori elenco si scrive */}
          <datalist id="admin-ml-noti">
            {ML_NOTI.map((ml) => (
              <option key={ml} value={ml}>
                {etichettaFormato(ml, { sempre: true })}
              </option>
            ))}
          </datalist>

          <div className="admin-annate-list">
            {form.annate.map((annata, i) => (
              <div
                className={
                  "admin-annata admin-field--enter" +
                  (removingIndex === i ? " admin-annata--removing" : "")
                }
                key={i}
              >
                {!isChampagne && (
                  <div className="admin-annata-testa">
                    <div className="admin-field">
                      <input
                        type="text"
                        placeholder="Anno"
                        value={annata.anno}
                        onChange={(e) => updateAnnata(i, "anno", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="admin-annata-remove"
                      onClick={() => removeAnnata(i)}
                      aria-label="Rimuovi annata"
                      title="Rimuovi l'annata e tutti i suoi formati"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="admin-formati-list">
                  {annata.formati.map((f, j) => (
                    <div className="admin-formato-row" key={j}>
                      <div className="admin-field">
                        <input
                          type="number"
                          step="1"
                          list="admin-ml-noti"
                          placeholder="ml"
                          title="Formato in millilitri. Vuoto = bottiglia standard da 750 ml."
                          value={f.ml}
                          onChange={(e) => updateFormato(i, j, "ml", e.target.value)}
                        />
                      </div>
                      {/* la spunta lega il prezzo a QUESTO formato: slegata
                          vuol dire "lo teniamo, il prezzo si chiede" — che è
                          il "disponibile anche Magnum" scritto oggi nei nomi */}
                      <label
                        className={
                          "admin-annata-check" +
                          (f.conPrezzo ? " admin-annata-check--attiva" : "")
                        }
                        title={
                          f.conPrezzo
                            ? "Prezzo legato a questo formato — togli la spunta per lasciarlo senza prezzo"
                            : "Formato senza prezzo — spunta per legarcene uno"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={f.conPrezzo}
                          onChange={() => togglePrezzo(i, j)}
                        />
                        <span className="admin-annata-check-box" aria-hidden="true">
                          ✓
                        </span>
                        <span className="admin-annata-check-text">Prezzo</span>
                      </label>
                      <div className="admin-field">
                        <input
                          type="number"
                          step="0.01"
                          /* campo stretto: il segnaposto lungo veniva
                             tagliato. Che sia senza prezzo lo dice già la
                             spunta spenta accanto */
                          placeholder={f.conPrezzo ? "Prezzo €" : "—"}
                          value={f.prezzo}
                          disabled={!f.conPrezzo}
                          onChange={(e) => updateFormato(i, j, "prezzo", e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="admin-annata-remove"
                        onClick={() => removeFormato(i, j)}
                        aria-label="Rimuovi formato"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="admin-annata-add admin-annata-add--formato"
                  onClick={() => addFormato(i)}
                >
                  + Aggiungi formato
                </button>
              </div>
            ))}
          </div>
          {!isChampagne && (
            <button type="button" className="admin-annata-add" onClick={addAnnata}>
              + Aggiungi annata
            </button>
          )}
        </div>

        <div className="admin-field">
          <label>Immagine</label>
          <input type="file" accept="image/*" onChange={handleImageFile} />
          {form.img && (
            <div className="admin-image-preview-wrap">
              <img src={form.img} alt="" className="admin-image-preview" />
              <button
                type="button"
                className="admin-image-remove"
                onClick={handleDeleteImage}
                aria-label="Rimuovi immagine"
                title="Rimuovi immagine"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="admin-field">
          <label>Descrizione</label>
          <textarea rows={3} value={form.description} onChange={handleChange("description")} />
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="admin-save-btn" disabled={saving}>
            {saving ? "Salvo…" : isNew ? "Aggiungi" : "Salva"}
          </button>
          <button type="button" className="admin-cancel" onClick={cancelEdit}>
            Annulla
          </button>
        </div>
      </form>
    </div>
  );

  // tessera "+ Aggiungi vino": tocco solo per aprire il dialogo vuoto
  if (isNew) {
    return (
      <li className="admin-product-cell">
        <button
          type="button"
          className="admin-product-card admin-product-card--add"
          onClick={startEdit}
        >
          <span className="admin-product-add-icon" aria-hidden="true">
            +
          </span>
          <span>Aggiungi vino</span>
        </button>
        {editModal}
      </li>
    );
  }

  // vista compatta: nome (mai compresso), meta, prezzo, azioni in fondo
  const meta = [wine.regione, wine.paese].filter(Boolean).join(" · ");
  const annate = wine.annate?.length
    ? wine.annate
    : wine.prezzo != null || wine.anno
      ? [{ anno: wine.anno, prezzo: wine.prezzo }]
      : [];
  const primary = annate[0];
  // il prezzo in tessera passa dallo stesso conto del sito pubblico, così
  // il negoziante vede in griglia esattamente quello che vede il cliente:
  // primo formato prezzato, zero e assente trattati allo stesso modo
  const prezzoCard = prezzoProdotto(wine);

  return (
    <li className="admin-product-cell">
      <div
        className={
          "admin-product-card" +
          (wine.consigliato ? " admin-product-card--consigliato" : "")
        }
      >
        <StellaConsigliato
          attivo={wine.consigliato}
          inCorso={flagging}
          onToggle={toggleConsigliato}
        />
        <span className="admin-product-name">{wine.name}</span>
        {meta && <span className="admin-product-meta">{meta}</span>}
        {prezzoCard != null && (
          <span className="admin-product-price">
            {primary?.anno && <span className="admin-product-price-year">{primary.anno} · </span>}
            € {prezzoCard}
            {annate.length > 1 && (
              <span className="admin-product-price-extra">+{annate.length - 1} annate</span>
            )}
          </span>
        )}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-product-icon-actions">
          <button
            type="button"
            className="admin-icon-btn"
            onClick={startEdit}
            aria-label="Modifica"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3z" />
            </svg>
          </button>
          <button
            type="button"
            className="admin-icon-btn admin-icon-btn--danger"
            onClick={handleDelete}
            aria-label="Elimina"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" />
            </svg>
          </button>
        </div>
      </div>
      {editModal}
    </li>
  );
}

export default AdminWineCard;
