import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

export const pages = ["dashboard", "pricing", "signin", "settings"] as const
export type PageId = (typeof pages)[number]

export const glyph = (d: string, size: "xs" | "sm" | "md" = "sm") => (
  <Icon size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  </Icon>
)
export const icons = {
  home: "M3 10.5 12 3l9 7.5V21H3z",
  chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  card: "M2 5h20v14H2zM2 10h20",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.5a7 7 0 0 0-2.2 1.3l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.5a7 7 0 0 0 2.2-1.3l2.3 1 2-3.4-2-1.5c.1-.4.1-.9.1-1.3",
  search: "m21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14",
  check: "M20 6 9 17l-5-5",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0",
}

export function Shell({ page, onNav, children }: { page: PageId; onNav: (p: PageId) => void; children: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Box minH="100vh" bg="bg">
      <Flex position="sticky" top="0" zIndex="sticky" bg="bg.panel" borderBottomWidth="1px" px="4" py="2" gap="3" align="center" wrap="wrap">
        <Text fontWeight="semibold" fontSize="sm">Arc × Chakra demos</Text>
        <HStack gap="1" flex="1">
          {pages.map((p) => (
            <Button key={p} size="sm" variant={p === page ? "subtle" : "ghost"} textTransform="capitalize" onClick={() => onNav(p)} data-testid={`nav-${p}`}>
              {p === "signin" ? "Sign in" : p}
            </Button>
          ))}
        </HStack>
        <Button size="sm" variant="outline" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? "Light" : "Dark"} mode
        </Button>
      </Flex>
      {children}
    </Box>
  )
}
