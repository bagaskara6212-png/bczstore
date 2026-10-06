import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7EqKCgfQSsqGihcE3jGwG8N6MlBzx-hc",
  authDomain: "bczstore-f952b.firebaseapp.com",
  projectId: "bczstore-f952b",
  storageBucket: "bczstore-f952b.firebasestorage.app",
  messagingSenderId: "645819810761",
  appId: "1:645819810761:web:d4fc95fcb4b1cc9cd29e18",
  measurementId: "G-6S4PEBLSYP"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;