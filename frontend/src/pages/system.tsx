import Link from "next/link";
import Router from "next/router";
import { GetStaticProps } from "next";
import { useContext, useState } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { Modal } from "antd";
import { toast } from "react-toastify";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";

import styles from "./system.module.scss";

import { api } from "../services/api";

import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

toast.configure();

export default function System({ system }) {
  const { isOpen } = useContext(SidebarContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uuid, setUuid] = useState("");
  const [question, setQuestion] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  async function getData(id) {
    await api
      .get("/avaliation/" + id)
      .then((res) => {
        setQuestion(res.data.question);
        setRequester(res.data.requester);
        setStartDate(res.data.startDate);
        setEndDate(res.data.endDate);
        setStatus(res.data.status);
        console.log()
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleSubmit() {
    const data = {
      question: question,
      requester: requester,
      start_date: startDate,
      end_date: endDate,
      status: status,
    };

    await api
      .put("/avaliation/" + uuid, data)
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          setIsModalVisible(false)
          Router.push("/assessment");
        } else {
          const notify = () => toast.warning(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function openModalAndGetId(id) {
    getData(id);
    setUuid(id)
    setIsModalVisible(true);
  }

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
              Aqui você tem acesso a todos os sistemas cadastrados.
            </small>
          </div>

          <Modal
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => setIsModalVisible(false)}
            okText="Editar"
            cancelText="Cancelar"
          >
            <div className={styles.modalContainer}>
              <h1>Editar</h1>
              <div className={styles.fields}>
                <label htmlFor="">Pergunta</label>
                <input
                  type="text"
                  required
                  defaultValue={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Solicitante</label>
                <input
                  type="text"
                  required
                  defaultValue={requester}
                  onChange={(e) => setRequester(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Data início</label>
                <input
                  type="date"
                  required
                  defaultValue={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Data fim</label>
                <input
                  type="date"
                  required
                  defaultValue={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Status</label>
                <select
                  required
                  defaultValue={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Ativada</option>
                  <option>Desativada</option>
                </select>
              </div>
            </div>
          </Modal>

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
