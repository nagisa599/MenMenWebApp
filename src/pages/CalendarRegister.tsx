import Navbar from "@/component/Navbar";
import React, { useState } from "react";
import Link from "next/link";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import CalendarComponent from "@/component/Calendar";

interface dayProps {
  [key: string]: boolean
}

interface BusinessHours {
  start: string; // 開始時間
  end: string;   // 終了時間
}

// 曜日ごとの営業時間を格納するためのオブジェクトの型定義
interface BusinessHoursByDay {
  weekday: BusinessHours;
  saturday: BusinessHours;
  sunday: BusinessHours;
}

const CalendarForm: React.FC = () => {
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<string>();
  const [closedDays, setClosedDays] = useState<Date[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHoursByDay>({
    weekday: { start: '', end: '' },
    saturday: { start: '', end: '' },
    sunday: { start: '', end: '' },
  });

  // 営業時間の更新を行う関数
  const handleBusinessHoursChange = (day: keyof BusinessHoursByDay, key: keyof BusinessHours, value: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [key]: value }
    }));
  };

  const registerCalendar = async () => {
    try {
      const db = getFirestore();
      const calendarRef = collection(db, 'calendar');

      await addDoc(calendarRef, {
        year: Number(year),
        month: Number(month),
        dayoff: closedDays,
        businessHours: businessHours,
      });

      setBusinessHours({
        weekday: { start: '', end: '' },
        saturday: { start: '', end: '' },
        sunday: { start: '', end: '' },
      });
      setClosedDays([]);
      setMonth('');
      setYear('');
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = () => {
    registerCalendar();
  }

  return (
    <div className="mb-5">
      <Navbar />
      <div className="mx-60 my-8 divide-y divide-gray-200">
        <div className='my-3 flex justify-between items-center'>
          <h2 className="text-lg font-black leading-6 text-gray-900 font-black">カレンダー登録フォーム</h2>
          <Link href="/Setting" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-black rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            設定画面へ戻る
          </Link>
        </div>
        <div>
          <div className="my-4 flex justify-between">
            <div className="flex-1 p-4">
              <div className="my-3">
                <label className="text-md font-semibold block mb-2">いつのカレンダー？</label>
                <div className="flex">
                  <input className="w-full p-2 border border-gray-300 rounded mr-3" type="string" placeholder="例: 2023(年)" value={year} onChange={(e) => setYear(e.target.value)} />
                  <input className="w-full p-2 border border-gray-300 rounded" type="string" placeholder="例: 7(月)" value={month} onChange={(e) => setMonth(e.target.value)} />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-md font-semibold block">その月の休業日を選択</label>
                <CalendarComponent selectedDates={closedDays} setSelectedDates={setClosedDays} />
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="my-3">
                <label className="text-md font-semibold block mb-2">営業カレンダー入力</label>
                <div className="mb-3">
                  <label className="block mb-1">平日</label>
                  <div className="flex space-x-2">
                    <input className="flex-1 p-2 border border-gray-300 rounded" type="time" placeholder="開始時間" value={businessHours.weekday.start} onChange={(e) => handleBusinessHoursChange('weekday', 'start', e.target.value)} />
                    <input className="flex-1 p-2 border border-gray-300 rounded" type="time" placeholder="終了時間" value={businessHours.weekday.end} onChange={(e) => handleBusinessHoursChange('weekday', 'end', e.target.value)} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block mb-1">土曜</label>
                  <div className="flex space-x-2">
                    <input className="flex-1 p-2 border border-gray-300 rounded" type="time" placeholder="開始時間" value={businessHours.saturday.start} onChange={(e) => handleBusinessHoursChange('saturday', 'start', e.target.value)} />
                    <input className="flex-1 p-2 border border-gray-300 rounded" type="time" placeholder="終了時間" value={businessHours.saturday.end} onChange={(e) => handleBusinessHoursChange('saturday', 'end', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">日曜</label>
                  <div className="flex space-x-2">
                    <input className="flex-1 p-2 border border-gray-300 rounded" type="time" placeholder="開始時間" value={businessHours.sunday.start} onChange={(e) => handleBusinessHoursChange('sunday', 'start', e.target.value)} />
                    <input className="flex-1 p-2 border border-gray-300 rounded" type="time" placeholder="終了時間" value={businessHours.sunday.end} onChange={(e) => handleBusinessHoursChange('sunday', 'end', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:col-span-6 pt-5">
            <div className="flex justify-end mt-4">
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
    </div>
  );
};

export default CalendarForm;
