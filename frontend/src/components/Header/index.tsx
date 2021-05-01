import { useContext } from "react";

import { BsList } from "react-icons/bs";
import { AiOutlineUser, AiOutlineArrowRight } from "react-icons/ai";
import { SidebarContext } from "../../contexts/SidebarContext";

import styles from "./styles.module.scss";

export function Header() {
  const { openSidebar, closeSidebar, isOpen } = useContext(SidebarContext);

  return (
    <>
      <div className={isOpen ? styles.mainContent : styles.mainContentHide}>
        <header>
          <div className={styles.menuToggle}>
            <label htmlFor={styles.mainContentHide}>
              <span>
                {isOpen ? (
                  <AiOutlineArrowRight onClick={() => closeSidebar()} />
                ) : (
                  <BsList onClick={() => openSidebar()} />
                )}
              </span>
            </label>
          </div>

          <div className={styles.headerIcons}>
            <button> 
              Logout
            </button>
          </div>
        </header>
      </div>
    </>
  );
}
