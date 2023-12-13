import React, { useEffect, useState } from 'react';
import PieChart from '../../component/analysis/PieChart';
import { collection, getFirestore, getDocs, getDoc, doc } from 'firebase/firestore';
import Navbar from '@/component/Navbar';
import ComingPeople from '@/component/analysis/ComingPeople';
import Ranking from '@/component/analysis/Ranking';

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
    const ramensQuerySnapshot = await getDocs(collection(getFirestore(), 'ramens'));

    const ramenDict: MenuNameDictionary = {};
    await Promise.all(ramensQuerySnapshot.docs.map(async (doc) => {
      ramenDict[doc.id] = doc.data().name;
    }));

    return ramenDict;
  }

  // userの好みのラーメンとトッピングを辞書に格納
  const countUserPreferences = async () => {
    const menuDict = await FetchMenuData();
    const ramenCount: MenuCountDictionary = {};
    const toppingCount: MenuCountDictionary = {};

    const querySnapshot = await getDocs(collection(getFirestore(), 'users'));
    await Promise.all(querySnapshot.docs.map(async (user) => {
      const docSnap = await getDoc(doc(getFirestore(), `users/${user.id}/`));
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
          <div className="w-9/12 h-9/12 mx-auto my-12">
            <h2 className="text-2xl font-bold text-center mb-4">人気度調査</h2>
            <div className="flex flex-row items-center justify-center">
              <PieChart title="お客様のお好みラーメン" dict={favoriteRamen} />
              <PieChart title="お客様のお好みtopping" dict={favoriteTopping} />
            </div>
          </div>
          <div className="w-9/12 h-9/12 mx-auto my-12">
            <h2 className="text-2xl font-bold text-center mb-4">来店人数</h2>
            <ComingPeople />
          </div>
          <div className="w-9/12 h-9/12 mx-auto my-12">
            <Ranking />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
