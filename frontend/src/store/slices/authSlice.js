import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  const response = await axios.post(
    "http://localhost:3000/api/users/login",
    credentials
  );
  localStorage.setItem("token", response.data.token);
  return response.data;
});

export const fetchUser = createAsyncThunk("auth/fetchUser", async (token) => {
  const response = await axios.get("http://localhost:3000/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    role: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.role = action.payload.user.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
