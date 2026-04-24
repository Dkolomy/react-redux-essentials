import { 
  // createSlice, 
  createEntityAdapter,
  type EntityState,
  createSelector,
} from '@reduxjs/toolkit'

// import { client } from '../../api/client'
// import { createAppAsyncThunk } from '../../app/withTypes'

import type { RootState } from '../../app/store'

import {apiSlice} from '../api/apiSlice'
import {selectCurrentUsername} from '../auth/authSlice'

export type User = {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()
const initialState = usersAdapter.getInitialState()

// export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
//   const response = await client.get<User[]>('/fakeApi/users')
//   return response.data
// })

// const usersSlice = createSlice({  
//   name: 'users',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchUsers.fulfilled, (state, action) => {
//       usersAdapter.setAll(state, action.payload)
//     })
//   }
// })

// const emptyUsers: User[] = []

// export const selectUsersResult = apiSlice.endpoints.getUsers.select()

// export const selectAllUsers = createSelector(
//   selectUsersResult,
//   (usersResult) => usersResult.data ?? emptyUsers
// )

// export const selectUserById = createSelector(
//   selectAllUsers,
//   (_state: RootState, userId: string) => userId,
//   (users, userId) => users.find((user) => user.id === userId)
// )

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => '/users',
      transformResponse: (response: User[]) => usersAdapter.setAll(initialState, response),
    }),
  }),
})

export const { useGetUsersQuery } = apiSliceWithUsers

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()
export const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data ?? initialState
)

// export default usersSlice.reducer

// export const {
//   selectAll: selectAllUsers,
//   selectById: selectUserById,
// } = usersAdapter.getSelectors((state: RootState) => state.users)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (currentUsername) {
    return selectUserById(state, currentUsername)
  }
}

export const {selectAll: selectAllUsers, selectById: selectUserById} = 
  usersAdapter.getSelectors(selectUsersData)