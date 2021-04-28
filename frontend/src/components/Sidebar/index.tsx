import Link from "next/link";
import { useContext, useState } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";

import { AiOutlineBell, AiOutlineHome } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { RiComputerLine } from "react-icons/ri";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

import styles from "./styles.module.scss";

export function Sidebar() {
  const { isOpen } = useContext(SidebarContext);

  return (
    <>
      <div className={isOpen ? styles.sidebar : styles.sidebarHide}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandFlex}>
            <span>
              <BiUser />
            </span>
            <div className={styles.brandIcons}>
              <span>
                <AiOutlineBell />
              </span>
              <span>
                <FaUserCircle />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.sidebarMain}>
          <div className={styles.sidebarUser}>
            <img src="/logo.png" alt="Logo INSS" />
            <div>
              <h3>Vinicius Lima</h3>
              <span>vinicius@gmail.com</span>
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
                <a href="">
                  <span>
                    <HiOutlineUsers />
                  </span>
                  Usuários
                </a>
              </li>
              <li>
                <a>
                  <span>
                    <RiComputerLine />
                  </span>
                  Sistemas
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
