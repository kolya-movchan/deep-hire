import { FC, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material"
import { Person, Login, Settings, Assessment, Visibility } from "@mui/icons-material"
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
      console.log("Fetching analyses for userId:", userId)
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

  // Display the data as JSON at the top of the component
  console.log("analyses ===>", analyses, loading, error)

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 200,
            boxSizing: "border-box",
            bgcolor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#1976d2",
            }}
          >
            ResumeCheck
          </Typography>
        </Box>
        <Sidebar activePath={window.location.pathname} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fff",
          p: 3,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
            CV Analyses
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            View all your CV analyses and their results
          </Typography>

          <Grid container spacing={3}>
            {loading && (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="body1">Loading candidate analyses...</Typography>
                </Paper>
              </Grid>
            )}

            {error && (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: "#ffebee" }}>
                  <Typography variant="body1" color="error">
                    Error loading analyses: {error}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {!loading && !error && (!analyses || analyses.length === 0) && (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="body1">
                    No CV analyses found. Upload a resume on the home page to get started.
                  </Typography>
                </Paper>
              </Grid>
            )}

            {!loading && !error && analyses && analyses.length > 0 && (
              <Grid item xs={12}>
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyses.map((analysis) => (
                        <TableRow
                          key={analysis.id}
                          sx={{ "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" } }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={500}>
                              {analysis.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={formatDate(analysis.createdAt)}
                              sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {analysis.id.substring(0, 12)}...
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              component={Link}
                              to={`/cv-analysis/${analysis.id}`}
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              sx={{ borderRadius: 2 }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
