import { FC, useEffect, useState } from "react"
import { Container, Grid, Button, LinearProgress } from "@mui/material"
import { Description, AddCircleOutline, ArrowUpward, ArrowDownward } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useAppDispatch } from "@/store/hooks"
import { fetchCandidateAnalyses } from "@/store/candidate-analyses-slice"
import { fetchCandidateDetails, clearDetails } from "@/store/candidate-details-slice"
import { Sidebar } from "@/components/Sidebar"

type SortField = "name" | "title" | "position" | "matchScore"
type SortDirection = "asc" | "desc"

export const CvAnalyses: FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { fingerprintId } = useSelector((state: RootState) => state.visitor)
  const userId = user?.userId || fingerprintId
  const { analyses, loading, error } = useSelector((state: RootState) => state.candidateAnalyses)
  const { details: matchScores } = useSelector((state: RootState) => state.candidateDetails)

  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  useEffect(() => {
    if (userId) {
      dispatch(fetchCandidateAnalyses(userId))
      dispatch(fetchCandidateDetails(userId))
    }
    return () => {
      dispatch(clearDetails())
    }
  }, [userId, dispatch])

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort analyses
  const getSortedAnalyses = () => {
    if (!analyses) return []

    const analysesWithScores = analyses.map((analysis) => {
      const matchScore = matchScores.find((score) => score.id === analysis.id)?.matchScore
      return {
        ...analysis,
        matchScore: matchScore ? Number(matchScore) : -1,
      }
    })

    return [...analysesWithScores].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "title": {
          const titleA = a.title || ""
          const titleB = b.title || ""
          comparison = titleA.localeCompare(titleB)
          break
        }
        case "position": {
          const positionA = a.vacancyUrl ? "a" : "z" // Sort positions with URLs first
          const positionB = b.vacancyUrl ? "a" : "z"
          comparison = positionA.localeCompare(positionB)
          break
        }
        case "matchScore":
          comparison = a.matchScore - b.matchScore
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }

  const sortedAnalyses = getSortedAnalyses()

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">⇅</span>
    return sortDirection === "asc" ? (
      <ArrowUpward fontSize="inherit" className="ml-1 inline-block text-primary text-xs" />
    ) : (
      <ArrowDownward fontSize="inherit" className="ml-1 inline-block text-primary text-xs" />
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath={window.location.pathname} />

      <main className="flex-grow px-4 py-8 md:px-8">
        <Container maxWidth="lg" className="animate-fade-in">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Description sx={{ color: "#6d28d9", fontSize: 28 }} />
            </div>
            <h1 className="text-3xl font-bold text-foreground">CV Analyses</h1>
          </div>

          <p className="text-foreground/70 mb-8 max-w-2xl">
            View all your CV analyses and check candidate matching results. You can upload new
            resumes from the home page.
          </p>

          <Grid container spacing={3}>
            {loading && (
              <Grid item xs={12}>
                <div className="card p-6 text-center animate-pulse">
                  <h2 className="text-xl font-semibold mb-4">Loading analyses...</h2>
                  <LinearProgress />
                </div>
              </Grid>
            )}

            {error && (
              <Grid item xs={12}>
                <div className="card p-6 text-center border border-destructive/20 bg-destructive/5">
                  <h2 className="text-xl font-semibold text-destructive mb-4">
                    Error loading analyses
                  </h2>
                  <p className="text-foreground/70">{error}</p>
                  <Button
                    onClick={() => userId && dispatch(fetchCandidateAnalyses(userId))}
                    variant="outlined"
                    className="mt-4 bg-primary/10 text-primary"
                  >
                    Try Again
                  </Button>
                </div>
              </Grid>
            )}

            {!loading && !error && (!analyses || analyses.length === 0) && (
              <Grid item xs={12}>
                <div className="card glass-effect p-8 text-center border border-primary/10 animate-slide-up">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <AddCircleOutline sx={{ color: "#2563eb", fontSize: 40 }} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No analyses found</h2>
                  <p className="text-foreground/70 mb-6">
                    Upload a resume on the home page to get started with candidate analysis.
                  </p>
                  <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    className="bg-primary text-primary-foreground"
                  >
                    Upload Resume
                  </Button>
                </div>
              </Grid>
            )}

            {!loading && !error && analyses && analyses.length > 0 && (
              <Grid item xs={12}>
                <div className="overflow-hidden bg-white rounded-xl shadow-md border border-primary/5 animate-slide-up">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center">
                              <span>Name</span>
                              {renderSortIcon("name")}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("title")}
                          >
                            <div className="flex items-center">
                              <span>Title</span>
                              {renderSortIcon("title")}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("position")}
                          >
                            <div className="flex items-center">
                              <span>Position</span>
                              {renderSortIcon("position")}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort("matchScore")}
                          >
                            <div className="flex items-center">
                              <span>Match Score</span>
                              {renderSortIcon("matchScore")}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Scanned At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAnalyses.map((analysis, index) => {
                          const matchScore = matchScores.find(
                            (score) => score.id === analysis.id
                          )?.matchScore

                          return (
                            <tr
                              key={analysis.id}
                              className="cursor-pointer transition-all duration-300 hover:bg-gray-100"
                              style={{ animationDelay: `${index * 0.05}s` }}
                              onClick={() => (window.location.href = `/cv-analysis/${analysis.id}`)}
                              title="Click to view CV analysis details"
                              role="link"
                              aria-label={`View analysis for ${analysis.name}`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-md font-medium text-foreground">
                                  {analysis.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-foreground/80">
                                  {analysis.title || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-foreground/80">
                                  {analysis.vacancyUrl ? (
                                    <a
                                      href={analysis.vacancyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-primary hover:underline"
                                    >
                                      View Position
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-foreground/80">
                                  {matchScore ? (
                                    <span
                                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                        Number(matchScore) >= 70
                                          ? "bg-green-100 text-green-800"
                                          : Number(matchScore) >= 40
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {matchScore}%
                                    </span>
                                  ) : (
                                    "N/A"
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                  {formatDate(analysis.createdAt)}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
        </Container>
      </main>
    </div>
  )
}
