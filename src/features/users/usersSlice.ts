import { createSlice } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { createAppAsyncThunk } from '../../app/withTypes'

import type { RootState } from '../../app/store'

import {selectCurrentUsername} from '../auth/authSlice'

type User = {
  id: string
  name: string
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<User[]>('/fakeApi/users')
  return response.data
})

const initialState: User[] = []

// const initialState: User[] = [
//   { id: '0', name: 'Tianna Jenkins' },
//   { id: '1', name: 'Kevin Grant' },
//   { id: '2', name: 'Madison Price' },
// ]

const usersSlice = createSlice({  
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (_state, action) => {
      return action.payload
    })
  }
})

export default usersSlice.reducer

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  return selectUserById(state, currentUsername ?? undefined)
}

export const selectAllUsers = (state: RootState) => state.users

export const selectUserById = (state: RootState, userId: string | undefined) => {
  return state.users.find((user) => user.id === userId)
}