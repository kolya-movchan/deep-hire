export interface Contact {
  phone: string
  email: string
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
  userId: string
  name: string
  title: string
  contact: Contact
  summary: string
  education: Education[]
  experience: Experience[]
  skills: string[]
  tools: string[]
}

export interface ExperienceMatch {
  yearsOfExperience: number
  requiredExperience: string
  match: string
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
  createdAt: string
}
