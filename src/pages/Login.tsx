import React from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"

export const Login = () => {
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
              Welcome Back
            </h2>
            <p className="text-gray-600 text-center mt-2">Please sign in to continue</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input type="password" placeholder="Enter your password" />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
