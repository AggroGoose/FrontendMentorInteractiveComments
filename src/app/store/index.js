import { configureStore } from "@reduxjs/toolkit";

import uiSlice from "./ui-slice";
import commentSlice from "./comment-slice";
import replySlice from "./reply-slice";
import subreplySlice from "./subreply-slice";
import userSlice from "./user-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice,
    comment: commentSlice,
    reply: replySlice,
    subreply: subreplySlice,
    user: userSlice,
  },
});

export default store;
