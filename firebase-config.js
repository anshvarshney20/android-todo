// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDNkjUds31JCiGtUipCdMZrpTYE0M2f6uU",
    authDomain: "todo-38737.firebaseapp.com",
    projectId: "todo-38737",
    storageBucket: "todo-38737.appspot.com",
    messagingSenderId: "601692062884",
    appId: "1:601692062884:web:80ea753d99ff4b982d9231",
    measurementId: "G-H5WVN3GEBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)
export { db };
