import Head from "next/head";
import { useContext } from "react";
import { verifyToken } from "../../contexts/AuthContext"
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
  info: string;
  comments: string;
  createdAt: string;
  note: number;
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
  commentsTotal: number;
}

interface AssessmentProps {
  allData: Assessment;
}

export default function MetricsAssessment({ allData }: AssessmentProps) {
  verifyToken();
  const { isOpen } = useContext(SidebarContext);

  console.log(allData.status)

  return (
    <>
      <Head>
        <title>Feedback | Dashboard</title>
      </Head>
      
      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Dashboard</h1>
            <small>
              Aqui você pode acompanhar o andamento de uma avaliação.
            </small>
          </div>
        </div>
        <CardMetrics
          requester={allData.requester}
          question={allData.question}
          system={allData.system}
          status={allData.status}
          startDate={allData.status}
          endDate={allData.commentsTotal}
        />

        <div className={styles.grid}>
          <BarChart notes={allData.notes} />
          <PieChart status={allData.status} />
        </div>

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
                      <td>Data</td>
                      <td>Nota</td>
                      <td>Informações</td>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.comments.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{item.ip_user.split("::ffff:")}</td>
                          <td>{item.comments}</td>
                          <td>{format(parseISO(item.createdAt), "dd/MM/yy 'às' HH:mm")}</td>
                          <td>{item.note} Estrelas</td>
                          <td>{item.info}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/avaliate/result/${slug}`);

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
    commentsTotal: data.commentsTotal,
    
  };

  return {
    props: {
      allData,
    },
    revalidate: 1,
  };
};
