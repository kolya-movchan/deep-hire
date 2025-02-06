import { NavigateFunction } from "react-router-dom"
import { useSelector } from "react-redux"
import { AuthState } from "@/store/authSlice"
import { RootState } from "@/store"
import { useEffect } from "react"

export const useNavigateLoggedInUser = (navigate: NavigateFunction): void => {
  const user = useSelector<RootState, AuthState["user"]>((state) => state.auth.user)
  const isLoading = useSelector<RootState, boolean>((state) => state.auth.loading)

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard")
    }
  }, [isLoading, user, navigate])
}
