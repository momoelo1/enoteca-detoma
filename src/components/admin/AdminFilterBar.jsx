import { useEffect, useRef, useState } from "react";
import "../enoteca/enoteca.css";
import "./admin.css";

// Barra filtri del pannello admin: stessa coppia di bottoni "Cerca" /
// "Regioni" della pagina Enoteca pubblica (icona lente/imbuto, pillola
// verde quando attiva), adattata al layout admin (niente bottom sheet
// da telefono: qui la barra regioni resta una riga di pillole in flusso).
function AdminFilterBar({
  query,
  onQueryChange,
  searchPlaceholder = "Cerca per nome…",
  canSearch = true,
  filterValues,
  filterLabel = "Regioni",
  activeFilter,
  onFilterChange,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchRef = useRef(null);

  const hasFilter = Boolean(filterValues && filterValues.length >= 2);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const closeSearch = () => {
    onQueryChange("");
    setSearchOpen(false);
  };
  const toggleSearch = () => (searchOpen ? closeSearch() : setSearchOpen(true));
  const toggleFilter = () => setFilterOpen((o) => !o);

  if (!canSearch && !hasFilter) return null;

  return (
    <>
      <div className="admin-filter-actions">
        {canSearch && (
          <button
            type="button"
            className={"filter-toggle" + (searchOpen ? " is-active" : "")}
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-label="Cerca"
          >
            <svg className="filter-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 3a7 7 0 015.29 11.6l4.55 4.56-1.42 1.41-4.55-4.55A7 7 0 1110 3zm0 2a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
            <span className="filter-toggle-text">{query || "Cerca"}</span>
          </button>
        )}
        {hasFilter && (
          <button
            type="button"
            className={"filter-toggle" + (filterOpen ? " is-active" : "")}
            onClick={toggleFilter}
            aria-expanded={filterOpen}
            aria-label={`Filtra per ${filterLabel.toLowerCase()}`}
          >
            <svg className="filter-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
            </svg>
            <span className="filter-toggle-text">{activeFilter || filterLabel}</span>
          </button>
        )}
      </div>

      {searchOpen && (
        <div className="search-field">
          <svg className="search-field-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 3a7 7 0 015.29 11.6l4.55 4.56-1.42 1.41-4.55-4.55A7 7 0 1110 3zm0 2a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            className="search-field-input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <button
            type="button"
            className="search-field-close"
            onClick={closeSearch}
            aria-label="Chiudi la ricerca"
          >
            ✕
          </button>
        </div>
      )}

      {filterOpen && hasFilter && (
        <nav className="filter-bar admin-filter-bar" aria-label={`Filtra per ${filterLabel.toLowerCase()}`}>
          <button
            type="button"
            className={"filter-btn" + (!activeFilter ? " is-active" : "")}
            onClick={() => onFilterChange(null)}
          >
            <span className="filter-label">Tutti</span>
          </button>
          {filterValues.map((v) => (
            <button
              key={v}
              type="button"
              className={"filter-btn" + (activeFilter === v ? " is-active" : "")}
              onClick={() => onFilterChange(v)}
            >
              <span className="filter-label">{v}</span>
            </button>
          ))}
        </nav>
      )}
    </>
  );
}

export default AdminFilterBar;
