import { Doughnut } from "react-chartjs-2";

import styles from "./styles.module.scss";

export function CardHome() {
  const data = {
    labels: ["Visitas"],
    datasets: [
      {
        label: "# of Votes",
        data: [12],
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className={styles.analyticsCard}>
        <div className={styles.analyticsHead}>
          <h3>Estátisticas</h3>
        </div>

        <div className={styles.analyticsChart}>
          <Doughnut
            type="Doughnut"
            data={data}
            height={550}
            width={550}
            options={{
              title: {
                display: true,
                text: "Enviados/Pulados",
                position: "top",
                fontSize: 90,
                fontColor: "#fff",
                padding: 20,
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
              },
              maintainAspectRatio: true,
              responsive: true,
              legend: {
                labels: {
                  fontSize: 20,
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
