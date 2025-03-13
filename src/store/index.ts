import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import { AuthState } from "@/types/state"
import creditsReducer from "./credits-slice"
import { CreditsState } from "@/types/state"
import visitorReducer from "./visitor-slice"
import { VisitorState } from "@/types/state"
import candidateAnalysesReducer from "./candidate-analyses-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    visitor: visitorReducer,
    credits: creditsReducer,
    candidateAnalyses: candidateAnalysesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
