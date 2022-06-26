import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  react: "subreplyReact",
};

const subreplySlice = createSlice({
  name: "subreply",
  initialState,
  reducers: {
    setSubReplies(state, action) {
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

export const subreplyActions = subreplySlice.actions;
export default subreplySlice.reducer;

function dateSort(a, b) {
  if (a.createdAt < b.createdAt) return 1;
  if (a.createdAt > b.createdAt) return -1;
  return 0;
}
