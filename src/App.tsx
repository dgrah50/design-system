import {
  Accordion,
  ActionBar,
  Alert,
  Avatar,
  Badge,
  Blockquote,
  Box,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CheckboxCard,
  Clipboard,
  CloseButton,
  Code,
  CodeBlock,
  Collapsible,
  ColorPicker,
  Combobox,
  DataList,
  DateInput,
  DatePicker,
  Dialog,
  Drawer,
  Editable,
  EmptyState,
  Field,
  Fieldset,
  FileUpload,
  Flex,
  Float,
  For,
  Grid,
  HStack,
  Heading,
  HoverCard,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Kbd,
  Link,
  List,
  Listbox,
  Mark,
  Menu,
  NativeSelect,
  NumberInput,
  Pagination,
  PinInput,
  Popover,
  Portal,
  Progress,
  QrCode,
  RadioCard,
  RadioGroup,
  RatingGroup,
  ScrollArea,
  SegmentGroup,
  Select,
  Separator,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Slider,
  Spinner,
  Stack,
  Stat,
  Status,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TagsInput,
  Text,
  Textarea,
  Timeline,
  Toast,
  Toaster,
  Toggle,
  Tooltip,
  TreeView,
  createListCollection,
  createToaster,
  createTreeCollection,
  parseColor,
} from "@chakra-ui/react"
import { useTheme } from "next-themes"
import { useState } from "react"
import type { CSSProperties, ReactNode } from "react"

const fruits = createListCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Dragon fruit", value: "dragon" },
  ],
})

const palettes = ["gray", "brand", "teal", "blue", "cyan", "purple", "pink", "red", "orange", "yellow", "green"] as const
const headingSizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"] as const
const controlSizes = ["xs", "sm", "md", "lg", "xl"] as const
const progressSizes = ["xs", "sm", "md", "lg", "xl"] as const
const alertVariants = ["subtle", "surface", "outline", "solid"] as const


export const toaster = createToaster({ placement: "bottom-end", pauseOnPageIdle: true })

function AppToaster() {
  return (
    <Portal>
      <Toaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }} data-testid={`toast-${toast.type}`}>
            {toast.type === "loading" ? <Spinner size="sm" /> : <Toast.Indicator />}
            <Box flex="1" maxW="100%" display="flex" flexDirection="column" gap="0.5">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Box>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && <Toast.CloseTrigger data-testid="toast-close" />}
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  )
}

const glyph = (d: string) => (
  <Icon size="sm">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  </Icon>
)
const ChevronL = () => glyph("m15 18-6-6 6-6")
const ChevronR = () => glyph("m9 18 6-6-6-6")
const Plus = () => glyph("M12 5v14M5 12h14")
const CalendarGlyph = () => glyph("M8 3v4M16 3v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z")
const InfoGlyph = () => glyph("M12 8v4M12 16h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z")

const treeCollection = createTreeCollection<{ id: string; name: string; children?: any[] }>({
  nodeToValue: (n) => n.id,
  nodeToString: (n) => n.name,
  rootNode: {
    id: "ROOT",
    name: "",
    children: [
      { id: "src", name: "src", children: [{ id: "app", name: "App.tsx" }, { id: "theme", name: "theme", children: [{ id: "idx", name: "index.ts" }] }] },
      { id: "readme", name: "README.md" },
    ],
  },
})
const fruitList = createListCollection({ items: [{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }, { label: "Cherry", value: "cherry" }] })
/**
 * Chakra's generated prop types only know the recipes Chakra ships. Pagination, Clipboard and Toggle get their `size` /
 * `variant` from recipes this theme adds, so those props reach the component at runtime but not its TypeScript type.
 */
const extra = (props: Record<string, unknown>) => props as any
const sizes3 = ["sm", "md", "lg"] as const
const toastTypes = ["success", "error", "warning", "info", "loading"] as const

function ActionBarDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Checkbox.Root checked={open} onCheckedChange={(e) => setOpen(!!e.checked)}>
        <Checkbox.HiddenInput data-testid="actionbar-toggle" />
        <Checkbox.Control />
        <Checkbox.Label>Show action bar</Checkbox.Label>
      </Checkbox.Root>
      <ActionBar.Root open={open}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content data-testid="actionbar">
              <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                Delete
              </Button>
              <Button size="sm">Share</Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  )
}

function Section({ title, children, id, wide }: { title: string; children: ReactNode; id?: string; wide?: boolean }) {
  return (
    <Card.Root id={id} data-testid={id} gridColumn={wide ? { lg: "1 / -1" } : undefined}>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Body gap="4" pt="0">
        {children}
      </Card.Body>
    </Card.Root>
  )
}

function SelectDemo({ size }: { size: "sm" | "md" | "lg" }) {
  return (
    <Select.Root collection={fruits} size={size} width="100%">
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger data-testid={`select-trigger-${size}`}>
          <Select.ValueText placeholder={`Select (${size})`} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content data-testid={`select-content-${size}`}>
            {fruits.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

export default function App() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  return (
    <Box minH="100vh" py="10">
      <Stack maxW="1180px" mx="auto" px="6" gap="6">
        <Flex justify="space-between" align="center" gap="4" wrap="wrap">
          <Stack gap="1">
            <Heading as="h1" size="4xl">
              Arc for Chakra
            </Heading>
            <Text color="fg.muted">Every restyled component, {dark ? "dark" : "light"} mode.</Text>
          </Stack>
          <Button id="mode-toggle" variant="outline" onClick={() => setTheme(dark ? "light" : "dark")}>
            {dark ? "Switch to light" : "Switch to dark"}
          </Button>
        </Flex>

        <Stack gap="1" data-testid="page-text">
          <Text data-testid="page-fg">Body text on the page background (fg).</Text>
          <Text color="fg.muted" data-testid="page-fg-muted">
            Muted text on the page background (fg.muted).
          </Text>
          <Text color="fg.subtle" data-testid="page-fg-subtle">
            Subtle text on the page background (fg.subtle).
          </Text>
        </Stack>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="6" alignItems="start">
          <Section title="Type scale" id="sec-scale" wide>
            {headingSizes.map((size) => (
              <Heading key={size} size={size} data-testid={`heading-${size}`}>
                Heading {size}
              </Heading>
            ))}
          </Section>

          <Section title="Text colours on a card" id="sec-text-colours">
            <Text data-testid="card-fg">Body text on a card (fg).</Text>
            <Text color="fg.muted" data-testid="card-fg-muted">
              Muted text on a card (fg.muted).
            </Text>
            <Text color="fg.subtle" data-testid="card-fg-subtle">
              Subtle text on a card (fg.subtle).
            </Text>
          </Section>

          <Section title="Typography" id="sec-type">
            <Heading size="5xl">Display 72</Heading>
            <Heading size="4xl">Display 52</Heading>
            <Heading size="3xl">Heading 36 Geist</Heading>
            <Heading size="2xl">Heading 28 Inter</Heading>
            <Heading size="xl">Heading 22</Heading>
            <Heading size="lg">Heading 18</Heading>
            <Text>Body text at 14px with a -0.01em tracking and 1.4 leading. Numerals 0123456789.</Text>
            <Text fontFamily="mono" textStyle="sm">
              Geist Mono 0123456789
            </Text>
          </Section>

          <Section title="Buttons" id="sec-buttons">
            <HStack wrap="wrap" gap="3">
              <Button id="btn-solid-md" data-testid="btn-solid-md">
                Solid md
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="surface">Surface</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="plain">Plain</Button>
              <Button disabled>Disabled</Button>
            </HStack>
            <HStack wrap="wrap" gap="3">
              {controlSizes.map((size) => (
                <Button key={size} size={size} data-testid={`btn-size-${size}`}>
                  {size}
                </Button>
              ))}
            </HStack>
            <HStack wrap="wrap" gap="3">
              {palettes.map((p) => (
                <Button key={p} colorPalette={p} size="sm" variant="solid" data-testid={`btn-solid-${p}`}>
                  {p}
                </Button>
              ))}
            </HStack>
          </Section>

          <Section title="Fields" id="sec-fields">
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input id="input-md" data-testid="input-md" placeholder="you@example.com" />
              <Field.HelperText>We will never share it.</Field.HelperText>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Invalid</Field.Label>
              <Input id="input-invalid" defaultValue="nope" />
              <Field.ErrorText>That does not look right.</Field.ErrorText>
            </Field.Root>
            <Stack gap="3">
              {controlSizes.map((size) => (
                <Input key={size} size={size} placeholder={`Input ${size}`} data-testid={`input-size-${size}`} />
              ))}
              <Input disabled placeholder="Disabled" />
            </Stack>
            <Textarea id="textarea-md" placeholder="Textarea" />
            <NativeSelect.Root>
              <NativeSelect.Field id="native-select" defaultValue="apple">
                <option value="apple">Apple</option>
                <option value="banana">Banana</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NumberInput.Root defaultValue="12" width="100%">
              <NumberInput.Control />
              <NumberInput.Input id="number-input" />
            </NumberInput.Root>
            <PinInput.Root count={4} defaultValue={["1", "2"]}>
              <PinInput.HiddenInput />
              <PinInput.Control>
                {[0, 1, 2, 3].map((i) => (
                  <PinInput.Input key={i} index={i} />
                ))}
              </PinInput.Control>
            </PinInput.Root>
            <Stack gap="3">
              <SelectDemo size="sm" />
              <SelectDemo size="md" />
              <SelectDemo size="lg" />
            </Stack>
            <Combobox.Root collection={fruits} openOnClick>
              <Combobox.Control>
                <Combobox.Input placeholder="Combobox" data-testid="combobox-input" />
                <Combobox.IndicatorGroup>
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>
              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content data-testid="combobox-content">
                    {fruits.items.map((item) => (
                      <Combobox.Item item={item} key={item.value}>
                        {item.label}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Portal>
            </Combobox.Root>
          </Section>

          <Section title="Selection" id="sec-selection">
            <HStack gap="6" wrap="wrap">
              <Checkbox.Root defaultChecked>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Checked</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root>
                <Checkbox.HiddenInput data-testid="checkbox-unchecked-input" />
                <Checkbox.Control data-testid="checkbox-unchecked-control" />
                <Checkbox.Label>Unchecked</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root defaultChecked colorPalette="brand">
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Brand</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root disabled>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Disabled</Checkbox.Label>
              </Checkbox.Root>
            </HStack>
            <RadioGroup.Root defaultValue="a">
              <HStack gap="6">
                {["a", "b", "c"].map((v) => (
                  <RadioGroup.Item key={v} value={v}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>Option {v.toUpperCase()}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </HStack>
            </RadioGroup.Root>
            <HStack gap="6" wrap="wrap">
              <Switch.Root defaultChecked id="switch-on">
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>On</Switch.Label>
              </Switch.Root>
              <Switch.Root>
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Off</Switch.Label>
              </Switch.Root>
              <Switch.Root defaultChecked colorPalette="brand">
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Brand</Switch.Label>
              </Switch.Root>
            </HStack>
            <Slider.Root defaultValue={[40]} width="100%">
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
            <Slider.Root defaultValue={[65]} width="100%" colorPalette="brand">
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
          </Section>

          <Section title="Badges and tags" id="sec-badges">
            <HStack wrap="wrap" gap="2">
              {palettes.map((p) => (
                <Badge key={p} colorPalette={p} variant="subtle" data-testid={`badge-subtle-${p}`}>
                  {p} 12
                </Badge>
              ))}
            </HStack>
            <HStack wrap="wrap" gap="2">
              <Badge size="sm">sm 20</Badge>
              <Badge size="md" id="badge-md">
                md 24
              </Badge>
              <Badge size="lg">lg 28</Badge>
              <Badge variant="outline">outline</Badge>
              <Badge variant="solid">solid</Badge>
            </HStack>
            <HStack wrap="wrap" gap="2">
              {palettes.slice(0, 5).map((p) => (
                <Tag.Root key={p} colorPalette={p}>
                  <Tag.Label>{p} tag</Tag.Label>
                </Tag.Root>
              ))}
              <Tag.Root variant="outline">
                <Tag.Label>outline</Tag.Label>
              </Tag.Root>
            </HStack>
          </Section>

          <Section title="Cards" id="sec-cards">
            <Grid templateColumns="1fr 1fr" gap="4">
              <Card.Root data-testid="card-default">
                <Card.Body>
                  <Card.Title>Default</Card.Title>
                  <Card.Description>No variant prop.</Card.Description>
                </Card.Body>
              </Card.Root>
              <Card.Root variant="outline" id="card-outline">
                <Card.Body>
                  <Card.Title>Outline</Card.Title>
                  <Card.Description>Border, no shadow.</Card.Description>
                </Card.Body>
              </Card.Root>
              <Card.Root variant="elevated" id="card-elevated">
                <Card.Body>
                  <Card.Title>Elevated</Card.Title>
                  <Card.Description>shadow.md.</Card.Description>
                </Card.Body>
              </Card.Root>
            </Grid>
            <Stat.Root>
              <Stat.Label>Revenue</Stat.Label>
              <Stat.ValueText>$12,480.00</Stat.ValueText>
              <Stat.HelpText>+12.5% from last month</Stat.HelpText>
            </Stat.Root>
          </Section>

          <Section title="Overlays" id="sec-overlays">
            <HStack wrap="wrap" gap="3">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button variant="outline" id="open-dialog" data-testid="open-dialog">
                    Dialog
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content data-testid="dialog-content">
                      <Dialog.Header>
                        <Dialog.Title>Delete project</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Text color="fg.muted">This removes the project and its history. This cannot be undone.</Text>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button>Delete</Button>
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <Button variant="outline" data-testid="open-drawer">
                    Drawer
                  </Button>
                </Drawer.Trigger>
                <Portal>
                  <Drawer.Backdrop />
                  <Drawer.Positioner>
                    <Drawer.Content data-testid="drawer-content">
                      <Drawer.Header>
                        <Drawer.Title>Settings</Drawer.Title>
                      </Drawer.Header>
                      <Drawer.Body>
                        <Text color="fg.muted">Drawer body.</Text>
                      </Drawer.Body>
                    </Drawer.Content>
                  </Drawer.Positioner>
                </Portal>
              </Drawer.Root>

              <Menu.Root>
                {/*
                  Do not give this trigger an `id`. Menu.Trigger asChild merges the child's props over Zag's, so a custom
                  id replaces `menu:<id>:trigger`; the menu machine then cannot find its trigger, never computes a
                  position and leaves the positioner at translate3d(var(--x,0), var(--y,-100vh)). To use a custom id,
                  pass it as <Menu.Root ids={{ trigger: "..." }}>.
                */}
                <Menu.Trigger asChild>
                  <Button variant="outline" data-testid="open-menu">
                    Menu
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content data-testid="menu-content">
                      <Menu.Item value="new">New file</Menu.Item>
                      <Menu.Item value="open">Open</Menu.Item>
                      <Menu.Separator />
                      <Menu.Item value="delete">Delete</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button variant="outline" id="open-popover" data-testid="open-popover">
                    Popover
                  </Button>
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content data-testid="popover-content">
                      <Popover.Body>
                        <Popover.Title fontWeight="medium">Share</Popover.Title>
                        <Text color="fg.muted" mt="1">
                          Anyone with the link can view.
                        </Text>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>

              <Tooltip.Root openDelay={0} positioning={{ placement: "top" }}>
                <Tooltip.Trigger asChild>
                  <Button variant="outline" id="open-tooltip" data-testid="open-tooltip">
                    Tooltip
                  </Button>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content data-testid="tooltip-content">
                      Saved to your library
                      <Tooltip.Arrow>
                        <Tooltip.ArrowTip />
                      </Tooltip.Arrow>
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
          </Section>

          <Section title="Tabs and segments" id="sec-tabs">
            <Tabs.Root defaultValue="one" variant="enclosed">
              <Tabs.List id="tabs-enclosed">
                <Tabs.Trigger value="one">Overview</Tabs.Trigger>
                <Tabs.Trigger value="two">Activity</Tabs.Trigger>
                <Tabs.Trigger value="three">Settings</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="one">Overview content</Tabs.Content>
              <Tabs.Content value="two">Activity content</Tabs.Content>
              <Tabs.Content value="three">Settings content</Tabs.Content>
            </Tabs.Root>
            <Tabs.Root defaultValue="one" variant="line">
              <Tabs.List>
                <Tabs.Trigger value="one">Line one</Tabs.Trigger>
                <Tabs.Trigger value="two">Line two</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            <SegmentGroup.Root defaultValue="day">
              <SegmentGroup.Indicator />
              <SegmentGroup.Items items={["day", "week", "month"]} />
            </SegmentGroup.Root>
          </Section>

          <Section title="Feedback" id="sec-feedback">
            {alertVariants.map((variant) => (
              <Alert.Root key={variant} status="info" variant={variant} data-testid={`alert-${variant}`}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Alert {variant}</Alert.Title>
                  <Alert.Description>Only the icon takes the status colour.</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            ))}
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Payment failed</Alert.Title>
                <Alert.Description>Check your card details and try again.</Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <Alert.Root status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Saved</Alert.Title>
                <Alert.Description>Your changes are live.</Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Almost full</Alert.Title>
                <Alert.Description>You have used 92% of storage.</Alert.Description>
              </Alert.Content>
            </Alert.Root>
            {progressSizes.map((size) => (
              <Progress.Root key={size} value={60} size={size} data-testid={`progress-${size}`}>
                <Progress.Track data-testid={`progress-track-${size}`}>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            ))}
            <Progress.Root value={35} colorPalette="brand">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Stack gap="2">
              <Skeleton height="14px" />
              <Skeleton height="14px" width="70%" />
            </Stack>
          </Section>

          <Section title="Data" id="sec-data">
            <HStack gap="3">
              <Avatar.Root>
                <Avatar.Fallback name="Ada Lovelace" />
              </Avatar.Root>
              <Avatar.Root size="lg">
                <Avatar.Fallback name="Grace Hopper" />
              </Avatar.Root>
              <Avatar.Root size="xl">
                <Avatar.Fallback name="Alan Turing" />
              </Avatar.Root>
            </HStack>
            <Separator />
            <Table.Root id="table">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Plan</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Seats</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {[
                  ["Starter", "5", "$19.00"],
                  ["Team", "25", "$99.00"],
                  ["Scale", "250", "$1,249.00"],
                ].map(([a, b, c]) => (
                  <Table.Row key={a}>
                    <Table.Cell>{a}</Table.Cell>
                    <Table.Cell textAlign="end">{b}</Table.Cell>
                    <Table.Cell textAlign="end">{c}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Accordion.Root collapsible defaultValue={["a"]}>
              {[
                ["a", "What is Arc?"],
                ["b", "Can I use it with Chakra?"],
              ].map(([v, t]) => (
                <Accordion.Item key={v} value={v}>
                  <Accordion.ItemTrigger>
                    <Box flex="1">{t}</Box>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>Arc is a component library with one pastel family and one ink.</Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Section>

          <Section title="Arc bridge" id="sec-bridge">
            <Text color="fg.muted">
              These use only Arc CSS variables (no Chakra props). The first row is under the root palette, the second under
              colorPalette=&quot;brand&quot;, the third under teal.
            </Text>
            {(["gray", "brand", "teal"] as const).map((p) => (
              <Box key={p} colorPalette={p} data-testid={`arc-scope-${p}`}>
                <div
                  data-testid={`arc-probe-${p}`}
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    alignItems: "center",
                    padding: "var(--space-3)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-panel)",
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    boxShadow: "var(--shadow-resting)",
                  }}
                >
                  <button
                    data-testid={`accent-button-${p}`}
                    style={{
                      minHeight: "var(--control-height-md)",
                      padding: "0 var(--space-4)",
                      border: "1px solid transparent",
                      borderRadius: "var(--radius-control)",
                      background: "var(--accent)",
                      color: "var(--accent-foreground)",
                      font: "inherit",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "transform var(--duration-spring) var(--ease-spring)",
                    }}
                  >
                    Arc button ({p})
                  </button>
                  <span style={{ color: "var(--accent-strong)", background: "var(--accent-subtle)", padding: "2px 10px", borderRadius: 6, fontSize: "var(--text-xs)" }}>
                    accent-subtle
                  </span>
                  <span style={{ width: 24, height: 24, borderRadius: "var(--radius-pill)", background: "var(--arc-gradient)" }} />
                  <span style={{ color: "var(--danger)" }}>danger</span>
                  <span style={{ color: "var(--success)" }}>success</span>
                </div>
              </Box>
            ))}
            <Box data-testid="scope-root">
              <Text color="fg.muted">Root scope (no palette set here)</Text>
            </Box>
            <Box colorPalette="brand" data-testid="scope-nested-outer">
              <Text>Brand scope</Text>
              <Box colorPalette="teal" data-testid="scope-nested-inner">
                <Text>Teal inside brand</Text>
                <div data-testid="scope-nested-leaf">Plain descendant of the teal scope</div>
              </Box>
              <div data-testid="scope-nested-after">Plain child of the brand scope, after the nested teal one</div>
            </Box>
            <div
              data-testid="accent-override"
              style={{ "--accent": "rgb(255, 0, 255)", padding: "var(--space-3)" } as CSSProperties}
            >
              <span data-testid="accent-override-child" style={{ color: "var(--accent)" }}>
                Descendant of a container that sets --accent in plain CSS
              </span>
            </div>
          </Section>

          <Section title="Toast" id="sec-toast">
            <HStack wrap="wrap">
              {toastTypes.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant="outline"
                  data-testid={`toast-open-${type}`}
                  onClick={() =>
                    toaster.create({ type, title: `${type} toast`, description: "The body stays neutral.", closable: true, action: { label: "Undo", onClick: () => {} } })
                  }
                >
                  {type}
                </Button>
              ))}
            </HStack>
          </Section>

          <Section title="Checkbox and radio cards" id="sec-cards-select">
            <Grid templateColumns="repeat(2, 1fr)" gap="3">
              <CheckboxCard.Root defaultChecked data-testid="cc-checked">
                <CheckboxCard.HiddenInput data-testid="cc-checked-input" />
                <CheckboxCard.Control>
                  <CheckboxCard.Content>
                    <CheckboxCard.Label>Email</CheckboxCard.Label>
                    <CheckboxCard.Description>Weekly digest</CheckboxCard.Description>
                  </CheckboxCard.Content>
                  <CheckboxCard.Indicator />
                </CheckboxCard.Control>
              </CheckboxCard.Root>
              <CheckboxCard.Root data-testid="cc-unchecked">
                <CheckboxCard.HiddenInput data-testid="cc-unchecked-input" />
                <CheckboxCard.Control>
                  <CheckboxCard.Content>
                    <CheckboxCard.Label>SMS</CheckboxCard.Label>
                    <CheckboxCard.Description>Urgent only</CheckboxCard.Description>
                  </CheckboxCard.Content>
                  <CheckboxCard.Indicator />
                </CheckboxCard.Control>
              </CheckboxCard.Root>
            </Grid>
            <For each={["outline", "surface", "subtle", "solid"] as const}>
              {(variant) => (
                <RadioCard.Root key={variant} defaultValue="a" variant={variant}>
                  <HStack align="stretch">
                    {["a", "b"].map((v) => (
                      <RadioCard.Item key={v} value={v} data-testid={`rc-${variant}-${v}`}>
                        <RadioCard.ItemHiddenInput data-testid={`rc-${variant}-${v}-input`} />
                        <RadioCard.ItemControl>
                          <RadioCard.ItemContent>
                            <RadioCard.ItemText data-testid={`rc-${variant}-${v}-label`}>
                              {variant} {v}
                            </RadioCard.ItemText>
                            <RadioCard.ItemDescription data-testid={`rc-${variant}-${v}-desc`}>Plan description</RadioCard.ItemDescription>
                          </RadioCard.ItemContent>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                  </HStack>
                </RadioCard.Root>
              )}
            </For>
          </Section>

          <Section title="Breadcrumb, Pagination, Steps" id="sec-navigation">
            <Breadcrumb.Root>
              <Breadcrumb.List data-testid="breadcrumb">
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#" data-testid="breadcrumb-link">
                    Home
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.CurrentLink data-testid="breadcrumb-current">Theme</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
            <For each={sizes3}>
              {(size) => (
                <Pagination.Root key={size} count={100} pageSize={10} defaultPage={3} {...extra({ size })}>
                  <ButtonGroup variant="ghost" size={size} gap="1" data-testid={`pagination-${size}`}>
                    <Pagination.PrevTrigger asChild>
                      <IconButton aria-label="Previous page">
                        <ChevronL />
                      </IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.Items render={(page) => <IconButton aria-label={`Page ${page.value}`}>{page.value}</IconButton>} />
                    <Pagination.NextTrigger asChild>
                      <IconButton aria-label="Next page">
                        <ChevronR />
                      </IconButton>
                    </Pagination.NextTrigger>
                  </ButtonGroup>
                </Pagination.Root>
              )}
            </For>
            <For each={sizes3}>
              {(size) => (
                <Steps.Root key={size} defaultStep={1} count={3} size={size}>
                  <Steps.List data-testid={`steps-${size}`}>
                    {["Account", "Profile", "Review"].map((t, i) => (
                      <Steps.Item key={t} index={i} title={t}>
                        <Steps.Indicator />
                        <Steps.Title>{t}</Steps.Title>
                        <Steps.Separator />
                      </Steps.Item>
                    ))}
                  </Steps.List>
                </Steps.Root>
              )}
            </For>
          </Section>

          <Section title="Timeline and TreeView" id="sec-timeline">
            <Timeline.Root data-testid="timeline">
              {["Created", "Reviewed", "Merged"].map((t) => (
                <Timeline.Item key={t}>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>
                      <Plus />
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>{t}</Timeline.Title>
                    <Timeline.Description>2 minutes ago</Timeline.Description>
                  </Timeline.Content>
                </Timeline.Item>
              ))}
            </Timeline.Root>
            <Timeline.Root variant="solid" size="lg" data-testid="timeline-solid">
              {["Opened", "Closed"].map((t, i) => (
                <Timeline.Item key={t}>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>{i + 1}</Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>{t}</Timeline.Title>
                  </Timeline.Content>
                </Timeline.Item>
              ))}
            </Timeline.Root>
            <TreeView.Root collection={treeCollection} defaultExpandedValue={["src"]} defaultSelectedValue={["app"]} maxW="sm" data-testid="tree">
              <TreeView.Tree>
                <TreeView.Node
                  indentGuide={<TreeView.BranchIndentGuide />}
                  render={({ node, nodeState }) =>
                    nodeState.isBranch ? (
                      <TreeView.BranchControl>
                        <TreeView.BranchIndicator>
                          <ChevronR />
                        </TreeView.BranchIndicator>
                        <TreeView.BranchText>{node.name}</TreeView.BranchText>
                      </TreeView.BranchControl>
                    ) : (
                      <TreeView.Item>
                        <TreeView.ItemText>{node.name}</TreeView.ItemText>
                      </TreeView.Item>
                    )
                  }
                />
              </TreeView.Tree>
            </TreeView.Root>
          </Section>

          <Section title="Rating, FileUpload, Editable" id="sec-inputs-a">
            <For each={sizes3}>
              {(size) => (
                <RatingGroup.Root key={size} count={5} defaultValue={3} size={size} colorPalette="orange" data-testid={`rating-${size}`}>
                  <RatingGroup.HiddenInput />
                  <RatingGroup.Control />
                </RatingGroup.Root>
              )}
            </For>
            <FileUpload.Root maxFiles={3} data-testid="fileupload">
              <FileUpload.HiddenInput data-testid="fileupload-input" />
              <FileUpload.Dropzone>
                <FileUpload.DropzoneContent>
                  <Box>Drop files here</Box>
                  <Box color="fg.subtle" textStyle="xs" fontWeight="normal">
                    PNG or JPG up to 5MB
                  </Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
              <FileUpload.List showSize clearable />
            </FileUpload.Root>
            <For each={sizes3}>
              {(size) => (
                <Editable.Root key={size} defaultValue={`Editable ${size}`} size={size} data-testid={`editable-${size}`}>
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
              )}
            </For>
          </Section>

          <Section title="ColorPicker, TagsInput, Listbox" id="sec-inputs-b">
            <ColorPicker.Root defaultValue={parseColor("#7747ff")} maxW="220px">
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>Colour</ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Input />
                <ColorPicker.Trigger data-testid="cp-trigger" />
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content data-testid="cp-content">
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="xs" variant="outline" />
                      <ColorPicker.Sliders />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>
            <For each={sizes3}>
              {(size) => (
                <TagsInput.Root key={size} defaultValue={["design", "arc"]} size={size}>
                  <TagsInput.Control data-testid={`tags-${size}`}>
                    <TagsInput.Items />
                    <TagsInput.Input placeholder="Add tag" />
                  </TagsInput.Control>
                  <TagsInput.HiddenInput />
                </TagsInput.Root>
              )}
            </For>
            <Listbox.Root collection={fruitList} defaultValue={["banana"]} maxW="240px" data-testid="listbox">
              <Listbox.Label>Fruit</Listbox.Label>
              <Listbox.Content>
                {fruitList.items.map((it) => (
                  <Listbox.Item key={it.value} item={it}>
                    <Listbox.ItemText>{it.label}</Listbox.ItemText>
                    <Listbox.ItemIndicator />
                  </Listbox.Item>
                ))}
              </Listbox.Content>
            </Listbox.Root>
          </Section>

          <Section title="DatePicker and DateInput" id="sec-dates">
            <DateInput.Root maxW="260px">
              <DateInput.Label>Segmented date</DateInput.Label>
              <DateInput.Control>
                <DateInput.Segments />
              </DateInput.Control>
            </DateInput.Root>
            <For each={sizes3}>
              {(size) => (
                <DatePicker.Root key={size} size={size} maxW="260px">
                  <DatePicker.Label>Date ({size})</DatePicker.Label>
                  <DatePicker.Control>
                    <DatePicker.Input data-testid={`date-${size}`} />
                    <DatePicker.IndicatorGroup>
                      <DatePicker.Trigger data-testid={`date-trigger-${size}`} aria-label={`Open calendar (${size})`}>
                        <CalendarGlyph />
                      </DatePicker.Trigger>
                    </DatePicker.IndicatorGroup>
                  </DatePicker.Control>
                  <Portal>
                    <DatePicker.Positioner>
                      <DatePicker.Content data-testid={`date-content-${size}`}>
                        <DatePicker.View view="day">
                          <DatePicker.Header />
                          <DatePicker.DayTable />
                        </DatePicker.View>
                        <DatePicker.View view="month">
                          <DatePicker.Header />
                          <DatePicker.MonthTable />
                        </DatePicker.View>
                        <DatePicker.View view="year">
                          <DatePicker.Header />
                          <DatePicker.YearTable />
                        </DatePicker.View>
                      </DatePicker.Content>
                    </DatePicker.Positioner>
                  </Portal>
                </DatePicker.Root>
              )}
            </For>
          </Section>

          <Section title="HoverCard, Collapsible, Clipboard, ScrollArea, ActionBar" id="sec-layers">
            <HoverCard.Root positioning={{ placement: "bottom-start" }} openDelay={0} closeDelay={0}>
              <HoverCard.Trigger asChild>
                <Link href="#" data-testid="hc-trigger">
                  @arc
                </Link>
              </HoverCard.Trigger>
              <Portal>
                <HoverCard.Positioner>
                  <HoverCard.Content data-testid="hovercard">
                    <HoverCard.Arrow>
                      <HoverCard.ArrowTip />
                    </HoverCard.Arrow>
                    <Text fontWeight="medium">Arc</Text>
                    <Text color="fg.muted">A calm component library.</Text>
                  </HoverCard.Content>
                </HoverCard.Positioner>
              </Portal>
            </HoverCard.Root>
            <Collapsible.Root defaultOpen>
              <Collapsible.Trigger asChild>
                <Button variant="outline" size="sm">
                  Toggle{" "}
                  <Collapsible.Indicator>
                    <ChevronR />
                  </Collapsible.Indicator>
                </Button>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Box py="3" color="fg.muted">
                  Collapsible content.
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>
            <HStack wrap="wrap">
              <For each={sizes3}>
                {(size) => (
                  <Clipboard.Root key={size} value="npm i arc" {...extra({ size })}>
                    <Clipboard.Control>
                      <Clipboard.Trigger data-testid={`clip-${size}`}>
                        <Clipboard.Indicator />
                        <Clipboard.CopyText />
                      </Clipboard.Trigger>
                    </Clipboard.Control>
                  </Clipboard.Root>
                )}
              </For>
            </HStack>
            <Clipboard.Root value="https://uiarc.dev" maxW="sm">
              <Clipboard.Label>Share link</Clipboard.Label>
              <InputGroup
                endElement={
                  <Clipboard.Trigger asChild>
                    <IconButton variant="ghost" size="xs" aria-label="Copy">
                      <Clipboard.Indicator />
                    </IconButton>
                  </Clipboard.Trigger>
                }
              >
                <Clipboard.Input asChild>
                  <Input />
                </Clipboard.Input>
              </InputGroup>
            </Clipboard.Root>
            <ScrollArea.Root height="8rem" maxW="sm" borderWidth="1px" borderRadius="l2" variant="always" data-testid="scrollarea">
              <ScrollArea.Viewport>
                <ScrollArea.Content p="3" spaceY="2">
                  {Array.from({ length: 20 }, (_, i) => (
                    <Text key={i}>Row {i + 1}</Text>
                  ))}
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
              <ScrollArea.Corner />
            </ScrollArea.Root>
            <ActionBarDemo />
          </Section>

          <Section title="Toggle, icon buttons, addons" id="sec-toggles">
            <HStack bg="bg.subtle" borderWidth="1px" borderRadius="l2" p="1" gap="0.5" alignSelf="start">
              <For each={sizes3}>
                {(size) => (
                  <Toggle.Root key={size} {...extra({ size })} defaultPressed={size === "md"} data-testid={`toggle-${size}`}>
                    <Toggle.Indicator fallback="Off">On</Toggle.Indicator>
                  </Toggle.Root>
                )}
              </For>
            </HStack>
            <HStack>
              <For each={["subtle", "outline", "solid"] as const}>
                {(v) => (
                  <Toggle.Root key={v} {...extra({ variant: v })} defaultPressed data-testid={`toggle-variant-${v}`}>
                    {v}
                  </Toggle.Root>
                )}
              </For>
            </HStack>
            <HStack>
              <For each={sizes3}>
                {(s) => (
                  <IconButton key={s} size={s} variant="outline" aria-label="Add" data-testid={`iconbtn-${s}`}>
                    <Plus />
                  </IconButton>
                )}
              </For>
              <For each={sizes3}>{(s) => <CloseButton key={s} size={s} data-testid={`close-${s}`} />}</For>
            </HStack>
            <For each={sizes3}>
              {(s) => (
                <InputGroup key={s} startAddon="https://" endAddon=".com" maxW="320px">
                  <Input size={s} placeholder={`addon ${s}`} data-testid={`addon-input-${s}`} />
                </InputGroup>
              )}
            </For>
          </Section>

          <Section title="Text primitives" id="sec-text-primitives">
            <Text data-testid="text-line">
              Press <Kbd data-testid="kbd">⌘</Kbd> <Kbd>K</Kbd> or run <Code data-testid="code">npm run dev</Code>. Read the{" "}
              <Link href="#" data-testid="link-plain">
                docs
              </Link>{" "}
              or the{" "}
              <Link href="#" variant="underline" data-testid="link-underline">
                changelog
              </Link>
              . A <Mark variant="subtle">highlighted</Mark> word.
            </Text>
            <HStack>
              <For each={["subtle", "surface", "outline", "solid", "plain"] as const}>{(v) => <Code key={v} variant={v}>{v}</Code>}</For>
              <For each={sizes3}>{(s) => <Kbd key={s} size={s}>Esc</Kbd>}</For>
            </HStack>
            <Separator />
            <HStack h="5">
              <Text>One</Text>
              <Separator orientation="vertical" />
              <Text>Two</Text>
            </HStack>
            <HStack>
              <For each={["xs", "sm", "md", "lg", "xl"] as const}>{(s) => <Spinner key={s} size={s} />}</For>
              <Button loading size="sm">
                Saving
              </Button>
            </HStack>
            <HStack>
              <Status.Root colorPalette="green">
                <Status.Indicator />
                Online
              </Status.Root>
              <Status.Root colorPalette="red">
                <Status.Indicator />
                Failed
              </Status.Root>
              <Status.Root colorPalette="orange">
                <Status.Indicator />
                Pending
              </Status.Root>
              <Status.Root colorPalette="blue">
                <Status.Indicator />
                Info
              </Status.Root>
            </HStack>
            <DataList.Root orientation="horizontal">
              {[
                ["Status", "Active"],
                ["Plan", "Pro"],
              ].map(([k, v]) => (
                <DataList.Item key={k}>
                  <DataList.ItemLabel>{k}</DataList.ItemLabel>
                  <DataList.ItemValue>{v}</DataList.ItemValue>
                </DataList.Item>
              ))}
            </DataList.Root>
            <Blockquote.Root>
              <Blockquote.Content cite="Arc">Colour appears only through the palette.</Blockquote.Content>
              <Blockquote.Caption>
                Arc, <cite>design rules</cite>
              </Blockquote.Caption>
            </Blockquote.Root>
            <List.Root>
              <List.Item>Hairline borders</List.Item>
              <List.Item>No resting shadow</List.Item>
            </List.Root>
          </Section>

          <Section title="EmptyState, CodeBlock, Fieldset, QrCode" id="sec-blocks">
            <For each={["sm", "md"] as const}>
              {(size) => (
                <EmptyState.Root key={size} size={size}>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <InfoGlyph />
                    </EmptyState.Indicator>
                    <Stack textAlign="center" gap="1">
                      <EmptyState.Title>No results</EmptyState.Title>
                      <EmptyState.Description>Try a different search term.</EmptyState.Description>
                    </Stack>
                    <Button size="sm" variant="outline">
                      Clear filters
                    </Button>
                  </EmptyState.Content>
                </EmptyState.Root>
              )}
            </For>
            {/* Chakra forces a dark scheme on CodeBlock unless meta.colorScheme says otherwise, so follow the app's mode. */}
            <CodeBlock.Root code={"const arc = true\nexport default arc"} language="ts" meta={{ showLineNumbers: true, colorScheme: dark ? "dark" : "light" }} data-testid="codeblock">
              <CodeBlock.Header>
                <CodeBlock.Title>arc.ts</CodeBlock.Title>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" aria-label="Copy code">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content>
                <CodeBlock.Code>
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
            <Fieldset.Root invalid>
              <Fieldset.Legend>Notifications</Fieldset.Legend>
              <Fieldset.Content>
                <Checkbox.Root>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Email</Checkbox.Label>
                </Checkbox.Root>
              </Fieldset.Content>
              <Fieldset.HelperText>Choose how we reach you.</Fieldset.HelperText>
              <Fieldset.ErrorText>Pick at least one.</Fieldset.ErrorText>
            </Fieldset.Root>
            <QrCode.Root value="https://uiarc.dev" size="md" data-testid="qr">
              <QrCode.Frame>
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
          </Section>

          <Section title="Skeleton, Float and Stat extras" id="sec-extras">
            <SkeletonText noOfLines={3} />
            <HStack>
              <SkeletonCircle size="10" />
              <Skeleton height="4" width="40" variant="shine" />
            </HStack>
            <Box position="relative" w="fit-content">
              <Avatar.Root size="lg">
                <Avatar.Fallback name="Ada Lovelace" />
              </Avatar.Root>
              <Float placement="top-end" offsetX="1" offsetY="1">
                <Badge colorPalette="red" variant="solid" size="sm" outline="2px solid" outlineColor="bg.panel">
                  3
                </Badge>
              </Float>
            </Box>
            <HStack gap="8" alignItems="flex-start">
              <Stat.Root>
                <Stat.Label>Revenue</Stat.Label>
                <Stat.ValueText>$12,400</Stat.ValueText>
                <Badge colorPalette="green" gap="0" alignSelf="flex-start" data-testid="stat-up">
                  <Stat.UpIndicator />
                  12%
                </Badge>
              </Stat.Root>
              <Stat.Root>
                <Stat.Label>Churn</Stat.Label>
                <Stat.ValueText>
                  2.4<Stat.ValueUnit>%</Stat.ValueUnit>
                </Stat.ValueText>
                <Stat.HelpText data-testid="stat-down">
                  <Stat.DownIndicator />
                  0.4 vs last month
                </Stat.HelpText>
              </Stat.Root>
            </HStack>
          </Section>
        </Grid>
      </Stack>
      <AppToaster />
    </Box>
  )
}
