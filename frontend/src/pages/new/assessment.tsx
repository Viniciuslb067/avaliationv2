import Head from "next/head";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "../../services/api";

import styles from "./assessment.module.scss";

import "react-toastify/dist/ReactToastify.css";
import { parseCookies } from "nookies";
import { getAPIClient } from "../../services/axios";

toast.configure();

export default function NewAssessment({ systemData }) {
  
  const [question, setQuestion] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [system, setSystem] = useState("");

  async function handleSubmit() {
    await api
      .post("/avaliation", {
        question,
        requester,
        start_date: startDate,
        end_date: endDate,
        system,
      })
      .then((res) => {
        if (res.data.success) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/dashboard");
        } else {
          const notify = () => toast.error(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        alert(err)
      });
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      <Head>
        <title>Feedback | New assessment</title>
      </Head>

      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h1>Criar Avaliação</h1>

            <div className={styles.fields}>
              <span>Pergunta :</span>
              <input
                type="text"
                required
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeypress}
              />
            </div>

            <div className={styles.fields}>
              <span>Solicitante :</span>
              <input
                type="text"
                required
                onChange={(e) => setRequester(e.target.value)}
                onKeyPress={handleKeypress}
              />
            </div>

            <div className={styles.fields}>
              <span>Data início :</span>
              <input
                type="date"
                required
                onChange={(e) => setStartDate(e.target.value)}
                onKeyPress={handleKeypress}
              />
            </div>

            <div className={styles.fields}>
              <span>Data fim :</span>
              <input
                type="date"
                required
                onChange={(e) => setEndDate(e.target.value)}
                onKeyPress={handleKeypress}
              />
            </div>

            <div className={styles.fields}>
              <span>Sistema :</span>
              <select
                required
                onChange={(e) => setSystem(e.target.value)}
                onKeyPress={handleKeypress}
              >
                <option></option>
                {systemData.map((item, key) => {
                  return <option key={key}>{item.dns}</option>;
                })}
              </select>
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={handleSubmit}>Enviar</button>
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

  const systems = data.systems.map((item) => {
    return {
      name: item.name,
      dns: item.dns,
    };
  });

  const systemData = systems;

  return {
    props: {
      systemData,
    },
  };
};
