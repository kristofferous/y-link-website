import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Automatisert DMX for små scener",
  description: "Reduser manuell programmering og få stabile show for små venues med Y-Link.",
  alternates: {
    canonical: "/use-cases/automated-dmx-small-venues",
  },
};

export default function AutomatedSmallVenuesPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Bruksscenarier", href: "/use-cases" },
            { label: "Automatisert DMX" },
          ]}
        />

        <header className="space-y-3">
          <p className="label-text text-sm text-neutral-800">Bruksscenario</p>
          <h1 className="text-3xl font-bold text-neutral-950">Automatisert DMX for små scener</h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            Små venues trenger raske oppsett og forutsigbar drift. Y-Link bygger lysløp fra musikken, holder timing
            stabil og lar operatører justere uten å bryte automasjonen.
          </p>
        </header>

        <SectionCard className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Raskt oppsett",
              body: "Importer spillelister, legg inn riggdata, og kjør preflight på minutter.",
            },
            {
              title: "Stabile show",
              body: "Lav latency og guardrails gjør at uttrykket holder seg, også med enkel bemanning.",
            },
            {
              title: "Overstyring når du vil",
              body: "Operatør kan dempe, endre look eller låse deler uten at automatikken kollapser.",
            },
            {
              title: "Lite vedlikehold",
              body: "Planlegging kontrollerer saturering og sikkerhetsgrenser før showstart.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]"
            >
              <h2 className="text-base font-semibold text-neutral-900">{item.title}</h2>
              <p className="text-sm leading-6 text-neutral-800">{item.body}</p>
            </div>
          ))}
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Slik bruker du Y-Link</h2>
          <ol className="list-decimal space-y-2 pl-5 text-base leading-7 text-neutral-800">
            <li>Send fixture-liste og universer.</li>
            <li>Koble til lydkilde og legg inn energinivåer.</li>
            <li>Valider timing og sikkerhetsgrenser.</li>
            <li>Definer hvor operatør kan overstyre.</li>
            <li>Kjør show med monitorering aktivert.</li>
          </ol>
          <p className="text-sm text-neutral-800">
            Les mer om{" "}
            <Link href="/ai-dmx-controller" className="underline underline-offset-4 hover:text-neutral-900">
              AI DMX-kontrolleren
            </Link>{" "}
            eller{" "}
            <Link href="/pilot" className="underline underline-offset-4 hover:text-neutral-900">
              søk pilot
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
