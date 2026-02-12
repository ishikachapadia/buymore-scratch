import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDviPVOVkaTWyPxhBDq8MXKSzQYPtXhDfo",
  authDomain: "buymore-scratch.firebaseapp.com",
  projectId: "buymore-scratch",
  storageBucket: "buymore-scratch.firebasestorage.app",
  messagingSenderId: "605456172599",
  appId: "1:605456172599:web:b87aadc5ccdbc9fe75e1b2",
  measurementId: "G-96W6EBXFLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
