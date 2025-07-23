import { useEffect, useState } from "preact/hooks";
import styles from "./End.module.css";

export const End = ({ onClick }: { onClick: () => void }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className={`${styles.endContainer} ${styles.endFadeIn}`}>
      <h1 className={styles.endTitle}>¡Tu destino está claro!</h1>
      <p className={styles.endText}>
        Debes reunir a tu grupo y venir a Zaragoza a verme...
        <br />y a comer en un agujero hobbit
      </p>
      <button className={"level-btn " + styles.endButton} onClick={onClick}>
        ¿Quieres repetir?
      </button>
    </div>
  );
};
