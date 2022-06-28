import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import VoteModule from "./VoteModule";
import ItemList from "./ItemList";
import ResponseTop from "./MainContent/ResponseTop";
import NewResponse from "./NewResponse";
import ResponseContent from "./MainContent/ResponseContent";

export default function ResponseItem({ index, users, format, id }) {
  const [item, setItem] = useState({});
  const [userPost, setUserPost] = useState(false);
  const [replyActive, setReplyActive] = useState(false);
  const [editActive, setEditActive] = useState(false);

  const comments = useSelector((state) => state.comment.list);
  const replies = useSelector((state) => state.reply.list);
  const subreplies = useSelector((state) => state.subreply.list);
  const userActive = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    switch (format) {
      case "comment":
        setItem(comments[index]);
        return;
      case "reply":
        setItem(replies[index]);
        return;
      case "subreply":
        setItem(subreplies[index]);
        return;
    }
  }, [comments, replies, subreplies]);

  useEffect(() => {
    if (userActive) {
      const postCompare = item.user == user.userID;
      setUserPost(postCompare);
    } else setUserPost(false);
  }, [user, item]);

  const togReply = () => {
    setReplyActive(!replyActive);
  };

  function togEdit() {
    setEditActive(!editActive);
  }

  return (
    <div className="response">
      <div className={`card response__container size-${format}`}>
        <VoteModule format={format} index={index} />
        {Object.keys(item).length !== 0 && (
          <>
            <ResponseTop
              togEdit={togEdit}
              togReply={togReply}
              format={format}
              users={users}
              item={item}
              userPost={userPost}
            />
            <ResponseContent
              togEdit={togEdit}
              editActive={editActive}
              item={item}
              index={index}
              format={format}
              userPost={userPost}
            />
          </>
        )}
      </div>
      {replyActive && format !== "subreply" && (
        <NewResponse id={id} format={format} togReply={togReply} type="reply" />
      )}
      {replyActive && format === "subreply" && (
        <NewResponse
          id={item.forReply}
          format="subreply"
          togReply={togReply}
          type="reply"
        />
      )}
      {format === "comment" && (
        <ItemList format="comment" id={id} users={users} />
      )}
      {format === "reply" && <ItemList format="reply" id={id} users={users} />}
    </div>
  );
}
