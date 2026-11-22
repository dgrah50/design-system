import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: [".trycloudflare.com"] },
  // Pre-bundle every dependency up front. Without this, a cold cache discovers some of them lazily while the first page
  // loads, Vite re-optimizes and force-reloads the page, and a test that was mid-flight loses its `data-theme` seed.
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react/jsx-dev-runtime", "@chakra-ui/react", "@chakra-ui/react/anatomy", "@emotion/react", "next-themes"],
  },
})
