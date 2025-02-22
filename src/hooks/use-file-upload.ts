import { useState } from "react"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { v4 as uuidv4 } from "uuid"
import { CreditCosts } from "@/types/credits"
import { CreditAction } from "@/types/credits"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { deductCredits } from "@/store/credits-slice"
import { useAppDispatch } from "@/store/hooks"
import { useVisitorVerification } from "./use-visitor-verification"

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
  const { balance } = useSelector((state: RootState) => state.credits)
  const dispatch = useAppDispatch()

  const { visitorId } = useVisitorVerification()

  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = async (file: File, userId?: string) => {
    setIsUploading(true)
    setError(null)

    const user_id = userId || visitorId ? `anon-${visitorId}` : null
    console.log("visitor ===>", visitorId)
    console.log("user_id ===>", user_id)

    try {
      console.log("balance ===>", balance)

      if (user_id) {
        console.log(111, balance)

        if (balance && balance < CreditCosts[CreditAction.PARSE_CV]) {
          throw new Error("Not enough credits")
        }

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

        const deductResponse = await dispatch(deductCredits(user_id))

        if (!deductResponse.payload) {
          throw new Error("Failed to deduct credits")
        }

        if (!uploadResponse.ok) {
          throw new Error("Upload failed")
        }

        setIsUploading(false)
        return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`
      }
    } catch (err) {
      setError(err as Error)
      setIsUploading(false)
      throw err
    }
  }

  return { uploadFile, isUploading, error }
}
