import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../app/store/ui-slice";
import deleteItems from "../../app/deleteScript";
import db from "../../app/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { commentActions } from "../../app/store/comment-slice";
import { replyActions } from "../../app/store/reply-slice";
import { subreplyActions } from "../../app/store/subreply-slice";

export default function DeleteModal() {
  const [type, setType] = useState("");
  const [id, setId] = useState("");
  const modalInfo = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const replies = useSelector((state) => state.reply.list);
  const subreplies = useSelector((state) => state.subreply.list);

  useEffect(() => {
    console.log(modalInfo);
    setType(modalInfo.deleteType);
    setId(modalInfo.deleteID);

    console.log("Type: ", type);
    console.log("ID: ", id);
  }, [modalInfo, id, type]);

  function closeModal() {
    dispatch(uiActions.reset());
  }

  async function handleDelete() {
    console.log(id, type);

    const deleteQueue = deleteItems(id, type, replies, subreplies);

    console.log(deleteQueue);

    try {
      const batch = writeBatch(db.db);

      deleteQueue.comments.forEach((comment) => {
        batch.delete(doc(db.comments, comment));
      });

      deleteQueue.replies.forEach((reply) => {
        batch.delete(doc(db.replies, reply));
      });

      deleteQueue.subreplies.forEach((subreply) => {
        batch.delete(doc(db.subreplies, subreply));
      });

      await batch.commit();
    } catch (error) {
      console.log("There was an error deleting items: ", error);
      return;
    }

    deleteQueue.comments.forEach((comment) => {
      dispatch(commentActions.removeItem(comment));
    });
    deleteQueue.replies.forEach((reply) => {
      dispatch(replyActions.removeItem(reply));
    });
    deleteQueue.subreplies.forEach((subreply) => {
      dispatch(subreplyActions.removeItem(subreply));
    });

    dispatch(uiActions.reset());
  }

  return (
    <>
      <div className="modal card size-modal">
        <div className="modal__header">
          <h2>Delete {type === "comment" ? "Comment" : "Reply"}</h2>
        </div>
        <div className="modal__content">
          <p>
            Are you sure you want to delete this{" "}
            {type === "comment" ? "comment" : "reply"}? This will remove this{" "}
            {type === "comment" ? "comment" : "reply"} and can&apos;t be undone.
          </p>
        </div>
        <div className="modal__buttons">
          <button
            className="newresponse__form--submit btn btn--cancel"
            onClick={closeModal}
          >
            NO, CANCEL
          </button>
          <button
            className="newresponse__form--submit btn btn--delete"
            onClick={handleDelete}
          >
            YES, DELETE
          </button>
        </div>
      </div>
      <div className="modal__background" onClick={closeModal} />
    </>
  );
}
