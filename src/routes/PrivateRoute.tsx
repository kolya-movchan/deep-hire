import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../store"

export function PrivateRoute() {
  const { user, loading } = useSelector((state: RootState) => state.auth)

  if (loading) return <p>Loading...</p> // Can be a spinner or skeleton

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
