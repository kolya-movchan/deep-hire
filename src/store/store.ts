import { configureStore } from "@reduxjs/toolkit"
// ... other imports ...

export const store = configureStore({
  reducer: {
    // Add your reducers here
    // For example:
    // counter: counterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
