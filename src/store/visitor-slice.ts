import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { VisitorState } from "@/types/state"

const initialState: VisitorState = {
  fingerprintId: null,
  loading: true,
  error: null,
}

export const setVisitorData = createAsyncThunk(
  "auth/setVisitorData",
  async (fingerprintId: string) => {
    return fingerprintId
  }
)

// Add explicit type annotation for the slice
const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    setNewVisitorData: (state, action: PayloadAction<{ fingerprintId: string }>) => {
      state.fingerprintId = action.payload.fingerprintId
    },
    setVisitorLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setVisitorError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { setNewVisitorData, setVisitorLoading, setVisitorError } = visitorSlice.actions

export default visitorSlice.reducer
