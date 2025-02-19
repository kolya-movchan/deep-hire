import { gql } from "@apollo/client"

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

export const CHECK_CREDITS = gql`
  mutation CheckCredits($userId: String!, $action: String!, $requiredCredits: Int!) {
    checkCredits(userId: $userId, action: $action, requiredCredits: $requiredCredits) {
      allowed
      credits
      message
    }
  }
`

export const DEDUCT_CREDITS = gql`
  mutation DeductCredits($userId: String!, $action: String!, $requiredCredits: Int!) {
    deductCredits(userId: $userId, action: $action, requiredCredits: $requiredCredits) {
      message
      creditsRequired
      creditsUsed
      balance
    }
  }
`
