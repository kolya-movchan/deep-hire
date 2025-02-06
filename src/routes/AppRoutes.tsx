import { Routes, Route } from "react-router-dom"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { Dashboard } from "../pages/Dashboard"
import { PrivateRoute } from "./PrivateRoute"
import { useAuthCheck } from "../hooks/auth/useAuth"
import { JSX } from "react"

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
  useAuthCheck() // Runs authentication check globally

  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Private routes (Wrapped in PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  )
}
