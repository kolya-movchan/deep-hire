/* eslint-disable import/order */
import React from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { signUp } from "aws-amplify/auth"
import { configAmplify } from "../hooks/auth/config-amplify"

export const Register = () => {
  configAmplify()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: "testSignUP1@gmail.com",
        password: "hunter2/32-0i3mKLMALSKDNM***",
        options: {
          userAttributes: {
            email: "hello@mycompany.com",
            phone_number: "+15555555555", // E.164 number convention
          },
        },
      })

      console.log("isSignUpComplete:", isSignUpComplete)
      console.log("userId:", userId)
      console.log("nextStep:", nextStep)

      console.log("Registration successful")
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <header className="border-b backdrop-blur-sm bg-white/70 sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              My App
            </h1>
          </Link>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-16">
        <Card className="max-w-md mx-auto bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Create Account
            </h2>
            <p className="text-gray-600 text-center mt-2">Join us and start your journey</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input type="text" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input type="password" placeholder="Create a password" />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                Create Account
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
