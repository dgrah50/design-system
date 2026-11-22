import { useEffect, useState } from "react"
import Dashboard from "./Dashboard"
import Pricing from "./Pricing"
import Settings from "./Settings"
import SignIn from "./SignIn"
import { pages, Shell } from "./shared"
import type { PageId } from "./shared"

const read = (): PageId => (pages.find((p) => p === location.hash.slice(1)) ?? "dashboard")

export default function Demos() {
  const [page, setPage] = useState<PageId>(read)
  useEffect(() => { const f = () => setPage(read()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f) }, [])
  const View = { dashboard: Dashboard, pricing: Pricing, signin: SignIn, settings: Settings }[page]
  return <Shell page={page} onNav={(p) => { location.hash = p }}><View /></Shell>
}
