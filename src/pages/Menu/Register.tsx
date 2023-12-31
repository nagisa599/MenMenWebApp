import React, { useState } from 'react';
import MenuForm from '@/component/menu/MenuForm'
import { getStorage, uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Menu } from '@/interfaces/menu/Menu';
import Navbar from '@/component/utils/Navbar';
import ErrorMessage from '@/utils/ErrorFormat';


const MenuRegister: React.FC = () => {
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
      await addDoc(collection(getFirestore(), 'ramens'), {
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
    } catch (err) {
      ErrorMessage('メニューの追加に失敗しました。', err);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const storageRef = ref(getStorage(), `${file.name}`);
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((url) => {
          setNewMenu({ ...newMenu, image: url });
        });
      });
    } else {
      ErrorMessage('ファイルが選択されていません。');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setNewMenu({ ...newMenu, [name]: inputValue });
  };

  return (
    <div className='mb-5'>
      <Navbar />
      <MenuForm
        newMenu={newMenu}
        handleInputChange={handleInputChange}
        handleFileInputChange={handleFileInputChange}
        addNewMenu={addNewMenu}
      />
    </div>
  )
}

export default MenuRegister;