import Link from "next/link";
import { useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import { AuthContext } from "../../contexts/AuthContext";

import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi";
import { VscGraph } from "react-icons/vsc";
import { RiComputerLine } from "react-icons/ri";

import styles from "./styles.module.scss";

export function Sidebar() {
  const { isOpen } = useContext(SidebarContext);
  const { user } = useContext(AuthContext)

  return (
    <>
      <div className={isOpen ? styles.sidebar : styles.sidebarHide}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandFlex}>
            <span>
            </span>
            <div className={styles.brandIcons}>
              <span>
              </span>
              <span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.sidebarMain}>
          <div className={styles.sidebarUser}>
            <img src="/logo.png" alt="Logo INSS" />
            <div>
              <h3>{user?.name.split(".")[0]} 😃 </h3>
            </div>
          </div>

          <div className={styles.sidebarMenu}>
            <div className={styles.menuHead}>
              <span>Dashboard</span>
            </div>
            <ul>
              <li>
                <Link href="/dashboard">
                  <a>
                    <span>
                      <AiOutlineHome />
                    </span>
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/assessment">
                  <a>
                    <span>
                      {" "}
                      <VscGraph />{" "}
                    </span>
                    Avaliações
                  </a>
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/user">
                  <a>
                    <span>
                      <HiOutlineUsers />
                    </span>
                    Usuários
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/system">
                  <a>
                    <span>
                      <RiComputerLine />
                    </span>
                    Sistemas
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
