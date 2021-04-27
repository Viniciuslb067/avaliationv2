import Link from "next/link"

import styles from "./index.module.scss";

export default function Login() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <h1>Login</h1>

          <div className={styles.fields}>
            <input type="text" required />
            <span></span>
            <label htmlFor="">Email</label>
          </div>

          <div className={styles.fields}>
            <input type="password" required />
            <span></span>
            <label htmlFor="">Senha</label>
          </div>

          <button>Login</button>

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
