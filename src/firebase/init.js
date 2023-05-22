import { getFirestore } from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDzUXmQYIyvgdNCbXzMaySgO05kV8xIIg0",
  authDomain: "mini-capstone-vue-firebase.firebaseapp.com",
  projectId: "mini-capstone-vue-firebase",
  storageBucket: "mini-capstone-vue-firebase.appspot.com",
  messagingSenderId: "618106326696",
  appId: "1:618106326696:web:08d39ca1ec26746fca7c9d",
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

export { auth, db, app };
