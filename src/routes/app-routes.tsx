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
import { useVisitorVerification } from "@/hooks/use-visitor-verification"

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

  const { user, loading } = useSelector((state: RootState) => state.auth)
  const { balance } = useSelector((state: RootState) => state.credits)
  const { visitorId } = useVisitorVerification()

  // useEffect(() => {
  //   const verifyVisitor = async () => {
  //     const verificationResult = await verify()
  //     if (!verificationResult.isAllowed) {
  //       throw new Error(verificationResult.reason ?? "Upload not allowed")
  //     }
  //   }
  //   verifyVisitor()
  // }, [verify])

  // const { isLoading, error, data, getData } = useVisitorData(
  // const { isLoading, error, data, getData } = useVisitorData(
  //   { extendedResult: true },
  //   { immediate: true }
  // )

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(fetchCredits(user?.userId ?? ""))
  }, [dispatch, user?.userId])

  console.log(JSON.stringify({ user, loading, balance }, null, 2))

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
