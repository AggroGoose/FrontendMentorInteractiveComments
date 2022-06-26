import { createSlice } from "@reduxjs/toolkit";

const initialState = { modalIsVisible: false };

const uiSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggle(state) {
      state.modalIsVisible = !state.modalIsVisible;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
