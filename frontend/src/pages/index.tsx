import { Card } from "../components/Card/index";
import { Chart } from "../components/Chart/index";

import { AiOutlineUser } from "react-icons/ai";
import { FaFileExport } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";
import { GoGraph } from "react-icons/go";
import { GrSystem } from "react-icons/gr";

import { Sidebar } from "../components/Sidebar/index";

import styles from "./home.module.scss";

export default function Home() {
  return (
    <>
      <main className={styles.mainContainer}>
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
      </main>
    </>
  );
}
