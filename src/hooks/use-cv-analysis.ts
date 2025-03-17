import { useState, useEffect } from "react"
import { CandidateData, MatchingData } from "@/types/cv-analysis"
import client from "@/api/graphql/client"
import { GET_CANDIDATE_SUMMARY, GET_MATCH_POSITION } from "@/api/graphql/queries"
import { AppDispatch } from "@/store"
import { addAnalysis } from "@/store/candidate-analyses-slice"
import { GetMatchPositionResponse, GetMatchPositionVariables } from "@/api/graphql/types"

interface UseCvAnalysisResult {
  candidateData: CandidateData | null
  matchingData: MatchingData | null
  isLoading: boolean
  error: string | null
}

export const useCvAnalysis = (
  fileSlug: string | undefined,
  dispatch: AppDispatch
): UseCvAnalysisResult => {
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
    let timer: ReturnType<typeof setTimeout> | null = null

    const fetchData = async (): Promise<void> => {
      console.log(
        `[useCvAnalysis] Attempt ${attempts + 1}/${maxAttempts} to fetch data for fileSlug:`,
        fileSlug
      )
      try {
        // Fetch candidate summary data
        const candidateResponse = await client.query({
          query: GET_CANDIDATE_SUMMARY,
          variables: { id: fileSlug },
          context: {
            operationName: "GetCandidateSummary",
          },
          fetchPolicy: "network-only", // Force network request, don't use cache
        })

        console.log("[useCvAnalysis] Candidate query response:", candidateResponse.data)

        // Fetch matching data
        const matchingResponse = await client.query<
          GetMatchPositionResponse,
          GetMatchPositionVariables
        >({
          query: GET_MATCH_POSITION,
          variables: { id: fileSlug },
          context: {
            operationName: "GetMatchPosition",
          },
          fetchPolicy: "network-only",
        })

        console.log("[useCvAnalysis] Matching query response:", matchingResponse.data)

        if (
          candidateResponse.data &&
          candidateResponse.data.getCandidateSummary &&
          matchingResponse.data &&
          matchingResponse.data.getMatchPosition
        ) {
          console.log(
            "[useCvAnalysis] Successfully retrieved candidate data:",
            candidateResponse.data.getCandidateSummary
          )
          console.log(
            "[useCvAnalysis] Successfully retrieved matching data:",
            matchingResponse.data.getMatchPosition
          )

          setCandidateData(candidateResponse.data.getCandidateSummary)

          // Map the GraphQL response to our MatchingData interface
          const matchData: MatchingData = {
            matchScore: matchingResponse.data.getMatchPosition.matchScore,
            matchedSkills: matchingResponse.data.getMatchPosition.matchedSkills,
            unmatchedSkills: matchingResponse.data.getMatchPosition.unmatchedSkills,
            experienceMatch: matchingResponse.data.getMatchPosition.experienceMatch,
            softSkillsAnalysis: matchingResponse.data.getMatchPosition.softSkillsAnalysis,
            potentialRisks: matchingResponse.data.getMatchPosition.potentialRisks,
            finalRecommendation: matchingResponse.data.getMatchPosition.finalRecommendation,
          }

          setMatchingData(matchData)
          setIsLoading(false)

          console.log("[useCvAnalysis] Adding analysis:", {
            id: fileSlug,
            name: candidateResponse.data.getCandidateSummary.name,
            createdAt: candidateResponse.data.getCandidateSummary.createdAt,
          })

          // Add the analysis to the store
          dispatch(
            addAnalysis({
              id: fileSlug,
              name: candidateResponse.data.getCandidateSummary.name,
              createdAt: candidateResponse.data.getCandidateSummary.createdAt,
            })
          )

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
  }, [fileSlug, dispatch])

  console.log("[useCvAnalysis] Returning state:", {
    candidateData: candidateData ? "Present" : "Null",
    matchingData: matchingData ? "Present" : "Null",
    isLoading,
    error,
  })

  return { candidateData, matchingData, isLoading, error }
}
