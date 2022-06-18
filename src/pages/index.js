import Head from "next/head";
import Footer from "../components/UI/Footer";
import CommentItem from "../components/Comments/CommentItem";
import db from "../app/firebase";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState, useContext } from "react";
import { getAuth } from "firebase/auth";
import { UserUpdateContext } from "../app/userContext";
import HeaderNav from "../components/UI/HeaderNav";

export default function Home(props) {
  const [commentList, setCommentList] = useState({});
  const [userList, setUserList] = useState({});
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const updateUser = useContext(UserUpdateContext);

  useEffect(() => {
    setCommentList(props.comments);
    setUserList(props.users);
  }, []);

  useEffect(() => {
    const newUser = {};
    if (!user) {
      updateUser({ type: "LOGOUT" });
      return;
    }
    const id = user.uid;
    if (!userList[id]) {
      newUser[id] = {
        display: user.displayName,
        picture: user.photoURL,
        commentReacts: null,
        replyReacts: null,
        subreplyReacts: null,
      };
      setDoc(doc(db.users, id), newUser[id]).then(
        setUserList(Object.assign(userList, newUser))
      );
    }

    updateUser({
      type: "LOGIN",
      user: {
        userID: id,
        ...userList[id],
      },
    });
  }, [user]);

  return (
    <>
      <Head>
        <Head>
          <title>Interactive Comments</title>
        </Head>
      </Head>
      <main>
        <HeaderNav />
        <h1>Organizing Comments</h1>

        {Object.entries(commentList).map(([key, value]) => (
          <div key={key}>
            <CommentItem id={key} comment={value} users={userList} />
          </div>
        ))}
      </main>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const comments = {};
  const replyObj = {};
  const users = {};

  getDocs(db.comments)
    .then((res) => {
      res.forEach((doc) => {
        const id = doc.id;
        const object = doc.data();
        object.createdAt = object.createdAt.toMillis();
        comments[id] = object;
      });
      console.log("Successfully Loaded Comments");
    })
    .catch((error) => {
      console.error("Error Loading Comments: ", error);
    });

  getDocs(db.replies)
    .then((res) => {
      res.forEach((doc) => {
        const id = doc.id;
        const object = doc.data();
        object.createdAt = object.createdAt.toMillis();
        replyObj[id] = object;
      });
      console.log("Successfully Loaded Replies");
    })
    .catch((error) => {
      console.error("Error Loading Replies: ", error);
    });

  getDocs(db.subreplies)
    .then((res) => {
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
    })
    .catch((error) => {
      console.error("Error Loading Subreplies: ", error);
    });

  for (const [key, value] of Object.entries(replyObj)) {
    const cId = value.forComment;
    const reps = comments[cId].replies || {};
    reps[key] = value;
    comments[cId].replies = reps;
  }

  getDocs(db.users)
    .then((res) => {
      res.forEach((doc) => {
        const id = doc.id;
        const object = doc.data();
        users[id] = object;
      });
      console.log("Successfully Loaded Users");
    })
    .catch((error) => {
      console.error("Error Loading Users: ", error);
    });

  return {
    props: { comments, users },
  };
}
