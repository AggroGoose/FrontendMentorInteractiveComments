import Image from "next/image";
import { useEffect, useState } from "react";

export default function CommentItem({ comment, users }) {
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [downvotes, setDownvotes] = useState(comment.downvotes);
  const [voteTotal, setVoteTotal] = useState(upvotes - downvotes);
  const [commentContent, setCommentContent] = useState(comment.content);

  useEffect(() => {
    setVoteTotal(upvotes - downvotes);
  }, [upvotes, downvotes]);

  const commenter = users[comment.user];
  return (
    <div>
      <div className="card">
        <div className="comment__topdiv">
          <Image
            src={commenter.picture}
            width={25}
            height={25}
            alt={`A picture of author ${commenter.display}`}
          />
          <p className="comment__user">{commenter.display}</p>
        </div>
        <div className="comment__maindiv">
          <p className="comment__content">{commentContent}</p>
        </div>
      </div>
    </div>
  );
}
