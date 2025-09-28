import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RechargeChart = ({ data }) => {
  const { t } = useTranslation();

  // Detect recharge events (when rainfall > 0 and water level increases)
  const rechargeEvents = data.map((item, index) => {
    if (index === 0) return 0;
    const prevLevel = data[index - 1].level;
    const recharge = item.rainfall > 10 && item.level > prevLevel ? item.level - prevLevel : 0;
    return recharge;
  });

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.getDate() + '/' + (date.getMonth() + 1);
    }),
    datasets: [
      {
        label: 'Recharge Detected',
        data: rechargeEvents,
        backgroundColor: '#0e9f6e',
        borderRadius: 4,
      },
      {
        label: 'Rainfall',
        data: data.map(item => item.rainfall),
        backgroundColor: '#0694a2',
        borderRadius: 4,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Recharge (m)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      y1: {
        beginAtZero: true,
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
        text: t('recharge_events')
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RechargeChart;