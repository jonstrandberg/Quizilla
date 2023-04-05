import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPXkBaa2Nv1Bf_a6gGpSIoG14INHdBBVU",
  authDomain: "quizilla-d6138.firebaseapp.com",
  databaseURL: "https://quizilla-d6138-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizilla-d6138",
  storageBucket: "quizilla-d6138.appspot.com",
  messagingSenderId: "574288623531",
  appId: "1:574288623531:web:f93ee7d24fb0e47fee04ee"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = () => {
  return auth.signInWithPopup(provider);
}

const signInWithEmailAndPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
}

const createUserWithEmailAndPassword = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
}

const signOut = () => {
  return auth.signOut();
}

export { database, auth, signInWithGoogle, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };

