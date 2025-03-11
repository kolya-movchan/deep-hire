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
  Rating,
  LinearProgress,
  Stack,
} from "@mui/material"
import { Link } from "react-router-dom"
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
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { FC, useEffect, useState } from "react"

// Types for candidate data
interface Contact {
  phone: string
  email: string
  location: string
}

interface Education {
  degree: string
  field: string
  institution: string
  date: string
}

interface Experience {
  title: string
  company: string
  date: string
  responsibilities?: string[]
}

interface CandidateData {
  id: string
  userId: string
  name: string
  title: string
  contact: Contact
  summary: string
  education: Education[]
  experience: Experience[]
  skills: string[]
  tools: string[]
  matchScore?: number
}

// Mock data for demonstration
const mockCandidateData: CandidateData = {
  id: "11390d87-bcec-4831-add8-ed88c71fd0b8-Viktoriia Mkrtchian QA CV.pdf",
  userId: "anon-v1.1.3169+d01562dc2",
  name: "Viktoriia Mkrtchian",
  title: "QA Engineer",
  contact: {
    phone: "+38-066-210-6339",
    email: "viktoriia.mkrtchian.work@gmail.com",
    location: "Ukraine (remote)",
  },
  summary:
    "QA Engineer with over 2.5 years of experience and a comprehensive understanding of software development and QA lifecycle processes. Results-oriented team player with excellent organizational and communication skills.",
  education: [
    {
      degree: "Master's Degree",
      field: 'Program Subject Area "Law"',
      institution: "Yaroslav Mudryi National Law University, Ukraine",
      date: "September 2017 - March 2019",
    },
    {
      degree: "Bachelor's Degree",
      field: 'Program Subject Area "Law"',
      institution: "Yaroslav Mudryi National Law University, Ukraine",
      date: "September 2013 - August 2017",
    },
  ],
  experience: [
    {
      title: "QA Engineer",
      company: "You are launched",
      date: "April 2024 - nowadays",
      responsibilities: [
        "Testing of mobile (iOS, Android) and web applications",
        "Creating and maintaining test documentation",
        "Participating in Scrum ceremonies",
        "Reporting defects and failures",
        "Executing various types of testing",
        "Reporting verification results to stakeholders",
        "Checking event tracking in Mixpanel and Firebase",
      ],
    },
    {
      title: "QA Engineer",
      company: "Large international outsourcing company (name under NDA)",
      date: "November 2021 - November 2023",
      responsibilities: [
        "Performing testing on web platforms and mobile applications (Android)",
        "Creating and maintaining test cases, test suites, and checklists",
        "Reporting defects and failures",
        "Conducting various types of testing",
        "Executing API testing using Postman",
        "Executing basic SQL queries",
      ],
    },
    {
      title: "Lawyer",
      company: "Ukrainian companies",
      date: "May 2019 - September 2021",
    },
  ],
  skills: ["Understanding of Client/Server Architecture", "Understanding of SDLC/STLC"],
  tools: [
    "Jira",
    "Confluence",
    "TestRail",
    "Postman",
    "Swagger",
    "DevTools",
    "Android Studio",
    "Lambda Test",
    "Mixpanel",
    "Firebase",
    "DBeaver",
    "SQL",
  ],
  matchScore: 78,
}

// Component for displaying match score
const MatchScoreCard: FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "#4caf50"
    if (score >= 60) return "#ff9800"
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
  const { user } = useSelector((state: RootState) => state.auth)
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null)

  // Simulate fetching data
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    setTimeout(() => {
      setCandidateData(mockCandidateData)
    }, 1000)
  }, [])

  const sidebarItems = user
    ? [
        { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
        { icon: <Person />, text: "Candidates", path: "/candidates" },
        { icon: <Settings />, text: "Settings", path: "/settings" },
      ]
    : [{ icon: <Login />, text: "Login", path: "/login" }]

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

          {!candidateData ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Loading candidate data...
              </Typography>
              <LinearProgress />
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
              {candidateData.matchScore && <MatchScoreCard score={candidateData.matchScore} />}

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
                      Based on the candidate's profile and the job requirements, we recommend:
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: "bold" }}>
                      Proceed to Interview
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      The candidate has strong QA experience with relevant tools and technologies.
                      Consider focusing on their practical experience with mobile testing and API
                      testing during the interview.
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
