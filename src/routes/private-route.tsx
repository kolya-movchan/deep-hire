import React, { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { getCurrentUser } from "aws-amplify/auth"

const PrivateRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuthStatus = async (): Promise<void> => {
      try {
        await getCurrentUser()
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Show nothing while checking authentication
  if (isLoading) {
    return null // Or return a loading spinner component if you have one
  }

  // Only redirect when we're sure the user is not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
