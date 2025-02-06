import { configureStore } from "@reduxjs/toolkit"
import authReducer, { AuthState } from "./authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = {
  auth: AuthState
}

export type AppDispatch = typeof store.dispatch
