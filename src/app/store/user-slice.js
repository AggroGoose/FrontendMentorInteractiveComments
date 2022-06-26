import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  user: {
    displayName: null,
    userID: null,
    commentReacts: {},
    replyReacts: {},
    subreplyReacts: {},
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin(state, action) {
      state.loggedIn = true;
      state.user = {
        display: action.payload.display,
        userID: action.payload.userID,
        picture: action.payload.picture,
        commentReacts: action.payload.commentReacts,
        replyReacts: action.payload.replyReacts,
        subreplyReacts: action.payload.subreplyReacts,
      };
    },
    userLogout(state) {
      state.loggedIn = false;
      state.user = initialState.user;
    },
    userReact(state, action) {
      state.user[action.payload.react][action.payload.id] =
        action.payload.status;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
