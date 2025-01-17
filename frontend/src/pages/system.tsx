import Link from "next/link";
import Head from "next/head";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { useContext, useState } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { Modal } from "antd";
import { toast } from "react-toastify";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";

import { api } from "../services/api";
import { parseCookies } from "nookies";
import { getAPIClient } from "../services/axios";

import styles from "../styles/system.module.scss";

type System = {
  id: string;
  dns: string;
  name: string;
  area: string;
};

type SystemProps = {
  system: System[];
};

export default function System({ system }: SystemProps) {
  const { isOpen } = useContext(SidebarContext);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [dns, setDns] = useState<string>("");
  const [department, setDepartment] = useState<string>("");

  async function getData(id) {
    await api
      .get("/system/" + id)
      .then((res) => {
        setName(res.data.name);
        setDns(res.data.dns);
        setDepartment(res.data.area);
      })
      .catch((err) => {
        alert(err);
      });
  }

  async function handleSubmit() {
    const data = {
      name: name,
      dns: dns,
      area: department,
    };

    await api
      .put("/system/update/" + uuid, data)
      .then((res) => {
        if (res.data.success) {
          const notify = () => toast.success(res.data.success);
          notify();
          setIsModalVisible(false);
          Router.push("/system");
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

  async function deleteSystem(id) {
    await api
      .delete("/system/delete/" + id)
      .then((res) => {
        if (res.data.success) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/system");
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
        <title>Feedback | Systems</title>
      </Head>
      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Sistemas</h1>
            <small>Aqui você tem acesso a todos os sistemas cadastrados.</small>
          </div>

          <Modal
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => setIsModalVisible(false)}
            okText="Editar"
            cancelText="Cancelar"
          >
            <div className={styles.modalContainer}>
              <h1>Editar Sistema</h1>
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
                <label htmlFor="">DNS</label>
                <input
                  type="text"
                  required
                  defaultValue={dns}
                  onChange={(e) => setDns(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Departamento</label>
                <input
                  type="text"
                  required
                  defaultValue={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>
          </Modal>

          <div className={styles.headerActions}>
            <Link href="/new/system">
              <button>
                <span>
                  <IoMdAdd color="white" />
                </span>
                <span className={styles.text}>Sistema</span>
              </button>
            </Link>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.table}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Sistemas Cadastrados</h3>
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
                              <span onClick={() => openModalAndGetId(item.id)}>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ["feedback.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { data } = await apiClient.get("/system");

  const system = data.systems.map((item) => {
    return {
      id: item._id,
      dns: item.dns,
      name: item.name,
      area: item.area,
    };
  });

  return {
    props: {
      system,
    },
  };
};
