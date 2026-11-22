import { Avatar, Badge, Box, Button, Card, Flex, Grid, Heading, HStack, Input, InputGroup, Progress, Stack, Stat, Table, Text } from "@chakra-ui/react"
import { glyph, icons } from "./shared"

const nav = [["Overview", "home"], ["Analytics", "chart"], ["Customers", "users"], ["Billing", "card"], ["Settings", "cog"]] as const
const stats = [
  ["Monthly revenue", "$48,290", "12.4%", "up"],
  ["Active users", "12,408", "4.1%", "up"],
  ["Churn rate", "2.3%", "0.6%", "down"],
  ["Avg. session", "6m 42s", "1.2%", "up"],
] as const
const rows = [
  ["Olivia Martin", "olivia@acme.co", "Pro", "Active", "$299.00"],
  ["Jackson Lee", "jackson@globex.io", "Team", "Active", "$1,199.00"],
  ["Isabella Nguyen", "isabella@initech.com", "Starter", "Trial", "$0.00"],
  ["William Kim", "will@umbrella.dev", "Pro", "Past due", "$299.00"],
  ["Sofia Davis", "sofia@hooli.com", "Team", "Active", "$1,199.00"],
]
const bars = [38, 52, 44, 61, 58, 72, 66, 80, 74, 91, 84, 96]
const statusColor = { Active: "green", Trial: "blue", "Past due": "red" } as const

export default function Dashboard() {
  return (
    <Grid templateColumns={{ base: "1fr", md: "240px 1fr" }} minH="calc(100vh - 53px)">
      <Stack display={{ base: "none", md: "flex" }} bg="bg.panel" borderEndWidth="1px" p="4" gap="1">
        <Heading size="md" px="3" py="2" mb="2">Acme</Heading>
        {nav.map(([label, ic], i) => (
          <Button key={label} variant={i === 0 ? "subtle" : "ghost"} justifyContent="flex-start" size="md">{glyph(icons[ic])}{label}</Button>
        ))}
        <Card.Root mt="auto" variant="subtle" size="sm">
          <Card.Body gap="2">
            <Text fontSize="sm" fontWeight="medium">Storage 74% used</Text>
            <Progress.Root value={74} size="sm"><Progress.Track><Progress.Range /></Progress.Track></Progress.Root>
            <Button size="sm" variant="outline">Upgrade</Button>
          </Card.Body>
        </Card.Root>
      </Stack>
      <Stack p={{ base: "4", md: "8" }} gap="6" minW="0">
        <Flex justify="space-between" align="center" gap="3" wrap="wrap">
          <Box><Heading size="2xl">Overview</Heading><Text color="fg.muted">Welcome back, here is what is happening today.</Text></Box>
          <HStack>
            <InputGroup startElement={glyph(icons.search)} maxW="64"><Input placeholder="Search" /></InputGroup>
            <Button>New report</Button>
            <Avatar.Root><Avatar.Fallback name="Dayan Graham" /></Avatar.Root>
          </HStack>
        </Flex>
        <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", xl: "repeat(4, 1fr)" }} gap="4">
          {stats.map(([l, v, d, dir]) => (
            <Card.Root key={l}><Card.Body>
              <Stat.Root>
                <Stat.Label>{l}</Stat.Label><Stat.ValueText>{v}</Stat.ValueText>
                <Badge colorPalette={dir === "up" ? "green" : "red"} variant="subtle" w="fit-content">{dir === "up" ? "↑" : "↓"} {d}</Badge>
              </Stat.Root>
            </Card.Body></Card.Root>
          ))}
        </Grid>
        <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap="4">
          <Card.Root>
            <Card.Header><Card.Title>Revenue</Card.Title><Card.Description>Last 12 months</Card.Description></Card.Header>
            <Card.Body>
              <Flex h="48" align="flex-end" gap="2">
                {bars.map((h, i) => <Box key={i} flex="1" h={`${h}%`} bg={i === bars.length - 1 ? "colorPalette.solid" : "colorPalette.muted"} borderRadius="sm" />)}
              </Flex>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Header><Card.Title>Goals</Card.Title></Card.Header>
            <Card.Body gap="4">
              {[["New signups", 82], ["Trial conversions", 56], ["Support SLA", 94]].map(([l, v]) => (
                <Stack key={l} gap="1.5"><Flex justify="space-between"><Text fontSize="sm">{l}</Text><Text fontSize="sm" color="fg.muted">{v}%</Text></Flex>
                  <Progress.Root value={v as number} size="sm"><Progress.Track><Progress.Range /></Progress.Track></Progress.Root></Stack>
              ))}
            </Card.Body>
          </Card.Root>
        </Grid>
        <Card.Root>
          <Card.Header><Card.Title>Recent customers</Card.Title></Card.Header>
          <Card.Body overflowX="auto">
            <Table.Root>
              <Table.Header><Table.Row>
                <Table.ColumnHeader>Customer</Table.ColumnHeader><Table.ColumnHeader>Plan</Table.ColumnHeader><Table.ColumnHeader>Status</Table.ColumnHeader><Table.ColumnHeader textAlign="end">MRR</Table.ColumnHeader>
              </Table.Row></Table.Header>
              <Table.Body>
                {rows.map(([n, e, p, s, m]) => (
                  <Table.Row key={e}>
                    <Table.Cell><HStack><Avatar.Root size="sm"><Avatar.Fallback name={n} /></Avatar.Root><Box><Text fontWeight="medium">{n}</Text><Text fontSize="xs" color="fg.muted">{e}</Text></Box></HStack></Table.Cell>
                    <Table.Cell>{p}</Table.Cell>
                    <Table.Cell><Badge colorPalette={statusColor[s as keyof typeof statusColor]} variant="subtle">{s}</Badge></Table.Cell>
                    <Table.Cell textAlign="end">{m}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Grid>
  )
}
