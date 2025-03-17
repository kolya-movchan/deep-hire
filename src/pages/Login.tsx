import React, { useState } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigateLoggedInUser } from "@/helpers/navigate-user"
import {
  TextField,
  IconButton,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { logIn } from "../api/rest/auth"
import { configAmplify } from "../utils/config-amplify"
import { checkAuth } from "@/store/auth-slice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { forgotPassword, forgotPasswordSubmit } from "../api/rest/auth"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Sidebar } from "@/components/Sidebar"

interface LoginForm {
  email: string
  password: string
}

export const Login = () => {
  const navigate = useNavigate()
  useNavigateLoggedInUser(navigate)
  configAmplify()

  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  })
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isResetCodeSent, setIsResetCodeSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await logIn(formData.email, formData.password)
      dispatch(checkAuth())
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) return

    setLoading(true)
    try {
      await forgotPassword(resetEmail)
      setIsResetCodeSent(true)
    } catch (error) {
      console.error("Password reset error:", error)
      setError("Failed to send reset code. Please check your email and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPasswordSubmit = async () => {
    if (!resetEmail || !confirmationCode || !newPassword) return

    setLoading(true)
    try {
      await forgotPasswordSubmit(resetEmail, confirmationCode, newPassword)
      setForgotPasswordOpen(false)
      setIsResetCodeSent(false)
      setResetEmail("")
      setConfirmationCode("")
      setNewPassword("")
      setError("")
    } catch (error) {
      console.error("Password reset confirmation error:", error)
      setError("Failed to reset password. Please check your code and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath={window.location.pathname} />

      <main className="flex-grow flex items-center justify-center p-4">
        <Container maxWidth="sm" className="animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center text-primary">
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
                    d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-foreground/70 mb-6">Please sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="card glass-effect backdrop-blur-md p-8 border border-primary/10 shadow-lg rounded-xl">
              <form onSubmit={handleLogin} className="space-y-6">
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

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-foreground/80"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs text-primary hover:text-primary-focus focus:outline-none focus:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
                </div>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  className="bg-primary text-primary-foreground p-3 rounded-lg transition-all duration-200 disabled:opacity-70"
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center mt-6">
                  <p className="text-sm text-foreground/70">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </main>

      {/* Password Reset Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => {
          if (!loading) {
            setForgotPasswordOpen(false)
            setIsResetCodeSent(false)
            setResetEmail("")
            setConfirmationCode("")
            setNewPassword("")
            setError("")
          }
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: "rounded-xl overflow-hidden",
        }}
      >
        <DialogTitle className="bg-primary/5 py-4 px-6">
          <h2 className="text-xl font-semibold">
            {isResetCodeSent ? "Enter Reset Code" : "Reset Password"}
          </h2>
        </DialogTitle>
        <DialogContent className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {!isResetCodeSent ? (
            <div className="mt-2">
              <p className="text-foreground/70 text-sm mb-4">
                Enter your email address and we'll send you a code to reset your password.
              </p>
              <TextField
                autoFocus
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="form-input"
              />
            </div>
          ) : (
            <div className="mt-2 space-y-4">
              <p className="text-foreground/70 text-sm mb-2">
                We've sent a code to your email. Enter the code and your new password below.
              </p>
              <TextField
                autoFocus
                label="Confirmation Code"
                type="text"
                fullWidth
                variant="outlined"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="form-input"
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions className="px-6 py-4 bg-primary/2">
          <Button
            onClick={() => {
              if (!loading) {
                setForgotPasswordOpen(false)
                setIsResetCodeSent(false)
                setResetEmail("")
                setConfirmationCode("")
                setNewPassword("")
                setError("")
              }
            }}
            disabled={loading}
            className="text-foreground/70 hover:bg-background/50 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={isResetCodeSent ? handleResetPasswordSubmit : handleForgotPassword}
            disabled={
              loading ||
              (!isResetCodeSent && !resetEmail) ||
              (isResetCodeSent && (!confirmationCode || !newPassword))
            }
            className="bg-primary text-primary-foreground rounded-lg"
          >
            {loading ? (
              <span className="flex items-center">
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
                Processing...
              </span>
            ) : isResetCodeSent ? (
              "Reset Password"
            ) : (
              "Send Code"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
