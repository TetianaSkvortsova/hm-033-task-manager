import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {updateProjectAsync} from "./projects.js";

const initialState = {
    data: [], // Список всіх завантажених тасок
    currentTask: null, // Таска для редагування або детального перегляду
    loading: false, // Індикатор завантаження
    error: null, // Помилка
};

// const BASE_URL = 'https://hm-033-task-manager.onrender.com';
const BASE_URL = 'http://localhost:3000';
const TASKS_URL = `${BASE_URL}/tasks`;

export const getTasksAsync = createAsyncThunk('tasks/getList', async (projectId = '') => {
    try {
        // ВАЖЛИВО: Ваш бекенд очікує '/tasks/:projectId' або '/tasks'
        // Але якщо projectId не передається, ви отримаєте '/tasks/'. Краще використовувати параметри запиту.
        // Оновлено URL, щоб відповідати логіці фільтрації:
        const fullUrl = projectId ? `${TASKS_URL}/${projectId}` : TASKS_URL;
        const result = await axios.get(fullUrl);
        return result.data;
    } catch (error) {
        // В ідеалі: обробка помилок та повернення відхиленого промісу
        throw error;
    }
});

export const deleteTaskAsync = createAsyncThunk('tasks/delete', async (taskId) => {
    const fullUrl = `${TASKS_URL}/${taskId}`;
    // Відправляємо DELETE-запит
    const result = await axios.delete(fullUrl);
    // Бекенд повинен повернути оновлений список тасок, або хоча б ID видаленої таски
    return result.data; // Припускаємо, що повертається оновлений список
});

export const getTaskByIdAsync = createAsyncThunk('tasks/edit', async (taskId) => {
    try {
        const fullUrl = `${TASKS_URL}/${taskId}`;
        // Відправляємо GET-запит
        const result = await axios.get(fullUrl);
        // Припускаємо, що бекенд повертає об'єкт { task: { ... } }
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
                // Оновлюємо список тасок
                state.data = action.payload;
            })
            .addCase(getTasksAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
            // Припускаємо, що бекенд повертає оновлений список тасок у action.payload.tasks
            // Якщо бекенд повертає просто ID, логіка буде іншою
            // state.data = state.data.filter(t => t.id !== action.payload.deletedId);

            // Використовуємо дані, що повертає бекенд (якщо він повертає оновлений список)
            // Якщо бекенд повертає просто { message: '...' }, вам потрібно буде фільтрувати локально
            if (action.payload.tasks) {
                state.data = action.payload.tasks;
            }
        });

        builder.addCase(getTaskByIdAsync.fulfilled, (state, action) => {
            // Зберігаємо таску для редагування
            state.currentTask = action.payload;
        });

        builder.addCase(createTaskAsync.fulfilled, (state) => {
            // Зберігаємо таску для редагування
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