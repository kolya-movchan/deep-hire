import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import creditsReducer from "./credits-slice"
import visitorReducer from "./visitor-slice"
import candidateAnalysesReducer from "./candidate-analyses-slice"
import candidateDetailsReducer from "./candidate-details-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    visitor: visitorReducer,
    credits: creditsReducer,
    candidateAnalyses: candidateAnalysesReducer,
    candidateDetails: candidateDetailsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
