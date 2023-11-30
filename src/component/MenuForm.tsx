import React from 'react';
import { Menu } from '@/interfaces/Menu';
import Navbar from './Navbar';
import Link from 'next/link';

interface MenuFormProps {
  newMenu: Menu;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addNewMenu: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ newMenu, handleInputChange, handleFileInputChange, addNewMenu }) => {
  return (
    <div className='mb-5'>
      <Navbar />
      <div className="divide-y divide-gray-200 mx-60">
        <div className='mt-3 flex justify-between items-center'>
          <h2 className="text-lg font-medium leading-6 text-gray-900 font-black">メニュー登録フォーム</h2>
          <Link href="/Menu" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-black rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            メニュー画面へ戻る
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
                value={newMenu.name}
                onChange={handleInputChange}
                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                placeholder='メニュー名'
              />
            </div>
          </div>

          <div className="sm:col-span-6 w-80 mt-1">
            <label htmlFor="price" className="block text-sm font-black text-gray-700">
              値段
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="price"
                name="price"
                value={newMenu.price}
                onChange={handleInputChange}
                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                placeholder="値段(円)"
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
              人気度
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="favorite"
                name="favorite"
                value={newMenu.favorite}
                onChange={handleInputChange}
                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                placeholder="人気度(1~5)"
              />
            </div>
          </div>

          <div className="sm:col-span-6 mt-1">
            <label className="block text-sm font-black text-gray-700">
              オプション
            </label>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  id="limit"
                  name="limit"
                  type="checkbox"
                  checked={newMenu.limit}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="limit" className="ml-3 block text-sm font-black text-gray-700">
                  期間限定
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="topping"
                  name="topping"
                  type="checkbox"
                  checked={newMenu.topping}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="topping" className="ml-3 block text-sm font-black text-gray-700">
                  トッピング
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="student"
                  name="student"
                  type="checkbox"
                  checked={newMenu.student}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="student" className="ml-3 block text-sm font-black text-gray-700">
                  学割対象
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="today"
                  name="today"
                  type="checkbox"
                  checked={newMenu.today}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="today" className="ml-3 block text-sm font-black text-gray-700">
                  今日提供
                </label>
              </div>
            </div>
          </div>

          <div className="sm:col-span-6 pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={addNewMenu}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-black rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                メニューを追加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuForm;
