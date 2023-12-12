import Navbar from "@/component/Navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getFirestore, getDocs, doc, updateDoc } from "firebase/firestore";

interface MenuOption {
  id: string;
  name: string;
}

const RamenScheduleForm: React.FC = () => {
  const [menus, setMenus] = useState<MenuOption[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");

  const fetchRamenData = async () => {
    const snapShot = await getDocs(collection(getFirestore(), 'ramens'));
    const menuData: MenuOption[] = [];

    snapShot.forEach((doc) => {
      const data = doc.data();
      menuData.push({
        id: doc.id,
        name: data.name,
      });
    });

    setMenus(menuData);
  };

  useEffect(() => {
    fetchRamenData();
  }, []);

  const handleSubmit = async () => {
    if (selectedMenuId && scheduledDate) {
      const registerRef = doc(getFirestore(), `ramens/${selectedMenuId}`);
      await updateDoc(registerRef, {
        today: new Date(scheduledDate),
        updatedAt: new Date(),
      });
      setSelectedMenuId("");
      setScheduledDate("");
      alert('成功しました。')
    }
  };

  return (
    <div className="mb-5">
      <Navbar />
      <div className="mx-60 my-8 divide-y divide-gray-200">
        <div className='my-3 flex justify-between items-center'>
          <h2 className="text-lg font-black leading-6 text-gray-900 font-black">メニュースケジュール登録フォーム</h2>
          <Link href="/Setting" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-black rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            設定画面へ戻る
          </Link>
        </div>
        <div className="my-3 py-5">
          <label htmlFor="menu-select" className="block mb-2">メニュー選択:</label>
          <select
            id="menu-select"
            className="mb-4 block w-full p-2 border border-gray-300 rounded"
            value={selectedMenuId}
            onChange={(e) => setSelectedMenuId(e.target.value)}
          >
            <option value="">メニューを選択してください</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>{menu.name}</option>
            ))}
          </select>
          <label htmlFor="scheduled-date" className="block mb-2">提供日:</label>
          <input
            id="scheduled-date"
            type="date"
            className="mb-4 block w-full p-2 border border-gray-300 rounded"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="text-white px-8 py-2 font-black rounded bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSubmit}
            >
              登録
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RamenScheduleForm;
