import { AuthState } from "@/types/auth"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCurrentUser, signOut } from "aws-amplify/auth"

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
}

// ✅ Async action to check authentication status
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  try {
    const user = await getCurrentUser()
    return { userId: user?.userId, username: user?.username }
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
        state.error = "Failed to check authentication status"
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer
