import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { verifyToken } from "../../contexts/AuthContext";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Layout,
  Form,
  Radio,
  Cascader,
  Input,
  Select,
  TreeSelect,
  DatePicker,
  Switch,
  InputNumber,
} from "antd";

import { api } from "../../services/api";

import styles from "./assessment.module.scss";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface System {
  name: string;
  system: [];
}

export default function NewAssessment({ systemData }) {
  verifyToken();
  const [form, setForm] = useState([]);
  const [question, setQuestion] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [system, setSystem] = useState("");

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some((item) => item.Question === "");

    if (someEmpty) {
      form.map((item, index) => {
        const allPrev = [...form];

        if (form[index].Question === "") {
          allPrev[index].errors.Question = "Preencha o campo de pergunta";
        }

        setForm(allPrev);
      });
    }
    return !someEmpty;
  };

  const handleAddInput = (event) => {
    event.preventDefault();
    const inputState = {
      Question: "",
    };
    if (prevIsValid()) {
      setForm((prev) => [...prev, inputState]);
    }
  };

  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();

    setForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }
        return {
          ...item,
          [event.target.name]: event.target.value,

         
        };
      });
    });
  };

  const handleRemoveField = (e, index) => {
    e.preventDefault();
    setForm((prev) => prev.filter((item) => item !== prev[index]));
  };


  async function handleSubmit() {
    await api
      .post("/avaliation", {
        question: form,
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

  console.log(form)
  
  return (
    <>
      <Head>
        <title> Feedback | Criar nova Avaliação </title>
      </Head>

      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h1>Criar Avaliação</h1>

            <div className={styles.fields}>
              <label htmlFor="">Título</label>
              <Input
                type="text"
                required
                onChange={(e) => setQuestion(e.target.value)}
              />
              <span></span>
            </div>

            {form.map((item, index) => {
              return (
                <div
                key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Input
                      style={{
                        width: "100%",
                        marginBottom: 10,
                        marginRight: "35rem",
                      }}
                      type="text"
                      className={styles.fields }
                      name="Question"
                      placeholder="Pergunta"
                      value={item.Question}
                      onChange={(e) => onChange(index, e)}
                    />


                  </div>

                  <Button
                    style={{ marginBottom: 10 }}
                    onClick={(e) => handleRemoveField(e, index)}
                    danger
                  >
                    X
                  </Button>
                </div>
              );
            })}

            <Button onClick={handleAddInput}>Adicionar nova pergunta</Button>

            <div className={styles.fields}>
              <label htmlFor="">Solicitante</label>
              <Input
                placeholder="Exemplo: DTI"
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
                style={{ width: "100%" }}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Data fim</label>
              <input
                type="date"
                style={{ width: "100%" }}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Sistema</label>
              <select
                style={{ width: "100%" }}
                onChange={(e) => setSystem(e.target.value)}
              >
                <option></option>
                {systemData.map((item, key) => {
                  return <option key={key}>{item.dns}</option>;
                })}
              </select>
            </div>
        
              <Button onClick={handleSubmit}>Próximo</Button>
          </div>
        </div>
      </main>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
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
  };
};
