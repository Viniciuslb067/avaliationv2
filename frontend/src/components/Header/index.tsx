import { useContext } from "react";

import { BsList } from "react-icons/bs";
import { AiOutlineUser, AiOutlineArrowRight } from "react-icons/ai";
import { FaFileExport } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";

import { SidebarContext } from "../../contexts/SidebarContext";

import styles from "./styles.module.scss";

export function Header() {
  const { openSidebar, closeSidebar, isOpen } = useContext(SidebarContext);

  return (
    <>
      <div className={styles.mainContent}>
        <header>
          <div className={styles.menuToggle}>
            <label htmlFor="">
              <span>
                <BsList />
              </span>
            </label>
          </div>

          <div className={styles.headerIcons}>
            <span>
              <AiOutlineUser />
            </span>
          </div>
        </header>

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
        </main>
      </div>
    </>
  );
}
