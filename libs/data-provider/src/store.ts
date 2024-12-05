import { configureStore } from '@reduxjs/toolkit'
import { pokemonApi } from './lib/pokemon-api'
import { userReducer, USER_STATE_KEY } from './lib/scopes-slice'

export const makeStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
      [USER_STATE_KEY]: userReducer,
    },
    middleware: (gDM) => gDM().concat(pokemonApi.middleware),
    devTools: process.env['NODE_ENV'] !== 'production',
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
