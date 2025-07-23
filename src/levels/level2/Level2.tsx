import { useEffect, useState } from "preact/hooks";
import elSol from "./assets/sol.svg";
import laMuerte from "./assets/muerte.svg";
import laTorre from "./assets/torre.png";
import laJusticia from "./assets/justicia.svg";

interface Level2Props {
  onNext: () => void;
}

const cards = [
  {
    name: "El Sol",
    img: elSol,
    isCorrect: false,
  },
  {
    name: "La Muerte",
    img: laMuerte,
    isCorrect: true,
  },
  {
    name: "La Torre",
    img: laTorre,
    isCorrect: false,
  },
  {
    name: "La justicia",
    img: laJusticia,
    isCorrect: false,
  },
];

export function Level2({ onNext }: Level2Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    document.getElementById("feedback")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [feedback]);

  function handleSelect(idx: number) {
    setSelected(idx);
    if (cards[idx].isCorrect) {
      setFeedback(
        "¡Correcto! La Muerte representa el cambio y la transformación."
      );

      setTimeout(() => onNext(), 2000);
    } else {
      setFeedback("No es la carta correcta. Intenta de nuevo.");
      setTimeout(() => {
        setFeedback("");
        setSelected(null);
      }, 1200);
    }
  }

  return (
    <div class="level">
      <h2 style={{ color: "#e0b3ff" }}>Segunda prueba</h2>
      <p style={{ marginBottom: "1.2rem", color: "#e0b3ff" }}>
        ¿Qué carta representa el{" "}
        <span style={{ color: "#ffd700" }}>cambio y la transformación</span>?
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {cards.map((card, idx) => (
          <button
            key={card.name}
            onClick={() => handleSelect(idx)}
            style={{
              borderRadius: 12,
              boxShadow:
                selected === idx ? "0 0 16px #ffd700" : "0 0 8px #3a006655",
              padding: 0,
              cursor: "pointer",
              transition: "box-shadow 0.2s, border 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              overflow: "hidden",
              flexBasis: "33%",
              flexGrow: 1,
              backgroundImage: card.img,
            }}
            disabled={!!feedback && !card.isCorrect}
          >
            <img
              src={card.img}
              alt={card.name}
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: 10,
                flexGrow: 1,
              }}
            />
          </button>
        ))}
      </div>
      {feedback && (
        <div
          id="feedback"
          className={cards[selected!]?.isCorrect ? "success" : "error"}
          style={{
            marginTop: 12,
            color: cards[selected!]?.isCorrect ? "#4caf50" : "#ff5252",
            fontWeight: 600,
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
