// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK_W-Y-dxl7ew0GXnnpj0wS6BxrsliHyo",
  authDomain: "school-management-63b8b.firebaseapp.com",
  databaseURL: "https://school-management-63b8b-default-rtdb.firebaseio.com/",
  projectId: "school-management-63b8b",
  storageBucket: "school-management-63b8b.firebasestorage.app",
  messagingSenderId: "679965494946",
  appId: "1:679965494946:web:1723c69e762286c62691fb",
  measurementId: "G-CV1BV0K8J4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth, firestore, and realtime database for use in the application
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
