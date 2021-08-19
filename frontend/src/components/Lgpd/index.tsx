import { parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import {
  browserName,
  browserVersion,
  osName,
  osVersion,
} from "react-device-detect";

import { api } from "../../services/api";
import styles from "./styles.module.scss";

export function Lgpd() {
  const [accept, setAccept] = useState<boolean>(false);

  useEffect(() => {
    const { ["feedback.lgpd"]: lgpd } = parseCookies();
    if (lgpd) {
      setAccept(true);
    } else {
      setAccept(false);
    }
  }, []);

  const acceptCookies = async () => {

    const { data: {token} } = await api.post("/auth/terms", {
      osName,
      osVersion,
      browserName,
      browserVersion
    })

    setCookie(undefined, "feedback.lgpd", token, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    setAccept(true);
  };

  return (
    <>
      {accept ? (
        ""
      ) : (
        <div className={styles.lgpd}>
          <div className={styles.lgpdLeft}>
            Nós utilizamos cookies para melhorar sua experiência do usuário
            <br />
            Para conferir detalhadamente todos os cookies utilizados, leia nossa{" "}
            <a href="">política de privacidade</a>
          </div>
          <div className={styles.lgpdRight}>
            <button onClick={acceptCookies}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
