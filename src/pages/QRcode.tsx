import Navbar from "@/component/Navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import QRCode from 'qrcode.react';

const QRcode: React.FC = () => {
  const [qrCodeValue, setQrCodeValue] = useState<string>('');

  useEffect(() => {
    const fetchTokenFromFirebase = async () => {
      const db = getFirestore();
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const tokenDoc = await getDoc(doc(db, 'tokens', formattedDate));

      if (tokenDoc.exists()) {
        setQrCodeValue(tokenDoc.data().token);
      } else {
        console.log('トークンが存在しません');
      }
    };

    fetchTokenFromFirebase();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mb-5">
      <Navbar />
      <div className="mx-60 my-8 divide-y divide-gray-200">
        <div className='my-3 flex justify-between items-center'>
          <h2 className="text-lg font-black leading-6 text-gray-900">QRコード生成</h2>
          <Link href="/Setting" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-black rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            設定画面へ戻る
          </Link>
        </div>
        <div className="my-3 py-5 flex flex-col items-center">
          {qrCodeValue ? (
            <>
              <QRCode value={qrCodeValue} size={256} />
              <button
                onClick={handlePrint}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                印刷する
              </button>
            </>
          ) : (
            <p>トークンを読み込み中...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRcode;