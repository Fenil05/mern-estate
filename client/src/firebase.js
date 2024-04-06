// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-20e81.firebaseapp.com",
  projectId: "mern-estate-20e81",
  storageBucket: "mern-estate-20e81.appspot.com",
  messagingSenderId: "801484199607",
  appId: "1:801484199607:web:482f3bd911aa45aadbdf32"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);