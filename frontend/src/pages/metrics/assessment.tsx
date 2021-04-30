import Link from "next/link";
import { useContext } from "react";
import { Card } from "../../components/Card";
import { CardHome } from "../../components/CardHome";
import { SidebarContext } from "../../contexts/SidebarContext";

import styles from "./assessment.module.scss";

export default function MetricsAssessment() {
  const { isOpen } = useContext(SidebarContext);

  return (
    <>
      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Métricas</h1>
            <small>
              Aqui você pode acompanhar o andamento de uma avaliação.
            </small>
          </div>
        </div>
        <Card
          numberAvaliation={123}
          numberUsers={123}
          numberSystems={123}
        />
        <div className={styles.grid}>
          <CardHome />
          <div className={styles.table}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Avaliações Recentes</h3>
                <Link href="/assessment">
                  <button>Ver todas</button>
                </Link>
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

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
