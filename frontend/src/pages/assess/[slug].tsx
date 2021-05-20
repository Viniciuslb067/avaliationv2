import { toast } from "react-toastify";
import { Modal } from "antd";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { api } from "../../services/api";

import styles from "./assess.module.scss";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

toast.configure();

export default function Assess() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [alreadyAssess, setAlreadyAssess] = useState<boolean>();
  const [assessment, setAssessment] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  var { slug } = router.query;

  useEffect(() => {
    async function getData() {
      await api.get("/avaliate/" + slug).then((res) => {
        res.data.map((item) => {
          setAlreadyAssess(item.assess);
          setAssessment(item.assessment);
        });
      });
    }
    getData();
  }, [slug]);

  async function handleSubmit(id) {
    const data = {
      comments: comment,
      note: rating,
    };
    await api
      .post("/avaliate/" + id, data)
      .then((res) => {
        if (res.data.status === 1) {
          setIsModalVisible(false);
          const notify = () =>
            toast.success(res.data.success, {
              position: toast.POSITION.TOP_LEFT,
            });
          notify();
        } else {
          const notify = () =>
            toast.warning(res.data.error, {
              position: toast.POSITION.TOP_LEFT,
            });
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  function close () {
     
  }

  const renderCard = (card, index) => {
    return (
      <Modal
        key={index}
        visible={isModalVisible}
        onOk={() => handleSubmit(card._id)}
        onCancel={() => setIsModalVisible(false)}
        maskStyle={{ background: "rgba(0,0,0,0.75)" }}    
        okText="Enviar"
        cancelText="Pular"
        closable={true}
        destroyOnClose={true}
      >
        <div className={styles.app} key={index}>
          <div className={styles.container}>
            <div>
              <h2>
                <p className="">{card.question}</p>
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  return (
                    <label key={i}>
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
                  className={styles.inputComment}
                  placeholder="Comentario"
                  onChange={(event) => {
                    setComment(event.target.value);
                  }}
                />
              </h2>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return <div>{alreadyAssess ? "" : assessment.map(renderCard)}</div>;
}
