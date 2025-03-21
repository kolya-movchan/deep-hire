import React, { useState, useEffect, useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { configAmplify } from "../utils/config-amplify"
import { register, confirmRegistration, logIn } from "../api/rest/auth"
import { TextField, IconButton, Container, Button, Alert } from "@mui/material"
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material"
import { passwordRequirements } from "@/mocks/data/password-requirements"
import { useNavigate } from "react-router-dom"
import { AppDispatch } from "@/store"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "@/store/auth-slice"
import { useNavigateLoggedInUser } from "@/helpers/navigate-user"
import { RootState } from "@/store"
import { createUser } from "@/api/graphql/api"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"

interface RegisterForm {
  fullName: string
  email: string
  password: string
}

export const Register = () => {
  configAmplify()

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const requirementsRef = useRef<HTMLDivElement>(null)

  // State declarations
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
  })
  const [confirmationCode, setConfirmationCode] = useState<string>("")
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRequirements, setShowRequirements] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // Navigation hook for logged in users
  useNavigateLoggedInUser(navigate)

  // Memoized values
  const requirements = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.regex.test(formData.password),
    }))
  }, [formData.password])

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "password") {
      setShowRequirements(true)
    }

    if (error) setError("")
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const allRequirementsMet = requirements.every((req) => req.met)
    if (!allRequirementsMet) {
      setShowRequirements(true)
      setError("Please meet all password requirements")
      return
    }

    setLoading(true)
    try {
      await register({
        ...formData,
        username: formData.email,
      })
      setIsConfirming(true)
    } catch (error: unknown) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!confirmationCode.trim()) {
      setError("Please enter the confirmation code")
      return
    }

    setLoading(true)
    setError("")

    try {
      await confirmRegistration(formData.email, confirmationCode)
      await logIn(formData.email, formData.password)
      await createUser(formData.email, formData.fullName)
      dispatch(checkAuth())
      navigate("/")
      setIsConfirming(false)
    } catch (error: unknown) {
      console.error("Error confirming user:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to confirm account. Please check your code and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  // Side effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        requirementsRef.current &&
        !requirementsRef.current.contains(event.target as Node) &&
        !formData.password
      ) {
        setShowRequirements(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [formData.password])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/login" />

      <main className="flex-grow flex items-center justify-center p-4">
        <Container maxWidth="sm" className="animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-foreground/70 mb-6">
                JoinDeepHire to analyze candidate resumes and make better hiring decisions
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="card glass-effect backdrop-blur-md p-8 border border-primary/10 shadow-lg rounded-xl">
              {!isConfirming ? (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-foreground/80 mb-1.5"
                    >
                      Full Name
                    </label>
                    <TextField
                      id="fullName"
                      fullWidth
                      name="fullName"
                      placeholder="John Smith"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      className="form-input"
                      InputProps={{
                        className: "rounded-lg bg-background/50 backdrop-blur-sm",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground/80 mb-1.5"
                    >
                      Email Address
                    </label>
                    <TextField
                      id="email"
                      fullWidth
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      className="form-input"
                      InputProps={{
                        className: "rounded-lg bg-background/50 backdrop-blur-sm",
                      }}
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-foreground/80 mb-1.5"
                    >
                      Password
                    </label>
                    <TextField
                      id="password"
                      fullWidth
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      className="form-input"
                      onFocus={() => setShowRequirements(true)}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            className="text-foreground/50"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                        className: "rounded-lg bg-background/50 backdrop-blur-sm",
                      }}
                    />

                    {showRequirements && (
                      <div
                        ref={requirementsRef}
                        className="mt-2 p-4 bg-background rounded-lg border border-primary/10 shadow-md animate-fade-in"
                      >
                        <h4 className="text-sm font-medium mb-2 text-foreground">
                          Password Requirements:
                        </h4>
                        <div className="space-y-1.5">
                          {requirements.map((req, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex items-start text-sm",
                                req.met ? "text-success" : "text-foreground/60"
                              )}
                            >
                              <div className="mt-0.5 mr-2 flex-shrink-0">
                                {req.met ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-foreground/30"></div>
                                )}
                              </div>
                              <span>{req.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className="bg-secondary hover:bg-secondary-hover text-secondary-foreground p-3 rounded-lg transition-all duration-200 disabled:opacity-70 mt-4"
                  >
                    {loading ? (
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
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-sm text-foreground/70">
                      Already have an account?{" "}
                      <Link to="/login" className="text-secondary font-medium hover:underline">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <Alert
                      severity="success"
                      className="bg-success/10 text-success border border-success/20 rounded-lg"
                    >
                      Account created! Please check your email for the confirmation code.
                    </Alert>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmationCode"
                      className="block text-sm font-medium text-foreground/80 mb-1.5"
                    >
                      Confirmation Code
                    </label>
                    <TextField
                      id="confirmationCode"
                      fullWidth
                      placeholder="Enter the code from your email"
                      value={confirmationCode}
                      onChange={(e) => {
                        setConfirmationCode(e.target.value)
                        if (error) setError("")
                      }}
                      variant="outlined"
                      className="form-input"
                      InputProps={{
                        className: "rounded-lg bg-background/50 backdrop-blur-sm",
                      }}
                    />
                    <p className="text-xs text-foreground/60 mt-1.5">
                      The code was sent to {formData.email}
                    </p>
                  </div>

                  <Button
                    onClick={handleConfirm}
                    fullWidth
                    variant="contained"
                    disabled={loading || !confirmationCode.trim()}
                    className="bg-secondary hover:bg-secondary-hover text-secondary-foreground p-3 rounded-lg transition-all duration-200 disabled:opacity-70"
                  >
                    {loading ? (
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
                        Confirming Account...
                      </span>
                    ) : (
                      "Confirm Account & Log In"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
