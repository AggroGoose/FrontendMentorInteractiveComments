import Head from "next/head";
import Footer from "../components/UI/Footer";
import CommentItem from "../components/Comments/CommentItem";
import db from "../app/firebase";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { signOut, getAuth } from "firebase/auth";

export default function Home(props) {
  const [commentList, setCommentList] = useState({});
  const [userList, setUserList] = useState({});
  const auth = getAuth();
  const [user] = useAuthState(auth);

  useEffect(() => {
    setCommentList(props.comments);
    setUserList(props.users);
  }, []);

  useEffect(() => {
    const newUser = {};
    if (!user) return;
    const id = user.uid;
    if (!userList[id]) {
      newUser[id] = {
        display: user.displayName,
        picture: user.photoURL,
        commentVotes: null,
        replyVotes: null,
        subreplyVotes: null,
      };
      const newRef = doc(db.users, id);
      setDoc(newRef, newUser[id]).then(
        setUserList(Object.assign(userList, newUser))
      );
    }
  }, [user]);

  const signInHandler = () => {
    db.signInWithGithub();
  };

  const signOutHandler = () => {
    signOut(auth);
  };

  return (
    <div>
      <Head>
        <title>Interactive Comments</title>
        <meta
          name="description"
          content="Comment Project by AggroGoose for Frontend Mentor"
        />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <p>{user ? `Hello ${user.displayName}` : "Not Signed In"}</p>

      <main>
        <h1>Organizing Comments</h1>

        <button onClick={signInHandler}>Sign in with Github</button>
        <button onClick={signOutHandler}>Sign Out</button>

        {Object.entries(commentList).map(([key, value]) => (
          <div key={key}>
            <CommentItem id={key} comment={value} users={userList} />
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  const comments = {};
  const replyObj = {};
  const users = {};

  try {
    const res = await getDocs(db.comments);
    res.forEach((doc) => {
      const id = doc.id;
      const object = doc.data();
      object.createdAt = object.createdAt.toMillis();
      comments[id] = object;
    });
    console.log("Successfully Loaded Comments");
  } catch (error) {
    console.error("Error Loading Comments: ", error);
  }

  try {
    const res = await getDocs(db.replies);
    res.forEach((doc) => {
      const id = doc.id;
      const object = doc.data();
      object.createdAt = object.createdAt.toMillis();
      replyObj[id] = object;
    });
    console.log("Successfully Loaded Replies");
  } catch (error) {
    console.error("Error Loading Comments: ", error);
  }

  try {
    const res = await getDocs(db.subreplies);
    res.forEach((doc) => {
      const id = doc.id;
      const object = doc.data();
      const tar = object.forReply;
      const subs = replyObj[tar].subreplies || {};
      object.createdAt = object.createdAt.toMillis();
      subs[id] = object;
      replyObj[tar].subreplies = subs;
    });
    console.log("Successfully Loaded Subreplies");
  } catch (error) {
    console.error("Error Loading Subreplies: ", error);
  }

  for (const [key, value] of Object.entries(replyObj)) {
    const cId = value.forComment;
    const reps = comments[cId].replies || {};
    reps[key] = value;
    comments[cId].replies = reps;
  }

  try {
    const res = await getDocs(db.users);
    res.forEach((doc) => {
      const id = doc.id;
      const object = doc.data();
      users[id] = object;
    });
    console.log("Successfully Loaded Subreplies");
  } catch (error) {
    console.error("Error Loading Subreplies: ", error);
  }

  return {
    props: { comments, users },
  };
}
