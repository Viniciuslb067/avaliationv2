import Link from "next/link";
import Head from "next/head";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { useContext, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { SidebarContext } from "../contexts/SidebarContext";
import { AuthContext } from "../contexts/AuthContext";

import { api } from "../services/api";
import { getAPIClient } from "../services/axios";

import styles from "../styles/assessment.module.scss";

type Assessment = {
  id: string;
  question: string;
  requester: string;
  system: string;
};

type AssessmentProps = {
  allAssessmentOn: Assessment[];
  allAssessmentOff: Assessment[];
};

export default function Assessment({
  allAssessmentOn,
  allAssessmentOff,
}: AssessmentProps) {
  const { isOpen } = useContext(SidebarContext);
  const { user } = useContext(AuthContext);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [requester, setRequester] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [system, setSystem] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  async function getData(id) {
    await api
      .get("/assessment/" + id)
      .then((res) => {
        setQuestion(res.data.question);
        setRequester(res.data.requester);
        setStartDate(res.data.start_date);
        setEndDate(res.data.end_date);
        setSystem(res.data.system);
        setStatus(res.data.status);
      })
      .catch((err) => {
        alert(err);
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
      .put("/assessment/" + uuid, data)
      .then((res) => {
        if (res.data.success) {
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
        alert(err);
      });
  }

  async function deleteAssesssment(id) {
    await api
      .delete("/assessment/" + id)
      .then((res) => {
        if (res.data.success) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/assessment");
        } else {
          const notify = () => toast.error(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  function openModalAndGetId(id) {
    getData(id);
    setUuid(id);
    setIsModalVisible(true);
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
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Solicitante</label>
                <input
                  type="text"
                  required
                  defaultValue={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Data início</label>
                <input
                  type="date"
                  required
                  defaultValue={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Data fim</label>
                <input
                  type="date"
                  required
                  defaultValue={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Sistema</label>
                <select
                  required
                  defaultValue={system}
                  onChange={(e) => setSystem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled
                >
                  <option>{system}</option>
                </select>
              </div>
              <div className={styles.fields}>
                <label htmlFor="">Status</label>
                <select
                  required
                  onChange={(e) => setStatus(e.target.value)}
                  onKeyPress={handleKeyPress}
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

          {user?.role === "user" ? (
            ""
          ) : (
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
          )}
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
                        <td>Sistema</td>
                        {user?.role === "user" ? "" : <td></td>}
                        {user?.role === "user" ? "" : <td></td>}
                        {user?.role === "user" ? "" : <td></td>}
                      </tr>
                    </thead>
                    <tbody>
                      {allAssessmentOn.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.question}</td>
                            <td>{item.requester}</td>
                            <td>{item.system}</td>
                            <td>
                              <Link href={`/metrics/${item.id}`}>
                                <span>
                                  <BsGraphUp size={20} color="blue" />
                                </span>
                              </Link>
                            </td>
                            {user?.role === "user" ? (
                              <td></td>
                            ) : (
                              <>
                                <td>
                                  <span
                                    onClick={() => openModalAndGetId(item.id)}
                                  >
                                    <AiOutlineEdit size={20} color="orange" />
                                  </span>
                                </td>
                                <td>
                                  <span
                                    onClick={() => deleteAssesssment(item.id)}
                                  >
                                    <AiOutlineDelete size={20} color="red" />
                                  </span>
                                </td>
                              </>
                            )}
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
                        <td>Sistema</td>
                        {user?.role === "user" ? "" : <td></td>}
                        {user?.role === "user" ? "" : <td></td>}
                        {user?.role === "user" ? "" : <td></td>}
                      </tr>
                    </thead>
                    <tbody>
                      {allAssessmentOff.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.question}</td>
                            <td>{item.requester}</td>
                            <td>{item.system}</td>
                            <td>
                              <Link href={`/metrics/${item.id}`}>
                                <span>
                                  <BsGraphUp size={20} color="blue" />
                                </span>
                              </Link>
                            </td>
                            {user?.role === "user" ? (
                              <td></td>
                            ) : (
                              <>
                                <td>
                                  <span
                                    onClick={() => openModalAndGetId(item.id)}
                                  >
                                    <AiOutlineEdit size={20} color="orange" />
                                  </span>
                                </td>
                                <td>
                                  <span
                                    onClick={() => deleteAssesssment(item.id)}
                                  >
                                    <AiOutlineDelete size={20} color="red" />
                                  </span>
                                </td>
                              </>
                            )}
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
  const { data } = await apiClient.get("/assessment");

  const assessmentOn = data.assessmentOn.map((item) => {
    return {
      id: item._id,
      question: item.question,
      requester: item.requester,
      system: item.system,
    };
  });

  const assessmentOff = data.assessmentOff.map((item) => {
    return {
      id: item._id,
      question: item.question,
      requester: item.requester,
      system: item.system,
    };
  });

  const allAssessmentOn = assessmentOn;
  const allAssessmentOff = assessmentOff;

  return {
    props: {
      allAssessmentOn,
      allAssessmentOff,
    },
  };
};
