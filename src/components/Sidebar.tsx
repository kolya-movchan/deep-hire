import React, { useState } from "react"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Assessment, Person, AddCircle, Login, Menu as MenuIcon } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export interface SidebarItem {
  icon: React.ReactNode
  text: string
  path: string
  highlight?: boolean
}

export interface SidebarProps {
  activePath?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [mobileOpen, setMobileOpen] = useState(false)

  const { user } = useSelector((state: RootState) => state.auth)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Define sidebar items based on authentication state
  const sidebarItems: SidebarItem[] = user
    ? [
        {
          icon: <AddCircle />,
          text: "New Analysis",
          path: "/",
          highlight: activePath === "/",
        },
        // { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies", highlight: activePath === "/vacancies" },
        {
          icon: <Assessment />,
          text: "CV Analyses",
          path: "/cv-analyses",
          highlight: activePath === "/cv-analyses",
        },
        {
          icon: <Person />,
          text: "Candidates",
          path: "/candidates",
          highlight: activePath === "/candidates",
        },
      ]
    : [
        {
          icon: <AddCircle />,
          text: "New Analysis",
          path: "/",
          highlight: activePath === "/",
        },
        {
          icon: <Login />,
          text: "Login",
          path: "/login",
          highlight: activePath === "/login",
        },
        // { icon: <WorkOutline />, text: "Vacancies", path: "/vacancies", highlight: activePath === "/vacancies" },
        {
          icon: <Assessment />,
          text: "CV Analyses",
          path: "/cv-analyses",
          highlight: activePath === "/cv-analyses",
        },
        {
          icon: <Person />,
          text: "Candidates",
          path: "/candidates",
          highlight: activePath === "/candidates",
        },
      ]

  const drawerContent = (
    <>
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
            onClick={isMobile ? handleDrawerToggle : undefined}
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

      {user && (
        <>
          <Divider sx={{ mt: "auto" }} />
          <List>
            <ListItem
              component={Link}
              to="/profile"
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                color: activePath === "/profile" ? "#1976d2" : "#666",
                bgcolor: activePath === "/profile" ? "rgba(25, 118, 210, 0.08)" : "transparent",
                fontWeight: activePath === "/profile" ? 600 : 400,
                "&:hover": {
                  bgcolor: activePath === "/profile" ? "rgba(25, 118, 210, 0.12)" : "#e0e0e0",
                },
              }}
            >
              <ListItemIcon sx={{ color: activePath === "/profile" ? "#1976d2" : "#666" }}>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </>
      )}
    </>
  )

  // For mobile, use a temporary drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1200,
            bgcolor: "white",
            boxShadow: 1,
            "&:hover": {
              bgcolor: "#f5f5f5",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: "block",
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              bgcolor: "#f5f5f5",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    )
  }

  // For desktop, use a permanent drawer
  return (
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
      {drawerContent}
    </Drawer>
  )
}
