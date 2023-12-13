import React, { useState } from "react";
import { Coupon } from "@/interfaces/coupon/Coupon";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import CouponForm from "@/component/coupon/CouponForm";
import Navbar from "@/component/Navbar";
import ErrorMessage from "@/utils/ErrorFormat";

const CouponRegister: React.FC = () => {
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
      await addDoc(collection(getFirestore(), 'coupons'), {
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
    } catch (err) {
      ErrorMessage('クーポンの登録に失敗しました。', err);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const storageRef = ref(getStorage(), `${file.name}`);
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((url) => {
          setNewCoupon({ ...newCoupon, image: url });
        });
      });
    } else {
      ErrorMessage('ファイルが選択されていません。');
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
    <div className="mb-5">
      <Navbar />
      <CouponForm
        newCoupon={newCoupon}
        handleInputChange={handleInputChange}
        handleFileInputChange={handleFileInputChange}
        handleDateChange={handleDateChange}
        addNewCoupon={addNewCoupon}
      />
    </div>
  )
}

export default CouponRegister;