import React, { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.comments;

    case "ADD_COMMENT":
      const addCom = state;
      addCom[action.id] = action.comment;
      return addCom;

    case "ADD_REPLY":
      const addRep = state;
      const addReps = addRep[action.commentId].replies || {};
      addReps[action.replyId] = action.reply;
      addRep[action.commentId].replies = addReps;
      return addRep;

    case "ADD_SUBREPLY":
      const addSub = state;
      const addSubs =
        addSub[action.commentId].replies[action.replyId].subreplies || {};
      addSubs[action.subreplyId] = action.subreply;
      addSub[action.commentId].replies[action.replyId].subreplies = addSubs;
      return addSub;

    case "DELETE_COMMENT":
      const delCom = state;
      const id = action.id;
      delete delCom[id];
      return delCom;

    case "DELETE_REPLY":
      const delRep = state;
      delete delRep[action.commentId].replies[action.replyId];
      return delRep;

    case "DELETE_SUBREPLY":
      const delSub = state;
      delete delSub[action.commentId].replies[action.replyId].subreplies[
        action.subreplyId
      ];
      return delSub;

    case "EDIT_COMMENT":
      const edCom = state;
      edCom[action.id].content = action.content;
      return edCom;

    case "EDIT_REPLY":
      const edRep = state;
      edRep[action.commentId].replies[action.replyId].content = action.content;
      return edRep;

    case "EDIT_SUBREPLY":
      const edSub = state;
      edSub[action.commentId].replies[action.replyId].subreplies[
        action.subreplyId
      ].content = action.content;
      return edSub;

    case "REACT_COMMENT":
      const reCom = state;
      reCom[action.id].votes = action.votes;
      return reCom;

    case "REACT_REPLY":
      const reRep = state;
      reRep[action.commentId].replies[action.replyId].votes = action.votes;
      return reRep;

    case "REACT_SUBREPLY":
      const reSub = state;
      reSub[action.commentId].replies[action.replyId].subreplies[
        action.subreplyId
      ].votes = action.votes;
      return reSub;

    default:
      return state;
  }
}

const CommentContext = React.createContext();
const CommentUpdateContext = React.createContext();

export function useCommentList() {
  return React.useContext(CommentContext);
}

export function useUpdateComments() {
  return React.useContext(CommentUpdateContext);
}

export function CommentProvider({ children }) {
  const [comments, dispatch] = useReducer(reducer, {});
  return (
    <CommentContext.Provider value={comments}>
      <CommentUpdateContext.Provider value={dispatch}>
        {children}
      </CommentUpdateContext.Provider>
    </CommentContext.Provider>
  );
}
