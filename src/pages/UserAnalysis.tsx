import React from 'react';
import LineChart from '../component/LineChart';
import PieChart from '../component/PieChart';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Sales Analysis</h1>
      <LineChart />
      <PieChart />
    </div>
  );
};

export default Home;