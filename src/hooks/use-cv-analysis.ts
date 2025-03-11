import { useState, useEffect } from "react"
import { CandidateData, MatchingData } from "@/types/cv-analysis"
import { mockCandidateData, mockMatchingData } from "@/mocks/cv-analysis-data"

interface UseCvAnalysisResult {
  candidateData: CandidateData | null
  matchingData: MatchingData | null
  isLoading: boolean
  error: string | null
}

export const useCvAnalysis = (fileSlug: string | undefined): UseCvAnalysisResult => {
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null)
  const [matchingData, setMatchingData] = useState<MatchingData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fileSlug) {
      setError("No file identifier provided")
      setIsLoading(false)
      return
    }

    // Simulate API call with a delay
    const timer = setTimeout(() => {
      try {
        // Create a modified version of the mock data with the fileSlug
        const customizedCandidateData = {
          ...mockCandidateData,
          id: fileSlug, // Use the actual fileSlug from the URL
        }

        setCandidateData(customizedCandidateData)
        setMatchingData(mockMatchingData)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading CV data:", err)
        setError("Failed to load CV analysis data")
        setIsLoading(false)
      }
    }, 800) // Simulate network delay

    return () => clearTimeout(timer)
  }, [fileSlug])

  return { candidateData, matchingData, isLoading, error }
}
