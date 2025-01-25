import { useState } from "react"
import { useEffect } from "react"
import { fetchAuthSession, signOut } from "aws-amplify/auth"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsLoggedIn(false)
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const checkAuthStatus = async () => {
    try {
      const session = await fetchAuthSession()
      console.log("session:", session)
      setIsLoggedIn(!!session.tokens)
    } catch {
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return (
    <header className="border-b backdrop-blur-sm bg-white/70 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            AI Flex
          </h1>
        </Link>
        <div className="space-x-4">
          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="hover:bg-purple-50 text-purple-700"
              onClick={handleSignOut}
            >
              Log Out
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-purple-50 text-purple-700">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
