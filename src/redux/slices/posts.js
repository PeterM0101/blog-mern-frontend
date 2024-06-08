import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const {data} = await axios.get('/posts')
        return data
    },
)

export const fetchRemovePost = createAsyncThunk(
    'posts/fetchRemovePost',
    async (id) => {
        try {
            await axios.delete(`/posts/${id}`)
            return id
        } catch (e) {
            return null
        }
    },
)

export const fetchTags = createAsyncThunk(
    'posts/fetchTags',
    async () => {
        const {data} = await axios.get(`/tags`)
        return data
    },
)

const initialState = {
    posts: {items: [], status: 'loading'},
    tags: {items: [], status: 'loading'}
}


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getting posts
        builder.addCase(fetchPosts.pending, (state) => {
            state.posts.status = 'loading'
        });
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded'
        });
        builder.addCase(fetchPosts.rejected, (state) => {
            state.posts.items = []
            state.posts.status = 'error'
        });

        // getting tags
        builder.addCase(fetchTags.pending, (state) => {
            state.tags.status = 'loading'
        });
        builder.addCase(fetchTags.fulfilled, (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded'
        });
        builder.addCase(fetchTags.rejected, (state) => {
            state.tags.items = []
            state.tags.status = 'error'
        });

        // delete a post
        builder.addCase(fetchRemovePost.fulfilled, (state, action) => {
            state.posts.items = state.posts.items.filter(post => post._id !== action.payload);
        });
    },
})

export const PostsReducer = postsSlice.reducer