import { ImUserTie } from "react-icons/im";
import { FaQuestion } from "react-icons/fa";
import { GrSystem } from "react-icons/gr";
import { RiNumbersLine } from "react-icons/ri";
import { MdDone } from "react-icons/md";
import { BsChatSquareDots } from "react-icons/bs";
import { TiCancel } from "react-icons/ti";

import styles from "./styles.module.scss";

interface CardMetricsProps {
  requester: string;
  question: string;
  system: string;
  status: number[];
  startDate: number[];
  endDate: number;
}

export function CardMetrics({
  requester,
  question,
  system,
  status,
  startDate,
  endDate,
}: CardMetricsProps) {
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
                <ImUserTie color="black"/>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Pesquisa</span>
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

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Participações</span>
              </div>
              <h2>{status[0]}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <MdDone color="green"/>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Recusados</span>
              </div>
              <h2>{startDate[1]}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <TiCancel color="red" />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Comentários</span>
              </div>
              <h2>{endDate}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <BsChatSquareDots />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
