import { 
  createSelector,
  createEntityAdapter,
  type EntityState,
  // createSlice 
} from '@reduxjs/toolkit'

// import { client } from '../../api/client'

import type { RootState } from '../../app/store'
// import { createAppAsyncThunk } from '../../app/withTypes'

import {apiSlice} from '../api/apiSlice'
import {selectCurrentUsername} from '../auth/authSlice'

export type User = {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()
const initialState = usersAdapter.getInitialState()

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => '/users',
      transformResponse: (response: User[]) => {
        return usersAdapter.setAll(initialState, response)
      },
    }),
  }),
})

export const { useGetUsersQuery } = apiSliceWithUsers

// const emptyUsers: User[] = []

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data ?? initialState
)

// export const selectAllUsers = createSelector(
//   selectUsersResult,
//   (usersResult) => usersResult.data ?? emptyUsers
// )

// export const selectUserById = createSelector(
//   selectAllUsers,
//   (_state: RootState, userId: string) => userId,
//   (users, userId) => (Array.isArray(users) ? 
//     users.find((user: User) => user.id === userId) : 
//     users.entities[userId])
// )

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (currentUsername) {
    return selectUserById(state, currentUsername)
  }
}

export const {selectAll: selectAllUsers, selectById: selectUserById} = 
  usersAdapter.getSelectors(selectUsersData)