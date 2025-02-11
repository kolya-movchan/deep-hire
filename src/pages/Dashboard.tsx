import apiEndpoints from "@/api"
import { useEffect, useState, useCallback } from "react"

export function Dashboard() {
  const [data, setData] = useState<unknown>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await apiEndpoints.getUserData()
      console.log(111, "user data dashboard:", response)
      setData(response)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return <div>Dashboard Data {JSON.stringify(data)}</div>
}
