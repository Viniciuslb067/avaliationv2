import Link from "next/link";
import Head from "next/head";
import Router from "next/router";
import { GetStaticProps, GetServerSideProps } from "next";
import { useContext, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";

import { verifyToken } from "../contexts/AuthContext";
import { SidebarContext } from "../contexts/SidebarContext";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";

import { api } from "../services/api";

import styles from "./assessment.module.scss";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

toast.configure();

export default function Assessment({
  allAvaliationOn,
  allAvaliationOff,
  allSystem,
}) {
  verifyToken();
  const { isOpen } = useContext(SidebarContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uuid, setUuid] = useState("");
  const [question, setQuestion] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [system, setSystem] = useState("");
  const [status, setStatus] = useState("");

  async function getData(id) {
    await api
      .get("/avaliation/" + id)
      .then((res) => {
        setQuestion(res.data.question);
        setRequester(res.data.requester);
        setStartDate(res.data.start_date);
        setEndDate(res.data.end_date);
        setSystem(res.data.system);
        setStatus(res.data.status);
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
          setIsModalVisible(false);
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
    setUuid(id);
    setIsModalVisible(true);
  }

  async function deleteAssesssment(id) {
    await api
      .delete("/avaliation/" + id)
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
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

  return (
    <>
      <Head>
        <title>Feedback | Assessments</title>
      </Head>

      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Avaliações</h1>
            <small>
              Aqui você tem acesso a todas as avaliações e suas estatísticas.
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
              <h1>Editar Avaliação</h1>
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
                <label htmlFor="">Sistema</label>
                <select
                  required
                  defaultValue={system}
                  onChange={(e) => setSystem(e.target.value)}
                >
                  <option>{system}</option>
                </select>
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Status</label>
                <select
                  required
                  defaultValue={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {status === "Desativada" ? (
                    <>
                      <option>Desativada</option>
                      <option>Ativada</option>
                    </>
                  ) : (
                    <>
                      <option>Ativada</option>
                      <option>Desativada</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </Modal>

          <div className={styles.headerActions}>
            <Link href="/new/assessment">
              <button>
                <span>
                  <IoMdAdd color="white" />
                </span>
                <span className={styles.text}>Avaliação</span>
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
                        <td>Título Avaliação</td>
                        <td>Departamento</td>
                        <td>Status</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {allAvaliationOn.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.question}</td>
                            <td>{item.requester}</td>
                            <td>{item.status}</td>
                            <td>
                              <span onClick={() => openModalAndGetId(item.id)}>
                                <AiOutlineEdit size={20} color="orange" />
                              </span>
                            </td>
                            <td>
                              <Link href={`/metrics/${item.id}`}>
                                <span>
                                  <BsGraphUp size={20} color="blue" />
                                </span>
                              </Link>
                            </td>
                            <td>
                              <span onClick={() => deleteAssesssment(item.id)}>
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

          <div className={styles.table}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Avaliações Desativadas</h3>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.tableResponsive}>
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Título Avaliação</td>
                        <td>Departamento</td>
                        <td>Status</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {allAvaliationOff.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.question}</td>
                            <td>{item.requester}</td>
                            <td>{item.status}</td>
                            <td>
                              <span onClick={() => openModalAndGetId(item.id)}>
                                <AiOutlineEdit size={20} color="orange" />
                              </span>
                            </td>
                            <td>
                              <Link href={`/metrics/${item.id}`}>
                                <span>
                                  <BsGraphUp size={20} color="blue" />
                                </span>
                              </Link>
                            </td>
                            <td>
                              <span onClick={() => deleteAssesssment(item.id)}>
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
  const { data } = await api.get("/avaliation");
  const systems = await api.get("/system");

  const avaliationOn = data.avaliationOn.map((item) => {
    return {
      id: item._id,
      requester: item.requester,
      status: item.status,
    };
  });
  
  const avaliationOff = data.avaliationOff.map((item) => {
    return {
      id: item._id,
      question: item.question,
      requester: item.requester,
      status: item.status,
    };
  });

  const system = systems.data.systems.map((item) => {
    return {
      dns: item.dns
    };
  });

  const allAvaliationOn = avaliationOn;
  const allAvaliationOff = avaliationOff;
  const allSystem = system;

  return {
    props: {
      allAvaliationOn,
      allAvaliationOff,
      allSystem,
    }
  };
};
