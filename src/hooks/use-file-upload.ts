import { useState } from "react"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { v4 as uuidv4 } from "uuid"
import { getAnonUserId } from "../helpers/get-anon-user"
import { CreditCosts } from "@/types/credits"
import client from "@/api/graphql/client"
import { DEDUCT_CREDITS } from "@/api/graphql/mutations"
import { CreditAction } from "@/types/credits"
import { DeductCreditsResponse, DeductCreditsVariables } from "@/api/graphql/types"

const REGION = import.meta.env.VITE_PUBLIC_AWS_REGION
const BUCKET_NAME = import.meta.env.VITE_PUBLIC_AWS_BUCKET_NAME
const IDENTITY_POOL_ID = import.meta.env.VITE_PUBLIC_AWS_IDENTITY_POOL_ID

const s3Client = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
})

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = async (file: File, userId?: string) => {
    setIsUploading(true)
    setError(null)

    const user_id = userId ?? (await getAnonUserId())

    console.log("user_id", user_id)

    try {
      // if (!balance) {
      //   throw new Error("Not enough credits")
      // }

      const uniqueFileId = uuidv4()

      const fileKey = `uploads/${uniqueFileId}-${file.name}`

      // Generate a pre-signed URL
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        ContentType: file.type,
      })

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 })

      // Upload directly via Fetch API
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })

      // Deduct credits after successful upload
      const deductResponse = await client.mutate<DeductCreditsResponse, DeductCreditsVariables>({
        mutation: DEDUCT_CREDITS,
        variables: {
          userId: user_id,
          action: CreditAction.PARSE_CV,
          requiredCredits: CreditCosts[CreditAction.PARSE_CV],
        },
        context: {
          operationName: "DeductCredits",
        },
      })

      if (!deductResponse.data) {
        throw new Error("Failed to deduct credits")
      }

      if (!uploadResponse.ok) {
        throw new Error("Upload failed")
      }

      setIsUploading(false)
      return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`
    } catch (err) {
      setError(err as Error)
      setIsUploading(false)
      throw err
    }
  }

  return { uploadFile, isUploading, error }
}
