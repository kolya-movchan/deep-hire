import { Routes, Route } from "react-router-dom"
import { Home } from "../pages/home"
import { Login } from "../pages/login"
import { Register } from "../pages/register"
import { Dashboard } from "../pages/dashboard"
import { PrivateRoute } from "./private-route"
import { useAuthCheck } from "../hooks/auth/use-auth"
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
  useAuthCheck()

  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      <Route element={<PrivateRoute />}>
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  )
}
