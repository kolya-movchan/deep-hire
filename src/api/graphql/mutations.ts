import { gql } from "@apollo/client"

export const VERIFY_VISITOR = gql`
  mutation VerifyVisitor($visitorId: String!) {
    verifyVisitor(visitorId: $visitorId) {
      isAllowed
      fingerprintId
      balance
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!) {
    createUser(email: $email, name: $name) {
      email
      name
    }
  }
`
// not used
export const CREATE_ANON_USER = gql`
  mutation CreateAnonUser($id: String!) {
    createAnonUser(userId: $id) {
      userId
      role
      credits
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
