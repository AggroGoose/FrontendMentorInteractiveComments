import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  react: "replyReact",
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setReplies(state, action) {
      state.list = action.payload || [];
      state.list = state.list.sort(dateSort);
    },
    addItem(state, action) {
      state.list.push(action.payload);
      state.list = state.list.sort(dateSort);
    },
    editItem(state, action) {
      state.list[action.payload.index].content = action.payload.content;
    },
    removeItem(state, action) {
      state.list = state.list.filter((item) => item.id !== action.payload);
      state.list = state.list.sort(dateSort);
    },
    voteItem(state, action) {
      state.list[action.payload.index].votes = action.payload.votes;
    },
  },
});

export const replyActions = replySlice.actions;
export default replySlice.reducer;

function dateSort(a, b) {
  if (a.createdAt > b.createdAt) return 1;
  if (a.createdAt < b.createdAt) return -1;
  return 0;
}
