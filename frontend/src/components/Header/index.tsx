import { useContext } from "react";

import { BsList } from "react-icons/bs";
import { AiOutlineUser, AiOutlineArrowRight } from "react-icons/ai";

import { SidebarContext } from "../../contexts/SidebarContext";
 
import styles from "./styles.module.scss";

export function Header() {
  const { openSidebar, closeSidebar, isOpen } = useContext(SidebarContext)

  return (
    <header className={styles.headerContainer}>
      {isOpen ? (
        <AiOutlineArrowRight
          size={38}
          onClick={() => closeSidebar(false)}
          className={styles.icon}
        />
      ) : (
        <BsList
          className={styles.icon}
          size={38}
          onClick={() => openSidebar(true)}
        />
      )}
      <AiOutlineUser className={styles.user} size={32} />
    </header>
  );
}
