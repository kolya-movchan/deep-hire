import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Box, Container, Typography, Button, Stack } from "@mui/material"
import { checkAuthStatus, singOut } from "../hooks/auth/auth"

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    singOut(setIsLoggedIn, navigate)
  }

  const handleAuthStatus = async () => {
    checkAuthStatus(setIsLoggedIn)
  }

  useEffect(() => {
    handleAuthStatus()
  }, [])

  return (
    <Box
      component="header"
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
        <Box sx={{ py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              AI Flex
            </Typography>
          </Link>

          <Stack direction="row" spacing={2}>
            {isLoggedIn === null ? null : isLoggedIn ? (
              <Button
                onClick={handleSignOut}
                sx={{
                  color: "primary.main",
                  "&:hover": { bgcolor: "primary.50" },
                }}
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "primary.main",
                    "&:hover": { bgcolor: "primary.50" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    background: "linear-gradient(to right, #9333EA, #4F46E5)",
                    "&:hover": {
                      background: "linear-gradient(to right, #7E22CE, #4338CA)",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
