import { useEffect, useState } from "preact/hooks";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

interface Level4Props {
  onNext: () => void;
}

const books = [
  { id: "hp", title: "Harry Potter y la piedra filosofal" },
  { id: "acor", title: "Una corte de rosas y espinas" },
  { id: "alas", title: "Alas de sangre" },
  { id: "lotr", title: "El señor de los anillos" },
  { id: "kvothe", title: "El nombre del viento" },
];

const phrases = [
  {
    id: "hp",
    text: "Para una mente bien organizada, la muerte no es más que la siguiente gran aventura.",
  },
  { id: "acor", text: "No te inclines, no te doblegues, no te rompas." },
  { id: "lotr", text: "Un anillo para gobernarlos a todos." },
  { id: "alas", text: "Mi casa. Mi trono. Mi reina." },
  { id: "kvothe", text: "Las palabras son monedas. Gástalas sabiamente." },
];

export function Level4({ onNext }: Level4Props) {
  const [phraseOrder] = useState(phrases.map((p) => p.id));
  const [dropped, setDropped] = useState<{ [bookId: string]: string | null }>({
    hp: null,
    acor: null,
    alas: null,
    kvothe: null,
  });
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Detectar si es táctil
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const sensors = isTouch
    ? useSensors(
        useSensor(TouchSensor, {
          activationConstraint: {
            delay: 100,
            tolerance: 5,
          },
        })
      )
    : useSensors(
        useSensor(PointerSensor, {
          activationConstraint: { distance: 5 },
        })
      );

  function handleDragEnd(event: any) {
    let dropId = null;
    // Usar event.over si existe (dnd-kit lo rellena si el drop es válido)
    if (event.over && event.over.id) {
      dropId = event.over.id;
    } else if (
      event.activatorEvent &&
      event.activatorEvent.clientX !== undefined
    ) {
      // Fallback: buscar el droppable bajo el puntero
      const x = event.activatorEvent.clientX;
      const y = event.activatorEvent.clientY;
      const elem = document.elementFromPoint(x, y);
      if (elem) {
        let current = elem as HTMLElement | null;
        while (current) {
          if (current.dataset && current.dataset.droppableId) {
            dropId = current.dataset.droppableId;
            break;
          }
          current = current.parentElement;
        }
      }
    }
    if (!dropId) return;
    if (!books.some((b) => b.id === dropId)) return;
    setDropped((prev) => {
      const newDropped = { ...prev };
      newDropped[dropId] = event.active.id;
      // Si la frase estaba en otro libro, la quitamos de ahí
      Object.keys(newDropped).forEach((bookId) => {
        if (bookId !== dropId && newDropped[bookId] === event.active.id) {
          newDropped[bookId] = null;
        }
      });
      return newDropped;
    });
  }

  function check() {
    const correct = books.every((b) => dropped[b.id] === b.id);
    if (correct) {
      setSuccess(true);
      setFeedback("Correcto, todas las frases están en su libro.");
      setTimeout(() => onNext(), 1800);
    } else {
      setFeedback("¡Alguna frase no está en su libro correcto!");
      setSuccess(false);
    }
  }

  useEffect(() => {
    document.getElementById("feedback")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [feedback]);

  return (
    <div class="level">
      <h2 style={{ color: "#e0b3ff" }}>Cuarta prueba</h2>
      <p style={{ marginBottom: "1.2rem", color: "#e0b3ff" }}>
        Arrastra cada frase a su libro correspondiente:
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: 24,
          }}
        >
          {books.map((book) => (
            <DroppableBook
              key={book.id}
              id={book.id}
              title={book.title}
              droppedPhrase={
                dropped[book.id]
                  ? phrases.find((p) => p.id === dropped[book.id])!.text
                  : null
              }
            />
          ))}
        </div>
        <div
          style={{
            margin: "1.5rem 0 0 0",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {phraseOrder.map((id) => {
            // Solo mostrar frases que no estén ya asignadas
            if (Object.values(dropped).includes(id)) return null;
            const phrase = phrases.find((p) => p.id === id)!;
            return <DraggablePhrase key={id} id={id} text={phrase.text} />;
          })}
        </div>
      </DndContext>
      <button
        class="level-btn"
        style={{ width: "100%", marginTop: 24 }}
        onClick={check}
      >
        Comprobar
      </button>
      {feedback && (
        <div
          id="feedback"
          className={success ? "success" : "error"}
          style={{
            marginTop: 12,
            color: success ? "#4caf50" : "#ff5252",
            fontWeight: 600,
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

function DraggablePhrase({ id, text }: { id: string; text: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    background: isDragging ? "#a259ff33" : "#1a1026",
    color: "#e0b3ff",
    border: "1px solid #a259ff",
    borderRadius: 10,
    marginBottom: 4,
    padding: "0.7rem 1.2rem",
    fontFamily: "inherit",
    fontSize: "1.02rem",
    cursor: isDragging ? "grabbing" : "grab",
    boxShadow: isDragging ? "0 0 12px #ffd700" : "0 0 8px #3a006655",
    opacity: isDragging ? 0.7 : 1,
    transition:
      "box-shadow 0.2s, background 0.2s, opacity 0.2s, transform 0.2s",
    userSelect: "none",
    marginTop: 2,
    marginRight: 2,
    marginLeft: 2,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...(listeners as any)}>
      <span
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function DroppableBook({
  id,
  title,
  droppedPhrase,
}: {
  id: string;
  title: string;
  droppedPhrase: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      data-droppable-id={id}
      style={{
        background: isOver ? "#ffd70022" : "#1a1026",
        border: isOver ? "2.5px solid #ffd700" : "1.5px solid #a259ff",
        borderRadius: 12,
        padding: "1rem 1.2rem 1.2rem 1.2rem",
        minHeight: 80,
        minWidth: 0,
        boxShadow: isOver ? "0 0 16px #ffd700" : "0 0 8px #3a006655",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
        transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          color: "#ffd700",
          marginBottom: 8,
          fontSize: 15,
        }}
      >
        {title}
      </div>
      <div style={{ minHeight: 32, width: "100%" }}>
        {droppedPhrase ? (
          <div style={{ color: "#e0b3ff", fontSize: 14 }}>{droppedPhrase}</div>
        ) : (
          <span style={{ color: "#e0b3ff", fontSize: 13, opacity: 0.7 }}>
            Arrastra aquí la frase
          </span>
        )}
      </div>
    </div>
  );
}
