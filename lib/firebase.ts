import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBs9IsiCrasfts84KUxB5P7DJZWSHvZTOM",
  authDomain: "cultura-c3564.firebaseapp.com",
  projectId: "cultura-c3564",
  storageBucket: "cultura-c3564.firebasestorage.app",
  messagingSenderId: "497932039053",
  appId: "1:497932039053:web:f54828f361b9c821df03c4",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
