import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import { useState, useContext } from "react";
import { AiFillHome } from "react-icons/ai";
import { AuthContext } from "../contexts/AuthContext";

import styles from "../styles/index.module.scss";
import { GetServerSideProps } from "next";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { "feedback.token": token } = parseCookies();
  
  const { signIn } = useContext(AuthContext);

  async function handleSubmit() {
    const data = {
      email,
      password,
    };
    await signIn(data);
  }

  useEffect(() => {
    async function verifyIsAuthenticated() {
      if(token && router.pathname === "/") {
        Router.push("/dashboard")
      }
    }
    verifyIsAuthenticated();
  }, []);

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <Head>
        <title> Feedback | Login</title>
      </Head>

      <AiFillHome size={60} color="#fff" />

      <div className={styles.container}>
        <div className={styles.form}>
          <p>Login</p>

          <div className={styles.fields}>
            <input
              type="text"
              required
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeypress}
            />
            <span></span>
            <label htmlFor="">Email</label>
          </div>

          <div className={styles.fields}>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeypress}
            />
            <span></span>
            <label htmlFor="">Senha</label>
          </div>

          <button onClick={handleSubmit} type="submit">
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const apiClient = getAPIClient(ctx); Requisição lado servidor next
  const { ["feedback.token"]: token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};