import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { CardMetrics } from "../../components/CardMetrics";
import { CardHome } from "../../components/CardHome";
import { SidebarContext } from "../../contexts/SidebarContext";

import styles from "./assessment.module.scss";
import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

interface Assessment {
  id: string,
  question: string,
  requester: string,
  system: string,
  startDate: string,
  endDate: string,
  notes: [],
  status: [],
}

interface AssessmentProps {
  allData: Assessment;
}

export default function MetricsAssessment({ allData }: AssessmentProps) {
  const { isOpen } = useContext(SidebarContext);
  const router = useRouter();

  return (
    <>
      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Métricas</h1>
            <h1>{router.query.slug}</h1>
            <small>
              Aqui você pode acompanhar o andamento de uma avaliação.
            </small>
          </div>
        </div>
        <CardMetrics
          requester={allData.requester}
          question={allData.question}
          system={allData.system}
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const { slug } = ctx.params;

  const { data } = await api.get(`/avaliate/result/${slug}`);

  console.log(data.data.start_date)

  const allData = {
    id: data.data._id,
    question: data.data.question,
    requester: data.data.requester,
    system: data.data.system,
    startDate: data.data.start_date,
    endDate: data.data.end_date,
    notes: data.notes,
    status: data.status,
  }

  return {
    props: {
      allData,
    },
  }
}
