import React, { useState, useEffect } from "react"
import Navbar from "@/component/utils/Navbar"
import { getDocs, getFirestore, query, where, collection } from "firebase/firestore";
import Image from "next/image";
import { ref, getStorage, getDownloadURL } from "firebase/storage";
import ErrorMessage from "@/utils/ErrorFormat";

const HomeInfoComponent: React.FC = () => {
  const [lunchTime, setLunchTime] = useState<string>('');
  const [dinnerTime, setDinnerTime] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [ramenNames, setRamenNames] = useState<string[]>([]);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const year = today.getFullYear();

  useEffect(() => {
    const setHeaderTitle = async () => {
      try {
        const calendarQuery = query(collection(getFirestore(), 'calendar'),
          where('month', '==', month),
          where('year', '==', year),
        );
        const querySnapshot = await getDocs(calendarQuery);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.dayoff.includes(`${month}/${day}`)) {
            setLunchTime('お休みです');
            setDinnerTime('お休みです')
          } else if (today.getDay() !== 0 && today.getDay() !== 6) {
            setLunchTime(`${data.businessHours.weekday.lunch.start}~${data.businessHours.weekday.lunch.end}`)
            setDinnerTime(`${data.businessHours.weekday.dinner.start}~${data.businessHours.weekday.dinner.end}`)
          } else if (today.getDay() === 0) {
            setLunchTime(`${data.businessHours.sunday.lunch.start}~${data.businessHours.sunday.lunch.end}`)
            setDinnerTime(`${data.businessHours.sunday.dinner.start}~${data.businessHours.sunday.dinner.end}`)
          } else {
            setLunchTime(`${data.businessHours.saturday.lunch.start}~${data.businessHours.saturday.lunch.end}`)
            setDinnerTime(`${data.businessHours.saturday.dinner.start}~${data.businessHours.saturday.dinner.end}`)
          }
        });
      } catch (err) {
        ErrorMessage('今日のお店の情報の取得に失敗しました。', err);
      }
    };

    const setTodayMenu = async () => {
      today.setHours(0, 0, 0, 0); // 時間をリセットして日付のみに焦点を合わせる

      try {
        const querySnapshot = await getDocs(query(collection(getFirestore(), 'ramens')));
        const tempImageUrls = [];
        const tempRamenNames = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();

          if (data.today) {
            const menuDate = new Date(data.today.toDate());
            menuDate.setHours(0, 0, 0, 0); // Firestore のタイムスタンプから日付のみを取得

            if (menuDate.getTime() === today.getTime()) {
              const imageUrl = await getDownloadURL(ref(getStorage(), data.imageURL));
              tempImageUrls.push(imageUrl);
              tempRamenNames.push(data.name);
            }
          } else {
            const imageUrl = await getDownloadURL(ref(getStorage(), data.imageURL));
            tempImageUrls.push(imageUrl);
            tempRamenNames.push(data.name);
          }
        }

        setImageUrls(tempImageUrls);
        setRamenNames(tempRamenNames);
      } catch (err) {
        ErrorMessage('今日のメニューの取得に失敗しました。', err);
      }
    };

    Promise.all([setHeaderTitle(), setTodayMenu()]);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="divide-y divide-gray-200 mx-60 p-4">
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

export default HomeInfoComponent;