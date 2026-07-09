import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4Q9_Jyw8b_fmXAfDS9_wChOPRlcC85Hs",
  authDomain: "clinic-management-59622.firebaseapp.com",
  projectId: "clinic-management-59622",
  storageBucket: "clinic-management-59622.firebasestorage.app",
  messagingSenderId: "653847010291",
  appId: "1:653847010291:web:18beceab6cba72f24e5086",
  measurementId: "G-Q2J8P97BQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
