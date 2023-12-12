import Navbar from "@/component/Navbar";
import React from "react";
import Link from "next/link";

const Setting: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">設定</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <Link href='/CalendarRegister' className="block p-4 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 text-lg">カレンダー登録</Link>
          <Link href='/RamenSchedule' className="block p-4 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 text-lg mt-3">翌日の限定メニュー登録</Link>
          <Link href='/QRcode' className="block p-4 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 text-lg mt-3">QRコード印刷</Link>
        </div>
      </div>
    </div>
  );
}

export default Setting;
