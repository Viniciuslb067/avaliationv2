import styles from "./styles.module.scss";

import { BsArrowRightShort } from "react-icons/bs";

export function Table() {
  return (
    <>
      <div className={styles.tableGrid}>
        <div className={styles.table}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Avaliações Recentes</h3>
              <button>
                Ver todas
                <span>
                  <BsArrowRightShort />
                </span>
              </button>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.tableResponsive}>
                <table width="100%">
                  <thead>
                    <tr>
                      <td>Título Avaliação</td>
                      <td>Departamento</td>
                      <td>Status</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Algum título</td>
                      <td>DTI</td>
                      <td>
                        <span className={styles.status}></span>
                        Ativo
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
