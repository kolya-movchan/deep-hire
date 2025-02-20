import { AuthUser } from "aws-amplify/auth"

export interface RegisterInput {
  username: string
  email: string
  password: string
  fullName: string
}

export type PasswordRequirement = {
  text: string
  regex: RegExp
  met: boolean
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}
