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
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  CloudUpload,
  Link as LinkIcon,
  Person,
  Login,
  WorkOutline,
  Settings,
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useFileUpload } from "../hooks/use-file-upload"

export const Home = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [vacancyUrl, setVacancyUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const { user } = useSelector((state: RootState) => state.auth)
  const { uploadFile, isUploading } = useFileUpload()
  const navigate = useNavigate()

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
    }
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVacancyUrl(url)
    if (url && !url.startsWith("https://")) {
      setUrlError("URL must start with https://")
    } else {
      setUrlError("")
    }
  }

  const sidebarItems = user
    ? [
        { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies" },
        { icon: <Person />, text: "Candidates", path: "/candidates" },
        { icon: <Settings />, text: "Settings", path: "/settings" },
      ]
    : [{ icon: <Login />, text: "Login", path: "/login" }]

  const uploadResume = async () => {
    if (vacancyUrl && resumeFile) {
      try {
        const url = await uploadFile(resumeFile, vacancyUrl, user?.userId)
        console.log("Uploaded file to:", url)

        // Clear the inputs
        setResumeFile(null)
        setVacancyUrl("")

        // Redirect to analysis page
        navigate("/cv-analysis")
      } catch (err) {
        console.error("Upload failed:", err)
      }
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
                      accept="application/pdf"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Paste URL of vacancy here"
                    variant="outlined"
                    value={vacancyUrl}
                    onChange={handleUrlChange}
                    error={!!urlError}
                    helperText={urlError}
                    sx={{ maxWidth: "300px", width: "100%" }}
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={uploadResume}
                    disabled={!resumeFile || !vacancyUrl || !!urlError || isUploading}
                    sx={{ maxWidth: "300px", width: "100%" }}
                  >
                    {isUploading ? "Uploading..." : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
