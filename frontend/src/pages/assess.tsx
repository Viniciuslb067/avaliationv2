import { GetStaticProps } from "next";
import { useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

import { api } from "../services/api";

import styles from "./assess.module.scss";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

toast.configure();

export default function Assess({ assess }) {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  async function handleSubmit(id) {
    const data = {
      comments: comment,
      note: rating,
    };
    await api
      .post("/avaliate/" + id, data)
      .then((res) => {
        if (res.data.status === 1) {
          const notify = () => toast.success(res.data.success);
          notify();
          setIsModalVisible(false);
        } else {
          const notify = () => toast.warning(res.data.error);
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const renderCard = (card, index) => {
    return (
      <div className={styles.app} key={index}>
        <Modal
          key={index}
          visible={isModalVisible}
          onOk={() => handleSubmit(card.id)}
          okText="Enviar"
          cancelText="Pular"
          closable={false}
        >
          <div className={styles.container}>
            <div className="card-body">
              <h2 className="card-title text-center">
                <p className="">{card.question}</p>
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  return (
                    <label>
                      <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                      />
                      <FaStar
                        className="star"
                        color={
                          ratingValue <= (hover || rating)
                            ? "#ffc107"
                            : "#e4e5e9"
                        }
                        size={50}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
                <input
                  type="input"
                  className="input-coment"
                  placeholder="Comentario"
                  onChange={(event) => {
                    setComment(event.target.value);
                  }}
                />
              </h2>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  return <div>{assess.map(renderCard)}</div>;
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("/avaliate");

  const assessData = data.map((item) => {
    return {
      id: item._id,
      question: item.question,
    };
  });

  const assess = assessData;

  return {
    props: {
      assess,
    },
  };
};
