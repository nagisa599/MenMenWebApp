import React from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

interface PieChartProps {
  title: string;
  favorite: number[];
  label: string[];
}

const calculatePercentage = (value: number, total: number): number => {
  return (value / total) * 100;
};

const PieChart: React.FC<PieChartProps> = ({ title, favorite, label }) => {
  const totalRamen = favorite.reduce((acc, value) => acc + value, 0);
  const percentages = favorite.map((ramenCount) =>
    calculatePercentage(ramenCount, totalRamen)
  );
  const counts = favorite.map((ramenCount) => ramenCount);

  const data = {
    labels: label,
    datasets: [
      {
        data: percentages,
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#9C27B0', '#FFFFF'],
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const count = counts[context.dataIndex]; // 対応する数値を取得
            return `${label}: ${value.toFixed(0)}% (${count}件)`; // ラベルにパーセントの値と実際の数を追加
          },
        },
      },
    },
  };

  return (
    <div className="w-1/4 mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
