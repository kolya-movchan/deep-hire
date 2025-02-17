import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import { AuthState } from "@/types/auth"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = {
  auth: AuthState
}

export type AppDispatch = typeof store.dispatch
