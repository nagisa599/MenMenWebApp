import React from 'react';
import { Line } from 'react-chartjs-2';
import "chart.js/auto";


const LineChart: React.FC = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales Data',
        data: [12, 19, 3, 5, 2, 3],
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
    <div className="flex justify-center items-center mx-auto mt-8 w-full h-96"> 
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
