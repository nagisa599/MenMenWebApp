import React, { useEffect, useState } from 'react';
import LineChart from '../component/LineChart';
import PieChart from '../component/PieChart';
import { collection, addDoc, getFirestore, getDocs, query, getDoc, doc, setDoc } from 'firebase/firestore';
import Navbar from '@/component/Navbar';
import { closeSync } from 'fs';


const Home: React.FC = () => {
  const toppingLabel = ['チーズ','明太子','のり','ねぎ','うずら','七味'];
  const ramenLabel = ['ラーメン','まぜそば','汁なし','カレー','つけ麺','モクヨージャンク'];
  const [favoriteRamen, setFavoriteRamen] = useState([0, 0, 0, 0, 0, 0])
  const [favoriteTopping,setFavoriteTopping] = useState([0,0,0,0,0,0]);
  const [isLoading,setIsLoading] = useState(true);

  const userFetchData = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    
    const updatedFavoriteRamen = [...favoriteRamen]; // 配列をコピー
    const updatedFavoriteTopping = [...favoriteTopping]; // 配列をコピー
    await Promise.all(querySnapshot.docs.map(async (user) => {
      const uid = user.id;
      const userRef = doc(db, `users/${uid}/`);
      const docSnap = await getDoc(userRef);
      const ramen = docSnap.data()?.ramen;
      const topping = docSnap.data()?.topping;
      if (ramen === 1) {
        updatedFavoriteRamen[0] += 1;
      } else if (ramen === 2) {
        updatedFavoriteRamen[1] += 1;
      } else if (ramen === 3) {
        updatedFavoriteRamen[2] += 1;
      } else if (ramen === 4) {
        updatedFavoriteRamen[3] += 1;
      } else if (ramen === 5) {
        updatedFavoriteRamen[4] += 1;
      } else {
        updatedFavoriteRamen[5] += 1;
      }

      if (topping === 50) {
        updatedFavoriteTopping[0] += 1;
      } else if (topping === 51) {
        updatedFavoriteTopping[1] += 1;
      } else if (topping === 52) {
        updatedFavoriteTopping[2] += 1;
      } else if (topping === 53) {
        updatedFavoriteTopping[3] += 1;
      } else if (topping === 54) {
        updatedFavoriteTopping[4] += 1;
      } else {
        updatedFavoriteTopping[5] += 1;
      }
    }));
    
    setFavoriteRamen(updatedFavoriteRamen);
    setFavoriteTopping(updatedFavoriteTopping);
    setIsLoading(false);
  };
  useEffect(()=>{
   userFetchData();
   setIsLoading(false);
  }, []);
  return (
    <div>
      <Navbar />
      <div className="w-full h-full flex flex-row items-center justify-center">
        <PieChart title="お客様のお好みラーメン"favorite={favoriteRamen} label={ramenLabel}/>
        <PieChart title="お客様のお好みtopping"favorite={favoriteTopping} label={toppingLabel}/>
      </div>
      <LineChart />
    </div>
  );
};

export default Home;
