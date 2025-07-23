import "./FinaleCrystal.css";

import { useEffect, useState } from "preact/hooks";

export const Finale = ({ onEnd }: { onEnd: () => void }) => {
  const [showSecond, setShowSecond] = useState(false);
  const [mountSecond, setMountSecond] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Monta el segundo mensaje en el siguiente tick tras showSecond
  useEffect(() => {
    if (showSecond) {
      const raf = requestAnimationFrame(() => setMountSecond(true));
      // Fade out and trigger hands after 3s of second text
      const fade = setTimeout(() => {
        setFadeOut(true);
        // Evento personalizado para el header
        window.dispatchEvent(new CustomEvent("crystal-hands-approach"));
        onEnd();
      }, 3000);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(fade);
      };
    } else {
      setMountSecond(false);
    }
  }, [showSecond]);

  return (
    <div className={`finale-container${fadeOut ? " finale-fade-out" : ""}`}>
      <div className="finale-message finale-message-anim">
        La adivina ya sabe todo lo necesario
      </div>
      {mountSecond && (
        <div className="finale-message finale-message-anim">
          y ha profetizado tu destino...
        </div>
      )}
    </div>
  );
};
