import { useState, useEffect } from "preact/hooks";
import "./app.css";
import { CrystalBall } from "./components/CrystalBall";
import { Level1 } from "./levels/level1";
import { Level2 } from "./levels/level2";
import { Level3 } from "./levels/level3";
import { Level4 } from "./levels/level4";

const possibleSteps = [
  "welcome",
  "name",
  "explain",
  "game",
  "level1",
  "level2",
  "level3",
  "level4",
] as const;
type AppStep = (typeof possibleSteps)[number];

export const App = () => {
  const [step, setStep] = useState<AppStep>(() => {
    const saved = localStorage.getItem("mystic-step");
    if (possibleSteps.includes(saved as AppStep)) {
      return saved as AppStep;
    }
    return "welcome";
  });
  const [name, setName] = useState("");

  useEffect(() => {
    localStorage.setItem("mystic-step", step);
  }, [step]);

  return (
    <div class="escape-room mystic-bg">
      <header class="tent-header">
        <div class="mystic-halo">
          <div class="mystic-orb orb1" />
          <div class="mystic-orb orb2" />
          <div class="mystic-orb orb3" />
        </div>
        <h1>🔮 Mística 🔮</h1>
        <CrystalBall>
          <span role="img" aria-label="Estrella">
            ✨
          </span>
        </CrystalBall>

        {step === "welcome" && <p class="subtitle">La vidente te espera...</p>}
      </header>
      <main>
        {step === "welcome" && (
          <div style={{ maxWidth: "270px", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "1.18rem",
                marginBottom: "2.2rem",
                color: "#e0b3ff",
                fontFamily: "inherit",
                textAlign: "center",
                letterSpacing: "0.01em",
              }}
            >
              Bienvenida al círculo de la vidente
            </p>
            <button
              class="level-btn"
              style={{ width: "100%" }}
              onClick={() => setStep("name")}
            >
              Entrar
            </button>
          </div>
        )}
        {step === "name" && (
          <div style={{ maxWidth: "270px", margin: "0 auto" }}>
            <label
              htmlFor="name-input"
              style={{
                display: "block",
                color: "#e0b3ff",
                fontFamily: "inherit",
                fontSize: "1.08rem",
                marginBottom: "1.1rem",
                textAlign: "center",
              }}
            >
              ¿Cuál es tu nombre, viajera?
            </label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName((e.target as HTMLInputElement).value)}
              onFocus={() => setStep("explain")}
              placeholder="Escribe tu nombre..."
              class="level-input"
              style={{ width: "100%", textAlign: "center" }}
            />
          </div>
        )}
        {step === "explain" && (
          <div style={{ maxWidth: "270px", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "1.08rem",
                color: "#e0b3ff",
                fontFamily: "inherit",
                textAlign: "center",
                marginBottom: "2.2rem",
                lineHeight: 1.4,
              }}
            >
              La vidente te guiará,{" "}
              <span
                style={{
                  color: "#ffd700",
                  fontWeight: 600,
                  textShadow: "0 0 6px #fffbe6",
                }}
              >
                Leire
              </span>
              , te estábamos esperando.
              <br />
              Escucha la voz del destino y responde con sinceridad.
              <br />
              <span style={{ color: "#ffd700", fontWeight: 500 }}>
                ¿Estás lista para descubrir tu camino?
              </span>
            </p>
            <button
              class="level-btn"
              style={{ width: "100%" }}
              onClick={() => setStep("game")}
            >
              Comenzar el ritual
            </button>
          </div>
        )}
        {/* Aquí irá el juego real tras la explicación */}
        {step === "game" && (
          <div style={{ maxWidth: "270px", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "1.13rem",
                color: "#e0b3ff",
                fontFamily: "inherit",
                textAlign: "center",
                marginBottom: "2.2rem",
              }}
            >
              El ritual comienza...
              <br />
              <span style={{ color: "#ffd700", fontWeight: 500 }}>
                ¡Que la magia te acompañe, {name || "viajera"}!
              </span>
            </p>
            <button
              class="level-btn"
              style={{ width: "100%" }}
              onClick={() => setStep("level1")}
            >
              Ir al primer nivel
            </button>
          </div>
        )}
        {step === "level1" && (
          <div style={{ width: "100%" }}>
            <Level1 onNext={() => setStep("level2")} />
          </div>
        )}
        {step === "level2" && (
          <div style={{ width: "100%" }}>
            <Level2 onNext={() => setStep("level3")} />
          </div>
        )}
        {step === "level3" && (
          <div style={{ width: "100%" }}>
            <Level3 onNext={() => setStep("level4")} />
          </div>
        )}
        {step === "level4" && (
          <div style={{ width: "100%" }}>
            <Level4 onNext={() => {}} />
          </div>
        )}
      </main>
    </div>
  );
};
