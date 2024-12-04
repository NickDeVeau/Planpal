// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBEMHNJerxTRK6s7qiN1cwDi311cgvb7ZA",
    authDomain: "planpal-87cd3.firebaseapp.com",
    projectId: "planpal-87cd3",
    storageBucket: "planpal-87cd3.firebasestorage.app",
    messagingSenderId: "22618302891",
    appId: "1:22618302891:web:57160f2dd9929a95bb8aee",
    measurementId: "G-R3JBHZ7NZQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };