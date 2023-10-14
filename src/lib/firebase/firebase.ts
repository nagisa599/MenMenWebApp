// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5JBEY4xO7yWI0nuMT2_uTZGI_Jf8qiFQ",
  authDomain: "menmen-d01dd.firebaseapp.com",
  databaseURL: "https://menmen-d01dd-default-rtdb.firebaseio.com",
  projectId: "menmen-d01dd",
  storageBucket: "menmen-d01dd.appspot.com",
  messagingSenderId: "198734895280",
  appId: "1:198734895280:web:c7a510b66dff0c1bdc0375",
  measurementId: "G-EDX2JY3CDH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const initializeFirebaseApp = () =>
  !getApps().length ? initializeApp(firebaseConfig) : getApp()