import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false, // Boolean to track admin status
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

export const { setAdmin } = adminSlice.actions;
export default adminSlice.reducer;
