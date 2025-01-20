import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return userId;
  }
);

export const createUser = createAsyncThunk("users/create", async (userData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:3000/api/users",
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
});

export const fetchUsers = createAsyncThunk("users/fetch", async (token) => {
  const response = await axios.get("http://localhost:3000/api/users/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Existing cases
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload.user);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add delete cases
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;