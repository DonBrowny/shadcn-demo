import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const USER_STATE_KEY = 'user'

export interface UserState {
  scopes: string[]
}

const initialState: UserState = {
  scopes: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setScopes: (state, action: PayloadAction<string[]>) => {
      state.scopes = action.payload
    },
  },
})

export const { setScopes } = userSlice.actions

export const getUserState = (rootState: { [x: string]: UserState }): UserState => {
  return rootState[USER_STATE_KEY]
}

export const userSelectors = {
  getUserScopes: createSelector(getUserState, (state: UserState) => state.scopes),
}

export const userReducer = userSlice.reducer
