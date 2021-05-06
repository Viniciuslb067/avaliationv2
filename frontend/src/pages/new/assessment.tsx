import Head from "next/head";
import Router from "next/router";
import { GetStaticProps } from "next";
import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "../../services/api";

import styles from "./assessment.module.scss";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface System {
  name: string;
  system: [];
}

interface SystemProps {
  systemData: System;
}

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
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/dashboard");
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
        <title>Evaluator | New assessment</title>
      </Head>

      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h1>Criar Avaliação</h1>

            <div className={styles.fields}>
              <label htmlFor="">Pergunta</label>
              <input
                type="text"
                required
                onChange={(e) => setQuestion(e.target.value)}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Solicitante</label>
              <input
                type="text"
                required
                onChange={(e) => setRequester(e.target.value)}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Data início</label>
              <input
                type="date"
                required
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Data fim</label>
              <input
                type="date"
                required
                onChange={(e) => setEndDate(e.target.value)}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Sistema</label>
              <select required onChange={(e) => setSystem(e.target.value)}>
                <option></option>
                {systemData.map((item, key) => {
                  return <option key={key}>{item.dns}</option>;
                })}
              </select>
            </div>
            <button onClick={handleSubmit}>Criar</button>
          </div>
        </div>
      </main>
    </>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/system");

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
    revalidate: 1,
  };
};
