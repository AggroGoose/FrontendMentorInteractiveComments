import { useSelector, useDispatch } from "react-redux";
import { commentActions } from "../../app/store/comment-slice";
import { replyActions } from "../../app/store/reply-slice";
import { subreplyActions } from "../../app/store/subreply-slice";
import db from "../../app/firebase";
import { addDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function NewResponse({ format, id, type, togReply }) {
  const [disabled, setDisabled] = useState(true);
  const [formatRef, setformatRef] = useState({
    store: commentActions,
    document: db.comments,
    newComment: {
      votes: 0,
    },
  });
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setformatRef(formatter(format, type, db, id));
  }, [format, id, type, db]);

  useEffect(() => {
    if (user.userID) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user]);

  async function responseHandler(e) {
    e.preventDefault();

    const { store, document, newComment } = formatRef;

    const timeStamp = Timestamp.now();
    newComment.user = user.userID;
    newComment.createdAt = timeStamp;
    newComment.content = e.target.responseField.value;

    try {
      const res = await addDoc(document, newComment);
      newComment.id = res.id;
      newComment.createdAt = newComment.createdAt.toMillis();
      dispatch(store.addItem(newComment));
    } catch (error) {
      console.error(`There was an error adding this comment`, error);
      return;
    }

    if (togReply) togReply();

    setformatRef({
      store: commentActions,
      document: db.comments,
      newComment: {
        votes: 0,
      },
    });
    e.target.responseField.value = "";
  }

  return (
    <div className={`card newresponse size-${format}`}>
      {user?.picture && (
        <img src={user.picture} className="newresponse__image" />
      )}
      <form
        className="newresponse__form"
        onSubmit={responseHandler}
        disabled={disabled}
      >
        <div className="newresponse__form--content">
          {disabled && (
            <p>
              <i>Please sign in before posting.</i>
            </p>
          )}
          <textarea
            rows="5"
            className="newresponse__form--field"
            name="responseField"
            disabled={disabled}
          />
        </div>
        <SubmitButton type={type} disabled={disabled} />
      </form>
    </div>
  );
}

function SubmitButton({ type, disabled }) {
  if (type == "new")
    return (
      <button
        className="newresponse__form--submit btn btn--submit"
        disabled={disabled}
      >
        SEND
      </button>
    );

  return (
    <button
      className="newresponse__form--submit btn btn--submit"
      disabled={disabled}
    >
      REPLY
    </button>
  );
}

function formatter(format, type, db, id) {
  if (type === "new")
    return {
      store: commentActions,
      document: db.comments,
      newComment: {
        votes: 0,
      },
    };
  if (format === "comment")
    return {
      store: replyActions,
      document: db.replies,
      newComment: {
        votes: 0,
        forComment: id,
      },
    };
  if (format === "reply")
    return {
      store: subreplyActions,
      document: db.subreplies,
      newComment: {
        votes: 0,
        forReply: id,
      },
    };
  if (format === "subreply")
    return {
      store: subreplyActions,
      document: db.subreplies,
      newComment: {
        votes: 0,
        forReply: id,
      },
    };
}
