import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { signInWithPopup, GithubAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API,
  authDomain: process.env.NEXT_PUBLIC_FB_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FB_URL,
  projectId: process.env.NEXT_PUBLIC_FB_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER,
  appId: process.env.NEXT_PUBLIC_FB_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const ghProvider = new GithubAuthProvider();

const signInWithGithub = () => {
  signInWithPopup(auth, ghProvider)
    .then((res) => console.log(res))
    .catch((error) => console.error(error));
};

// Firestore Collections
const dataExport = {
  comments: collection(db, "comments"),
  replies: collection(db, "replies"),
  subreplies: collection(db, "subreplies"),
  users: collection(db, "users"),
  signInWithGithub,
  app,
  db,
};

export default dataExport;
