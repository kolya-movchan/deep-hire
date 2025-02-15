import React, { useState, useEffect, useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { configAmplify } from "../hooks/auth/config-amplify"
import { register, confirmRegistration, logIn } from "../hooks/auth/auth"
import {
  TextField,
  IconButton,
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { passwordRequirements } from "@/mocks/data/password-requirements"
import { useNavigate } from "react-router-dom"
import { AppDispatch } from "@/store"
import { useDispatch } from "react-redux"
import { checkAuth } from "@/store/auth-slice"

interface RegisterForm {
  fullName: string
  email: string
  password: string
}

export const Register = () => {
  configAmplify()

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const requirementsRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
  })
  const [confirmationCode, setConfirmationCode] = useState<string>("")
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRequirements, setShowRequirements] = useState<boolean>(false)

  const requirements = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.regex.test(formData.password),
    }))
  }, [formData.password])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (requirementsRef.current && !requirementsRef.current.contains(event.target as Node)) {
        setShowRequirements(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const allRequirementsMet = requirements.every((req) => req.met)
    if (!allRequirementsMet) {
      setShowRequirements(true)
      return
    }

    try {
      const { isSignUpComplete, userId, nextStep } = await register({
        ...formData,
        username: formData.email,
      })

      console.log("isSignUpComplete:", isSignUpComplete)
      console.log("userId:", userId)
      console.log("nextStep:", nextStep)
      setIsConfirming(true)
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  const handleConfirm = async () => {
    try {
      await confirmRegistration(formData.email, confirmationCode)
      console.log("User confirmed successfully!")
      await logIn(formData.email, formData.password)
      dispatch(checkAuth())
      navigate("/dashboard")
      setIsConfirming(false)
    } catch (error) {
      console.error("Error confirming user:", error)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #EEF2FF, #FFFFFF, #F3E8FF)",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(8px)",
          bgcolor: "rgba(255,255,255,0.7)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 2, display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(to right, #9333EA, #4F46E5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                My App
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: "600px",
            mx: "auto",
            bgcolor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Create Account
          </Typography>

          {!isConfirming ? (
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />

                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                  {showRequirements && (
                    <Paper
                      ref={requirementsRef}
                      elevation={2}
                      sx={{
                        position: "absolute",
                        zIndex: 10,
                        mt: 1,
                        p: 2,
                        width: "100%",
                      }}
                    >
                      {requirements.map((req, i) => (
                        <Typography
                          key={i}
                          variant="body2"
                          sx={{
                            color: req.met ? "success.main" : "error.main",
                            mb: 0.5,
                          }}
                        >
                          {req.text}
                        </Typography>
                      ))}
                    </Paper>
                  )}
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "linear-gradient(to right, #9333EA, #4F46E5)",
                    "&:hover": {
                      background: "linear-gradient(to right, #7E22CE, #4338CA)",
                    },
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            </Box>
          ) : (
            <Stack spacing={3} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Confirmation Code"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                variant="outlined"
              />
              <Button
                onClick={handleConfirm}
                fullWidth
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #9333EA, #4F46E5)",
                  "&:hover": {
                    background: "linear-gradient(to right, #7E22CE, #4338CA)",
                  },
                }}
              >
                Confirm Account
              </Button>
            </Stack>
          )}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#9333EA",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
