import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { browserName, browserVersion, osName, osVersion } from "react-device-detect";

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
      browser: `${browserName} ${browserVersion}`,
      system: `${osName}  ${osVersion}`,
    };
    await api
      .post("/avaliate/" + id, data)
      .then((res) => {
        if (res.data.status === 1) {
          setIsModalVisible(false);
        } else {
          const notify = () =>
            toast.error(res.data.error, {
              position: toast.POSITION.TOP_CENTER,
            });
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleSkip(id) {
    const data = {
      browser: `${browserName} ${browserVersion}`,
      system: `${osName}  ${osVersion}`,
    };
    setIsModalVisible(false);
    await api.post("/avaliate/skip/" + id, data);
  }

  const renderCard = (card, index) => {
    return (
      <>
        {isModalVisible ? (
          <>
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
                      placeholder="Comentário"
                      onChange={(event) => {
                        setComment(event.target.value);
                      }}
                    />
                  </h2>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => handleSkip(card._id)}
                className={styles.buttonSkip}
              >
                <span>Pular</span>
              </button>
              <button
                onClick={() => handleSubmit(card._id)}
                className={styles.buttonSubmit}
              >
                <span>Enviar</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.message}>
              Muito obrigado pela sua participação!
            </h1>
          </>
        )}
      </>
    );
  };
  return <div>{alreadyAssess ? "" : assessment?.map(renderCard)}</div>;
}
