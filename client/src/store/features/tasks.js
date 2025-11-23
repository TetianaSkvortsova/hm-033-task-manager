import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
};

/*
{
  id: string,
  title: string,
  description: string,
  priority: string,
  status: string,
  assignee: string,
  projectId: string,
}
*/
const BASE_URL = 'https://hm-033-task-manager.onrender.com';
const TASKS_URL = `${BASE_URL}/tasks/`;

export const getTasksAsync = createAsyncThunk('tasks/getList', async (projectId = '') => {
  const result = await axios.get(`${TASKS_URL}${projectId}`);
  return result.data;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(getTasksAsync.fulfilled, (state, action) => {
      state.data = action.payload;
    })
  }
})

export default tasksSlice.reducer