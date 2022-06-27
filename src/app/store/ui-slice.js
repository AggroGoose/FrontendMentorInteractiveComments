import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalIsVisible: false,
  deleteType: null,
  deleteID: null,
};

const uiSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggle(state) {
      state.modalIsVisible = !state.modalIsVisible;
    },
    queue(state, action) {
      state.deleteType = action.payload.type;
      state.deleteID = action.payload.id;
      state.modalIsVisible = true;
    },
    reset(state) {
      state.deleteType = null;
      state.deleteID = null;
      state.modalIsVisible = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
