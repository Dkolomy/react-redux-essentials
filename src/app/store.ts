import { configureStore } from '@reduxjs/toolkit'

import postsReducer from '../features/posts/postsSlice'
// import usersReducer from '../features/users/usersSlice'
import authReducer from '../features/auth/authSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import {apiSlice} from '../features/api/apiSlice'

import {listenerMiddleware} from './listenerMiddleware'
// import { apiSliceWithUsers } from '../features/users/usersSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    // users: apiSliceWithUsers.reducer,
    auth: authReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
     .prepend(listenerMiddleware.middleware)
     .concat(apiSlice.middleware)
})

// export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>

