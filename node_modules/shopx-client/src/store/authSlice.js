import { createSlice } from "@reduxjs/toolkit";

const storedAuth = JSON.parse(localStorage.getItem("shopx_auth") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth?.user || null,
    token: storedAuth?.token || null,
    isAuthenticated: Boolean(storedAuth?.token)
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("shopx_auth", JSON.stringify({ user: state.user, token: state.token }));
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("shopx_auth", JSON.stringify({ user: state.user, token: state.token }));
    },
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("shopx_auth");
    }
  }
});

export const { logoutLocal, setCredentials, updateUser } = authSlice.actions;
export default authSlice.reducer;
