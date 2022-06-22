import Image from "next/image";
import { useEffect, useState } from "react";
import timeCalculator from "../../app/timeCalculator";
import { useUser } from "../../app/UserContext";
import { useCommentList } from "../../app/CommentContext";
import { IconDelete, IconEdit, IconReply } from "../UI/Icons";

export default function CommentMain({ commenter, id }) {
  const [dateOutput, setDateOutput] = useState("");
  const [userPost, setUserPost] = useState(false);
  const user = useUser();
  const comments = useCommentList();
  const comment = comments[id];

  useEffect(() => {
    const dateTime = timeCalculator(comment.createdAt);
    dateTime ? setDateOutput(dateTime) : setDateOutput("Unknown Date");

    if (user.loggedIn) {
      const postCompare = comment.user == user.userID;
      setUserPost(postCompare);
    }
  }, []);

  return (
    <div className="comment__maindiv">
      <div className="comment__topdiv">
        <div className="comment__topleft">
          <div className="comment__image">
            <Image
              src={commenter.picture}
              width={30}
              height={30}
              style={{ borderRadius: "100%" }}
              alt={`A picture of author ${commenter.display}`}
            />
          </div>
          <p className="comment__user">{commenter.display}</p>
          <p className="comment__date">{dateOutput}</p>
        </div>
        <div className="comment__topright">
          {userPost ? <CommentEdit /> : <CommentReply />}
        </div>
      </div>

      <p className="comment__content">{comment.content}</p>
    </div>
  );
}

function CommentReply() {
  return (
    <div className="comment__topreply">
      <IconReply className="comment__topreply--icon" />
      <p className="comment__topreply--text">Reply</p>
    </div>
  );
}

function CommentEdit() {
  return (
    <div className="comment__topedit">
      <div className="comment__topedit--delete">
        <IconDelete className="comment__topedit--deleteicon" />
        <p className="comment__topedit--deletetext">Delete</p>
      </div>
      <div className="comment__topedit--edit">
        <IconEdit className="comment__topedit--editicon" />
        <p className="comment__topedit--edittext">Edit</p>
      </div>
    </div>
  );
}
