import React, { useState } from "react";
import { Coupon } from "@/interfaces/Coupon";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { uploadBytes, getStorage, ref, getDownloadURL } from "firebase/storage";
import CouponForm from "@/component/CouponForm";

export default function CouponRegister() {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    id: '',
    name: '',
    content: '',
    target: '',
    expire: new Date(),
    createdAt: new Date(),
    image: '',
  });

  const addNewCoupon = async () => {
    try {
      const db = getFirestore();
      const couponRef = collection(db, 'coupons');
      await addDoc(couponRef, {
        name: newCoupon.name,
        content: newCoupon.content,
        target: newCoupon.target,
        expiredate: newCoupon.expire,
        createdAt: newCoupon.createdAt,
        imageURL: newCoupon.image,
      });
      setNewCoupon({
        id: '',
        name: '',
        content: '',
        target: '',
        expire: new Date(),
        createdAt: new Date(),
        image: '',
      });
    } catch (error) {
      console.error('クーポンの追加に失敗しました:', error);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
          setNewCoupon({ ...newCoupon, image: url });
        });
      });
    } else {
      console.log('ファイルが選択されていません');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setNewCoupon({ ...newCoupon, [name]: inputValue });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCoupon({ ...newCoupon, expire: new Date(e.target.value) });
  };

  return (
    <CouponForm
      newCoupon={newCoupon}
      handleInputChange={handleInputChange}
      handleFileInputChange={handleFileInputChange}
      handleDateChange={handleDateChange}
      addNewCoupon={addNewCoupon}
    />
  )
}