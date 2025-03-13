import { FC } from "react"
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
  Avatar,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material"
import { Person, Login, WorkOutline, Settings, Assessment, Star } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

// Define types for our mocked data
type Skill = {
  name: string
  level: "beginner" | "intermediate" | "expert"
}

type Candidate = {
  id: string
  name: string
  email: string
  phone: string
  position: string
  experience: number
  skills: Skill[]
  rating: number
  status: "new" | "contacted" | "interviewing" | "hired" | "rejected"
}

// Mocked candidates data
const mockCandidates: Candidate[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    position: "Frontend Developer",
    experience: 5,
    skills: [
      { name: "React", level: "expert" },
      { name: "TypeScript", level: "expert" },
      { name: "CSS", level: "intermediate" },
    ],
    rating: 4.5,
    status: "interviewing",
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    position: "Backend Developer",
    experience: 7,
    skills: [
      { name: "Node.js", level: "expert" },
      { name: "Python", level: "intermediate" },
      { name: "MongoDB", level: "expert" },
    ],
    rating: 4.8,
    status: "contacted",
  },
  {
    id: "c3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 (555) 456-7890",
    position: "Full Stack Developer",
    experience: 3,
    skills: [
      { name: "React", level: "intermediate" },
      { name: "Node.js", level: "intermediate" },
      { name: "SQL", level: "beginner" },
    ],
    rating: 3.9,
    status: "new",
  },
  {
    id: "c4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 234-5678",
    position: "UX Designer",
    experience: 6,
    skills: [
      { name: "Figma", level: "expert" },
      { name: "Adobe XD", level: "expert" },
      { name: "UI/UX Research", level: "intermediate" },
    ],
    rating: 4.2,
    status: "hired",
  },
]

// Helper function to get color based on status
const getStatusColor = (status: Candidate["status"]): string => {
  switch (status) {
    case "new":
      return "#2196f3" // blue
    case "contacted":
      return "#ff9800" // orange
    case "interviewing":
      return "#9c27b0" // purple
    case "hired":
      return "#4caf50" // green
    case "rejected":
      return "#f44336" // red
    default:
      return "#757575" // grey
  }
}

// Helper function to get color based on skill level
const getSkillLevelColor = (level: Skill["level"]): string => {
  switch (level) {
    case "beginner":
      return "#90caf9" // light blue
    case "intermediate":
      return "#64b5f6" // medium blue
    case "expert":
      return "#1976d2" // dark blue
    default:
      return "#bbdefb" // very light blue
  }
}

export const Candidates: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  const sidebarItems = user
    ? [
        // { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
        { icon: <Assessment />, text: "CV Analyses", path: "/all-cv-analyses" },
        { icon: <Person />, text: "Candidates", path: "/candidates" },
        { icon: <Settings />, text: "Settings", path: "/settings" },
      ]
    : [
        { icon: <Login />, text: "Login", path: "/login" },
        // { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
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
                color: item.path === "/candidates" ? "#1976d2" : "#666",
                bgcolor: item.path === "/candidates" ? "rgba(25, 118, 210, 0.08)" : "transparent",
                fontWeight: item.path === "/candidates" ? 600 : 400,
                "&:hover": {
                  bgcolor: item.path === "/candidates" ? "rgba(25, 118, 210, 0.12)" : "#e0e0e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: item.path === "/candidates" ? "#1976d2" : "#666" }}>
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
          <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
            Candidates
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            View and manage all candidates in your pipeline
          </Typography>

          <Grid container spacing={3}>
            {mockCandidates.map((candidate) => (
              <Grid item xs={12} md={6} key={candidate.id}>
                <Card
                  elevation={2}
                  sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: getStatusColor(candidate.status), mr: 2 }}>
                        {candidate.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{candidate.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {candidate.position} • {candidate.experience} years exp
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                        <Star sx={{ color: "#FFD700", mr: 0.5 }} />
                        <Typography variant="body2">{candidate.rating}</Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(candidate.status),
                        color: "white",
                        mb: 2,
                      }}
                    />

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {candidate.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {candidate.phone}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Skills:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {candidate.skills.map((skill) => (
                        <Chip
                          key={skill.name}
                          label={skill.name}
                          size="small"
                          sx={{
                            bgcolor: getSkillLevelColor(skill.level),
                            color: "white",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button size="small" variant="outlined">
                      View Profile
                    </Button>
                    <Button size="small" variant="contained" sx={{ ml: 1 }}>
                      Contact
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
