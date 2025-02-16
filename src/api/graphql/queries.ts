import { gql } from "@apollo/client"

// Define GraphQL Query
export const GET_USER_DATA = gql`
  query GetUserData($userId: String!) {
    getUserData(userId: $userId) {
      userId
      email
      credits
      role
    }
  }
`
