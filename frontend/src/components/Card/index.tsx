import { useContext } from "react";

import { AiOutlineUser, AiOutlineArrowRight } from "react-icons/ai";

import "./styles.module.css";

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
    <div className="">
      <div>
        <h1>{number}</h1>
        <span>{title}</span>
      </div>
      <div>{icon}</div>
    </div>
  );
}
