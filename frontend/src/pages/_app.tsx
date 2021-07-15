import "../styles/global.scss";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import axios from "axios";
import https from "https";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";
import { AuthProvider } from "../contexts/AuthContext";

import styles from "../styles/app.module.scss";

axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

toast.configure();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const showHeaderAndSidebar =
    router.pathname === "/" ||
    router.pathname === "/register" ||
    router.pathname === "/assess/[slug]";
  const [isOpen, setIsOpen] = useState(false);

  function openSidebar() {
    setIsOpen(true);
  }

  function closeSidebar() {
    setIsOpen(false);
  }

  return (
    <AuthProvider>
      <SidebarContext.Provider value={{ isOpen, closeSidebar, openSidebar }}>
        <div className={styles.wrapper}>
          {!showHeaderAndSidebar && <Sidebar />}
          <main>
            {!showHeaderAndSidebar && <Header />}
            <Component {...pageProps} />
          </main>
        </div>
      </SidebarContext.Provider>
    </AuthProvider>
  );
}

export default MyApp;
