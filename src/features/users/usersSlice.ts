import { 
  createSelector,
  createEntityAdapter,
  type EntityState,
} from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'

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

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data ?? initialState
)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (currentUsername) {
    return selectUserById(state, currentUsername)
  }
}

export const {selectAll: selectAllUsers, selectById: selectUserById} = 
  usersAdapter.getSelectors(selectUsersData)