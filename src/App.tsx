import { Provider } from "react-redux"
import { store } from "./store"
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./routes/app-routes"
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react"

function App() {
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: import.meta.env.VITE_FINGERPRINT_API_KEY,
        region: "eu",
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </FpjsProvider>
  )
}

export default App
