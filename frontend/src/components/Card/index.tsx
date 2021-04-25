import { useContext } from "react";

import { Button } from 'react-bootstrap';

import { AiOutlineUser, AiOutlineArrowRight } from "react-icons/ai";

import styles from "./styles.module.scss";

interface CardProps {
  title: string;
  number: number;
  icon: {};
}

const icons = {
  user: <AiOutlineArrowRight />,
};

export function Card({ title, icon, number }: CardProps) {
  return (
    <div className={styles.card}>
      <div>
        <h1>{number}</h1>
        <span>{title}</span>
      </div>
      <div>{icon}</div>
    </div>
  );
}
