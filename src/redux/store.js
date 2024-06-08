import { configureStore } from '@reduxjs/toolkit'
import { PostsReducer } from './slices/posts'
import { AuthReducer } from "./slices/auth";

const store = configureStore({
    reducer: {
        posts: PostsReducer,
        auth: AuthReducer
    },
})

export default store;