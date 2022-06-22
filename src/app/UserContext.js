import React, { useReducer } from "react";

const userInitial = {
  loggedIn: false,
  displayName: null,
  userID: null,
  commentReacts: {},
  replyReacts: {},
  subReplyReacts: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        loggedIn: true,
        display: action.user.display,
        userID: action.user.userID,
        picture: action.user.picture,
        commentReacts: action.user.commentReacts,
        replyReacts: action.user.replyReacts,
        subReplyReacts: action.user.subReplyReacts,
      };

    case "LOGOUT":
      return userInitial;

    case "COMMENT_REACT":
      const upCom = state;
      upCom.commentReacts[action.id] = action.react;
      return upCom;

    case "REPLY_REACT":
      const upRep = state;
      upRep.replyReacts[action.id] = action.react;
      return upRep;

    case "SUBREPLY_REACT":
      const upSub = state;
      upSub.subreplyReacts[action.id] = action.react;
      return upSub;

    default:
      return state;
  }
}

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export function useUser() {
  return React.useContext(UserContext);
}
export function useUpdateUser() {
  return React.useContext(UserUpdateContext);
}

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(reducer, userInitial);
  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={dispatch}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
