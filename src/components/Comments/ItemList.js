import { useSelector } from "react-redux";
import ResponseItem from "./ResponseItem";

export default function ItemList({ format, id, users }) {
  const replyList = useSelector((state) => state.reply.list);
  const subreplyList = useSelector((state) => state.subreply.list);

  const filterReplies = replyList.filter((item) => item.forComment === id);
  const filterSubReplies = subreplyList.filter((item) => item.forReply === id);

  if (format == "comment" && filterReplies.length === 0) return;
  if (format == "reply" && filterSubReplies.length === 0) return;

  return (
    <div className={`listitem size-${format}`}>
      <div className="listitem__spacer1"> </div>
      <div className="listitem__spacer2"> </div>
      <div className="listitem__content">
        {format === "comment" &&
          replyList.map((value, index) => {
            if (value.forComment === id)
              return (
                <div key={value.id}>
                  <ResponseItem
                    index={index}
                    users={users}
                    format="reply"
                    id={value.id}
                  />
                </div>
              );
          })}
        {format === "reply" &&
          subreplyList.map((value, index) => {
            if (value.forReply === id)
              return (
                <div key={value.id}>
                  <ResponseItem
                    index={index}
                    users={users}
                    format="subreply"
                    id={value.id}
                  />
                </div>
              );
          })}
      </div>
    </div>
  );
}
