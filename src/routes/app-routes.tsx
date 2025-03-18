import { Routes, Route } from "react-router-dom"
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
import { setNewVisitorData } from "@/store/visitor-slice"
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react"
import PrivateRoute from "./private-route"

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
] as const

const authRoutes: readonly RouteConfig[] = [{ path: "/profile", element: <Profile /> }] as const

export function AppRoutes(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>()

  const { user, loading } = useSelector((state: RootState) => state.auth)
  const { fingerprintId } = useSelector((state: RootState) => state.visitor)
  const { balance } = useSelector((state: RootState) => state.credits)

  const userId = user?.userId ?? fingerprintId

  useEffect(() => {
    dispatch(checkAuth())

    if (userId) {
      dispatch(fetchCredits(userId))
    }
  }, [dispatch, userId])

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

      <Route element={<PrivateRoute />}>
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
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
    path: "/cv-analyses",
    element: <CvAnalyses />,
  },
])
