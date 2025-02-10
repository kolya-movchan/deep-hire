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
