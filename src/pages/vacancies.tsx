import { FC, useState } from "react"
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
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material"
import {
  Person,
  Login,
  WorkOutline,
  Settings,
  Assessment,
  LocationOn,
  AccessTime,
  MonetizationOn,
  Bookmark,
  BookmarkBorder,
  FilterList,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

// Define types for our mocked data
type JobType = "full-time" | "part-time" | "contract" | "internship" | "remote"

type Vacancy = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  requirements: string[]
  jobType: JobType
  postedDate: string
  applicantsCount: number
  isFavorite: boolean
}

// Mocked vacancies data
const mockVacancies: Vacancy[] = [
  {
    id: "v1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA (Remote)",
    salary: "$120,000 - $150,000",
    description:
      "We are looking for an experienced Frontend Developer to join our team and help build our next-generation web applications.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with state management libraries",
      "Understanding of web accessibility standards",
    ],
    jobType: "full-time",
    postedDate: "2023-06-15",
    applicantsCount: 47,
    isFavorite: true,
  },
  {
    id: "v2",
    title: "Backend Engineer",
    company: "DataSystems Ltd.",
    location: "New York, NY",
    salary: "$110,000 - $140,000",
    description:
      "Join our backend team to develop scalable APIs and microservices for our growing platform.",
    requirements: [
      "3+ years of experience with Node.js",
      "Knowledge of SQL and NoSQL databases",
      "Experience with cloud services (AWS/Azure/GCP)",
      "Understanding of CI/CD pipelines",
    ],
    jobType: "full-time",
    postedDate: "2023-06-20",
    applicantsCount: 32,
    isFavorite: false,
  },
  {
    id: "v3",
    title: "UX/UI Designer",
    company: "CreativeMinds Agency",
    location: "Remote",
    salary: "$90,000 - $120,000",
    description:
      "Design beautiful and intuitive user interfaces for our clients' web and mobile applications.",
    requirements: [
      "Portfolio demonstrating UI/UX skills",
      "Experience with Figma and Adobe Creative Suite",
      "Understanding of user research and testing",
      "Knowledge of design systems",
    ],
    jobType: "contract",
    postedDate: "2023-06-25",
    applicantsCount: 18,
    isFavorite: false,
  },
  {
    id: "v4",
    title: "DevOps Engineer",
    company: "CloudScale Solutions",
    location: "Austin, TX (Hybrid)",
    salary: "$130,000 - $160,000",
    description: "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: [
      "Experience with Kubernetes and Docker",
      "Knowledge of infrastructure as code (Terraform)",
      "Experience with monitoring and logging tools",
      "Understanding of security best practices",
    ],
    jobType: "full-time",
    postedDate: "2023-06-18",
    applicantsCount: 24,
    isFavorite: true,
  },
]

// Helper function to get color based on job type
const getJobTypeColor = (jobType: JobType): string => {
  switch (jobType) {
    case "full-time":
      return "#4caf50" // green
    case "part-time":
      return "#2196f3" // blue
    case "contract":
      return "#ff9800" // orange
    case "internship":
      return "#9c27b0" // purple
    case "remote":
      return "#00bcd4" // cyan
    default:
      return "#757575" // grey
  }
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "Posted yesterday"
  } else if (diffDays < 7) {
    return `Posted ${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `Posted ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else {
    return `Posted on ${date.toLocaleDateString()}`
  }
}

export const Vacancies: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [vacancies, setVacancies] = useState<Vacancy[]>(mockVacancies)

  // Toggle favorite status
  const toggleFavorite = (id: string): void => {
    setVacancies((prevVacancies) =>
      prevVacancies.map((vacancy) =>
        vacancy.id === id ? { ...vacancy, isFavorite: !vacancy.isFavorite } : vacancy
      )
    )
  }

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
                color: item.path === "/vacancies" ? "#1976d2" : "#666",
                bgcolor: item.path === "/vacancies" ? "rgba(25, 118, 210, 0.08)" : "transparent",
                fontWeight: item.path === "/vacancies" ? 600 : 400,
                "&:hover": {
                  bgcolor: item.path === "/vacancies" ? "rgba(25, 118, 210, 0.12)" : "#e0e0e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: item.path === "/vacancies" ? "#1976d2" : "#666" }}>
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
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                Job Vacancies
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Find the perfect job opportunity for your skills
              </Typography>
            </Box>
            <Tooltip title="Filter jobs">
              <IconButton>
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={3}>
            {vacancies.map((vacancy) => (
              <Grid item xs={12} key={vacancy.id}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {vacancy.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          {vacancy.company}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => toggleFavorite(vacancy.id)}
                        sx={{ color: vacancy.isFavorite ? "#f50057" : "inherit" }}
                      >
                        {vacancy.isFavorite ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, mt: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2">{vacancy.location}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MonetizationOn
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2">{vacancy.salary}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2">{formatDate(vacancy.postedDate)}</Typography>
                      </Box>
                      <Chip
                        label={vacancy.jobType.replace("-", " ")}
                        size="small"
                        sx={{
                          bgcolor: getJobTypeColor(vacancy.jobType),
                          color: "white",
                        }}
                      />
                    </Box>

                    <Typography variant="body1" paragraph>
                      {vacancy.description}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Requirements:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                      {vacancy.requirements.map((req, index) => (
                        <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                          {req}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Badge badgeContent={vacancy.applicantsCount} color="primary">
                      <Typography variant="body2" color="text.secondary">
                        Applicants
                      </Typography>
                    </Badge>
                    <Box>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        Save for Later
                      </Button>
                      <Button size="small" variant="contained">
                        Apply Now
                      </Button>
                    </Box>
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
