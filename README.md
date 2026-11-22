# Arc for Chakra

A Chakra UI v3 theme that makes Chakra look and feel like [Arc](https://uiarc.dev): same colours, radii, shadows and easings.

## Install

```bash
npm install @chakra-ui/react @emotion/react next-themes \
  @fontsource-variable/geist @fontsource-variable/inter @fontsource-variable/geist-mono
```

Copy `src/theme/` into your app and import the fonts once (see `src/main.tsx`).

## Use the system

```tsx
import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { system } from "./theme"

<ChakraProvider value={system}>
  <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="light" enableSystem={false} disableTransitionOnChange>
    <App />
  </ThemeProvider>
</ChakraProvider>
```

`next-themes` must set **both** `class` (Chakra's `.dark` condition) and `data-theme`, because a few Arc modules select on `:root[data-theme="dark"]`.

`src/App.tsx` is a kitchen sink of every restyled component with a light/dark toggle (`npm run dev`).

## Components covered

Every recipe lives in `src/theme/recipes/` and is registered in `recipes/index.ts`.

| File | Components |
| --- | --- |
| `button.ts`, `badge.ts`, `card.ts` | Button (and IconButton, CloseButton, which inherit it and stay square at 36 / 44 / 50), Badge, Tag, Card |
| `fields.ts`, `selection.ts` | Input, Textarea, Field, Select, NativeSelect, Combobox, NumberInput, PinInput, Checkbox, RadioGroup, Switch, Slider |
| `overlays.ts`, `tabs.ts`, `feedback.ts`, `data.ts` | Dialog, Drawer, Menu, Popover, Tooltip, Tabs, SegmentGroup, Alert, Progress, Skeleton, Table, Avatar, Accordion, Stat (with up / down trend colours), Heading |
| `toast.ts` | Toast / Toaster (neutral body, tinted status chip) |
| `cards.ts` | CheckboxCard, RadioCard |
| `navigation.ts` | Breadcrumb, Pagination, Steps, Timeline, TreeView |
| `inputs.ts` | RatingGroup, FileUpload, Editable, ColorPicker, TagsInput, Listbox, DatePicker, DateInput, Clipboard, Toggle |
| `layers.ts` | HoverCard, Collapsible, ScrollArea, ActionBar |
| `primitives.ts` | Kbd, Code, CodeBlock, Link, Spinner, Status, DataList, Blockquote, List, Mark, EmptyState, InputAddon (InputGroup), Fieldset, Icon, QrCode |

Notes:

- Chakra 3.38 ships no recipe for **Pagination**, **Clipboard** or **Toggle**; this theme adds them (`pagination`, `clipboard`, `toggle` slot recipes). Pagination items are still Buttons or IconButtons, restyled through the slot, so give `Pagination.Root` a `size` (sm 36, md 44, lg 50).
- There is no `ToggleGroup` or `Calendar` export in this Chakra version. Group Toggles in a `bg.subtle` hairline tray; `DatePicker` carries the calendar.
- `CodeBlock` forces a `dark` class unless told otherwise: pass `meta={{ colorScheme }}` with the current mode to follow light / dark.
- `Toast.Indicator` renders nothing for `info` and `loading`; render your own chip or `Spinner` for those.
- Float and Badge combine without a recipe: style the Badge ring with `outline="2px solid" outlineColor="bg.panel"`.

## Arc bridge

`src/theme/arc-bridge.ts` (included in `globalCss`) defines every custom property from Arc's `foundation.css` as an alias of a Chakra token, so Arc components need no `foundation.css` and cannot drift. Aliases to semantic tokens flip with Chakra's colour mode.

The accent group (`--accent`, `--accent-strong`, `--accent-subtle`, `--accent-foreground`, the `--control-*` accent variables and the chart `--series-1..4`) follows the nearest palette scope. It is declared on `:root` and on every element that sets `colorPalette` (a `scopeAccentToPalettes` step in `src/theme/index.ts` adds the aliases to the style block Chakra emits per palette; Chakra puts no class or attribute on such elements, so no CSS selector could find them). Elements that set no palette inherit, so a plain `--accent` override on a container reaches its descendants:

```tsx
<Box colorPalette="brand">{/* Arc components in here use the violet accent */}</Box>
<Box style={{ "--accent": "tomato" }}>{/* descendants inherit this accent */}</Box>
```

`--accent-strong` and the chart series are derived at the scope where they are declared. To make them follow a hand-written `--accent` override too, also add `data-arc-accent` to that container (declared with zero specificity, so your own class or inline style still wins):

```tsx
<Box data-arc-accent style={{ "--accent": "tomato" }} />
```

`scopeAccentToPalettes` extends Chakra's memoised per-palette style objects. If they are not where Chakra 3 puts them (after an upgrade) it does not crash the app: it validates every palette first, patches none, logs one `[arc-bridge] Accent scoping is disabled` console warning and returns `false`. Arc components then follow the root palette only (the aliases still exist on `:root`), and nested `colorPalette` scopes stop re-accenting them until the patch is repaired. `tests/accent-scope.spec.ts` covers the working path in a browser and the fallback path against fake systems.

Arc's focus rule is ported too: pointer focus draws nothing, keyboard focus draws a 2px outline in the palette's `focusRing` colour. Text fields show focus with their border only.

## Switch radius preset

Arc's registry defaults are 18 / 26 / 34 (item 14). This theme defaults to 14 / 20 / 24 (item 10). In `src/theme/tokens.ts`:

```ts
export const radiusPreset: keyof typeof radiusPresets = "registry" // was "compact"
```

## Switch contrast preset

Arc's own tokens fall below WCAG minimums in three places: `fg.subtle` text (4.1:1 on white), the resting border of text fields, checkboxes and radios (1.7:1), and the unchecked switch track. The default `"aa"` preset lifts them to 4.5:1 text and 3:1 non-text contrast (new semantic `border.control`, used by text fields, checkbox, radio, select triggers and flushed inputs; new `border.trigger` for select triggers). `"arc"` reproduces Arc's exact values. In `src/theme/tokens.ts`:

```ts
export const contrastPreset: keyof typeof contrastPresets = "aa" // or "arc"
```

Dark-mode coloured solids (buttons, badges, checked controls) use dark ink on the mid-tone fill, as Arc does for amber, because white on those fills measures 3.4-4.0:1.

## Control and type scales

Controls of one size share one height across button, input, textarea, select, native select, combobox, number input and pin input: sm 36, md 44, lg 50, xl 56, 2xl 64 (`sizes.control.*`; xs stays 32). Font sizes step 72, 88, 104, 120, 136px from `5xl` to `9xl`, with matching `textStyles`. Sizes above Arc's `lg` and `5xl` are derived, not Arc values.

## Switch accent

Colour is opt-in; the default palette is `gray` (ink). In `src/theme/global-css.ts`:

```ts
export const defaultAccent = "brand" // Arc violet; or teal, blue, cyan, purple, pink, red, orange, yellow, green
```

Or per component / subtree: `<Button colorPalette="brand">`.
