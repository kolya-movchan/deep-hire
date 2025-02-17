import { initialState } from "@/types/auth"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCurrentUser, signOut } from "aws-amplify/auth"

// ✅ Async action to check authentication status
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  try {
    return await getCurrentUser()
  } catch {
    return null
  }
})

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut()
  return null
})

// Add explicit type annotation for the slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null
        state.loading = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer
