import App from "./app"
import "./index.css"
import { createRoot } from "react-dom/client"
import "./amplify-config"

createRoot(document.getElementById("root")!).render(<App />)
