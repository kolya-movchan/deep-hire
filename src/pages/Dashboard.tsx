import apiEndpoints from "@/api"
import { useEffect, useState, useCallback } from "react"

interface DashboardData {
  // Define your data structure here
  [key: string]: unknown
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null | unknown>(null)

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

  return <div>Dashboard Data: {JSON.stringify(data)}</div>
}
