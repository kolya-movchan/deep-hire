import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import client from "@/api/graphql/client"
import { CreditAction, CreditCosts } from "@/types/credits"
import { CreditsState } from "@/types/state"
import {
  DeductCreditsResponse,
  DeductCreditsVariables,
  GetCreditsResponse,
  GetCreditsVariables,
} from "@/api/graphql/types"
import { DEDUCT_CREDITS } from "@/api/graphql/mutations"
import { GET_CREDITS } from "@/api/graphql/queries"

const initialState: CreditsState = {
  balance: null,
  loading: false,
  error: null,
}

export const fetchCredits = createAsyncThunk("credits/fetchCredits", async (id: string) => {
  console.log("Fetching credits... for user:", id)

  const userId = id

  console.log("Using user ID:", userId)

  const { data } = await client.query<GetCreditsResponse, GetCreditsVariables>({
    query: GET_CREDITS,
    variables: {
      userId,
    },
    context: {
      operationName: "GetCredits",
    },
  })

  console.log("Credits response:", data?.getCredits)
  const credits = data?.getCredits.balance ?? 0
  console.log("Returning credits:", credits)
  return credits
})

export const deductCredits = createAsyncThunk("credits/deductCredits", async (userId: string) => {
  console.log("Deducting credits for user:", userId)
  const { data } = await client.mutate<DeductCreditsResponse, DeductCreditsVariables>({
    mutation: DEDUCT_CREDITS,
    variables: {
      userId,
      action: CreditAction.PARSE_CV,
      requiredCredits: CreditCosts[CreditAction.PARSE_CV],
    },
    context: {
      operationName: "DeductCredits",
    },
  })
  console.log("Deduct credits response:", data)
  if (!data) {
    throw new Error("Failed to deduct credits")
  }
  return data
})

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCredits.fulfilled, (state, action: PayloadAction<number>) => {
        state.balance = action.payload
        state.loading = false
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Failed to fetch credits"
      })
      .addCase(deductCredits.pending, (state) => {
        console.log("Deduct credits pending. Current state:", state)
        state.loading = true
        state.error = null
      })
      .addCase(deductCredits.fulfilled, (state, action) => {
        console.log("Deduct credits fulfilled. Action payload:", action.payload)
        console.log("Current balance:", state.balance)
        state.loading = false

        if (state.balance !== null) {
          const newBalance = state.balance - action.payload.deductCredits.creditsUsed
          state.balance = newBalance
        } else {
          console.warn("Cannot update balance: current balance is null")
        }
      })
      .addCase(deductCredits.rejected, (state, action) => {
        console.error("Deduct credits rejected:", action.error)
        state.loading = false
        state.error = action.error.message ?? "Failed to deduct credits"
      })
  },
})

export const { updateBalance } = creditsSlice.actions
export default creditsSlice.reducer
