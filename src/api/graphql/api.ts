import client from "./client"
import { CREATE_USER } from "./mutations"
import { GET_FULL_USER_DATA } from "./queries"
import { User } from "./types"

export const fetchUserData = async (userId: string): Promise<User> => {
  try {
    const { data } = await client.query<{ getUserData: User }>({
      query: GET_FULL_USER_DATA,
      variables: { userId },
    })

    return data.getUserData
  } catch (error) {
    console.error("GraphQL Query Failed:", error)
    throw error
  }
}

export const createUser = async (email: string, name: string): Promise<User> => {
  try {
    const { data } = await client.mutate<{ createUser: User }>({
      mutation: CREATE_USER,
      variables: { email, name },
    })

    if (!data) {
      throw new Error("No data returned from createUser mutation")
    }

    return data.createUser
  } catch (error) {
    console.error("GraphQL Mutation Failed:", error)
    throw error
  }
}
