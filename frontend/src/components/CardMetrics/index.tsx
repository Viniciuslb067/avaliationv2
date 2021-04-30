import { ImUserTie } from "react-icons/im";
import { FaQuestion } from "react-icons/fa";
import { GrSystem } from "react-icons/gr";

import styles from "./styles.module.scss";

interface CardMetricsProps {
  requester: string;
  question: string;
  system: string;
}

export function CardMetrics({ requester, question, system }: CardMetricsProps) {
  return (
    <>
      <div className={styles.cards}>
        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Solicitante</span>
              </div>
              <h2>{requester}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <ImUserTie color="#1d62f0" />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Pergunta</span>
              </div>
              <h2>{question}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <FaQuestion color="red" />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Sistema</span>
              </div>
              <h2>{system}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <GrSystem />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
