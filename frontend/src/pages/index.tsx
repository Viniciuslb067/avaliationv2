import styles from "./home.module.scss";

import { AiOutlineUser } from "react-icons/ai";
import { MdAssessment } from "react-icons/md"
import { RiComputerLine } from "react-icons/ri"

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.container}>
        <div className={styles.mainCard}>

          <div className={styles.card}>
          <AiOutlineUser color="blue" className={styles.icon}/>
            <div className={styles.cardInner}>
              <p className="text-primary-p">Usuários cadastrado</p>
              <span className="font-bold text-title">578</span>
            </div>
          </div>

          <div className={styles.card}>
            <MdAssessment color="green" className={styles.icon}/>
            <div className={styles.cardInner}>
              <p className="text-primary-p">Avaliações Ativas</p>
              <span className="font-bold text-title">578</span>
            </div>
          </div>

          <div className={styles.card}>
            <RiComputerLine color="red" className={styles.icon}/>
            <div className={styles.cardInner}>
              <p className="text-primary-p">Sistemas Ativos</p>
              <span className="font-bold text-title">578</span>
            </div>
          </div>


        </div>
      </div>

    </main>
  );
}
