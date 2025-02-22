import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react"
import client from "@/api/graphql/client"
import { VERIFY_VISITOR } from "@/api/graphql/mutations"
import {
  VerificationResult,
  VerifyVisitorMutation,
  VerifyVisitorVariables,
} from "@/api/graphql/types"
import { useState } from "react"

export function useVisitorVerification() {
  const {
    isLoading,
    // error,
    data,
  } = useVisitorData({ extendedResult: false }, { immediate: true })

  const [visitorData, setVisitorData] = useState<VerificationResult | null>(null)

  const visitorId = data?.visitorId || ""

  const validateVisitor = async () => {
    const { data } = await client.mutate<VerifyVisitorMutation, VerifyVisitorVariables>({
      mutation: VERIFY_VISITOR,
      variables: {
        visitorId,
      },
      context: {
        operationName: "VerifyVisitor",
      },
    })

    if (data?.verifyVisitor) {
      setVisitorData(data?.verifyVisitor)
    }
  }

  if (data && !isLoading && !visitorData) {
    validateVisitor()
  }

  console.log("Visitor data ===>", visitorData)

  return { visitor: visitorData }
}
