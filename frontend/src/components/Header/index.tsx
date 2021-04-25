import { BsList } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <BsList className={styles.list} size={38} />
      <AiOutlineUser className={styles.user} size={32} />
    </header>
  );
}
