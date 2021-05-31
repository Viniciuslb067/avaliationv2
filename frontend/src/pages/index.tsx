import Link from "next/link";
import Head from "next/head";
import { useState, useContext } from "react";
import { toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContext";

import styles from "../styles/index.module.scss";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit() {
    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <>
      <Head>
        <title>Feedback | Login</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.form}>
          <h1>Login</h1>

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

          <button onClick={handleSubmit}>Login</button>
          <div className={styles.signUpContainer}>
            <p className={styles.signUp}>
              Não possui conta?
              <Link href="/register">
                <a> Cadastrar</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
