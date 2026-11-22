import "@fontsource-variable/geist"
import "@fontsource-variable/geist-mono"
import "@fontsource-variable/inter"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import Demos from "./demos"
import { Provider } from "./provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      {location.pathname.startsWith("/demos") ? <Demos /> : <App />}
    </Provider>
  </StrictMode>,
)
