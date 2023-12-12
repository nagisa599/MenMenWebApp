import React, { useState } from 'react';
import MenuForm from '@/component/MenuForm'
import { getStorage, uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Menu } from '@/interfaces/Menu';


export default function MenuRegister() {
  const [newMenu, setNewMenu] = useState<Menu>({
    id: '',
    name: '',
    image: '',
    favorite: '',
    limit: false,
    student: false,
    today: false,
    topping: false,
    price: '',
    updatedAt: new Date(),
  });

  const addNewMenu = async () => {
    try {
      const db = getFirestore();
      const menusRef = collection(db, 'ramens');
      await addDoc(menusRef, {
        name: newMenu.name,
        price: Number(newMenu.price),
        limit: newMenu.limit,
        imageURL: newMenu.image,
        student: newMenu.student,
        today: newMenu.today,
        topping: newMenu.topping,
        favorite: Number(newMenu.favorite),
        updatedAt: newMenu.updatedAt,
      });
      setNewMenu({
        id: '',
        name: '',
        image: '',
        favorite: '',
        limit: false,
        student: false,
        today: false,
        topping: false,
        price: '',
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('メニューの追加に失敗しました:', error);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
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

  return (
    <MenuForm
      newMenu={newMenu}
      handleInputChange={handleInputChange}
      handleFileInputChange={handleFileInputChange}
      addNewMenu={addNewMenu}
    />
  )
}
