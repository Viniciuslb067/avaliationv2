import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { verifyToken } from "../../contexts/AuthContext";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Layout,
  Form,
  Radio,
  Cascader,
  Input,
  Select,
  TreeSelect,
  DatePicker,
  Switch,
  InputNumber,
  Space,
} from "antd";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { api } from "../../services/api";

import styles from "./assessment.module.scss";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface System {
  name: string;
  system: [];
}

export default function NewAssessment({ systemData }) {
  verifyToken();
  const [form, setForm] = useState([]);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [system, setSystem] = useState("");

  async function handleSubmit(fieldsValue: any) {
    console.log(fieldsValue.questions);
    await api
      .post("/avaliation", {
        title,
        question: fieldsValue.questions,
        requester,
        start_date: startDate,
        end_date: endDate,
        system,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/assessment");
        } else {
          const notify = () => toast.warning(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Head>
        <title> Feedback | Criar nova Avaliação </title>
      </Head>

      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.form}>
            <h1>Criar Avaliação</h1>

            <Form
              name="dynamic_form_nest_item"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                rules={[{ required: true, message: "Preencha este campo!" }]}
              >
                <Input
                  type="text"
                  placeholder="Título"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>

              <Form.List name="questions">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "question"]}
                          fieldKey={[fieldKey, "first"]}
                          rules={[
                            { required: true, message: "Preencha este campo!" },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <div className={styles.assddds} >

                            <Input
                              style={{ width: "50%", marginRight: "10px" }}
                              placeholder="Pergunta"
                            />

                            <select
                              style={{ width: "50%" }}
                              onChange={(e) => setSystem(e.target.value)}
                              placeholder="Sistema"
                            >
                              <option disabled hidden>
                                Sistema
                              </option>
                            </select>
                          </div>
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Adicionar nova pergunta
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <input
                placeholder="Solicitante"
                type="text"
                required
                onChange={(e) => setRequester(e.target.value)}
              />

              <div>
                <input
                  type="date"
                  style={{ width: "33%",  }}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                
                <input
                  type="date"
                  style={{ width: "33%" }}
                  onChange={(e) => setEndDate(e.target.value)}
                />

                <select
                  style={{ width: "33%" }}
                  onChange={(e) => setSystem(e.target.value)}
                  placeholder="Sistema"
                >
                  <option disabled hidden>
                    Sistema
                  </option>
                  {systemData.map((item, key) => {
                    return <option key={key}>{item.dns}</option>;
                  })}
                </select>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Enviar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </main>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get("/system");

  const systems = data.systems.map((item) => {
    return {
      name: item.name,
      dns: item.dns,
    };
  });

  const systemData = systems;

  return {
    props: {
      systemData,
    },
  };
};
