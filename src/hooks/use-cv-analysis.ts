import { useState, useEffect } from "react"
import { CandidateData, MatchingData } from "@/types/cv-analysis"
import client from "@/api/graphql/client"
import { GET_CANDIDATE_SUMMARY, GET_MATCH_POSITION } from "@/api/graphql/queries"
import { AppDispatch } from "@/store"
import { addAnalysis, CandidateAnalysis } from "@/store/candidate-analyses-slice"
import { GetMatchPositionResponse, GetMatchPositionVariables } from "@/api/graphql/types"

interface UseCvAnalysisResult {
  candidateData: CandidateData | null
  matchingData: MatchingData | null
  isCandidateLoading: boolean
  isMatchingLoading: boolean
  error: string | null
}

export const useCvAnalysis = (
  fileSlug: string | null,
  dispatch: AppDispatch
): UseCvAnalysisResult => {
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null)
  const [matchingData, setMatchingData] = useState<MatchingData | null>(null)
  const [isCandidateLoading, setIsCandidateLoading] = useState<boolean>(true)
  const [isMatchingLoading, setIsMatchingLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("[useCvAnalysis] Hook initialized with fileSlug:", fileSlug)

    if (!fileSlug) {
      console.log("[useCvAnalysis] No fileSlug provided, aborting")
      setError("No file identifier provided")
      setIsCandidateLoading(false)
      setIsMatchingLoading(false)
      return
    }

    let attempts = 0
    const maxAttempts = 100
    let timer: ReturnType<typeof setTimeout> | null = null

    const fetchData = async (): Promise<void> => {
      console.log(
        `[useCvAnalysis] Attempt ${attempts + 1}/${maxAttempts} to fetch data for fileSlug:`,
        fileSlug
      )
      try {
        // Fetch candidate summary data if not already loaded
        if (!candidateData) {
          const candidateResponse = await client.query({
            query: GET_CANDIDATE_SUMMARY,
            variables: { id: fileSlug },
            context: {
              operationName: "GetCandidateSummary",
            },
            fetchPolicy: "network-only", // Force network request, don't use cache
          })

          console.log("[useCvAnalysis] Candidate query response:", candidateResponse.data)

          if (candidateResponse.data && candidateResponse.data.getCandidateSummary) {
            console.log(
              "[useCvAnalysis] Successfully retrieved candidate data:",
              candidateResponse.data.getCandidateSummary
            )

            setCandidateData(candidateResponse.data.getCandidateSummary)
            setIsCandidateLoading(false)

            // Add the analysis to the store
            dispatch(
              addAnalysis({
                id: fileSlug,
                name: candidateResponse.data.getCandidateSummary.name,
                createdAt: candidateResponse.data.getCandidateSummary.createdAt,
              } as CandidateAnalysis)
            )
          }
        }

        // Fetch matching data if not already loaded
        if (!matchingData) {
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

          if (matchingResponse.data && matchingResponse.data.getMatchPosition) {
            console.log(
              "[useCvAnalysis] Successfully retrieved matching data:",
              matchingResponse.data.getMatchPosition
            )

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
            setIsMatchingLoading(false)
          }
        }

        // Check if we should continue polling
        if ((candidateData && matchingData) || attempts >= maxAttempts) {
          if (timer) {
            console.log("[useCvAnalysis] Clearing polling interval after success or max attempts")
            clearInterval(timer)
          }
          return
        }

        attempts++
        if (attempts >= maxAttempts) {
          console.error("[useCvAnalysis] Max attempts reached")
          if (!candidateData) setIsCandidateLoading(false)
          if (!matchingData) setIsMatchingLoading(false)
          setError("Failed to load complete CV analysis data after multiple attempts")

          if (timer) {
            console.log("[useCvAnalysis] Clearing polling interval after max attempts")
            clearInterval(timer)
          }
        }
      } catch (err) {
        console.error("[useCvAnalysis] Error loading CV data:", err)
        attempts++

        if (attempts >= maxAttempts) {
          console.error("[useCvAnalysis] Max attempts reached with errors")
          setError("Failed to load CV analysis data after multiple attempts")
          setIsCandidateLoading(false)
          setIsMatchingLoading(false)

          if (timer) {
            console.log("[useCvAnalysis] Clearing polling interval after max error attempts")
            clearInterval(timer)
          }
        }
      }
    }

    // Initial call
    console.log("[useCvAnalysis] Starting initial data fetch")
    fetchData()

    // Set up polling every 2 seconds
    console.log("[useCvAnalysis] Setting up polling interval (2000ms)")
    timer = setInterval(() => {
      if (attempts < maxAttempts && (isCandidateLoading || isMatchingLoading)) {
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
  }, [fileSlug, dispatch, candidateData, matchingData])

  console.log("[useCvAnalysis] Returning state:", {
    candidateData: candidateData ? "Present" : "Null",
    matchingData: matchingData ? "Present" : "Null",
    isCandidateLoading,
    isMatchingLoading,
    error,
  })

  return { candidateData, matchingData, isCandidateLoading, isMatchingLoading, error }
}
