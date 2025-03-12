import { useState, useEffect } from "react"
import { CandidateData, MatchingData } from "@/types/cv-analysis"
import { mockMatchingData } from "@/mocks/cv-analysis-data"
import client from "@/api/graphql/client"
import { GET_CANDIDATE_SUMMARY } from "@/api/graphql/queries"

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
    console.log("[useCvAnalysis] Hook initialized with fileSlug:", fileSlug)

    if (!fileSlug) {
      console.log("[useCvAnalysis] No fileSlug provided, aborting")
      setError("No file identifier provided")
      setIsLoading(false)
      return
    }

    let attempts = 0
    const maxAttempts = 30
    let timer: NodeJS.Timeout | null = null

    const fetchData = async (): Promise<void> => {
      console.log(
        `[useCvAnalysis] Attempt ${attempts + 1}/${maxAttempts} to fetch data for fileSlug:`,
        fileSlug
      )
      try {
        const { data } = await client.query({
          query: GET_CANDIDATE_SUMMARY,
          variables: { id: fileSlug },
          context: {
            operationName: "getCandidateSummary",
          },
          fetchPolicy: "network-only", // Force network request, don't use cache
        })

        console.log("[useCvAnalysis] Query response:", data)

        if (data && data.getCandidateSummary) {
          console.log(
            "[useCvAnalysis] Successfully retrieved candidate data:",
            data.getCandidateSummary
          )
          setCandidateData(data.getCandidateSummary)
          setMatchingData(mockMatchingData) // Still using mock matching data
          console.log("[useCvAnalysis] Set mock matching data:", mockMatchingData)
          setIsLoading(false)

          if (timer) {
            console.log("[useCvAnalysis] Clearing polling interval after success")
            clearInterval(timer)
          }
          return // Success, exit the polling
        }

        attempts++
        console.log(`[useCvAnalysis] No data found, attempts: ${attempts}/${maxAttempts}`)
        if (attempts >= maxAttempts) {
          console.error("[useCvAnalysis] Max attempts reached without finding data")
          setError("Failed to load CV analysis data after multiple attempts")
          setIsLoading(false)

          if (timer) {
            console.log("[useCvAnalysis] Clearing polling interval after max attempts")
            clearInterval(timer)
          }
          return // Max attempts reached, exit polling
        }
      } catch (err) {
        console.error("[useCvAnalysis] Error loading CV data:", err)
        attempts++

        if (attempts >= maxAttempts) {
          console.error("[useCvAnalysis] Max attempts reached with errors")
          setError("Failed to load CV analysis data after multiple attempts")
          setIsLoading(false)

          if (timer) {
            console.log("[useCvAnalysis] Clearing polling interval after max error attempts")
            clearInterval(timer)
          }
          return // Max attempts reached, exit polling
        }
      }
    }

    // Initial call
    console.log("[useCvAnalysis] Starting initial data fetch")
    fetchData()

    // Set up polling every 2 seconds
    console.log("[useCvAnalysis] Setting up polling interval (2000ms)")
    timer = setInterval(() => {
      if (attempts < maxAttempts && isLoading) {
        console.log("[useCvAnalysis] Polling for data...")
        fetchData()
      } else {
        console.log("[useCvAnalysis] Clearing polling interval")
        if (timer) clearInterval(timer)
      }
    }, 2000)

    return () => {
      console.log("[useCvAnalysis] Cleanup: clearing interval")
      if (timer) clearInterval(timer)
    }
  }, [fileSlug])

  console.log("[useCvAnalysis] Returning state:", {
    candidateData: candidateData ? "Present" : "Null",
    matchingData: matchingData ? "Present" : "Null",
    isLoading,
    error,
  })

  return { candidateData, matchingData, isLoading, error }
}
