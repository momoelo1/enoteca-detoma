import { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./images/enoteca-detoma-logo.png";
import Grainient from "./components/background/Grainient";
import Home from "./components/home/Home";
import Enoteca from "./components/enoteca/Enoteca";
import Gastronomia from "./components/gastronomia/Gastronomia";
import Login from "./components/login/Login";
import { SECTIONS } from "./data/data";


function App() {
  const [page, setPage] = useState("home");
  const tapCountRef = useRef(0); // tocchi ravvicinati sul logo
  const lastTapRef = useRef(0);

  const openPage = (id) => {
    setPage(id);
  };


  const handleLogoClick = () => {
    const now = Date.now();
    tapCountRef.current =
      now - lastTapRef.current < 600 ? tapCountRef.current + 1 : 1;
    lastTapRef.current = now;
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      openPage("login");
    } else {
      openPage("home");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={"nav-btn" + (page === s.id ? " is-active" : "")}
              onClick={() => openPage(s.id)}
            >
              <span className="nav-icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="nav-label--full">{s.label}</span>
              <span className="nav-label--short">{s.short || s.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main>
        {page === "home" && <Home />}

        {page === "enoteca" && <Enoteca />}

        {page === "alimentari" && <Gastronomia />}

        {page === "login" && <Login onBack={() => openPage("home")} />}
      </main>
    </>
  );
}

export default App;
