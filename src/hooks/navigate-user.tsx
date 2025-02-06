import { getCurrentUser } from "aws-amplify/auth"
import { NavigateFunction } from "react-router-dom"

export const navigateLoggedInUser = async (navigate: NavigateFunction) => {
  const user = await getCurrentUser()

  if (user) {
    navigate("/dashboard")
  }
}
