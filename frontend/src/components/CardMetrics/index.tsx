import { useContext } from "react";

import { HiOutlineUsers } from "react-icons/hi";
import { GoGraph } from "react-icons/go";
import { GrSystem } from "react-icons/gr";

import styles from "./styles.module.scss";

interface CardProps {
  title: string;
  subtitle: string;
  number: number;
  icon: {};
}

export function Card({ numberAvaliation, numberUsers, numberSystems }) {
  return (
    <>
      <div className={styles.cards}>
        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Avaliaçãoes</span>
                <small>Número de avaliações</small>
              </div>
              <h2>{numberAvaliation}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span><GoGraph color="#1d62f0"/></span>
            </div>
          </div>
        </div>

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Usuários</span>
                <small>Número de usuários</small>
              </div>
              <h2>{numberUsers}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span><HiOutlineUsers color="#fbad4c"/></span>
            </div>
          </div>
        </div>

        <div className={styles.cardSingle}>
          <div className={styles.cardFlex}>
            <div className={styles.cardInfo}>
              <div className={styles.cardHead}>
                <span>Sistemas</span>
                <small>Número de sistemas</small>
              </div>
              <h2>{numberSystems}</h2>
            </div>
            <div className={styles.cardIcon}>
              <span><GrSystem/></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
