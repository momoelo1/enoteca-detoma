import { useEffect, useRef, useState } from "react";
import "./home.css";

// prende automaticamente le foto da src/images/famiglia/ appena esistono
const familyPhotos = Object.values(
  import.meta.glob("../../images/famiglia/*.{jpg,jpeg,png,webp}", {
    eager: true,
    import: "default",
  })
);

function FamilySlideshow() {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);

  // scorrimento manuale: trascina/swipe a destra o sinistra
  const onPointerDown = (e) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const delta = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) < 40) return;
    setIndex(
      (i) =>
        (i + (delta < 0 ? 1 : -1) + familyPhotos.length) % familyPhotos.length
    );
  };
  const onPointerCancel = () => {
    startX.current = null;
  };

  useEffect(() => {
    if (familyPhotos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % familyPhotos.length),
      4500
    );
    return () => clearInterval(timer);
  }, []);


  return (
    <div
      className="hero-photos"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {familyPhotos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="La famiglia De Toma"
          draggable={false}
          className={"family-photo" + (i === index ? " is-visible" : "")}
        />
      ))}
    </div>
  );
}

function Home() {
  // la home riempie esattamente lo schermo: nessuno scroll
  useEffect(() => {
    document.body.classList.add("home-no-scroll");
    return () => document.body.classList.remove("home-no-scroll");
  }, []);

  return (
    <section className="hero">
      <h1 className="hero-title">Tre Generazioni, Una Passione per il Vino</h1>
      <div className="hero-stories">
        <p className="hero-story">
          L&apos;amore della famiglia De Toma per il vino nasce agli inizi del
          &apos;900, quando Nicola De Toma lascia Trani per approdare a Lodi e
          aprire un emporio vinicolo. Da lui, attraverso Domenica e Bartolomeo
          (Nino), l&apos;attività arriva oggi a Nicola e Sabrina, che guidano
          l&apos;enoteca.
        </p>
        <span className="hero-divider" aria-hidden="true" />
        <FamilySlideshow />
      </div>
    </section>
  );
}

export default Home;
