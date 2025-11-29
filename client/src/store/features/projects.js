import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
  data: [],
  currentProject: {},
  loaded: false,
};

const API_URL = import.meta.env.VITE_API_KEY;
const PROJECTS_URL = `${API_URL}/projects`;

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

export const getProjectByIdAsync = createAsyncThunk('projects/edit', async (projectId) => {
  const fullUrl = `${PROJECTS_URL}/${projectId}`;
  const result = await axios.get(fullUrl);
  return result.data.project;
})

export const updateProjectAsync = createAsyncThunk('projects/saveEdit', async (project) => {
  const fullUrl = `${PROJECTS_URL}/${project.id}`;
  const result = await axios.put(fullUrl, project);
  return result.data.project;
})

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    resetLoadedStatus: (state) => {
      state.loaded = false;
    },
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

    builder.addCase(getProjectByIdAsync.fulfilled, (state, action) => {
      state.currentProject = action.payload;
    });

    builder.addCase(updateProjectAsync.fulfilled, (state, action) => {
      const updatedProject = action.payload;
      const index = state.data.findIndex(p => p.id === updatedProject.id);

      if (index !== -1) {
        state.data[index] = updatedProject;
      }

      state.currentProject = null;
      state.loaded = true;
    });
  }
});

export const { resetLoadedStatus } = projectsSlice.actions;
export default projectsSlice.reducer;