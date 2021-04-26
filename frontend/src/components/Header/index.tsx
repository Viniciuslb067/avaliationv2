import { useContext } from "react";

import { BsList } from "react-icons/bs";
import { AiOutlineUser, AiOutlineArrowRight } from "react-icons/ai";
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


      </div>
    </>
  );
}
