import { Bar, Pie, PolarArea } from "react-chartjs-2";

import styles from "./styles.module.scss";

export function BarChart({ notes }) {

  const data = {
    labels: ["1 Estrela", "2 Estrela", "3 Estrela", " 4 Estrela", "5 Estrela"],
    datasets: [
      {
        label: "Estrelas",
        data: notes,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className={styles.analyticsCard}>
        <div className={styles.analyticsHead}>
          <h3>Estrelas</h3>
        </div>

        <div className={styles.analyticsChart}>
          <Bar type="Bar" data={data} height={350} width={450} />
        </div>
      </div>
    </>
  );
}

export function PieChart({ status }) {
  return (
    <>
      <div className={styles.analyticsCard}>
        <div className={styles.analyticsHead}>
          <h3>Estrelas</h3>
        </div>

        <div className={styles.analyticsChart}>
          <Pie
          type="Pie"
            data={{
              labels: ["Enviados", "Recusados"],
              datasets: [
                {
                  label: "Estrelas",
                  data: status,
                  backgroundColor: [
                    "rgb(54, 162, 235)",
                    "rgb(246, 46, 89)",
                  ],
                  borderWidth: 0.9,
                  borderColor: "#FFFFFF",
                },
              ],
            }}
            height={100}
            width={100}
            options={{
              title: {
                display: true,
                text: "Enviados/Pulados",
                position: "top",
                fontSize: 50,
                fontColor: "#000000",
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
                  fontSize: 15,
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

export function PolarAreaChart({ browserInfo }) {

  const abc = browserInfo.map(item => {
    return {
      browserName: item.browserName
    }
  })

  console.log(abc)

  return (
    <>
      <div className={styles.analyticsCard}>
        <div className={styles.analyticsHead}>
          <h3>Estrelas</h3>
        </div>

        <div className={styles.analyticsChart}>
          <PolarArea
          type="Polar"
            data={{
              labels: [abc.browserName],
              datasets: [
                {
                  label: "Estrelas",
                  data: [browserInfo[0].total, 5, 8 , 10 ,5],
                  backgroundColor: [
                    "rgb(54, 162, 235)",
                    "rgb(246, 46, 89)",
                  ],
                  borderWidth: 0.9,
                  borderColor: "#FFFFFF",
                },
              ],
            }}
            height={100}
            width={100}
            options={{
              title: {
                display: true,
                text: "Enviados/Pulados",
                position: "top",
                fontSize: 50,
                fontColor: "#000000",
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
                  fontSize: 15,
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}