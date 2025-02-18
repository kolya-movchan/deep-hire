import { gql } from "@apollo/client"

export type CreateAnonUserResponse = {
  createAnonUser: {
    userId: string
  }
}

export type CreateAnonUserVariables = {
  id: string
}

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!) {
    createUser(email: $email, name: $name) {
      email
      name
    }
  }
`

export const CREATE_ANON_USER = gql`
  mutation CreateAnonUser($id: String!) {
    createAnonUser(userId: $id) {
      userId
      role
      credits
    }
  }
`
