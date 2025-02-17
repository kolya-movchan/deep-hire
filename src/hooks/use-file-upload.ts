import { useState } from "react"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { v4 as uuidv4 } from "uuid"

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

    const uniqueId = uuidv4()

    const fileKey = userId
      ? `uploads/${userId}/${uniqueId}-${file.name}`
      : `uploads/${uniqueId}-${file.name}`

    try {
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
