import { Button } from "@components/ui/button"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/")
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My App</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            This is your private dashboard. Only authenticated users can see this page.
          </p>
        </div>
      </main>
    </div>
  )
}
