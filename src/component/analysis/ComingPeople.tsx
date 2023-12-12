import React, { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";


const ComingPeople: React.FC = () => {
  const [yesterdayPeople, setYesterdayPeople] = useState<number>(0);
  const [todayPeople, setTodayPeople] = useState<number>(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const fetchPeopleData = async () => {
    const db = getFirestore();
    const yesterdayCount = query(collection(db, 'visits'), where('visitDate', '>=', Timestamp.fromDate(yesterday)), where('visitDate', '<', Timestamp.fromDate(today)))
    const todayCount = query(collection(db, 'visits'), where('visitDate', '>=', Timestamp.fromDate(today)), where('visitDate', '<', Timestamp.fromDate(tomorrow)))
    const yesterdayQuerySnapshot = await getDocs(yesterdayCount);
    const todayQuerySnapshot = await getDocs(todayCount);
    setYesterdayPeople(yesterdayQuerySnapshot.size);
    setTodayPeople(todayQuerySnapshot.size);
  }

  useEffect(() => {
    fetchPeopleData();
  }, []);

  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <div className="w-full md:w-1/2 lg:w-1/3 mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
        <p className="text-lg font-semibold text-gray-700">昨日の来店人数</p>
        <div className="text-3xl font-bold text-blue-600">{yesterdayPeople}人</div>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
        <p className="text-lg font-semibold text-gray-700">今日の来店人数</p>
        <div className="text-3xl font-bold text-green-600">{todayPeople}人</div>
      </div>
    </div>
  )
}

export default ComingPeople;