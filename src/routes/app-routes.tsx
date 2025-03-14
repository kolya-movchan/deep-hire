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
import { CvAnalysisOfCandidate } from "../pages/cv-analysis-of-candidate"
import { createBrowserRouter } from "react-router-dom"
import { CvAnalyses } from "@/pages/cv-analyses"
import { Vacancies } from "@/pages/vacancies"
import { Candidates } from "@/pages/candidates"
import { setNewVisitorData } from "@/store/visitor-slice"
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react"

type RouteConfig = {
  path: string
  element: JSX.Element
}

const publicRoutes: readonly RouteConfig[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/cv-analyses", element: <CvAnalyses /> },
  { path: "/vacancies", element: <Vacancies /> },
  { path: "/candidates", element: <Candidates /> },
] as const

const authRoutes: readonly RouteConfig[] = [{ path: "/profile", element: <Profile /> }] as const

export function AppRoutes(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>()

  const { user, loading } = useSelector((state: RootState) => state.auth)
  const { balance } = useSelector((state: RootState) => state.credits)

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(fetchCredits(user?.userId ?? ""))
  }, [dispatch, user?.userId])

  const { data: fingerprintData } = useVisitorData({ extendedResult: false }, { immediate: true })

  // @ts-expect-error wrong types from fingerprintjs
  const visitorId = fingerprintData?.meta.version || ""

  if (visitorId) {
    dispatch(
      setNewVisitorData({
        fingerprintId: `anon-${visitorId}`,
      })
    )
  }

  console.log(JSON.stringify({ user, loading, balance }, null, 2))

  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      <Route path="/cv-analysis/:fileSlug" element={<CvAnalysisOfCandidate />} />

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/cv-analysis/:fileSlug",
    element: <CvAnalysisOfCandidate />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/vacancies",
    element: <Vacancies />,
  },
  {
    path: "/candidates",
    element: <Candidates />,
  },
  {
    path: "/cv-analyses",
    element: <CvAnalyses />,
  },
])
