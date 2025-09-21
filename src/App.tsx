import { Provider } from "react-redux"
import { store } from "./store"
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./routes/app-routes"
// import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react" // Temporarily disabled FingerprintJS for access

function App() {
  return (
    // <FpjsProvider
    //   loadOptions={{
    //     apiKey: import.meta.env.VITE_FINGERPRINT_API_KEY,
    //     region: "eu",
    //   }}
    // >
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
    // </FpjsProvider>
    // FingerprintJS temporarily disabled - re-enable when needed
  )
}

export default App
