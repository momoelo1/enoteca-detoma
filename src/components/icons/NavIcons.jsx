// Icone della tab bar: set Phosphor, peso "thin" (licenza MIT, uso
// commerciale libero). Sostituiscono le emoji che stavano in SECTIONS.
//
// Per aggiungere una voce: importa l'icona e registrala in NAV_ICONS con
// la stessa chiave dell'`id` usato in SECTIONS (data.js).
import { House, Wine, ForkKnife, Gift, MapPin } from "@phosphor-icons/react";

// size 100%: la misura vera la decide il CSS (.nav-icon svg), così la
// tab bar resta l'unico posto dove si regolano le dimensioni
const iconProps = { size: "100%", weight: "thin", color: "currentColor" };

// chiave = SECTIONS[].id in data.js
const NAV_ICONS = {
  home: () => <House {...iconProps} />,
  enoteca: () => <Wine {...iconProps} />,
  // "Alimentari" tiene insieme Gastronomia (salato) e Dolceria (dolce):
  // le posate coprono entrambe, un formaggio o una torta solo metà
  alimentari: () => <ForkKnife {...iconProps} />,
  confezioni: () => <Gift {...iconProps} />,
  "dove siamo": () => <MapPin {...iconProps} />,
};

// mappamondo del pulsante "Mondo" nella barra regioni (Enoteca.jsx):
// disegnato a mano perché sta in una barra con etichette di testo, non
// nella tab bar, e segue lo stile degli altri SVG interni (imbuto, lente)
export function GlobeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="8.8" />
      <path d="M3.2 12h17.6" />
      <path d="M12 3.2c2.5 2.4 3.9 5.6 3.9 8.8s-1.4 6.4-3.9 8.8c-2.5-2.4-3.9-5.6-3.9-8.8S9.5 5.6 12 3.2z" />
    </svg>
  );
}

export default function NavIcon({ id }) {
  const Icon = NAV_ICONS[id];
  return Icon ? <Icon /> : null;
}
