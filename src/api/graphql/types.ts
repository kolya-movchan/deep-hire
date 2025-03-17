export interface VisitorId {
  visitorId: string
  requestId: string
}

export interface VerificationResult {
  isAllowed: boolean
  fingerprintId: string
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

export interface CandidateData {
  id: string
  userId: string
  name: string
  title: string
  contact: string
  summary: string
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    description: string
  }>
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
  tools: string[]
  certifications: string[]
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url: string
  }>
  languages: Array<{
    name: string
    proficiency: string
  }>
  createdAt: string
}

export interface CandidateAnalysisSummary {
  id: string
  name: string
  createdAt: string
}

export type GetAllCandidateAnalysesResponse = {
  getAllCandidateAnalyses: CandidateAnalysisSummary[]
}

export type GetAllCandidateAnalysesVariables = {
  userId: string
}

export interface ExperienceMatch {
  yearsOfExperience: number
  requiredExperience: number
  match: boolean
}

export interface SoftSkillsAnalysis {
  matched: string[]
  missing: string[]
}

export interface FinalRecommendation {
  suitability: string
  reason: string
}

export interface MatchPosition {
  id: string
  matchScore: number
  matchedSkills: string[]
  unmatchedSkills: string[]
  experienceMatch: ExperienceMatch
  softSkillsAnalysis: SoftSkillsAnalysis
  potentialRisks: string[]
  finalRecommendation: FinalRecommendation
  createdAt: string
}

export interface GetMatchPositionResponse {
  getMatchPosition: MatchPosition
}

export interface GetMatchPositionVariables {
  id: string
}
