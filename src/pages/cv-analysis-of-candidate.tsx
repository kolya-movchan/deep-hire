import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Stack,
  CircularProgress,
} from "@mui/material"
import { Link, useParams, Navigate } from "react-router-dom"
import {
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
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { FC } from "react"
import { useCvAnalysis } from "@/hooks/use-cv-analysis"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"

// Component for displaying match score
const MatchScoreCard: FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    return "destructive"
  }

  const getScoreText = (score: number): string => {
    if (score >= 80) return "Excellent match for the position"
    if (score >= 60) return "Good match with some gaps"
    return "Potential match with significant gaps"
  }

  return (
    <div
      className="card bg-white mb-6 rounded-xl overflow-hidden shadow-md animate-slide-up border-l-4 border-l-solid"
      style={{ borderLeftColor: `hsl(var(--${getScoreColor(score)}-hue), 65%, 48%)` }}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 flex items-center">
          <span className="text-foreground">Match Score</span>
        </h3>

        <div className="flex items-center gap-4 mb-3">
          <div
            className="text-5xl font-bold"
            style={{ color: `hsl(var(--${getScoreColor(score)}-hue), 65%, 48%)` }}
          >
            {score}%
          </div>
          <div className="flex-grow">
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${score}%`,
                  backgroundColor: `hsl(var(--${getScoreColor(score)}-hue), 65%, 48%)`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <p className="text-foreground/70">{getScoreText(score)}</p>
      </div>
    </div>
  )
}

// Component for loading sections
const SectionLoader: FC = () => (
  <div className="py-4 flex justify-center">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
  </div>
)

export const CvAnalysisOfCandidate: FC = () => {
  const dispatch = useDispatch()
  const { fileSlug } = useParams<{ fileSlug: string }>()

  // Remove file extension if present
  const cleanFileSlug = fileSlug ? fileSlug.replace(/\.[^.]+$/, "") : undefined

  const { user } = useSelector((state: RootState) => state.auth)

  const { candidateData, matchingData, isCandidateLoading, isMatchingLoading, error } =
    useCvAnalysis(cleanFileSlug, dispatch)

  // If no fileSlug is provided, redirect to home
  if (!fileSlug) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/cv-analyses" />

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
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Candidate Analysis</h1>
          </div>

          {isCandidateLoading && (
            <div className="card p-8 text-center animate-pulse">
              <h2 className="text-xl font-semibold mb-4">Analyzing candidate profile...</h2>
              <LinearProgress />
            </div>
          )}

          {error && (
            <div className="card p-8 text-center border border-destructive/20 bg-destructive/5">
              <h2 className="text-xl font-semibold text-destructive mb-4">{error}</h2>
              <Link to="/" className="text-primary hover:underline">
                Return to homepage
              </Link>
            </div>
          )}

          {!isCandidateLoading && !error && !candidateData && (
            <div className="card p-8 text-center border border-destructive/20 bg-destructive/5">
              <h2 className="text-xl font-semibold text-destructive mb-4">
                No data found for this CV
              </h2>
              <Link to="/" className="text-primary hover:underline">
                Return to homepage
              </Link>
            </div>
          )}

          {!isCandidateLoading && !error && candidateData && (
            <>
              {/* Profile Header */}
              <div className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <div className="flex flex-col">
                      <h2 className="text-3xl font-bold mb-1 text-foreground">
                        {candidateData.name}
                      </h2>
                      <h3 className="text-xl text-primary mb-4">{candidateData.title}</h3>
                      <p className="text-foreground/70 mb-6">{candidateData.summary}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                            <Email fontSize="small" />
                          </div>
                          <span className="text-sm text-foreground/70 truncate">
                            {candidateData.contact.email}
                          </span>
                        </div>
                        <div className="flex items-center overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                            <Phone fontSize="small" />
                          </div>
                          <span className="text-sm text-foreground/70 truncate">
                            {candidateData.contact.phone}
                          </span>
                        </div>
                        <div className="flex items-center overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                            <LocationOn fontSize="small" />
                          </div>
                          <span className="text-sm text-foreground/70 truncate">
                            {candidateData.contact.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={4} className="flex justify-center items-center">
                    <Avatar className="w-24 h-24 text-5xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                      {candidateData.name.charAt(0)}
                    </Avatar>
                  </Grid>
                </Grid>
              </div>

              {/* Match Score */}
              {isMatchingLoading ? (
                <div className="card bg-white mb-6 p-6 shadow-md rounded-xl animate-pulse border border-primary/10">
                  <h3 className="text-xl font-bold mb-4">Match Score</h3>
                  <div className="flex justify-center py-4">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  </div>
                </div>
              ) : (
                matchingData?.matchScore && <MatchScoreCard score={matchingData.matchScore} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="md:col-span-7">
                  {/* Experience */}
                  <div className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <Work />
                      </div>
                      <h3 className="text-xl font-bold">Professional Experience</h3>
                    </div>
                    <Divider className="mb-4" />

                    <div className="space-y-6">
                      {candidateData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className={cn(
                            "relative",
                            index !== candidateData.experience.length - 1 &&
                              "pb-6 border-l-2 border-primary/20 ml-4"
                          )}
                        >
                          <div className="relative">
                            {index !== candidateData.experience.length - 1 && (
                              <div className="absolute top-1 -left-[21px] w-4 h-4 rounded-full bg-primary"></div>
                            )}
                            <div
                              className={cn(
                                "pl-4",
                                index === candidateData.experience.length - 1 && "ml-4"
                              )}
                            >
                              <h4 className="text-lg font-bold">{exp.title}</h4>
                              <h5 className="text-primary font-medium">{exp.company}</h5>
                              <p className="text-sm text-foreground/50 mb-2">{exp.date}</p>

                              {exp.responsibilities && (
                                <ul className="space-y-1 mt-3">
                                  {exp.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle
                                        fontSize="small"
                                        className="text-primary mt-1 flex-shrink-0"
                                      />
                                      <span className="text-foreground/80">{resp}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div
                    className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mr-3">
                        <School />
                      </div>
                      <h3 className="text-xl font-bold">Education</h3>
                    </div>
                    <Divider className="mb-4" />

                    <div className="space-y-6">
                      {candidateData.education.map((edu, index) => (
                        <div
                          key={index}
                          className={cn(
                            "relative",
                            index !== candidateData.education.length - 1 &&
                              "pb-6 border-l-2 border-secondary/20 ml-4"
                          )}
                        >
                          <div className="relative">
                            {index !== candidateData.education.length - 1 && (
                              <div className="absolute top-1 -left-[21px] w-4 h-4 rounded-full bg-secondary"></div>
                            )}
                            <div
                              className={cn(
                                "pl-4",
                                index === candidateData.education.length - 1 && "ml-4"
                              )}
                            >
                              <h4 className="text-lg font-bold">{edu.degree}</h4>
                              <h5 className="text-secondary font-medium">{edu.field}</h5>
                              <p className="text-foreground/80">{edu.institution}</p>
                              <p className="text-sm text-foreground/50">{edu.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-5">
                  {/* Skills */}
                  <div
                    className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-3">
                        <Star />
                      </div>
                      <h3 className="text-xl font-bold">Skills</h3>
                    </div>
                    <Divider className="mb-4" />

                    <div className="flex flex-wrap gap-2">
                      {candidateData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div
                    className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <Build />
                      </div>
                      <h3 className="text-xl font-bold">Tools & Technologies</h3>
                    </div>
                    <Divider className="mb-4" />

                    <div className="flex flex-wrap gap-2">
                      {candidateData.tools.map((tool, index) => (
                        <span
                          key={index}
                          className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div
                    className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success mr-3">
                        <ThumbUp />
                      </div>
                      <h3 className="text-xl font-bold">Matched Skills</h3>
                    </div>
                    <Divider className="mb-4" />

                    {isMatchingLoading ? (
                      <SectionLoader />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {matchingData?.matchedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Unmatched Skills */}
                  <div
                    className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mr-3">
                        <ThumbDown />
                      </div>
                      <h3 className="text-xl font-bold">Missing Skills</h3>
                    </div>
                    <Divider className="mb-4" />

                    {isMatchingLoading ? (
                      <SectionLoader />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {matchingData?.unmatchedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Potential Risks */}
                  <div
                    className="card bg-white mb-6 p-6 shadow-md rounded-xl border border-primary/10 animate-slide-up"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning mr-3">
                        <Warning />
                      </div>
                      <h3 className="text-xl font-bold">Potential Risks</h3>
                    </div>
                    <Divider className="mb-4" />

                    {isMatchingLoading ? (
                      <SectionLoader />
                    ) : (
                      <ul className="space-y-2">
                        {matchingData?.potentialRisks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Warning fontSize="small" className="text-warning mt-1 flex-shrink-0" />
                            <span className="text-foreground/80">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Recommendation */}
                  <div
                    className="glass-effect p-6 mb-6 rounded-xl shadow-lg border border-primary/20 animate-slide-up"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <h3 className="text-xl font-bold mb-4">Final Recommendation</h3>

                    {isMatchingLoading ? (
                      <SectionLoader />
                    ) : (
                      <div className="space-y-3">
                        <p className="text-foreground/80">
                          Based on the candidate's profile and the job requirements:
                        </p>
                        <div
                          className={cn(
                            "text-lg font-bold p-3 rounded-lg text-center",
                            matchingData?.finalRecommendation.suitability === "Recommended"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {matchingData?.finalRecommendation.suitability}
                        </div>
                        <p className="text-foreground/70 text-sm mt-3">
                          {matchingData?.finalRecommendation.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Container>
      </main>
    </div>
  )
}
