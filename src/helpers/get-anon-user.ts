import { v4 as uuidv4 } from "uuid"

export const getAnonUserId = () => {
  const storedId = localStorage.getItem("user_id")

  if (storedId) {
    return storedId as string
  }

  const newId = uuidv4()
  localStorage.setItem("user_id", newId)
  return newId
}
