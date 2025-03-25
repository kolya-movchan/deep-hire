import { Container, TextField, Button, Paper, Tooltip } from "@mui/material"
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
        navigate(`/cv-analysis-of-candidate`)
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
            {/* Hero Section - Centered for eye tracking */}
            <div className="flex flex-col items-center justify-center py-2 min-h-screen">
              <div className="text-center mb-2 animate-fade-in">
                <h1 className="text-2xl md:text-4xl font-bold mb-6">
                  Supercharge Your{" "}
                  <span className=" bg-gradient-to-r from-primary to-secondary">
                    Hiring Process
                  </span>
                </h1>
                <p className="text-lg text-foreground/80 mb-8 mx-auto">
                  AI-powered CV analysis that matches candidates to your job requirements with
                  unparalleled accuracy.
                </p>
              </div>

              <Paper
                elevation={2}
                className="w-[65%] max-w-5xl border mb-10 border-primary/10 animate-fade-in rounded-xl overflow-hidden shadow-lg"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-primary">Start Your Analysis</h2>
                      <p className="text-sm text-foreground/70">
                        Upload a candidate's resume and provide the job posting URL
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <DragIndicator sx={{ fontSize: 32, opacity: 0.5, color: "#4f46e5" }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left side: File upload */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : resumeFile
                            ? "border-success bg-success/5"
                            : "border-gray-200 hover:border-primary/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {resumeFile ? (
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-success/10 flex items-center justify-center">
                            <FilePresent sx={{ color: "#16a34a", fontSize: 24 }} />
                          </div>
                          <h3 className="text-base font-medium text-success mb-1 line-clamp-1">
                            {resumeFile.name}
                          </h3>
                          <p className="text-xs text-success/80 mb-2">File selected successfully</p>
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
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                            <CloudUpload sx={{ color: "#4f46e5", fontSize: 24 }} />
                          </div>
                          <h3 className="text-base font-medium mb-1">Upload Resume</h3>
                          <p className="text-center text-gray-500 mb-2 text-xs">
                            Drag & drop a PDF file here or
                          </p>
                          <Button
                            variant="contained"
                            component="label"
                            size="small"
                            className="bg-primary text-white rounded-lg"
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
                    <div className="space-y-3">
                      <div className="flex items-center mb-1">
                        <h3 className="text-base font-medium mr-2">Job Posting URL</h3>
                        <Tooltip title="Paste the full URL of the job vacancy to match the candidate's skills against the requirements">
                          <Info sx={{ color: "#6b7280", fontSize: 16 }} />
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
                          className: "rounded-lg",
                        }}
                        size="small"
                      />

                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                        <h4 className="text-xs font-medium text-blue-800 mb-1">How it works:</h4>
                        <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                          <li>Upload a candidate's resume in PDF format</li>
                          <li>Add the URL where the job is posted</li>
                          <li>Our AI will match the candidate's skills to the job requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center flex-col items-center">
                    <Button
                      variant="contained"
                      onClick={uploadResume}
                      disabled={!resumeFile || !vacancyUrl || !!urlError || isUploading}
                      className="w-fit bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-2 rounded-lg transition-all duration-200 disabled:opacity-50 text-base"
                      sx={{ textTransform: "none" }}
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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

                    <p className="text-xs text-center text-gray-500 mt-2">
                      Your data is secure and processed with our advanced AI algorithms
                    </p>
                  </div>
                </div>
              </Paper>
            </div>

            {/* Features Section */}
            <div className="py-16">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Choose Our <span className="text-primary">AI-Powered</span> Solution
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    Get comprehensive analysis within seconds, saving hours of manual resume
                    screening time.
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
            </div>

            {/* Testimonials Section */}
            <div className="py-16 border-t border-primary/10">
              <h2 className="text-3xl font-bold text-center mb-12">
                What Our <span className="text-primary">Clients</span> Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md border border-primary/10 animate-slide-up">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-primary">S</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Sarah Johnson</h4>
                      <p className="text-sm text-foreground/70">HR Director, TechCorp</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80 italic">
                    "This tool has revolutionized our hiring process. We've reduced our time-to-hire
                    by 40% while finding better matches for our technical positions."
                  </p>
                </div>

                <div
                  className="bg-white p-6 rounded-xl shadow-md border border-primary/10 animate-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-green-600">M</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Michael Chen</h4>
                      <p className="text-sm text-foreground/70">Talent Acquisition, FinanceHub</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80 italic">
                    "The skill matching accuracy is impressive. We've been able to identify
                    candidates with the right technical skills that our manual screening would have
                    missed."
                  </p>
                </div>

                <div
                  className="bg-white p-6 rounded-xl shadow-md border border-primary/10 animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-purple-600">A</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Alicia Rodriguez</h4>
                      <p className="text-sm text-foreground/70">Recruiting Manager, StartupX</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80 italic">
                    "As a startup, we need to move fast but hire smart. This tool gives us
                    enterprise-level recruiting capabilities at a fraction of the cost."
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 border-t border-primary/10">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-10">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Trusted by <span className="text-primary">Hiring Teams</span> Worldwide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="animate-slide-up">
                    <div className="text-4xl font-bold text-primary mb-2">93%</div>
                    <p className="text-foreground/70">Improvement in candidate matching accuracy</p>
                  </div>
                  <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <div className="text-4xl font-bold text-secondary mb-2">75%</div>
                    <p className="text-foreground/70">Reduction in screening time</p>
                  </div>
                  <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    <div className="text-4xl font-bold text-accent mb-2">10,000+</div>
                    <p className="text-foreground/70">CVs analyzed monthly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 border-t border-primary/10 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hiring Process?</h2>
              <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Start analyzing CVs today and find the perfect candidates for your open positions.
              </p>
              <Button
                variant="contained"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-8 rounded-lg transition-all duration-200 text-lg"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Get Started Now
              </Button>
            </div>
          </Container>
        </div>
      </main>
    </div>
  )
}
