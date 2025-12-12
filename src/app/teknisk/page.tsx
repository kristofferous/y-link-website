import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";
import { StructuredData } from "@/components/StructuredData";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Teknisk oversikt",
  description:
    "Hvordan Y-Link analyserer lyd, genererer cues, håndterer latency-budsjett og leverer sikkert DMX.",
  alternates: {
    canonical: "/teknisk",
  },
};

const techSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Y-Link teknisk oversikt",
  about: "Lydanalyse, deterministisk DMX-avspilling og latency-budsjett",
  url: absoluteUrl("/teknisk"),
  inLanguage: "nb",
  author: {
    "@type": "Organization",
    name: "Y-Link",
    url: absoluteUrl("/"),
  },
  keywords: [
    "AI DMX-kontroller",
    "musikkreaktivt lys",
    "DMX latency",
    "DMX stabilitet",
  ],
};

export default function TechnicalPage() {
  return (
    <PageShell>
      <StructuredData data={techSchema} />
      <div className="flex flex-col gap-12">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Teknisk" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Teknisk</p>
          <h1 className="text-3xl font-bold text-neutral-950">
            AI-basert DMX med lav latency, forutsigbar avspilling og trygghet
          </h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Y-Link analyserer lyd, genererer cues og leverer DMX innen stramme tidskrav. Runtime er tunet for stabil
            latency og tydelige overstyringer, slik at showet holder seg synkronisert.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Pipeline</h2>
          <ul className="space-y-2 text-base leading-7 text-neutral-800">
            <li>Lydanalyse for tempo, fraser, energi og endringer.</li>
            <li>Planlegger bygger cues, overganger og guardrails per rigg.</li>
            <li>Output valideres mot latency-budsjett og sikkerhetsgrenser.</li>
          </ul>
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Sikkerhet og kontroll</h2>
          <p className="text-base leading-7 text-neutral-800">
            Operatører har låser for intensitet, blackout-regler og mulighet til å overstyre. Guardrails hindrer
            tilfeldige hopp selv når det justeres live.
          </p>
          <p className="text-sm text-neutral-800">
            Les mer om{" "}
            <Link href="/guides/dmx-latency-jitter" className="underline underline-offset-4 hover:text-neutral-900">
              latency og jitter
            </Link>{" "}
            eller{" "}
            <Link href="/pilot" className="underline underline-offset-4 hover:text-neutral-900">
              bli med i pilot
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
