import { useCommentList } from "../../app/CommentContext";
import CommentVote from "./CommentVote";
import CommentMain from "./CommentMain";

export default function CommentItem({ id, users }) {
  const comments = useCommentList();
  const comment = comments[id];
  const commenter = users[comment.user];

  return (
    <div className="comment">
      <div className="card comment__container">
        <CommentVote comment={comment} id={id} />
        <CommentMain commenter={commenter} id={id} />
      </div>
    </div>
  );
}
