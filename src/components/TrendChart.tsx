import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

interface TrendChartProps {
  trend: "increment" | "decrement" | "neutral";
  data?: number[];
}

const TrendChart = ({ trend, data }: TrendChartProps) => {
  // Generate smooth curve data based on trend if not provided
  const getDefaultData = () => {
    if (trend === "increment") {
      return [20, 25, 22, 30, 28, 35, 40]; // Upward trend
    } else if (trend === "decrement") {
      return [40, 38, 35, 32, 30, 28, 25]; // Downward trend
    } else {
      return [30, 28, 30, 29, 30, 31, 30]; // Neutral/flat trend
    }
  };

  const defaultData = data && data.length > 0 ? data : getDefaultData();

  // Color schemes based on trend
  const colors = {
    increment: {
      border: "rgba(34, 197, 94, 1)",
      background: "rgba(34, 197, 94, 0.1)",
    },
    decrement: {
      border: "rgba(239, 68, 68, 1)",
      background: "rgba(239, 68, 68, 0.1)",
    },
    neutral: {
      border: "rgba(156, 163, 175, 1)",
      background: "rgba(156, 163, 175, 0.1)",
    },
  };

  const chartData = {
    labels: Array(defaultData.length).fill(""),
    datasets: [
      {
        data: defaultData,
        borderColor: colors[trend].border,
        backgroundColor: colors[trend].background,
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Makes the line smooth/curved
        pointRadius: 0, // Hides data points
        pointHoverRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="w-full h-20 md:h-24 md:w-40 xl:w-32 xl:h-20" style={{ minHeight: '80px', minWidth: '100px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
