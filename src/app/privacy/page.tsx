import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Personvern | Y-Link",
  description: "Kort personvernnotat for interessenter av Y-Link.",
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-50 text-neutral-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,#e9edf7_0,#e9edf7_30%,transparent_45%),radial-gradient(circle_at_80%_0%,#eef0ff_0,#eef0ff_25%,transparent_45%),radial-gradient(circle_at_50%_90%,#f1f5fb_0,#f1f5fb_25%,transparent_45%)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Hjem", href: "/" },
              { label: "Personvern" },
            ]}
          />
        </div>
        <div className="rounded-3xl bg-white/85 p-10 shadow-sm ring-1 ring-neutral-200 backdrop-blur">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Personvern
            </p>
            <h1 className="text-3xl font-semibold">Hvordan vi behandler data</h1>
          </header>

          <div className="mt-8 space-y-6 text-base leading-7 text-neutral-700">
            <p>
              Vi samler navn (valgfritt), e-post og hvilken type interesse du har
              for Y-Link. Informasjonen brukes for å dele oppdateringer om Y-Link,
              invitere til piloter eller følge opp mulig forhåndsbestilling.
            </p>
            <p>
              Data lagres sikkert i Supabase. Hver e-post kan inneholde en
              avmeldingslenke som lar deg avslutte abonnementet umiddelbart.
            </p>
            <p>
              Ønsker du å få dataene dine fjernet, kan du kontakte oss så sletter
              vi registreringen din.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
