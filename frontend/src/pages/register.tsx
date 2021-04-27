import Link from "next/link";

import styles from "./register.module.scss";

export default function Register() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <h1>Cadastro</h1>

          <div className={styles.fields}>
            <input type="text" required />
            <span></span>
            <label htmlFor="">Nome</label>
          </div>

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

          <div className={styles.fields}>
            <input type="password" required />
            <span></span>
            <label htmlFor="">Confirmar Senha</label>
          </div>

          <button>Cadastrar</button>

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
