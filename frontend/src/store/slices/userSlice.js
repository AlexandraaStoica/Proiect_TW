import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const createUser = createAsyncThunk("users/create", async (userData) => {
    const response = await axios.post("http://localhost:3000/api/users", userData);
    if (userData.role === "USER" && userData.managerId) {
        await axios.post("/api/user-managers", {
            userId: response.data.id,
            managerId: userData.managerId,
        });
    }
    return response.data;
});

export const fetchUsers = createAsyncThunk(
    "users/fetch",
    async (token) => {
        const response = await axios.get("http://localhost:3000/api/users/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
);

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
            // Create user cases
            .addCase(createUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Fetch users cases
            .addCase(fetchUsers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default userSlice.reducer;