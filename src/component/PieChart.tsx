import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart: React.FC = () => {
  const data = {
    labels: ['A', 'B', 'C', 'D', 'E'],
    datasets: [
      {
        data: [20, 15, 25, 10, 30],
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#9C27B0'],
      },
    ],
  };

  return (
    <div className="w-1/6 mx-auto mt-8">
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
