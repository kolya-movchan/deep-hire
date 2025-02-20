import { configureStore } from "@reduxjs/toolkit"
// ... other imports ...

export const store = configureStore({
  // ... your store configuration ...
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
