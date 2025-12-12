import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Y-Link vs MaestroDMX",
  description: "Kort sammenligning av Y-Link og MaestroDMX for musikkreaktivt lys.",
  alternates: {
    canonical: "/ai-dmx-controller/vs-maestrodmx",
  },
};

const comparison = [
  {
    label: "Fokus",
    ylink: "AI-planlagte lysløp med guardrails og lav latency.",
    maestro: "Audioanalyse og automasjon for DJ-sett.",
  },
  {
    label: "Operatørkontroll",
    ylink: "Godkjenninger, låser og overstyring uten å miste struktur.",
    maestro: "DJ-orientert workflow med mer manuell styring.",
  },
  {
    label: "Passer best for",
    ylink: "Klubber/små scener med liten bemanning som trenger forutsigbarhet.",
    maestro: "DJ-fokuserte rom som vil trigge lys direkte fra musikken.",
  },
];

export default function VsMaestroPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "AI DMX-kontroller", href: "/ai-dmx-controller" },
            { label: "Y-Link vs MaestroDMX" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Sammenligning</p>
          <h1 className="text-3xl font-bold text-neutral-950">Y-Link vs MaestroDMX</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            To ulike tilnærminger til musikkreaktivt lys. Slik skiller de seg.
          </p>
        </header>

        <SectionCard className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
            <div className="text-sm font-semibold text-neutral-700">Kriterium</div>
            <div className="text-sm font-semibold text-neutral-700">Y-Link</div>
            <div className="text-sm font-semibold text-neutral-700">MaestroDMX</div>
            {comparison.map((row) => (
              <>
                <div key={`${row.label}-label`} className="rounded-2xl bg-neutral-50 p-3 text-sm font-semibold text-neutral-900">
                  {row.label}
                </div>
                <div className="rounded-2xl bg-white p-3 text-sm text-neutral-800 ring-1 ring-neutral-200">{row.ylink}</div>
                <div className="rounded-2xl bg-white p-3 text-sm text-neutral-800 ring-1 ring-neutral-200">{row.maestro}</div>
              </>
            ))}
          </div>
          <p className="text-sm text-neutral-800">
            For detaljer om Y-Link, se hovedsiden for{" "}
            <a href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-900">
              AI DMX-kontrolleren
            </a>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
