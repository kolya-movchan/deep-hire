import { Amplify } from "aws-amplify"
import config from "../../../config.json"

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
