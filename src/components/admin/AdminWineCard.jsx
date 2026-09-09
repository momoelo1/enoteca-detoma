import { useEffect, useState } from "react";
import { createWine, updateWine, deleteWine, deleteWineImage } from "../../services/wines";
import { COUNTRY_GROUPS } from "../../data/data";
import { ML_NOTI, etichettaFormato, prezzoProdotto } from "../../utils/prezzo";
import { elencoFoto } from "../../utils/cloudinary";
import StellaConsigliato from "./StellaConsigliato";


const FOREIGN_COUNTRIES = Object.keys(COUNTRY_GROUPS);


// Il form rispecchia la forma del database (models/Wine.js): un'annata
// contiene i suoi formati, e il prezzo sta sul formato — lo stesso anno può
// vendersi in bottiglia e in magnum a due prezzi diversi.
//
// `conMl` è la spunta del formato: accesa, la riga porta un formato scelto
// dal menù (mezza bottiglia, magnum...); spenta, è la bottiglia normale e nel
// database `ml` non c'è proprio. Non sta nel database — si ricava dal ml che
// c'è, e ridiventa un ml quando si salva.
//
// Il prezzo non si spunta e non si obbliga: lasciato in bianco vale ZERO
// (models/Wine.js), che il sito legge già come prezzo assente e mostra "—"
// (prezzoProdotto in utils/prezzo.js). Nell'altro verso vale lo stesso: uno
// zero salvato riapre come casella vuota, non come "gratis" — sono le schede
// mai prezzate, 56 vini su 533 in produzione al 2026-08-26.
const toFormato = (ml, prezzo) => ({
  ml: ml ?? "",
  prezzo: prezzo > 0 ? prezzo : "",
  conMl: ml != null && ml !== "",
});

// nuovi vuoti: spunta spenta, perché il caso normale è la bottiglia normale.
// Sono funzioni e non costanti condivise: due righe vuote nello stesso form
// devono essere due oggetti distinti.
const formatoVuoto = () => ({ ml: "", prezzo: "", conMl: false });
const annataVuota = () => ({ anno: "", formati: [formatoVuoto()] });

// il formato di ripiego: spuntando la casella il menù si posiziona già sulla
// bottiglia normale, e chi salva senza toccarlo salva quella. Un menù aperto
// sul niente costringeva a una scelta in più per il caso più comune.
const ML_BOTTIGLIA = 750;

// le voci del menù dei formati: quelle note (ML_NOTI in utils/prezzo.js) più
// — se c'è — il valore già salvato sul vino ma fuori elenco. Il campo prima
// era libero: un menù che non contiene il valore corrente lo cambierebbe di
// nascosto al primo salvataggio.
const opzioniMl = (ml) => {
  const n = Number(ml);
  return ml !== "" && Number.isFinite(n) && !ML_NOTI.includes(n)
    ? [...ML_NOTI, n].sort((a, b) => a - b)
    : ML_NOTI;
};

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
  // un vino può avere più foto (backend: models/Wine.js). `elencoFoto` regge
  // sia l'array sia la vecchia stringa singola dei vini non ancora risalvati,
  // e butta i vuoti — qui dentro `img` è SEMPRE un array.
  img: elencoFoto(wine),
  description: wine?.description || "",
  annate: toAnnate(wine),
});

const EMPTY_FORM = {
  name: "",
  regione: "",
  paese: "",
  img: [],
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

  // togliendo la spunta il ml si svuota subito: lasciarlo scelto sotto un
  // menù disabilitato farebbe credere che venga salvato lo stesso. Mettendola,
  // il menù parte dalla bottiglia normale invece che dal vuoto
  const toggleMl = (index, fIndex) =>
    mapFormati(index, (formati) =>
      formati.map((row, j) =>
        j === fIndex
          ? {
              ...row,
              conMl: !row.conMl,
              ml: row.conMl ? "" : row.ml || ML_BOTTIGLIA,
            }
          : row,
      ),
    );

  const addFormato = (index) =>
    mapFormati(index, (formati) => [...formati, formatoVuoto()]);

  // l'ultima riga non si toglie: un'annata senza formati non avrebbe dove
  // tenere il prezzo. Si svuota, e resta una riga da riempire
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

  // Legge i file scelti e li tiene come data URL: nessun upload separato da
  // gestire, ma i documenti diventano più pesanti — va bene per ora, un
  // hosting immagini vero resta un passo futuro.
  //
  // Se ne possono scegliere più d'uno in un colpo solo, e si AGGIUNGONO a
  // quelle che già ci sono invece di sostituirle: aggiungere la seconda foto a
  // un vino fotografato è il gesto normale, e se il campo si svuotasse ogni
  // volta bisognerebbe ricaricarle tutte insieme ogni volta.
  //
  // `Promise.all` e non un `onload` che accoda: due letture in volo che fanno
  // ognuna `setForm(f => [...f.img, sua])` partono dallo stesso stato e la
  // seconda cancella la prima. Si aspetta che siano pronte tutte e si accodano
  // in un aggiornamento solo, nell'ordine in cui sono state scelte.
  const handleImageFile = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const letti = await Promise.all(
      files.map(
        (file) =>
          new Promise((risolvi) => {
            const reader = new FileReader();
            reader.onload = () => risolvi(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );
    setForm((f) => ({ ...f, img: [...f.img, ...letti] }));
    // così riscegliere lo stesso file subito dopo riparte davvero: senza,
    // l'input non emette `change` perché il valore non è cambiato
    e.target.value = "";
  };

  // La prima foto è quella che si vede sulla card in catalogo e nella fascia
  // della home: le altre si vedono solo nella scheda, a turno. Quindi
  // scegliere la copertina serve, e senza questo bottone l'unico modo sarebbe
  // cancellare e ricaricare tutto nell'ordine giusto.
  const portaInTesta = (index) =>
    setForm((f) => ({
      ...f,
      img: [f.img[index], ...f.img.filter((_, i) => i !== index)],
    }));

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

    // Sul `ml` la chiave è assente, non zero: una riga senza spunta parte
    // SENZA `ml` — è la bottiglia normale. Non `null`, che Mongoose
    // rifiuterebbe come non numerico: la chiave proprio non c'è.
    const numero = (v) => {
      const n = Number(v);
      return v !== "" && Number.isFinite(n) ? n : null;
    };

    const annate = form.annate
      .map((a) => {
        const formati = a.formati
          // una riga mai toccata — niente formato e niente prezzo — non dice
          // niente e si scarta: è così che un vino ancora da prezzare si salva
          // lo stesso, con la sola annata
          .filter((f) => f.conMl || f.prezzo !== "")
          .map((f) => ({
            // spuntata ma col menù mai aperto: vale la bottiglia normale
            ...(f.conMl && { ml: numero(f.ml) ?? ML_BOTTIGLIA }),
            // prezzo in bianco = zero, che il sito mostra come "—"
            prezzo: numero(f.prezzo) ?? 0,
          }));
        return { anno: a.anno, ...(formati.length > 0 && { formati }) };
      })
      // si scarta solo ciò che non dice niente. Il filtro sta DOPO la mappa
      // perché su champagne l'anno è sempre "": un'annata con tutte le righe
      // ancora da prezzare resterebbe vuota del tutto
      .filter((a) => a.anno !== "" || a.formati?.length > 0);

    const payload = Object.fromEntries(
      Object.entries({
        name: form.name,
        // la regione si ripulisce QUI, prima di partire: uno spazio finale
        // battuto per sbaglio ("Piemonte ") crea una regione gemella, e il
        // filtro del pannello ne fa due bottoni identici a vista con dentro
        // metà vini per uno. Il filtro ora fa il trim per conto suo
        // (WineManager.jsx), ma questo chiude il rubinetto invece di
        // rincorrere il sintomo. Il campo è libero apposta — le regioni non
        // sono un elenco chiuso — quindi lo sbaglio è sempre possibile
        regione: form.regione.trim(),
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

  // Rimuove UNA foto: se è già caricata su Cloudinary (vino salvato) la
  // cancella davvero anche lato storage, non solo il riferimento; se è solo
  // un'anteprima locale non ancora salvata basta toglierla dal form.
  //
  // L'indice da mandare al backend NON è quello del form: dentro il form
  // possono esserci anteprime nuove non ancora salvate, e l'ordine può essere
  // stato cambiato con "Copertina" senza aver ancora salvato. Quello che conta
  // è la posizione nell'elenco che il server ha ADESSO, e la si ritrova
  // dall'URL.
  const handleDeleteImage = async (index) => {
    const url = form.img[index];
    const togliDalForm = () =>
      setForm((f) => ({ ...f, img: f.img.filter((_, i) => i !== index) }));

    if (isNew || url.startsWith("data:")) {
      togliDalForm();
      return;
    }

    const indiceSulServer = elencoFoto(wine).indexOf(url);
    if (indiceSulServer === -1) {
      // in archivio non c'è: non c'è niente da cancellare lato storage
      togliDalForm();
      return;
    }

    if (!window.confirm("Eliminare l'immagine in modo permanente?")) return;
    setError("");
    try {
      const updated = await deleteWineImage(wine.id, indiceSulServer);
      onUpdated(updated);
      togliDalForm();
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
          {/* la regola importante ("senza spunta = bottiglia normale") va
              detta una volta qui: nella riga non c'è posto per scriverla */}
          <p className="admin-hint">
            Un prezzo per riga. Senza spunta la riga è la{" "}
            <strong>bottiglia normale</strong>; metti la spunta{" "}
            <strong>Formato</strong> per mezze bottiglie e magnum e scegli
            quale. Il prezzo lasciato in bianco vale zero e sul sito non
            compare.
          </p>

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
                      {/* la spunta accende il formato di QUESTA riga: spenta
                          è la bottiglia normale, che nel database non porta
                          nessun ml — nessuno scrive 750 su cinquecento vini */}
                      <label
                        className={
                          "admin-annata-check" +
                          (f.conMl ? " admin-annata-check--attiva" : "")
                        }
                        title={
                          f.conMl
                            ? "Formato fuori misura — togli la spunta per la bottiglia normale"
                            : "Bottiglia normale — spunta per scegliere un altro formato"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={f.conMl}
                          onChange={() => toggleMl(i, j)}
                        />
                        <span className="admin-annata-check-box" aria-hidden="true">
                          ✓
                        </span>
                        <span className="admin-annata-check-text">Formato</span>
                      </label>
                      {/* il negozio ragiona per nome ("Magnum"), non per
                          numero, ma nel database va il numero: il menù mostra
                          i nomi e salva i ml */}
                      <div className="admin-field">
                        <select
                          value={f.ml}
                          disabled={!f.conMl}
                          title="Formato della bottiglia. Senza spunta vale la bottiglia normale da 750 ml."
                          onChange={(e) => updateFormato(i, j, "ml", e.target.value)}
                        >
                          {/* si vede solo a spunta spenta, dove il menù è
                              disabilitato: una riga spuntata parte già sulla
                              bottiglia normale e non torna mai qui */}
                          <option value="" disabled>
                            Formato
                          </option>
                          {opzioniMl(f.ml).map((ml) => (
                            <option key={ml} value={ml}>
                              {etichettaFormato(ml, { sempre: true })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="admin-field">
                        <input
                          type="number"
                          step="0.01"
                          /* campo stretto: il segnaposto lungo veniva
                             tagliato. Mai obbligatorio: in bianco vale zero,
                             cioè "lo teniamo, il prezzo non è ancora qui" */
                          placeholder="Prezzo €"
                          value={f.prezzo}
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
          <label>Immagini</label>
          <input type="file" accept="image/*" multiple onChange={handleImageFile} />
          {form.img.length > 0 && (
            <>
              <ul className="admin-image-list">
                {form.img.map((src, i) => (
                  // la chiave è l'URL: gli indici cambiano quando si sposta una
                  // foto in testa, e React riuserebbe l'anteprima sbagliata
                  <li key={src} className="admin-image-preview-wrap">
                    <img src={src} alt="" className="admin-image-preview" />
                    {i === 0 ? (
                      <span className="admin-image-copertina">Copertina</span>
                    ) : (
                      <button
                        type="button"
                        className="admin-image-promuovi"
                        onClick={() => portaInTesta(i)}
                        title="Usa come copertina"
                      >
                        Copertina
                      </button>
                    )}
                    <button
                      type="button"
                      className="admin-image-remove"
                      onClick={() => handleDeleteImage(i)}
                      aria-label={`Rimuovi immagine ${i + 1}`}
                      title="Rimuovi immagine"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h8l1-13" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="admin-image-nota">
                {form.img.length === 1
                  ? "Una foto sola: si vede sulla card e nella scheda."
                  : `${form.img.length} foto: sulla card si vede la copertina, nella scheda scorrono tutte.`}
              </p>
            </>
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
