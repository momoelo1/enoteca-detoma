import { useEffect, useLayoutEffect, useRef, useState } from "react";

// <img> che compare in dissolvenza quando i byte sono arrivati, invece di
// scattare da vuoto a piena. È il rimedio alle foto `loading="lazy"` del
// catalogo, delle mini-card e della fascia in home, che entrano in vista già
// mentre si scorre: senza, ogni foto "schiocca" quando finisce di scaricarsi.
//
// Lo stile è IN LINEA di proposito. L'opacità di riposo non è la stessa
// ovunque (1 sulle foto, 0.75 sulle illustrazioni in filigrana — vedi
// mini-switcher.css) e una classe con `opacity: 1` batterebbe quelle regole o
// ne verrebbe battuta a seconda dell'ordine dei .css: la trappola della
// cascata annotata in CLAUDE.md. Qui si impone lo 0 mentre si aspetta e poi
// si TOGLIE l'inline: torna il valore del foglio di stile, qualunque sia, e
// la transizione parte da 0 verso quello.
//
// Tre stati, non due: una foto già in cache è `complete` prima ancora che
// React abbia finito di montarla, quindi si legge quello invece di aspettare
// un `load` che potrebbe essere già passato — e si mostra SUBITO, senza
// dissolvenza, perché non c'è stata nessuna attesa da coprire.
//
// IN ANTICIPO. Con `loading="lazy"` il momento di scaricare lo sceglie il
// browser, e Safari su iPhone parte quando la foto è ormai al bordo dello
// schermo: scorrendo le bottiglie si vedevano comparire una a una. Qui
// `loading="lazy"` vuol dire invece "aspetta finché non è VICINA", e quanto
// vicina lo decidiamo noi, uguale su tutti i browser: tre volte l'altezza del
// contenitore che scorre (`ANTICIPO`), nei due versi di scorrimento. Finché è
// lontana l'<img> non ha `src` — il riquadro c'è, il download no — e appena
// entra nel raggio prende il suo `src` e si scarica subito.
// Le foto oltre il raggio aspettano ancora, di proposito: caricarle tutte
// insieme vorrebbe dire decomprimerne centinaia in memoria, che è proprio ciò
// che fa chiudere la scheda a Safari (vedi ALTEZZA_MAX in utils/cloudinary.js).
//
// Perché 300% e non meno, misurato il 2026-10-05 sul catalogo vero (telefono,
// Cloudinary già caldo): la lista dei vini scorre dentro `.product-list`, alta
// 377px su 664 di schermo, quindi il 150% voleva dire appena due file di card
// d'anticipo. Scorrendo a 1400 px/s erano pronte all'ingresso 57 foto su 92
// (le altre ancora in download, nessuna "partita tardi"), a 700 px/s 103 su
// 122. Col 300%: 90/92 e 116/122, al costo di 4 foto in più scaricate
// all'apertura (12 invece di 8).
const ANTICIPO = "300%";

// Il contenitore che scorre davvero. L'osservatore deve guardare QUELLO e non
// la finestra: una foto dentro una fascia che scorre di lato (i consigli in
// home) è ritagliata dalla fascia, e misurata sulla finestra risulterebbe
// "lontana" fino all'ultimo momento, qualunque anticipo si dia.
const contenitoreCheScorre = (el) => {
  for (let p = el?.parentElement; p && p !== document.body; p = p.parentElement) {
    const s = getComputedStyle(p);
    if (/(auto|scroll|overlay)/.test(s.overflowX + s.overflowY)) return p;
  }
  return null; // scorre la pagina: la finestra va bene
};

function Immagine({ style, onLoad, loading, ...props }) {
  const ref = useRef(null);
  // "attesa" (invisibile) → "sfuma" (arrivata adesso: dissolvenza) oppure
  // "subito" (era già in cache, o le animazioni sono ridotte: nessuna)
  const [stato, setStato] = useState("attesa");

  // vicina = può scaricarsi. Subito vera se non è pigra, o se il browser non
  // ha IntersectionObserver (meglio scaricare tutto che non mostrare niente)
  const pigra = loading === "lazy";
  const [vicina, setVicina] = useState(
    () => !pigra || typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (vicina) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (voci) => {
        if (voci.some((v) => v.isIntersecting)) {
          setVicina(true);
          io.disconnect();
        }
      },
      { root: contenitoreCheScorre(el), rootMargin: ANTICIPO },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [vicina]);

  // un altro src sulla stessa immagine riparte dall'attesa: è il modo che
  // React documenta per correggere uno stato quando cambia una prop
  const [srcVisto, setSrcVisto] = useState(props.src);
  if (srcVisto !== props.src) {
    setSrcVisto(props.src);
    setStato("attesa");
  }

  // anche quando diventa `vicina`: è lì che una foto pigra riceve il suo
  // `src`, e se era già in cache va mostrata subito come le altre
  useLayoutEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth > 0) setStato("subito");
  }, [props.src, vicina]);

  const arrivata = (e) => {
    const fermo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStato(fermo ? "subito" : "sfuma");
    onLoad?.(e);
  };

  const inLinea =
    stato === "attesa"
      ? { opacity: 0 }
      : stato === "sfuma"
        ? { transition: "opacity 0.3s ease" }
        : null;

  return (
    <img
      ref={ref}
      {...props}
      // lontana: niente `src`, quindi niente download (e niente `load`, così
      // resta in "attesa", invisibile). Vicina: `src` e download immediato —
      // niente `loading="lazy"`, o Safari tornerebbe a rimandarlo
      src={vicina ? props.src : undefined}
      onLoad={arrivata}
      style={inLinea ? { ...style, ...inLinea } : style}
    />
  );
}

export default Immagine;
