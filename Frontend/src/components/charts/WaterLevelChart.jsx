import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WaterLevelChart = ({ data, timeframe = '30days' }) => {
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return timeframe === '30days' 
        ? date.getDate() + '/' + (date.getMonth() + 1)
        : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: t('water_level'),
        data: data.map(item => item.level),
        borderColor: '#1a56db',
        backgroundColor: 'rgba(26, 86, 219, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1a56db',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: t('rainfall'),
        data: data.map(item => item.rainfall),
        borderColor: '#0e9f6e',
        backgroundColor: 'rgba(14, 159, 110, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0e9f6e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 10,
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Water Level (m)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Rainfall (mm)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('water_trend')
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WaterLevelChart;