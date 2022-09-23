import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  accessToken: null,
  user: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
