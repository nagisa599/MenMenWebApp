import React from 'react';
import Image from 'next/image';
import { Coupon } from '@/interfaces/coupon/Coupon';
import { formatDateToYYMMDD } from "@/utils/DateFormat";

interface CouponTableProps {
  coupons: Coupon[];
}

const CouponTable: React.FC<CouponTableProps> = ({ coupons }) => {
  return (
    <div className="relative max-h-[600px] overflow-y-auto">
      <table className="table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3">名前</th>
            <th scope="col" className="px-6 py-3">画像</th>
            <th scope="col" className="px-6 py-3">説明</th>
            <th scope="col" className="px-6 py-3">ターゲット</th>
            <th scope="col" className="px-6 py-3">期限</th>
            <th scope="col" className="px-6 py-3">作成日</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {coupon.name}
              </th>
              <td className="px-6 py-4">
                <Image src={coupon.image} alt={coupon.name} width={100} height={100} />
              </td>
              <td className="px-6 py-4">
                {coupon.content}
              </td>
              <td className="px-6 py-4">
                {coupon.target}
              </td>
              <td className="px-6 py-4">
                {formatDateToYYMMDD(coupon.expire)}
              </td>
              <td className="px-6 py-4">
                {formatDateToYYMMDD(coupon.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponTable;