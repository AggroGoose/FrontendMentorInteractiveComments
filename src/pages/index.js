import { doc, getDocs, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { userActions } from "../app/store/user-slice";
import { commentActions } from "../app/store/comment-slice";
import { replyActions } from "../app/store/reply-slice";
import { subreplyActions } from "../app/store/subreply-slice";
import Head from "next/head";

import Footer from "../components/UI/Footer";
import ResponseItem from "../components/Comments/ResponseItem";
import db from "../app/firebase";
import HeaderNav from "../components/UI/HeaderNav";
import NewResponse from "../components/Comments/NewResponse";
import DeleteModal from "../components/UI/DeleteModal";

export default function Home(props) {
  const [userList, setUserList] = useState({});
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const commentList = useSelector((state) => state.comment.list);
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.ui.modalIsVisible);

  useEffect(() => {
    dispatch(commentActions.setComments(props.comments));
    dispatch(replyActions.setReplies(props.replies));
    dispatch(subreplyActions.setSubReplies(props.subreplies));
    setUserList(props.users);
  }, []);

  useEffect(() => {
    const newUser = {};
    if (!user) {
      dispatch(userActions.userLogout());
      return;
    }
    const id = user.uid;
    if (Object.entries(userList).length !== 0) {
      if (!userList[id]) {
        newUser[id] = {
          display: user.displayName,
          picture: user.photoURL,
          commentReacts: {},
          replyReacts: {},
          subreplyReacts: {},
        };
        setDoc(doc(db.users, id), newUser[id]).then(
          setUserList(Object.assign(userList, newUser))
        );
      }
      dispatch(userActions.userLogin({ userID: id, ...userList[id] }));
    }
  }, [user]);

  return (
    <>
      <Head>
        <Head>
          <title>Interactive Comments</title>
        </Head>
      </Head>
      <HeaderNav />
      <main className={showModal ? "modal__body" : ""}>
        {showModal && <DeleteModal />}

        {commentList ? (
          commentList.map((value, index) => (
            <div key={value.id}>
              <ResponseItem
                index={index}
                users={userList}
                id={value.id}
                format="comment"
              />
            </div>
          ))
        ) : (
          <p>No Comments Available!</p>
        )}
        <NewResponse format="comment" type="new" />
      </main>

      {!showModal && <Footer />}
    </>
  );
}

export async function getServerSideProps() {
  const comments = [];
  const replies = [];
  const subreplies = [];
  const users = {};

  try {
    const res = await getDocs(db.comments);
    res.forEach((doc) => {
      const object = { id: doc.id, ...doc.data() };
      object.createdAt = object.createdAt.toMillis();
      comments.push(object);
    });
    console.log("Successfully Loaded Comments");
  } catch (error) {
    console.error("Error Loading Comments: ", error);
  }

  try {
    const res = await getDocs(db.replies);
    res.forEach((doc) => {
      const object = { id: doc.id, ...doc.data() };
      object.createdAt = object.createdAt.toMillis();
      replies.push(object);
    });
    console.log("Successfully Loaded Replies");
  } catch (error) {
    console.error("Error Loading Replies: ", error);
  }

  try {
    const res = await getDocs(db.subreplies);
    res.forEach((doc) => {
      const object = { id: doc.id, ...doc.data() };
      object.createdAt = object.createdAt.toMillis();
      subreplies.push(object);
    });
    console.log("Successfully Loaded Subreplies");
  } catch (error) {
    console.error("Error Loading Subreplies: ", error);
  }

  try {
    const res = await getDocs(db.users);
    res.forEach((doc) => {
      const id = doc.id;
      const object = doc.data();
      users[id] = object;

      !users[id].commentReacts ? (users[id].commentReacts = {}) : "";
      !users[id].commentReacts ? (users[id].replyReacts = {}) : "";
      !users[id].commentReacts ? (users[id].subreplyReacts = {}) : "";
    });
    console.log("Successfully Loaded Users");
  } catch (error) {
    console.error("Error Loading Users: ", error);
  }

  return {
    props: { comments, replies, subreplies, users },
  };
}
