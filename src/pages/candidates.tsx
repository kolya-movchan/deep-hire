import { FC } from "react"
import { Container, Grid, Avatar, Button } from "@mui/material"
import { Star, Email, Phone } from "@mui/icons-material"
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
      return "secondary"
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
      return "bg-primary/10 text-primary"
    case "intermediate":
      return "bg-secondary/10 text-secondary"
    case "expert":
      return "bg-accent/10 text-accent"
    default:
      return "bg-primary/5 text-primary"
  }
}

export const Candidates: FC = () => {
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
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          </div>

          <p className="text-foreground/70 mb-8 max-w-2xl">
            View and manage all candidates in your recruitment pipeline. Track status, skills, and
            contact information in one place.
          </p>

          <Grid container spacing={3}>
            {mockCandidates.map((candidate, index) => (
              <Grid item xs={12} md={6} key={candidate.id}>
                <div
                  className="card bg-white rounded-xl shadow-md border border-primary/5 h-full flex flex-col animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <Avatar
                        className={cn(
                          "w-12 h-12 mr-4 text-white font-bold",
                          `bg-${getStatusColor(candidate.status)}`
                        )}
                      >
                        {candidate.name.charAt(0)}
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-foreground/60">
                          {candidate.position} • {candidate.experience} years exp
                        </p>
                      </div>
                      <div className="ml-auto flex items-center">
                        <div className="flex items-center bg-warning/10 text-warning px-2 py-1 rounded-full">
                          <Star sx={{ fontSize: "1rem", marginRight: "2px" }} />
                          <span className="text-sm font-medium">{candidate.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span
                        className={cn(
                          "inline-block text-xs font-medium px-3 py-1 rounded-full",
                          `bg-${getStatusColor(candidate.status)}/10 text-${getStatusColor(candidate.status)}`
                        )}
                      >
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-foreground/70">
                        <Email fontSize="small" className="mr-2 text-primary/60" />
                        <span>{candidate.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-foreground/70">
                        <Phone fontSize="small" className="mr-2 text-primary/60" />
                        <span>{candidate.phone}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-foreground/80">Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => (
                          <span
                            key={skill.name}
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              getSkillLevelColor(skill.level)
                            )}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-primary/5 bg-primary/2">
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        className="text-primary border-primary/20 hover:bg-primary/5 rounded-lg text-sm flex-1"
                      >
                        View Profile
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg text-sm flex-1"
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </div>
  )
}
