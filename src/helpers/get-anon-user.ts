import { v4 as uuidv4 } from "uuid"
import client from "../api/graphql/client"
import { CREATE_ANON_USER } from "../api/graphql/mutations"

import { CreateAnonUserResponse, CreateAnonUserVariables } from "../api/graphql/types"

export const getAnonUserId = async (): Promise<string> => {
  const storedId = localStorage.getItem("user_id")

  if (storedId) {
    return storedId
  }

  const newId = `anon-${uuidv4()}`

  try {
    const { data } = await client.mutate<CreateAnonUserResponse, CreateAnonUserVariables>({
      mutation: CREATE_ANON_USER,
      variables: {
        id: newId,
      },
      context: {
        operationName: "CreateAnonUser",
      },
    })

    if (data?.createAnonUser.userId) {
      localStorage.setItem("user_id", newId)
      return newId
    }

    throw new Error("Failed to create anonymous user")
  } catch (error) {
    console.error("Error creating anonymous user:", error)
    throw error
  }
}
