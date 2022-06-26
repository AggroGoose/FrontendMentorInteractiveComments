import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  react: "commentReact",
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComments(state, action) {
      state.list = action.payload || [];
      state.list = state.list.sort(voteSort);
    },
    addItem(state, action) {
      state.list.push(action.payload);
      state.list = state.list.sort(voteSort);
    },
    editItem(state, action) {
      state.list[action.payload.index].content = action.payload.content;
    },
    removeItem(state, action) {
      state.list = state.list.filter((item) => item.id !== action.payload);
      state.list = state.list.sort(voteSort);
    },
    voteItem(state, action) {
      state.list[action.payload.index].votes = action.payload.votes;
    },
  },
});

export const commentActions = commentSlice.actions;
export default commentSlice.reducer;

function voteSort(a, b) {
  if (a.votes < b.votes) return 1;
  if (a.votes > b.votes) return -1;
  return 0;
}
