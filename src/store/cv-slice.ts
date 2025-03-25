import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface CvState {
  selectedFileId: string | null
}

const initialState: CvState = {
  selectedFileId: null,
}

export const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    setSelectedFile: (state, action: PayloadAction<string>) => {
      state.selectedFileId = action.payload
    },
  },
})

export const { setSelectedFile } = cvSlice.actions
export default cvSlice.reducer

// Add selector
export const selectSelectedFileId = (state: RootState) => state.cv.selectedFileId
