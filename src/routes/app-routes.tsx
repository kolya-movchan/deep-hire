import { Routes, Route, Navigate } from "react-router-dom"
import { Home } from "../pages"
import { Login } from "../pages/login"
import { Register } from "../pages/register"
import { Profile } from "../pages/profile"
import { useAuthCheck } from "../hooks/auth/use-auth"
import { JSX } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store"

type RouteConfig = {
  path: string
  element: JSX.Element
}

const publicRoutes: readonly RouteConfig[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
] as const

const authRoutes: readonly RouteConfig[] = [{ path: "/profile", element: <Profile /> }] as const

export function AppRoutes(): JSX.Element {
  useAuthCheck()

  const { user, loading } = useSelector((state: RootState) => state.auth)

  console.log({ user, loading })

  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {authRoutes.map(({ path, element }) => {
        const renderElement = () => {
          if (loading) {
            return <p>Loading...</p>
          }

          if (!user) {
            return <Navigate to="/login" replace />
          }

          return element
        }

        return <Route key={path} path={path} element={renderElement()} />
      })}
    </Routes>
  )
}
