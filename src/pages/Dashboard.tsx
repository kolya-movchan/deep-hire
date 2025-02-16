import { useEffect, useState } from "react"
import { fetchUserData } from "@/api/graphql/api"
import { User } from "@/api/graphql/types"

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUserData("90dcc94c-8031-7041-679f-21aa7b40b4a5")
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Credits: {user.credits}</p>
      <p>Role: {user.role}</p>
    </div>
  )
}
