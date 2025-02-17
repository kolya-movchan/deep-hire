import App from "./app"
import "./index.css"
import { createRoot } from "react-dom/client"
import "./utils/config-amplify"

createRoot(document.getElementById("root")!).render(<App />)
