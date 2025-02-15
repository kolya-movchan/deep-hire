import React, { useState } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigateLoggedInUser } from "@/hooks/navigate-user"
import {
  TextField,
  IconButton,
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { logIn } from "../hooks/auth/auth"
import { configAmplify } from "../hooks/auth/config-amplify"
import { checkAuth } from "@/store/auth-slice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { forgotPassword, forgotPasswordSubmit } from "../hooks/auth/auth"

interface LoginForm {
  email: string
  password: string
}

export const Login = () => {
  const navigate = useNavigate()
  useNavigateLoggedInUser(navigate)
  configAmplify()

  const dispatch = useDispatch<AppDispatch>()

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await logIn(formData.email, formData.password)

      dispatch(checkAuth())

      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(resetEmail)
      setIsResetCodeSent(true)
    } catch (error) {
      console.error("Password reset error:", error)
    }
  }

  const handleResetPasswordSubmit = async () => {
    try {
      await forgotPasswordSubmit(resetEmail, confirmationCode, newPassword)
      setForgotPasswordOpen(false)
      setIsResetCodeSent(false)
      setResetEmail("")
      setConfirmationCode("")
      setNewPassword("")
    } catch (error) {
      console.error("Password reset confirmation error:", error)
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
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
            Please sign in to continue
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <Stack spacing={3}>
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
                placeholder="Enter your password"
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
              <Button
                onClick={() => setForgotPasswordOpen(true)}
                size="small"
                id="margin-none"
                sx={{
                  color: "#9333EA",
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                  alignSelf: "flex-end",
                  "&:hover": {
                    background: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot Password?
              </Button>

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
                Sign In
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#9333EA",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
        <DialogTitle>{isResetCodeSent ? "Enter Reset Code" : "Reset Password"}</DialogTitle>
        <DialogContent>
          {!isResetCodeSent ? (
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          ) : (
            <Stack spacing={2}>
              <TextField
                autoFocus
                margin="dense"
                label="Confirmation Code"
                type="text"
                fullWidth
                variant="outlined"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
              <TextField
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setForgotPasswordOpen(false)
              setIsResetCodeSent(false)
              setResetEmail("")
              setConfirmationCode("")
              setNewPassword("")
            }}
            sx={{ color: "gray" }}
          >
            Cancel
          </Button>
          <Button
            onClick={isResetCodeSent ? handleResetPasswordSubmit : handleForgotPassword}
            sx={{ color: "#9333EA" }}
          >
            {isResetCodeSent ? "Confirm Reset" : "Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
