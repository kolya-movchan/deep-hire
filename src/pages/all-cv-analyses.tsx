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
} from "@mui/material"
import { Person, Login, WorkOutline, Settings, Assessment } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useAppDispatch } from "@/store/hooks"
import { fetchCandidateAnalyses } from "@/store/candidate-analyses-slice"

export const AllCvAnalyses: FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { fingerprintId } = useSelector((state: RootState) => state.visitor)
  const userId = user?.userId || fingerprintId
  const { analyses, loading, error } = useSelector((state: RootState) => state.candidateAnalyses)

  useEffect(() => {
    if (userId) {
      console.log(111, userId)

      dispatch(fetchCandidateAnalyses(userId))
    }
  }, [dispatch, userId])

  // Display the data as JSON at the top of the component
  const analysesJson = analyses ? JSON.stringify(analyses, null, 2) : "Loading..."

  const sidebarItems = user
    ? [
        { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
        { icon: <Assessment />, text: "CV Analyses", path: "/all-cv-analyses" },
        { icon: <Person />, text: "Candidates", path: "/candidates" },
        { icon: <Settings />, text: "Settings", path: "/settings" },
      ]
    : [
        { icon: <Login />, text: "Login", path: "/login" },
        { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
        { icon: <Assessment />, text: "CV Analyses", path: "/all-cv-analyses" },
        { icon: <Person />, text: "Candidates", path: "/candidates" },
      ]

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
        <List>
          {sidebarItems.map((item) => (
            <ListItem
              component={Link}
              to={item.path}
              key={item.text}
              sx={{
                color: item.path === "/all-cv-analyses" ? "#1976d2" : "#666",
                bgcolor:
                  item.path === "/all-cv-analyses" ? "rgba(25, 118, 210, 0.08)" : "transparent",
                fontWeight: item.path === "/all-cv-analyses" ? 600 : 400,
                "&:hover": {
                  bgcolor:
                    item.path === "/all-cv-analyses" ? "rgba(25, 118, 210, 0.12)" : "#e0e0e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: item.path === "/all-cv-analyses" ? "#1976d2" : "#666" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {user && (
          <ListItem
            component={Link}
            to="/profile"
            sx={{
              mt: "auto",
              color: "#666",
              "&:hover": {
                bgcolor: "#e0e0e0",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#666" }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        )}
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
          {/* Display JSON data at the top */}
          {user?.userId && (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 4,
                borderRadius: 2,
                bgcolor: "#f8f9fa",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Raw Candidate Analyses Data:
              </Typography>
              <pre>{analysesJson}</pre>
            </Paper>
          )}

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
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
