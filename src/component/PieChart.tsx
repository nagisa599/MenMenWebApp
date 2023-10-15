import React from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

interface PieChartProps {
  title: string; // タイトルのプロパティを追加
  favorite: number[]; // おそらくこの型は数値の配列と仮定しています
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

  const data = {
    labels: label,
    datasets: [
      {
        data: percentages, // パーセンテージのデータを使用する
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
            return `${label}: ${value.toFixed(0)}%`; // ラベルにパーセントの値を追加
          },
        },
      },
    },
  };

  return (
    <div className="w-1/4 mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2> {/* タイトルを表示 */}
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
