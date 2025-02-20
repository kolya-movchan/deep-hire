import { Routes, Route, Navigate } from "react-router-dom"
import { Home } from "../pages"
import { Login } from "../pages/login"
import { Register } from "../pages/register"
import { Profile } from "../pages/profile"
import { JSX, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { fetchCredits } from "@/store/credits-slice"
import { checkAuth } from "@/store/auth-slice"

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
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(fetchCredits())
  }, [dispatch])

  const { user, loading } = useSelector((state: RootState) => state.auth)
  const { balance } = useSelector((state: RootState) => state.credits)

  console.log({ user, loading, balance })

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
