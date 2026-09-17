import { useLayoutEffect, useRef, useState } from "react";

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
function Immagine({ style, onLoad, ...props }) {
  const ref = useRef(null);
  // "attesa" (invisibile) → "sfuma" (arrivata adesso: dissolvenza) oppure
  // "subito" (era già in cache, o le animazioni sono ridotte: nessuna)
  const [stato, setStato] = useState("attesa");

  // un altro src sulla stessa immagine riparte dall'attesa: è il modo che
  // React documenta per correggere uno stato quando cambia una prop
  const [srcVisto, setSrcVisto] = useState(props.src);
  if (srcVisto !== props.src) {
    setSrcVisto(props.src);
    setStato("attesa");
  }

  useLayoutEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth > 0) setStato("subito");
  }, [props.src]);

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
      onLoad={arrivata}
      style={inLinea ? { ...style, ...inLinea } : style}
    />
  );
}

export default Immagine;
