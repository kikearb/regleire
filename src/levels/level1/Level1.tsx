import { useState } from "preact/hooks";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Level1Props {
  onNext: () => void;
}

const initialNames = [
  "Javi",
  "Leire",
  "María",
  "Larry",
  "Marta",
  "Kike",
  "Silvia",
];
const correctOrder = [
  "Larry",
  "Leire",
  "María",
  "Silvia",
  "Javi",
  "Kike",
  "Marta",
];

function SortableItem({ id, name }: { id: string; name: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "#a259ff33" : isOver ? "#ffd70022" : "#1a1026",
    color: "#e0b3ff",
    border: "1px solid #a259ff",
    borderRadius: 12,
    marginBottom: 8,
    padding: "0.7rem 1.2rem",
    fontFamily: "inherit",
    fontSize: "1.08rem",
    cursor: isDragging ? "grabbing" : "grab",
    boxShadow: isDragging
      ? "0 0 12px #ffd700"
      : isOver
      ? "0 0 8px #ffd700"
      : "0 0 8px #3a006655",
    opacity: isDragging ? 0.7 : 1,
    transitionProperty: "box-shadow, background, opacity, transform",
    userSelect: "none",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...(attributes as any)}
      {...(listeners as any)}
    >
      {name}
    </li>
  );
}

export function Level1({ onNext }: Level1Props) {
  const [names, setNames] = useState(initialNames);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = names.indexOf(active.id);
      const newIndex = names.indexOf(over.id);
      setNames(arrayMove(names, oldIndex, newIndex));
    }
  }

  function checkOrder() {
    if (names.join("-") === correctOrder.join("-")) {
      setSuccess(true);
      setError("");
      setTimeout(() => onNext(), 1200);
    } else {
      setError("¡El orden no es correcto! Intenta de nuevo.");
      setSuccess(false);
    }
  }

  return (
    <div class="level">
      <h2>Nivel 1</h2>
      <p style={{ marginBottom: "1.2rem" }}>
        Ordena los nombres de{" "}
        <span style={{ color: "#ffd700" }}>mayor a menor edad</span> arrastrando
        cada elemento:
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={names} strategy={verticalListSortingStrategy}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 1.2rem 0",
              maxWidth: 260,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {names.map((n) => (
              <SortableItem key={n} id={n} name={n} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <button class="level-btn" style={{ width: "100%" }} onClick={checkOrder}>
        Comprobar orden
      </button>
      {success && (
        <div
          class="success"
          autoFocus
          style={{ color: "#ffd700", marginTop: 12, fontWeight: 600 }}
        >
          ¡Correcto! Avanzando...
        </div>
      )}
      {error && (
        <div class="error" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
