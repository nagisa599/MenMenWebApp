import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">ラーメン管理者サイト</div>
        <div className="space-x-4">
          <Link href="#" className="text-white hover:text-gray-300">Home</Link>
          <Link href="/UserAnalysis" className="text-white hover:text-gray-300">分析</Link>
          <Link href="/Coupon" className="text-white hover:text-gray-300">クーポン設定</Link>
          <Link href="/Questionnaire" className="text-white hover:text-gray-300">アンケート</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
