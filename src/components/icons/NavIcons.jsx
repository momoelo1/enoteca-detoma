import { House, Wine, ForkKnife, Gift, Info } from "@phosphor-icons/react";


const iconProps = { size: "100%", weight: "thin", color: "currentColor" };

// chiave = SECTIONS[].id in data.js
const NAV_ICONS = {
  home: () => <House {...iconProps} />,
  enoteca: () => <Wine {...iconProps} />,
  // "Alimentari" tiene insieme Gastronomia (salato) e Dolceria (dolce):
  // le posate coprono entrambe, un formaggio o una torta solo metà
  alimentari: () => <ForkKnife {...iconProps} />,
  confezioni: () => <Gift {...iconProps} />,
  info: () => <Info {...iconProps} />,
};

export default function NavIcon({ id }) {
  const Icon = NAV_ICONS[id];
  return Icon ? <Icon /> : null;
}
