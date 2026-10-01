import { useEffect, useId, useState } from "react";
import {
  createDistillato,
  updateDistillato,
  deleteDistillato,
  deleteDistillatoImage,
} from "../../services/distillati";
import { FORMATI_DISTILLATI, etichettaLitri, prezzoProdotto } from "../../utils/prezzo";
import { elencoFoto } from "../../utils/cloudinary";
import StellaConsigliato from "./StellaConsigliato";
import BottoneArchivio from "./BottoneArchivio";

// Il form dei distillati è quello dei vini (AdminWineCard.jsx), e ne ricalca
// anche la forma nel database (models/Distillato.js): annate → formati →
// prezzo, più foto con copertina, stella e descrizione. Le differenze:
//
// - l'ANNO non è obbligatorio. La gran parte dei distillati in etichetta non
//   ne ha uno; la riga senza anno è semplicemente "il prodotto" col suo prezzo.
// - il PAESE è facoltativo e si accende con una spunta, spenta sui prodotti
//   nuovi. Acceso, è testo libero con suggerimenti, non il menù chiuso dei
//   vini: lì ci sono i paesi del vino, e né la Scozia né la Giamaica ci stanno.
// - niente SPUNTA sul formato: il vino ha una bottiglia normale sottintesa
//   (0,75 L) che non si scrive, un distillato no. Ogni riga sceglie il suo
//   formato dal menù, e parte da 0,7 L, il più comune.
//
// Il prezzo in bianco vale zero come sui vini: il commento in testa ad
// AdminWineCard.jsx lo spiega una volta sola.

// suggerimenti del campo Paese: si sommano a quelli già usati nella categoria
// aperta (arrivano dal pannello), e il negozio può scriverne altri
const PAESI_SUGGERITI = [
  "Italia",
  "Scozia",
  "Irlanda",
  "Stati Uniti",
  "Giappone",
  "Francia",
  "Giamaica",
  "Cuba",
  "Guatemala",
  "Venezuela",
  "Barbados",
  "Martinica",
  "Repubblica Dominicana",
];

// la Regione si chiede solo per i prodotti italiani, come sui vini
const isItalia = (paese) => paese.trim().toLowerCase() === "italia";

const ML_STANDARD = 700;

// una riga salvata senza ml si apre sul formato standard (al 2026-09-30 in
// produzione non ce n'è: i due distillati hanno entrambi 500)
const toFormato = (ml, prezzo) => ({
  ml: ml ?? ML_STANDARD,
  prezzo: prezzo > 0 ? prezzo : "",
});

const formatoVuoto = () => ({ ml: ML_STANDARD, prezzo: "" });
const annataVuota = () => ({ anno: "", formati: [formatoVuoto()] });

// vedi opzioniMl in AdminWineCard.jsx: un valore salvato fuori elenco
// resta nel menù invece di cambiare di nascosto al primo salvataggio
const opzioniMl = (ml) => {
  const n = Number(ml);
  return Number.isFinite(n) && !FORMATI_DISTILLATI.includes(n)
    ? [...FORMATI_DISTILLATI, n].sort((a, b) => a - b)
    : FORMATI_DISTILLATI;
};

const toAnnata = (a) => ({
  anno: a.anno || "",
  formati: a.formati?.length
    ? a.formati.map((f) => toFormato(f.ml, f.prezzo))
    : [formatoVuoto()],
});

const toAnnate = (d) =>
  d?.annate?.length ? d.annate.map(toAnnata) : [annataVuota()];

// `conPaese` è la spunta del Paese: non sta nel database, si ricava dal paese
// che c'è. Spenta, al salvataggio paese e regione si svuotano
const toForm = (d) => ({
  name: d?.name || "",
  conPaese: Boolean(d?.paese?.trim()),
  regione: d?.regione || "",
  paese: d?.paese || "",
  img: elencoFoto(d),
  description: d?.description || "",
  annate: toAnnate(d),
});

const EMPTY_FORM = {
  name: "",
  conPaese: false,
  regione: "",
  paese: "",
  img: [],
  description: "",
  annate: [annataVuota()],
};


function AdminDistillatoCard({ distillato, categoryId, paesiNoti = [], onCreated, onUpdated, onDeleted }) {
  const isNew = !distillato;
  const paesiListId = useId();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(distillato));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [removingIndex, setRemovingIndex] = useState(null);
  const [flagging, setFlagging] = useState(false);
  const [archiviando, setArchiviando] = useState(false);

  const paesiOpzioni = [...new Set([...PAESI_SUGGERITI, ...paesiNoti])];

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // spegnendo la spunta il testo scritto resta nel form, così riaccenderla
  // lo ritrova; è il salvataggio che lo ignora
  const togglePaese = () => setForm((f) => ({ ...f, conPaese: !f.conPaese }));

  // la stella salva da sola, mandando SOLO `consigliato` (vedi AdminWineCard.jsx)
  const toggleConsigliato = async () => {
    setFlagging(true);
    setError("");
    try {
      onUpdated(await updateDistillato(distillato.id, { consigliato: !distillato.consigliato }));
    } catch (err) {
      setError(err.message);
    } finally {
      setFlagging(false);
    }
  };

  const updateAnnata = (index, field, value) => {
    setForm((f) => ({
      ...f,
      annate: f.annate.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
  };
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

  const addFormato = (index) =>
    mapFormati(index, (formati) => [...formati, formatoVuoto()]);

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

  // foto scelte lette come data URL e ACCODATE a quelle che ci sono già;
  // il perché di `Promise.all` sta in AdminWineCard.jsx
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
    e.target.value = "";
  };

  const portaInTesta = (index) =>
    setForm((f) => ({
      ...f,
      img: [f.img[index], ...f.img.filter((_, i) => i !== index)],
    }));

  const startEdit = () => {
    setForm(toForm(distillato));
    setRemovingIndex(null);
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(toForm(distillato));
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

    const numero = (v) => {
      const n = Number(v);
      return v !== "" && Number.isFinite(n) ? n : null;
    };

    // A differenza dei vini nessuna riga si scarta: senza spunta ogni riga
    // dice già qualcosa, il suo formato. Il prezzo in bianco vale zero
    const annate = form.annate.map((a) => {
      const formati = a.formati.map((f) => ({
        ml: numero(f.ml) ?? ML_STANDARD,
        prezzo: numero(f.prezzo) ?? 0,
      }));
      const anno = a.anno.trim();
      return { ...(anno && { anno }), formati };
    });

    // spunta spenta = nessun paese, qualunque cosa sia scritta nel campo
    const paese = form.conPaese ? form.paese.trim() : "";
    const payload = Object.fromEntries(
      Object.entries({
        name: form.name,
        paese,
        // la regione ha senso solo sui prodotti italiani: cambiando paese
        // quella vecchia non deve restare appesa al prodotto
        regione: isItalia(paese) ? form.regione.trim() : "",
        img: form.img,
        description: form.description,
      }).filter(([, v]) => v !== ""),
    );
    // in modifica un campo svuotato deve svuotarsi anche nel database: il PUT
    // fa `set(req.body)`, e una chiave assente lascerebbe il vecchio valore
    if (!isNew) {
      for (const campo of ["paese", "regione", "description"]) {
        if (!(campo in payload)) payload[campo] = "";
      }
    }
    payload.annate = annate;
    // `consigliato` non passa di qui: lo governa solo la stella in griglia

    try {
      if (isNew) {
        const created = await createDistillato({ ...payload, category: categoryId });
        onCreated(created);
        setForm(EMPTY_FORM);
        setEditing(false);
      } else {
        const updated = await updateDistillato(distillato.id, payload);
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
    if (!window.confirm(`Eliminare "${distillato.name}"?`)) return;
    setError("");
    try {
      await deleteDistillato(distillato.id);
      onDeleted(distillato.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // vedi AdminWineCard: fuori dal sito e dalla griglia, ripristinabile
  // dalla sezione Archivio
  const handleArchivia = async () => {
    setArchiviando(true);
    setError("");
    try {
      await updateDistillato(distillato.id, { archiviato: true });
      onDeleted(distillato.id);
    } catch (err) {
      setError(err.message);
      setArchiviando(false);
    }
  };

  // rimuove UNA foto; l'indice da mandare al server si ritrova dall'URL
  // (vedi handleDeleteImage in AdminWineCard.jsx)
  const handleDeleteImage = async (index) => {
    const url = form.img[index];
    const togliDalForm = () =>
      setForm((f) => ({ ...f, img: f.img.filter((_, i) => i !== index) }));

    if (isNew || url.startsWith("data:")) {
      togliDalForm();
      return;
    }

    const indiceSulServer = elencoFoto(distillato).indexOf(url);
    if (indiceSulServer === -1) {
      togliDalForm();
      return;
    }

    if (!window.confirm("Eliminare l'immagine in modo permanente?")) return;
    setError("");
    try {
      const updated = await deleteDistillatoImage(distillato.id, indiceSulServer);
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
          {isNew ? "Aggiungi distillato" : `Modifica "${distillato.name}"`}
        </h3>

        <div className="admin-field">
          <label>Nome</label>
          <input type="text" value={form.name} onChange={handleChange("name")} required autoFocus />
        </div>
        {/* la spunta fa da etichetta del campo: spenta, il prodotto si salva
            senza paese (e senza regione) */}
        <div className="admin-field">
          <label
            className={
              "admin-annata-check" + (form.conPaese ? " admin-annata-check--attiva" : "")
            }
            title={form.conPaese ? "Togli la spunta per salvare senza paese" : "Spunta per indicare il paese"}
          >
            <input type="checkbox" checked={form.conPaese} onChange={togglePaese} />
            <span className="admin-annata-check-box" aria-hidden="true">
              ✓
            </span>
            <span className="admin-annata-check-text">Paese</span>
          </label>
          {form.conPaese && (
            <>
              <input
                type="text"
                className="admin-field--enter"
                list={paesiListId}
                placeholder="Es. Scozia"
                aria-label="Paese"
                value={form.paese}
                onChange={handleChange("paese")}
              />
              <datalist id={paesiListId}>
                {paesiOpzioni.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </>
          )}
        </div>
        {form.conPaese && isItalia(form.paese) && (
          <div className="admin-field admin-field--enter">
            <label>Regione</label>
            <input type="text" value={form.regione} onChange={handleChange("regione")} />
          </div>
        )}

        <div className="admin-field">
          <label>Prezzi</label>
          <p className="admin-hint">
            Un prezzo per riga. L'<strong>anno</strong> è facoltativo: scrivilo
            solo se in etichetta c'è un'annata. Per ogni riga scegli il{" "}
            <strong>formato</strong>, da 0,35 a 1,5 L. Il prezzo lasciato in
            bianco vale zero e sul sito non compare.
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
                <div className="admin-annata-testa">
                  <div className="admin-field">
                    <input
                      type="text"
                      placeholder="Anno (facoltativo)"
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

                <div className="admin-formati-list">
                  {annata.formati.map((f, j) => (
                    <div className="admin-formato-row" key={j}>
                      <div className="admin-field">
                        <select
                          value={f.ml}
                          title="Formato della bottiglia"
                          aria-label="Formato"
                          onChange={(e) => updateFormato(i, j, "ml", e.target.value)}
                        >
                          {opzioniMl(f.ml).map((ml) => (
                            <option key={ml} value={ml}>
                              {etichettaLitri(ml)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="admin-field">
                        <input
                          type="number"
                          step="0.01"
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
          <button type="button" className="admin-annata-add" onClick={addAnnata}>
            + Aggiungi annata
          </button>
        </div>

        <div className="admin-field">
          <label>Immagini</label>
          <input type="file" accept="image/*" multiple onChange={handleImageFile} />
          {form.img.length > 0 && (
            <>
              <ul className="admin-image-list">
                {form.img.map((src, i) => (
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

  // tessera "+ Aggiungi distillato": tocco solo per aprire il dialogo vuoto
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
          <span>Aggiungi distillato</span>
        </button>
        {editModal}
      </li>
    );
  }

  // vista compatta, come la tessera dei vini
  const meta = [distillato.regione, distillato.paese].filter(Boolean).join(" · ");
  const annate = distillato.annate ?? [];
  const primary = annate[0];
  const prezzoCard = prezzoProdotto(distillato);

  return (
    <li className="admin-product-cell">
      <div
        className={
          "admin-product-card" +
          (distillato.consigliato ? " admin-product-card--consigliato" : "")
        }
      >
        <StellaConsigliato
          attivo={distillato.consigliato}
          inCorso={flagging}
          onToggle={toggleConsigliato}
        />
        <span className="admin-product-name">{distillato.name}</span>
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
          <BottoneArchivio inCorso={archiviando} onClick={handleArchivia} />
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

export default AdminDistillatoCard;
