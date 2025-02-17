import { gql } from "@apollo/client"

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!) {
    createUser(email: $email, name: $name) {
      email
      name
    }
  }
`
