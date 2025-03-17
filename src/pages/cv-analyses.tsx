import { FC, useEffect } from "react"
import { Container, Paper, Grid, Button, LinearProgress } from "@mui/material"
import { Visibility, Description, AddCircleOutline } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useAppDispatch } from "@/store/hooks"
import { fetchCandidateAnalyses } from "@/store/candidate-analyses-slice"
import { Sidebar } from "@/components/Sidebar"

export const CvAnalyses: FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { fingerprintId } = useSelector((state: RootState) => state.visitor)
  const userId = user?.userId || fingerprintId
  const { analyses, loading, error } = useSelector((state: RootState) => state.candidateAnalyses)

  useEffect(() => {
    if (userId) {
      dispatch(fetchCandidateAnalyses(userId))
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
                    onClick={() => dispatch(fetchCandidateAnalyses(userId))}
                    variant="outlined"
                    className="mt-4 bg-primary/10 hover:bg-primary/20 text-primary"
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
                    className="bg-primary text-primary-foreground hover:bg-primary-hover"
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
                      <thead className="bg-primary/5">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                          >
                            Created At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyses.map((analysis, index) => (
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
                              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                {formatDate(analysis.createdAt)}
                              </span>
                            </td>
                          </tr>
                        ))}
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
