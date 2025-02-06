import { createSlice, createAsyncThunk, Slice } from "@reduxjs/toolkit"
import { getCurrentUser, signOut, AuthUser } from "aws-amplify/auth"

export interface AuthState {
  user: AuthUser | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  loading: true,
}

// ✅ Async action to check authentication status
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  try {
    return await getCurrentUser()
  } catch {
    return null
  }
})

// Add explicit type annotation for the slice
export const authSlice: Slice<AuthState> = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      signOut()
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true
    })
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
    })
    builder.addCase(checkAuth.rejected, (state) => {
      state.user = null
      state.loading = false
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
