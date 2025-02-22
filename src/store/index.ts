import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import { AuthState } from "@/types/state"
import creditsReducer from "./credits-slice"
import { CreditsState } from "@/types/state"
import visitorReducer from "./visitor-slice"
import { VisitorData } from "@fingerprintjs/fingerprintjs-pro-react"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    visitor: visitorReducer,
    credits: creditsReducer,
  },
})

export type RootState = {
  auth: AuthState
  visitor: VisitorData
  credits: CreditsState
}

export type AppDispatch = typeof store.dispatch
