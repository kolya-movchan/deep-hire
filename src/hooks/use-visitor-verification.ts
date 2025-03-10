import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react"
import client from "@/api/graphql/client"
import { VERIFY_VISITOR } from "@/api/graphql/mutations"
import { VerifyVisitorMutation, VerifyVisitorVariables } from "@/api/graphql/types"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { useEffect } from "react"
import { setNewVisitorData, setVisitorError, setVisitorLoading } from "@/store/visitor-slice"
import { updateBalance } from "@/store/credits-slice"

export function useVisitorVerification() {
  const { isLoading: fingerprintLoading, data: fingerprintData } = useVisitorData(
    { extendedResult: false },
    { immediate: true }
  )
  const dispatch = useDispatch()
  const visitorData = useSelector((state: RootState) => state.visitor.fingerprintId)

  console.log("fingerprintData ===>", fingerprintData)

  const visitorId = fingerprintData?.meta.version || ""

  console.log(111, visitorId)

  useEffect(() => {
    const validateVisitor = async () => {
      dispatch(setVisitorLoading(true))
      try {
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
          dispatch(
            setNewVisitorData({
              fingerprintId: visitorId,
            })
          )

          console.log("Verify Visitor ===>", data.verifyVisitor)

          dispatch(updateBalance(data.verifyVisitor.balance))
        }
      } catch (error) {
        dispatch(setVisitorError("Failed to verify visitor."))
      } finally {
        dispatch(setVisitorLoading(false))
      }
    }

    if (fingerprintData && !fingerprintLoading && !visitorData) {
      validateVisitor()
    }
  }, [fingerprintData, fingerprintLoading, visitorId, visitorData, dispatch])

  return { fingerPrintId: visitorId }
}




