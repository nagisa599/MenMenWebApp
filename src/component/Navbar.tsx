import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4 sticky top-0">
      <div className="flex justify-between items-center">
        <Link href="/" className="p-1 text-white font-bold text-xl">MenMen管理サイト</Link>
        <div className="space-x-4">
          <Link href="/UserAnalysis" className="text-white hover:text-gray-300">分析</Link>
          <Link href="/Coupon" className="text-white hover:text-gray-300">クーポン</Link>
          <Link href="/Questionnaire" className="text-white hover:text-gray-300">アンケート</Link>
          <Link href="/Menu" className="text-white hover:text-gray-300">商品メニュー</Link>
          <button onClick={() => signOut()} className="text-white hover:text-gray-300">ログアウト</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
