import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

type AuthState = {
  user: string | null
}

const initialState: AuthState = {
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<string>) => {
      state.user = action.payload
    },
    userLoggedOut: (state) => {
      state.user = null
    }
  }
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export const selectCurrentUser = (state: RootState) => state.auth.user

export default authSlice.reducer