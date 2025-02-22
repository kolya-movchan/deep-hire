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
  user: { userId: string; username: string } | null
  fingerprintId: string | null
  loading: boolean
  visitorLoading: boolean
  error: string | null
}
