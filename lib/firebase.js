import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfcvjvrNgNEjJ_FtKnM3OQ3hfgCLoS0dA",
  authDomain: "zedxuno.firebaseapp.com",
  projectId: "zedxuno",
  storageBucket: "zedxuno.firebasestorage.app",
  messagingSenderId: "30539220555",
  appId: "1:30539220555:web:b3e002162cf71c3fbd6fce"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider(); // Siapkan provider Google

export { auth, db, googleProvider };
