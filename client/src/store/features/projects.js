import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const initialState = {
  data: [],
  loaded: false,
};

/*
  project: {
    id: string,
    title: string,
    priority: string,
    descrition: string,
  }

  CRUD
*/

const BASE_URL = 'https://hm-033-task-manager.onrender.com';
const PROJECTS_URL = `${BASE_URL}/projects`;

export const getProjectsAsync = createAsyncThunk('projects/getList', async () => {
  const result = await axios.get(PROJECTS_URL);
  return result.data;
});

export const saveProjectAsync = createAsyncThunk('projects/save', async project => {
  const result = await axios.post(PROJECTS_URL, project);
  return result.data;
})

export const deleteProjectAsync = createAsyncThunk('projects/delete', async (projectId) => {
  const fullUrl = `${PROJECTS_URL}/${projectId}`;
  const result = await axios.delete(fullUrl);
  return result.data;
})

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // addProject: (state, action) => {
    //   // generate id
    //   // if integer needed:
    //   // const id = Date.now();
    //   const id = uuidv4(); // each time - new unique id

    //   // add to store
    //   const newProject = {
    //     id,
    //     ...action.payload,
    //   };
      
    //   state.data.push(newProject);
    // }
  },
  extraReducers: builder => {
    builder.addCase(getProjectsAsync.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(saveProjectAsync.fulfilled, state => {
      state.loaded = true;
    });

    builder.addCase(deleteProjectAsync.fulfilled, (state, action) => {
      state.data = action.payload.projects;
    });
  }
});

export default projectsSlice.reducer;