import { useEffect, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { IconPlus, IconMinus } from "../UI/Icons";
import { useUser, useUpdateUser } from "../../app/UserContext";
import { useUpdateComments } from "../../app/CommentContext";
import db from "../../app/firebase";

export default function CommentVote({ comment, id }) {
  const [votes, setVotes] = useState(comment.votes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const user = useUser();
  const updateUser = useUpdateUser();
  const updateComments = useUpdateComments();

  useEffect(() => {
    if (id in user.commentReacts) {
      if (user.commentReacts[id] == "like") {
        setLiked(true);
        setDisliked(false);
      } else if (user.commentReacts[id] == "dislike") {
        setDisliked(true);
        setLiked(false);
      }
    }
  }, [user]);

  const upvoteHandler = async () => {
    if (liked) return;
    if (!user.loggedIn) return;
    updateUser({ type: "COMMENT_REACT", id, react: "like" });

    try {
      await updateDoc(doc(db.users, user.userID), {
        commentReacts: user.commentReacts,
      });
    } catch (error) {
      console.error("Error submitting vote: ", error);
      return;
    }

    if (disliked) setVotes(votes + 1);
    setVotes(votes + 1);
    setLiked(true);
    setDisliked(false);
  };

  const downvoteHandler = async () => {
    if (disliked) return;
    if (!user.loggedIn) return;
    updateUser({ type: "COMMENT_REACT", id, react: "dislike" });

    try {
      await updateDoc(doc(db.users, user.userID), {
        commentReacts: user.commentReacts,
      });
    } catch (error) {
      console.error("Error submitting vote: ", error);
      return;
    }

    if (liked) setVotes(votes - 1);
    setVotes(votes - 1);
    setLiked(false);
    setDisliked(true);
  };

  return (
    <div className="comment__vote">
      <IconPlus
        className={`comment__vote--plus ${liked ? "vote--active" : ""}`}
        onClick={upvoteHandler}
      />
      <p className="comment__vote--total">{votes}</p>
      <IconMinus
        className={`comment__vote--minus ${disliked ? "vote--active" : ""}`}
        onClick={downvoteHandler}
      />
    </div>
  );
}
