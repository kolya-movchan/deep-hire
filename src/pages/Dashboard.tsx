import { useEffect, useState } from "react"
import { fetchUserData } from "@/api/graphql/api"

export const Dashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUserData("90dcc94c-8031-7041-679f-21aa7b40b4a5")
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      {user ? (
        <div>
          <h2>User Profile</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Credits:</strong> {user.credits}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}
