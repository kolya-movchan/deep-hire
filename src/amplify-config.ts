import { Amplify } from "aws-amplify"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "YOUR_USER_POOL_ID",
      userPoolClientId: "YOUR_USER_POOL_CLIENT_ID",
      region: "YOUR_REGION", // e.g., 'us-east-1'
    },
  },
})
