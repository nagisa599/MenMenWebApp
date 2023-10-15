import React, { useState, useEffect } from 'react';
import { getApp } from 'firebase/app';
import { collection, addDoc, getFirestore, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import Navbar from '@/component/Navbar';


interface Menu {
  id: string;
  name: string;
  image: string;
  favorite: number;
  limit: boolean;
  student: boolean;
  today: boolean;
  topping: boolean;
  price: number;
}

const Menu: NextPage = () => {
  const [menus, setMenu] = useState<Menu[]>([]);
  const [newMenu, setNewMenu] = useState<Menu>({
    id: '',
    name: '',
    image: '',
    favorite: 0,
    limit: false,
    student: false,
    today: false,
    topping: false,
    price: 0,
  });

  const fetchData = async () => {
    try {
      const db = getFirestore();
      const menusRef = collection(db, 'ramens');
      const querySnapshot = await getDocs(menusRef);
      const menuDataPromises: Promise<Menu>[] = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const imageRef = ref(getStorage(), `${data.imageURL}`);
        const imageUrlPromise = getDownloadURL(imageRef);
  
        // 画像URLの取得をPromiseで保持
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
        })));
      });

      // すべてのデータを非同期で取得
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
  

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]; // 選択されたファイルを取得
    if (file) {
      // Firebase Storageにアップロード
      const storage = getStorage();
      const storageRef = ref(storage, `${file.name}`);
      // const storageRef = ref(storage, `${process.env.FILEPATH}/${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('ファイルがアップロードされました');
        // アップロードが完了したら、画像のURLを取得
        getDownloadURL(storageRef).then((url) => {
          setNewMenu({ ...newMenu, image: url });
        });
      });
    } else {
      console.log('ファイルが選択されていません');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setNewMenu({ ...newMenu, [name]: inputValue });
  };

  const addNewMenu = async () => {
    try {
      const db = getFirestore();
      const menusRef = collection(db, 'ramens');
      await addDoc(menusRef, {
        name: newMenu.name,
        price: newMenu.price,
        limit: newMenu.limit,
        imageURL: newMenu.image,
        student: newMenu.student,
        today: newMenu.today,
        topping: newMenu.topping,
        favorite: newMenu.favorite,
      });
      console.log('新しいメニューが追加されました！');
      // 新しいメニューを追加した後にメニュー一覧を再取得
      fetchData();
      // フォームをリセット
      setNewMenu({
        id: '',
        name: '',
        image: '',
        favorite: 0,
        limit: false,
        student: false,
        today: false,
        topping: false,
        price: 0,
      });
    } catch (error) {
      console.error('メニューの追加に失敗しました:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">メニュー</h1>
        <div className="mb-4">
          <label htmlFor="name" className="mr-2">メニュー名:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="メニュー名"
            value={newMenu.name}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <label htmlFor="image" className="mr-2">画像ファイル:</label>
          <input
            type="file"
            id="image"
            name="image"
            placeholder="画像"
            onChange={handleFileInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <label htmlFor="price" className="mr-2">値段:</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="値段"
            value={newMenu.price}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <label htmlFor="favorite" className="mr-2">人気度:</label>
          <input
            type="number"
            id="favorite"
            name="favorite"
            placeholder="人気度"
            value={newMenu.favorite}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <label htmlFor="limit" className="mr-2">期間限定か:</label>
          <input
            type="checkbox"
            id="limit"
            name="limit"
            checked={newMenu.limit}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="topping" className="mr-2">トッピングか:</label>
          <input
            type="checkbox"
            id="topping"
            name="topping"
            checked={newMenu.topping}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="student" className="mr-2">学割対象か:</label>
          <input
            type="checkbox"
            id="student"
            name="student"
            checked={newMenu.student}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="today" className="mr-2">今日やっているか:</label>
          <input
            type="checkbox"
            id="today"
            name="today"
            checked={newMenu.today}
            onChange={handleInputChange}
            className="mr-2"
          />
          <button onClick={addNewMenu} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            メニューを追加
          </button>
        </div>
        <table className="min-w-full border border-gray-300">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">名前</th>
              <th className="border border-gray-300 p-2">画像</th>
              <th className="border border-gray-300 p-2">値段</th>
              <th className="border border-gray-300 p-2">学割</th>
              <th className="border border-gray-300 p-2">期間限定</th>
              <th className="border border-gray-300 p-2">今日やっているか</th>
              <th className="border border-gray-300 p-2">トッピングか</th>
              <th className="border border-gray-300 p-2">人気度</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id}>
                <td className="border border-gray-300 p-2">{menu.id}</td>
                <td className="border border-gray-300 p-2">{menu.name}</td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    style={{
                      maxWidth: 200,
                      height: "auto",
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2">{menu.price}</td>
                <td className="border border-gray-300 p-2">{menu.student ? '○' : ''}</td>
                <td className="border border-gray-300 p-2">{menu.limit ? '○' : ''}</td>
                <td className="border border-gray-300 p-2">{menu.today ? '○' : ''}</td>
                <td className="border border-gray-300 p-2">{menu.topping ? '○' : ''}</td>
                <td className="border border-gray-300 p-2">{menu.favorite}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Menu;
