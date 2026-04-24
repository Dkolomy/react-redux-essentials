import { 
  createSlice, 
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { createAppAsyncThunk } from '../../app/withTypes'

import type { RootState } from '../../app/store'

import {apiSlice} from '../api/apiSlice'
import {selectCurrentUsername} from '../auth/authSlice'

export type User = {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<User[]>('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({  
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      usersAdapter.setAll(state, action.payload)
    })
  }
})

const emptyUsers: User[] = []

export const selectUsersResult = apiSlice.endpoints.getUsers.select()

export const selectAllUsers = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data ?? emptyUsers
)

export const selectUserById = createSelector(
  selectAllUsers,
  (_state: RootState, userId: string) => userId,
  (users, userId) => users.find((user) => user.id === userId)
)

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
  }),
})

export const { useGetUsersQuery } = apiSliceWithUsers

export const selectUserResult = apiSliceWithUsers.endpoints.getUsers.select()

export default usersSlice.reducer

// export const {
//   selectAll: selectAllUsers,
//   selectById: selectUserById,
// } = usersAdapter.getSelectors((state: RootState) => state.users)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (!currentUsername) {
    return
  }
  return selectUserById(state, currentUsername)
}