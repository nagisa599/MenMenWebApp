import React, { useState, useEffect } from 'react';
import { getApp } from 'firebase/app';
import { collection, addDoc, getFirestore, getDocs, query, getDoc, doc, setDoc } from 'firebase/firestore';
import Navbar from '@/component/Navbar';

interface Coupon {
  id: string;
  name: string;
  content: string;
  target: string;
  expiredate: string;
}

const Coupon = () => {
  const [coupons, setCoupon] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    id: '',
    name: '',
    content: '',
    target: '',
    expiredate: '',
  });
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [targetUser, setTargetUser] = useState<string>('');

  const generateMonthOptions = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December', 'All'
    ];
    return months.map((month, index) => (
      <option key={index} value={index + 1}>
        {month}
      </option>
    ));
  };
  
  const generateTargetOptions = (targetAll: boolean) => {
    if (targetAll) {
      return (
        <option value="all">
          すべての人
        </option>
      );
    } else {
      return generateMonthOptions();
    }
  };
  
  const fetchCoupons = async () => {
    try {
      const db = getFirestore();
      const couponsRef = collection(db, 'coupons');
      const querySnapshot = await getDocs(couponsRef);
      const couponData: Coupon[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        couponData.push({
          id: doc.id,
          name: data.name,
          content: data.content,
          target: data.target,
          expiredate: data.expiredate,
        });
      });
      setCoupon(couponData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCoupon({ ...newCoupon, [name]: value });
  };

  const addNewCoupon = async () => {
    try {
      const db = getFirestore();
      const couponsRef = collection(db, 'coupons');
      await addDoc(couponsRef, {
        name: newCoupon.name,
        content: newCoupon.content,
        target: newCoupon.target,
        expiredate: newCoupon.expiredate,
      });
      console.log('新しいクーポンが追加されました！');
      // 新しいクーポンを追加した後にクーポン一覧を再取得
      fetchCoupons();
      // フォームをリセット
      setNewCoupon({
        id: '',
        name: '',
        content: '',
        target: '',
        expiredate: '',
      });
    } catch (error) {
      console.error('クーポンの追加に失敗しました:', error);
    }
  };

  const handleCouponSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCouponId(e.target.value);
  };

  const handleTargetUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetUser(e.target.value);
  };

  const distributeCoupon = async () => {
    console.log(selectedCouponId);
    console.log(targetUser);
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const couponRef = collection(db,'coupons')
    const specificCouponDocRef = doc(couponRef, selectedCouponId);
    const couponInfo = await getDoc(specificCouponDocRef);
    const expire = couponInfo.data().expiredate;
    console.log(expire);
    const currentDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(currentDate.getDate() + expire );

    // usersコレクション内のドキュメントを取得
    const querySnapshot = await getDocs(usersCollection);
    await Promise.all(querySnapshot.docs.map(async (user) =>{
      const uid = user.id;
      const couponsRef = collection(db, `users/${uid}/hasCoupons`);
      const specificCouponDocRef = doc(couponsRef, selectedCouponId);
      await setDoc( specificCouponDocRef, {
        expire: expirationDate,
        used: false,
      });

      

  }))
}

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Coupons</h1>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="クーポン名"
            value={newCoupon.name}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="text"
            name="content"
            placeholder="内容"
            value={newCoupon.content}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="text"
            name="target"
            placeholder="対象"
            value={newCoupon.target}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="text"
            name="expiredate"
            placeholder="期限"
            value={newCoupon.expiredate}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <button onClick={addNewCoupon} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            クーポンを追加
          </button>
        </div>
        <div className="mb-4">
          <select onChange={handleCouponSelection} className="p-2 border border-gray-300 rounded mr-2">
            <option value="">クーポンを選択</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.name}
              </option>
            ))}
          </select>
          <select onChange={handleTargetUserChange} className="p-2 border border-gray-300 rounded mr-2">
    {generateTargetOptions(false)}
  </select>

          <button onClick={distributeCoupon} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
            クーポンを配布
          </button>
        </div>
        <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">名前</th>
            <th className="border border-gray-300 p-2">内容</th>
            <th className="border border-gray-300 p-2">期限</th>
            <th className="border border-gray-300 p-2">対象</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td className="border border-gray-300 p-2">{coupon.id}</td>
              <td className="border border-gray-300 p-2">{coupon.name}</td>
              <td className="border border-gray-300 p-2">{coupon.content}</td>
              <td className="border border-gray-300 p-2">{coupon.expiredate}</td>
              <td className="border border-gray-300 p-2">{coupon.target}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupon;

