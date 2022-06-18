import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import timeCalculator from "../../app/timeCalculator";
import CommentVote from "./CommentVote";

export default function CommentItem({ id, comment, users }) {
  const [commentContent, setCommentContent] = useState(comment.content);
  const [dateOutput, setDateOutput] = useState("");
  const [userPost, setUserPost] = useState(false);
  const [user] = useAuthState(getAuth());
  let userLike;

  useEffect(() => {
    const dateTime = timeCalculator(comment.createdAt);
    dateTime ? setDateOutput(dateTime) : setDateOutput("Unknown Date");

    if (user) {
      const postCompare = comment.user == user.uid;
      setUserPost(postCompare);

      const userObject = users[user.uid];
      if (userObject.commentVotes[id]) {
        userLike = userObject.commentVotes[id];
      }
    }
  }, []);

  const commenter = users[comment.user];
  return (
    <div className="comment">
      <div className="card comment__container">
        <CommentVote comment={comment} userLike={userLike} id={id} />
        <div className="comment__maindiv">
          <div className="comment__topdiv">
            <div className="comment__topleft">
              <div className="comment__image">
                <Image
                  src={commenter.picture}
                  width={35}
                  height={35}
                  style={{ "border-radius": "100%" }}
                  alt={`A picture of author ${commenter.display}`}
                />
              </div>
              <p className="comment__user">{commenter.display}</p>
              <p className="comment__date">{dateOutput}</p>
            </div>
            <div className="comment__topreply">
              {userPost && <p>User Post - Delete and Edit</p>}
              {!userPost && <p>Not User Post - Reply</p>}
            </div>
          </div>

          <p className="comment__content">{commentContent}</p>
        </div>
      </div>
    </div>
  );
}
