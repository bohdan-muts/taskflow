import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDs5dw5LZdv3yQJhMFRm_A8wPkno8A5lXY",
    authDomain: "taskflow-7d179.firebaseapp.com",
    projectId: "taskflow-7d179",
    storageBucket: "taskflow-7d179.firebasestorage.app",
    messagingSenderId: "565876538925",
    appId: "1:565876538925:web:505cda0d96dc2fd5dcc2a4",
    measurementId: "G-EF8ZM3R1YP"
  };
  
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const googleProvider = new GoogleAuthProvider();