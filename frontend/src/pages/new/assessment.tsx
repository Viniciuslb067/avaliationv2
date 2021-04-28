import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { api } from "../../services/api";

import styles from "./assessment.module.scss";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function NewAssessment() {
  const [question, setQuestion] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [system, setSystem] = useState("");
  const [systemList, setSystemList] = useState([]);

  useEffect(() => {
    api.get("/system").then((res) => {
      setSystemList(res.data.systems);
    });
  }, []);

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
            {systemList.map((val, key) => {
              return <option key={key}>{val.name}</option>;
            })}
            </select>
          </div>
          <button onClick={handleSubmit}>Criar</button>
        </div>
      </div>
    </>
  );
}
