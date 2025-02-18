export enum CreditAction {
  PARSE_CV = "parseCV",
  // Add other actions as needed
}

export const CreditCosts: Record<CreditAction, number> = {
  [CreditAction.PARSE_CV]: 3,
  // Add costs for other actions
}

export interface CheckCreditsResponse {
  allowed: boolean
  credits: number
  message?: string
}
