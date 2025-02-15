import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { checkAuth } from "../../store/auth-slice"
import { AppDispatch } from "../../store"

export function useAuthCheck() {
  const dispatch = useDispatch<AppDispatch>()

  console.log("auth check")

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])
}
