import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getToken } from "../rest/auth"

// Create the http link
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_APP_SYNC_URL,
})

// List of operations that only require API key
const apiKeyOnlyOperations = [
  "CreateAnonUser",
  "GetCredits",
  "DeductCredits",
  "VerifyVisitor",
  "GetCandidateSummary",
  "GetAllCandidateAnalyses",
  "GetMatchPosition",
  "getAllCandidatesMatch",
]

// Create the auth link
const authLink = setContext(async (_, { headers, operationName }) => {
  // Common headers for all requests
  const commonHeaders = {
    ...headers,
    "Content-Type": "application/json",
  }

  // For operations that only need API key
  if (apiKeyOnlyOperations.includes(operationName)) {
    return {
      headers: {
        ...commonHeaders,
        "x-api-key": import.meta.env.VITE_APP_SYNC_API_KEY,
      },
    }
  }

  // For all other operations, use bearer token without API key
  const token = await getToken()
  return {
    headers: {
      ...commonHeaders,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Create the Apollo Client with the auth link
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
