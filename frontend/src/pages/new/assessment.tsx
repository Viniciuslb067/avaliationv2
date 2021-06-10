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
  const [question, setQuestion] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [system, setSystem] = useState("");

  const prevIsValid = () => {
    if (form.length === 0) {
      return true;
    }

    const someEmpty = form.some((item) => item.Question === "");

    if (someEmpty) {
      form.map((item, index) => {
        const allPrev = [...form];

        if (form[index].Question === "") {
          allPrev[index].errors.Question = "Preencha o campo de pergunta";
        }

        setForm(allPrev);
      });
    }
    return !someEmpty;
  };

  const handleAddInput = (event) => {
    event.preventDefault();
    const inputState = {
      Question: "",
    };
    if (prevIsValid()) {
      setForm((prev) => [...prev, inputState]);
    }
  };

  const onChange = (index, event) => {
    event.preventDefault();
    event.persist();

    setForm((prev) => {
      return prev.map((item, i) => {
        if (i !== index) {
          return item;
        }
        return {
          ...item,
          [event.target.name]: event.target.value,
        };
      });
    });
  };

  const handleRemoveField = (e, index) => {
    e.preventDefault();
    setForm((prev) => prev.filter((item) => item !== prev[index]));
  };

  async function handleSubmit(fieldsValue: any) {
    console.log(fieldsValue.endDate._d.format("d MMMM yyyy"));
    await api
      .post("/avaliation", {
        question: fieldsValue,
        requester,
        start_date: startDate,
        end_date: endDate,
        system,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          Router.push("/dashboard");
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
                  onChange={(e) => setQuestion(e.target.value)}
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
                          name={[name, "first"]}
                          fieldKey={[fieldKey, "first"]}
                          rules={[
                            { required: true, message: "Preencha este campo!" },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            style={{ paddingRight: 500 }}
                            placeholder="Pergunta"
                          />
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

              <Form.Item name={["requester"]}>
                <Input
                  placeholder="Solicitante, Exemplo: DTI"
                  type="text"
                  required
                  onChange={(e) => setRequester(e.target.value)}
                />
              </Form.Item>

              <Form.Item name={["startDate"]}>
                
                  <input
                    type="date"
                    style={{ width: "100%" }}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                
              </Form.Item>

              <Form.Item name={["endDate"]}>
               
                  <label htmlFor="">Data fim</label>
                  <input
                    type="date"
                    style={{ width: "100%" }}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                
              </Form.Item>

              <Form.Item>
                  
                  <select
                    style={{ width: "100%" }}
                    onChange={(e) => setSystem(e.target.value)}
                    placeholder="Sistema"
                  >
                    <option disabled hidden>Sistema</option>
                    {systemData.map((item, key) => {
                      return <option key={key}>{item.dns}</option>;
                    })}
                  </select>
                
              </Form.Item>

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
