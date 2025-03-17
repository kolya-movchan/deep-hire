export interface Contact {
  email: string
  phone: string
  location: string
}

export interface Education {
  degree: string
  field: string
  institution: string
  date: string
}

export interface Experience {
  title: string
  company: string
  date: string
  responsibilities?: string[]
}

export interface CandidateData {
  id: string
  name: string
  title: string
  summary: string
  vacancyUrl: string
  contact: Contact
  experience: Experience[]
  education: Education[]
  skills: string[]
  tools: string[]
  createdAt: string
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

export interface MatchingData {
  matchScore: number
  matchedSkills: string[]
  unmatchedSkills: string[]
  experienceMatch: ExperienceMatch
  softSkillsAnalysis: SoftSkillsAnalysis
  potentialRisks: string[]
  finalRecommendation: FinalRecommendation
}
