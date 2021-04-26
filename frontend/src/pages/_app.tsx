import "../styles/global.css";

import { useState } from "react";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";

import styles from "../styles/app.module.css";

function MyApp({ Component, pageProps }) {
  const [isOpen, setIsOpen] = useState(false);

  function openSidebar() {
    setIsOpen(true);
  }

  function closeSidebar() {
    setIsOpen(false);
  }

  return (
    <SidebarContext.Provider value={{ isOpen, closeSidebar, openSidebar }}>
      <div className={styles.wrapper}>
        <Sidebar />
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export default MyApp;
