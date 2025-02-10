import apiEndpoints from "@/api"
import { useEffect, useState, useCallback } from "react"

export function Dashboard() {
  const [data, setData] = useState<unknown>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await apiEndpoints.getUserData()
      setData(response)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return <div>Dashboard Data: {data as string}</div>
}
