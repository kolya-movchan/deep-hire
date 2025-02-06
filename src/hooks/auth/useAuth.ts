import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { checkAuth } from "../../store/authSlice"
import { AppDispatch } from "../../store"

export function useAuthCheck() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])
}
