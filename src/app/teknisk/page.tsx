import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata = {
  title: "Teknisk | Y-Link",
  description: "Høynivå om hvordan Y-Link leverer AI-basert DMX-automasjon.",
};

export default function TechnicalPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "Teknisk" },
          ]}
        />

        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Teknisk
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900">
            AI-basert DMX-automasjon, bygget for lav latenstid og forutsigbarhet
          </h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-700">
            Y-Link er en musikkdrevet lysplattform. AI analyserer musikkfiler og genererer
            automatiserte cues som spiller ut med stabil timing. Dedikert kontroller-hardware
            sikrer lave forsinkelser, mens programvaren orkestrerer DMX-strømmen pålitelig.
          </p>
        </header>

        <SectionCard className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Musikk til lys",
              body:
                "AI tolker tempo, struktur og dynamikk i musikkfiler og bygger et lysforløp som følger musikken uten manuell programmering.",
            },
            {
              title: "Kontinuerlig flyt",
              body:
                "Cues genereres og avspilles fortløpende, så riggen holder seg synkron med musikken også når settlisten endrer seg.",
            },
            {
              title: "Stabil kjede",
              body:
                "Dedikert kontroller-hardware og et optimalisert programvarelag holder latensen nede og signalgangen forutsigbar.",
            },
            {
              title: "Komplementerende styring",
              body:
                "iOS/iPadOS-app og desktop-studio kan justere parametere live. Automatikken fortsetter å drive showet, men du kan forme uttrykket.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="space-y-2 rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-neutral-50 px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]"
            >
              <h2 className="text-base font-semibold text-neutral-900">{item.title}</h2>
              <p className="text-sm leading-6 text-neutral-700">{item.body}</p>
            </div>
          ))}
        </SectionCard>

        <SectionCard className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">ALPINE som ryggrad</h2>
          <p className="text-base leading-7 text-neutral-700">
            ALPINE er kommunikasjonssjiktet i Y-Link. Det er fokusert på autentisering og stabil
            realtidsleveranse slik at DMX-signaler når frem presist.
          </p>
          <p className="text-sm text-neutral-600">
            Vil du være tidlig bruker? Meld interesse på{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-neutral-800">
              forsiden
            </Link>
            , så tar vi kontakt.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  );
}
