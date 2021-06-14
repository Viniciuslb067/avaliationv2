import Head from "next/head";
import Router from "next/router";
import { toast } from "react-toastify";
import { useState } from "react";
import { verifyToken } from "../../contexts/AuthContext"

import { api } from "../../services/api";

import styles from "./system.module.scss";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function NewSystem() {
  verifyToken();
  const [dns, setDns] = useState("");
  const [name, setName] = useState("");
  const [area, setArea] = useState("");

  async function handleSubmit() {
    await api
      .post("/system", {
        dns,
        name,
        area,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/dashboard");
        } else {
          const notify = () => toast.error(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
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
        <title>Feedback | New system</title>
      </Head>
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h1>Cadastrar Sistema</h1>

            <div className={styles.fields}>
              <label htmlFor="">DNS</label>
              <input
                type="text"
                required
                onChange={(e) => setDns(e.target.value)}
                onKeyPress={handleKeypress}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Nome</label>
              <input
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeypress}
              />
              <span></span>
            </div>

            <div className={styles.fields}>
              <label htmlFor="">Departamento</label>
              <input
                type="text"
                required
                onChange={(e) => setArea(e.target.value)}
                onKeyPress={handleKeypress}
              />
              <span></span>
            </div>

            <button onClick={handleSubmit}>Criar</button>
          </div>
        </div>
      </main>
    </>
  );
}
