export interface AuthState {
  user: { userId: string; username: string } | null
  loading: boolean
  error: string | null
}

export interface VisitorState {
  fingerprintId: string | null
  loading: boolean
  error: string | null
}

export type CreditsState = {
  balance: number | null
  loading: boolean
  error: string | null
}
