import { Alert, Box, Button, Card, Checkbox, Field, Flex, Heading, Input, Link, Separator, Stack, Text } from "@chakra-ui/react"

export default function SignIn() {
  return (
    <Flex minH="calc(100vh - 53px)" align="center" justify="center" p="4" bg="bg.subtle">
      <Card.Root w="full" maxW="md" variant="elevated">
        <Card.Header gap="1">
          <Heading size="2xl">Welcome back</Heading>
          <Text color="fg.muted">Sign in to your Acme account</Text>
        </Card.Header>
        <Card.Body gap="5">
          <Flex gap="3">
            <Button variant="outline" flex="1">Google</Button>
            <Button variant="outline" flex="1">GitHub</Button>
          </Flex>
          <Flex align="center" gap="3"><Separator flex="1" /><Text fontSize="xs" color="fg.muted">OR</Text><Separator flex="1" /></Flex>
          <Stack gap="4">
            <Field.Root><Field.Label>Email</Field.Label><Input type="email" placeholder="you@company.com" /></Field.Root>
            <Field.Root invalid><Field.Label>Password</Field.Label><Input type="password" defaultValue="short" /><Field.ErrorText>Password must be at least 8 characters</Field.ErrorText></Field.Root>
            <Flex justify="space-between" align="center">
              <Checkbox.Root defaultChecked><Checkbox.HiddenInput /><Checkbox.Control /><Checkbox.Label>Remember me</Checkbox.Label></Checkbox.Root>
              <Link fontSize="sm">Forgot password?</Link>
            </Flex>
          </Stack>
          <Alert.Root status="info" variant="subtle"><Alert.Indicator /><Alert.Title>SSO is available on the Team plan.</Alert.Title></Alert.Root>
        </Card.Body>
        <Card.Footer flexDirection="column" gap="3">
          <Button w="full" size="lg">Sign in</Button>
          <Box><Text fontSize="sm" color="fg.muted">No account? <Link>Create one</Link></Text></Box>
        </Card.Footer>
      </Card.Root>
    </Flex>
  )
}
