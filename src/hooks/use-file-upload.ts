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
  const dispatch = useAppDispatch()
  const { balance } = useSelector((state: RootState) => state.credits)
  const { fingerprintId } = useSelector((state: RootState) => state.visitor)

  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = async (file: File, vacancyUrl: string, userId?: string) => {
    setIsUploading(true)
    setError(null)

    const anonUser = fingerprintId ?? null
    const user_id = userId || anonUser

    console.log("visitor ===>", fingerprintId)
    console.log("user ===>", userId)
    console.log("user_id ===>", user_id)

    try {
      console.log("balance ===>", balance)

      if (user_id) {
        // console.log(111, balance)
        // console.log(111, CreditCosts[CreditAction.PARSE_CV])

        if (balance && balance < CreditCosts[CreditAction.PARSE_CV]) {
          throw new Error("Not enough credits")
        }

        const uniqueFileId = uuidv4()
        const fileId = file.name.replace(/\s+/g, "-")
        const fileKey = `uploads/${uniqueFileId}-${fileId}`
        const fileSlug = `${uniqueFileId}-${fileId}`

        // Generate a pre-signed URL
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
          ContentType: file.type,
          Metadata: { userId: user_id, vacancyUrl },
        })

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 })

        console.log("signedUrl ===>", signedUrl)

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

        console.log("fileUrl ===>", `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`)
        console.log("fileSlug ===>", fileSlug)

        return {
          fileUrl: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`,
          fileSlug,
        }
      }
    } catch (err) {
      setError(err as Error)
      setIsUploading(false)
      throw err
    }
  }

  return { uploadFile, isUploading, error }
}
