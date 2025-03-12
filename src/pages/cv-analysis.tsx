import {
  Box,
  Container,
  Typography,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Stack,
} from "@mui/material"
import { Link, useParams, Navigate } from "react-router-dom"
import {
  Person,
  Login,
  WorkOutline,
  Settings,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  CheckCircle,
  Build,
  Star,
  Warning,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { FC } from "react"
import { useCvAnalysis } from "@/hooks/use-cv-analysis"

// Component for displaying match score
const MatchScoreCard: FC<{ score: number }> = ({ score }) => {
  console.log("[MatchScoreCard] Rendering with score:", score)

  const getScoreColor = (score: number): string => {
    console.log("[MatchScoreCard] Calculating color for score:", score)
    if (score >= 80) {
      console.log("[MatchScoreCard] Score >= 80, returning green")
      return "#4caf50"
    }
    if (score >= 60) {
      console.log("[MatchScoreCard] Score >= 60, returning orange")
      return "#ff9800"
    }
    console.log("[MatchScoreCard] Score < 60, returning red")
    return "#f44336"
  }

  return (
    <Card elevation={3} sx={{ mb: 3, borderLeft: `6px solid ${getScoreColor(score)}` }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Match Score
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: getScoreColor(score), mr: 2 }}>
            {score}%
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getScoreColor(score),
                },
              }}
            />
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {score >= 80
            ? "Excellent match for the position"
            : score >= 60
              ? "Good match with some gaps"
              : "Potential match with significant gaps"}
        </Typography>
      </CardContent>
    </Card>
  )
}

export const CvAnalysis: FC = () => {
  console.log("[CvAnalysis] Component rendering")
  const { fileSlug } = useParams<{ fileSlug: string }>()
  console.log("[CvAnalysis] fileSlug from params:", fileSlug)

  // Remove file extension if present
  const cleanFileSlug = fileSlug ? fileSlug.replace(/\.[^.]+$/, "") : undefined
  console.log("[CvAnalysis] Cleaned fileSlug:", cleanFileSlug)

  const { user } = useSelector((state: RootState) => state.auth)
  console.log("[CvAnalysis] Current user:", user)

  const { candidateData, matchingData, isLoading, error } = useCvAnalysis(cleanFileSlug)
  console.log("[CvAnalysis] Hook results:", {
    candidateData: candidateData ? "Present" : "Null",
    matchingData: matchingData ? "Present" : "Null",
    isLoading,
    error,
  })

  // If no fileSlug is provided, redirect to home
  if (!fileSlug) {
    console.log("[CvAnalysis] No fileSlug provided, redirecting to home")
    return <Navigate to="/" replace />
  }

  const sidebarItems = user
    ? [
        { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
        { icon: <Person />, text: "Candidates", path: "/candidates" },
        { icon: <Settings />, text: "Settings", path: "/settings" },
      ]
    : [{ icon: <Login />, text: "Login", path: "/login" }]
  console.log("[CvAnalysis] Sidebar items:", sidebarItems)

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
                color: "#666",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#666" }}>{item.icon}</ListItemIcon>
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
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
            Candidate Analysis
          </Typography>

          {isLoading ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Loading candidate data...
              </Typography>
              <LinearProgress />
            </Paper>
          ) : error ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <Link to="/">Return to homepage</Link>
              </Typography>
            </Paper>
          ) : !candidateData || !matchingData ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="error">
                No data found for this CV
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <Link to="/">Return to homepage</Link>
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Profile Header */}
              <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h4" fontWeight="bold">
                      {candidateData.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      {candidateData.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {candidateData.summary}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                          <Email color="action" sx={{ mr: 1, flexShrink: 0 }} />
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                          >
                            {candidateData.contact.email}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                          <Phone color="action" sx={{ mr: 1, flexShrink: 0 }} />
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                          >
                            {candidateData.contact.phone}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                          <LocationOn color="action" sx={{ mr: 1, flexShrink: 0 }} />
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                          >
                            {candidateData.contact.location}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "#1976d2",
                        fontSize: "3rem",
                      }}
                    >
                      {candidateData.name.charAt(0)}
                    </Avatar>
                  </Grid>
                </Grid>
              </Paper>

              {/* Match Score */}
              {matchingData.matchScore && <MatchScoreCard score={matchingData.matchScore} />}

              <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={7}>
                  {/* Experience */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <Work sx={{ mr: 1, color: "#1976d2" }} />
                      Professional Experience
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {candidateData.experience.map((exp, index) => (
                      <Box
                        key={index}
                        sx={{ mb: index < candidateData.experience.length - 1 ? 3 : 0 }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {exp.title}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          {exp.company}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {exp.date}
                        </Typography>

                        {exp.responsibilities && (
                          <List dense sx={{ pl: 2 }}>
                            {exp.responsibilities.map((resp, idx) => (
                              <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                  <CheckCircle fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={resp} />
                              </ListItem>
                            ))}
                          </List>
                        )}

                        {index < candidateData.experience.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}
                  </Paper>

                  {/* Education */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <School sx={{ mr: 1, color: "#1976d2" }} />
                      Education
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {candidateData.education.map((edu, index) => (
                      <Box
                        key={index}
                        sx={{ mb: index < candidateData.education.length - 1 ? 3 : 0 }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {edu.degree}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          {edu.field}
                        </Typography>
                        <Typography variant="body1">{edu.institution}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {edu.date}
                        </Typography>

                        {index < candidateData.education.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={5}>
                  {/* Skills */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <Star sx={{ mr: 1, color: "#1976d2" }} />
                      Skills
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {candidateData.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          sx={{
                            m: 0.5,
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            fontWeight: "medium",
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>

                  {/* Tools */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <Build sx={{ mr: 1, color: "#1976d2" }} />
                      Tools & Technologies
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {candidateData.tools.map((tool, index) => (
                        <Chip
                          key={index}
                          label={tool}
                          sx={{
                            m: 0.5,
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: "medium",
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>

                  {/* Matched Skills */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <ThumbUp sx={{ mr: 1, color: "#4caf50" }} />
                      Matched Skills
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {matchingData.matchedSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          sx={{
                            m: 0.5,
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: "medium",
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>

                  {/* Unmatched Skills */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <ThumbDown sx={{ mr: 1, color: "#f44336" }} />
                      Missing Skills
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {matchingData.unmatchedSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          sx={{
                            m: 0.5,
                            bgcolor: "#ffebee",
                            color: "#d32f2f",
                            fontWeight: "medium",
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>

                  {/* Potential Risks */}
                  <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                      <Warning sx={{ mr: 1, color: "#ff9800" }} />
                      Potential Risks
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List dense>
                      {matchingData.potentialRisks.map((risk, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <Warning fontSize="small" color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={risk} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>

                  {/* Recommendation */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Recommendation
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Based on the candidate's profile and the job requirements:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          matchingData.finalRecommendation.suitability === "Recommended"
                            ? "#2e7d32"
                            : "#d32f2f",
                        fontWeight: "bold",
                      }}
                    >
                      {matchingData.finalRecommendation.suitability}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {matchingData.finalRecommendation.reason}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Box>
  )
}
