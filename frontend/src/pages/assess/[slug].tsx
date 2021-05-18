import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";

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
          const notify = () => toast.success(res.data.success, {
            position: toast.POSITION.TOP_LEFT
          });
          notify();
        } else {
          const notify = () => toast.warning(res.data.error, {
            position: toast.POSITION.TOP_LEFT
          });
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  <ToastContainer
    position="bottom-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />;

  const renderCard = (card, index) => {
    return (
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
                        ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
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

        <div className={styles.buttonContainer}>
          <button className={styles.buttonSkip}>Pular</button>
          <button
            className={styles.buttonSubmit}
            onClick={() => handleSubmit(card._id)}
            id="botaoTeste"
          >
            Enviar
          </button>
        </div>
      </div>
    );
  };

  return <div>{alreadyAssess ? "" : assessment.map(renderCard)}</div>;
}
