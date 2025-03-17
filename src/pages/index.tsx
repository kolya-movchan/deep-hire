import { Box, Container, Typography, TextField, Button } from "@mui/material"
import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CloudUpload, Link as LinkIcon } from "@mui/icons-material"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useFileUpload } from "../hooks/use-file-upload"
import { Sidebar } from "@/components/Sidebar"

export const Home = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [vacancyUrl, setVacancyUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const { user } = useSelector((state: RootState) => state.auth)
  const { uploadFile, isUploading } = useFileUpload()
  const navigate = useNavigate()

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
    }
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVacancyUrl(url)
    if (url && !url.startsWith("https://")) {
      setUrlError("URL must start with https://")
    } else {
      setUrlError("")
    }
  }

  const uploadResume = async () => {
    if (vacancyUrl && resumeFile) {
      try {
        const { fileUrl, fileSlug } = (await uploadFile(resumeFile, vacancyUrl, user?.userId)) || {}
        const cleanFileSlug = fileSlug ? fileSlug.replace(/\.[^.]+$/, "") : undefined
        console.log("Uploaded file to:", fileUrl)
        console.log("File SLUG ===>", cleanFileSlug)

        // Clear the inputs
        setResumeFile(null)
        setVacancyUrl("")

        // Redirect to analysis page
        navigate(`/cv-analysis/${cleanFileSlug}`)
      } catch (err) {
        console.error("Upload failed:", err)
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activePath={location.pathname} />

      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
          <Container maxWidth="lg" className="py-8 px-4">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center min-h-[calc(100vh-4rem)]">
              <div className="max-w-xl animate-slide-right">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                  Supercharge Your <span className="text-secondary">Hiring Process</span>
                </h1>
                <p className="text-lg text-foreground/80 mb-6">
                  AI-powered CV analysis that matches candidates to your job requirements with
                  unparalleled accuracy.
                </p>
                <div className="flex gap-4 mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <p className="ml-3 text-sm text-foreground/70">Upload CV</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <p className="ml-3 text-sm text-foreground/70">Add Job URL</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <p className="ml-3 text-sm text-foreground/70">Get Analysis</p>
                  </div>
                </div>
              </div>

              <div className="card glass-effect backdrop-blur-md w-full max-w-md p-8 border border-primary/10 animate-slide-left">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Start Your Analysis</h2>
                  <p className="text-foreground/60 text-sm">
                    Upload a resume and provide a job posting URL
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUpload />}
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground p-4 rounded-lg transition-all duration-200"
                    >
                      {resumeFile ? resumeFile.name : "Upload Resume (PDF)"}
                      <input
                        type="file"
                        hidden
                        accept="application/pdf"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </Button>
                    {resumeFile && (
                      <p className="text-xs text-success mt-2 animate-fade-in">✓ File selected</p>
                    )}
                  </div>

                  <div>
                    <TextField
                      label="Job Vacancy URL"
                      variant="outlined"
                      value={vacancyUrl}
                      onChange={handleUrlChange}
                      error={!!urlError}
                      helperText={urlError || "Paste the URL of the job posting"}
                      fullWidth
                      className="form-input"
                      InputProps={{
                        startAdornment: <LinkIcon className="mr-2 text-foreground/50" />,
                        className: "rounded-lg bg-background/50 backdrop-blur-sm",
                      }}
                    />
                  </div>

                  <Button
                    variant="contained"
                    onClick={uploadResume}
                    disabled={!resumeFile || !vacancyUrl || !!urlError || isUploading}
                    className="w-full bg-accent hover:bg-accent-hover text-accent-foreground p-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Analyze Resume"
                    )}
                  </Button>

                  <p className="text-xs text-center text-foreground/50">
                    Your data is secure and processed with our advanced AI algorithms
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className="card p-6 bg-primary/5 border border-primary/10 rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
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
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Accurate Matching</h3>
                <p className="text-foreground/70">
                  Our AI analyzes resumes against job requirements with precision, highlighting
                  matches and gaps.
                </p>
              </div>

              <div
                className="card p-6 bg-secondary/5 border border-secondary/10 rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4">
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
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Results</h3>
                <p className="text-foreground/70">
                  Get comprehensive analysis within seconds, saving hours of manual resume screening
                  time.
                </p>
              </div>

              <div
                className="card p-6 bg-accent/5 border border-accent/10 rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
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
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Insights</h3>
                <p className="text-foreground/70">
                  Get recommendations, risk assessments, and detailed breakdowns of candidate
                  qualifications.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  )
}
