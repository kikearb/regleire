import { useEffect, useState } from "preact/hooks";

interface Level3Props {
  onNext: () => void;
}

const options = [
  { name: "Ginny Weasley", isCorrect: false },
  { name: "Ron Weasley", isCorrect: false },
  { name: "Harry Potter", isCorrect: false },
  { name: "Albus Dumbledore", isCorrect: true },
  { name: "Tom Riddle", isCorrect: false },
];

export function Level3({ onNext }: Level3Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [answerCounter, setAnswerCounter] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    document.getElementById("feedback")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [feedback]);

  function handleSelect(idx: number) {
    setSelected(idx);
    if (options[idx].isCorrect) {
      setFeedback(
        "¡Correcto! Albus Dumbledore nunca fue capaz de hablar en parsel, pero sí lo entendía."
      );
      setTimeout(() => onNext(), 1800);
    } else {
      setFeedback(
        "¿Y tú te consideras Potterhead? Avergüenzas a la casa Slytherin."
      );
      setAnswerCounter((prev) => prev + 1);
      if (answerCounter >= 2) {
        setShowHint(true);
      }
      setTimeout(() => {
        setFeedback("");
        setSelected(null);
      }, 3000);
    }
  }

  return (
    <div class="level">
      <h2 style={{ color: "#e0b3ff" }}>Tercera prueba</h2>
      <p style={{ marginBottom: "1.2rem", color: "#e0b3ff" }}>
        ¿Quién de los siguientes{" "}
        <span style={{ color: "#ffd700" }}>no pudo hablar nunca en parsel</span>
        ?
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {options.map((opt, idx) => (
          <button
            key={opt.name}
            onClick={() => handleSelect(idx)}
            style={{
              borderRadius: 12,
              boxShadow:
                selected === idx ? "0 0 16px #ffd700" : "0 0 8px #3a006655",
              padding: "0.8rem 1.2rem",
              cursor: "pointer",
              fontSize: "1.08rem",
              color: "#e0b3ff",
              background:
                selected === idx
                  ? opt.isCorrect
                    ? "#4caf5022"
                    : "#ff525222"
                  : "#1a1026",
              border:
                selected === idx
                  ? opt.isCorrect
                    ? "2.5px solid #4caf50"
                    : "2.5px solid #ff5252"
                  : "2px solid #a259ff",
              fontFamily: "inherit",
              fontWeight: 500,
              transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
            }}
            disabled={!!feedback && !opt.isCorrect}
          >
            {opt.name}
          </button>
        ))}
      </div>
      {feedback && (
        <div
          id="feedback"
          className={options[selected!]?.isCorrect ? "success" : "error"}
          style={{
            marginTop: 12,
            color: options[selected!]?.isCorrect ? "#4caf50" : "#ff5252",
            fontWeight: 600,
          }}
        >
          {feedback}
        </div>
      )}
      {showHint && !feedback && (
        <div style={{ marginTop: 10, color: "#ffd700", fontSize: 14 }}>
          Pista: solo uno de ellos nunca pudo hablar en parsel, ni siquiera
          accidentalmente.
        </div>
      )}
    </div>
  );
}
