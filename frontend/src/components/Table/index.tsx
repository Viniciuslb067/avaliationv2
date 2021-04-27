import { useEffect, useState } from "react";

import { BsArrowRightShort } from "react-icons/bs";

import styles from "./styles.module.scss";

export function Table({ question, requester, status }) {
  const [statusColor, setStatusColor] = useState(false);

  useEffect(() => {
    function verifyStatusColor() {
      if (status === "Desativada") {
        setStatusColor(false);
      } else {
        setStatusColor(true);
      }
    }
    verifyStatusColor(); 
  },[])

  console.log(statusColor);
 
  return (
    <>
      <div className={styles.table}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Avaliações Recentes</h3>
            <button>Ver todas</button>
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
                    <td>{question}</td>
                    <td>{requester}</td>
                    <td>
                      <span
                        className={
                          statusColor
                            ? styles.status
                            : styles.statusOff
                        }
                      ></span>
                      {status}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
