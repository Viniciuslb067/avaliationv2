import stlyes from "./styles.module.scss";

import { SiderbarData } from "./data";

export function Sidebar() {
  return (
    <div className={stlyes.sidebarContainer}>
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
