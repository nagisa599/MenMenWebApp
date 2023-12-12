import React from "react";
import { Coupon } from "@/interfaces/coupon/Coupon";
import Navbar from "../Navbar";
import Link from "next/link";
import { formatDateToYYMMDD } from "@/utils/DateFormat";

interface CouponFormProps {
  newCoupon: Coupon;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addNewCoupon: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ newCoupon, handleInputChange, handleFileInputChange, addNewCoupon, handleDateChange }) => {
  return (
    <div className="divide-y divide-gray-200 mx-60">
      <div className='mt-3 flex justify-between items-center'>
        <h2 className="text-lg font-medium leading-6 text-gray-900 font-black">クーポン登録フォーム</h2>
        <Link href="/Coupon" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-black rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          クーポン画面へ戻る
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6 mt-3 w-80">
          <label htmlFor="name" className="block text-sm font-black text-gray-700">
            メニュー名
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={newCoupon.name}
              onChange={handleInputChange}
              className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="sm:col-span-6 mt-1">
          <label htmlFor="image" className="block text-sm font-black text-gray-700">
            画像ファイル
          </label>
          <div className="mt-1">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileInputChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div className="sm:col-span-6 w-80 mt-1">
          <label htmlFor="favorite" className="block text-sm font-black text-gray-700">
            内容
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="content"
              name="content"
              value={newCoupon.content}
              onChange={handleInputChange}
              className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6 w-80 mt-1">
          <label htmlFor="favorite" className="block text-sm font-black text-gray-700">
            ターゲット
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="target"
              name="target"
              value={newCoupon.target}
              onChange={handleInputChange}
              className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6 w-80 mt-1">
          <label htmlFor="favorite" className="block text-sm font-black text-gray-700">
            期限
          </label>
          <div className="mt-1">
            <input
              type="date"
              id="expire"
              name="expire"
              value={formatDateToYYMMDD(newCoupon.expire)}
              onChange={handleDateChange}
              className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6 pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={addNewCoupon}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-black rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              クーポンを追加
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CouponForm;