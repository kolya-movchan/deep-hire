import { gql } from "@apollo/client"

export const GET_FULL_USER_DATA = gql`
  query GetUserData($userId: String!) {
    getUserData(userId: $userId) {
      userId
      email
      name
      credits
      role
    }
  }
`

export const GET_CREDITS = gql`
  query GetCredits($userId: String!) {
    getCredits(userId: $userId) {
      balance
      message
    }
  }
`

export const GET_CANDIDATE_DATA = gql`
  query GetCandidateData($id: String!) {
    getCandidateData(id: $id) {
      id
      userId
      name
      title
      contact
      summary
      education {
        id
        institution
        degree
        field
        startDate
        endDate
        description
      }
      experience {
        id
        company
        position
        startDate
        endDate
        description
      }
      skills
      tools
      certifications
      projects {
        id
        name
        description
        technologies
        url
      }
      languages {
        name
        proficiency
      }
      createdAt
    }
  }
`
