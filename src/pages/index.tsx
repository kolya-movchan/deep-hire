import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  CloudUpload,
  Link as LinkIcon,
  Person,
  Login,
  AppRegistration,
  WorkOutline,
  Settings,
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export const Home = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState("")
  const { user } = useSelector((state: RootState) => state.auth)

  const sidebarItems = user
    ? [
        { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
        { icon: <Person />, text: "Candidates", path: "/candidates" },
        { icon: <Settings />, text: "Settings", path: "/settings" },
      ]
    : [
        { icon: <Login />, text: "Login", path: "/login" },
        { icon: <AppRegistration />, text: "Register", path: "/register" },
      ]

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
                color: "#666",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#666" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {user && (
          <ListItem
            component={Link}
            to="/profile"
            sx={{
              mt: "auto",
              color: "#666",
              "&:hover": {
                bgcolor: "#e0e0e0",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#666" }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        )}
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
              Resume Validation Tool
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              Quick and accurate resume validation for recruiters
            </Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: "500px", mx: "auto" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ maxWidth: "300px", width: "100%" }}
                  >
                    {resumeFile ? resumeFile.name : "Upload Resume"}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Or paste resume URL"
                    variant="outlined"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    sx={{ maxWidth: "300px", width: "100%" }}
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2} sx={{ maxWidth: "600px", mx: "auto" }}>
              {[
                { stat: "98%", label: "Accuracy" },
                { stat: "2min", label: "Processing Time" },
                { stat: "24/7", label: "Availability" },
              ].map((item) => (
                <Grid item xs={4} key={item.label}>
                  <Paper elevation={1} sx={{ p: 1.5 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {item.stat}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
