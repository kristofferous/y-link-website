import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata = {
  title: "FAQ | Y-Link",
  description: "Korte svar om AI-drevet DMX og interesselisten.",
};

const items = [
  {
    q: "Hva er automatisert?",
    a: "Lysløp genereres automatisk fra musikkfiler. AI tolker struktur og dynamikk og spiller ut DMX-cues uten manuell programmering.",
  },
  {
    q: "Kan jeg justere selv?",
    a: "Ja. Et komplementerende kontroll-lag (iOS/iPadOS eller desktop-studio) lar deg forme uttrykket mens automatikken holder flyten.",
  },
  {
    q: "Hvordan avmelder jeg e-post?",
    a: "Bruk avmeldingslenken i e-postene. Den peker til /unsubscribe med en unik token, og stopper videre utsendinger for den e-posten.",
  },
  {
    q: "Hvordan blir jeg pilotkunde?",
    a: "Meld interesse på forsiden eller pilotsiden. Vi kontakter utvalgte piloter direkte. Antall plasser er begrenset og ikke fastsatt.",
  },
  {
    q: "Hvilke miljøer prioriteres?",
    a: "Klubber, små scener, utesteder, russebusser og utleieoppsett der musikkdriveren er sentral og bemanningen ofte er lav.",
  },
  {
    q: "Hvilke filer trenger jeg?",
    a: "Du laster opp musikkfiler; AI analyserer tempo, struktur og dynamikk. Detaljer om formater deles med piloter ved oppstart.",
  },
];

export default function FAQPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <Breadcrumbs
          items={[
            { label: "Hjem", href: "/" },
            { label: "FAQ" },
          ]}
        />

        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-800">
            FAQ
          </p>
          <h1 className="text-3xl font-bold text-neutral-950">
            Korte svar om Y-Link
          </h1>
          <p className="max-w-3xl text-base leading-7 text-neutral-800">
            AI-drevet DMX fra musikkfiler, med stabilitet og immersiv opplevelse som standard.
          </p>
        </header>

        <SectionCard className="space-y-4">
          {items.map((item) => (
            <div key={item.q} className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white px-4 py-4 shadow-[0_8px_30px_-24px_rgba(0,0,0,0.3)]">
              <h2 className="text-base font-semibold text-neutral-900">{item.q}</h2>
              <p className="text-sm leading-6 text-neutral-800">{item.a}</p>
            </div>
          ))}
        </SectionCard>
      </div>
    </PageShell>
  );
}
