import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { MdShortText } from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

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

export default function NewAssessment({ systemData }) {
  verifyToken();
  const { Option } = Select;
  const [type, setType] = useState("");
  const [title, setTitle] = useState<string>("");
  const [optionShow, setOptionShow] = useState<boolean>(false);
  const [requester, setRequester] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [system, setSystem] = useState<string>("");

  const [shortAnswerType, setShortAnswerType] = useState<boolean>(false);
  const [starType, setStarType] = useState<boolean>(false);
  const [multipleChoiceType, setMultipleChoiceType] = useState<boolean>(false);

  const [submitted, setSubmitted] = useState<boolean>(false);

  function handleSelect(value) {
    switch (value) {
      case "shortAnswer": {
        setShortAnswerType(true);
        setStarType(false);
        setMultipleChoiceType(false);
        break;
      }

      case "star": {
        setStarType(true);
        setShortAnswerType(false);
        setMultipleChoiceType(false);
        break;
      }

      case "multipleChoice": {
        setMultipleChoiceType(true);
        setShortAnswerType(false);
        setStarType(false);
        break;
      }
    }

    setOptionShow(true);
  }

  function onChangeSelect(value) {
    setSystem(value);
  }

  function onChangeDate(dates, dateStrings) {
    setStartDate(dateStrings);
  }

  function onChangeDateEnd(dates, dateStrings) {
    setEndDate(dateStrings);
  }

  async function handleSubmit(fieldsValue: any) {
    console.log(fieldsValue);
    await api
      .post("/avaliation", {
        title,
        requester,
        start_date: startDate,
        end_date: endDate,
        system,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          setSubmitted(true);
        } else {
          const notify = () => toast.warning(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleSubmitQuestions(fieldsValue: any) {
    console.log(fieldsValue);
    await api
      .post("/questions", {
        question: fieldsValue.questions,
      })
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          setSubmitted(true);
          notify();
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
              name="dynamic_form_info"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                rules={[{ required: true, message: "Preencha este campo!" }]}
              >
                <Input
                  placeholder="Título"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Preencha este campo!",
                  },
                ]}
              >
                <Input
                  placeholder="Solicitante"
                  onChange={(e) => setRequester(e.target.value)}
                />
              </Form.Item>

              <div style={{ marginBottom: "1rem" }}>
                <DatePicker
                  style={{ width: "33%" }}
                  format={"DD/MM/YYYY"}
                  placeholder="Data início"
                  onChange={onChangeDate}
                />
                <DatePicker
                  style={{ width: "33%" }}
                  format={"DD/MM/YYYY"}
                  placeholder="Data fim"
                  onChange={onChangeDateEnd}
                />

                <Select
                  style={{ width: "32%" }}
                  onChange={onChangeSelect}
                  placeholder="Sistema"
                >
                  {systemData.map((item, key) => {
                    return (
                      <>
                        <Option key={key} value={item.dns}>
                          {item.dns}
                        </Option>
                      </>
                    );
                  })}
                </Select>
              </div>

              {submitted ? (
                ""
              ) : (
                <Form.Item style={{ marginTop: "1.75rem" }}>
                  <Button type="primary" htmlType="submit">
                    Próximo
                  </Button>
                </Form.Item>
              )}
            </Form>

            {submitted ? (
              <Form
                name="dynamic_form_questions"
                onFinish={handleSubmitQuestions}
                autoComplete="off"
              >
                {}
                <Form.List name="questions">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <>
                          <Space
                            key={key}
                            style={{
                              marginBottom: 8,
                              marginTop: 8,
                            }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "question"]}
                              fieldKey={[fieldKey, "first"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Preencha este campo!",
                                },
                              ]}
                            >
                              <Input
                                style={{ width: "28vw", marginRight: "10px" }}
                                placeholder="Pergunta"
                              />
                            </Form.Item>

                            <Form.Item>
                              <Select
                                style={{ width: "15rem" }}
                                placeholder="Tipo"
                                onChange={handleSelect}
                              >
                                <Option value="shortAnswer">
                                  {" "}
                                  <MdShortText size={20} /> Reposta curta
                                </Option>
                                <Option value="star">
                                  {" "}
                                  <BsStarFill size={15} /> Estrelas
                                </Option>
                                <Option value="multipleChoice">
                                  {" "}
                                  <AiFillCheckCircle size={15} /> Multipla
                                  Escolha
                                </Option>
                              </Select>
                            </Form.Item>

                            <FiTrash2 size={15} onClick={() => remove(name)} />
                          </Space>

                          {multipleChoiceType ? (
                            <Form.List name="options">
                              {(fields, { add, remove }) => (
                                <>
                                  <Radio
                                    disabled
                                    value=""
                                    style={{ marginBottom: 20 }}
                                  >
                                    <Input
                                      disabled
                                      placeholder={`Exemplo`}
                                      style={{ width: "40vw" }}
                                    />
                                  </Radio>

                                  {fields.map(
                                    ({ key, name, fieldKey, ...restField }) => (
                                      <>
                                        <Space
                                          key={key}
                                          style={{
                                            marginBottom: 8,
                                            marginTop: 8,
                                            display: "flex",
                                            justifyContent: "start",
                                          }}
                                          align="baseline"
                                        >
                                          <Form.Item
                                            {...restField}
                                            name={[name, "option"]}
                                            fieldKey={[fieldKey, "first"]}
                                          >
                                            <Radio value={key}></Radio>
                                            <Input
                                              placeholder={`Opção ${key + 1}`}
                                              style={{ width: "40vw" }}
                                            />
                                          </Form.Item>

                                          <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                          />
                                        </Space>
                                      </>
                                    )
                                  )}
                                  <Form.Item>
                                    <Radio checked={true} onClick={() => add()}>
                                      <span> Adicionar opção </span>
                                    </Radio>
                                  </Form.Item>
                                </>
                              )}
                            </Form.List>
                          ) : (
                            ""
                          )}

                          {starType ? (
                            <Form.Item>
                              <Radio.Group>
                                <Space
                                  style={{
                                    marginBottom: 8,
                                    marginTop: 8,
                                    display: "flex",
                                    justifyContent: "start",
                                  }}
                                  align="baseline"
                                >
                                  <Radio disabled value={1}>
                                    Ruim
                                  </Radio>
                                  <Radio disabled value={2}>
                                    Regular
                                  </Radio>
                                  <Radio disabled value={3}>
                                    Bom
                                  </Radio>
                                  <Radio disabled value={4}>
                                    Muito Bom
                                  </Radio>
                                  <Radio disabled value={5}>
                                    Excelente
                                  </Radio>
                                </Space>
                              </Radio.Group>
                            </Form.Item>
                          ) : (
                            ""
                          )}

                          {shortAnswerType ? (
                            <Form.Item>
                              <Input
                                disabled
                                placeholder="Texto de resposta curta"
                              />
                            </Form.Item>
                          ) : (
                            ""
                          )}
                        </>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                          icon={<PlusOutlined />}
                        >
                          Adicionar nova pergunta
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item style={{ marginTop: "1.75rem" }}>
                  <Button type="primary" htmlType="submit">
                    Enviar
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              ""
            )}
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
