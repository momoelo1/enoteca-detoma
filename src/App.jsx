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
import logo from "./images/enoteca-detoma-logo.png";
import Grainient from "./components/background/Grainient";
import Home from "./components/home/Home";
import Enoteca from "./components/enoteca/Enoteca";
import Gastronomia from "./components/gastronomia/Gastronomia";
import Login from "./components/login/Login";
import { SECTIONS } from "./data/data";

// un indirizzo fisso per ogni sezione: al refresh o su un link diretto
// si resta sulla pagina giusta, invece di ripartire sempre dalla home
const SECTION_PATHS = {
  home: "/",
  enoteca: "/enoteca",
  alimentari: "/alimentari",
  confezioni: "/confezioni",
  "dove siamo": "/dove-siamo",
};

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const tapCountRef = useRef(0); // tocchi ravvicinati sul logo
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
      <div className="app-bg" aria-hidden="true">
        <Grainient
          color1="#f6f1e7"
          color2="#bcd9c3"
          color3="#5d8a6f"
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
                  {s.icon}
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
          {/* stessa pagina per tutti e tre: Enoteca legge gruppo/categoria/
              prodotto dall'URL (useParams), così un refresh — o un link
              diretto — riapre esattamente dov'era, scheda prodotto inclusa */}
          <Route path="/enoteca" element={<Enoteca />} />
          <Route path="/enoteca/:groupId/:categoryId" element={<Enoteca />} />
          <Route
            path="/enoteca/:groupId/:categoryId/:productId"
            element={<Enoteca />}
          />
          <Route path="/alimentari" element={<Gastronomia />} />
          <Route path="/admin" element={<Login onBack={() => navigate("/")} />} />
          {/* sezioni non ancora costruite: pagina vuota (com'era prima),
              ma con un indirizzo stabile invece di finire su una pagina 404 */}
          <Route path="/confezioni" element={null} />
          <Route path="/dove-siamo" element={null} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
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
