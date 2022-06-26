import { useSelector, useDispatch } from "react-redux";
import { commentActions } from "../../app/store/comment-slice";
import { replyActions } from "../../app/store/reply-slice";
import { subreplyActions } from "../../app/store/subreply-slice";
import db from "../../app/firebase";
import { addDoc, Timestamp } from "firebase/firestore";

export default function NewResponse({ format, commentID, replyID, type }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  async function responseHandler(e) {
    e.preventDefault();
    const timeStamp = Timestamp.now();
    const newComment = {
      user: user.userID,
      createdAt: timeStamp,
      content: e.target.responseField.value,
      votes: 0,
    };

    try {
      const res = await addDoc(db.comments, newComment);
      newComment.id = res.id;
      newComment.createdAt = newComment.createdAt.toMillis();
      dispatch(commentActions.addItem(newComment));
    } catch (error) {
      console.error(`There was an error adding this comment`, error);
      return;
    }

    e.target.responseField.value = "";
  }

  return (
    <div className={`card newresponse size-${format}`}>
      <img src={user.picture} className="newresponse__image" />
      <form className="newresponse__form" onSubmit={responseHandler}>
        <textarea
          rows="5"
          className="newresponse__form--field"
          name="responseField"
        />
        <SubmitButton type={type} />
      </form>
    </div>
  );
}

function SubmitButton({ type }) {
  if (type == "new")
    return (
      <button className="newresponse__form--submit btn btn--submit">
        SEND
      </button>
    );

  return (
    <button className="newresponse__form--submit btn btn--submit">REPLY</button>
  );
}
