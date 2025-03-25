import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { RootState } from "."

export interface CvState {
  selectedFileId: string | null
}

const initialState: CvState = {
  selectedFileId: null,
}

export const cvSlice: Slice<CvState> = createSlice({
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
