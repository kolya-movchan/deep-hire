import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import client from "@/api/graphql/client"
import { GET_ALL_CANDIDATE_ANALYSES } from "@/api/graphql/queries"
import {
  CandidateAnalysisSummary,
  GetAllCandidateAnalysesResponse,
  GetAllCandidateAnalysesVariables,
} from "@/api/graphql/types"

// Define types
export interface CandidateAnalysis {
  id: string
  name: string
  title: string
  vacancyUrl: string
  createdAt: string
}

export interface CandidateAnalysesState {
  analyses: CandidateAnalysis[]
  loading: boolean
  error: string | null
}

// Initial state
const initialState: CandidateAnalysesState = {
  analyses: [],
  loading: false,
  error: null,
}

// Async thunk to fetch candidate analyses
export const fetchCandidateAnalyses = createAsyncThunk(
  "candidateAnalyses/fetchAll",
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log("Fetching candidate analyses for user:", userId)

      const { data } = await client.query<
        GetAllCandidateAnalysesResponse,
        GetAllCandidateAnalysesVariables
      >({
        query: GET_ALL_CANDIDATE_ANALYSES,
        variables: { userId },
        context: {
          operationName: "GetAllCandidateAnalyses",
        },
        fetchPolicy: "network-only",
      })

      return data.getAllCandidateAnalyses
    } catch (error) {
      console.error("Error fetching candidate analyses:", error)
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }
)

// Create the slice
const candidateAnalysesSlice = createSlice({
  name: "candidateAnalyses",
  initialState,
  reducers: {
    clearAnalyses: (state) => {
      state.analyses = []
    },
    addAnalysis: (state, action: PayloadAction<CandidateAnalysis>) => {
      console.log("[addAnalysis] Adding analysis:", action.payload)
      state.analyses.unshift(action.payload)
    },
    removeAnalysis: (state, action: PayloadAction<string>) => {
      state.analyses = state.analyses.filter((analysis) => analysis.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateAnalyses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchCandidateAnalyses.fulfilled,
        (state, action: PayloadAction<CandidateAnalysisSummary[]>) => {
          state.analyses = action.payload as unknown as CandidateAnalysis[]
          state.loading = false
        }
      )
      .addCase(fetchCandidateAnalyses.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Failed to fetch candidate analyses"
      })
  },
})

export const { clearAnalyses, addAnalysis, removeAnalysis } = candidateAnalysesSlice.actions
export default candidateAnalysesSlice.reducer
