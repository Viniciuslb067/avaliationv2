import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { useContext } from "react";

import { Card } from "../components/Card/index";
import { ChartHome } from "../components/ChartHome/index";
import { SidebarContext } from "../contexts/SidebarContext";
import { verifyToken } from "../contexts/AuthContext";

import { api } from "../services/api";

import styles from "../styles/dashboard.module.scss";

type Avaliation =  {
  question: string;
  requester: string;
  status: string;
}

type HomeProps = {
  recentAvaliation: Avaliation[];
  allAvaliation: number;
  allUser: number;
  allSystem: number;
}

export default function Dashboard({
  allAvaliation,
  allUser,
  allSystem,
  recentAvaliation,
}: HomeProps) {
  verifyToken();
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
          numberAvaliation={allAvaliation}
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
                      {recentAvaliation.map((item, key) => {
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

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get("/avaliation", {
    params: {
      _limit: 10,
      _sort: "createdAt",
      _order: "desc",
    },
  });
  const totalUser = await api.get("/user");
  const totalSystems = await api.get("/system");

  const allAvaliation = data.totalAvaliation;
  const allUser = totalUser.data.totalUser;
  const allSystem = totalSystems.data.totalSystems;
  const recentAvaliation = data.recentAvaliations;

  return {
    props: {
      allAvaliation,
      recentAvaliation,
      allSystem,
      allUser,
    }
  };
};
