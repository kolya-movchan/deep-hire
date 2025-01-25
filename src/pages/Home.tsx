import { Header } from "@/react-components/Header"

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <Header />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Transform Your Experience with My App
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who have already discovered our exclusive features. Start your
            journey today and unlock a world of possibilities.
          </p>

          <div className="pt-12 grid grid-cols-3 gap-8 text-center">
            {[
              { stat: "10K+", label: "Active Users" },
              { stat: "99.9%", label: "Uptime" },
              { stat: "24/7", label: "Support" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg"
              >
                <div className="text-3xl font-bold text-purple-600">{item.stat}</div>
                <div className="text-gray-600 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
