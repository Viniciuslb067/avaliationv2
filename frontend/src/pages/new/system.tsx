import Head from "next/head";
import Router from "next/router";
import { toast } from "react-toastify";
import { useState } from "react";
import { GetServerSideProps } from "next";

import { parseCookies } from "nookies";
import { api } from "../../services/api";
// import { getAPIClient } from "../../services/axios";

import styles from "./system.module.scss";

export default function NewSystem() {
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
              <span>DNS</span>
              <input
                type="text"
                required
                onChange={(e) => setDns(e.target.value)}
                onKeyPress={handleKeypress}
              />
            </div>

            <div className={styles.fields}>
              <span>Nome</span>
              <input
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeypress}
              />
            </div>

            <div className={styles.fields}>
              <span>Departamento</span>
              <input
                type="text"
                required
                onChange={(e) => setArea(e.target.value)}
                onKeyPress={handleKeypress}
              />
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
  // const apiClient = getAPIClient(ctx); Requisição lado servidor next
  const { ["feedback.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
