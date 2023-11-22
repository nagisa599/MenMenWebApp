import React from 'react';
import { Line } from 'react-chartjs-2';
import "chart.js/auto";

const LineChart: React.FC = () => {
  const data = {
    labels: ['８月', '9月', '10月', '11月', '12月', '1月'],
    datasets: [
      {
        label: 'Sales Data',
        data: [120, 190, 300, 100,124, 140],
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <div className="w-1/2 mx-auto mt-8">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
