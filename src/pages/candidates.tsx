import { FC } from "react"
import { Container, Grid, Avatar, Button, Paper, Tooltip, Chip } from "@mui/material"
import {
  Star,
  Email,
  Phone,
  Groups,
  StarBorder,
  StarHalf,
  CheckCircle,
  Work,
  School,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"

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
      return "primary"
    case "contacted":
      return "warning"
    case "interviewing":
      return "info"
    case "hired":
      return "success"
    case "rejected":
      return "destructive"
    default:
      return "muted"
  }
}

// Helper function to get color based on skill level
const getSkillLevelColor = (level: Skill["level"]): string => {
  switch (level) {
    case "beginner":
      return "bg-blue-100 text-blue-700"
    case "intermediate":
      return "bg-purple-100 text-purple-700"
    case "expert":
      return "bg-indigo-100 text-indigo-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

// Helper function for rating colors and stars display
const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return "#16a34a" // green-600
  if (rating >= 4.0) return "#65a30d" // lime-600
  if (rating >= 3.5) return "#ca8a04" // yellow-600
  if (rating >= 3.0) return "#ea580c" // orange-600
  return "#dc2626" // red-600
}

// Function to render stars based on rating
const renderStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`star-${i}`} sx={{ color: getRatingColor(rating) }} />)
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<StarHalf key="half-star" sx={{ color: getRatingColor(rating) }} />)
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarBorder key={`empty-${i}`} sx={{ color: getRatingColor(rating) }} />)
  }

  return stars
}

export const Candidates: FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath={window.location.pathname} />

      <main className="flex-grow px-4 py-8 md:px-8">
        <Container maxWidth="lg" className="animate-fade-in">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Groups sx={{ color: "#2563eb", fontSize: 28 }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
              <p className="text-foreground/70 max-w-2xl">
                View and manage all candidates in your recruitment pipeline
              </p>
            </div>
          </div>

          <Grid container spacing={3}>
            {mockCandidates.map((candidate, index) => (
              <Grid item xs={12} md={6} key={candidate.id}>
                <Paper
                  elevation={2}
                  className="h-full flex flex-col animate-slide-up overflow-hidden rounded-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100">
                    <div className="flex items-center">
                      <Avatar
                        sx={{
                          bgcolor: getRatingColor(candidate.rating),
                          width: 56,
                          height: 56,
                          boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
                        }}
                        className="mr-4 text-white font-bold"
                      >
                        {candidate.name.charAt(0)}
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{candidate.name}</h3>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Chip
                            size="small"
                            label={candidate.position}
                            sx={{ backgroundColor: "#e0e7ff", color: "#4338ca", fontWeight: 500 }}
                          />
                          <Tooltip title="Years of experience">
                            <Chip
                              size="small"
                              icon={<Work sx={{ fontSize: 16, color: "#6366f1" }} />}
                              label={`${candidate.experience} years`}
                              sx={{ backgroundColor: "#ede9fe", color: "#6d28d9", fontWeight: 500 }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <Chip
                        label={candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        sx={{
                          backgroundColor: `var(--${getStatusColor(candidate.status)}-light)`,
                          color: `var(--${getStatusColor(candidate.status)}-dark)`,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      />

                      <Tooltip title={`Rating: ${candidate.rating}/5`}>
                        <div className="flex items-center">{renderStars(candidate.rating)}</div>
                      </Tooltip>
                    </div>

                    <div className="space-y-3 mb-5 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <Email fontSize="small" sx={{ color: "#dc2626" }} />
                        </div>
                        <span className="text-gray-700">{candidate.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Phone fontSize="small" sx={{ color: "#16a34a" }} />
                        </div>
                        <span className="text-gray-700">{candidate.phone}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-3">
                        <School sx={{ color: "#4f46e5", marginRight: "8px" }} />
                        <h4 className="font-semibold text-gray-700">Skills & Expertise</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <Chip
                            key={skill.name}
                            label={skill.name}
                            size="small"
                            className={cn(getSkillLevelColor(skill.level))}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                      <Button
                        size="medium"
                        variant="outlined"
                        className="text-primary border-primary/20 rounded-lg flex-1"
                        sx={{ textTransform: "none" }}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="medium"
                        variant="contained"
                        className="bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-primary/90 hover:to-indigo-700 rounded-lg flex-1"
                        sx={{ textTransform: "none" }}
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </div>
  )
}
