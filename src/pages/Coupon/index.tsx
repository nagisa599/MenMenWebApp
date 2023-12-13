import React, { useState, useEffect } from "react";
import Navbar from "@/component/Navbar";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Coupon } from "@/interfaces/coupon/Coupon";
import Link from "next/link";
import CouponTable from "@/component/coupon/CouponTable";
import { convertFirestoreTimestampToDate } from "@/utils/DateFormat";
import ErrorMessage from "@/utils/ErrorFormat";

const CouponPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchCouponData = async () => {
    try {
      const querySnapshot = await getDocs(collection(getFirestore(), 'coupons'));
      const couponDataPromises: Promise<Coupon>[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const imageRef = ref(getStorage(), `${data.imageURL}`);
        const imageUrlPromise = getDownloadURL(imageRef);

        couponDataPromises.push(imageUrlPromise.then((imageUrl) => ({
          id: doc.id,
          name: data.name,
          content: data.content,
          target: data.target,
          expire: convertFirestoreTimestampToDate(data.expiredate),
          createdAt: convertFirestoreTimestampToDate(data.createdAt),
          image: imageUrl,
        })));
      });

      const couponData = await Promise.all(couponDataPromises);
      return couponData;
    } catch (err) {
      ErrorMessage('クーポンデータの取得に失敗しました。', err);
      return [];
    }
  };

  useEffect(() => {
    fetchCouponData().then((couponData) => {
      setCoupons(couponData);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="divide-y divide-gray-200 mx-60 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">クーポン表</h1>
          <Link href="/Coupon/Register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            クーポン追加
          </Link>
        </div>
        <CouponTable coupons={coupons} />
      </div>
    </div>
  )
}

export default CouponPage;