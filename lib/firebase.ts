import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBs9IsiCrasfts84KUxB5P7DJZWSHvZTOM",
  authDomain: "cultura-c3564.firebaseapp.com",
  projectId: "cultura-c3564",
  storageBucket: "cultura-c3564.firebasestorage.app",
  messagingSenderId: "497932039053",
  appId: "1:497932039053:web:f54828f361b9c821df03c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Set persistence for auth
auth.setPersistence = auth.setPersistence || (() => Promise.resolve());

export default app;
