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

export const getTasksAsync = createAsyncThunk('tasks/getList', async (projectId = '') => {
  const result = await axios.get(`http://localhost:3000/tasks/${projectId}`);
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