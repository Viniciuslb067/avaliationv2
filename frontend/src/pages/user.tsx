import Router from "next/router";
import Head from "next/head";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { GetStaticProps, GetServerSideProps } from "next";
import { verifyToken } from "../contexts/AuthContext"
import { SidebarContext } from "../contexts/SidebarContext";
import { useContext, useState } from "react";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { api } from "../services/api";

import styles from "../styles/system.module.scss";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

toast.configure();

type User = {
  id: string,
  name: string,
  email: string,
}

type UserProps = {
  user: User[];
}

export default function User({ user }: UserProps) {
  verifyToken();
  const { isOpen } = useContext(SidebarContext);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [access, setAccess] = useState<string>("");

  async function getData(id) {
    await api
      .get("/user/" + id)
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
        setRole(res.data.role);
        setAccess(res.data.access);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async function handleSubmit() {
    const data = {
      name: name,
      email: email,
      role: role,
      access: access,
    };

    await api
      .put("/user/" + uuid, data)
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          setIsModalVisible(false);
          Router.push("/user");
        } else {
          const notify = () => toast.warning(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  function openModalAndGetId(id) {
    getData(id);
    setUuid(id);
    setIsModalVisible(true);
  }

  async function deleteUser(id) {
    await api
      .delete("/user/" + id)
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
        throw new Error(err);
      });
  }

  return (
    <>
      <Head>
        <title>Feedback | Users</title>
      </Head>
      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Usuários</h1>
            <small>Aqui você tem acesso a todos os usuários cadastrados.</small>
          </div>

          <Modal
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => setIsModalVisible(false)}
            okText="Editar"
            cancelText="Cancelar"
          >
            <div className={styles.modalContainer}>
              <h1>Editar Usuário</h1>
              <div className={styles.fields}>
                <label htmlFor="">Nome</label>
                <input
                  type="text"
                  required
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  required
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Função</label>
                <input
                  type="text"
                  required
                  defaultValue={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Status</label>
                <select
                  required
                  defaultValue={access}
                  onChange={(e) => setAccess(e.target.value)}
                >
                  {access === "Pendente" ? (
                    <>
                      <option>Pendente</option>
                      <option>Liberado</option>
                    </>
                  ) : (
                    <>
                      <option>Liberado</option>
                      <option>Pendente</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </Modal>
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
                            <td>
                              <span onClick={() => openModalAndGetId(item.id)}>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get("/user");

  const user = data.users.map((item) => {
    return {
      id: item._id,
      name: item.name,
      email: item.email,
    };
  });

  return {
    props: {
      user,
    }
  };
};