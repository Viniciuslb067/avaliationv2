import { FaQuestion } from "react-icons/fa";
import { GrSystem } from "react-icons/gr";
import { ImUsers } from "react-icons/im";
import { MdDone } from "react-icons/md";
import { BsChatSquareDots } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

import styles from "./styles.module.scss";

interface CardMetricsProps {
  totalEntries: number;
  question: string;
  system: string;
  status: number[];
  media: number;
  endDate: number;
}

export function CardMetrics({
  totalEntries,
  question,
  system,
  status,
  media,
  endDate,
}: CardMetricsProps) {
  return (
    <>
      <div className={styles.cards}>
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
                <span>Total de acessos</span>
              </div>
              <h2>{totalEntries}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <ImUsers color="black" />
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
                <MdDone color="green" />
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

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Média</span>
              </div>
              <h2>{media === NaN ? "0" : media}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span>
                <AiFillStar color="#ffc107" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
