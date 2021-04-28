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

export default function User({ user }) {
  const { isOpen } = useContext(SidebarContext);

  async function deleteUser(id) {
    await api.delete("/user/" + id)
    .then((res) => {
      if (res.data.status === 1) {
        const notify = () => toast.success(res.data.success);
        notify();
        Router.push("/user");
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
            <h1>Usuários</h1>
            <small>
              Aqui você tem acesso a todos os usuários cadastrados.
            </small>
          </div>

        </div>
        <div className={styles.grid}>
          <div className={styles.table}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Usuários Cadastrados</h3>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.tableResponsive}>
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Nome</td>
                        <td>Email</td>
                        <td>Função</td>
                        <td>Acesso</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {user.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.role}</td>
                            <td>{item.access}</td>
                            <td>
                              <span>
                                <AiOutlineEdit size={20} color="orange" />
                              </span>
                            </td>
                            <td>
                              <span onClick={() => deleteUser(item.id)}>
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
  const { data } = await api.get("/user");

  const user = data.users.map((item) => {
    return {
      id: item._id,
      role: item.role,
      access: item.access,
      name: item.name,
      email: item.email,
    }
  })

  return {
    props: {
      user,
    },
  };
};
