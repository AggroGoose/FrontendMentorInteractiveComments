import Head from "next/head";
import Footer from "../components/UI/Footer";
import db from "../app/firebase";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home(props) {
  const [commentList, setCommentList] = useState({});

  useEffect(() => {
    setCommentList(props.comments);
  }, []);

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

      <main>
        <h1>Organizing Comments</h1>

        {Object.entries(commentList).map(([key, value]) => (
          <div key={key}>
            <h2>This is a Comment from {value.user}.</h2>
            {Object.entries(value.replies).map(([key, value]) => (
              <div key={key}>
                <h4>This is a Reply from {value.user}.</h4>
                {Object.entries(value.subreplies).map(([key, value]) => (
                  <div key={key}>
                    <h6>This is a Subreply from {value.user}.</h6>
                  </div>
                ))}
              </div>
            ))}
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

  return {
    props: { comments },
  };
}
