import { useEffect, useState } from "react"
import { fetchUserData } from "@/api/graphql/api"
import { User } from "@/api/graphql/types"
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Avatar,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material"
import {
  Assessment,
  CompareArrows,
  WorkOutline,
  Person,
  Settings,
  AddCircle,
} from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "@/api/rest/auth"
import { checkAuthStatus } from "@/api/rest/auth"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null)
  const userId = useSelector((state: RootState) => state?.auth?.user?.userId)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  console.log("isLoggedIn", isLoggedIn)

  const handleSignOut = async () => {
    signOut(setIsLoggedIn, navigate, dispatch)
  }

  const handleAuthStatus = async () => {
    checkAuthStatus(setIsLoggedIn)
  }

  useEffect(() => {
    handleAuthStatus()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUserData(userId)
        .then((data) => setUser(data))
        .catch((err) => console.error(err))
    }
  }, [userId])

  const sidebarItems = [
    { icon: <AddCircle />, text: "New Analysis", path: "/", highlight: true },
    { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
    { icon: <Assessment />, text: "CV Analyses", path: "/all-cv-analyses" },
    { icon: <Person />, text: "Candidates", path: "/candidates" },
    { icon: <Settings />, text: "Settings", path: "/settings" },
  ]

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
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
        <List>
          {sidebarItems.map((item) => (
            <ListItem
              component={Link}
              to={item.path}
              key={item.text}
              sx={{
                color: item.highlight ? "#1976d2" : "#666",
                bgcolor: item.highlight ? "rgba(25, 118, 210, 0.08)" : "transparent",
                fontWeight: item.highlight ? 600 : 400,
                "&:hover": {
                  bgcolor: item.highlight ? "rgba(25, 118, 210, 0.12)" : "#e0e0e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: item.highlight ? "#1976d2" : "#666" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fff",
          p: 3,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "#1976d2", fontSize: "2rem" }}>
                {user.name[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
                  {user.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={handleSignOut}
                sx={{ alignSelf: "flex-start" }}
              >
                Logout
              </Button>
            </Stack>
            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={3}>
                <Card sx={{ bgcolor: "#1976d2", color: "white" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Assessment sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6" sx={{ opacity: 0.8 }}>
                          Credits
                        </Typography>
                        <Typography variant="h3">{user.credits}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CompareArrows color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          Comparisons
                        </Typography>
                        <Typography variant="h3">0</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <WorkOutline color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          Vacancies
                        </Typography>
                        <Typography variant="h3">0</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Person color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          Candidates
                        </Typography>
                        <Typography variant="h3">0</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
