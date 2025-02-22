import { AuthState } from "@/types/auth"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { getCurrentUser, signOut } from "aws-amplify/auth"

interface VisitorData {
  fingerprintId: string
}

const initialState: AuthState = {
  user: null,
  fingerprintId: null,
  loading: true,
  error: null,
  visitorLoading: false,
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

export const setVisitorData = createAsyncThunk(
  "auth/setVisitorData",
  async (fingerprintId: string) => {
    return fingerprintId
  }
)

// Add explicit type annotation for the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setNewVisitorData: (state, action: PayloadAction<VisitorData>) => {
      state.fingerprintId = action.payload.fingerprintId
    },
    setVisitorLoading: (state, action: PayloadAction<boolean>) => {
      state.visitorLoading = action.payload
    },
    setVisitorError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
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
      .addCase(setVisitorData.pending, (state) => {
        state.fingerprintId = null
      })
      .addCase(setVisitorData.fulfilled, (state, action) => {
        state.fingerprintId = action.payload
      })
      .addCase(setVisitorData.rejected, (state) => {
        state.fingerprintId = null
      })
  },
})

export const { setNewVisitorData, setVisitorLoading, setVisitorError } = authSlice.actions
export default authSlice.reducer
