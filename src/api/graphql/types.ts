export interface VisitorId {
  visitorId: string
  requestId: string
}

export interface VerificationResult {
  isAllowed: boolean
  visitorId: string
  balance: number
}

export interface VerifyVisitorMutation {
  verifyVisitor: VerificationResult
}

export interface VerifyVisitorVariables {
  visitorId: string
}

export interface User {
  userId: string
  email: string
  credits: string
  role: string
  name: string
  createdAt: string
}

export type CreateAnonUserResponse = {
  createAnonUser: {
    userId: string
  }
}

export type CreateAnonUserVariables = {
  id: string
}

export type GetCreditsResponse = {
  getCredits: {
    balance: number
    message?: string
  }
}

export type GetCreditsVariables = {
  userId: string
}

export type DeductCreditsResponse = {
  deductCredits: {
    message: string
    creditsRequired: number
    creditsUsed: number
    balance: number
  }
}

export type DeductCreditsVariables = {
  userId: string
  action: string
  requiredCredits: number
}
