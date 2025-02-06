import { JSX } from "react"
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "../store/authSlice"
import { RootState } from "../store"
import { Dashboard } from "../pages/Dashboard"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { AppDispatch } from "../store"

type RouteConfig = {
  path: string
  element: JSX.Element
}

const publicRoutes: readonly RouteConfig[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
] as const

const authRoutes: readonly RouteConfig[] = [{ path: "/dashboard", element: <Dashboard /> }] as const

export function AppRoutes(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (loading) {
    return <></> // Or a proper loading spinner
  }

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
            element={user ? element : <Navigate to="/login" replace />}
          />
        ))}
      </Routes>
    </Router>
  )
}
