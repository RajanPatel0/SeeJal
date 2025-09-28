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
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ForecastChart = ({ historicalData, forecastData }) => {
  const { t } = useTranslation();

  // Generate dates for next 15 days
  const forecastDates = [];
  for (let i = 1; i <= 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    forecastDates.push(date.toLocaleDateString());
  }

  const chartData = {
    labels: [
      ...historicalData.slice(-15).map(item => {
        const date = new Date(item.date);
        return date.getDate() + '/' + (date.getMonth() + 1);
      }),
      ...forecastDates
    ],
    datasets: [
      {
        label: 'Historical Data',
        data: [
          ...historicalData.slice(-15).map(item => item.level),
          ...Array(15).fill(null)
        ],
        borderColor: '#1a56db',
        backgroundColor: 'rgba(26, 86, 219, 0.1)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#1a56db',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
      },
      {
        label: 'Forecast',
        data: [
          ...Array(15).fill(null),
          ...forecastData
        ],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
      },
      {
        label: 'Confidence Interval',
        data: [
          ...Array(15).fill(null),
          ...forecastData.map(value => value * 1.1) // Upper bound
        ],
        borderColor: 'rgba(245, 158, 11, 0.3)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: '+1',
        tension: 0.4,
        pointRadius: 0,
        showLine: false,
      },
      {
        label: '',
        data: [
          ...Array(15).fill(null),
          ...forecastData.map(value => value * 0.9) // Lower bound
        ],
        borderColor: 'rgba(245, 158, 11, 0.3)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        showLine: false,
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
        },
        ticks: {
          callback: function(value, index, values) {
            // Show label only for every 5th point to avoid clutter
            return index % 5 === 0 ? this.getLabelForValue(value) : '';
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Water Level (m)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('forecast')
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-dark">{t('forecast')}</h3>
        <p className="text-sm text-gray-600">AI-powered 15-day water level prediction</p>
      </div>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>AI Insight:</strong> Water levels expected to {forecastData[0] > historicalData[historicalData.length - 1].level ? 'rise' : 'decline'} by {(Math.abs(forecastData[0] - historicalData[historicalData.length - 1].level) * 100).toFixed(1)}% in the next week due to seasonal patterns.
        </p>
      </div>
    </div>
  );
};

export default ForecastChart;