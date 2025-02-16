import client from "./client"
import { GET_USER_DATA } from "./queries"

export const fetchUserData = async (userId: string) => {
  try {
    const { data } = await client.query({
      query: GET_USER_DATA,
      variables: { userId },
    })

    return data.getUserData
  } catch (error) {
    console.error("GraphQL Query Failed:", error)
    throw error
  }
}
