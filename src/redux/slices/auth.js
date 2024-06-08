import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk(
    'auth/fetchAuth',
    async (params) => {
        const {data} = await axios.post('/auth/login', params)
        return data
    },
)

export const fetchAuthMe = createAsyncThunk(
    'auth/fetchAuthMe',
    async (params) => {
        const res = await axios.get('/auth/me')
        return res.data
    },
)

export const fetchRegistration = createAsyncThunk(
    'auth/fetchRegistration',
    async (params) => {
        const {data} = await axios.post('/auth/register', params)
        return data
    },
)

const initialState = {
    data: null,
    status: 'loading'
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'loading';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAuth.pending, (state) => {
            state.status = 'loading';
            state.data = null
        });
        builder.addCase(fetchAuth.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = 'loaded'
        });
        builder.addCase(fetchAuth.rejected, (state) => {
            state.data = null
            state.status = 'error'
        });
        builder.addCase(fetchAuthMe.pending, (state) => {
            state.status = 'loading';
            state.data = null
        });
        builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = 'loaded'
        });
        builder.addCase(fetchAuthMe.rejected, (state) => {
            state.data = null
            state.status = 'error'
        });
        builder.addCase(fetchRegistration.pending, (state) => {
            state.status = 'loading';
            state.data = null
        });
        builder.addCase(fetchRegistration.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = 'loaded'
        });
        builder.addCase(fetchRegistration.rejected, (state) => {
            state.data = null
            state.status = 'error'
        });
    },
})

export const selectIsAuth =  state => !!state.auth.data

export const AuthReducer = authSlice.reducer;
export const {logout} = authSlice.actions;