import "../styles/global.scss";

import { useState } from "react";
import { useRouter } from "next/router"

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";

import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const showHeaderAndSidebar = router.pathname === '/' ||  router.pathname === '/login' ? false : true;
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
        {showHeaderAndSidebar && <Sidebar />}
        <main>
          {showHeaderAndSidebar && <Header />}
          <Component {...pageProps} />
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export default MyApp;
