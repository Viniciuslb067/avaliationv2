import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { CardMetrics } from "../../components/CardMetrics";
import { BarChart, PieChart } from "../../components/ChartMetrics";
import { SidebarContext } from "../../contexts/SidebarContext";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import styles from "./assessment.module.scss";
import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

interface Comments {
  ip_user: string;
  comments: string;
}

interface Assessment {
  id: string;
  question: string;
  requester: string;
  system: string;
  startDate: string;
  endDate: string;
  getStatus: string;
  notes: [];
  status: [];
  comments: Comments[];
}

interface AssessmentProps {
  allData: Assessment;
}

export default function MetricsAssessment({ allData }: AssessmentProps) {
  const { isOpen } = useContext(SidebarContext);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Evaluator | Metrics</title>
      </Head>
      
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
        <CardMetrics
          requester={allData.requester}
          question={allData.question}
          system={allData.system}
          status={allData.getStatus}
          startDate={allData.startDate}
          endDate={allData.endDate}
        />

        <div className={styles.table}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Comentários</h3>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.tableResponsive}>
                <table width="100%">
                  <thead>
                    <tr>
                      <td>IP</td>
                      <td>Comentário</td>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.comments.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{item.ip_user.split("::ffff:")}</td>
                          <td>{item.comments}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <BarChart notes={allData.notes} />
          <PieChart status={allData.status} />
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/avaliate/result/${slug}`);

  console.log(data.comments);

  const allData = {
    id: data.data._id,
    question: data.data.question,
    requester: data.data.requester,
    system: data.data.system,
    getStatus: data.data.status,
    startDate: format(parseISO(data.data.start_date), "d MMMM yyyy", {
      locale: ptBR,
    }),
    endDate: format(parseISO(data.data.end_date), "d MMMM yyyy", {
      locale: ptBR,
    }),
    notes: data.notes,
    status: data.status,
    comments: data.comments,
  };

  return {
    props: {
      allData,
    },
    revalidate: 1,
  };
};
