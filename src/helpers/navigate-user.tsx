import { NavigateFunction } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useEffect } from "react"
import { AuthState } from "@/types/state"

export const useNavigateLoggedInUser = (navigate: NavigateFunction): void => {
  const user = useSelector<RootState, AuthState["user"]>((state) => state.auth.user)
  const isLoading = useSelector<RootState, boolean>((state) => state.auth.loading)

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/")
    }
  }, [isLoading, user, navigate])
}
