// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN41NBdFH6G1xWtmJOupiVdUu-21sn1Lw",
  authDomain: "horizon-29427.firebaseapp.com",
  databaseURL: "https://horizon-29427-default-rtdb.firebaseio.com",
  projectId: "horizon-29427",
  storageBucket: "horizon-29427.firebasestorage.app",
  messagingSenderId: "161948501013",
  appId: "1:161948501013:web:a5baed39725dae2f2f7a1c",
  measurementId: "G-2JVG8ZKWG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);