import { useEffect, useState } from "react";
import "./App.css";
import logo from "./images/enoteca-detoma-logo.png";
import Grainient from "./components/background/Grainient";
import Home from "./components/home/Home";
import Enoteca from "./components/enoteca/Enoteca";
import Alimentari from "./components/alimentari/Alimentari";
import { SECTIONS } from "./data/data";


function App() {
  const [page, setPage] = useState("home");

  const openPage = (id) => {
    setPage(id);
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
          timeSpeed={0.5}
          grainAmount={0.06}
          contrast={1.15}
          saturation={0.95}
        />
      </div>

      <header className="site-header">
        <img
          src={logo}
          alt="Enoteca de Toma"
          className="site-logo"
          onClick={() => openPage("home")}
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

        {page === "alimentari" && <Alimentari />}
      </main>
    </>
  );
}

export default App;
