import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface UserGrowthChartProps {
  labels: string[];
  values: number[];
}

export const UserGrowthChart = ({ labels, values }: UserGrowthChartProps) => {
  const data = {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [{
      fill: true,
      label: 'Users Joined',
      data: values.length > 0 ? values : [0],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      pointRadius: 2, 
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
        y: { beginAtZero: true, grid: { display: false } }, 
        x: { grid: { display: false } } 
    }
  };

  return <Line data={data} options={options} />;
};