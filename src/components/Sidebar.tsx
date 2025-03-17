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
  Tooltip,
  Avatar,
} from "@mui/material"
import {
  Assessment,
  Person,
  AddCircle,
  Login,
  Menu as MenuIcon,
  Dashboard,
  Description,
  People,
  Analytics,
  CloudUpload,
  Settings,
  Logout,
  BusinessCenter,
  Badge,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { cn } from "@/lib/utils"

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
          icon: <CloudUpload sx={{ color: "#4f46e5" }} />,
          text: "New Analysis",
          path: "/",
          highlight: activePath === "/",
        },
        {
          icon: <Description sx={{ color: "#6d28d9" }} />,
          text: "CV Analyses",
          path: "/cv-analyses",
          highlight: activePath === "/cv-analyses" || activePath?.startsWith("/cv-analysis/"),
        },
        {
          icon: <People sx={{ color: "#2563eb" }} />,
          text: "Candidates",
          path: "/candidates",
          highlight: activePath === "/candidates",
        },
        {
          icon: <BusinessCenter sx={{ color: "#0891b2" }} />,
          text: "Vacancies",
          path: "/vacancies",
          highlight: activePath === "/vacancies",
        },
      ]
    : [
        {
          icon: <Login sx={{ color: "#0ea5e9" }} />,
          text: "Login",
          path: "/login",
          highlight: activePath === "/login",
        },
        {
          icon: <CloudUpload sx={{ color: "#4f46e5" }} />,
          text: "New Analysis",
          path: "/",
          highlight: activePath === "/",
        },
        {
          icon: <Description sx={{ color: "#6d28d9" }} />,
          text: "CV Analyses",
          path: "/cv-analyses",
          highlight: activePath === "/cv-analyses" || activePath?.startsWith("/cv-analysis/"),
        },
        {
          icon: <People sx={{ color: "#2563eb" }} />,
          text: "Candidates",
          path: "/candidates",
          highlight: activePath === "/candidates",
        },
      ]

  const drawerContent = (
    <div className="flex flex-col h-full bg-white text-gray-700 shadow-xl">
      <div className="p-6 bg-gradient-to-r from-primary to-secondary">
        <Typography
          component={Link}
          to="/"
          className="font-heading text-2xl font-bold no-underline flex items-center gap-2"
          variant="h6"
        >
          <div className="text-sidebar-primary-foreground p-2 flex items-center">
            <span className="font-extrabold">Deep</span>
            <span className="font-light">Hire</span>
          </div>
        </Typography>
      </div>

      <List className="py-2 px-2">
        {sidebarItems.map((item) => (
          <Tooltip title={item.text} placement="right" key={item.text}>
            <ListItem
              component={Link}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              className={cn(
                "my-1 transition-all duration-200 relative",
                item.highlight
                  ? "bg-gray-100 text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              )}
              disableGutters
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon className="min-w-[36px]">{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                className="animate-fade-in"
                primaryTypographyProps={{
                  className: cn("font-medium", item.highlight && "font-semibold"),
                }}
              />
              {item.highlight && <div className="absolute left-0 top-0 w-1 h-full bg-gray-400" />}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {user && (
        <>
          <div className="px-4 py-3 bg-gray-50 border-y border-gray-100 mt-auto">
            <Typography
              variant="subtitle2"
              className="text-gray-500 font-medium uppercase text-xs tracking-wider"
            >
              User Menu
            </Typography>
          </div>
          <div className="py-2 px-2">
            <Tooltip title="Profile Settings" placement="right">
              <ListItem
                component={Link}
                to="/profile"
                onClick={isMobile ? handleDrawerToggle : undefined}
                className={cn(
                  "transition-all duration-200 my-1 relative",
                  activePath === "/profile"
                    ? "bg-gray-100 text-gray-800 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                )}
                disableGutters
                sx={{ py: 1.5, px: 2 }}
              >
                <ListItemIcon>
                  <Badge sx={{ color: "#16a34a" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  primaryTypographyProps={{
                    className: cn("font-medium", activePath === "/profile" && "font-semibold"),
                  }}
                />
                {activePath === "/profile" && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-gray-400" />
                )}
              </ListItem>
            </Tooltip>

            <Tooltip title="Logout" placement="right">
              <ListItem
                component={Link}
                to="/logout"
                onClick={isMobile ? handleDrawerToggle : undefined}
                className="transition-all duration-200 my-1 text-gray-600 hover:bg-red-50 hover:text-red-600"
                disableGutters
                sx={{ py: 1.5, px: 2 }}
              >
                <ListItemIcon>
                  <Logout sx={{ color: "#dc2626" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    className: "font-medium",
                  }}
                />
              </ListItem>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  )

  // For mobile, use a temporary drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          aria-label="open menu"
          onClick={handleDrawerToggle}
          className="fixed top-4 left-4 z-50 bg-white/90 shadow-md p-2 hover:bg-white hover:shadow-lg transition-all duration-200"
        >
          <MenuIcon className="text-primary" />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 280,
              boxSizing: "border-box",
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
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
