import Head from "next/head";
import { useState, useContext } from "react";
import { AiFillHome } from "react-icons/ai";
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