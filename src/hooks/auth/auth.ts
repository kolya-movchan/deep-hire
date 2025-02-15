import {
  fetchAuthSession,
  signOut,
  signIn,
  getCurrentUser,
  AuthUser,
  confirmSignUp,
  signUp,
  AuthSession,
} from "aws-amplify/auth"
import { NavigateFunction } from "react-router-dom"
import { RegisterInput } from "../../types/auth"

export const register = async (input: RegisterInput) => {
  try {
    const signUpResult = await signUp({
      username: input.email,
      password: input.password,
      options: {
        userAttributes: {
          email: input.email,
          name: input.fullName,
        },
      },
    })
    return signUpResult
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export const confirmRegistration = async (username: string, confirmationCode: string) => {
  try {
    await confirmSignUp({
      username,
      confirmationCode,
    })
  } catch (error) {
    console.error("Error confirming user:", error)
    throw error
  }
}

export const logIn = async (username: string, password: string) => {
  const signInResult = await signIn({
    username,
    password,
  })

  console.log("signInResult:", signInResult)

  return signInResult
}

export const singOut = async (
  setIsLoggedIn: (value: boolean | null) => void,
  navigate: NavigateFunction
) => {
  try {
    await signOut()
    setIsLoggedIn(false)
    navigate("/")
  } catch (error) {
    console.error("Error signing out:", error)
  }
}

export const checkAuthStatus = async (setIsLoggedIn: (value: boolean | null) => void) => {
  try {
    const session = await fetchAuthSession()
    console.log("session:", session)
    setIsLoggedIn(!!session.tokens)
  } catch {
    setIsLoggedIn(false)
  }
}

export const checkUser = async (
  setAuthUser: (user: AuthUser | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  try {
    const user = await getCurrentUser()
    setAuthUser(user)
    console.log("Current user:", user)
  } catch {
    console.log("Not signed in")
    setAuthUser(null)
  } finally {
    setIsLoading(false)
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const session: AuthSession = await fetchAuthSession()
    if (!session.tokens?.idToken?.toString()) {
      return null
    }
    return session.tokens.idToken.toString()
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}
