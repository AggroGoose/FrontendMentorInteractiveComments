import { updateDoc, doc } from "firebase/firestore";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commentActions } from "../../../app/store/comment-slice";
import { replyActions } from "../../../app/store/reply-slice";
import { subreplyActions } from "../../../app/store/subreply-slice";
import db from "../../../app/firebase";

export default function ResponseContent({
  togEdit,
  editActive,
  item,
  userPost,
  format,
  index,
}) {
  const id = item.id;
  return (
    <>
      {/* Reflexive Component Functions are Below */}
      {userPost ? (
        <UserResponseContent
          content={item.content}
          editActive={editActive}
          togEdit={togEdit}
          format={format}
          id={id}
          index={index}
        />
      ) : (
        <PostContent content={item.content} />
      )}
    </>
  );
}

// ###############################################################
// ################# Reflexive Content Functions #################
// ###############################################################

function PostContent({ content }) {
  return <p className="response__content">{content}</p>;
}

function UserResponseContent({
  editActive,
  content,
  id,
  togEdit,
  index,
  format,
}) {
  if (!editActive) return <p className="response__content">{content}</p>;
  //   formatIdentifier function is below.
  const field = useRef(content);
  const dispatch = useDispatch();

  async function editHandler(e) {
    e.preventDefault();
    const { store, collection } = formatIdentifier(format, db);
    try {
      await updateDoc(doc(collection, id), {
        content: e.target.editField.value,
      });
    } catch (error) {
      console.error(`There was an error updating this comment`, error);
      return;
    }

    dispatch(store.editItem({ index, content: e.target.editField.value }));
    togEdit();
  }

  return (
    <form className="response__editor" onSubmit={editHandler}>
      <textarea
        rows="5"
        defaultValue={content}
        name="editField"
        className="response__editor--field"
      />
      <button className="response__editor--submit btn btn--submit">
        UPDATE
      </button>
    </form>
  );
}

// ###############################################################
// ################## formatIdentifier Function ##################
// ###############################################################

function formatIdentifier(format, db) {
  const updater = {};
  switch (format) {
    case "comment":
      updater.store = commentActions;
      updater.collection = db.comments;
      return updater;
    case "reply":
      updater.store = replyActions;
      updater.collection = db.replies;
      return updater;
    case "subreply":
      updater.store = subreplyActions;
      updater.collection = db.subreplies;
      return updater;
  }
}
