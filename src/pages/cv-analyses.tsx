import { FC, useEffect } from "react"
import { Container, Paper, Grid, Button, LinearProgress } from "@mui/material"
import { Visibility } from "@mui/icons-material"
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
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
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
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
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
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-sm font-semibold text-foreground"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-right text-sm font-semibold text-foreground"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analyses.map((analysis, index) => (
                          <tr
                            key={analysis.id}
                            className="hover:bg-primary/5 transition-colors duration-150"
                            style={{ animationDelay: `${index * 0.05}s` }}
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-foreground/60 font-mono">
                                {analysis.id.substring(0, 12)}...
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button
                                component={Link}
                                to={`/cv-analysis/${analysis.id}`}
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                className="rounded-lg border-primary/20 text-primary hover:bg-primary/10"
                              >
                                View
                              </Button>
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
