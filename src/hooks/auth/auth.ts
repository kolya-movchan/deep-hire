import {
  fetchAuthSession,
  signOut,
  signIn,
  getCurrentUser,
  AuthUser,
  confirmSignUp,
  signUp,
} from "aws-amplify/auth"
import { NavigateFunction } from "react-router-dom"

export const logIn = async (username: string, password: string) => {
  const signInResult = await signIn({
    username,
    password,
  })

  return signInResult
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

export const navigateLoggedInUser = async (navigate: NavigateFunction) => {
  const user = await getCurrentUser()

  if (user) {
    navigate("/dashboard")
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

export interface RegisterInput {
  username: string
  email: string
  password: string
  fullName: string
}

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

interface RegistrationForm {
  fullName: string
  email: string
  password: string
  username: string
}

interface RegistrationResult {
  isSignUpComplete: boolean
  userId: string
  nextStep: string
}

interface PasswordValidationResult {
  isValid: boolean
  requirements: PasswordRequirement[]
}

interface PasswordRequirement {
  text: string
  regex: RegExp
  met: boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { text: "Minimum 8 characters", regex: /.{8,}/, met: false },
  { text: "At least 1 number", regex: /\d/, met: false },
  { text: "At least 1 lowercase letter", regex: /[a-z]/, met: false },
  { text: "At least 1 uppercase letter", regex: /[A-Z]/, met: false },
  {
    text: "At least 1 special character ($*.[]{}-!@#/\\,><':;_~+=)",
    regex: /[$*.[\]{}\-!@#/\\,><':;_~+=]/,
    met: false,
  },
]

export const validatePassword = (password: string): PasswordValidationResult => {
  const updatedRequirements = passwordRequirements.map((req) => ({
    ...req,
    met: req.regex.test(password),
  }))

  return {
    isValid: updatedRequirements.every((req) => req.met),
    requirements: updatedRequirements,
  }
}

export const handleRegistration = async (
  formData: RegistrationForm
): Promise<RegistrationResult> => {
  const validationResult = validatePassword(formData.password)

  if (!validationResult.isValid) {
    throw new Error("Password requirements not met")
  }

  try {
    const result = await register({
      ...formData,
      username: formData.email,
    })
    return result
  } catch (error) {
    throw new Error("Registration failed: " + (error as Error).message)
  }
}

export const handleConfirmation = async (
  email: string,
  confirmationCode: string
): Promise<void> => {
  try {
    await confirmRegistration(email, confirmationCode)
  } catch (error) {
    throw new Error("Confirmation failed: " + (error as Error).message)
  }
}
