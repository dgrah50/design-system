import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { system } from "./theme"

/**
 * next-themes sets both `class` (Chakra's `.dark` condition) and `data-theme`
 * (a few Arc modules select on :root[data-theme="dark"]).
 */
export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider
        attribute={["class", "data-theme"]}
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        // next-themes renders a pre-hydration <script>. React 19 logs console.error for executable scripts rendered on the client
        // (and this SPA has no server render to flash-guard), so mark it as a non-executable data block.
        scriptProps={{ type: "application/json" }}
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
