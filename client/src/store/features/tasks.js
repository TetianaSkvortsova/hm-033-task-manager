import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    data: [],
    currentTask: null,
    loading: false,
};

// const BASE_URL = 'https://hm-033-task-manager.onrender.com';
const BASE_URL = import.meta.env.BASE_URL;
// const BASE_URL = 'http://localhost:3000';
const TASKS_URL = `api/tasks`;

export const getTasksAsync = createAsyncThunk('tasks/getList', async (projectId = '') => {
    try {
        const fullUrl = projectId ? `${TASKS_URL}/${projectId}` : TASKS_URL;
        const result = await axios.get(fullUrl);
        return result.data;
    } catch (error) {
        throw error;
    }
});

export const deleteTaskAsync = createAsyncThunk('tasks/delete', async (taskId) => {
    const fullUrl = `${TASKS_URL}/${taskId}`;
    const result = await axios.delete(fullUrl);
    return result.data;
});

export const getTaskByIdAsync = createAsyncThunk('tasks/edit', async (taskId) => {
    try {
        const fullUrl = `${TASKS_URL}/${taskId}`;
        const result = await axios.get(fullUrl);
        return result.data.task;
    } catch (error) {
        throw error;
    }
});

export const createTaskAsync = createAsyncThunk('tasks/save', async task => {
    const result = await axios.post(TASKS_URL, task);
    return result.data;
});

export const updateTaskAsync = createAsyncThunk('tasks/saveEdit', async (task) => {
    const fullUrl = `${TASKS_URL}/${task.id}`;
    const result = await axios.put(fullUrl, task);
    return result.data.task;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getTasksAsync.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTasksAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getTasksAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
            if (action.payload.tasks) {
                state.data = action.payload.tasks;
            }
        });

        builder.addCase(getTaskByIdAsync.fulfilled, (state, action) => {
            state.currentTask = action.payload;
        });

        builder.addCase(createTaskAsync.fulfilled, (state) => {
            state.loaded = true;
        });

        builder.addCase(updateTaskAsync.fulfilled, (state, action) => {
            const updatedTask = action.payload;
            const index = state.data.findIndex(p => p.id === updatedTask.id);

            if (index !== -1) {
                state.data[index] = updatedTask;
            }

            state.currentTask = null;
            state.loaded = true;
        });
    }
})

export default tasksSlice.reducer