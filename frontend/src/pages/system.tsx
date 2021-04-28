import Link from "next/link";
import Router from "next/router";
import { GetStaticProps } from "next";
import { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { toast } from "react-toastify";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";

import styles from "./system.module.scss";

import { api } from "../services/api";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function System({ system }) {
  const { isOpen } = useContext(SidebarContext);

  async function deleteSystem(id) {
    await api.delete("/system/" + id)
    .then((res) => {
      if (res.data.status === 1) {
        const notify = () => toast.success(res.data.success);
        notify();
        Router.push("/system");
      } else {
        const notify = () => toast.warning(res.data.error);
        notify();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Sistemas</h1>
            <small>
              Aqui você tem acesso a todas os sistemas cadastrados.
            </small>
          </div>

          <div className={styles.headerActions}>
            <Link href="/new/system">
              <button>
                <span><IoMdAdd color="white" /></span>
                <span className={styles.text}>Sistema</span>
              </button>
            </Link>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.table}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Avaliações Ativas</h3>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.tableResponsive}>
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Nome</td>
                        <td>DNS</td>
                        <td>Departamento</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {system.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.name}</td>
                            <td>{item.dns}</td>
                            <td>{item.area}</td>
                            <td>
                              <span>
                                <AiOutlineEdit size={20} color="orange" />
                              </span>
                            </td>
                            <td>
                              <span onClick={() => deleteSystem(item.id)}>
                                <AiOutlineDelete size={20} color="red" />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/system");

  const system = data.systems.map((item) => {
    return {
      id: item._id,
      dns: item.dns,
      name: item.name,
      area: item.area,
    }
  })

  return {
    props: {
      system,
    },
  };
};
