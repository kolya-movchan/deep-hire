import { Header } from "@/react-components/header"

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">You are logged in!</h2>
          <p className="mt-4 text-gray-600">Welcome to your dashboard</p>
        </div>
      </main>
    </div>
  )
}
