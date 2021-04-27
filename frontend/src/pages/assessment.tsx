import { GetStaticProps } from "next";
import { useContext, useEffect, useState } from "react";

import { SidebarContext } from "../contexts/SidebarContext";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs"
import { api } from "../services/api";

import styles from "./styles.module.scss";

export default function Assessment({ allAvaliationOn, allAvaliationOff }) {
  const { isOpen } = useContext(SidebarContext);

  return (
    <>
      <main
        className={isOpen ? styles.mainContainer : styles.mainContainerHide}
      >
        <div className={styles.pageHeader}>
          <div>
            <h1>Avaliações</h1>
            <small>
              Aqui você tem acesso a todas as avaliações e suas estatísticas.
            </small>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.table}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Avaliações Ativas</h3>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.tableResponsive}>
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Título Avaliação</td>
                        <td>Departamento</td>
                        <td>Status</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {allAvaliationOn.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.question}</td>
                            <td>{item.requester}</td>
                            <td>{item.status}</td>
                            <td><AiOutlineEdit size={20} color="orange"/></td>
                            <td><BsGraphUp size={20} color="blue"/></td>
                            <td><AiOutlineDelete size={20} color="red"/></td> 
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.table}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Avaliações Desativadas</h3>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.tableResponsive}>
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Título Avaliação</td>
                        <td>Departamento</td>
                        <td>Status</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {allAvaliationOff.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.question}</td>
                            <td>{item.requester}</td>
                            <td>{item.status}</td>
                            <td><AiOutlineEdit size={20} color="orange"/></td>
                            <td><BsGraphUp size={20} color="blue"/></td>
                            <td><AiOutlineDelete size={20} color="red"/></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/avaliation");

  const avaliationOn = data.avaliationOn.map((item) => {
    return {
      question: item.question,
      requester: item.requester,
      status: item.status,
    };
  });

  const avaliationOff = data.avaliationOff.map((item) => {
    return {
      question: item.question,
      requester: item.requester,
      status: item.status,
    };
  });

  const allAvaliationOn = avaliationOn;
  const allAvaliationOff = avaliationOff;

  return {
    props: {
      allAvaliationOn,
      allAvaliationOff,
    },
  };
};
