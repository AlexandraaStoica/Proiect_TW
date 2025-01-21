import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const createTask = createAsyncThunk(
    "tasks/create",
    async ({token, ...taskData}) => {
        const response = await axios.post(
            "http://localhost:3000/api/tasks",
            {
                title: taskData.title,
                description: taskData.description,
                assigneeId: taskData.assigneeId ? Number(taskData.assigneeId) : null
            },
            {
                headers: {Authorization: `Bearer ${token}`},
            }
        );
        return response.data;
    }
);

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (token) => {
        const response = await axios.get("http://localhost:3000/api/tasks", {
            headers: {Authorization: `Bearer ${token}`},
        });
        return response.data;
    }
);

export const updateTaskStatus = createAsyncThunk(
    "tasks/updateStatus",
    async ({token, taskId, status}) => {
        const response = await axios.patch(
            `http://localhost:3000/api/tasks/${taskId}/status`, 
            {status}, 
            {
                headers: {Authorization: `Bearer ${token}`},
            }
        );
        return response.data;
    }
);

export const assignTask = createAsyncThunk(
    "tasks/assign",
    async ({token, taskId, assigneeId}) => {
        const response = await axios.patch(
            `http://localhost:3000/api/tasks/${taskId}/assign`,
            {assigneeId: Number(assigneeId)},
            {
                headers: {Authorization: `Bearer ${token}`},
            }
        );
        return response.data;
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        list: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Create task
            .addCase(createTask.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list.unshift(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Update task status
            .addCase(updateTaskStatus.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = state.list.map(task =>
                    task.id === action.payload.id ? action.payload : task
                );
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Assign task
            .addCase(assignTask.pending, (state) => {
                state.status = "loading";
            })
            .addCase(assignTask.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = state.list.map(task =>
                    task.id === action.payload.id ? action.payload : task
                );
            })
            .addCase(assignTask.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default taskSlice.reducer;