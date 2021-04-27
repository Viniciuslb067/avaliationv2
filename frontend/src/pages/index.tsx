import Link from "next/link";
import Router from "next/router";
import { useState } from "react";

import { toast } from "react-toastify";

import { login } from "../services/auth";
import { api } from "../services/api";

import styles from "./index.module.scss";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function handleSubmit() {
    await api.post("/auth/authenticate", { email, password }).then((res) => {
      if (res.data.status === 1) {
        login(res.data.token);
        Router.push("/dashboard");
      } else {
        const notify = () => toast.warning(res.data.error);
        notify();
      }
    });
  }

  return (
    <>
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
