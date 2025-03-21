import { useEffect, useState } from "react"
import { fetchUserData } from "@/api/graphql/api"
import { User } from "@/api/graphql/types"
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Button,
  Tooltip,
  Tab,
  Tabs,
  Chip,
  Badge,
} from "@mui/material"
import {
  CreditCard,
  History,
  NotificationsActive,
  Edit,
  Logout,
  Security,
  Settings,
  CloudUpload,
  Description,
  MonetizationOn,
} from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "@/api/rest/auth"
import { checkAuthStatus } from "@/api/rest/auth"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { Sidebar } from "@/components/Sidebar"

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const userId = useSelector((state: RootState) => state?.auth?.user?.userId)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const handleTabChange = (_event: unknown, newValue: number) => {
    setActiveTab(newValue)
  }

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
      setLoading(true)
      fetchUserData(userId)
        .then((data) => {
          setUser(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [userId])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/profile" />

      <main className="flex-grow p-6 md:p-8 lg:p-10">
        <Container maxWidth="lg" className="animate-fade-in">
          {loading ? (
            <div className="flex justify-center items-center h-[80vh]">
              <CircularProgress size={60} />
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-5">
                  <Badge sx={{ color: "#16a34a", fontSize: 30 }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">My Profile</h1>
                  <p className="text-foreground/70">
                    Manage your account and subscription settings
                  </p>
                </div>
              </div>

              {/* Main Profile Card */}
              <Paper
                elevation={3}
                className="relative overflow-hidden rounded-xl mb-10 border border-primary/5"
              >
                <div className="h-36 bg-gradient-to-r from-primary/80 to-secondary/80"></div>

                <div className="px-8 py-6 pb-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-end -mt-20 mb-10">
                    <Avatar
                      sx={{
                        width: 140,
                        height: 140,
                        fontSize: "3rem",
                        bgcolor: "#4f46e5",
                        border: "5px solid white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </Avatar>

                    <div className="flex-grow mt-4 md:mt-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <div>
                          <h2 className="text-3xl font-bold mb-2 text-gray-900">{user?.name}</h2>
                          <div className="flex items-center gap-3">
                            <p className="text-gray-600">
                              <span className="text-gray-400 mr-1">@</span>
                              {user?.email.split("@")[0]}
                            </p>
                            <Chip
                              size="small"
                              label={user?.role || "User"}
                              sx={{
                                bgcolor: "#e0f2fe",
                                color: "#0284c7",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                fontSize: "0.65rem",
                                padding: "0 6px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6 md:mt-0">
                      <Tooltip title="Edit Profile">
                        <Button
                          variant="outlined"
                          startIcon={<Edit />}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4"
                          size="large"
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Logout />}
                        onClick={handleSignOut}
                        className="bg-red-600 hover:bg-red-700 px-4"
                        size="large"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#4f46e5",
                        height: 3,
                      },
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        minWidth: 120,
                        padding: "12px 24px",
                        "&.Mui-selected": {
                          color: "#4f46e5",
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    <Tab label="Overview" />
                    <Tab label="Security" />
                    <Tab label="Activity" />
                    <Tab label="Subscription" />
                  </Tabs>
                </div>
              </Paper>

              {/* Content based on active tab */}
              {activeTab === 0 && (
                <>
                  {/* Stats Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl shadow-sm overflow-hidden">
                      <CardContent className="p-6 h-full flex flex-col justify-between">
                        <div className="flex items-center mb-3 justify-between gap-2">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                            <MonetizationOn sx={{ color: "#4f46e5", fontSize: 28 }} />
                          </div>
                          <Typography variant="h6" className="text-gray-700 font-medium">
                            Available Credits
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="font-bold text-indigo-700 ml-2 mt-3 mb-4"
                        >
                          {user?.credits || 0}
                        </Typography>
                        <Button
                          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2"
                          size="medium"
                          variant="contained"
                          fullWidth
                        >
                          Buy More Credits
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl shadow-sm overflow-hidden">
                      <CardContent className="p-6 h-full flex flex-col justify-between">
                        <div className="flex items-center mb-3 justify-between gap-2">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                            <Description sx={{ color: "#6d28d9", fontSize: 28 }} />
                          </div>
                          <Typography variant="h6" className="text-gray-700 font-medium">
                            CV Analyses
                          </Typography>
                        </div>
                        <Typography
                          variant="h3"
                          className="font-bold text-purple-700 ml-2 mt-3 mb-4"
                        >
                          0
                        </Typography>
                        <Button
                          component={Link}
                          to="/cv-analyses"
                          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2"
                          size="medium"
                          variant="contained"
                          fullWidth
                        >
                          View Analyses
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Paper elevation={2} className="rounded-xl p-8 mb-10 bg-white">
                    <div className="flex items-center mb-6">
                      <NotificationsActive
                        sx={{ color: "#4f46e5", marginRight: 2, fontSize: 28 }}
                      />
                      <Typography variant="h5" className="font-semibold">
                        Quick Actions
                      </Typography>
                    </div>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          variant="outlined"
                          className="flex flex-col items-center h-32 p-4 w-full border-gray-200 shadow-sm hover:shadow hover:border-primary transition-all"
                          component={Link}
                          to="/"
                        >
                          <CloudUpload sx={{ color: "#4f46e5", fontSize: 40, marginBottom: 1.5 }} />
                          <Typography className="text-gray-700 font-medium">
                            New Analysis
                          </Typography>
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          variant="outlined"
                          className="flex flex-col items-center h-32 p-4 w-full border-gray-200 shadow-sm hover:shadow hover:border-primary transition-all"
                        >
                          <CreditCard sx={{ color: "#6d28d9", fontSize: 40, marginBottom: 1.5 }} />
                          <Typography className="text-gray-700 font-medium">Buy Credits</Typography>
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          variant="outlined"
                          className="flex flex-col items-center h-32 p-4 w-full border-gray-200 shadow-sm hover:shadow hover:border-primary transition-all"
                        >
                          <Security sx={{ color: "#2563eb", fontSize: 40, marginBottom: 1.5 }} />
                          <Typography className="text-gray-700 font-medium">
                            Security Settings
                          </Typography>
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          variant="outlined"
                          className="flex flex-col items-center h-32 p-4 w-full border-gray-200 shadow-sm hover:shadow hover:border-primary transition-all"
                        >
                          <Settings sx={{ color: "#0891b2", fontSize: 40, marginBottom: 1.5 }} />
                          <Typography className="text-gray-700 font-medium">
                            Account Settings
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Recent Activity */}
                  <Paper elevation={2} className="rounded-xl p-8 bg-white">
                    <div className="flex items-center mb-6">
                      <History sx={{ color: "#4f46e5", marginRight: 2, fontSize: 28 }} />
                      <Typography variant="h5" className="font-semibold">
                        Recent Activity
                      </Typography>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <History sx={{ color: "#9ca3af", fontSize: 36 }} />
                      </div>
                      <Typography variant="h6" className="text-gray-600 mb-3">
                        No Recent Activity
                      </Typography>
                      <Typography className="text-gray-500 max-w-md mb-8">
                        Your recent actions will appear here. Start usingDeepHire by analyzing a CV
                        or creating a vacancy.
                      </Typography>
                      <Button
                        component={Link}
                        to="/"
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5"
                        variant="contained"
                        size="large"
                      >
                        Create New Analysis
                      </Button>
                    </div>
                  </Paper>
                </>
              )}

              {activeTab !== 0 && (
                <Paper
                  elevation={2}
                  className="rounded-xl p-10 min-h-[500px] flex items-center justify-center"
                >
                  <div className="text-center">
                    <Typography variant="h5" className="mb-3 text-gray-600 font-semibold">
                      {activeTab === 1 && "Security Settings"}
                      {activeTab === 2 && "Activity Log"}
                      {activeTab === 3 && "Subscription Management"}
                    </Typography>
                    <Typography className="text-gray-500 mb-6 max-w-md mx-auto">
                      This feature is coming soon. Stay tuned for updates!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setActiveTab(0)}
                      className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5"
                      size="large"
                    >
                      Go Back to Overview
                    </Button>
                  </div>
                </Paper>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  )
}
