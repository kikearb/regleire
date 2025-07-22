import { type ComponentChildren } from "preact";
import styles from "./CrystalBall.module.css";
import handLeft from "../../assets/hand-left.svg";

interface CrystalBallProps {
  children?: ComponentChildren;
}

export function CrystalBall({ children }: CrystalBallProps) {
  return (
    <div className={styles.crystalBallContainer}>
      <img
        src={handLeft}
        className={`${styles.crystalHand} ${styles.handLeft}`}
        alt="Mano izquierda"
        draggable={false}
      />
      <div className={styles.crystalBallGlow}>
        <div className={styles.crystalBall}>
          {children && (
            <div className={styles.crystalBallContent}>{children}</div>
          )}
        </div>
      </div>
      <img
        src={handLeft}
        className={`${styles.crystalHand} ${styles.handRight}`}
        alt="Mano derecha"
        draggable={false}
      />
    </div>
  );
}
