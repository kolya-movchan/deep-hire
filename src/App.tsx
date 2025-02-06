import { Provider } from "react-redux"
import { store } from "./store"
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./routes/app-routes"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  )
}

export default App
