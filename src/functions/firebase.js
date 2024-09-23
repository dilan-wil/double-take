import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCij34i8i9iaj8dg-2OjGnoQz3NYbwHK4w",
  authDomain: "double-take-c1339.firebaseapp.com",
  projectId: "double-take-c1339",
  storageBucket: "double-take-c1339.appspot.com",
  messagingSenderId: "281396250241",
  appId: "1:281396250241:web:2a02f3d102ca94b1e02f80",
  measurementId: "G-6W0LDDP62X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, storage, db }