import React, { useEffect, useState } from 'react';
import LineChart from '../component/LineChart';
import PieChart from '../component/PieChart';
import { collection, addDoc, getFirestore, getDocs, query, getDoc, doc, setDoc } from 'firebase/firestore';
import Navbar from '@/component/Navbar';
import { closeSync } from 'fs';

interface MenuNameDictionary {
  [key: string]: string;
}

export interface MenuCountDictionary {
  [key: string]: number;
}

const Analyze: React.FC = () => {
  const [favoriteRamen, setFavoriteRamen] = useState<MenuCountDictionary>({})
  const [favoriteTopping, setFavoriteTopping] = useState<MenuCountDictionary>({});
  const [isLoading, setIsLoading] = useState(true);

  // idとメニュー名の辞書を作成
  const FetchMenuData = async () => {
    const db = getFirestore();
    const ramensCollection = collection(db, 'ramens');
    const ramensQuerySnapshot = await getDocs(ramensCollection);

    const ramenDict: MenuNameDictionary = {};
    await Promise.all(ramensQuerySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      ramenDict[doc.id] = data.name;
    }));

    return ramenDict;
  }

  // userの好みのラーメンとトッピングを辞書に格納
  const countUserPreferences = async () => {
    const menuDict = await FetchMenuData();
    const ramenCount: MenuCountDictionary = {};
    const toppingCount: MenuCountDictionary = {};

    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    await Promise.all(querySnapshot.docs.map(async (user) => {
      const uid = user.id;
      const userRef = doc(db, `users/${uid}/`);
      const docSnap = await getDoc(userRef);
      const ramen = docSnap.data()?.ramen;
      const topping = docSnap.data()?.topping;

      if (menuDict[ramen]) {
        ramenCount[menuDict[ramen]] = (ramenCount[menuDict[ramen]] || 0) + 1;
      }

      if (menuDict[topping]) {
        toppingCount[menuDict[topping]] = (toppingCount[menuDict[topping]] || 0) + 1;
      }
    }))
    setFavoriteRamen(ramenCount);
    setFavoriteTopping(toppingCount);
    setIsLoading(false);
  }

  useEffect(() => {
    countUserPreferences();
    setIsLoading(false);
  }, []);

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="w-full h-full flex flex-row items-center justify-center">
            <PieChart title="お客様のお好みラーメン" dict={favoriteRamen} />
            <PieChart title="お客様のお好みtopping" dict={favoriteTopping} />
          </div>
          <div>
            <LineChart />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
