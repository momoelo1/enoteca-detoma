// Il filtro che sbrindella il bordo della macchia di vino delle mini-card:
// un rumore che sposta i pixel del disco mentre cresce (l'effetto è in
// effetti.js, il disegno in effetti.css). Serve SOLO alla macchia — le
// bollicine e la colatura non passano di qui.
//
// Va montato una volta sola in pagina — lo fa App.jsx. Il CSS lo chiama per
// id (`filter: url(#macchia-bordo)`), quindi basta che esista nel documento,
// ovunque sia: l'SVG qui sotto è largo zero e non si vede.
function FiltroMacchia() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <filter id="macchia-bordo" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.09"
          numOctaves="3"
          seed="7"
        />
        <feDisplacementMap
          in="SourceGraphic"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

export default FiltroMacchia;
