import { getToken } from "@/hooks/auth/auth"
import { useEffect, useState } from "react"

interface DashboardData {
  // Define your data structure here
  [key: string]: unknown
}

export function Dashboard() {
  const [data] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken()

        console.log(222, "token ===>", token)

        if (!token) {
          setError("Unable to get authentication token")
          return
        }

        // const response = await fetch("https://your-api.com/protected-data", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // })
        // const result = await response.json()
        // setData(result)
      } catch (err) {
        setError("Error fetching data")
        console.error("Error:", err)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return <div>Dashboard Data: {JSON.stringify(data)}</div>
}

// import { Header } from "@/react-components/header"

// export const Dashboard = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
//       <Header />

//       <main className="container mx-auto px-6 py-16">
//         <div className="max-w-md mx-auto text-center">
//           <h2 className="text-3xl font-bold text-gray-800">You are logged in!</h2>
//           <p className="mt-4 text-gray-600">Welcome to your dashboard</p>
//         </div>
//       </main>
//     </div>
//   )
// }
