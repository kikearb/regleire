import { useEffect, useState } from "preact/hooks";

interface Card {
  id: string;
  pairId: string;
  content: string;
}

// Importar imágenes
import simbaImg from "./assets/simba.png";
import pumbaImg from "./assets/pumba.png";
import olafImg from "./assets/olaf.png";
import lagartijaImg from "./assets/lagartija.png";
import genioImg from "./assets/genio.png";
import abuImg from "./assets/abu.png";
import pezImg from "./assets/pez.png";
import sebastianImg from "./assets/sebastian.png";
import blancanievesImg from "./assets/blancanieves.png";
import manzanaImg from "./assets/manzana.png";
import dumboImg from "./assets/dumbo.png";
import plumaImg from "./assets/pluma.png";

// 6 parejas Disney (todas imágenes)
const pairs = [
  {
    a: simbaImg,
    b: pumbaImg,
  },
  {
    a: olafImg,
    b: lagartijaImg,
  },
  {
    a: genioImg,
    b: abuImg,
  },
  {
    a: pezImg,
    b: sebastianImg,
  },
  {
    a: blancanievesImg,
    b: manzanaImg,
  },
  {
    a: dumboImg,
    b: plumaImg,
  },
];

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((v) => [Math.random(), v] as const)
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

export function Level5({ onNext }: { onNext: () => void }) {
  // Generar cartas mezcladas solo una vez
  const cards: Card[] = useState(() =>
    shuffle(
      pairs.flatMap((p, i) => [
        { id: `a${i}`, pairId: `p${i}`, content: p.a },
        { id: `b${i}`, pairId: `p${i}`, content: p.b },
      ])
    )
  )[0];

  const [flipped, setFlipped] = useState<string[]>([]); // ids de cartas boca arriba
  const [matched, setMatched] = useState<string[]>([]); // ids de cartas emparejadas
  const [lock, setLock] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleFlip(card: Card) {
    if (lock || flipped.includes(card.id) || matched.includes(card.id)) return;
    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setLock(true);
      const [id1, id2] = newFlipped;
      const c1 = cards.find((c) => c.id === id1)!;
      const c2 = cards.find((c) => c.id === id2)!;
      if (c1.pairId === c2.pairId) {
        // Emparejadas
        setTimeout(() => {
          setMatched((prev) => [...prev, id1, id2]);
          setFlipped([]);
          setLock(false);
          // Si todas emparejadas, éxito
          if (matched.length + 2 === cards.length) {
            setSuccess(true);
            setTimeout(() => onNext(), 1800);
          }
        }, 700);
      } else {
        // No emparejadas
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    }
  }

  useEffect(() => {
    document.getElementById("success")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [success]);

  return (
    <div class="level">
      <h2 style={{ color: "#e0b3ff" }}>Quinta prueba</h2>
      <p style={{ marginBottom: "1.2rem", color: "#e0b3ff" }}>
        Encuentra todas las parejas. <br />
        ¡Toca dos cartas para descubrirlas!
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: 14,
        }}
      >
        {cards.map((card) => {
          const isFlipped =
            flipped.includes(card.id) || matched.includes(card.id);
          return (
            <button
              key={card.id}
              class="memory-card"
              style={{
                minHeight: 70,
                aspectRatio: 1,
                fontSize: 26,
                background: isFlipped ? "#1a1026" : "#a259ff",
                color: isFlipped ? "#ffd700" : "#1a1026",
                border: isFlipped
                  ? "2.5px solid #ffd700"
                  : "1.5px solid #a259ff",
                borderRadius: 12,
                boxShadow: isFlipped ? "0 0 12px #ffd700" : "0 0 8px #3a006655",
                transition: "all 0.2s",
                userSelect: "none",
                outline: "none",
                fontWeight: 600,
              }}
              disabled={isFlipped || lock}
              onClick={() => handleFlip(card)}
            >
              {isFlipped ? (
                <img
                  src={card.content}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                "?"
              )}
            </button>
          );
        })}
      </div>
      {success && (
        <div
          id="success"
          class="success"
          style={{ color: "#ffd700", marginTop: 12, fontWeight: 600 }}
        >
          ¡Correcto! Avanzando...
        </div>
      )}
    </div>
  );
}
