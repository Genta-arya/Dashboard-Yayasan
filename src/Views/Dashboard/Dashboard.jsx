import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Container from "@/components/container";
import Headers from "@/components/Headers";
import useUserStore from "@/lib/AuthZustand";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  
  const { user } = useUserStore();
  // Data untuk chart
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], 
    datasets: [
      {
        label: "Pengunjung Website",
        data: [30, 45, 60, 70, 50, 80, 90], 
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Opsi chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Pengunjung: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Bulan",
        },
      },
      y: {
        title: {
          display: true,
          text: "Jumlah Pengunjung",
        },
      },
    },
  };

  return (
    <>
      <Headers user={user} />
      <Container>
        <h2 className="text-xl font-bold mb-4 mt-4">Traffic Pengunjung Website</h2>
        <div className="mt-12 overflow-hidden">
          <Line data={data} options={options} />
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
