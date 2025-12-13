import Link from "next/link"
import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Alternatives to AI DMX Controller",
  description: "Compare Y-Link with other music-reactive and AI-driven lighting solutions.",
  alternates: {
    canonical: "/ai-dmx-controller/alternatives",
  },
}

const options = [
  {
    name: "Y-Link",
    focus: "AI-driven, music-reactive DMX with low latency and operator guardrails.",
    bestFor: "Clubs, small venues, and mobile rigs with minimal staffing.",
  },
  {
    name: "MaestroDMX",
    focus: "Audio analysis and lighting automation for DJ sets.",
    bestFor: "DJ-focused setups where music cues drive the scenes.",
  },
  {
    name: "Lightkey (sound active)",
    focus: "Manual programming + audio triggers on macOS.",
    bestFor: "Operators wanting deep manual control with simple audio response.",
  },
  {
    name: "Onyx + add-on modules",
    focus: "Full console with optional audio triggers.",
    bestFor: "Larger rigs with dedicated LDs who still want to follow music.",
  },
]

const selectionCriteria = [
  "Latency and jitter under full load.",
  "How clear guardrails are for the operator.",
  "How quickly rig data can be patched and validated.",
  "Ability to override live without automation breaking down.",
]

export default function AlternativesPage() {
  return (
    <main>
      <section className="section-spacing">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "AI DMX Controller", href: "/ai-dmx-controller" },
              { label: "Alternatives" },
            ]}
            className="mb-8"
          />
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-label text-muted-foreground">Comparison</p>
            <h1 className="text-heading-lg text-foreground">Alternatives to Y-Link</h1>
            <p className="text-body-lg text-muted-foreground prose-constrained">
              Use this overview to evaluate whether you need AI automation with guardrails, or a more traditional
              console with audio triggers.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {options.map((opt) => (
              <div key={opt.name} className="rounded-lg border border-border/40 bg-card p-6 space-y-3">
                <p className="text-title text-foreground">{opt.name}</p>
                <p className="text-body text-muted-foreground">{opt.focus}</p>
                <p className="text-label text-muted-foreground">{opt.bestFor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing border-t border-border/40">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl rounded-lg border border-border/40 bg-card p-8">
            <h2 className="text-heading mb-6 text-foreground">What to Consider</h2>
            <ul className="space-y-3 text-body text-muted-foreground">
              {selectionCriteria.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              See also{" "}
              <Link
                href="/ai-dmx-controller/vs-maestrodmx"
                className="text-foreground underline underline-offset-4 hover:opacity-80"
              >
                Y-Link vs MaestroDMX
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
