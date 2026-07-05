import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./app/App.jsx"
import { AppProviders } from "./app/store/providers.jsx"

createRoot(document.getElementById("root")).render(
  <AppProviders>
    <App />
  </AppProviders>
)