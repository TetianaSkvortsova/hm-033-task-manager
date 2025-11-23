import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {menuItems} from '../../common/menu';


const initialState = {
    userData: {}
};
const AUTH_URL = 'http://localhost:3000/auth';
const ISAUTH_URL = 'http://localhost:3000/user-info';
export const getUserAsync = createAsyncThunk('user/getUser', async (credentials = {}) => {
    const {login, password, token} = credentials;
    if (token) {
        const response = await axios.get(ISAUTH_URL, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } else {
        const result = await axios.post(AUTH_URL, {login, password});
        return result.data;
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: builder => {
        builder
            .addCase(getUserAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUserAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userData = action.payload;
                state.error = null;
                menuItems.find(item => {
                    if (item.hideInMenu === true) item.hideInMenu = false;
                });
                localStorage.setItem('authToken', state.userData.user.hash);
            })
            .addCase(getUserAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.userData = null;
            })
    }
})

export default userSlice.reducer;