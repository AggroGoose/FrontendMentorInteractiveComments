import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FB_API,
  authDomain: process.env.FB_DOMAIN,
  databaseURL: process.env.FB_URL,
  projectId: process.env.FB_ID,
  storageBucket: process.env.FB_BUCKET,
  messagingSenderId: process.env.FB_SENDER,
  appId: process.env.FB_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore Collections
const dataExport = {
  comments: collection(db, "comments"),
  replies: collection(db, "replies"),
  subreplies: collection(db, "subreplies"),
};

export default dataExport;
