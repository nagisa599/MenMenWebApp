import Navbar from "@/component/Navbar";
import React, { useState } from "react";
import Link from "next/link";
import { addDoc, collection, getDocs, getFirestore, query, updateDoc, where, doc } from "firebase/firestore";
import CalendarComponent from "@/component/setting/Calendar";
import ErrorMessage from "@/utils/ErrorFormat";

interface openTime {
  start: string; // 開始時間
  end: string;   // 終了時間
}

interface BusinessHours {
  lunch: openTime;
  dinner: openTime;
}

interface BusinessHoursByDay {
  weekday: BusinessHours;
  saturday: BusinessHours;
  sunday: BusinessHours;
}

interface BusinessHoursChangeProps {
  day: keyof BusinessHoursByDay,
  time: 'lunch' | 'dinner',
  key: keyof openTime,
  value: string
}

const CalendarForm: React.FC = () => {
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<string>();
  const [closedDays, setClosedDays] = useState<Date[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHoursByDay>({
    weekday: { lunch: { start: '', end: '' }, dinner: { start: '', end: '' } },
    saturday: { lunch: { start: '', end: '' }, dinner: { start: '', end: '' } },
    sunday: { lunch: { start: '', end: '' }, dinner: { start: '', end: '' } },
  });

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  };

  // 営業時間の更新を行う関数
  const handleBusinessHoursChange = (props: BusinessHoursChangeProps) => {
    setBusinessHours(prev => ({
      ...prev,
      [props.day]: {
        ...prev[props.day],
        [props.time]: { ...prev[props.day][props.time], [props.key]: props.value }
      }
    }));
  };

  const registerCalendar = async () => {
    try {
      const q = query(collection(getFirestore(), 'calendar'), where('year', '==', Number(year)), where('month', '==', Number(month)));
      const querySnapshot = await getDocs(q);
      let docExists = false;
      let docId = '';

      querySnapshot.forEach((doc) => {
        docExists = true;
        docId = doc.id;
      });

      const sortedClosedDays = closedDays
        .map(timestamp => new Date(timestamp)) // タイムスタンプをDateオブジェクトに変換
        .sort((a, b) => a.getTime() - b.getTime()) // Dateオブジェクトでソート
        .map(date => formatDate(date)); // 日付を文字列に変換

      if (docExists) {
        await updateDoc(doc(getFirestore(), 'calendar', docId), {
          dayoff: sortedClosedDays,
          businessHours: businessHours,
        });
      } else {
        await addDoc(collection(getFirestore(), 'calendar'), {
          year: Number(year),
          month: Number(month),
          dayoff: sortedClosedDays,
          businessHours: businessHours,
        });
      }

      setBusinessHours({
        weekday: { lunch: { start: '', end: '' }, dinner: { start: '', end: '' } },
        saturday: { lunch: { start: '', end: '' }, dinner: { start: '', end: '' } },
        sunday: { lunch: { start: '', end: '' }, dinner: { start: '', end: '' } },
      });
      setClosedDays([]);
      setMonth('');
      setYear('');
    } catch (err) {
      ErrorMessage('カレンダーの登録に失敗しました。', err);
    }
  };

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
                  <label className="block mb-1 font-bold">平日</label>
                  <div className="mb-2">
                    <label className="block mb-1">昼の営業時間</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.weekday.lunch.start}
                        onChange={(e) => handleBusinessHoursChange({ day: 'weekday', time: 'lunch', key: 'start', value: e.target.value })}
                      />
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.weekday.lunch.end}
                        onChange={(e) => handleBusinessHoursChange({ day: 'weekday', time: 'lunch', key: 'end', value: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">夜の営業時間</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.weekday.dinner.start}
                        onChange={(e) => handleBusinessHoursChange({ day: 'weekday', time: 'dinner', key: 'start', value: e.target.value })}
                      />
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.weekday.dinner.end}
                        onChange={(e) => handleBusinessHoursChange({ day: 'weekday', time: 'dinner', key: 'end', value: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-bold">土曜</label>
                  <div className="mb-2">
                    <label className="block mb-1">昼の営業時間</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.saturday.lunch.start}
                        onChange={(e) => handleBusinessHoursChange({ day: 'saturday', time: 'lunch', key: 'start', value: e.target.value })}
                      />
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.saturday.lunch.end}
                        onChange={(e) => handleBusinessHoursChange({ day: 'saturday', time: 'lunch', key: 'end', value: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">夜の営業時間</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.saturday.dinner.start}
                        onChange={(e) => handleBusinessHoursChange({ day: 'saturday', time: 'dinner', key: 'start', value: e.target.value })}
                      />
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.saturday.dinner.end}
                        onChange={(e) => handleBusinessHoursChange({ day: 'saturday', time: 'dinner', key: 'end', value: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold">日曜</label>
                  <div className="mb-2">
                    <label className="block mb-1">昼の営業時間</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.sunday.lunch.start}
                        onChange={(e) => handleBusinessHoursChange({ day: 'sunday', time: 'lunch', key: 'start', value: e.target.value })}
                      />
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.sunday.lunch.end}
                        onChange={(e) => handleBusinessHoursChange({ day: 'sunday', time: 'lunch', key: 'end', value: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">夜の営業時間</label>
                    <div className="flex space-x-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.sunday.dinner.start}
                        onChange={(e) => handleBusinessHoursChange({ day: 'sunday', time: 'dinner', key: 'start', value: e.target.value })}
                      />
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded"
                        type="time"
                        value={businessHours.sunday.dinner.end}
                        onChange={(e) => handleBusinessHoursChange({ day: 'sunday', time: 'dinner', key: 'end', value: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:col-span-6 pt-5">
            <div className="flex justify-end mt-4">
              <button
                className="text-white px-8 py-2 font-black rounded bg-indigo-600 hover:bg-indigo-700"
                onClick={registerCalendar}
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
