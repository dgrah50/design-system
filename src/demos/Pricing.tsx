import { Badge, Box, Button, Card, Container, Flex, Grid, Heading, List, SegmentGroup, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { glyph, icons } from "./shared"

const plans = [
  { name: "Starter", price: [0, 0], blurb: "For side projects and tinkering.", features: ["3 projects", "1,000 events / mo", "Community support"], cta: "Get started" },
  { name: "Pro", price: [29, 24], blurb: "For growing teams shipping weekly.", features: ["Unlimited projects", "100k events / mo", "Priority support", "Custom domains"], cta: "Start free trial", featured: true },
  { name: "Team", price: [99, 82], blurb: "For companies with compliance needs.", features: ["Everything in Pro", "SSO & audit logs", "99.9% SLA", "Dedicated manager"], cta: "Contact sales" },
]

export default function Pricing() {
  const [cycle, setCycle] = useState("monthly")
  const i = cycle === "monthly" ? 0 : 1
  return (
    <Container maxW="6xl" py={{ base: "12", md: "20" }}>
      <Stack align="center" textAlign="center" gap="4" mb="12">
        <Badge variant="subtle">Pricing</Badge>
        <Heading size={{ base: "3xl", md: "5xl" }}>Simple plans that scale with you</Heading>
        <Text color="fg.muted" maxW="lg" fontSize="lg">Start free, upgrade when you are ready. No hidden fees, cancel any time.</Text>
        <SegmentGroup.Root value={cycle} onValueChange={(e) => setCycle(e.value!)}>
          <SegmentGroup.Indicator /><SegmentGroup.Items items={[{ value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly (save 17%)" }]} />
        </SegmentGroup.Root>
      </Stack>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6" alignItems="stretch">
        {plans.map((p) => (
          <Card.Root key={p.name} variant={p.featured ? "elevated" : "outline"} borderColor={p.featured ? "colorPalette.solid" : undefined} borderWidth={p.featured ? "2px" : undefined}>
            <Card.Header>
              <Flex justify="space-between"><Card.Title>{p.name}</Card.Title>{p.featured && <Badge colorPalette="brand">Most popular</Badge>}</Flex>
              <Card.Description>{p.blurb}</Card.Description>
            </Card.Header>
            <Card.Body gap="6">
              <Flex align="baseline" gap="1"><Heading size="5xl">${p.price[i]}</Heading><Text color="fg.muted">/ month</Text></Flex>
              <List.Root gap="2" variant="plain">
                {p.features.map((f) => <List.Item key={f}><List.Indicator color="colorPalette.fg">{glyph(icons.check)}</List.Indicator>{f}</List.Item>)}
              </List.Root>
            </Card.Body>
            <Card.Footer><Button w="full" variant={p.featured ? "solid" : "outline"}>{p.cta}</Button></Card.Footer>
          </Card.Root>
        ))}
      </Grid>
      <Box mt="12" textAlign="center"><Text color="fg.muted">Questions? <Text as="span" color="fg" fontWeight="medium">Talk to our team</Text></Text></Box>
    </Container>
  )
}
