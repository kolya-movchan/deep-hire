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
          icon: <AddCircle />,
          text: "New Analysis",
          path: "/",
          highlight: activePath === "/",
        },
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
          icon: <Login />,
          text: "Login",
          path: "/login",
          highlight: activePath === "/login",
        },
        {
          icon: <AddCircle />,
          text: "New Analysis",
          path: "/",
          highlight: activePath === "/",
        },
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
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <Typography
          component={Link}
          to="/"
          className="font-heading text-2xl font-bold text-sidebar-primary no-underline flex items-center gap-2"
        >
          <span className="bg-sidebar-primary text-sidebar-primary-foreground p-1 rounded">AI</span>
          <span>FLEX</span>
        </Typography>
      </div>

      <List className="mt-6 px-2">
        {sidebarItems.map((item) => (
          <ListItem
            component={Link}
            to={item.path}
            key={item.text}
            onClick={isMobile ? handleDrawerToggle : undefined}
            className={cn(
              "my-1 rounded-lg transition-all duration-200",
              item.highlight
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
            disableGutters
            sx={{ py: 1, px: 2 }}
          >
            <ListItemIcon
              className={cn(
                "min-w-[36px]",
                item.highlight ? "text-sidebar-primary" : "text-sidebar-foreground/60"
              )}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              className="animate-fade-in"
              primaryTypographyProps={{
                className: cn("font-medium", item.highlight && "font-semibold"),
              }}
            />
          </ListItem>
        ))}
      </List>

      {user && (
        <>
          <Divider className="mt-auto border-sidebar-border/50" />
          <div className="p-4">
            <ListItem
              component={Link}
              to="/profile"
              onClick={isMobile ? handleDrawerToggle : undefined}
              className={cn(
                "rounded-lg transition-all duration-200",
                activePath === "/profile"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              disableGutters
              sx={{ py: 1, px: 2 }}
            >
              <ListItemIcon
                className={cn(
                  "min-w-[36px]",
                  activePath === "/profile" ? "text-sidebar-primary" : "text-sidebar-foreground/60"
                )}
              >
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{
                  className: cn("font-medium", activePath === "/profile" && "font-semibold"),
                }}
              />
            </ListItem>
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
          className="fixed top-4 left-4 z-50 bg-white/90 shadow-md rounded-full p-2 hover:bg-white hover:shadow-lg transition-all duration-200"
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
          width: 280,
          boxSizing: "border-box",
          border: "none",
          boxShadow: "0 0 15px rgba(0,0,0,0.05)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
