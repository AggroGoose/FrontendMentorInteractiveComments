import { useEffect, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import db from "../../app/firebase";

export default function CommentVote({ comment, userLiked, id }) {
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [downvotes, setDownvotes] = useState(comment.downvotes);
  const [voteTotal, setVoteTotal] = useState(upvotes - downvotes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    setVoteTotal(upvotes - downvotes);
  }, [upvotes, downvotes]);

  useEffect(() => {
    if (userLiked == "liked") {
      setLiked(true);
    }
    if (userLiked == "disliked") {
      setDisliked(true);
    }
  }, []);

  const upvoteHandler = () => {
    if (liked) return;
    if (disliked) setDownvotes(downvotes - 1);

    setLiked(true);
    setDisliked(false);
    setUpvotes(upvotes + 1);
    updateDoc(doc(db.users, id), {});
  };

  const downvoteHandler = () => {
    if (disliked) return;
    if (liked) setUpvotes(upvotes - 1);
    setDisliked(true);
    setLiked(false);
    setDownvotes(downvotes + 1);
  };

  return (
    <div className={liked}>
      <div
        className={`comment__vote--plus ${liked && "comment_vote--active"}`}
        onClick={upvoteHandler}
      >
        <Image src="/icons/icon-plus.svg" height={16} width={16} />
      </div>
      <p className={disliked}>{voteTotal}</p>
      <div
        className={`comment__vote--minus ${disliked && "comment_vote--active"}`}
        onClick={downvoteHandler}
      >
        <Image src="/icons/icon-minus.svg" height={4} width={16} />
      </div>
    </div>
  );
}
