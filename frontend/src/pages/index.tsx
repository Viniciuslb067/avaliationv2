import { GetStaticProps } from "next";

import { Card } from "../components/Card/index";
import { Table } from "../components/Table/index";
import { CardHome } from "../components/CardHome/index";

import { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";

import { FaFileExport } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";

import { api } from "../services/api";

import styles from "./home.module.scss";

interface Avaliation {
  question: string;
  requester: string;
  status: string;
}

interface HomeProps {
  allAvaliationOn: Avaliation[];
  allAvaliationOff: Avaliation[];
}

export default function Home({ allAvaliationOn, allAvaliationOff }: HomeProps) {
  const avaliationList = [...allAvaliationOn, ...allAvaliationOff];

  console.log(avaliationList)

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

          <div className={styles.headerActions}>
            <button>
              <span>
                <FaFileExport />
              </span>
              Export
            </button>
            <button>
              <span>
                <VscTools />
              </span>
              Settings
            </button>
          </div>
        </div>
        <Card />
        <div className={styles.grid}>
          <CardHome />
          {avaliationList.map((item, key) => {
            return (
              <Table key={key}
                question={item.question}
                requester={item.requester}
                status={item.status}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/avaliation");

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

  return {
    props: {
      allAvaliationOn,
      allAvaliationOff,
    },
  };
};
