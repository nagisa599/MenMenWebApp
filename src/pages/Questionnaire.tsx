import React, { useState, useEffect } from 'react';
import { getApp } from 'firebase/app';
import { collection, addDoc, getFirestore, getDocs, query, getDoc, doc, setDoc } from 'firebase/firestore';
import Navbar from '@/component/Navbar';
import { useSession } from 'next-auth/react'

interface Coupon {
  url: string;
  createdAt: string;
}

const Coupon = () => {
  const [urls, setUrl] = useState<Coupon[]>([]);
  const [newUrl, setNewUrl] = useState<Coupon>({
    url: '',
    createdAt: '',
  });
  const { data: session } = useSession();

  const fetchCoupons = async () => {
    try {
      const db = getFirestore();
      const couponsRef = collection(db, 'googleFormUrl');
      const querySnapshot = await getDocs(couponsRef);
      const couponData: Coupon[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
      
        couponData.push({
          url: data.url,
          createdAt: data.createdAt.toDate().toISOString(),
        });
      });
      setUrl(couponData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUrl({ ...newUrl, [name]: value });
  };

  const addnewUrl = async () => {
    const createdAt= new Date();
    try {
      const db = getFirestore();
      const couponsRef = collection(db, 'googleFormUrl');
      console.log(couponsRef);
      await addDoc(couponsRef, {
        url: newUrl.url,
        createdAt: createdAt,
       
      });
      console.log('新しいクーポンが追加されました！');
      // 新しいクーポンを追加した後にクーポン一覧を再取得
      fetchCoupons();
      // フォームをリセット
      setNewUrl({
        url: '',
        createdAt: '',
        
      });
    } catch (error) {
      console.error('クーポンの追加に失敗しました:', error);
    }
  };

  const handleTargetUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value; // 選択された値を取得する例
    // ここで選択された値に対する処理を行う
  };


  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">GoogleFromで作成したURLを貼って追加してください</h1>
        <div className="mb-4">
          <input
            type="text"
            name="url"
            placeholder="アンケートURL"
            value={newUrl.url}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
         
      
          <button onClick={addnewUrl} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            アンケート追加
          </button>
        </div>
        <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">アンケートURL</th>
            <th className="border border-gray-300 p-2">作成日</th>
       
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.url}>
              <td className="border border-gray-300 p-2">{url.url}</td>
              <td className="border border-gray-300 p-2">{url.createdAt}</td>
              
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupon;

