import { useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/global.scss";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SidebarContext } from "../contexts/SidebarContext"

import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {
  const [isOpen, setIsOpen] = useState(false);

  function openSidebar(value) {
    setIsOpen(value);
  }

  function closeSidebar(value) {
    setIsOpen(value);
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
