import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { MdShortText } from "react-icons/md";

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
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [system, setSystem] = useState("");

  const onChange = (e) => {
    setType(e.target.value);
  };

  function onChangeSelect(value) {
    setSystem(value);
  }

  function onChangeDate(dates, dateStrings) {
    setStartDate(dateStrings)
  }

  function onChangeDateEnd(dates, dateStrings) {
    setEndDate(dateStrings)
  }

  async function handleSubmit(fieldsValue: any) {
    await api
      .post("/avaliation", {
        title,
        type: type,
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
                  placeholder="Título"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>

              <Radio.Group
                value={type}
                onChange={onChange}
                style={{
                  marginBottom: "1.75rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Radio value="shortAnswer">Resposta curta</Radio>
                <Radio value="Star">Estrela</Radio>
              </Radio.Group>

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
                            {
                              required: true,
                              message: "Preencha este campo!",
                            },
                          ]}
                        >
                          <div>
                            <Input
                              style={{ width: "43vw", marginRight: "10px" }}
                              placeholder="Pergunta"
                            />
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
                  style={{ marginBottom: "1.75rem" }}
                  onChange={(e) => setRequester(e.target.value)}
                />
              </Form.Item>

              <div>
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

              <Form.Item style={{ marginTop: "1.75rem" }}>
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
