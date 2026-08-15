import { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import logo from "./images/enoteca-detoma-logo.webp";
import Grainient from "./components/background/Grainient";
import { TINTA_BASE } from "./components/background/tinta";
import Versata from "./components/transition/Versata";
import Home from "./components/home/Home";
import Enoteca from "./components/enoteca/Enoteca";
import Gastronomia from "./components/gastronomia/Gastronomia";
import Login from "./components/login/Login";
import Info from "./components/info/Info";
import NavIcon from "./components/icons/NavIcons";
import { SECTIONS } from "./data/data";

const SECTION_PATHS = {
  home: "/",
  enoteca: "/enoteca",
  alimentari: "/alimentari",
  confezioni: "/confezioni",
  info: "/info",
};

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const tapCountRef = useRef(0); 
  const lastTapRef = useRef(0);


  const handleLogoClick = () => {
    const now = Date.now();
    tapCountRef.current =
      now - lastTapRef.current < 600 ? tapCountRef.current + 1 : 1;
    lastTapRef.current = now;
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {/* `tintaCondivisa`: i colori non stanno più qui ma in
          background/tinta.js, perché li cambia la categoria che si sta
          guardando — e devono cambiare insieme a quelli della seconda
          istanza montata dalla pagina Info */}
      <div className="app-bg" aria-hidden="true">
        <Grainient
          color1={TINTA_BASE[0]}
          color2={TINTA_BASE[1]}
          color3={TINTA_BASE[2]}
          tintaCondivisa
          timeSpeed={0.9}
          grainAmount={0.09}
          contrast={1.15}
          saturation={0.95}
        />
      </div>

      <header className="site-header">
        <img
          src={logo}
          alt="Enoteca de Toma"
          className="site-logo"
          onClick={handleLogoClick}
        />

        <nav className="site-nav">
          {SECTIONS.map((s) => {
            const to = SECTION_PATHS[s.id] || "/";
            // "attivo" anche sulle sotto-pagine (es. /enoteca/vini/rossi),
            // non solo su un match esatto del percorso
            const active =
              location.pathname === to ||
              (to !== "/" && location.pathname.startsWith(to + "/"));
            return (
              <Link
                key={s.id}
                to={to}
                className={"nav-btn" + (active ? " is-active" : "")}
              >
                <span className="nav-icon" aria-hidden="true">
                  <NavIcon id={s.id} />
                </span>
                <span className="nav-label--full">{s.label}</span>
                <span className="nav-label--short">{s.short || s.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enoteca" element={<Enoteca />} />
          {/* la selezione della casa è l'unica tab dell'Enoteca che vive
              nell'URL (le altre restano stato locale): è quella che ha
              senso mandare a qualcuno per messaggio. Dichiarate PRIMA delle
              rotte con :groupId/:categoryId — un segmento fisso vince
              comunque su uno dinamico, ma qui si legge anche l'intenzione */}
          <Route path="/enoteca/consigliati" element={<Enoteca consigliati />} />
          <Route
            path="/enoteca/consigliati/:productId"
            element={<Enoteca consigliati />}
          />
          <Route path="/enoteca/:groupId/:categoryId" element={<Enoteca />} />
          <Route
            path="/enoteca/:groupId/:categoryId/:productId"
            element={<Enoteca />}
          />
          <Route path="/alimentari" element={<Gastronomia />} />
          {/* come per l'Enoteca: la selezione della casa vive nell'URL, ed è
              dichiarata prima delle rotte con :reparto/:groupId — un segmento
              fisso vince comunque su uno dinamico, ma così si legge anche
              l'intenzione. Serve a `/alimentari/consigliati/<id>`, che
              altrimenti finirebbe su :reparto/:groupId */}
          <Route
            path="/alimentari/consigliati"
            element={<Gastronomia consigliati />}
          />
          <Route
            path="/alimentari/consigliati/:productId"
            element={<Gastronomia consigliati />}
          />
          <Route path="/alimentari/:reparto/:groupId" element={<Gastronomia />} />
          <Route
            path="/alimentari/:reparto/:groupId/:productId"
            element={<Gastronomia />}
          />
          <Route path="/admin" element={<Login onBack={() => navigate("/")} />} />
          <Route path="/info" element={<Info />} />
          <Route path="/dove-siamo" element={<Navigate to="/info" replace />} />
          <Route path="/confezioni" element={null} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* l'onda colorata delle transizioni di categoria: un solo pannello per
          tutta l'app, lo comandano le pagine con versa() */}
      <Versata />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
