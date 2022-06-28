import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateDoc, doc } from "firebase/firestore";

import { IconPlus, IconMinus } from "../UI/Icons";
import { userActions } from "../../app/store/user-slice";
import { commentActions } from "../../app/store/comment-slice";
import { replyActions } from "../../app/store/reply-slice";
import { subreplyActions } from "../../app/store/subreply-slice";
import db from "../../app/firebase";

export default function ResponseVote({ format, index }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [itemData, setItemData] = useState({ items: [], item: {}, react: "" });
  const [votes, setVotes] = useState("?");

  const comments = useSelector((state) => state.comment);
  const replies = useSelector((state) => state.reply);
  const subreplies = useSelector((state) => state.subreply);
  const userActive = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    switch (format) {
      case "comment":
        setItemData({
          docRef: doc(db.comments, comments.list[index].id),
          item: comments.list[index],
          react: "commentReacts",
          action: commentActions,
        });
        setVotes(comments.list[index].votes);
        return;
      case "reply":
        setItemData({
          docRef: doc(db.replies, replies.list[index].id),
          item: replies.list[index],
          react: "replyReacts",
          action: replyActions,
        });
        setVotes(replies.list[index].votes);
        return;
      case "subreply":
        setItemData({
          docRef: doc(db.subreplies, subreplies.list[index].id),
          item: subreplies.list[index],
          react: "subreplyReacts",
          action: subreplyActions,
        });
        setVotes(subreplies.list[index].votes);
        return;
    }
  }, [comments, replies, subreplies]);

  const { docRef, item, react, action } = itemData;

  useEffect(() => {
    if (!userActive) return;
    if (Object.entries(itemData.item) === 0) return;
    if (!item.id) return;
    if (item.id in user[react]) {
      if (user[react][item.id] == "like") {
        setLiked(true);
        setDisliked(false);
      } else if (user[react][item.id] == "dislike") {
        setDisliked(true);
        setLiked(false);
      }
    }
  }, [user, react]);

  // #####################################################
  // ################### Click Handlers ##################
  // #####################################################

  const upvoteHandler = async () => {
    if (liked) return;
    if (!userActive) return;
    const commentReacts = { ...user.commentReacts };
    const replyReacts = { ...user.replyReacts };
    const subreplyReacts = { ...user.subreplyReacts };
    const id = item.id;

    if (format === "comment") commentReacts[id] = "like";
    if (format === "reply") replyReacts[id] = "like";
    if (format === "subreply") subreplyReacts[id] = "like";

    try {
      await updateDoc(doc(db.users, user.userID), {
        commentReacts,
        replyReacts,
        subreplyReacts,
      });
    } catch (error) {
      console.error("Error submitting vote: ", error);
      return;
    }

    let voteUp = votes;

    try {
      disliked ? (voteUp += 2) : (voteUp += 1);
      await updateDoc(docRef, { votes: voteUp });
    } catch (error) {
      console.error("Error updating comment total: ", error);
      return;
    }

    setLiked(true);
    setDisliked(false);
    dispatch(userActions.userReact({ id: item.id, react, status: "like" }));
    dispatch(action.voteItem({ index, votes: voteUp }));
  };

  const downvoteHandler = async () => {
    if (disliked) return;
    if (!userActive) return;
    const commentReacts = { ...user.commentReacts };
    const replyReacts = { ...user.replyReacts };
    const subreplyReacts = { ...user.subreplyReacts };

    if (format === "comment") commentReacts[item.id] = "dislike";
    if (format === "reply") replyReacts[item.id] = "dislike";
    if (format === "subreply") subreplyReacts[item.id] = "dislike";

    try {
      await updateDoc(doc(db.users, user.userID), {
        commentReacts,
        replyReacts,
        subreplyReacts,
      });
    } catch (error) {
      console.error("Error submitting vote: ", error);
      return;
    }

    let voteUp = votes;

    try {
      liked ? (voteUp -= 2) : (voteUp -= 1);
      await updateDoc(docRef, { votes: voteUp });
    } catch (error) {
      console.error("Error updating comment total: ", error);
      return;
    }

    setLiked(false);
    setDisliked(true);
    dispatch(userActions.userReact({ id: item.id, react, status: "dislike" }));
    dispatch(action.voteItem({ index, votes: voteUp }));
  };

  // #####################################################
  // ################## Main Component ###################
  // #####################################################

  return (
    <div className="vote__container">
      <IconPlus
        className={`vote__plus ${liked ? "vote--active" : ""}`}
        onClick={upvoteHandler}
      />
      <p className="vote__total">{votes}</p>
      <IconMinus
        className={`vote__minus ${disliked ? "vote--active" : ""}`}
        onClick={downvoteHandler}
      />
    </div>
  );
}
