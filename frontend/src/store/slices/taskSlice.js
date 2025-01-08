import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createTask = createAsyncThunk("tasks/create", async (taskData) => {
  const response = await axios.post("/api/tasks", taskData);
  return response.data;
});

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (token, idUser) => {
    if (idUser) {
    }

    const response = await axios.get("http://localhost:3000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);

    return response.data;
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, status }) => {
    const response = await axios.patch(`/api/tasks/${taskId}`, { status });
    return response.data;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
