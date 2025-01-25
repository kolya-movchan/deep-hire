import { useEffect, useState } from "react"
import { AuthUser, getCurrentUser } from "aws-amplify/auth"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()
        setAuthUser(user)
        console.log("Current user:", user)
      } catch {
        console.log("Not signed in")
        setAuthUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  if (isLoading) {
    return null // Or a loading spinner
  }

  const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]

  const authRoutes = [{ path: "/dashboard", element: <Dashboard /> }]

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Protected routes */}
        {authRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={authUser ? element : <Navigate to="/login" replace />}
          />
        ))}
      </Routes>
    </Router>
  )
}

export default App
