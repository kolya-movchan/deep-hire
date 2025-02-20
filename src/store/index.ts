import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import { AuthState } from "@/types/auth"
import creditsReducer from "./credits-slice"
import { CreditsState } from "@/types/credits"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    credits: creditsReducer,
  },
})

export type RootState = {
  auth: AuthState
  credits: CreditsState
}

export type AppDispatch = typeof store.dispatch
