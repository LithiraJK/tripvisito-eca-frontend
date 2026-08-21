import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export const TripTrendsChart = () => {
  const data = {
    labels: ['Beach', 'Cultural', 'City', 'Nature', 'Culinary', 'Relax', 'Adventure'],
    datasets: [{
      data: [50, 45, 20, 25, 40, 30, 35],
      backgroundColor: (context: any) => context.index === 4 ? '#1877F2 ' : '#e5e7eb', 
      borderRadius: 8,
    }]
  };

  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { display: false } }, x: { grid: { display: false } } } }} />;
};