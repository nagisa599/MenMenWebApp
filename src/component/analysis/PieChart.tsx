import React from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { MenuCountDictionary } from '@/pages/UserAnalysis';

interface PieChartProps {
  title: string;
  dict: MenuCountDictionary;
}

// 16進数でランダムな色を生成
const generateRandomColor = (): string => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

// ランダムな色を格納した配列を返す
const generateColors = (length: number): string[] => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(generateRandomColor());
  }
  return colors;
};

const PieChart: React.FC<PieChartProps> = ({ title, dict }) => {
  const labels = Object.keys(dict);
  const counts = Object.values(dict);
  const total = counts.reduce((acc, value) => acc + value, 0);
  const percentages = counts.map((count) => (count / total) * 100);

  const colors = generateColors(labels.length);

  const data = {
    labels: labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: colors,
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
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const count = counts[context.dataIndex];
            return `${label}: ${value.toFixed(0)}% (${count}件)`;
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
