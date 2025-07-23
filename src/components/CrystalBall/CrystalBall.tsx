import { type ComponentChildren } from "preact";
import styles from "./CrystalBall.module.css";
import handLeft from "../../assets/hand-left.svg";
import { useEffect, useState } from "preact/hooks";

interface CrystalBallProps {
  children?: ComponentChildren;
  id?: string;
  step: string;
}

export function CrystalBall({ children, id, step }: CrystalBallProps) {
  const approach = step === "end";
  const [animateContent, setAnimateContent] = useState(false);

  useEffect(() => {
    if (approach) {
      // Espera a que termine la animación de las manos (0.7s)
      const t = setTimeout(() => setAnimateContent(true), 700);
      return () => clearTimeout(t);
    } else {
      setAnimateContent(false);
    }
  }, [approach]);

  return (
    <div className={styles.crystalBallContainer} id={id}>
      <img
        src={handLeft}
        className={`${styles.crystalHand} ${styles.handLeft} ${
          approach ? styles.handsApproach : ""
        }`}
        alt="Mano izquierda"
        draggable={false}
      />
      <div className={styles.crystalBallGlow}>
        <div className={styles.crystalBall}>
          {children && (
            <div
              className={
                styles.crystalBallContent +
                (animateContent ? " " + styles.crystalBallContentAnimate : "")
              }
            >
              {children}
            </div>
          )}
        </div>
      </div>
      <img
        src={handLeft}
        className={`${styles.crystalHand} ${styles.handRight} ${
          approach ? styles.handsApproach : ""
        }`}
        alt="Mano derecha"
        draggable={false}
      />
    </div>
  );
}
