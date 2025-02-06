/* eslint-disable import/order */
import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { configAmplify } from "../hooks/auth/config-amplify"
import { register, confirmRegistration } from "../hooks/auth/auth"
import { Eye, EyeOff } from "lucide-react"

interface RegisterForm {
  fullName: string
  email: string
  password: string
}

interface PasswordRequirement {
  text: string
  regex: RegExp
  met: boolean
}

const passwordRequirements: PasswordRequirement[] = [
  {
    text: "Minimum 8 characters",
    regex: /.{8,}/,
    met: false,
  },
  {
    text: "At least 1 number",
    regex: /\d/,
    met: false,
  },
  {
    text: "At least 1 lowercase letter",
    regex: /[a-z]/,
    met: false,
  },
  {
    text: "At least 1 uppercase letter",
    regex: /[A-Z]/,
    met: false,
  },
  {
    text: "At least 1 special character ($*.[]{}-!@#/\\,><':;_~+=)",
    regex: /[$*.[\]{}\-!@#/\\,><':;_~+=]/,
    met: false,
  },
]

export const Register = () => {
  configAmplify()
  const navigate = useNavigate()
  const requirementsRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
  })
  const [confirmationCode, setConfirmationCode] = useState<string>("")
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRequirements, setShowRequirements] = useState<boolean>(false)
  const [requirements, setRequirements] = useState<PasswordRequirement[]>(passwordRequirements)

  useEffect(() => {
    const updatedRequirements = requirements.map((req) => ({
      ...req,
      met: req.regex.test(formData.password),
    }))
    setRequirements(updatedRequirements)
  }, [formData.password])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (requirementsRef.current && !requirementsRef.current.contains(event.target as Node)) {
        setShowRequirements(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const allRequirementsMet = requirements.every((req) => req.met)
    if (!allRequirementsMet) {
      setShowRequirements(true)
      return
    }

    try {
      const { isSignUpComplete, userId, nextStep } = await register({
        ...formData,
        username: formData.email,
      })

      console.log("isSignUpComplete:", isSignUpComplete)
      console.log("userId:", userId)
      console.log("nextStep:", nextStep)
      setIsConfirming(true)
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  const handleConfirm = async () => {
    try {
      await confirmRegistration(formData.email, confirmationCode)
      console.log("User confirmed successfully!")
      setIsConfirming(false)
      navigate("/dashboard")
    } catch (error) {
      console.error("Error confirming user:", error)
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
            {!isConfirming ? (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    {showRequirements && (
                      <div
                        ref={requirementsRef}
                        className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-full"
                      >
                        {requirements.map((req, i) => (
                          <div
                            key={i}
                            className={`text-sm ${req.met ? "text-green-600" : "text-red-600"} mb-1`}
                          >
                            {req.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Create Account
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirmation Code</label>
                  <Input
                    type="text"
                    placeholder="Enter confirmation code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleConfirm}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Confirm Account
                </Button>
              </div>
            )}
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
