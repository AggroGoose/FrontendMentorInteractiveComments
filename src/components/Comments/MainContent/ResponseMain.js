import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ResponseTop from "./ResponseTop";
import ResponseContent from "./ResponseContent";

export default function ResponseMain({ users, index, format, togReply }) {
  const [editActive, setEditActive] = useState(false);
  const [item, setItem] = useState({});
  const [userPost, setUserPost] = useState(false);
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

  function togEdit() {
    setEditActive(!editActive);
  }

  return (
    <div className="response__maindiv">
      {Object.keys(item).length !== 0 && (
        <>
          <ResponseTop
            togEdit={togEdit}
            togReply={togReply}
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
  );
}
