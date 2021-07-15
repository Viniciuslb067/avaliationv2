import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useContext } from "react";

import { Card } from "../components/Card/index";
import { ChartHome } from "../components/ChartHome/index";
import { SidebarContext } from "../contexts/SidebarContext";
import { getAPIClient } from "../services/axios";

import styles from "../styles/dashboard.module.scss";

type Assessment = {
  question: string;
  requester: string;
  status: string;
};

type HomeProps = {
  recentAssessment: Assessment[];
  allAssessment: number;
  allUser: number;
  allSystem: number;
};

export default function Dashboard({
  allAssessment,
  allUser,
  allSystem,
  recentAssessment,
}: HomeProps) {
  const { isOpen } = useContext(SidebarContext);

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
            <h1>Painel de Controle</h1>
            <small>
              Acompanhe tudo sobre as avalições dos sistemas do INSS
            </small>
          </div>
        </div>
        <Card
          numberAvaliation={allAssessment}
          numberUsers={allUser}
          numberSystems={allSystem}
        />
        <div className={styles.grid}>
          <ChartHome />
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
                      {recentAssessment.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.question}</td>
                            <td>{item.requester}</td>
                            <td>{item.status}</td>
                          </tr>
                        );
                      })}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ["feedback.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data } = await apiClient.get("/assessment");
  const totalUser = await apiClient.get("/user");
  const totalSystems = await apiClient.get("/system");

  const allAssessment = data.totalAssessment;
  const allUser = totalUser.data.totalUser;
  const allSystem = totalSystems.data.totalSystems;
  const recentAssessment = data.recentAssessment;

  return {
    props: {
      allAssessment,
      recentAssessment,
      allSystem,
      allUser,
    },
  };
};
