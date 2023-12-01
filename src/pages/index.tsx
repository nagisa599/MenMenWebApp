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
          <h2 className="text-lg font-semibold">本日の提供メニュー</h2>
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
      </div>
    </div>
  )
}