import { Box, Container, Typography, TextField, Button, Paper, Tooltip } from "@mui/material"
import { ChangeEvent, useState, useCallback, DragEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  CloudUpload,
  Link as LinkIcon,
  FilePresent,
  Info,
  DragIndicator,
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useFileUpload } from "../hooks/use-file-upload"
import { Sidebar } from "@/components/Sidebar"

export const Home = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [vacancyUrl, setVacancyUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const { uploadFile, isUploading } = useFileUpload()
  const navigate = useNavigate()

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
    }
  }

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf") {
        setResumeFile(file)
      } else {
        alert("Please upload a PDF file")
      }
    }
  }, [])

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
            <div className="flex flex-col items-center justify-center pt-12 pb-20">
              <div className="max-w-3xl text-center mb-14 animate-slide-up">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
                  Supercharge Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                    Hiring Process
                  </span>
                </h1>
                <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                  AI-powered CV analysis that matches candidates to your job requirements with
                  unparalleled accuracy.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <span className="text-2xl font-bold">1</span>
                    </div>
                    <h3 className="font-bold mb-2">Upload Candidate's CV</h3>
                    <p className="text-sm text-foreground/70 text-center">
                      Drag & drop or select a PDF resume
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                      <span className="text-2xl font-bold">2</span>
                    </div>
                    <h3 className="font-bold mb-2">Add Job Posting URL</h3>
                    <p className="text-sm text-foreground/70 text-center">
                      Paste the link to the job vacancy
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="font-bold mb-2">Get Detailed Analysis</h3>
                    <p className="text-sm text-foreground/70 text-center">
                      Review skills match and recommendations
                    </p>
                  </div>
                </div>
              </div>

              <Paper
                elevation={3}
                className="w-full max-w-2xl p-0 border border-primary/10 animate-slide-left rounded-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary/80 to-secondary/80 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Start Your Analysis</h2>
                      <p className="text-white/80">
                        Upload a candidate's resume and provide the job posting URL to match them
                        perfectly
                      </p>
                    </div>
                    <DragIndicator sx={{ fontSize: 40, opacity: 0.7 }} />
                  </div>
                </div>

                <div className="p-8 space-y-8 bg-white">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side: File upload */}
                    <div
                      className={`md:w-1/2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : resumeFile
                            ? "border-success bg-success/5"
                            : "border-gray-300 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {resumeFile ? (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                            <FilePresent sx={{ color: "#16a34a", fontSize: 32 }} />
                          </div>
                          <h3 className="text-lg font-medium text-success mb-1 line-clamp-1">
                            {resumeFile.name}
                          </h3>
                          <p className="text-sm text-success/80 mb-3">File selected successfully</p>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setResumeFile(null)}
                            className="border-success/30 text-success hover:bg-success/5"
                          >
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <CloudUpload sx={{ color: "#4f46e5", fontSize: 32 }} />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Upload Resume</h3>
                          <p className="text-center text-gray-500 mb-4 text-sm">
                            Drag & drop a PDF file here or
                          </p>
                          <Button
                            variant="contained"
                            component="label"
                            className="bg-primary hover:bg-primary-hover text-white rounded-lg"
                          >
                            Browse Files
                            <input
                              type="file"
                              hidden
                              accept="application/pdf"
                              onChange={handleFileChange}
                              disabled={isUploading}
                            />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Right side: URL input */}
                    <div className="md:w-1/2 space-y-4">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium mr-2">Job Posting URL</h3>
                        <Tooltip title="Paste the full URL of the job vacancy to match the candidate's skills against the requirements">
                          <Info sx={{ color: "#6b7280", fontSize: 18 }} />
                        </Tooltip>
                      </div>

                      <TextField
                        variant="outlined"
                        placeholder="https://example.com/job-posting"
                        value={vacancyUrl}
                        onChange={handleUrlChange}
                        error={!!urlError}
                        helperText={urlError || "The URL should start with https://"}
                        fullWidth
                        className="form-input"
                        InputProps={{
                          startAdornment: <LinkIcon className="mr-2 text-primary" />,
                          className: "rounded-lg bg-background/50",
                        }}
                      />

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-1">How it works:</h4>
                        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                          <li>Upload a candidate's resume in PDF format</li>
                          <li>Add the URL where the job is posted</li>
                          <li>Our AI will match the candidate's skills to the job requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="contained"
                    onClick={uploadResume}
                    disabled={!resumeFile || !vacancyUrl || !!urlError || isUploading}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 rounded-lg transition-all duration-200 disabled:opacity-50 text-lg"
                    sx={{ textTransform: "none" }}
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
                        Processing CV Analysis...
                      </span>
                    ) : (
                      "Generate CV Analysis Report"
                    )}
                  </Button>

                  <p className="text-sm text-center text-gray-500">
                    Your data is secure and processed with our advanced AI algorithms
                  </p>
                </div>
              </Paper>
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
