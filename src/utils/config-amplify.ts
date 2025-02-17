import { Amplify } from "aws-amplify"
import config from "../../config.json"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "YOUR_USER_POOL_ID",
      userPoolClientId: "YOUR_USER_POOL_CLIENT_ID",
      region: "YOUR_REGION", // e.g., 'us-east-1'
    },
  },
})

export const configAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.amplify.userPoolId,
        userPoolClientId: config.amplify.userPoolClientId,
      },
    },
  })
}
