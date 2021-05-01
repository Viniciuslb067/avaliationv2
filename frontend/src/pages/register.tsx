import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "../services/api";

import styles from "./register.module.scss";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  async function handleSubmit() {
    await api
      .post("/auth/register", {
        name,
        email,
        password,
        password2,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/");
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
        <title>Evaluator | Register</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.form}>
          <h1>Cadastro</h1>

          <div className={styles.fields}>
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <span></span>
            <label htmlFor="">Nome</label>
          </div>

          <div className={styles.fields}>
            <input
              type="text"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <span></span>
            <label htmlFor="">Email</label>
          </div>

          <div className={styles.fields}>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span></span>
            <label htmlFor="">Senha</label>
          </div>

          <div className={styles.fields}>
            <input
              type="password"
              required
              onChange={(e) => setPassword2(e.target.value)}
            />
            <span></span>
            <label htmlFor="">Confirmar Senha</label>
          </div>

          <button onClick={handleSubmit}>Cadastrar</button>

          <div className={styles.signUpContainer}>
            <p className={styles.signUp}>
              Já possui conta?
              <Link href="/">
                <a> Entrar</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
