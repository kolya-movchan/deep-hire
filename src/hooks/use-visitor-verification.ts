import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react"
import client from "@/api/graphql/client"
import { VERIFY_VISITOR } from "@/api/graphql/mutations"
import { VerifyVisitorMutation, VerifyVisitorVariables } from "@/api/graphql/types"

export function useVisitorVerification() {
  const {
    isLoading,
    // error,
    data: visitorData,
  } = useVisitorData({ extendedResult: false }, { immediate: true })

  const visitorId = visitorData?.visitorId || ""

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

    return data?.verifyVisitor
  }

  if (!isLoading) {
    validateVisitor()
  }

  console.log("Visitor data ===>", visitorData?.visitorId)

  return { visitorId: visitorData?.visitorId }
}
