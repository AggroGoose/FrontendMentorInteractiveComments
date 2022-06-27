import { useState } from "react";
import ResponseMain from "./MainContent/ResponseMain";
import VoteModule from "./VoteModule";
import ItemList from "./ItemList";
import NewResponse from "./NewResponse";

export default function ResponseItem({ index, users, format, id }) {
  const [replyActive, setReplyActive] = useState(false);

  const togReply = () => {
    setReplyActive(!replyActive);
  };

  return (
    <div className="response">
      <div className={`card response__container size-${format}`}>
        <VoteModule format={format} index={index} />
        <ResponseMain
          users={users}
          index={index}
          format={format}
          togReply={togReply}
        />
      </div>
      {replyActive && (
        <NewResponse id={id} format={format} togReply={togReply} type="reply" />
      )}
      {format === "comment" && (
        <ItemList format="comment" id={id} users={users} />
      )}
      {format === "reply" && <ItemList format="reply" id={id} users={users} />}
    </div>
  );
}
