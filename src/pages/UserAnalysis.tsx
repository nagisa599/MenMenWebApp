import React from 'react';
import LineChart from '../component/LineChart';
import PieChart from '../component/PieChart';
import Navbar from '@/component/Navbar';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Sales Analysis</h1>
        <LineChart />
        <PieChart />
      </div>
    </div>
  );
};

export default Home;