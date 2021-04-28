import { GetStaticProps } from "next";
import { useContext, useEffect, useState } from "react";

import { Card } from "../components/Card/index";
import { CardHome } from "../components/CardHome/index";
import { SidebarContext } from "../contexts/SidebarContext";
import { FaFileExport } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";

import { api } from "../services/api";

import styles from "./home.module.scss";
import Link from "next/link";

interface Avaliation {
  question: string;
  requester: string;
  status: string;
}

interface HomeProps {
  allAvaliationOn: Avaliation[];
  allAvaliationOff: Avaliation[];
  allAvaliation: number;
  allUser: number;
  allSystem: number;
}

export default function Dashboard({
  allAvaliationOn,
  allAvaliationOff,
  allAvaliation,
  allUser,
  allSystem,
}: HomeProps) {
  const avaliationList = [...allAvaliationOn, ...allAvaliationOff];
  const { isOpen } = useContext(SidebarContext);

  return (
    <>
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
                      {avaliationList.map((item, key) => {
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/avaliation", {
    params: {
      _limit: 10,
      _sort: "createdAt",
      _order: "desc",
    },
  });
  const totalUser = await api.get("/user");
  const totalSystems = await api.get("/system");

  const avaliationOn = data.avaliationOn.map((item) => {
    return {
      question: item.question,
      requester: item.requester,
      status: item.status,
    };
  });

  const avaliationOff = data.avaliationOff.map((item) => {
    return {
      question: item.question,
      requester: item.requester,
      status: item.status,
    };
  });

  const allAvaliationOn = avaliationOn;
  const allAvaliationOff = avaliationOff;
  const allAvaliation = data.totalAvaliation;
  const allUser = totalUser.data.totalUser;
  const allSystem = totalSystems.data.totalSystems;

  return {
    props: {
      allAvaliationOn,
      allAvaliationOff,
      allAvaliation,
      allSystem,
      allUser,
    },
  };
};
