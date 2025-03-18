import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import client from "@/api/graphql/client"
import { GET_CANDIDATE_DETAILS } from "@/api/graphql/queries"

export interface CandidateDetails {
  id: string
  matchScore: string
}

interface CandidateDetailsState {
  details: CandidateDetails[]
  loading: boolean
  error: string | null
}

const initialState: CandidateDetailsState = {
  details: [],
  loading: false,
  error: null,
}

export const fetchCandidateDetails = createAsyncThunk(
  "getAllCandidatesMatch/fetch",
  async (userId: string) => {
    const { data } = await client.query({
      query: GET_CANDIDATE_DETAILS,
      variables: { userId, fields: ["matchScore"] },
      context: {
        operationName: "getAllCandidatesMatch",
      },
    })
    console.log("Candidate details response:", data.getAllCandidatesMatch)
    return data.getAllCandidatesMatch
  }
)

const candidateDetailsSlice = createSlice({
  name: "getAllCandidatesMatch",
  initialState,
  reducers: {
    clearDetails: (state) => {
      state.details = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateDetails.pending, (state) => {
        state.loading = true
        state.error = null
        console.log("Fetching candidate details...")
      })
      .addCase(fetchCandidateDetails.fulfilled, (state, action) => {
        state.loading = false
        state.details = action.payload
        console.log("Candidate details updated:", action.payload, state.details)
      })
      .addCase(fetchCandidateDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch candidate details"
        console.error("Failed to fetch candidate details:", action.error)
      })
  },
})

export const { clearDetails } = candidateDetailsSlice.actions
export default candidateDetailsSlice.reducer
