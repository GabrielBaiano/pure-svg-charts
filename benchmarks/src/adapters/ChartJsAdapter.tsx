import React, { useMemo } from 'react';
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
import { Line } from 'react-chartjs-2';
import { DataPoint } from '../runner/dataGenerator';

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

interface AdapterProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export const ChartJsAdapter: React.FC<AdapterProps> = ({ data, height = 280 }) => {
  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: 'Telemetry',
          data: data.map((d) => d.value),
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.15)',
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          pointRadius: data.length <= 60 ? 3 : 0
        }
      ]
    };
  }, [data]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#565f89', maxTicksLimit: 7 }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#565f89' }
        }
      }
    };
  }, []);

  return (
    <div
      style={{
        background: '#1a1b26',
        border: '1px solid #2f3549',
        borderRadius: '16px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#f97316' }}>Chart.js (v4.4.8 / Canvas)</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#9aa5ce' }}>{data.length.toLocaleString()} pts</span>
      </div>
      <div style={{ width: '100%', height: `${height}px` }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
