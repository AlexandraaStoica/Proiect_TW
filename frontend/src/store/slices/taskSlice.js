import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const createTask = createAsyncThunk(
    "tasks/create",
    async ({token, ...taskData}) => {

        console.log("TOKEN", token);
        console.log("TASK DATA", taskData);
        const response = await axios.post(
            "http://localhost:3000/api/tasks",
            {
                title: taskData.title,
                description: taskData.description,
                assigneeId: Number(taskData.assigneeId)
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
        const response = await axios.patch(`http://localhost:3000/api/tasks/${taskId}`, {status}, {
            headers: {Authorization: `Bearer ${token}`},
        });
        console.log(response.data);
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
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update task status cases
            .addCase(updateTaskStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;
                state.list = state.list.map(task =>
                    task.id === updatedTask.id ? {...task, ...updatedTask} : task
                );
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default taskSlice.reducer;
