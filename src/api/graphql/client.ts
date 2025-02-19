import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getToken } from "../rest/auth"

// Create the http link
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_APP_SYNC_URL,
})

// Create the auth link
const authLink = setContext(async (_, { headers, operationName }) => {
  // For anonymous user creation, use only API key
  if (
    operationName === "CreateAnonUser" ||
    operationName === "CheckCredits" ||
    operationName === "DeductCredits"
  ) {
    return {
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_SYNC_API_KEY,
      },
    }
  }

  // For all other operations, use bearer token without API key
  const token = await getToken()
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
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
