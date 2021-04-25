import { useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";

import { SiderbarData } from "./data";

import stlyes from "./styles.module.scss";

export function Sidebar() {

  const { isOpen } = useContext(SidebarContext)

  return (
    <div  className={isOpen ? stlyes.sidebarContainer : stlyes.sidebarHide}>

      <header className={stlyes.sidebarHeader}>
  
        <strong>INSS</strong>
      </header>
      <ul className={stlyes.sidebarList}>
        {SiderbarData.map((item, key) => {
          return (
            <li key={key}>
              <div id={stlyes.icon}>{item.icon}</div>
              <div id={stlyes.title}>{item.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
