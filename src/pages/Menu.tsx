import React, { useState, useEffect } from 'react';
import { collection, getFirestore, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Navbar from '@/component/Navbar';
import MenuTable from '@/component/menu/MenuTable';
import { Menu } from '@/interfaces/menu/Menu';
import Link from 'next/link';

const MenuPage: React.FC = () => {
  const [menus, setMenu] = useState<Menu[]>([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(getFirestore(), 'ramens'));
      const menuDataPromises: Promise<Menu>[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const imageRef = ref(getStorage(), `${data.imageURL}`);
        const imageUrlPromise = getDownloadURL(imageRef);

        menuDataPromises.push(imageUrlPromise.then((imageUrl) => ({
          id: doc.id,
          name: data.name,
          image: imageUrl,
          favorite: data.favorite,
          limit: data.limit,
          price: data.price,
          student: data.student,
          today: data.today,
          topping: data.topping,
          updatedAt: data.updatedAt,
        })));
      });

      const menuData = await Promise.all(menuDataPromises);

      // topping が false のデータを前にするために、true と false の順に並び替え
      const sortedMenuData = menuData.sort((a, b) => {
        if (!a.topping && b.topping) {
          return -1; // aがfalseでbがtrueの場合、aを前にする
        } else if (a.topping && !b.topping) {
          return 1; // aがtrueでbがfalseの場合、bを前にする
        }
        return 0;
      });

      return sortedMenuData;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    fetchData().then((data) => {
      setMenu(data);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="divide-y divide-gray-200 mx-60 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">メニュー表</h1>
          <Link href="/MenuRegister" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            メニュー追加
          </Link>
        </div>

        <MenuTable menus={menus} />
      </div>
    </div>
  );
};

export default MenuPage;
