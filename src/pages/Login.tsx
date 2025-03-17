import React, { useState } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useNavigateLoggedInUser } from "@/helpers/navigate-user"
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
  Drawer,
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
      navigate("/")
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
        <Sidebar activePath={window.location.pathname} />
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
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              Please sign in to continue
            </Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: "500px", mx: "auto" }}>
              <Box component="form" onSubmit={handleLogin}>
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
                    sx={{
                      color: "#1976d2",
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

                  <Button type="submit" fullWidth variant="contained" color="primary">
                    Sign In
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: "#1976d2",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Register here
                    </Link>
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

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
            color="primary"
          >
            {isResetCodeSent ? "Confirm Reset" : "Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
