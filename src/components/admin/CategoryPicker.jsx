import "./admin.css";

// Navigazione categorie, generica e riusabile: riceve {id,label,accent}[],
// una selezione attiva e un callback — pensata per qualunque tipo di
// prodotto (vini oggi, birre/distillati/alimentari in futuro). Diventa
// una sidebar verticale su schermi larghi e una barra orizzontale su
// telefono, via CSS: stesso markup ovunque.
function CategoryPicker({ categories, activeId, onSelect }) {
  return (
    <nav className="admin-nav" aria-label="Categorie">
      <ul className="admin-nav-list">
        {categories.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={"admin-nav-btn" + (c.id === activeId ? " is-active" : "")}
              style={{ "--accent": c.accent }}
              onClick={() => onSelect(c.id)}
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CategoryPicker;
