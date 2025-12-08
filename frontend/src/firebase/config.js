import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOlsTCb5_U-4jaB3Uw5xfYSCrARL7oNME",
  authDomain: "school-stock-2e4eb.firebaseapp.com",
  projectId: "school-stock-2e4eb",
  storageBucket: "school-stock-2e4eb.firebasestorage.app",
  messagingSenderId: "197054753864",
  appId: "1:197054753864:web:1b99b52b96700156df3c7d",
  measurementId: "G-NTZZCCNYE0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
