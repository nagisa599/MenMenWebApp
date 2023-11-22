import React, { useState, useEffect } from "react"
import Navbar from "@/component/Navbar"
import { getDocs, getFirestore, query, where, collection, orderBy } from "firebase/firestore";
import Image from "next/image";
import { ref, getStorage, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [lunchTime, setLunchTime] = useState<string>('お休みです');
  const [dinnerTime, setDinnerTime] = useState<string>('お休みです');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [ramenNames, setRamenNames] = useState<string[]>([]);
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const year = today.getFullYear();
  const dayName = weekdays[today.getDay()];

  const [selectedRamen, setSelectedRamen] = useState('');
  const [selectedTopping, setSelectedTopping] = useState('');

  // プルダウンメニューの選択肢
  const ramenOptions = ['ラーメン1', 'ラーメン2', 'ラーメン3']; // 仮データ
  const toppingOptions = ['トッピング1', 'トッピング2', 'トッピング3']; // 仮データ

  const handleRamenChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedRamen(e.target.value);
  };

  const handleToppingChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedTopping(e.target.value);
  };

  const handleSubmit = () => {
    // Firebaseに選択されたラーメンとトッピングを登録
  };

  useEffect(() => {
    const db = getFirestore();
    const storage = getStorage();

    const setHeaderTitle = async () => {
      try {
        const calendarQuery = query(collection(db, 'calendar'),
          where('month', '==', month),
          where('year', '==', year),
        );
        const querySnapshot = await getDocs(calendarQuery);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.schedule[dayName]?.lunch) {
            setLunchTime(data.schedule[dayName].lunch);
          }
          if (data.schedule[dayName]?.dinner) {
            setDinnerTime(data.schedule[dayName].dinner);
          }
        });
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };

    const setTodayMenu = async () => {
      try {
        const menuQuery = query(collection(db, 'ramens'), where('today', '==', true), orderBy('topping', 'desc'));
        const querySnapshot = await getDocs(menuQuery);
        const tempImageUrls = [];
        const tempRamenNames = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const imageUrl = await getDownloadURL(ref(storage, data.imageURL));
          tempImageUrls.push(imageUrl);
          tempRamenNames.push(data.name);
        }

        setImageUrls(tempImageUrls);
        setRamenNames(tempRamenNames);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    Promise.all([setHeaderTitle(), setTodayMenu()]);
  }, []);

  
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="mb-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">本日({`${month}月${day}日`})の営業時間</h2>
          <div className="mt-2">
            <p>昼: {lunchTime}</p>
            <p>夜: {dinnerTime}</p>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold">本日の限定メニュー</h2>
          <div className="flex mt-2 gap-4">
            {imageUrls.map((imageUrl, index) => {
              return (
                <div key={index} className="flex flex-col items-center">
                  <Image 
                    src={imageUrl} 
                    alt={ramenNames[index]}
                    width={150} 
                    height={150} 
                  />
                  <p>{ramenNames[index]}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-6">
        <h2 className="text-lg font-semibold">翌日の限定メニューを設定</h2>
        <div className="flex mt-4">
          <div className="mr-2">
            <select
              value={selectedRamen}
              onChange={handleRamenChange}
              className="p-2 border border-gray-300 rounded"
            >
              {ramenOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="mr-2">
            <select
              value={selectedTopping}
              onChange={handleToppingChange}
              className="p-2 border border-gray-300 rounded"
            >
              {toppingOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            確認
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}