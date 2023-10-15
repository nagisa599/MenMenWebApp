import React from 'react';
import Link from 'next/link';
const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">ラーメン管理者サイト</div>
        <div className="space-x-4">
          <Link href="/UserAnalysis" className="text-white hover:text-gray-300">分析</Link>
          <Link href="/Coupon" className="text-white hover:text-gray-300">クーポン設定</Link>
          <Link href="/Questionnaire" className="text-white hover:text-gray-300">アンケート</Link>
          <Link href="/MenuRegister" className="text-white hover:text-gray-300">商品メニュー設定</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
