import { Avatar, Badge, Box, Button, Card, Container, DataList, Field, Flex, Grid, Heading, HStack, Input, NativeSelect, Stack, Switch, Tabs, Text, Textarea } from "@chakra-ui/react"

const toggles = [["Product updates", "News about features and improvements.", true], ["Security alerts", "Sign-ins from new devices.", true], ["Weekly digest", "A summary of workspace activity.", false]] as const

export default function Settings() {
  return (
    <Container maxW="4xl" py="10">
      <Heading size="2xl" mb="1">Settings</Heading>
      <Text color="fg.muted" mb="6">Manage your profile, notifications and billing.</Text>
      <Tabs.Root defaultValue="profile">
        <Tabs.List><Tabs.Trigger value="profile">Profile</Tabs.Trigger><Tabs.Trigger value="notifications">Notifications</Tabs.Trigger><Tabs.Trigger value="billing">Billing</Tabs.Trigger></Tabs.List>
        <Tabs.Content value="profile">
          <Card.Root><Card.Body gap="5">
            <HStack gap="4"><Avatar.Root size="xl"><Avatar.Fallback name="Dayan Graham" /></Avatar.Root><Button variant="outline" size="sm">Change photo</Button></HStack>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="4">
              <Field.Root><Field.Label>First name</Field.Label><Input defaultValue="Dayan" /></Field.Root>
              <Field.Root><Field.Label>Last name</Field.Label><Input defaultValue="Graham" /></Field.Root>
              <Field.Root><Field.Label>Role</Field.Label><NativeSelect.Root><NativeSelect.Field defaultValue="design"><option value="design">Designer</option><option value="eng">Engineer</option></NativeSelect.Field><NativeSelect.Indicator /></NativeSelect.Root></Field.Root>
              <Field.Root><Field.Label>Email</Field.Label><Input defaultValue="dayan@acme.co" /></Field.Root>
            </Grid>
            <Field.Root><Field.Label>Bio</Field.Label><Textarea rows={3} placeholder="Tell us about yourself" /><Field.HelperText>Shown on your public profile.</Field.HelperText></Field.Root>
          </Card.Body><Card.Footer justifyContent="flex-end"><Button variant="ghost">Cancel</Button><Button>Save changes</Button></Card.Footer></Card.Root>
        </Tabs.Content>
        <Tabs.Content value="notifications">
          <Card.Root><Card.Body gap="5">
            {toggles.map(([t, d, on]) => (
              <Flex key={t} justify="space-between" align="center" gap="4">
                <Box><Text fontWeight="medium">{t}</Text><Text fontSize="sm" color="fg.muted">{d}</Text></Box>
                <Switch.Root defaultChecked={on}><Switch.HiddenInput /><Switch.Control><Switch.Thumb /></Switch.Control></Switch.Root>
              </Flex>
            ))}
          </Card.Body></Card.Root>
        </Tabs.Content>
        <Tabs.Content value="billing">
          <Card.Root><Card.Header><Flex justify="space-between"><Card.Title>Current plan</Card.Title><Badge colorPalette="brand">Pro</Badge></Flex></Card.Header>
            <Card.Body><DataList.Root orientation="horizontal">
              {[["Price", "$29 / month"], ["Renews", "Dec 14, 2026"], ["Payment", "Visa ending 4242"]].map(([k, v]) => <DataList.Item key={k}><DataList.ItemLabel>{k}</DataList.ItemLabel><DataList.ItemValue>{v}</DataList.ItemValue></DataList.Item>)}
            </DataList.Root></Card.Body>
            <Card.Footer><Button variant="outline">Manage plan</Button><Button colorPalette="red" variant="subtle">Cancel subscription</Button></Card.Footer></Card.Root>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  )
}
