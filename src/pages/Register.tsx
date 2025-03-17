import React, { useState, useEffect, useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { configAmplify } from "../utils/config-amplify"
import { register, confirmRegistration, logIn } from "../api/rest/auth"
import {
  TextField,
  IconButton,
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { passwordRequirements } from "@/mocks/data/password-requirements"
import { useNavigate } from "react-router-dom"
import { AppDispatch } from "@/store"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "@/store/auth-slice"
import { useNavigateLoggedInUser } from "@/helpers/navigate-user"
import { RootState } from "@/store"
import { WorkOutline, Person, Settings, Login as LoginIcon, Assessment } from "@mui/icons-material"
import { createUser } from "@/api/graphql/api"
import { Sidebar } from "@/components/Sidebar"

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
      await createUser(formData.email, formData.fullName)
      dispatch(checkAuth())
      navigate("/")
      setIsConfirming(false)
    } catch (error) {
      console.error("Error confirming user:", error)
    }
  }

  // Side effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (requirementsRef.current && !requirementsRef.current.contains(event.target as Node)) {
        setShowRequirements(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
        <Sidebar activePath={"/login"} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fff",
          p: 3,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            py: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3, width: "100%" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
              Create Account
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              Please fill in your information to register
            </Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: "500px", mx: "auto" }}>
              {!isConfirming ? (
                <Box component="form" onSubmit={handleRegister}>
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

                    <Button type="submit" fullWidth variant="contained" color="primary">
                      Create Account
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          color: "#1976d2",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Confirmation Code"
                    placeholder="Enter confirmation code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    variant="outlined"
                  />
                  <Button onClick={handleConfirm} fullWidth variant="contained" color="primary">
                    Confirm Account
                  </Button>
                </Stack>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
