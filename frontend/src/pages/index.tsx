import { Card } from "../components/Card/index";
import { Table } from "../components/Table/index";
import { CardHome } from "../components/CardHome/index";

import { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";

import { FaFileExport } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";
import { Sidebar } from "../components/Sidebar/index";

import styles from "./home.module.scss";

export default function Home() {
  const { isOpen } = useContext(SidebarContext);
  return (
    <>
      <main className={isOpen ? styles.mainContainer : styles.mainContainerHide}>
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
          <Table />
        </div>
      </main>
    </>
  );
}
